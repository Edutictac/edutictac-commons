"""Bancs d'imatges lliures consultats des del servidor de Commons (MIT).

El navegador mai contacta amb el proveïdor: la cerca, les miniatures i les descàrregues passen per esta API,
de manera que les aplicacions que incrusten el Rebost (Llibres, Blocs, EduCrea…) tenen una sola porta, la
sessió de Commons, i no necessiten CORS ni galetes d'una altra aplicació.

Proveïdors d'imatge: ARASAAC, Wikimedia Commons, The Met, Openverse i Iconify (icones). Proveïdor de so: Openverse àudio
(Freesound i Wikimedia, només CC0, CC BY i CC BY-SA). Les icones es serveixen com a SVG **saneat** (llista blanca
d'etiquetes i atributs, sense scripts ni referències externes): el navegador les rasteritza a PNG en guardar-les, de
manera que Commons no necessita cap llibreria nativa de rasterització.

Garanties:
- només es consulten els amfitrions fixos de cada proveïdor; les URL de descàrrega que torna un proveïdor
  se sotmeten a les regles de `safe_get` (https, port 443, només adreces públiques, redireccions revalidades i
  connexió a la IP ja comprovada, contra el rebinding de DNS);
- només s'accepten PNG, JPEG i WebP, comprovats per signatura i amb límit de mida;
- les licencies no lliures (NC, ND) s'exclouen dels bancs mixtos; ARASAAC (CC BY-NC-SA) s'etiqueta;
- cada principal té un límit de peticions per minut.

Desactivat per defecte: cal `REBOST_BANKS_ENABLED=1` (les instal·lacions de centre sense eixida a Internet
no han de fer-ho).
"""
from __future__ import annotations

import html
import ipaddress
import re
import socket
import time
import unicodedata
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import quote, urlsplit

import httpx

ARASAAC, WIKIMEDIA, MET, OPENVERSE = "arasaac", "wikimedia", "met", "openverse"
TIMEOUT = 15
MAX_RESULTS = 40
MAX_THUMB = 2 * 1024 * 1024
MAX_CONTENT = 4 * 1024 * 1024
CACHE_SECONDS = 1800
CACHE_MAX = 400
RATE_PER_MINUTE = 120
USER_AGENT = "Mozilla/5.0 (compatible; EduTicTac-Commons-Rebost/1.0; +https://edutictac.es)"
LANGUAGES = {"es": "es", "ca": "ca", "va": "ca", "en": "en"}
UUID = re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")
NON_FREE = re.compile(r"(?<![A-Za-z])(?:nc|nd)(?![A-Za-z])|non[- ]?commercial|no derivatives", re.I)

ARASAAC_API = "https://api.arasaac.org/api"
ARASAAC_STATIC = "https://static.arasaac.org/pictograms"
ARASAAC_SOURCE = "https://arasaac.org/pictograms/{identifier}"
ARASAAC_LICENSE = "CC BY-NC-SA 4.0"
ARASAAC_LICENSE_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/"
ARASAAC_CREDIT = "Sergio Palao / ARASAAC / CC BY-NC-SA 4.0"
OPENVERSE_API = "https://api.openverse.org/v1/images/"
OPENVERSE_LICENSES = {"cc0", "by", "by-sa"}
WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php"
WIKIMEDIA_LICENSE_URL = "https://commons.wikimedia.org/wiki/Commons:Licensing"
MET_API = "https://collectionapi.metmuseum.org/public/collection/v1"
MET_LICENSE = "CC0 1.0 (domini públic)"
MET_LICENSE_URL = "https://creativecommons.org/publicdomain/zero/1.0/"

ICONS, OPENVERSE_AUDIO = "icons", "openverse-audio"
ICONIFY_API = "https://api.iconify.design"
MAX_SVG = 300 * 1024
MAX_SOUND = 2 * 1024 * 1024
SOUND_MAX_SECONDS = 120
SOUND_API = "https://api.openverse.org/v1/audio/"
SOUND_SOURCES = "freesound,wikimedia_audio"
SOUND_FILETYPES = {"mp3", "ogg", "oga", "wav"}
SOUND_HOSTS = ("freesound.org", "wikimedia.org")
TERMS_FILE = Path(__file__).parent / "data" / "icon_terms.txt"
INK = "#1f2937"
ICON_ID = re.compile(r"^(?P<prefix>[a-z0-9-]+):(?P<name>[a-z0-9][a-z0-9-]*)$")
# prefix -> (nom, autor, llicència, URL de la llicència)
ICON_SETS = {
    "tabler": ("Tabler Icons", "Paweł Kuna", "MIT", "https://opensource.org/license/mit"),
    "lucide": ("Lucide", "Lucide Contributors", "ISC", "https://opensource.org/license/isc-license-txt"),
    "fluent-emoji-flat": ("Fluent Emoji", "Microsoft", "MIT", "https://opensource.org/license/mit"),
    "openmoji": ("OpenMoji", "OpenMoji – the open-source emoji and icon project", "CC BY-SA 4.0",
                 "https://creativecommons.org/licenses/by-sa/4.0/"),
}
SVG_NS = "http://www.w3.org/2000/svg"
SVG_TAGS = {"svg", "g", "path", "circle", "ellipse", "rect", "line", "polyline", "polygon", "defs", "clipPath", "mask",
            "linearGradient", "radialGradient", "stop", "title", "desc"}
SVG_ATTRS = {"xmlns", "viewBox", "width", "height", "d", "fill", "stroke", "stroke-width", "stroke-linecap",
             "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "fill-opacity", "fill-rule", "clip-rule", "opacity",
             "transform", "cx", "cy", "r", "rx", "ry", "x", "y", "x1", "y1", "x2", "y2", "points", "id", "clip-path", "mask",
             "offset", "stop-color", "stop-opacity", "gradientUnits", "gradientTransform", "clipPathUnits", "maskUnits",
             "preserveAspectRatio", "color", "role", "aria-hidden", "focusable", "vector-effect"}

PROVIDERS = [
    {"id": ARASAAC, "name": "ARASAAC", "license": ARASAAC_LICENSE, "license_url": ARASAAC_LICENSE_URL,
     "commercial_use": False},
    {"id": WIKIMEDIA, "name": "Wikimedia Commons", "license": "Llicències lliures",
     "license_url": WIKIMEDIA_LICENSE_URL, "commercial_use": True},
    {"id": MET, "name": "The Met", "license": MET_LICENSE, "license_url": MET_LICENSE_URL, "commercial_use": True},
    {"id": OPENVERSE, "name": "Openverse", "license": "CC0, CC BY i CC BY-SA",
     "license_url": "https://openverse.org", "commercial_use": True},
    {"id": ICONS, "name": "Icones i emojis", "license": "MIT, ISC i CC BY-SA 4.0 (OpenMoji)",
     "license_url": "https://iconify.design/docs/icons/", "commercial_use": True},
    {"id": OPENVERSE_AUDIO, "name": "Openverse (so)", "license": "CC0, CC BY i CC BY-SA",
     "license_url": "https://openverse.org", "commercial_use": True, "kind": "sound"},
]


class BankError(Exception):
    """Error de banc amb codi estable (l'interfície el tradueix) i estat HTTP."""

    def __init__(self, status: int, code: str):
        super().__init__(code)
        self.status, self.code = status, code


# Substituïbles en les proves: no hi ha xarxa ni DNS reals.
def http_client() -> httpx.Client:
    return httpx.Client(timeout=TIMEOUT, follow_redirects=False, headers={"User-Agent": USER_AGENT})


def resolve(host: str):
    return socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)


def check_url(url: str) -> tuple[str, str]:
    """Accepta només https:443 cap a adreces públiques. Torna (URL, IP fixada): la mateixa resolució es fa servir per
    connectar, de manera que un DNS que canvie de resposta entre la comprovació i la connexió (rebinding) no hi pot fer res."""
    parts = urlsplit(str(url))
    if parts.scheme != "https" or not parts.hostname or parts.username or parts.password or parts.port not in (None, 443):
        raise BankError(502, "bank_unavailable")
    try:
        addresses = [info[4][0] for info in resolve(parts.hostname)]
    except OSError as exc:
        raise BankError(502, "bank_unavailable") from exc
    try:
        public = bool(addresses) and all(ipaddress.ip_address(address).is_global for address in addresses)
    except ValueError as exc:
        raise BankError(502, "bank_unavailable") from exc
    if not public:
        raise BankError(502, "bank_unavailable")
    return parts.geturl(), addresses[0]


def safe_get(url: str, *, params: dict | None = None, limit: int | None = None, accept: str = "*/*", allow=None) -> tuple[httpx.Response, bytes]:
    """GET amb redireccions manuals (màx. 3), cada salt revalidat i connectat a la IP ja comprovada.
    Torna la resposta i el cos (limitat)."""
    current = url
    try:
        with http_client() as http:
            for _hop in range(4):
                target, address = check_url(current)
                if allow is not None and not allow(target):
                    raise BankError(502, "bank_unavailable")
                host = urlsplit(target).hostname
                # Connexió a la IP validada; Host i SNI porten el nom, així que el certificat es verifica contra el nom.
                pinned = httpx.URL(target).copy_with(host=address)
                with http.stream("GET", pinned, params=params if current == url else None, headers={"Accept": accept, "Host": host},
                                 extensions={"sni_hostname": host}) as response:
                    if response.status_code in (301, 302, 303, 307, 308) and response.headers.get("location"):
                        current = str(httpx.URL(target).join(response.headers["location"]))
                        continue
                    if response.status_code == 404:
                        raise BankError(404, "bank_not_found")
                    if response.status_code >= 400:
                        raise BankError(502, "bank_unavailable")
                    chunks, total = [], 0
                    for chunk in response.iter_bytes():
                        total += len(chunk)
                        if total > (limit if limit is not None else MAX_CONTENT):
                            raise BankError(413, "bank_too_large")
                        chunks.append(chunk)
                    return response, b"".join(chunks)
            raise BankError(502, "bank_unavailable")
    except httpx.TimeoutException as exc:
        raise BankError(504, "bank_timeout") from exc
    except httpx.RequestError as exc:
        raise BankError(502, "bank_unavailable") from exc


def get_json(url: str, params: dict | None = None):
    _, body = safe_get(url, params=params, limit=2 * 1024 * 1024, accept="application/json")
    try:
        import json
        return json.loads(body)
    except ValueError as exc:
        raise BankError(502, "bank_unavailable") from exc


def image_type(data: bytes) -> str:
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    raise BankError(502, "bank_invalid_image")


def plain(value) -> str:
    text = html.unescape(re.sub(r"<[^>]+>", " ", str(value or "")))
    return re.sub(r"\s+", " ", text).strip()


def language(value: str) -> str:
    return LANGUAGES.get((value or "").strip().lower(), "es")


def clean_query(query: str) -> str:
    text = (query or "").strip()
    if not text or len(text) > 80:
        raise BankError(422, "bank_query")
    return text


def sanitize_svg(data: bytes) -> bytes:
    """SVG de llista blanca: només formes i degradats, sense scripts, estils, enllaços ni referències externes."""
    if len(data) > MAX_SVG or b"<!" in data.replace(b"<!--", b"")[:4096] or b"<?xml-stylesheet" in data:
        raise BankError(502, "bank_invalid_image")
    try:
        root = ET.fromstring(data)
    except ET.ParseError as exc:
        raise BankError(502, "bank_invalid_image") from exc

    def clean(node, top=False):
        tag = node.tag.split("}", 1)[-1] if isinstance(node.tag, str) else ""
        if tag not in SVG_TAGS or (node.tag.startswith("{") and not node.tag.startswith("{" + SVG_NS + "}")):
            raise BankError(502, "bank_invalid_image")
        if top and tag != "svg":
            raise BankError(502, "bank_invalid_image")
        for name, value in list(node.attrib.items()):
            local = name.split("}", 1)[-1]
            lowered = value.lower()
            if (name.startswith("{") and local not in ("space",)) or local not in SVG_ATTRS or local.lower().startswith("on"):
                raise BankError(502, "bank_invalid_image")
            if "javascript:" in lowered or "data:" in lowered or ("url(" in lowered and not re.fullmatch(r"url\(#[\w.-]+\)", value.strip())):
                raise BankError(502, "bank_invalid_image")
        if node.text and node.text.strip() and tag not in ("title", "desc"):
            raise BankError(502, "bank_invalid_image")
        for child in list(node):
            clean(child)

    clean(root, top=True)
    ET.register_namespace("", SVG_NS)
    return ET.tostring(root, encoding="utf-8", xml_declaration=False)


def sniff_sound(data: bytes) -> str:
    if data[:4] == b"OggS":
        return "audio/ogg"
    if data[:3] == b"ID3" or (len(data) > 1 and data[0] == 0xFF and data[1] & 0xE0 == 0xE0):
        return "audio/mpeg"
    if data[:4] == b"RIFF" and data[8:12] == b"WAVE":
        return "audio/wav"
    raise BankError(502, "bank_invalid_audio")


def fold(text: str) -> str:
    base = unicodedata.normalize("NFKD", (text or "").strip().lower())
    return re.sub(r"\s+", " ", "".join(c for c in base if not unicodedata.combining(c)))


_terms: dict[str, list[str]] | None = None


def icon_terms() -> dict[str, list[str]]:
    """Paraules en castellà i valencià (sense accents) -> termes en anglès que Iconify entén."""
    global _terms
    if _terms is None:
        table: dict[str, list[str]] = {}
        for line in TERMS_FILE.read_text(encoding="utf-8").splitlines():
            parts = line.split("|")
            if not line.strip() or line.startswith("#") or len(parts) != 3:
                continue
            english = [value.strip() for value in parts[2].split(",") if value.strip()]
            for word in parts[:2]:
                key = fold(word)
                if key:
                    table.setdefault(key, [])
                    table[key] += [value for value in english if value not in table[key]]
        _terms = table
    return _terms


def english_terms(query: str) -> list[str]:
    text = fold(query)
    table = icon_terms()
    if text in table:
        return table[text][:3]
    found: list[str] = []
    for word in text.split(" "):
        found += [value for value in table.get(word, []) if value not in found]
    return (found or [text])[:3]


def sound_host_ok(url) -> bool:
    parts = urlsplit(str(url or ""))
    host = (parts.hostname or "").lower()
    return parts.scheme == "https" and any(host == name or host.endswith("." + name) for name in SOUND_HOSTS)


class Banks:
    def __init__(self):
        self.cache: dict[tuple[str, str], tuple[float, dict]] = {}
        self.hits: dict[str, list[float]] = {}

    # --- límits i memòria cau ---
    def rate(self, owner: str) -> None:
        now = time.monotonic()
        recent = [stamp for stamp in self.hits.get(owner, []) if now - stamp < 60]
        if len(recent) >= RATE_PER_MINUTE:
            raise BankError(429, "bank_rate_limited")
        recent.append(now)
        self.hits[owner] = recent
        if len(self.hits) > 5000:
            self.hits = {key: value for key, value in self.hits.items() if value and now - value[-1] < 60}

    def remember(self, provider: str, key: str, row: dict) -> None:
        now = time.monotonic()
        for name in [name for name, (when, _) in self.cache.items() if now - when > CACHE_SECONDS]:
            self.cache.pop(name, None)
        if len(self.cache) >= CACHE_MAX:
            self.cache.pop(min(self.cache, key=lambda name: self.cache[name][0]), None)
        self.cache[(provider, key)] = (now, row)

    def recall(self, provider: str, key: str) -> dict | None:
        cached = self.cache.get((provider, key))
        if cached is None or time.monotonic() - cached[0] > CACHE_SECONDS:
            self.cache.pop((provider, key), None)
            return None
        return cached[1]

    # --- API pública ---
    def providers(self) -> list[dict]:
        return PROVIDERS

    def search(self, provider: str, query: str, lang: str = "es") -> dict:
        text = clean_query(query)
        method = {ARASAAC: self.search_arasaac, WIKIMEDIA: self.search_wikimedia, MET: self.search_met,
                  OPENVERSE: self.search_openverse, ICONS: self.search_icons,
                  OPENVERSE_AUDIO: self.search_sounds}.get(provider)
        if method is None:
            raise BankError(422, "bank_provider")
        return method(text, language(lang))

    def image(self, provider: str, identifier: str, size: int) -> tuple[bytes, str]:
        """Bytes i tipus de la miniatura (size ≤ 300) o del contingut. Mai accepta una URL del client."""
        if provider == OPENVERSE_AUDIO:
            if size <= 300:
                raise BankError(404, "bank_not_found")  # els sons no tenen miniatura
            return self.sound(str(identifier))
        fetch = {ARASAAC: self.arasaac_urls, WIKIMEDIA: self.wikimedia_urls, MET: self.met_urls,
                 OPENVERSE: self.openverse_urls, ICONS: self.icon_urls}.get(provider)
        if fetch is None:
            raise BankError(422, "bank_provider")
        last = BankError(502, "bank_unavailable")
        for url in fetch(str(identifier), size):
            try:
                if provider == ICONS:
                    _, data = safe_get(url, limit=MAX_SVG)
                    return sanitize_svg(data), "image/svg+xml"
                _, data = safe_get(url, limit=MAX_THUMB if size <= 300 else MAX_CONTENT)
                return data, image_type(data)
            except BankError as exc:
                if exc.status not in (404, 413, 502, 504):
                    raise
                last = exc
        raise last

    # --- helpers d'ítem ---
    @staticmethod
    def item(provider, identifier, title, keywords, license, license_url, source_url, credit, media_type):
        base = f"/api/assets/v1/banks/{provider}/{identifier}"
        return {"provider": provider, "id": str(identifier), "title": str(title)[:200], "keywords": list(keywords)[:8],
                "thumbnail_url": base + "/thumbnail", "content_url": base + "/content", "license": license,
                "license_url": license_url, "source_url": source_url, "credit": str(credit)[:300],
                "media_type": media_type}

    @staticmethod
    def envelope(provider: str, items: list[dict]) -> dict:
        info = next(entry for entry in PROVIDERS if entry["id"] == provider)
        return {"provider": provider, "kind": info.get("kind", "image"), "license": info["license"],
                "license_url": info["license_url"], "commercial_use": info["commercial_use"], "items": items}

    # --- ARASAAC ---
    def search_arasaac(self, text: str, lang: str) -> dict:
        try:
            rows = get_json(f"{ARASAAC_API}/pictograms/{lang}/search/{quote(text, safe='')}")
        except BankError as exc:
            if exc.status == 404:
                return self.envelope(ARASAAC, [])
            raise
        if not isinstance(rows, list):
            raise BankError(502, "bank_unavailable")
        items = []
        for row in rows[:MAX_RESULTS]:
            try:
                identifier = int(row["_id"])
            except (KeyError, TypeError, ValueError):
                continue
            words = []
            for keyword in row.get("keywords") or []:
                word = str(keyword.get("keyword", "")).strip() if isinstance(keyword, dict) else ""
                if word and word not in words:
                    words.append(word)
            source = ARASAAC_SOURCE.format(identifier=identifier)
            items.append(self.item(ARASAAC, identifier, words[0] if words else text, words, ARASAAC_LICENSE,
                                   ARASAAC_LICENSE_URL, source, f"{ARASAAC_CREDIT} · {source}", "image/png"))
        return self.envelope(ARASAAC, items)

    @staticmethod
    def arasaac_urls(identifier: str, size: int):
        if not identifier.isdigit() or not 0 < int(identifier) <= 10_000_000:
            raise BankError(422, "bank_invalid_id")
        yield f"{ARASAAC_STATIC}/{int(identifier)}/{int(identifier)}_{300 if size <= 300 else 500}.png"

    # --- Wikimedia Commons ---
    def wikimedia_info(self, params: dict) -> dict:
        data = get_json(WIKIMEDIA_API, params)
        return data if isinstance(data, dict) else {}

    @staticmethod
    def wiki_meta(info: dict, name: str) -> str:
        value = (info.get("extmetadata") or {}).get(name)
        return plain(value.get("value")) if isinstance(value, dict) else plain(value)

    def search_wikimedia(self, text: str, lang: str) -> dict:
        data = self.wikimedia_info({
            "action": "query", "format": "json", "generator": "search", "gsrsearch": f"{text} filetype:bitmap",
            "gsrnamespace": 6, "gsrlimit": 20, "prop": "imageinfo", "iiprop": "url|mime|size|extmetadata", "iiurlwidth": 300})
        items = []
        for page in ((data.get("query") or {}).get("pages") or {}).values():
            info = (page.get("imageinfo") or [{}])[0] if isinstance(page, dict) else {}
            mime = str(info.get("mime") or "").lower()
            pageid = page.get("pageid") if isinstance(page, dict) else None
            if not pageid or mime not in ("image/jpeg", "image/png") or not (info.get("url") or info.get("thumburl")):
                continue
            licence = self.wiki_meta(info, "LicenseShortName") or "Llicència lliure"
            if NON_FREE.search(licence):
                continue
            title = plain(page.get("title") or text).removeprefix("File:") or text
            self.remember(WIKIMEDIA, str(pageid), info)
            artist = self.wiki_meta(info, "Artist") or "Wikimedia Commons"
            items.append(self.item(
                WIKIMEDIA, pageid, title, [title[:80]], licence, self.wiki_meta(info, "LicenseUrl") or WIKIMEDIA_LICENSE_URL,
                info.get("descriptionurl") or "https://commons.wikimedia.org/", f"{artist} · {licence} · Wikimedia Commons", mime))
        return self.envelope(WIKIMEDIA, items)

    def wikimedia_urls(self, identifier: str, size: int):
        if not identifier.isdigit():
            raise BankError(422, "bank_invalid_id")
        info = self.recall(WIKIMEDIA, identifier)
        if info is None:
            data = self.wikimedia_info({"action": "query", "format": "json", "pageids": int(identifier), "prop": "imageinfo",
                                        "iiprop": "url|mime|size|extmetadata", "iiurlwidth": 500})
            pages = (data.get("query") or {}).get("pages") or {}
            info = ((pages.get(identifier) or next(iter(pages.values()), {})).get("imageinfo") or [{}])[0]
            if not info:
                raise BankError(404, "bank_not_found")
            if NON_FREE.search(self.wiki_meta(info, "LicenseShortName")):
                raise BankError(404, "bank_not_found")
            self.remember(WIKIMEDIA, identifier, info)
        return [info.get("thumburl")] if size <= 300 else [info.get("url"), info.get("thumburl")]

    # --- The Met ---
    def met_object(self, identifier: str) -> dict:
        if not identifier.isdigit():
            raise BankError(422, "bank_invalid_id")
        cached = self.recall(MET, identifier)
        if cached is not None:
            return cached
        obj = get_json(f"{MET_API}/objects/{int(identifier)}")
        if not isinstance(obj, dict) or not obj.get("objectID") or not obj.get("isPublicDomain"):
            raise BankError(404, "bank_not_found")
        self.remember(MET, identifier, obj)
        return obj

    def search_met(self, text: str, lang: str) -> dict:
        data = get_json(f"{MET_API}/search", {"q": text, "hasImages": "true", "isPublicDomain": "true"})
        items = []
        for identifier in ((data.get("objectIDs") or []) if isinstance(data, dict) else [])[:12]:
            try:
                obj = self.met_object(str(identifier))
            except BankError:
                continue
            if not (obj.get("primaryImage") or obj.get("primaryImageSmall")):
                continue
            artist = plain(obj.get("artistDisplayName")) or "The Metropolitan Museum of Art"
            date = plain(obj.get("objectDate"))
            keywords = [value for value in (date, plain(obj.get("medium")), plain(obj.get("department"))) if value]
            items.append(self.item(MET, identifier, plain(obj.get("title")) or "Obra del Metropolitan", keywords, MET_LICENSE,
                                   MET_LICENSE_URL, obj.get("objectURL") or "https://www.metmuseum.org/art/collection",
                                   f"{artist} · {MET_LICENSE} · The Met" + (f" · {date}" if date else ""), "image/jpeg"))
            if len(items) >= 8:
                break
        return self.envelope(MET, items)

    def met_urls(self, identifier: str, size: int):
        obj = self.met_object(identifier)
        return [obj.get("primaryImageSmall")] if size <= 300 else [obj.get("primaryImage"), obj.get("primaryImageSmall")]

    # --- Openverse ---
    @staticmethod
    def ov_license(row: dict) -> str:
        code, version = str(row.get("license") or "").strip().lower(), str(row.get("license_version") or "").strip()
        return "CC0 1.0" if code == "cc0" else (f"CC {code.upper()} {version}".strip() if code else "Llicència Creative Commons")

    def search_openverse(self, text: str, lang: str) -> dict:
        params = {"q": text, "page_size": 20, "license_type": "commercial", "mature": "false", "language": lang}
        try:
            data = get_json(OPENVERSE_API, params)
        except BankError:
            params.pop("language")  # algunes fonts rebutgen el filtre d'idioma
            data = get_json(OPENVERSE_API, params)
        items = []
        for row in (data.get("results") or []) if isinstance(data, dict) else []:
            identifier = str(row.get("id") or "") if isinstance(row, dict) else ""
            if not UUID.match(identifier) or str(row.get("license") or "").lower() not in OPENVERSE_LICENSES:
                continue
            self.remember(OPENVERSE, identifier, row)
            licence = self.ov_license(row)
            credit = plain(row.get("attribution")) or " · ".join(part for part in (
                plain(row.get("creator")), licence, plain(row.get("source"))) if part)
            tags = []
            for tag in row.get("tags") or []:
                name = plain(tag.get("name")) if isinstance(tag, dict) else ""
                if name and name not in tags:
                    tags.append(name)
            items.append(self.item(OPENVERSE, identifier, plain(row.get("title")) or text, tags, licence,
                                   str(row.get("license_url") or "https://openverse.org"),
                                   str(row.get("foreign_landing_url") or row.get("detail_url") or "https://openverse.org"),
                                   credit, "image/jpeg"))
        return self.envelope(OPENVERSE, items)

    def openverse_urls(self, identifier: str, size: int):
        if not UUID.match(identifier):
            raise BankError(422, "bank_invalid_id")
        row = self.recall(OPENVERSE, identifier)
        if row is None:
            row = get_json(f"{OPENVERSE_API}{identifier}/")
            if not isinstance(row, dict) or str(row.get("license") or "").lower() not in OPENVERSE_LICENSES:
                raise BankError(404, "bank_not_found")
            self.remember(OPENVERSE, identifier, row)
        return [row.get("thumbnail")] if size <= 300 else [row.get("url"), row.get("thumbnail")]

    # --- Icones (Iconify) ---
    def search_icons(self, text: str, lang: str) -> dict:
        words = english_terms(text)
        per_set: dict[str, list[str]] = {prefix: [] for prefix in ICON_SETS}
        for word in words:
            data = get_json(f"{ICONIFY_API}/search", {"query": word, "limit": 32, "prefixes": ",".join(ICON_SETS)})
            for identifier in (data.get("icons") or []) if isinstance(data, dict) else []:
                match = ICON_ID.match(str(identifier))
                if match and match.group("prefix") in ICON_SETS and identifier not in per_set[match.group("prefix")]:
                    per_set[match.group("prefix")].append(identifier)
        merged, seen = [], set()
        groups = list(per_set.values())
        for position in range(max((len(group) for group in groups), default=0)):
            for group in groups:
                if position < len(group) and group[position] not in seen:
                    seen.add(group[position])
                    merged.append(group[position])
        items = []
        for identifier in merged[:24]:
            prefix, name = ICON_ID.match(identifier).group("prefix", "name")
            label, author, licence, licence_url = ICON_SETS[prefix]
            items.append(self.item(ICONS, identifier, name.replace("-", " ").capitalize(), words, licence, licence_url,
                                   f"https://icon-sets.iconify.design/{prefix}/{name}/",
                                   f"{label} · {author} · {licence} · Iconify", "image/svg+xml"))
        return self.envelope(ICONS, items)

    @staticmethod
    def icon_urls(identifier: str, size: int):
        match = ICON_ID.match(identifier)
        if not match or match.group("prefix") not in ICON_SETS:
            raise BankError(422, "bank_invalid_id")
        yield f"{ICONIFY_API}/{match.group('prefix')}/{match.group('name')}.svg?height=512&color=%231f2937"

    # --- So (Openverse àudio) ---
    @staticmethod
    def sound_usable(row, max_ms=SOUND_MAX_SECONDS * 1000) -> bool:
        if not isinstance(row, dict) or str(row.get("category") or "") == "pronunciation":
            return False
        size, duration = row.get("filesize"), row.get("duration")
        return (bool(UUID.match(str(row.get("id") or ""))) and str(row.get("license") or "").lower() in OPENVERSE_LICENSES
                and str(row.get("source") or "") in SOUND_SOURCES.split(",")
                and str(row.get("filetype") or "").lower() in SOUND_FILETYPES and sound_host_ok(row.get("url"))
                and (not size or int(size) <= MAX_SOUND) and (not duration or int(duration) <= max_ms))

    def search_sounds(self, text: str, lang: str) -> dict:
        data = get_json(SOUND_API, {"q": text, "page_size": 20, "license": "cc0,by,by-sa", "source": SOUND_SOURCES,
                                    "mature": "false"})
        items = []
        for row in (data.get("results") or []) if isinstance(data, dict) else []:
            if not self.sound_usable(row):
                continue
            identifier = str(row["id"])
            self.remember(OPENVERSE_AUDIO, identifier, row)
            licence = self.ov_license(row)
            credit = plain(row.get("attribution")) or " · ".join(part for part in (
                plain(row.get("creator")), licence, plain(row.get("source"))) if part)
            tags = [plain(tag.get("name")) for tag in (row.get("tags") or []) if isinstance(tag, dict) and plain(tag.get("name"))]
            item = self.item(OPENVERSE_AUDIO, identifier, plain(row.get("title")) or "So", tags, licence,
                             str(row.get("license_url") or "https://openverse.org"),
                             str(row.get("foreign_landing_url") or row.get("detail_url") or "https://openverse.org"),
                             credit, "audio/mpeg")
            item.update({"kind": "sound", "duration_ms": int(row.get("duration") or 0), "thumbnail_url": ""})
            items.append(item)
        return self.envelope(OPENVERSE_AUDIO, items)

    def sound(self, identifier: str) -> tuple[bytes, str]:
        if not UUID.match(identifier):
            raise BankError(422, "bank_invalid_id")
        row = self.recall(OPENVERSE_AUDIO, identifier)
        if row is None:
            row = get_json(f"{SOUND_API}{identifier}/")
            if not self.sound_usable(row, 10 ** 9):
                raise BankError(404, "bank_not_found")
            self.remember(OPENVERSE_AUDIO, identifier, row)
        _, data = safe_get(str(row["url"]), limit=MAX_SOUND, allow=sound_host_ok)
        return data, sniff_sound(data)
