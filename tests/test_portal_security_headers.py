"""Security headers on the public TLS vhost and the inner portal."""

from pathlib import Path

ROOT = Path(__file__).parents[1] / 'services/portal/nginx'


def test_production_vhost_sets_hsts_csp_and_permissions_policy():
    text = (ROOT / 'production-vhost.conf').read_text()
    assert 'Strict-Transport-Security "max-age=31536000; includeSubDomains"' in text
    assert "Content-Security-Policy \"frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'\"" in text
    assert 'Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=()"' in text


def test_inner_portal_sets_the_same_conservative_headers():
    text = (ROOT / 'default.conf').read_text()
    assert 'add_header X-Content-Type-Options nosniff always;' in text
    assert "Content-Security-Policy \"frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'\"" in text
    assert 'Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=()"' in text
    # HSTS only belongs on the HTTPS vhost, never on the inner HTTP listener.
    assert 'Strict-Transport-Security' not in text
