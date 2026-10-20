"""Commons login endpoints create the very same private Rebost principal.

The OIDC provider is stubbed only at Authlib's verified-token boundary; these
tests do not claim to exercise a live Authentik exchange.
"""
from types import SimpleNamespace

import pytest
from fastapi.responses import RedirectResponse
from fastapi.testclient import TestClient

from test_rebost import api, path, upload


def test_code_pin_login_owns_rebost_and_logout_revokes(api):
    module, _, _, _ = api
    with module.get_conn() as db:
        db.execute("UPDATE student_identities SET pin_hash=?, public_code='ABC' WHERE id='a'", (module.hash_pin('1234'),))
    client = TestClient(module.app)
    client.headers['Origin'] = 'http://testserver'
    assert client.get('/api/assets/v1/me').status_code == 401
    assert client.post('/api/auth/student', json={'public_code':'ABC','pin':'9999'}).status_code == 401
    assert client.post('/api/auth/student', json={'public_code':'ABC','pin':'1234'}).status_code == 200
    assert client.get('/api/auth/me').json()['identity']['id'] == 'a'
    item = upload(client).json()
    assert client.post('/api/auth/logout').status_code == 200
    assert client.get(path(item)).status_code == 401
    assert client.post('/api/auth/student', json={'public_code':'ABC','pin':'1234'}).status_code == 200
    assert client.get(path(item)).status_code == 200


@pytest.mark.parametrize('role', ['profesor', 'alumno', 'administrador'])
def test_oidc_callback_opens_same_library_and_revokes_on_logout(api, monkeypatch, role):
    module, _, _, _ = api
    for name,value in {'OIDC_CLIENT_ID':'test-client','OIDC_CLIENT_SECRET':'test-client-secret',
                       'OIDC_REDIRECT_URL':'http://testserver/api/auth/oidc/callback'}.items():
        monkeypatch.setattr(module, name, value)
    async def authorize(request, redirect_uri):
        assert redirect_uri == module.OIDC_REDIRECT_URL
        return RedirectResponse('/verified-provider-boundary')
    async def verified_token(request, claims_options):
        assert module.OIDC_ISSUER_URL in claims_options['iss']['values']
        return {'userinfo':{'sub':'verified-subject','iss':module.OIDC_ISSUER_URL,'roles':[role]}}
    monkeypatch.setattr(module, 'oauth', SimpleNamespace(authentik=SimpleNamespace(
        authorize_redirect=authorize, authorize_access_token=verified_token)))
    client = TestClient(module.app); client.headers['Origin'] = 'http://testserver'
    assert client.get('/api/auth/oidc/login?next=%2Fblocs-access.html', follow_redirects=False).status_code == 307
    response = client.get('/api/auth/oidc/callback', follow_redirects=False)
    assert response.status_code == 303 and response.headers['location'] == '/blocs-access.html'
    assert client.get('/api/auth/me').json()['identity']['role'] == role
    item = upload(client).json()
    # A new callback for the same provider/sub opens the same private library.
    fresh = TestClient(module.app); fresh.headers['Origin'] = 'http://testserver'
    fresh.get('/api/auth/oidc/callback', follow_redirects=False)
    assert fresh.get(path(item)).status_code == 200
    replay = list(client.cookies.jar)
    assert client.post('/api/auth/oidc/logout').status_code == 200
    for cookie in replay: client.cookies.jar.set_cookie(cookie)
    assert client.get(path(item)).status_code == 401
    assert fresh.get(path(item)).status_code == 200
