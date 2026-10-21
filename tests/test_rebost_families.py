"""Reviewed Scratch characters are families, without changing individual assets."""
import hashlib
import json
from pathlib import Path
import shutil

import pytest
from fastapi.testclient import TestClient

from test_rebost import api, path, revision


def groups(client, **filters):
    response=client.get('/api/assets/v1/items',params={'collection':'scratch','grouped':'true','limit':80,**filters})
    assert response.status_code==200
    return response.json()


def test_grouped_scratch_has_31_families_but_keeps_all_61_individual_images(api):
    _,a,b,_=api
    listed=groups(a)
    assert len(listed['items'])==31 and listed==groups(b)
    assert len(groups(a,type='sprite')['items'])==15
    assert len(groups(a,type='object')['items'])==6
    assert len(groups(a,type='background')['items'])==10
    plain=a.get('/api/assets/v1/items',params={'collection':'scratch','limit':80}).json()
    assert len(plain['items'])==61
    assert a.get('/api/assets/v1/me').json()['scratch_items']==61
    assert a.get('/api/assets/v1/me').json()['scratch_families']==31
    assert a.get('/api/assets/v1/items',params={'collection':'mine','grouped':'true'}).status_code==422


def test_family_is_derived_from_reviewed_original_character_not_translated_numbers(api):
    _,a,_,_=api
    bat=groups(a,q='scratch-bat-b')['items']
    assert len(bat)==1 and bat[0]['names']=={'ca':'Ratpenat','es':'Murciélago'}
    assert bat[0]['family']['count']==4
    result=a.get(path(bat[0])+'/family')
    assert result.status_code==200
    family=result.json()
    assert family['format']=='rebost-asset-family' and family['version']==1
    assert family['id']==bat[0]['id'] and family['items'][0]['id']==bat[0]['id']
    assert [item['names']['ca'] for item in family['items']]==['Ratpenat','Ratpenat (2)','Ratpenat (3)','Ratpenat (4)']
    assert all(item['family']['id']==family['id'] and item['family']['revision']==family['revision'] for item in family['items'])
    assert result.headers['etag']=='"'+str(family['revision'])+'"'
    butterflies=groups(a,q='Papallona')['items']
    assert len(butterflies)==2 and {item['names']['ca'] for item in butterflies}=={'Papallona 1','Papallona 2'}


def test_group_pagination_and_search_do_not_drop_costumes(api):
    _,a,_,_=api
    items=[];cursor=''
    while True:
        result=groups(a,limit=5,cursor=cursor)
        items.extend(result['items']);cursor=result['next_cursor']
        if not cursor:break
    assert len(items)==len({item['id'] for item in items})==31
    members=[]
    for item in items:
        family=a.get(path(item)+'/family').json()
        members.extend(member['id'] for member in family['items'])
    assert len(members)==len(set(members))==61
    assert groups(a,q='Murciélago (3)')==groups(a,q='Ratpenat (3)')


def test_family_reads_are_public_and_do_not_group_private_copies(api):
    module,a,b,_=api
    primary=groups(a,q='scratch-bat')['items'][0]
    anonymous=TestClient(module.app)
    for endpoint in ['/api/assets/v1/items?collection=scratch&grouped=true',path(primary)+'/family']:
        assert anonymous.get(endpoint).status_code==200
    own=a.post(path(primary)+'/copies',headers=revision(primary)).json()
    assert own['collection']=='mine' and 'family' not in own
    assert a.get(path(own)+'/family').status_code==404
    assert b.get(path(own)+'/family').status_code==404
    assert a.delete(path(primary),headers=revision(primary)).status_code==404


def test_family_preserves_original_svg_viewbox_adjusted_rotation_centres(api):
    _,a,_,_=api
    bat=groups(a,q='scratch-bat')['items'][0]
    members=a.get(path(bat)+'/family').json()['items']
    assert members[0]['rotation_center']['x']==pytest.approx(80.4757,abs=0.001)
    assert members[0]['rotation_center']['y']==pytest.approx(60.8251,abs=0.001)
    assert members[1]['rotation_center']!=members[0]['rotation_center']


@pytest.mark.parametrize('damage',['missing','non_numeric','out_of_bounds'])
def test_invalid_family_centres_are_rejected_before_serving(api,tmp_path,damage):
    from assets.catalogue import Catalogue
    from assets import normalize
    source=Path(__file__).parents[1]/'services/id-api/assets/catalog-scratch'
    folder=tmp_path/'scratch';shutil.copytree(source,folder)
    manifest=json.loads((folder/'manifest.json').read_text())
    target=folder/manifest['review_file']['path'];review=json.loads(target.read_text())
    if damage=='missing':review['items'][0].pop('rotation_center')
    else:review['items'][0]['rotation_center']['x']='wrong' if damage=='non_numeric' else 9000
    data=json.dumps(review).encode();target.write_bytes(data)
    manifest['review_file']['sha256']=hashlib.sha256(data).hexdigest()
    (folder/'manifest.json').write_text(json.dumps(manifest))
    with pytest.raises(ValueError):Catalogue(folder,normalize,'scratch')
