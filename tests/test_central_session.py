"""Sessió central: estat visible, tancament, CORS limitat i retorn `next` segur."""

import importlib.util
import sys
from pathlib import Path
from urllib.parse import unquote

import pytest
from fastapi import Response
from fastapi.testclient import TestClient

ORIGINS = (
    'https://edutictac.es,https://commons.edutictac.es,https://recursos.edutictac.es,'
    'https://blocs.edutictac.es,https://blocs-junior.edutictac.es,https://blockly.edutictac.es,'
    'https://llibres.edutictac.es,https://eduhoot.edutictac.es,https://play.edutictac.es,'
    'http://localhost:*'
)


@pytest.fixture
def module(tmp_path, monkeypatch):
    root = Path(__file__).parents[1] / 'services/id-api'
    monkeypatch.syspath_prepend(str(root / 'vendor'))
    monkeypatch.syspath_prepend(str(root))
    monkeypatch.setenv('EDUTICTAC_ID_DB', str(tmp_path / 'id.db'))
    monkeypatch.setenv('EDUTICTAC_ID_SECRET', 'synthetic-session-test-signing-key')
    monkeypatch.setenv('EDUTICTAC_ID_TEACHER_TOKEN', 'synthetic-session-test-teacher')
    monkeypatch.setenv('EDUTICTAC_ID_COOKIE_SECURE', '0')
    monkeypatch.setenv('EDUTICTAC_ID_OIDC_ISSUER_URL', 'https://identity.test/application/o/commons')
    monkeypatch.setenv('EDUTICTAC_ID_OIDC_CLIENT_ID', 'synthetic-client')
    monkeypatch.setenv('EDUTICTAC_ID_OIDC_CLIENT_SECRET', 'synthetic-client-secret')
    monkeypatch.setenv('EDUTICTAC_ID_OIDC_DISCOVERY_URL', 'http://identity.internal/application/o/commons/.well-known/openid-configuration')
    monkeypatch.setenv('EDUTICTAC_ID_OIDC_REDIRECT_URL', 'https://commons.test/api/auth/oidc/callback')
    monkeypatch.setenv('EDUTICTAC_ID_ALLOWED_ORIGINS', ORIGINS)
    monkeypatch.setenv('EDUTICTAC_ID_ACCOUNT_URL', 'https://id.edutictac.es/if/user/')
    spec = importlib.util.spec_from_file_location('central_session_test_api', root / 'main.py')
    loaded = importlib.util.module_from_spec(spec)
    monkeypatch.setitem(sys.modules, spec.name, loaded)
    spec.loader.exec_module(loaded)
    with loaded.get_conn() as db:
        db.execute("INSERT INTO groups (id,created_at,updated_at) VALUES ('group','2026','2026')")
        db.execute("INSERT INTO student_identities (id,group_id,public_code,pin_hash,created_at,updated_at) VALUES ('a','group','K7M','unused','2026','2026')")
    return loaded


def client_with(module, response):
    client = TestClient(module.app)
    client.headers['Cookie'] = response.headers['set-cookie'].split(';')[0]
    return client


def oidc_client(module, claims, role='profesor'):
    response = Response()
    module.set_oidc_cookie(response, {'iss': module.OIDC_ISSUER_URL, 'sub': 'person', **claims}, role)
    return client_with(module, response)


def student_client(module):
    response = Response()
    module.set_student_session(response, 'a')
    return client_with(module, response)


def test_anonymous_session_is_public_and_never_cached(module):
    response = TestClient(module.app).get('/api/auth/session')
    assert response.status_code == 200
    data = response.json()
    assert data['authenticated'] is False and data['kind'] == 'anonymous'
    assert data['login_available'] is True
    assert data['links']['account'] == 'https://id.edutictac.es/if/user/'
    assert response.headers['cache-control'] == 'no-store'
    assert 'Cookie' in response.headers['vary'] and 'Origin' in response.headers['vary']


def test_oidc_session_shows_name_and_role_without_email(module):
    teacher = oidc_client(module, {'name': 'Laia Ferrer', 'email': 'laia@example.test'})
    data = teacher.get('/api/auth/session').json()
    assert data['authenticated'] and data['kind'] == 'oidc' and data['role'] == 'profesor'
    assert data['display_name'] == 'Laia Ferrer'
    assert '@' not in repr(data)
    assert teacher.get('/api/auth/me').json()['identity']['name'] == 'Laia Ferrer'

    admin = oidc_client(module, {'preferred_username': 'direccio'}, role='administrador')
    data = admin.get('/api/auth/session').json()
    assert data['role'] == 'administrador' and data['display_name'] == 'direccio'

    by_email = oidc_client(module, {'email': 'pere@example.test'})
    assert by_email.get('/api/auth/session').json()['display_name'] == 'pere'


def test_student_and_local_teacher_sessions(module):
    data = student_client(module).get('/api/auth/session').json()
    assert data['kind'] == 'student' and data['role'] == 'alumno' and data['public_code'] == 'K7M'
    assert 'id' not in data and 'group_id' not in data

    local = TestClient(module.app)
    assert local.post('/api/teacher/login', json={'token': 'synthetic-session-test-teacher'}).status_code == 200
    data = local.get('/api/auth/session').json()
    assert data['kind'] == 'teacher' and data['role'] == 'profesor'


def test_central_logout_closes_every_session_and_is_idempotent(module):
    pupil = student_client(module)
    pupil.headers['Origin'] = 'http://testserver'
    assert pupil.post('/api/auth/session/logout').json() == {'ok': True}
    with module.get_conn() as db:
        assert db.execute('SELECT revoked_at FROM student_sessions').fetchone()['revoked_at']
    assert pupil.get('/api/auth/session').json()['authenticated'] is False

    teacher = oidc_client(module, {'name': 'Laia'})
    teacher.headers['Origin'] = 'https://edutictac.es'
    response = teacher.post('/api/auth/session/logout')
    cleared = ' '.join(response.headers.get_list('set-cookie'))
    for name in ('edutictac_id=', 'edutictac_oidc=', 'edutictac_teacher='):
        assert name in cleared
    assert teacher.post('/api/auth/session/logout').status_code == 200


def test_central_logout_rejects_foreign_or_missing_origin(module):
    teacher = oidc_client(module, {'name': 'Laia'})
    for origin in ('https://evil.test', 'https://edutictac.es.evil.test', 'null'):
        teacher.headers['Origin'] = origin
        assert teacher.post('/api/auth/session/logout').status_code == 403
    del teacher.headers['Origin']
    assert teacher.post('/api/auth/session/logout').status_code == 403
    assert teacher.get('/api/auth/session').json()['authenticated'] is True


def test_cors_only_for_allowed_origins_and_session_paths(module):
    client = TestClient(module.app)
    for origin in (
        'https://edutictac.es',
        'https://commons.edutictac.es',
        'https://recursos.edutictac.es',
        'https://blocs.edutictac.es',
        'https://blocs-junior.edutictac.es',
        'https://blockly.edutictac.es',
        'https://llibres.edutictac.es',
        'https://eduhoot.edutictac.es',
        'https://play.edutictac.es',
        'http://localhost:8098',
    ):
        response = client.get('/api/auth/session', headers={'Origin': origin})
        assert response.headers['access-control-allow-origin'] == origin
        assert response.headers['access-control-allow-credentials'] == 'true'
        preflight = client.options('/api/auth/session/logout', headers={
            'Origin': origin, 'Access-Control-Request-Method': 'POST'})
        assert preflight.status_code == 204
        assert 'POST' in preflight.headers['access-control-allow-methods']

    for origin in (
        'https://evil.test',
        'https://edutictac.es.evil.test',
        'https://pages.edutictac.es',
        'https://evil.edutictac.es',
        'http://edutictac.es',
        'null',
    ):
        response = client.get('/api/auth/session', headers={'Origin': origin})
        assert 'access-control-allow-origin' not in response.headers
        assert client.options('/api/auth/session', headers={
            'Origin': origin, 'Access-Control-Request-Method': 'GET'}).status_code == 403

    other = client.get('/api/health', headers={'Origin': 'https://edutictac.es'})
    assert 'access-control-allow-origin' not in other.headers


def test_parse_origins_rejects_subdomain_wildcards():
    from idapi.origins import parse_origins

    assert parse_origins('https://edutictac.es,http://localhost:*') == (
        'https://edutictac.es',
        'http://localhost:*',
    )
    for value in (
        'https://*.edutictac.es',
        'https://*.example.test,https://edutictac.es',
        'edutictac.es',
        'https://edutictac.es/path',
        'https://user:pass@edutictac.es',
        'https://edutictac.es:notaport',
    ):
        with pytest.raises(ValueError):
            parse_origins(value)


def test_cookie_mutations_require_own_origin(module):
    teacher = oidc_client(module, {'name': 'Laia'}, role='profesor')
    payload = {'tenant_id': 'origin-test'}

    for headers in (
        {'Origin': 'https://pages.edutictac.es'},
        {'Origin': 'https://evil.edutictac.es'},
        {'Origin': 'null'},
        {'Sec-Fetch-Site': 'cross-site'},
    ):
        response = teacher.post('/api/groups', json=payload, headers=headers)
        assert response.status_code == 403, headers

    assert teacher.post('/api/groups', json=payload, headers={'Origin': 'https://edutictac.es'}).status_code == 201
    # Les crides entre serveis no porten Origin i no són CSRF.
    assert teacher.post('/api/groups', json=payload).status_code == 201


def test_login_posts_reject_foreign_or_cross_site_origins(module):
    client = TestClient(module.app)
    body = {'public_code': 'K7M', 'pin': '0000'}
    assert client.post('/api/auth/student', json=body, headers={'Origin': 'https://evil.edutictac.es'}).status_code == 403
    assert client.post('/api/auth/student', json=body, headers={'Sec-Fetch-Site': 'cross-site'}).status_code == 403
    assert client.post('/api/auth/student', json=body, headers={'Origin': 'https://edutictac.es'}).status_code == 401
    assert client.post('/api/auth/student', json=body).status_code == 401


@pytest.mark.parametrize('value,expected', [
    ('/teacher.html', '/teacher.html'),
    ('/assets/?x=1#y', '/assets/?x=1#y'),
    ('https://edutictac.es/', 'https://edutictac.es/'),
    ('https://play.edutictac.es/joc/1', 'https://play.edutictac.es/joc/1'),
    ('http://localhost:8084/play/', 'http://localhost:8084/play/'),
    ('//evil.test/', '/'),
    ('/\\evil.test', '/'),
    ('https://evil.test/', '/'),
    ('https://edutictac.es.evil.test/', '/'),
    ('https://user:pw@edutictac.es/', '/'),
    ('http://edutictac.es/', '/'),
    ('javascript:alert(1)', '/'),
    ('data:text/html,x', '/'),
    ('teacher.html', '/'),
    ('/ok\nSet-Cookie: x', '/'),
    ('', '/'),
    (None, '/'),
])
def test_safe_next_accepts_only_own_paths_and_trusted_origins(module, value, expected):
    from idapi.origins import parse_origins
    from idapi.routes.sessions import safe_next
    assert safe_next(value, parse_origins(ORIGINS)) == expected


def test_login_link_returns_to_the_calling_site(module):
    data = TestClient(module.app).get('/api/auth/session', headers={'Origin': 'https://edutictac.es'}).json()
    assert unquote(data['links']['login']) == '/api/auth/oidc/login?next=https://edutictac.es/'
    data = TestClient(module.app).get('/api/auth/session?next=https://evil.test/').json()
    assert unquote(data['links']['login']) == '/api/auth/oidc/login?next=/'


def test_same_host_other_port_is_trusted_without_configuration(module, monkeypatch):
    """Play (:8084) i el portal (:8082) d'un centre comparteixen host i galetes."""
    client = TestClient(module.app, base_url='http://commons.centre:8082')
    response = client.get('/api/auth/session', headers={'Origin': 'http://commons.centre:8084'})
    assert response.headers['access-control-allow-origin'] == 'http://commons.centre:8084'
    assert unquote(response.json()['links']['login']) == '/api/auth/oidc/login?next=http://commons.centre:8084/'
    other = client.get('/api/auth/session', headers={'Origin': 'http://altre.centre:8084'})
    assert 'access-control-allow-origin' not in other.headers

    from idapi.routes.sessions import safe_next
    assert safe_next('http://commons.centre:8084/play/', (), 'commons.centre:8082') == 'http://commons.centre:8084/play/'
    assert safe_next('http://commons.centre.evil:8084/', (), 'commons.centre:8082') == '/'
    assert safe_next('http://commons.centre:8084/', (), '') == '/'

    teacher = oidc_client(module, {'name': 'Laia'})
    teacher.base_url = 'http://commons.centre:8082'
    teacher.headers['Origin'] = 'http://commons.centre:8084'
    assert teacher.post('/api/auth/session/logout').status_code == 200


def app_headers(cookie_client=None):
    return {'Authorization': 'Bearer synthetic-internal-app-token'}


@pytest.fixture
def internal(module, monkeypatch):
    module.commons.settings.app_token = 'synthetic-internal-app-token'
    return module


def test_internal_resolve_requires_the_app_token(internal):
    client = TestClient(internal.app)
    assert client.get('/api/internal/session/resolve').status_code == 401
    assert client.get('/api/internal/session/resolve', headers={'Authorization': 'Bearer wrong'}).status_code == 403
    response = client.get('/api/internal/session/resolve', headers=app_headers())
    assert response.json() == {'kind': 'anonymous'}
    assert response.headers['cache-control'] == 'no-store'


def test_internal_resolve_returns_the_stable_identity(internal):
    teacher = oidc_client(internal, {'name': 'Laia Ferrer', 'email': 'laia@example.test'})
    data = teacher.get('/api/internal/session/resolve', headers=app_headers()).json()
    assert data == {'kind': 'oidc', 'sub': 'person', 'role': 'profesor', 'display_name': 'Laia Ferrer'}
    pupil = student_client(internal)
    assert pupil.get('/api/internal/session/resolve', headers=app_headers()).json() == {'kind': 'student', 'id': 'a', 'public_code': 'K7M'}
    with internal.get_conn() as db:
        db.execute("UPDATE student_sessions SET revoked_at = '2026'")
    assert pupil.get('/api/internal/session/resolve', headers=app_headers()).json() == {'kind': 'anonymous'}


def test_internal_resolve_ignores_forged_cookies(internal):
    client = TestClient(internal.app)
    client.headers['Cookie'] = 'edutictac_oidc=forged.value; edutictac_id=forged.value'
    assert client.get('/api/internal/session/resolve', headers=app_headers()).json() == {'kind': 'anonymous'}


def test_nginx_never_exposes_internal_routes():
    root = Path(__file__).parents[1] / 'services/portal/nginx'
    for name in ('default.conf', 'federated.conf'):
        conf = (root / name).read_text()
        assert 'location ^~ /api/internal/ { return 404; }' in conf, name
        assert conf.index('/api/internal/') < conf.index('location /api/ {'), name


def test_admin_proxy_is_limited_to_local_tailnet_and_tunnel():
    conf = (Path(__file__).parents[1] / 'services/portal/nginx/default.conf').read_text()
    for marker in (
        'allow 127.0.0.1;',
        'allow ::1;',
        'allow 172.16.0.0/12;',
        'allow 100.64.0.0/10;',
        'allow fd7a:115c:a1e0::/48;',
        'deny all;',
    ):
        assert conf.count(marker) == 2, marker


def test_oidc_session_is_revocable_server_side(module):
    teacher = oidc_client(module, {'name': 'Laia'}, role='profesor')
    assert teacher.get('/api/auth/session').json()['authenticated'] is True
    with module.get_conn() as db:
        db.execute("UPDATE oidc_sessions SET revoked_at = '2026-01-01T00:00:00+00:00'")
    assert teacher.get('/api/auth/session').json()['authenticated'] is False


def test_oidc_session_expires_server_side(module):
    teacher = oidc_client(module, {'name': 'Laia'}, role='profesor')
    assert teacher.get('/api/auth/session').json()['authenticated'] is True
    with module.get_conn() as db:
        db.execute("UPDATE oidc_sessions SET expires_at = '2000-01-01T00:00:00+00:00'")
    assert teacher.get('/api/auth/session').json()['authenticated'] is False


def test_oidc_cookie_is_short_lived_and_requires_a_session_id(module):
    response = Response()
    module.set_oidc_cookie(response, {'name': 'Laia'}, 'profesor')
    assert 'Max-Age=43200' in response.headers['set-cookie']

    client = TestClient(module.app)
    client.headers['Cookie'] = 'edutictac_oidc=' + module.commons.cookies.encode({
        'oidc': True,
        'iss': module.OIDC_ISSUER_URL,
        'sub': 'person',
        'role': 'profesor',
    })
    assert client.get('/api/auth/session').json()['authenticated'] is False
