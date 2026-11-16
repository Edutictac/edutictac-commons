"""Red segura: solo https:443 a direcciones públicas, redirecciones revalidadas y conexión a la IP ya comprobada
(contra el rebinding de DNS). `http_client` y `resolve` son las costuras que sustituyen las pruebas."""
import ipaddress
import json
import socket
from urllib.parse import urlsplit

import httpx

from .errors import BankError

TIMEOUT = 15
MAX_CONTENT = 4 * 1024 * 1024
USER_AGENT = "Mozilla/5.0 (compatible; EduTicTac-Banks/1.0; +https://edutictac.es)"


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
        return json.loads(body)
    except ValueError as exc:
        raise BankError(502, "bank_unavailable") from exc
