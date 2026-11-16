"""Ayudas para las pruebas de las aplicaciones: sin red ni DNS reales.

    from edutictac_banks import testing
    testing.install(monkeypatch, handler)        # handler(httpx.Request) -> httpx.Response

El `handler` ve la URL lógica (`https://api.arasaac.org/...`) aunque la conexión real vaya a la IP fijada."""
import httpx

from . import net

PUBLIC_IP = "93.184.216.34"


def logical_request(request: httpx.Request) -> httpx.Request:
    host = request.headers.get("host", request.url.host)
    url = httpx.URL(str(request.url)).copy_with(host=host)
    return httpx.Request(request.method, url, headers=[(k, v) for k, v in request.headers.multi_items() if k != "host"],
                         content=request.content, extensions=request.extensions)


def install(monkeypatch, handler, *, addresses=None):
    """Sustituye el cliente HTTP y el DNS de `net`. `addresses`: función host -> lista de IP (por defecto una pública)."""
    monkeypatch.setattr(net, "http_client", lambda: httpx.Client(
        transport=httpx.MockTransport(lambda request: handler(logical_request(request))), follow_redirects=False))
    monkeypatch.setattr(net, "resolve", lambda host: [(0, 0, 0, "", (ip, 443)) for ip in (addresses(host) if addresses else [PUBLIC_IP])])
