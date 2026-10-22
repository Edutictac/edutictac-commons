"""Real Play HTTP workflow; identity and bank boundaries are isolated test servers."""
import json
import os
import subprocess
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import pytest

@pytest.fixture
def play(tmp_path):
    model={'teacher_allowed':True,'student_active':True,'bank_fail':False,'publishes':[],'withdraws':0}
    class Upstream(BaseHTTPRequestHandler):
        def log_message(self,*args):pass
        def reply(self,status,data):
            raw=json.dumps(data).encode();self.send_response(status);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
        def do_GET(self):
            path=urlsplit(self.path);user=self.headers.get('Cookie','')
            if path.path=='/api/auth/me':
                if user in {'student-a','student-b'}:return self.reply(200,{'identity':{'id':user,'group_id':'class-a','role':'alumno'}})
                if user in {'teacher','outsider'}:return self.reply(200,{'identity':{'id':user,'role':'profesor','provider':'authentik'}})
                return self.reply(401,{})
            if path.path=='/api/play/access':
                if user in {'student-a','student-b'} and model['student_active']:
                    return self.reply(200,{'actor':user,'role':'student','group_id':'class-a','class_name':'Class A','can_publish':False,'can_submit':True,'can_review':False})
                if user in {'teacher','outsider'}:
                    permitted=user=='teacher' and model['teacher_allowed']
                    query=parse_qs(path.query)
                    if query.get('group_id') and not permitted:return self.reply(404,{})
                    if query.get('student_id') and not model['student_active']:return self.reply(409,{})
                    return self.reply(200,{'actor':user,'role':'teacher','can_publish':True,'can_submit':False,'can_review':True,'groups':[{'id':'class-a','name':'Class A'}] if permitted else []})
                return self.reply(401,{})
            return self.reply(404,{})
        def do_POST(self):
            raw=self.rfile.read(int(self.headers.get('Content-Length','0')))
            if model['bank_fail']:return self.reply(503,{})
            if self.path.endswith('/publish'):
                model['publishes'].append(json.loads(raw));return self.reply(200,{'status':'published','resource_id':'test-resource'})
            if self.path.endswith('/unpublish'):
                model['withdraws']+=1;return self.reply(200,{'status':'unpublished','resource_id':'test-resource'})
            return self.reply(404,{})
    upstream=ThreadingHTTPServer(('127.0.0.1',0),Upstream)
    thread=threading.Thread(target=upstream.serve_forever,daemon=True);thread.start()
    # Bind a disposable port before handing it to the child.
    import socket
    with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
    origin=f'http://127.0.0.1:{port}';identity=f'http://127.0.0.1:{upstream.server_port}'
    process=subprocess.Popen(['python3','server.py'],cwd=Path(__file__).parents[1]/'services/play',env={**os.environ,'HOST':'127.0.0.1','PORT':str(port),'URL_PREFIX':'','PLAY_DATA_DIR':str(tmp_path),'EDUTICTAC_ID_API_URL':identity,'EDUTICTAC_AUTH_ME_URL':identity+'/api/auth/me','RECURSOS_API_URL':identity,'PLAY_INGEST_TOKEN':'synthetic-only','PLAY_PUBLIC_URL':origin,'PLAY_DEMO_COMMONS_URL':'','PLAY_PURGE_INTERVAL_SECONDS':'0'},stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    def request(path,body=None,user='',headers=None,method=None):
        values={'Cookie':user,'Content-Type':'application/json','Origin':origin,'X-Play-Review':'1'};values.update(headers or {})
        req=Request(origin+path,data=json.dumps(body).encode() if body is not None else None,headers=values,method=method or ('POST' if body is not None else 'GET'))
        try:
            with urlopen(req,timeout=15) as reply:return reply.status,json.loads(reply.read())
        except HTTPError as error:return error.code,json.loads(error.read())
    for _ in range(100):
        try:
            with urlopen(origin+'/api/health',timeout=.2):break
        except OSError:time.sleep(.02)
    try:yield request,model,origin,tmp_path
    finally:process.terminate();process.wait(timeout=5);upstream.shutdown();upstream.server_close();thread.join()


def activity(request,user='student-a'):
    status,data=request('/api/activities',{'title':'Private pupil quiz','question':'Question','visibility':'public','answers':[{'text':'a','correct':True},{'text':'b','correct':False}]},user)
    assert status==201
    return data['id']


def test_pupil_work_stays_private_until_approved_and_can_be_withdrawn(play):
    req,model,origin,_=play
    key=activity(req)
    assert req('/api/activities/'+key)[0]==404
    assert req('/api/activities/'+key,user='student-b')[0]==404
    assert req('/api/recursos/publish',{'activity_id':key},'student-a')[0]==401
    assert req('/api/recursos/publish',{'activity_id':key},'teacher')[0]==403
    assert req('/api/submissions/'+key,{'revision':0},'student-b')[0]==404
    status,pending=req('/api/submissions/'+key,{'revision':0,'group_id':'forged'},'student-a')
    assert status==200 and pending['status']=='pending' and pending['group_id']=='class-a'
    assert req('/api/reviews',user='outsider')[1]['items']==[]
    assert req('/api/reviews/'+key,user='outsider')[0]==404
    assert req('/api/reviews/'+key,user='teacher')[1]['activity']['title']=='Private pupil quiz'
    assert req('/api/reviews/'+key,{'decision':'approve','revision':1},'student-a')[0]==404
    approved=req('/api/reviews/'+key,{'decision':'approve','revision':1},'teacher')
    assert approved[0]==200 and approved[1]['status']=='approved'
    assert req('/api/activities/'+key)[0]==200
    assert 'review' not in req('/api/activities/'+key)[1]
    assert len(model['publishes'])==1 and 'owner_id' not in json.dumps(model['publishes'])
    assert req('/api/reviews/'+key,{'decision':'approve','revision':1},'teacher')[0]==200
    assert len(model['publishes'])==1
    assert req('/api/reviews/'+key,{'decision':'return','revision':1,'feedback':'old'},'teacher')[0]==409
    assert req('/api/activities/'+key,user='student-a',method='DELETE')[0]==409
    model['student_active']=False
    assert req('/api/reviews/'+key,{'decision':'withdraw','revision':2},'teacher')[0]==200
    assert req('/api/activities/'+key)[0]==404 and model['withdraws']==1


def test_return_requires_feedback_and_resubmit_consumes_revision(play):
    req,model,_,_=play;key=activity(req)
    req('/api/submissions/'+key,{'revision':0},'student-a')
    assert req('/api/reviews/'+key,{'decision':'return','revision':1},'teacher')[0]==400
    result=req('/api/reviews/'+key,{'decision':'return','revision':1,'feedback':'Please fix this'},'teacher')
    assert result[1]['status']=='returned'
    assert req('/api/submissions/'+key,user='student-a')[1]['feedback']=='Please fix this'
    assert req('/api/submissions/'+key,{'revision':0},'student-a')[0]==409
    assert req('/api/submissions/'+key,{'revision':2},'student-a')[1]['revision']==3
    model['teacher_allowed']=False
    assert req('/api/reviews/'+key,{'decision':'approve','revision':3},'teacher')[0]==404
    assert model['publishes']==[]


def test_bank_failure_or_revoked_pupil_never_marks_approval_or_exposes_content(play):
    req,model,_,_=play;key=activity(req);req('/api/submissions/'+key,{'revision':0},'student-a')
    model['bank_fail']=True
    assert req('/api/reviews/'+key,{'decision':'approve','revision':1},'teacher')[0]==503
    assert req('/api/activities/'+key)[0]==404
    assert req('/api/reviews/'+key,user='teacher')[1]['status']=='pending'
    model['bank_fail']=False;model['student_active']=False
    assert req('/api/reviews/'+key,{'decision':'approve','revision':1},'teacher')[0]==409
    assert model['publishes']==[]


def test_review_rejects_cross_site_requests_and_anonymous_production_saves(play):
    req,model,_,_=play
    assert req('/api/activities',{'title':'anonymous','question':'q','answers':[{'text':'a','correct':True},{'text':'b'}]})[0]==401
    key=activity(req)
    for headers in [{'Origin':'https://elsewhere.invalid'},{'X-Play-Review':''},{'Sec-Fetch-Site':'cross-site'},{'Content-Type':'text/plain'}]:
        assert req('/api/submissions/'+key,{'revision':0},'student-a',headers)[0]==403
    assert req('/api/submissions/'+key,user='student-a')[1]['status']=='draft'
    assert model['publishes']==[]


def test_teacher_can_directly_publish_only_own_activity(play):
    req,model,_,_=play;key=activity(req,'teacher')
    assert req('/api/activities/'+key)[0]==200  # Explicit public visibility from teacher is accepted.
    assert req('/api/recursos/publish',{'activity_id':key},'outsider')[0]==403
    assert req('/api/recursos/publish',{'activity_id':key},'teacher')[0]==200
    assert len(model['publishes'])==1


def test_private_previews_and_reads_require_an_active_identity(play):
    req,model,_,_=play
    body={'type':'true-false','title':'Private preview','question':'Pupil work','correct':True}
    status,data=req('/api/previews',body,'student-a')
    assert status==201
    assert req('/api/activities/'+data['id'])[0]==404
    key=activity(req)
    assert req('/api/activities/'+key,user='student-a')[0]==200
    model['student_active']=False
    assert req('/api/activities/'+key,user='student-a')[0]==404
    assert req('/api/activities',user='student-a')[1]['items']==[]
