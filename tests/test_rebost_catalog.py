"""System catalogue stays read-only and distinct from private image ownership."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil

import pytest

from test_rebost import api, path, revision, upload

ROOT=Path(__file__).parents[1]


def catalog(client, **filters):
    return client.get('/api/assets/v1/items',params={'collection':'catalog',**filters}).json()['items']


def test_reviewed_collection_and_aliases_are_shared_without_personal_copies(api):
    module,a,b,_=api
    items=catalog(a)
    assert len(items)==12 and items==catalog(b)
    assert len({i['id'] for i in items})==12
    assert all(i['source_id']=='edutictac-blocs:'+i['aliases'][0] for i in items)
    assert {alias for i in items for alias in i['aliases']}=={'bloc','lua','robot','microbot','mascota','estrella','pilota','blank','forest','beach','sky','classroom'}
    assert len(catalog(a,type='background'))==5
    assert len(catalog(a,q='Bosque'))==1 and len(catalog(a,q='forest'))==1
    assert a.get('/api/assets/v1/items').json()['items']==[]
    with module.get_conn() as db:
        assert db.execute('SELECT COUNT(*) FROM assets').fetchone()[0]==0
        assert db.execute('SELECT COUNT(*) FROM asset_contents').fetchone()[0]==0
    assert a.get('/api/assets/v1/items?collection=group').status_code==422
    assert a.get('/api/assets/v1/me').json()['catalog_items']==12


def test_catalogue_writes_cannot_modify_or_delete_originals(api):
    _,a,_,_=api
    item=catalog(a)[0]
    assert a.patch(path(item),headers=revision(item),json={'name':'Changed','type':'sprite'}).status_code==404
    assert a.delete(path(item),headers=revision(item)).status_code==404
    assert a.get(path(item)).json()==item
    assert a.get(path(item)+'/content').status_code==200
    assert a.post(path(item)+'/copies',headers={'If-Match':'"0"'}).status_code==412


def test_copy_is_private_and_keeps_corresponding_source_and_license(api):
    module,a,b,_=api
    original=catalog(a,q='Bloc')[0]
    result=a.post(path(original)+'/copies',headers=revision(original))
    assert result.status_code==201
    item=result.json()
    assert item['collection']=='mine' and item['readonly'] is False and item['id']!=original['id']
    assert item['provenance']['license']=='GPL-3.0-only'
    assert item['provenance']['source_id']==original['source_id']
    assert a.get(path(item)+'/content').content==a.get(path(original)+'/content').content
    source=a.get(path(item)+'/source');license_file=a.get(path(item)+'/license')
    assert source.content==a.get(path(original)+'/source').content
    assert source.headers['Content-Type']=='application/octet-stream'
    assert source.headers['Content-Disposition'].startswith('attachment;')
    assert source.headers['Content-Security-Policy']=="default-src 'none'; sandbox"
    assert b.get(path(item)+'/source').status_code==404
    assert b.get(path(item)+'/license').status_code==404
    assert b.get('/api/assets/v1/items').json()['items']==[]
    assert b'GNU GENERAL PUBLIC LICENSE' in license_file.content
    assert a.patch(path(item),headers=revision(item),json={'name':'Private copy','type':'object'}).status_code==200
    changed=a.get(path(item)).json()
    assert changed['provenance']==item['provenance'] and a.get(path(original)).json()['name']==original['name']
    assert a.patch(path(item),headers=revision(changed),json={'name':'X','type':'sprite','provenance':None}).status_code==422
    second=a.post(path(item)+'/copies',headers=revision(changed)).json()
    assert second['provenance']==item['provenance']
    assert a.get(path(second)+'/source').content==source.content
    # A private snapshot remains self-contained if the bundled catalogue changes/disappears.
    module.rebost.catalogue.items.clear()
    assert a.get(path(second)+'/source').content==source.content
    assert a.get(path(second)+'/license').content==license_file.content
    assert a.delete(path(changed),headers=revision(changed)).status_code==204
    assert a.delete(path(second),headers=revision(second)).status_code==204
    with module.get_conn() as db:
        assert db.execute('SELECT COUNT(*) FROM asset_provenance').fetchone()[0]==0
        assert db.execute('SELECT COUNT(*) FROM asset_contents').fetchone()[0]==0


def test_catalogue_not_charged_to_user_but_private_copy_uses_limits(api,monkeypatch):
    import assets
    module,a,_,_=api
    item=catalog(a)[0]
    monkeypatch.setattr(assets,'MAX_ITEMS',1)
    first=a.post(path(item)+'/copies',headers=revision(item))
    assert first.status_code==201
    assert len(catalog(a))==12
    assert a.post(path(item)+'/copies',headers=revision(item)).status_code==413
    own=first.json()
    a.delete(path(own),headers=revision(own))
    monkeypatch.setattr(assets,'MAX_USER_BYTES',1)
    assert a.post(path(item)+'/copies',headers=revision(item)).status_code==413
    with module.get_conn() as db:
        assert db.execute('SELECT COUNT(*) FROM assets').fetchone()[0]==0
        assert db.execute('SELECT COUNT(*) FROM asset_provenance').fetchone()[0]==0
    assert module.rebost.catalogue.total_bytes>0


def test_catalogue_survives_reload_with_stable_ids_and_revisions(api):
    module,a,_,_=api
    original=catalog(a)
    instance=type(module.rebost)(module.get_conn,module.DB_PATH,module.oidc_cookie,module.current_identity)
    assert instance.catalogue.list('','','',40)['items']==original


def test_license_and_source_are_available_only_to_authenticated_individuals(api):
    from fastapi.testclient import TestClient
    module,a,_,_=api
    item=catalog(a)[0]
    anonymous=TestClient(module.app)
    for endpoint in ['/api/assets/v1/items?collection=catalog',path(item),path(item)+'/content',path(item)+'/source',path(item)+'/license']:
        assert anonymous.get(endpoint).status_code==401
    # Normal user uploads do not invent a licence or claim catalogue provenance.
    own=upload(a).json()
    assert 'provenance' not in own
    assert a.get(path(own)+'/source').status_code==404


@pytest.mark.parametrize('damage',['checksum','traversal','symlink','duplicate_alias','revision'])
def test_invalid_bundled_catalogue_is_rejected(api,tmp_path,damage):
    from assets.catalogue import Catalogue,canonical
    from assets import normalize
    folder=tmp_path/'catalog'
    shutil.copytree(ROOT/'services/id-api/assets/catalog',folder)
    manifest=json.loads((folder/'manifest.json').read_text())
    item=manifest['items'][0]
    if damage=='checksum':
        (folder/item['image']['path']).write_bytes(b'forged')
    elif damage=='traversal':
        item['source']['path']='../outside.svg'
    elif damage=='symlink':
        target=folder/item['source']['path'];target.unlink();target.symlink_to(tmp_path/'outside.svg')
    elif damage=='duplicate_alias':
        item['aliases']=manifest['items'][1]['aliases']
    elif damage=='revision':
        item['revision']=0
    if damage in {'traversal','duplicate_alias'}:
        item.pop('revision');item['revision']=int(hashlib.sha256(canonical(item)).hexdigest()[:12],16)
    (folder/'manifest.json').write_text(json.dumps(manifest))
    with pytest.raises(ValueError):Catalogue(folder,normalize)


def test_builder_rejects_active_svg_before_browser_rendering():
    spec=importlib.util.spec_from_file_location('catalog_builder',ROOT/'scripts/build-rebost-catalog.py')
    builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)
    for child in ['<script>alert(1)</script>','<image href="https://example.test/image.png"/>','<foreignObject/>',
                  '<rect width="10" height="10" fill="url(https://example.test/a)"/>']:
        raw=('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">'+child+'</svg>').encode()
        with pytest.raises(ValueError):builder.safe_svg(raw)
    with pytest.raises(ValueError):builder.safe_svg(b'<!DOCTYPE svg><svg/>')


def test_commons_backup_preserves_copied_catalogue_provenance(api,tmp_path):
    import sqlite3
    from contextlib import closing
    module,a,_,_=api
    original=catalog(a)[0]
    own=a.post(path(original)+'/copies',headers=revision(original)).json()
    spec=importlib.util.spec_from_file_location('rebost_backup_helper',ROOT/'scripts/backup-stack.py')
    helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
    destination=tmp_path/'snapshot.db'
    helper.copy_sqlite(Path(module.DB_PATH),destination)
    with closing(sqlite3.connect(destination)) as db:
        assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
        metadata,source,license_text=db.execute('SELECT metadata,source,license_text FROM asset_provenance WHERE asset_id=?',(own['id'],)).fetchone()
        assert json.loads(metadata)==own['provenance']
        assert source==a.get(path(own)+'/source').content
        assert license_text.encode()==a.get(path(own)+'/license').content


def derived(client, source, **extra):
    from test_rebost import image
    headers={'Content-Type':'image/png','X-Rebost-Name':'Dibuix','X-Rebost-Type':'sprite',
             'X-Rebost-Source':source['id'],**revision(source),**extra}
    return client.post('/api/assets/v1/items',content=image(size=(90,140)),headers=headers)


def test_derived_upload_retains_canonical_source_license_and_owner(api):
    _,a,b,_=api
    original=catalog(a)[0]
    response=derived(a,original)
    assert response.status_code==201
    item=response.json()
    assert item['collection']=='mine' and not item['readonly']
    assert item['width']==90 and item['height']==140
    assert item['provenance']['source_id']==original['source_id']
    assert 'Derived image' in item['provenance']['changes']
    assert a.get(path(item)+'/source').content==a.get(path(original)+'/source').content
    assert a.get(path(item)+'/license').content==a.get(path(original)+'/license').content
    assert b.get(path(item)).status_code==404
    assert a.get(path(original)).json()==original
    duplicate=a.post(path(item)+'/copies',headers=revision(item)).json()
    assert duplicate['provenance']==item['provenance']


def test_derived_upload_checks_private_source_permission_and_revision_atomically(api):
    module,a,b,_=api
    original=catalog(a)[0]
    private=a.post(path(original)+'/copies',headers=revision(original)).json()
    assert derived(b,private).status_code==404
    assert derived(a,private,**{'If-Match':'"0"'}).status_code==412
    assert derived(a,original,**{'X-Rebost-Source':'../bad'}).status_code==422
    assert derived(a,original,**{'X-Rebost-Source':''}).status_code==422
    assert derived(a,original,**{'Origin':'https://foreign.test'}).status_code==403
    assert len(a.get('/api/assets/v1/items').json()['items'])==1
    result=derived(a,private)
    assert result.status_code==201
    assert result.json()['provenance']['source_id']==original['source_id']
    a.patch(path(private),headers=revision(private),json={'name':'Edited','type':'sprite'})
    assert derived(a,private).status_code==412
    with module.get_conn() as db:
        assert db.execute('SELECT COUNT(*) FROM assets').fetchone()[0]==2


def test_derived_upload_rejects_missing_provenance_and_counts_its_bytes(api,monkeypatch):
    module,a,_,_=api
    private=upload(a).json()
    assert derived(a,private).status_code==422
    original=catalog(a)[0]
    # Include source/license overhead in quota; rejection leaves no partial image or credit.
    import assets
    monkeypatch.setattr(assets,'MAX_USER_BYTES',1000)
    assert derived(a,original).status_code==413
    with module.get_conn() as db:
        assert db.execute('SELECT COUNT(*) FROM assets').fetchone()[0]==1
        assert db.execute('SELECT COUNT(*) FROM asset_provenance').fetchone()[0]==0
