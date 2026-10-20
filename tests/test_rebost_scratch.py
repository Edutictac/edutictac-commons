"""Scratch is a distinct, reviewed, offline collection with its own license."""
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil

import pytest
from fastapi.testclient import TestClient

from test_rebost import api, path, revision
from test_rebost_catalog import derived

ROOT = Path(__file__).parents[1]
PACKAGE = ROOT / 'services/id-api/assets/catalog-scratch'


def scratch(client, **filters):
    response = client.get('/api/assets/v1/items', params={'collection': 'scratch', 'limit': 80, **filters})
    assert response.status_code == 200
    return response.json()['items']


def test_scratch_is_distinct_readonly_bilingual_and_available_to_both_users(api):
    _, a, b, _ = api
    items = scratch(a)
    assert len(items) == 31 and items == scratch(b)
    assert len(a.get('/api/assets/v1/items', params={'collection': 'catalog', 'limit': 80}).json()['items']) == 51
    assert a.get('/api/assets/v1/items').json()['items'] == []
    assert all(item['readonly'] and item['collection'] == 'scratch' and item['license'] == 'CC-BY-SA-2.0' for item in items)
    for kind, count in [('sprite', 15), ('background', 10), ('object', 6)]:
        assert len(scratch(a, type=kind)) == count
    assert scratch(a, q='Murciélago') == scratch(a, q='Ratpenat')
    assert scratch(a, q='scratch-apple')[0]['names'] == {'es': 'Manzana', 'ca': 'Poma'}
    profile = a.get('/api/assets/v1/me').json()
    assert profile['catalog_items'] == 51 and profile['scratch_items'] == 31
    assert 'scratch_catalog' in profile['capabilities']
    assert not any(word in item['source_path'].lower() for item in items for word in ['gobo', 'pico', 'nano', 'giga', 'tera', 'scratch cat'])


def test_scratch_sources_match_historical_hashes_and_license(api):
    _, a, _, _ = api
    manifest = json.loads((PACKAGE / 'manifest.json').read_text())
    review = json.loads((PACKAGE / manifest['review_file']['path']).read_text())
    approved = {entry['id']: entry for entry in review['items']}
    for item in scratch(a):
        source = a.get(path(item) + '/source')
        assert source.status_code == 200
        assert hashlib.md5(source.content).hexdigest() + '.svg' == approved[item['id']]['md5ext']
        assert hashlib.sha256(source.content).hexdigest() == approved[item['id']]['sha256']
        assert source.headers['Content-Type'] == 'application/octet-stream'
        assert source.headers['Content-Disposition'].startswith('attachment;')
        license_text = a.get(path(item) + '/license').text
        assert 'CC BY-SA 2.0' in license_text and 'License Grant' in license_text and 'Restrictions' in license_text


def test_scratch_copies_and_drawings_preserve_cc_license_and_private_ownership(api):
    module, a, b, _ = api
    original = scratch(a, q='scratch-apple')[0]
    assert a.patch(path(original), headers=revision(original), json={'name': 'Changed', 'type': 'object'}).status_code == 404
    assert a.delete(path(original), headers=revision(original)).status_code == 404
    own = a.post(path(original) + '/copies', headers=revision(original)).json()
    drawing = derived(a, original).json()
    for item in [own, drawing]:
        assert item['provenance']['license'] == 'CC-BY-SA-2.0'
        assert item['provenance']['source_id'] == original['source_id']
        assert b.get(path(item)).status_code == 404
        assert b.get(path(item) + '/source').status_code == 404
    source = a.get(path(original) + '/source').content
    module.rebost.catalogue.items.clear()
    for item in [own, drawing]:
        assert a.get(path(item) + '/source').content == source
        assert 'CC BY-SA 2.0' in a.get(path(item) + '/license').text


def test_scratch_requires_individual_authentication(api):
    module, a, _, _ = api
    anonymous = TestClient(module.app)
    item = scratch(a)[0]
    for endpoint in ['/api/assets/v1/items?collection=scratch', path(item), path(item) + '/content', path(item) + '/source', path(item) + '/license']:
        assert anonymous.get(endpoint).status_code == 401


@pytest.mark.parametrize('damage', ['license', 'review_path', 'review_hash', 'source_identity'])
def test_scratch_rejects_unreviewed_packages(api, tmp_path, damage):
    from assets.catalogue import Catalogue, canonical
    from assets import normalize
    folder = tmp_path / 'scratch'
    shutil.copytree(PACKAGE, folder)
    manifest = json.loads((folder / 'manifest.json').read_text())
    item = manifest['items'][0]
    if damage == 'license':
        item['license'] = 'GPL-3.0-only'
    elif damage == 'review_path':
        manifest['review_file']['path'] = '../review.json'
    elif damage == 'review_hash':
        (folder / manifest['review_file']['path']).write_text('{}')
    else:
        raw = (folder / item['source']['path']).read_bytes() + b' '
        (folder / item['source']['path']).write_bytes(raw)
        item['source']['sha256'] = hashlib.sha256(raw).hexdigest()
    if damage in {'license', 'source_identity'}:
        item.pop('revision')
        item['revision'] = int(hashlib.sha256(canonical(item)).hexdigest()[:12], 16)
    (folder / 'manifest.json').write_text(json.dumps(manifest))
    with pytest.raises(ValueError):
        Catalogue(folder, normalize, 'scratch')


def test_scratch_builder_rejects_active_svg_and_external_references():
    spec = importlib.util.spec_from_file_location('scratch_builder', ROOT / 'scripts/build-scratch-catalog.py')
    builder = importlib.util.module_from_spec(spec); spec.loader.exec_module(builder)
    for child in ['<script/>', '<foreignObject/>', '<style>@import "https://example.test";</style>',
                  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://example.test/a.svg"/>',
                  '<path style="background:red"/>', '<path fill="url(https://example.test/a)"/>',
                  '<path fill="url(#unknown)"/>']:
        with pytest.raises(ValueError):
            builder.reviewed_svg(('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">' + child + '</svg>').encode())
    with pytest.raises(ValueError):
        builder.reviewed_svg(b'<!DOCTYPE svg [<!ENTITY x "bad">]><svg/>')
