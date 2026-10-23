"""Real SQLite, authenticated cookies, streaming bodies and filesystem isolation."""
import hashlib
import json
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import quote

from fastapi import Response
from fastapi.testclient import TestClient
import pytest

from test_group_access_matrix import load, client_for


@pytest.fixture
def api(tmp_path, monkeypatch):
    module = load(tmp_path,monkeypatch)
    with module.get_conn() as db:
        db.execute("DELETE FROM classroom_files")
        db.execute("INSERT INTO student_identities (id,group_id,public_code,pin_hash,created_at,updated_at) VALUES ('i3','G','GHI','unused','x','x')")
    def pupil(who):
        response = Response();module.set_student_session(response,who)
        client = TestClient(module.app);client.headers['Cookie']=response.headers['set-cookie'].split(';')[0];client.headers['Origin']='http://testserver'
        return client
    return module, {actor:client_for(module,actor) for actor in ['owner','member','former','stranger','admin']}, {who:pupil(who) for who in ['i1','i2','i3']}


def upload(client, path='activitat/apunts.txt', content=b'Hola aula', student=False, replace=False, **headers):
    return client.post('/api/student/group-files' if student else '/api/teacher/groups/G/files',content=content,
        headers={'X-File-Path':quote(path,safe=''),'Content-Type':'application/octet-stream',**({'X-File-Replace':'1'} if replace else {}),**headers})


def test_shared_and_private_submissions(api):
    module,t,p = api
    shared=upload(t['owner']).json()['id']
    private=upload(p['i1'],'tasca.txt',student=True).json()['id']
    assert len(t['member'].get('/api/teacher/groups/G/files').json()['files'])==2
    assert {x['id'] for x in p['i3'].get('/api/student/group-files').json()['files']}=={shared}
    assert len(p['i2'].get('/api/student/group-files').json()['files'])==0
    assert {x['id'] for x in p['i1'].get('/api/student/group-files').json()['files']}=={shared,private}
    for who in ['i2','i3']:
        assert p[who].get('/api/student/group-files/'+private+'/download').status_code==404
        assert p[who].delete('/api/student/group-files/'+private).status_code==404
    assert p['i1'].delete('/api/student/group-files/'+shared).status_code==404
    assert t['member'].get('/api/teacher/groups/G/files/'+private+'/download').content==b'Hola aula'
    assert p['i1'].delete('/api/student/group-files/'+private).status_code==200
    assert t['owner'].delete('/api/teacher/groups/G/files/'+shared).status_code==200
    assert not list(module.commons.files.root.glob('*/*txt'))


def test_replace_requires_explicit_confirmation_and_keeps_stable_id(api):
    module,t,p=api
    first=upload(t['owner'],'Valencià/àlbum.txt').json()
    assert upload(t['member'],'Valencià/àlbum.txt').status_code==409
    changed=upload(t['member'],'Valencià/àlbum.txt',b'Nou',replace=True)
    assert changed.status_code==201 and changed.json()=={'id':first['id'],'replaced':True}
    listing=t['owner'].get('/api/teacher/groups/G/files').json()
    assert len(listing['files'])==1
    row=listing['files'][0]
    assert row['size']==3 and row['sha256']==hashlib.sha256(b'Nou').hexdigest()
    assert 'storage_name' not in row
    assert listing['usage']['group_bytes']==3
    assert len(list(module.commons.files.root.glob('*/*.txt')))==1


def test_download_is_attachment_and_private(api):
    _,t,p=api
    item=upload(t['owner'],'Carpeta/àlbum.txt',b'Contingut').json()['id']
    response=p['i1'].get('/api/student/group-files/'+item+'/download')
    assert response.content==b'Contingut'
    assert response.headers['content-type']=='application/octet-stream'
    assert "filename*=UTF-8''%C3%A0lbum.txt" in response.headers['content-disposition']
    assert response.headers['cache-control']=='private, no-store'
    assert response.headers['x-content-type-options']=='nosniff'


@pytest.mark.parametrize('path',['../x.txt','/x.txt','a/../x.txt','a//x.txt','a\\x.txt','.hidden/a.txt','a/.env','x.html','x.svg','x.js','x.exe','C:/x.txt','x\n.txt'])
def test_unsafe_names_and_extensions(api,path):
    module,t,_=api
    assert upload(t['owner'],path).status_code in (415,422)
    assert t['owner'].get('/api/teacher/groups/G/files').json()['files']==[]


@pytest.mark.parametrize('path,data',[('fake.png',b'MZexecutable'),('fake.pdf',b'not pdf'),('fake.txt',b'<svg onload=alert(1)>'),('fake.txt',b'\x00\xff'),('empty.txt',b''),('fake.mp4',b'not a video')])
def test_camouflaged_content_is_rejected_without_leaving_blobs(api,path,data):
    module,t,_=api
    assert upload(t['owner'],path,data).status_code==415
    assert not list(module.commons.files.root.glob('*/*'))


def settings(client,**overrides):
    values=dict(max_file_bytes=50*1024**2,group_quota_bytes=500*1024**2,student_quota_bytes=50*1024**2,students_can_upload=True)
    return client.put('/api/admin/files/settings',json={**values,**overrides})


def test_settings_permissions_and_limits_take_effect_without_restart(api):
    _,t,p=api
    assert t['owner'].get('/api/admin/files/settings').status_code==403
    assert settings(t['owner']).status_code==403
    assert settings(t['admin'],max_file_bytes=8,group_quota_bytes=12,student_quota_bytes=9).status_code==200
    assert upload(t['owner'],content=b'123456789').status_code==413
    assert upload(t['owner'],content=b'12345678').status_code==201
    assert upload(p['i1'],'entrega.txt',b'12345',student=True).status_code==413
    assert upload(p['i1'],'entrega.txt',b'1234',student=True).status_code==201
    assert upload(t['owner'],content=b'X',replace=True).status_code==201
    assert settings(t['admin'],students_can_upload=False).status_code==200
    assert upload(p['i1'],'altra.txt',b'X',student=True).status_code==403
    assert p['i1'].get('/api/student/group-files').status_code==200
    assert settings(t['admin'],max_file_bytes=101*1024**2).status_code==422
    assert settings(t['admin'],group_quota_bytes=10,student_quota_bytes=11).status_code==422


def test_student_quota_streaming_limit_and_disk_reserve(api,monkeypatch):
    module,t,p=api
    assert settings(t['admin'],max_file_bytes=8,group_quota_bytes=100,student_quota_bytes=10).status_code==200
    assert upload(p['i1'],'one.txt',b'123456',student=True).status_code==201
    assert upload(p['i1'],'two.txt',b'12345',student=True).status_code==413
    response=p['i1'].post('/api/student/group-files',content=iter([b'12345',b'67890']),headers={'X-File-Name':'stream.txt'})
    assert response.status_code==413
    monkeypatch.setattr('idapi.classroom_files.shutil.disk_usage',lambda p:SimpleNamespace(free=1))
    assert upload(t['owner'],content=b'X').status_code==507


@pytest.mark.parametrize('actor',['former','stranger','admin'])
def test_nonmembers_cannot_access_pedagogical_files(api,actor):
    _,t,_=api
    item=upload(t['owner']).json()['id'];client=t[actor]
    assert client.get('/api/teacher/groups/G/files').status_code==404
    assert upload(client).status_code==404
    assert client.get('/api/teacher/groups/G/files/'+item+'/download').status_code==404
    assert client.delete('/api/teacher/groups/G/files/'+item).status_code==404


def test_member_revocation_and_group_deletion_remove_access_and_blobs(api):
    module,t,p=api
    upload(t['member']);upload(p['i1'],'private.txt',student=True)
    assert t['owner'].delete('/api/teacher/groups/G/members/member').status_code==200
    assert t['member'].get('/api/teacher/groups/G/files').status_code==404
    assert t['owner'].post('/api/identities/i1/revoke').status_code==200
    assert len(t['owner'].get('/api/teacher/groups/G/files').json()['files'])==2
    assert p['i1'].get('/api/student/group-files').status_code==401
    assert t['owner'].delete('/api/teacher/groups/G').status_code==200
    assert not module.commons.files.group_dir('G').exists()
    with module.get_conn() as db:assert db.execute('SELECT COUNT(*) FROM classroom_files').fetchone()[0]==0


def test_cross_origin_and_anonymous_writes_denied(api):
    module,t,p=api
    assert upload(t['owner'],Origin='https://other.test').status_code==403
    assert upload(t['owner'],**{'Sec-Fetch-Site':'cross-site'}).status_code==403
    anonymous=TestClient(module.app);anonymous.headers['Origin']='http://testserver'
    assert anonymous.get('/api/student/group-files').status_code==401
    assert upload(anonymous,student=True).status_code==401
    assert anonymous.get('/api/teacher/groups/G/files').status_code in (401,503)


def test_orphan_cleanup_preserves_committed_files_and_rejects_symlinks(api,tmp_path):
    module,t,p=api
    item=upload(t['owner']).json()['id']
    root=module.commons.files.group_dir('G')
    (root/'.upload-interrupted').write_text('interrupted')
    (root/('a'*32+'.txt')).write_text('orphan')
    module.commons.files.cleanup()
    assert not (root/'.upload-interrupted').exists()
    assert not (root/('a'*32+'.txt')).exists()
    assert t['owner'].get('/api/teacher/groups/G/files/'+item+'/download').status_code==200
    with module.get_conn() as db:row=db.execute('SELECT storage_name FROM classroom_files WHERE id=?',(item,)).fetchone()
    blob=module.commons.files.root/row['storage_name'];blob.unlink();outside=tmp_path/'outside.txt';outside.write_text('private');blob.symlink_to(outside)
    assert t['owner'].get('/api/teacher/groups/G/files/'+item+'/download').status_code==404


def test_environment_defaults_are_validated_and_can_disable_pupil_uploads(api,tmp_path):
    from idapi.settings import Settings
    from idapi.context import Commons
    values={'EDUTICTAC_ID_DB':str(tmp_path/'env.db'),'EDUTICTAC_ID_FILES_MAX_BYTES':'100','EDUTICTAC_ID_FILES_GROUP_QUOTA_BYTES':'500','EDUTICTAC_ID_FILES_STUDENT_QUOTA_BYTES':'200','EDUTICTAC_ID_FILES_STUDENTS_CAN_UPLOAD':'0'}
    context=Commons(Settings.from_env(values));context.db.migrate()
    with context.connect() as db:assert context.files.settings(db)==dict(max_file_bytes=100,group_quota_bytes=500,student_quota_bytes=200,students_can_upload=False)
    with pytest.raises(ValueError,match='Invalid classroom file limits'):
        Commons(Settings.from_env({**values,'EDUTICTAC_ID_FILES_MAX_BYTES':'-1'}))


def test_simultaneous_submissions_wait_for_the_active_upload(api):
    import fcntl
    import threading
    module,t,p=api
    root=module.commons.files.directory()
    with (root/'.write.lock').open('a') as stream:
        fcntl.flock(stream.fileno(),fcntl.LOCK_EX)
        release=threading.Timer(0.15,lambda:fcntl.flock(stream.fileno(),fcntl.LOCK_UN));release.start()
        try:assert upload(p['i1'],'queued.txt',student=True).status_code==201
        finally:release.join()
