"""Optional TLS ingress for centres."""

from pathlib import Path

ROOT = Path(__file__).parents[1]


def test_ingress_compose_keeps_portal_on_loopback_and_publishes_tls():
    text = (ROOT / 'compose.ingress.yml').read_text()
    assert 'ports: !override' in text
    assert '"127.0.0.1:${PORTAL_PORT:-8082}:80"' in text
    assert 'image: caddy:2-alpine' in text
    assert '"${INGRESS_HTTP_PORT:-80}:80"' in text
    assert '"${INGRESS_HTTPS_PORT:-443}:443"' in text


def test_internal_and_acme_caddyfiles_proxy_the_portal_with_headers():
    internal = (ROOT / 'services/ingress/Caddyfile').read_text()
    acme = (ROOT / 'services/ingress/Caddyfile.acme').read_text()
    for text in (internal, acme):
        assert 'reverse_proxy portal:80' in text
        assert 'Strict-Transport-Security' in text
        assert "Content-Security-Policy" in text
        assert 'Permissions-Policy' in text
    assert 'tls internal' in internal
    assert 'tls internal' not in acme
