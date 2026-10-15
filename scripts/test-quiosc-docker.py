#!/usr/bin/env python3
"""Isolated smoke test using only synthetic data and disposable containers.

Build commons-quiosc-id-api:test and commons-quiosc-portal:test first.
No live stack, host configuration, credentials, or existing volumes are used.
"""
import json
import subprocess
import time
import urllib.request
import urllib.error
import http.cookiejar
import secrets
from pathlib import Path
import tempfile

prefix = 'quiosc-test-' + secrets.token_hex(4)
network = prefix + '-net'
api = prefix + '-api'
portal = prefix + '-portal'
subprocess.run(['docker', 'network', 'create', network], check=True, stdout=subprocess.DEVNULL)
try:
    subprocess.run(['docker', 'run', '-d', '--name', api, '--network', network, '--network-alias', 'id-api',
                    '--user', '1000:1000', '-e', 'EDUTICTAC_ID_DB=/data/test-id.db',
                    '-e', 'EDUTICTAC_ID_TEACHER_TOKEN=synthetic-test-teacher', '-e', 'EDUTICTAC_ID_SECRET=synthetic-test-secret',
                    '-e', 'EDUTICTAC_ID_COOKIE_SECURE=0', '-e', 'QUIOSC_MODE=simulation', '-e', 'QUIOSC_ROOMS_FILE=/app/rooms.json',
                    'commons-quiosc-id-api:test'], check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['docker', 'run', '-d', '--name', portal, '--network', network,
                    '-p', '127.0.0.1::80', 'commons-quiosc-portal:test'], check=True, stdout=subprocess.DEVNULL)
    port = subprocess.check_output(['docker', 'port', portal, '80'], text=True).strip().rsplit(':',1)[1]
    base = 'http://127.0.0.1:' + port
    for _ in range(60):
        try:
            urllib.request.urlopen(base + '/api/health', timeout=2)
            break
        except Exception:
            time.sleep(.2)
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    def request(path, data=None):
        req = urllib.request.Request(base+path, data=json.dumps(data).encode() if data is not None else None,
             headers={'Content-Type':'application/json','X-Quiosc-Request':'1','Origin':base})
        return opener.open(req, timeout=20)
    request('/api/teacher/login', {'token':'synthetic-test-teacher'})
    # Real Commons group creation and authorization; no mocks of authentication.
    group = json.load(request('/api/groups', {'name':'Test classroom', 'tenant_id':'test'}))
    group_id = group['id']
    rooms = [{'id':'lab','name':'Test lab','group_id':group_id,'devices':[
        {'id':'pc1','label':'Test PC','mac':'02:00:00:00:00:01','uid':'1000'}]}]
    with tempfile.TemporaryDirectory() as directory:
        path=Path(directory)/'rooms.json';path.write_text(json.dumps(rooms));path.chmod(0o644)
        subprocess.run(['docker','cp',str(path),api+':/app/rooms.json'],check=True,stdout=subprocess.DEVNULL)
    assert json.load(request('/api/quiosc/rooms'))['rooms'][0]['group_id']==group_id
    assert json.load(request('/api/quiosc/rooms/lab/devices'))['devices'][0]['state']=='simulation_available'
    result=json.load(request('/api/quiosc/sessions',{'room_id':'lab','devices':['pc1'],'url':'https://example.org','seconds':60}))
    sid=result['session']['id'];assert result['devices'][0]['state']=='simulation_running'
    subprocess.run(['docker','exec',api,'python','-m','quiosc.recover',sid],check=True,stdout=subprocess.DEVNULL)
    assert json.load(request('/api/quiosc/sessions/'+sid+'/stop',{}))['devices'][0]['state']=='simulation_finished'
    assert b'data-i18n="quiosc.activity"' in request('/quiosc.html').read()
    subprocess.run(['docker','exec',portal,'nginx','-t'],check=True,stdout=subprocess.DEVNULL)
    print('Docker smoke passed: real Commons login, group ACL, proxy with Origin/port, simulation, recovery, UI, nginx')
finally:
    subprocess.run(['docker','rm','-f',portal,api],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    subprocess.run(['docker','network','rm',network],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
