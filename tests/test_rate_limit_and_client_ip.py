"""IP real darrere del portal i poda del limitador en memòria."""

from __future__ import annotations

import sys
import time
from pathlib import Path
from types import SimpleNamespace

ROOT = Path(__file__).parents[1] / 'services/id-api'
sys.path.insert(0, str(ROOT / 'vendor'))
sys.path.insert(0, str(ROOT))

from edutictac_community.ratelimit import RateLimiter  # noqa: E402
from idapi.context import client_ip  # noqa: E402


class RequestStub:
    def __init__(self, peer: str | None, real_ip: str | None = None):
        self.client = SimpleNamespace(host=peer) if peer is not None else None
        self.headers = {} if real_ip is None else {'x-real-ip': real_ip}


def test_client_ip_uses_real_ip_from_the_portal():
    assert client_ip(RequestStub('172.18.0.4', '203.0.113.7')) == '203.0.113.7'
    assert client_ip(RequestStub('172.18.0.4', '2001:db8::7')) == '2001:db8::7'


def test_client_ip_ignores_invalid_or_missing_headers():
    assert client_ip(RequestStub('172.18.0.4')) == '172.18.0.4'
    assert client_ip(RequestStub('172.18.0.4', 'not-an-ip')) == '172.18.0.4'
    assert client_ip(RequestStub('172.18.0.4', '   ')) == '172.18.0.4'
    assert client_ip(RequestStub(None)) == '?'


def test_rate_limiter_rejects_after_the_limit():
    limiter = RateLimiter(max_calls=2, window_seconds=60)
    assert limiter('client') is False
    assert limiter('client') is False
    assert limiter('client') is True
    assert limiter('other') is False


def test_rate_limiter_sweeps_stale_keys():
    limiter = RateLimiter(max_calls=2, window_seconds=0.01)
    assert limiter('old') is False
    time.sleep(0.02)
    assert limiter('new') is False
    assert 'old' not in limiter._hits
    assert 'new' in limiter._hits
