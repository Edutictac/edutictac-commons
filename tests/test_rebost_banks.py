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
    dialed_ips = {'93.184.216.34'}

    def handler(req: httpx.Request):
        # La connexió es fa a la IP validada; el nom lògic viaja a Host i SNI.
        logical = f"https://{req.headers['host']}{req.url.raw_path.decode()}"
        assert req.extensions.get('sni_hostname') == req.headers['host']
        assert req.url.host in dialed_ips, f'connexió a {req.url.host}, no a una IP resolta'
        calls.append(logical)
        for prefix, reply in routes.items():
            if logical.startswith(prefix):
                return reply(req) if callable(reply) else reply
        return httpx.Response(404)

    monkeypatch.setattr(banks, 'http_client', lambda: httpx.Client(transport=httpx.MockTransport(handler), follow_redirects=False))
    monkeypatch.setattr(banks, 'resolve', lambda host: [(0, 0, 0, '', ('10.0.0.5' if host.startswith('internal') else '93.184.216.34', 443))])
    banks.dialed_ips = dialed_ips
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
    assert [p['id'] for p in client.get('/api/assets/v1/banks').json()['providers']] == ['arasaac', 'wikimedia', 'met', 'openverse', 'icons', 'openverse-audio']


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


SVG = b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 3h18v18H3z" fill="none" stroke="#1f2937"/></svg>'


def test_icons_search_terms_and_sanitized_svg(banks_api):
    module, client, _, routes, calls, banks = banks_api
    routes['https://api.iconify.design/search'] = lambda req: j({'icons': ['tabler:scissors', 'lucide:scissors', 'mdi:evil', 'bad']})
    routes['https://api.iconify.design/tabler/scissors.svg'] = httpx.Response(200, content=SVG)
    found = client.get('/api/assets/v1/banks/icons/search?q=tijeras&language=es').json()
    assert [i['id'] for i in found['items']] == ['tabler:scissors', 'lucide:scissors']  # mdi no está permitido
    assert any('query=scissors' in call for call in calls)  # «tijeras» se traduce con la lista de términos
    item = found['items'][0]
    assert item['license'] == 'MIT' and item['media_type'] == 'image/svg+xml'
    got = client.get(item['content_url'])
    assert got.status_code == 200 and got.headers['content-type'] == 'image/svg+xml'
    assert b'<path' in got.content and b'script' not in got.content
    assert client.get('/api/assets/v1/banks/icons/mdi:x/thumbnail').status_code == 422


@pytest.mark.parametrize('payload', [
    b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
    b'<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><path d="M0 0"/></svg>',
    b'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="url(https://evil.test/x)"/></svg>',
    b'<svg xmlns="http://www.w3.org/2000/svg"><image href="https://evil.test/x.png"/></svg>',
    b'<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div/></foreignObject></svg>',
    b'<svg xmlns="http://www.w3.org/2000/svg"><use xlink:href="#a"/></svg>',
    b'<!DOCTYPE svg [<!ENTITY x "y">]><svg xmlns="http://www.w3.org/2000/svg"/>',
    b'<html><body>no es svg</body></html>',
    b'<svg xmlns="http://www.w3.org/2000/svg"><style>*{}</style></svg>',
])
def test_svg_sanitizer_rejects_active_content(banks_api, payload):
    module, client, _, routes, calls, banks = banks_api
    routes['https://api.iconify.design/lucide/a.svg'] = httpx.Response(200, content=payload)
    assert client.get('/api/assets/v1/banks/icons/lucide:a/content').status_code == 502


def test_sound_bank_filters_downloads_and_validates(banks_api):
    module, client, _, routes, calls, banks = banks_api
    good, big, nc = ('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777')
    def row(i, **extra):
        return {'id': i, 'license': 'by', 'license_version': '4.0', 'source': 'freesound', 'filetype': 'ogg', 'duration': 3000,
                'url': 'https://cdn.freesound.org/s.ogg', 'title': 'Plof', 'creator': 'Eva', **extra}
    routes['https://api.openverse.org/v1/audio/?'] = j({'results': [row(good), row(big, filesize=9_000_000), row(nc, license='by-nc'),
                                                                     row('88888888-8888-8888-8888-888888888888', url='https://evil.test/a.ogg'),
                                                                     row('99999999-9999-9999-9999-999999999999', duration=500000)]})
    routes['https://cdn.freesound.org/s.ogg'] = httpx.Response(200, content=b'OggS' + b'0' * 100)
    items = client.get('/api/assets/v1/banks/openverse-audio/search?q=plof').json()['items']
    assert [i['id'] for i in items] == [good] and items[0]['kind'] == 'sound' and items[0]['license'] == 'CC BY 4.0'
    sound = client.get(items[0]['content_url'])
    assert sound.status_code == 200 and sound.headers['content-type'] == 'audio/ogg'
    assert client.get('/api/assets/v1/banks/openverse-audio/' + good + '/thumbnail').status_code == 404
    routes['https://cdn.freesound.org/s.ogg'] = httpx.Response(200, content=b'<html>no es so</html>')
    assert client.get(items[0]['content_url']).status_code == 502
    routes['https://cdn.freesound.org/s.ogg'] = httpx.Response(200, content=b'OggS' + b'0' * (3 * 1024 * 1024))
    assert client.get(items[0]['content_url']).status_code == 413
    routes['https://cdn.freesound.org/s.ogg'] = httpx.Response(302, headers={'location': 'https://evil.test/a.ogg'})
    assert client.get(items[0]['content_url']).status_code == 502  # la redirección sale de los anfitriones permitidos
    assert not any('evil.test' in call for call in calls)


def test_dns_rebinding_cannot_change_the_address_after_validation(banks_api, monkeypatch):
    """El nom es resol una vegada per salt i la connexió usa eixa IP; un segon DNS maliciós no s'arriba a consultar."""
    module, client, _, routes, calls, banks = banks_api
    answers = iter([[(0, 0, 0, '', ('93.184.216.34', 443))], [(0, 0, 0, '', ('127.0.0.1', 443))],
                    [(0, 0, 0, '', ('169.254.169.254', 443))]])
    resolved = []

    def rebinding(host):
        resolved.append(host)
        return next(answers)  # 1a resposta pública, les següents internes

    monkeypatch.setattr(banks, 'resolve', rebinding)
    routes['https://api.arasaac.org/api/pictograms/es/search/sol'] = j([])
    assert client.get('/api/assets/v1/banks/arasaac/search?q=sol').status_code == 200
    assert resolved == ['api.arasaac.org']  # una sola resolució; la connexió va a la IP pública validada
    # Si la primera resposta ja és interna, ni tan sols es connecta.
    resolved.clear()
    answers = iter([[(0, 0, 0, '', ('127.0.0.1', 443))]])
    calls.clear()
    assert client.get('/api/assets/v1/banks/arasaac/search?q=sol').status_code == 502
    assert calls == []


def test_mixed_public_and_private_answers_are_refused(banks_api, monkeypatch):
    module, client, _, routes, calls, banks = banks_api
    monkeypatch.setattr(banks, 'resolve', lambda host: [(0, 0, 0, '', ('93.184.216.34', 443)), (0, 0, 0, '', ('10.0.0.8', 443))])
    assert client.get('/api/assets/v1/banks/arasaac/search?q=sol').status_code == 502
    assert calls == []
