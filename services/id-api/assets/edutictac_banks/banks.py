"""Bancos de recursos libres (MIT): ARASAAC, Wikimedia Commons, The Met, Openverse (imágenes y sonidos) e Iconify (iconos).

Los motores buscan y descargan **desde el servidor**; el navegador nunca contacta con el proveedor. Los resultados
llevan URLs bajo el prefijo que cada aplicación configure (`image_prefix`, `sound_prefix`)."""
from __future__ import annotations

import re
import time
from pathlib import Path
from urllib.parse import quote, urlsplit

from .errors import BankError
from .net import MAX_CONTENT, get_json, safe_get
from .sniff import image_type, sniff_sound
from .svg import MAX_SVG, sanitize_svg
from .text import NON_FREE, UUID, clean_query, fold, language, plain

ARASAAC, WIKIMEDIA, MET, OPENVERSE = "arasaac", "wikimedia", "met", "openverse"
MAX_RESULTS = 40
MAX_THUMB = 2 * 1024 * 1024
CACHE_SECONDS = 1800
CACHE_MAX = 400
RATE_PER_MINUTE = 120

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
MET_SEARCH_API = "https://collectionapi.metmuseum.org/public/collection/v1.1/search"
MET_LICENSE = "CC0 1.0 (dominio público)"
MET_LICENSE_URL = "https://creativecommons.org/publicdomain/zero/1.0/"

ICONS, OPENVERSE_AUDIO = "icons", "openverse-audio"
ICONIFY_API = "https://api.iconify.design"
MAX_SOUND = 2 * 1024 * 1024
SOUND_MAX_SECONDS = 120
SOUND_API = "https://api.openverse.org/v1/audio/"
SOUND_SOURCES = "freesound,wikimedia_audio"
SOUND_FILETYPES = {"mp3", "ogg", "oga", "wav"}
SOUND_HOSTS = ("freesound.org", "wikimedia.org")
TERMS_FILE = Path(__file__).parent / "data" / "icon_terms.txt"
DEFAULT_SOUND_SECONDS = 30
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
PROVIDERS = [
    {"id": ARASAAC, "name": "ARASAAC", "license": ARASAAC_LICENSE, "license_url": ARASAAC_LICENSE_URL,
     "commercial_use": False},
    {"id": WIKIMEDIA, "name": "Wikimedia Commons", "license": "Licencias libres",
     "license_url": WIKIMEDIA_LICENSE_URL, "commercial_use": True},
    {"id": MET, "name": "The Met", "license": MET_LICENSE, "license_url": MET_LICENSE_URL, "commercial_use": True},
    {"id": OPENVERSE, "name": "Openverse", "license": "CC0, CC BY y CC BY-SA",
     "license_url": "https://openverse.org", "commercial_use": True},
    {"id": ICONS, "name": "Iconos y emojis", "license": "MIT, ISC y CC BY-SA 4.0 (OpenMoji)",
     "license_url": "https://iconify.design/docs/icons/", "commercial_use": True},
    {"id": OPENVERSE_AUDIO, "name": "Openverse (sonidos)", "license": "CC0, CC BY y CC BY-SA",
     "license_url": "https://openverse.org", "commercial_use": True, "kind": "sound"},
]


_terms: dict[str, list[str]] | None = None


def icon_terms() -> dict[str, list[str]]:
    """Palabras en castellano y valenciano (sin tildes) -> términos en inglés que Iconify entiende."""
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
    """`image_prefix`/`sound_prefix`: base de las URLs de miniatura y contenido (los sonidos usan `sound_suffix` en
    lugar de `content`). `max_sound_bytes`: tope de descarga de sonidos. `icon_media_type`: tipo que anuncian los iconos
    (`image/svg+xml`, o `image/png` si la aplicación los rasteriza ella)."""

    def __init__(self, image_prefix: str = "/api/assets/v1/banks", sound_prefix: str | None = None, sound_suffix: str = "content",
                 max_sound_bytes: int = MAX_SOUND, icon_media_type: str = "image/svg+xml"):
        self.image_prefix = image_prefix.rstrip("/")
        self.sound_prefix = (sound_prefix or image_prefix).rstrip("/")
        self.sound_suffix = sound_suffix
        self.max_sound_bytes = max_sound_bytes
        self.icon_media_type = icon_media_type
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

    def search(self, provider: str, query: str, lang: str = "es", max_seconds: int = DEFAULT_SOUND_SECONDS) -> dict:
        text = clean_query(query)
        if provider == OPENVERSE_AUDIO:
            return self.search_sounds(text, language(lang), max_seconds)
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
    def item(self, provider, identifier, title, keywords, license, license_url, source_url, credit, media_type):
        base = f"{self.image_prefix}/{provider}/{identifier}"
        return {"provider": provider, "id": identifier, "title": str(title)[:200], "keywords": list(keywords)[:8],
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
            licence = self.wiki_meta(info, "LicenseShortName") or "Licencia libre"
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
        data = get_json(MET_SEARCH_API, {"q": text, "hasImages": "true", "limit": 12})
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
        return "CC0 1.0" if code == "cc0" else (f"CC {code.upper()} {version}".strip() if code else "Licencia Creative Commons")

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
        row = self.openverse_row(identifier)
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
                                   f"{label} · {author} · {licence} · Iconify", self.icon_media_type))
        return self.envelope(ICONS, items)

    @staticmethod
    def icon_urls(identifier: str, size: int):
        match = ICON_ID.match(identifier)
        if not match or match.group("prefix") not in ICON_SETS:
            raise BankError(422, "bank_invalid_id")
        yield f"{ICONIFY_API}/{match.group('prefix')}/{match.group('name')}.svg?height=512&color=%231f2937"

    # --- So (Openverse àudio) ---
    def sound_usable(self, row, max_ms=SOUND_MAX_SECONDS * 1000) -> bool:
        max_bytes = self.max_sound_bytes
        if not isinstance(row, dict) or str(row.get("category") or "") == "pronunciation":
            return False
        size, duration = row.get("filesize"), row.get("duration")
        return (bool(UUID.match(str(row.get("id") or ""))) and str(row.get("license") or "").lower() in OPENVERSE_LICENSES
                and str(row.get("source") or "") in SOUND_SOURCES.split(",")
                and str(row.get("filetype") or "").lower() in SOUND_FILETYPES and sound_host_ok(row.get("url"))
                and (not size or int(size) <= max_bytes) and (not duration or int(duration) <= max_ms))

    def search_sounds(self, text: str, lang: str, max_seconds: int = DEFAULT_SOUND_SECONDS) -> dict:
        max_ms = max(1, min(int(max_seconds), SOUND_MAX_SECONDS)) * 1000
        data = get_json(SOUND_API, {"q": text, "page_size": 20, "license": ",".join(sorted(OPENVERSE_LICENSES)), "source": SOUND_SOURCES,
                                    "mature": "false"})
        items = []
        for row in (data.get("results") or []) if isinstance(data, dict) else []:
            if not self.sound_usable(row, max_ms):
                continue
            identifier = str(row["id"])
            self.remember(OPENVERSE_AUDIO, identifier, row)
            licence = self.ov_license(row)
            credit = plain(row.get("attribution")) or " · ".join(part for part in (
                plain(row.get("creator")), licence, plain(row.get("source"))) if part)
            tags = [plain(tag.get("name")) for tag in (row.get("tags") or []) if isinstance(tag, dict) and plain(tag.get("name"))]
            item = self.item(OPENVERSE_AUDIO, identifier, plain(row.get("title")) or "Sonido", tags, licence,
                             str(row.get("license_url") or "https://openverse.org"),
                             str(row.get("foreign_landing_url") or row.get("detail_url") or "https://openverse.org"),
                             credit, "audio/mpeg")
            base = f"{self.sound_prefix}/{OPENVERSE_AUDIO}/{identifier}/{self.sound_suffix}"
            item.update({"kind": "sound", "duration_ms": int(row.get("duration") or 0), "thumbnail_url": "",
                         "content_url": base, "preview_url": base, "source": str(row.get("source") or "")})
            items.append(item)
        return self.envelope(OPENVERSE_AUDIO, items)

    def sound(self, identifier: str) -> tuple[bytes, str]:
        row = self.openverse_row(identifier, audio=True)
        _, data = safe_get(str(row["url"]), limit=self.max_sound_bytes, allow=sound_host_ok)
        return data, sniff_sound(data)

    # --- Importación (descarga completa + crédito), para aplicaciones que guardan el recurso en el servidor ---
    def credit_of(self, provider: str, identifier) -> str:
        """Crédito de un recurso. Las búsquedas dejan los metadatos en caché; si faltan, se piden al proveedor."""
        identifier = str(identifier)
        if provider == ARASAAC:
            if not identifier.isdigit() or not 0 < int(identifier) <= 10_000_000:
                raise BankError(422, "bank_invalid_id")
            return f"{ARASAAC_CREDIT} · {ARASAAC_SOURCE.format(identifier=int(identifier))}"[:300]
        if provider == ICONS:
            match = ICON_ID.match(identifier)
            if not match or match.group("prefix") not in ICON_SETS:
                raise BankError(422, "bank_invalid_id")
            label, author, licence, _ = ICON_SETS[match.group("prefix")]
            return f"{label} · {author} · {licence} · Iconify"[:300]
        if provider == WIKIMEDIA:
            list(self.wikimedia_urls(identifier, 500))  # rellena la caché
            info = self.recall(WIKIMEDIA, identifier) or {}
            artist = self.wiki_meta(info, "Artist") or "Wikimedia Commons"
            licence = self.wiki_meta(info, "LicenseShortName") or "Licencia libre"
            return f"{artist} · {licence} · Wikimedia Commons"[:300]
        if provider == MET:
            obj = self.met_object(identifier)
            artist = plain(obj.get("artistDisplayName")) or "The Metropolitan Museum of Art"
            date = plain(obj.get("objectDate"))
            return (f"{artist} · {MET_LICENSE} · The Met" + (f" · {date}" if date else ""))[:300]
        if provider in (OPENVERSE, OPENVERSE_AUDIO):
            row = self.openverse_row(identifier, audio=provider == OPENVERSE_AUDIO)
            return self.openverse_credit(row)
        raise BankError(422, "bank_provider")

    def title_of(self, provider: str, identifier) -> str:
        if provider in (OPENVERSE, OPENVERSE_AUDIO):
            row = self.openverse_row(str(identifier), audio=provider == OPENVERSE_AUDIO)
            return plain(row.get("title"))[:300]
        return ""

    def import_asset(self, provider: str, identifier) -> tuple[bytes, str, str, str]:
        """(bytes, tipo MIME, crédito, título) del recurso completo; los iconos llegan como SVG saneado."""
        data, media_type = self.image(provider, str(identifier), 500)
        return data, media_type, self.credit_of(provider, identifier), self.title_of(provider, identifier)

    def openverse_row(self, identifier: str, audio: bool = False) -> dict:
        provider = OPENVERSE_AUDIO if audio else OPENVERSE
        if not UUID.match(identifier):
            raise BankError(422, "bank_invalid_id")
        row = self.recall(provider, identifier)
        if row is None:
            row = get_json(f"{SOUND_API if audio else OPENVERSE_API}{identifier}/")
            valid = self.sound_usable(row, 10 ** 9) if audio else (
                isinstance(row, dict) and str(row.get("license") or "").lower() in OPENVERSE_LICENSES)
            if not valid:
                raise BankError(404, "bank_not_found")
            self.remember(provider, identifier, row)
        return row

    def openverse_credit(self, row: dict) -> str:
        licence = self.ov_license(row)
        return (plain(row.get("attribution")) or " · ".join(part for part in (
            plain(row.get("creator")), licence, plain(row.get("source"))) if part))[:300]
