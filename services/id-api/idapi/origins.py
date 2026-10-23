"""Orígens de confiança per a la sessió central i les redireccions `next`.

Una sola llista (`EDUTICTAC_ID_ALLOWED_ORIGINS`) decidix tres coses: quins llocs
poden llegir `/api/auth/session` amb galetes (CORS), quins poden tancar la sessió
i a quins es pot tornar després d'entrar. Patrons admesos:

- origen exacte: `https://edutictac.es`
- qualsevol subdomini: `https://*.edutictac.es` (no inclou el domini nu)
- qualsevol port: `http://localhost:*`
"""

from __future__ import annotations

from urllib.parse import urlsplit


def parse_origins(raw: str) -> tuple[str, ...]:
    return tuple(part.strip().rstrip("/") for part in raw.split(",") if part.strip())


def _split(origin: str) -> tuple[str, str, str] | None:
    try:
        parsed = urlsplit(origin)
        port = parsed.port
    except ValueError:
        return None
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        return None
    if parsed.username or parsed.password or parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
        return None
    return parsed.scheme, parsed.hostname.lower(), str(port or "")


def _matches(origin: tuple[str, str, str], pattern: str) -> bool:
    scheme, rest = pattern.split("://", 1) if "://" in pattern else ("", "")
    if scheme != origin[0] or not rest:
        return False
    host, _, port = rest.partition(":")
    host = host.lower()
    if port != "*" and port != origin[2]:
        return False
    if host.startswith("*."):
        return origin[1].endswith(host[1:]) and origin[1] != host[2:]
    return host == origin[1]


def origin_allowed(origin: str, patterns: tuple[str, ...]) -> bool:
    parsed = _split(origin)
    return bool(parsed) and any(_matches(parsed, pattern) for pattern in patterns)


def url_origin(url: str) -> str:
    parsed = urlsplit(url)
    return f"{parsed.scheme}://{parsed.netloc}"
