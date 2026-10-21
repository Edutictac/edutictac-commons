"""The bank trusts Commons, but Commons only trusts individual teacher sessions."""
import json
from types import SimpleNamespace
import pytest
from fastapi import Response
from fastapi.testclient import TestClient
from test_rebost import api


def teacher(module,role='profesor',subject='test-teacher'):
    response=Response()
    module.set_oidc_cookie(response,{'iss':module.OIDC_ISSUER_URL,'sub':subject},role)
    client=TestClient(module.app)
    client.headers['Cookie']=response.headers['set-cookie'].split(';')[0]
    client.headers['Origin']='http://testserver'
    return client


@pytest.fixture
def upstream(request,monkeypatch):
    monkeypatch.setenv('EDUTICTAC_ID_APP_TOKEN','synthetic-publication-app-token')
    module,*_=request.getfixturevalue('api')
    calls=[]
    class FakeClient:
        def __init__(self,**kwargs):pass
        async def __aenter__(self):return self
        async def __aexit__(self,*args):pass
        async def request(self,method,url,**kwargs):
            calls.append((method,url,kwargs))
            return SimpleNamespace(status_code=200,headers={'content-type':'application/json'},content=json.dumps({'published':False,'revision':0}).encode())
    import books
    monkeypatch.setattr(books.httpx,'AsyncClient',FakeClient)
    return module,calls


@pytest.mark.parametrize('role',['profesor','administrador'])
def test_individual_teacher_can_publish_and_untrusted_owner_header_is_ignored(upstream,role):
    module,calls=upstream;client=teacher(module,role)
    assert client.get('/api/llibres/me').json()['can_publish'] is True
    assert client.post('/api/llibres/mine/'+'a'*32,content=b'zip',headers={'X-Llibres-Publisher':'spoofed'}).status_code==200
    forwarded=calls[-1][2]['headers']
    assert forwarded['X-Llibres-Publisher']!='spoofed'
    assert 'Cookie' not in forwarded
    assert client.post('/api/llibres/mine/'+'a'*32,content=b'zip',headers={'Origin':'https://evil.invalid'}).status_code==403


def test_anonymous_student_and_technical_tokens_cannot_publish(upstream):
    module,calls=upstream
    for client in [TestClient(module.app),teacher(module,'alumno')]:
        client.headers['Origin']='http://testserver'
        assert client.get('/api/llibres/me').json()['can_publish'] is False
        assert client.post('/api/llibres/mine/'+'a'*32,content=b'zip').status_code in (401,403)
    anonymous=TestClient(module.app)
    anonymous.headers['Authorization']='Bearer '+module.TEACHER_TOKEN
    assert anonymous.post('/api/llibres/mine/'+'a'*32,content=b'zip').status_code==401
    assert calls==[]


def test_revoked_teacher_cannot_publish_and_public_reads_forward_no_identity(upstream):
    module,calls=upstream;client=teacher(module)
    with module.get_conn() as db:db.execute("UPDATE asset_sessions SET revoked_at='2026'")
    assert client.get('/api/llibres/me').json()['can_publish'] is False
    assert client.post('/api/llibres/mine/'+'a'*32,content=b'zip').status_code==401
    assert client.get('/api/llibres/books').status_code==200
    assert calls[-1][2]['headers']=={}
    assert client.get('/api/llibres/source.zip').status_code==200
    assert calls[-1][2]['headers']=={}


def test_pupil_can_only_submit_to_own_class_and_cannot_approve(upstream):
    module,calls=upstream
    # Reuse a real signed, revocable pupil session from the existing fixture.
    pupil=TestClient(module.app)
    module.set_student_session(response:=Response(),'a')
    pupil.headers['Cookie']=response.headers['set-cookie'].split(';')[0]
    pupil.headers['Origin']='http://testserver'
    assert pupil.get('/api/llibres/me').json()['can_submit'] is True
    assert pupil.post('/api/llibres/submissions/'+'a'*32,content=b'zip',headers={'X-Llibres-Group':'spoofed'}).status_code==200
    assert calls[-1][2]['headers']['X-Llibres-Group']=='group'
    assert pupil.post('/api/llibres/mine/'+'a'*32,content=b'zip').status_code==401
    assert pupil.get('/api/llibres/reviews').status_code==401
    assert pupil.post('/api/llibres/reviews/'+'a'*32,json={'decision':'approve'}).status_code==401
    assert pupil.post('/api/llibres/submissions/'+'a'*32,content=b'zip',headers={'Origin':'https://evil.invalid'}).status_code==403
    with module.get_conn() as db:db.execute("UPDATE student_identities SET active=0 WHERE id='a'")
    assert pupil.get('/api/llibres/me').json()['can_submit'] is False
    assert pupil.post('/api/llibres/submissions/'+'a'*32,content=b'zip').status_code==401


def test_teacher_review_is_limited_to_current_class_membership(upstream,monkeypatch):
    module,calls=upstream
    client=teacher(module)
    teacher_id=client.get('/api/auth/me').json()['identity']['id']
    # An old compatibility cookie must not replace the individual reviewer.
    client.headers['Cookie'] += '; '+module.TEACHER_COOKIE+'='+module.make_cookie({'teacher':True,'teacher_id':'legacy-other'})
    with module.get_conn() as db:db.execute("UPDATE groups SET created_by_teacher_id=? WHERE id='group'",(teacher_id,))
    with module.get_conn() as db:
        pupil_owner=module.rebost.bind(db,'student','commons','a')
    import books
    class ReviewClient:
        def __init__(self,**kwargs):pass
        async def __aenter__(self):return self
        async def __aexit__(self,*args):pass
        async def request(self,method,url,**kwargs):
            calls.append((method,url,kwargs))
            data={'group_id':'group','owner':pupil_owner} if '/review-scope/' in url else ({'items':[],'more':False} if url.endswith('/reviews') else {})
            return SimpleNamespace(status_code=200,headers={'content-type':'application/json'},content=json.dumps(data).encode())
    monkeypatch.setattr(books.httpx,'AsyncClient',ReviewClient)
    assert client.get('/api/llibres/reviews').status_code==200
    assert json.loads(calls[-1][2]['content'])['groups']==['group']
    assert client.get('/api/llibres/reviews?all_classes=1').status_code==200
    assert json.loads(calls[-1][2]['content'])['all_classes'] is False
    admin=teacher(module,'administrador',subject='synthetic-admin')
    assert admin.get('/api/llibres/reviews').status_code==200
    assert json.loads(calls[-1][2]['content'])['all_classes'] is True
    key='b'*32
    assert client.post('/api/llibres/reviews/'+key,json={'decision':'approve'},headers={'X-Llibres-Group':'spoof'}).status_code==200
    assert calls[-1][2]['headers']['X-Llibres-Group']=='group'
    assert client.get('/api/llibres/reviews/'+key+'/files/cover.png').status_code==200
    outsider=teacher(module,subject='other-teacher')
    assert outsider.post('/api/llibres/reviews/'+key,json={'decision':'approve'}).status_code==404
    assert outsider.get('/api/llibres/reviews/'+key+'/files/index.html').status_code==404
    with module.get_conn() as db:
        db.execute("UPDATE groups SET created_by_teacher_id='elsewhere' WHERE id='group'")
        db.execute("INSERT INTO group_memberships VALUES ('group',?,'teacher','2026')",(teacher_id,))
    assert client.get('/api/llibres/reviews/'+key+'/files/index.html').status_code==200
    with module.get_conn() as db:db.execute("UPDATE student_identities SET active=0 WHERE id='a'")
    assert client.post('/api/llibres/reviews/'+key,json={'decision':'approve'}).status_code==409
    with module.get_conn() as db:db.execute('DELETE FROM group_memberships')
    assert client.get('/api/llibres/reviews/'+key+'/files/index.html').status_code==404
