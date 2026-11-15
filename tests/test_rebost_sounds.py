"""Sons al Rebost: validació, privacitat i convivència amb les imatges."""
from urllib.parse import quote

import pytest

from test_rebost import api, image, path, upload  # noqa: F401

OGG = b'OggS\x00\x02' + b'\x00' * 64
WAV = b'RIFF\x24\x00\x00\x00WAVEfmt ' + b'\x00' * 32
MP3 = b'ID3\x03\x00\x00\x00\x00\x00\x00' + b'\x00' * 32


def sound(client, data=OGG, name='Encert', mime='audio/ogg', kind='sound'):
    return client.post('/api/assets/v1/items', content=data,
                       headers={'Content-Type': mime, 'X-Rebost-Name': quote(name), 'X-Rebost-Type': kind})


def test_sound_roundtrip_with_real_media_type(api):
    _, a, _, _ = api
    for data, mime, ext in ((OGG, 'audio/ogg', 'ogg'), (WAV, 'audio/wav', 'wav'), (MP3, 'audio/mpeg', 'mp3')):
        created = sound(a, data, mime=mime)
        assert created.status_code == 201, created.text
        item = created.json()
        assert item['type'] == 'sound' and item['width'] == 0
        content = a.get(path(item) + '/content')
        assert content.status_code == 200 and content.content == data
        assert content.headers['content-type'].startswith(mime)
        assert content.headers['content-disposition'].endswith(f'.{ext}"')
        assert a.get(path(item) + '/thumbnail').status_code == 404


def test_sound_validation(api):
    _, a, _, _ = api
    assert sound(a, b'not audio at all').status_code == 415
    assert sound(a, WAV, mime='audio/ogg').status_code == 415
    assert sound(a, OGG, mime='video/mp4').status_code == 422
    assert sound(a, OGG + b'0' * (2 * 1024 * 1024)).status_code == 413
    assert sound(a, OGG, kind='sprite').status_code == 422
    assert upload(a, kind='sound').status_code == 422
    assert sound(a, OGG, name='').status_code == 422


def test_sounds_are_private_and_listed_apart(api):
    _, a, b, _ = api
    item = sound(a).json()
    picture = upload(a).json()
    assert b.get(path(item) + '/content').status_code == 404
    default = [x['id'] for x in a.get('/api/assets/v1/items').json()['items']]
    assert picture['id'] in default and item['id'] not in default
    only = a.get('/api/assets/v1/items', params={'type': 'sound'}).json()['items']
    assert [x['id'] for x in only] == [item['id']]
    assert 'sounds' in a.get('/api/assets/v1/me').json()['capabilities']


def test_sound_and_image_types_do_not_convert(api):
    _, a, _, _ = api
    item = sound(a).json()
    patch = a.patch(path(item), json={'name': 'X', 'type': 'sprite'}, headers={'If-Match': '"1"'})
    assert patch.status_code == 422
    renamed = a.patch(path(item), json={'name': 'Nou', 'type': 'sound'}, headers={'If-Match': '"1"'})
    assert renamed.status_code == 200 and renamed.json()['name'] == 'Nou'
    copy = a.post(path(item) + '/copies', headers={'If-Match': '"2"'})
    assert copy.status_code == 201 and copy.json()['type'] == 'sound'
    assert a.delete(path(item), headers={'If-Match': '"2"'}).status_code == 204


def test_effects_catalogue_is_public_readonly_and_copyable(api):
    _, a, b, _ = api
    listing = a.get('/api/assets/v1/items', params={'collection': 'effects', 'limit': 80}).json()
    assert listing['items'] and all(x['type'] == 'sound' and x['collection'] == 'effects' and x['readonly'] for x in listing['items'])
    found = a.get('/api/assets/v1/items', params={'collection': 'effects', 'q': 'tornar'}).json()['items']
    assert found, 'cerca en valencià pels noms i etiquetes'
    item = found[0]
    assert item['license'] == 'CC0-1.0' and item['attribution'].startswith('Kenney')
    content = b.get(path(item) + '/content')
    assert content.status_code == 200 and content.content[:4] == b'OggS' and content.headers['content-type'].startswith('audio/ogg')
    assert b.get(path(item) + '/thumbnail').status_code == 404
    # Les col·leccions d'imatges no barregen els efectes.
    assert not [x for x in a.get('/api/assets/v1/items', params={'collection': 'catalog'}).json()['items'] if x['type'] == 'sound']
    copy = a.post(path(item) + '/copies', headers={'If-Match': f'"{item["revision"]}"'})
    assert copy.status_code == 201 and copy.json()['type'] == 'sound' and copy.json()['collection'] == 'mine'
    assert a.get(path(copy.json()) + '/license').status_code == 200
    assert a.delete(path(item), headers={'If-Match': f'"{item["revision"]}"'}).status_code in {403, 404}


def test_sound_credit_and_license_are_stored(api):
    _, a, _, _ = api
    headers = {'Content-Type': 'audio/ogg', 'X-Rebost-Name': quote('Gos'), 'X-Rebost-Type': 'sound',
               'X-Rebost-Credit': quote('Autoria: Ñu — Freesound'), 'X-Rebost-License': quote('CC BY 4.0')}
    item = a.post('/api/assets/v1/items', content=OGG, headers=headers).json()
    assert item['credit'] == 'Autoria: Ñu — Freesound' and item['license'] == 'CC BY 4.0'
    headers['X-Rebost-Credit'] = quote('x' * 301)
    assert a.post('/api/assets/v1/items', content=OGG, headers=headers).status_code == 422
    # Un so copiat dels efectes conserva l'autoria i la llicència CC0.
    effect = a.get('/api/assets/v1/items', params={'collection': 'effects', 'limit': 1}).json()['items'][0]
    copy = a.post(path(effect) + '/copies', headers={'If-Match': f'"{effect["revision"]}"'}).json()
    assert copy['license'] == 'CC0-1.0' and copy['credit'].startswith('Kenney')


def _library_with_bank_url(api, monkeypatch, value):
    module, client, *_ = api
    monkeypatch.setattr(module.rebost, 'bank_search_url', value)
    return client


def test_bank_search_url_is_announced_to_every_client(api, monkeypatch):
    client = _library_with_bank_url(api, monkeypatch, 'https://crea.example.test')
    me = client.get('/api/assets/v1/me').json()
    assert me['bank_search_url'] == 'https://crea.example.test' and 'external_banks' in me['capabilities']
    catalogs = client.get('/api/assets/v1/catalogs').json()
    assert catalogs['bank_search_url'] == 'https://crea.example.test' and 'external_banks' in catalogs['capabilities']


def test_without_bank_search_url_nothing_is_announced(api):
    _, client, *_ = api
    for path in ('/api/assets/v1/me', '/api/assets/v1/catalogs'):
        data = client.get(path).json()
        assert 'bank_search_url' not in data and 'external_banks' not in data['capabilities']


@pytest.mark.parametrize('value', ['http://crea.example.test', 'https://crea.example.test/api', 'https://u:p@crea.example.test',
                                   'https://crea.example.test?x=1', 'crea.example.test'])
def test_invalid_bank_search_url_is_refused_at_startup(api, monkeypatch, value):
    module, *_ = api
    monkeypatch.setenv('REBOST_BANK_SEARCH_URL', value)
    with pytest.raises(ValueError):
        type(module.rebost)(module.rebost.connect, module.rebost.db_path, module.rebost.oidc, module.rebost.student)
