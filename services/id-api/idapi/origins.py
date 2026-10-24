"""Orígens de confiança per a la sessió central i les redireccions `next`.

Una sola llista (`EDUTICTAC_ID_ALLOWED_ORIGINS`) decidix tres coses: quins llocs
poden llegir `/api/auth/session` amb galetes (CORS), quins poden tancar la sessió
i a quins es pot tornar després d'entrar. Patrons admesos:

- origen exacte: `https://edutictac.es`
- qualsevol port: `http://localhost:*`

Els comodins de subdomini (`https://*.edutictac.es`) no s'admeten: amplien el
perímetre de confiança a qualsevol subdomini, inclosos els que publiquen
contingut de tercers. Cal enumerar cada origen propi.
"""

from __future__ import annotations

from urllib.parse import urlsplit


def parse_origins(raw: str) -> tuple[str, ...]:
    result: list[str] = []
    for part in raw.split(","):
        pattern = part.strip().rstrip("/")
        if not pattern:
            continue
        scheme, separator, rest = pattern.partition("://")
        if not separator or scheme not in {"http", "https"} or not rest:
            raise ValueError(f"invalid allowed origin: {pattern!r}")
        host, _, port = rest.partition(":")
        if not host or "/" in rest or "@" in rest:
            raise ValueError(f"invalid allowed origin: {pattern!r}")
        if "*" in host:
            raise ValueError(
                "wildcard subdomains are not allowed in EDUTICTAC_ID_ALLOWED_ORIGINS; "
                "list every own origin explicitly"
            )
        if port and port != "*" and not port.isdigit():
            raise ValueError(f"invalid allowed origin port: {pattern!r}")
        result.append(pattern)
    return tuple(result)


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
    return host == origin[1]


def origin_allowed(origin: str, patterns: tuple[str, ...]) -> bool:
    parsed = _split(origin)
    return bool(parsed) and any(_matches(parsed, pattern) for pattern in patterns)


def url_origin(url: str) -> str:
    parsed = urlsplit(url)
    return f"{parsed.scheme}://{parsed.netloc}"


def same_host(origin: str, host_header: str) -> bool:
    """Mateix nom de host que Commons, amb qualsevol port.

    En un centre, Play (:8084) i el portal (:8082) són el mateix servidor; les
    galetes no distingixen ports, així que no cal configurar-ho.
    """
    parsed = _split(origin)
    try:
        own = urlsplit("//" + host_header).hostname
    except ValueError:
        return False
    return bool(parsed and own) and parsed[1] == own.lower()
