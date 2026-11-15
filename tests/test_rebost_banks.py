"""Bancs d'imatges consultats pel servidor: sessió, límits, SSRF i formats (sense xarxa real)."""
import json

import httpx
import pytest

from test_rebost import api, image  # noqa: F401  (fixture `api` i generador d'imatges de prova)

PNG = image()
JPEG = image('JPEG')


@pytest.fixture
def banks_api(monkeypatch, request):
    monkeypatch.setenv('REBOST_BANKS_ENABLED', '1')
    module, client, other, student = request.getfixturevalue('api')
    import assets.banks as banks
    calls = []
    routes = {}

    def handler(req: httpx.Request):
        calls.append(str(req.url))
        for prefix, reply in routes.items():
            if str(req.url).startswith(prefix):
                return reply(req) if callable(reply) else reply
        return httpx.Response(404)

    monkeypatch.setattr(banks, 'http_client', lambda: httpx.Client(transport=httpx.MockTransport(handler), follow_redirects=False))
    monkeypatch.setattr(banks, 'resolve', lambda host: [(0, 0, 0, '', ('10.0.0.5' if host.startswith('internal') else '93.184.216.34', 443))])
    return module, client, other, routes, calls, banks


def j(data):
    return httpx.Response(200, json=data)


def test_disabled_by_default_and_needs_session(api):
    module, client, _, _ = api
    assert client.get('/api/assets/v1/banks').status_code == 404  # sense REBOST_BANKS_ENABLED
    assert 'banks' not in client.get('/api/assets/v1/me').json()['capabilities']


def test_requires_session_and_is_announced(banks_api):
    module, client, _, routes, calls, banks = banks_api
    assert 'banks' in client.get('/api/assets/v1/me').json()['capabilities']
    from fastapi.testclient import TestClient
    anonymous = TestClient(module.app)
    assert anonymous.get('/api/assets/v1/banks').status_code == 401
    assert anonymous.get('/api/assets/v1/banks/arasaac/search?q=sol').status_code == 401
    assert calls == []  # sense sessió no hi ha cap petició de sortida
    assert [p['id'] for p in client.get('/api/assets/v1/banks').json()['providers']] == ['arasaac', 'wikimedia', 'met', 'openverse']


def test_arasaac_search_and_image(banks_api):
    module, client, _, routes, calls, banks = banks_api
    routes['https://api.arasaac.org/api/pictograms/ca/search/sol'] = j([{'_id': 7, 'keywords': [{'keyword': 'sol'}, {'keyword': 'astre'}]}, {'bad': 1}])
    routes['https://static.arasaac.org/pictograms/7/7_300.png'] = httpx.Response(200, content=PNG)
    found = client.get('/api/assets/v1/banks/arasaac/search?q=sol&language=va').json()
    assert found['commercial_use'] is False and len(found['items']) == 1
    item = found['items'][0]
    assert item['thumbnail_url'] == '/api/assets/v1/banks/arasaac/7/thumbnail' and 'NC-SA' in item['license']
    got = client.get(item['thumbnail_url'])
    assert got.status_code == 200 and got.headers['content-type'] == 'image/png' and got.content == PNG
    assert got.headers['x-content-type-options'] == 'nosniff'


def test_openverse_filters_licences_and_uses_only_known_images(banks_api):
    module, client, _, routes, calls, banks = banks_api
    good, bad = '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'
    routes['https://api.openverse.org/v1/images/?'] = j({'results': [
        {'id': good, 'license': 'by', 'license_version': '4.0', 'title': '<b>Gat</b>', 'creator': 'Ana', 'thumbnail': 'https://cdn.example/t.jpg', 'url': 'https://cdn.example/u.jpg'},
        {'id': bad, 'license': 'by-nc', 'title': 'No'}, {'id': 'x', 'license': 'by'}]})
    routes['https://cdn.example/t.jpg'] = httpx.Response(200, content=JPEG)
    items = client.get('/api/assets/v1/banks/openverse/search?q=gat').json()['items']
    assert [i['id'] for i in items] == [good] and items[0]['title'] == 'Gat' and items[0]['license'] == 'CC BY 4.0'
    assert client.get(items[0]['thumbnail_url']).headers['content-type'] == 'image/jpeg'
    assert client.get('/api/assets/v1/banks/openverse/not-a-uuid/thumbnail').status_code == 422


def test_ssrf_redirects_and_private_hosts_are_blocked(banks_api):
    module, client, _, routes, calls, banks = banks_api
    row = {'id': '33333333-3333-3333-3333-333333333333', 'license': 'cc0', 'title': 't'}
    routes['https://api.openverse.org/v1/images/?'] = j({'results': [{**row, 'thumbnail': 'https://internal.example/secret'}]})
    item = client.get('/api/assets/v1/banks/openverse/search?q=a').json()['items'][0]
    assert client.get(item['thumbnail_url']).status_code == 502
    assert not any('internal.example' in call for call in calls)  # ni tan sols s'intenta
    routes['https://api.openverse.org/v1/images/?'] = j({'results': [{**row, 'thumbnail': 'http://cdn.example/plain.jpg'}]})
    item = client.get('/api/assets/v1/banks/openverse/search?q=b').json()['items'][0]
    assert client.get(item['thumbnail_url']).status_code == 502  # http, no https
    routes['https://cdn.example/redir.jpg'] = httpx.Response(302, headers={'location': 'https://internal.example/x'})
    routes['https://api.openverse.org/v1/images/?'] = j({'results': [{**row, 'id': '44444444-4444-4444-4444-444444444444', 'thumbnail': 'https://cdn.example/redir.jpg'}]})
    item = client.get('/api/assets/v1/banks/openverse/search?q=c').json()['items'][0]
    assert client.get(item['thumbnail_url']).status_code == 502
    assert not any('internal.example' in call for call in calls)


def test_wikimedia_drops_non_free_and_met_needs_public_domain(banks_api):
    module, client, _, routes, calls, banks = banks_api
    def page(i, lic):
        return {'pageid': i, 'title': f'File:T{i}.jpg', 'imageinfo': [{'mime': 'image/jpeg', 'url': 'https://upload.example/u.jpg', 'thumburl': 'https://upload.example/t.jpg',
                'extmetadata': {'LicenseShortName': {'value': lic}, 'Artist': {'value': '<a>Eva</a>'}}}]}
    routes['https://commons.wikimedia.org/w/api.php'] = j({'query': {'pages': {'1': page(1, 'CC BY-SA 4.0'), '2': page(2, 'CC BY-NC 2.0'), '3': page(3, 'CC BY-ND 2.0')}}})
    items = client.get('/api/assets/v1/banks/wikimedia/search?q=x').json()['items']
    assert [i['id'] for i in items] == ['1'] and 'Eva' in items[0]['credit']
    routes['https://collectionapi.metmuseum.org/public/collection/v1/search'] = j({'objectIDs': [10, 11]})
    routes['https://collectionapi.metmuseum.org/public/collection/v1/objects/10'] = j({'objectID': 10, 'isPublicDomain': True, 'primaryImageSmall': 'https://images.example/a.jpg', 'title': 'A'})
    routes['https://collectionapi.metmuseum.org/public/collection/v1/objects/11'] = j({'objectID': 11, 'isPublicDomain': False, 'primaryImageSmall': 'https://images.example/b.jpg'})
    assert [i['id'] for i in client.get('/api/assets/v1/banks/met/search?q=x').json()['items']] == ['10']


def test_size_signature_validation_limits_and_errors(banks_api, monkeypatch):
    module, client, _, routes, calls, banks = banks_api
    routes['https://static.arasaac.org/pictograms/5/5_300.png'] = httpx.Response(200, content=b'<html>no es imatge</html>')
    assert client.get('/api/assets/v1/banks/arasaac/5/thumbnail').status_code == 502
    routes['https://static.arasaac.org/pictograms/6/6_300.png'] = httpx.Response(200, content=b'\x89PNG\r\n\x1a\n' + b'0' * (3 * 1024 * 1024))
    assert client.get('/api/assets/v1/banks/arasaac/6/thumbnail').status_code == 413  # límit de 2 MiB en miniatures
    assert client.get('/api/assets/v1/banks/arasaac/abc/thumbnail').status_code == 422
    assert client.get('/api/assets/v1/banks/unknown/search?q=x').status_code == 422
    assert client.get('/api/assets/v1/banks/arasaac/search?q=').status_code == 422
    assert client.get('/api/assets/v1/banks/arasaac/search?q=' + 'x' * 81).status_code == 422
    monkeypatch.setattr(banks, 'RATE_PER_MINUTE', 3)
    codes = [client.get('/api/assets/v1/banks').status_code for _ in range(5)]
    assert codes[-1] == 429


def test_banks_use_the_rebost_cors_policy(banks_api):
    """Same list as the rest of the Rebost: an allowed origin may read banks with credentials, others may not."""
    module, client, _, routes, calls, banks = banks_api
    origins = ('https://educrea.test',)
    module.rebost.allowed_origins = origins
    module.commons.settings.rebost_allowed_origins = origins
    routes['https://api.arasaac.org/api/pictograms/es/search/sol'] = j([])
    ok = client.get('/api/assets/v1/banks/arasaac/search?q=sol', headers={'Origin': origins[0]})
    assert ok.status_code == 200
    assert ok.headers['access-control-allow-origin'] == origins[0]
    assert ok.headers['access-control-allow-credentials'] == 'true'
    pre = client.options('/api/assets/v1/banks/arasaac/search', headers={'Origin': origins[0], 'Access-Control-Request-Method': 'GET'})
    assert pre.status_code == 204
    other = client.get('/api/assets/v1/banks/arasaac/search?q=sol', headers={'Origin': 'https://other.test'})
    assert 'access-control-allow-origin' not in other.headers
