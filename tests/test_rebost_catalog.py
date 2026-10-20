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
    return client.get('/api/assets/v1/items',params={'collection':'catalog','limit':80,**filters}).json()['items']


def test_reviewed_collection_and_aliases_are_shared_without_personal_copies(api):
    module,a,b,_=api
    items=catalog(a)
    assert len(items)==51 and items==catalog(b)
    assert len({i['id'] for i in items})==51
    assert all(i['source_id']=='edutictac-blocs:'+i['aliases'][0] for i in items)
    assert {alias for i in items for alias in i['aliases']}>={'bloc','lua','robot','microbot','mascota','estrella','pilota','blank','forest','beach','sky','classroom'}
    assert len(catalog(a,type='background'))==16
    assert len(catalog(a,q='Bosque'))==1 and len(catalog(a,q='forest'))==1
    assert a.get('/api/assets/v1/items').json()['items']==[]
    with module.get_conn() as db:
        assert db.execute('SELECT COUNT(*) FROM assets').fetchone()[0]==0
        assert db.execute('SELECT COUNT(*) FROM asset_contents').fetchone()[0]==0
    assert a.get('/api/assets/v1/items?collection=group').status_code==422
    assert a.get('/api/assets/v1/me').json()['catalog_items']==51


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
    assert len(catalog(a))==51
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
    assert instance.catalogue.list('','','',80)['items']==original


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


def test_expanded_catalogue_keeps_original_ids_revisions_and_bytes(api):
    _,client,_,_=api
    expected = {'edutictac-blocs:beach': ('img-9a1806696d888154f977bb2584da9408e878caf8b691302f6f70154f15695098',
                               152912518749027,
                               'e4e2262d26f0e1b9d8cf1f38d66570ed5f553f63ac8b26ccccd8a6510b8242d8',
                               '2abdacd17c27439d4f0a4dbe2d14d24ec593c294101e8012903e6ffdab52bf7c'),
     'edutictac-blocs:blank': ('img-71da0211b59134cc120ec1c847c41dbed3a246a37509a6af8de2acc785947269',
                               109637636021519,
                               '9c35d706c2e00f5573bc8f7a5c659be34b59e69a42908ffb73bf7c7149d5db0b',
                               '48442e47e4a4a1b58fb6dd1ab2e1fffbb84dbce02b70dc7552799e6138ac93bb'),
     'edutictac-blocs:bloc': ('img-11fc3fc5e3db671fe5315cff2a50aaa603c2985abe8abfd89f5b35308ccd119e',
                              14199641975274,
                              '68c5d231ac959838c5ebceee155e7cd4304b802c924a6a0da71eba71ff850ee3',
                              '8794f5a04c74bcdc1bab1d28b6d966199f3e8e59e755cbacae20a3f1987d1e21'),
     'edutictac-blocs:classroom': ('img-792bff9607841fe932117f643ca130511ca41db6766227fface31dc6efc2f80c',
                                   175989872782130,
                                   'a8697b404082c362fc5621878cde55c0640a54f494a50bf14cbb44d8d8087d0f',
                                   'c6e319b682ea28022f89f0dababc9eca22d7d03cd857b16f66b176240004de31'),
     'edutictac-blocs:estrella': ('img-da1bc3c6eb658a89864f1c9d6c13a7394ede087d9ad89a652de8f0cc09207184',
                                  26843232926439,
                                  'd81eaadc318a6bfef954572eb2a801b0359c27d1fb57e48fe5df90bf7f52d559',
                                  'ae16c584ae24a6073cc00974b00c6ed801e326c785915008ec04a40ec57eb28a'),
     'edutictac-blocs:forest': ('img-ad4f67b2ef48438a432fd9df9f2f4757c6512b6a75a6aa9d60c6c0aba744f1c1',
                                264407448358239,
                                '518c79d67805afea3f9490688bff4de0ca81a508af575a018e921caea95301df',
                                '5031f019fb22d5d05212506f7d90574385c28975613768f84b4db836fbf62ade'),
     'edutictac-blocs:lua': ('img-bf2fb364aeec97da0718dbe65d031663ee862682166d25f915924289f8b2b4cc',
                             219415399858444,
                             '2aa4b17c36521f9d53cf77e974e816e10a614d1fdb2169617338dd17530cc5b5',
                             '39995891687555d0235c6de4416b494b702a35c5485464ebc6bd1b7597a46677'),
     'edutictac-blocs:mascota': ('img-d66218684963d917cc6d40e0948fba4ec0b98c2453dd1935c6aa49331231022d',
                                 78562271376915,
                                 '72e1bec407d469b4c3894dd730b586b6b6dc5d9abb0bc8dcd3416f938d9c1333',
                                 '6749b9ad4006a3f4a628b7a32d47dc47c67c80b228b5ab69c29a52272505abba'),
     'edutictac-blocs:microbot': ('img-8c9c10e9227c6f78a3b623003a239b4e18988879734dde3a67250a5051fbfbbf',
                                  182072820972984,
                                  '840f7be55483ebc7e53046472ce1417353aeea3417733b83a1487624d7b58143',
                                  'c2e3b5d2408fc6be9ee1a1215edc47f0c57e49350bd679f5dfd8785c3f26e39f'),
     'edutictac-blocs:pilota': ('img-e68d8f4d4be5e5150a4f3a4a182b1bb9fd0d38f1f008f428b7589d7e164c35b3',
                                117305473760113,
                                '9b588e2586887b50a18a98e451b1f1a96a7cfd52e0cfafcebbfdb4cc3c3502d8',
                                '1752d995ea38780fa53146cbc04a87a9dba9f0c7a21ceabc4f865c9cf0b9f53c'),
     'edutictac-blocs:robot': ('img-ace832d72e7162b1fa53ee31e6acc44d7a0110f9d880b47a0d0eb01257d60b90',
                               23424950310501,
                               '3f8ba21c8d88e98c084c48c2a1550be031b881a8ae50c782f9ddcef0134b3dde',
                               '75719300469050771dd84ced59ba07bc7573c998097f15993ef9d25539782572'),
     'edutictac-blocs:sky': ('img-34078e9c216823637e88bde427c8e4349f99a3f119e3636283bf2cb7ea2c8b32',
                             157665753570254,
                             '6732a575e7bf88929b96b57336718f024c03309a9b58ceed851d171a2033d211',
                             'ac8d566d277a8e3f6f7a87bf8f4c72609b61ebee946819b859bff863367a0c8a')}
    manifest=json.loads((ROOT/'services/id-api/assets/catalog/manifest.json').read_text())
    current={item['source_id']:item for item in manifest['items']}
    for key,value in expected.items():
        item=current[key]
        assert (item['id'],item['revision'],item['image']['sha256'],item['source']['sha256'])==value


def test_expanded_catalogue_pagination_types_and_bilingual_search(api):
    _,client,_,_=api
    found=[];cursor=''
    while True:
        response=client.get('/api/assets/v1/items',params={'collection':'catalog','limit':7,'cursor':cursor})
        assert response.status_code==200
        page=response.json();found.extend(page['items']);cursor=page['next_cursor']
        if not cursor:break
    assert len(found)==len({item['id'] for item in found})==51
    assert [item['id'] for item in found]==sorted(item['id'] for item in found)
    for kind,count in [('sprite',17),('background',16),('object',18)]:
        assert len(catalog(client,type=kind))==count
    apple=catalog(client,q='Manzana')[0]
    assert catalog(client,q='Poma')==[apple]
    assert apple['type']=='object' and apple['aliases']==['poma']
    assert catalog(client,q='Pip asustado')==catalog(client,q='Pip espantat')
    assert catalog(client,q='fons-models-ca')[0]['id']!=catalog(client,q='fons-models-es')[0]['id']
    assert client.get(path(apple)+'/content').status_code==200
    assert client.get(path(apple)+'/source').status_code==200
