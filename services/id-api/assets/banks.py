"""Bancs d'imatges lliures consultats des del servidor de Commons (MIT).

El navegador mai contacta amb el proveïdor: la cerca, les miniatures i les descàrregues passen per esta API,
de manera que les aplicacions que incrusten el Rebost (Llibres, Blocs, EduCrea…) tenen una sola porta, la
sessió de Commons, i no necessiten CORS ni galetes d'una altra aplicació.

Garanties:
- només es consulten els amfitrions fixos de cada proveïdor; les URL de descàrrega que torna un proveïdor
  se sotmeten a les regles de `safe_get` (https, port 443, només adreces públiques, redireccions revalidades);
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

PROVIDERS = [
    {"id": ARASAAC, "name": "ARASAAC", "license": ARASAAC_LICENSE, "license_url": ARASAAC_LICENSE_URL,
     "commercial_use": False},
    {"id": WIKIMEDIA, "name": "Wikimedia Commons", "license": "Llicències lliures",
     "license_url": WIKIMEDIA_LICENSE_URL, "commercial_use": True},
    {"id": MET, "name": "The Met", "license": MET_LICENSE, "license_url": MET_LICENSE_URL, "commercial_use": True},
    {"id": OPENVERSE, "name": "Openverse", "license": "CC0, CC BY i CC BY-SA",
     "license_url": "https://openverse.org", "commercial_use": True},
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


def check_url(url: str) -> str:
    """Accepta només https:443 cap a adreces públiques."""
    parts = urlsplit(str(url))
    if parts.scheme != "https" or not parts.hostname or parts.username or parts.password or parts.port not in (None, 443):
        raise BankError(502, "bank_unavailable")
    try:
        addresses = {info[4][0] for info in resolve(parts.hostname)}
    except OSError as exc:
        raise BankError(502, "bank_unavailable") from exc
    if not addresses or not all(ipaddress.ip_address(address).is_global for address in addresses):
        raise BankError(502, "bank_unavailable")
    return parts.geturl()


def safe_get(url: str, *, params: dict | None = None, limit: int | None = None, accept: str = "*/*") -> tuple[httpx.Response, bytes]:
    """GET amb redireccions manuals (màx. 3), cada salt revalidat. Torna la resposta i el cos (limitat)."""
    current = url
    try:
        with http_client() as http:
            for _hop in range(4):
                target = check_url(current)
                with http.stream("GET", target, params=params if current == url else None, headers={"Accept": accept}) as response:
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
                  OPENVERSE: self.search_openverse}.get(provider)
        if method is None:
            raise BankError(422, "bank_provider")
        return method(text, language(lang))

    def image(self, provider: str, identifier: str, size: int) -> tuple[bytes, str]:
        """Bytes i tipus de la miniatura (size ≤ 300) o del contingut. Mai accepta una URL del client."""
        fetch = {ARASAAC: self.arasaac_urls, WIKIMEDIA: self.wikimedia_urls, MET: self.met_urls,
                 OPENVERSE: self.openverse_urls}.get(provider)
        if fetch is None:
            raise BankError(422, "bank_provider")
        last = BankError(502, "bank_unavailable")
        for url in fetch(str(identifier), size):
            try:
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
        return {"provider": provider, "license": info["license"], "license_url": info["license_url"],
                "commercial_use": info["commercial_use"], "items": items}

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
