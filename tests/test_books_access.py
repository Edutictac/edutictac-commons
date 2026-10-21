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
