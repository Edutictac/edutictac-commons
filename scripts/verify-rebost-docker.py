#!/usr/bin/env python3
"""Check new Rebost persistence in an isolated, offline container and disposable volume.

Build first: docker build -t commons-rebost-check:local services/id-api
No installed stack, port, real account or existing volume is used.
"""
import os
from pathlib import Path
import secrets
import subprocess
import tempfile
import time
import uuid

IMAGE = os.environ.get('REBOST_TEST_IMAGE', 'commons-rebost-check:local')
name = 'rebost-check-' + uuid.uuid4().hex[:12]
volume = name + '-data'


def docker(*args, content=None):
    result = subprocess.run(['docker', *args], input=content, text=True, capture_output=True, timeout=45)
    if result.returncode:
        # Never print Docker inspect output or the environment/session material.
        raise RuntimeError('Docker check failed: ' + args[0])
    return result.stdout


CHECK = '''
import hashlib,io,json,urllib.request
from fastapi import Response
from PIL import Image
import main
with main.get_conn() as db:
    db.execute("INSERT OR IGNORE INTO groups (id,created_at,updated_at) VALUES ('rebost-check','2026','2026')")
    db.execute("INSERT OR IGNORE INTO student_identities (id,group_id,public_code,pin_hash,created_at,updated_at) VALUES ('rebost-check','rebost-check','ABC','unused','2026','2026')")
response=Response()
main.set_student_session(response,'rebost-check')
headers={'Cookie':response.headers['set-cookie'].split(';')[0], 'Origin':'http://127.0.0.1:8005'}
base='http://127.0.0.1:8005/api/assets/v1'
catalog=json.load(urllib.request.urlopen(urllib.request.Request(base+'/items?collection=catalog',headers=headers)))['items']
assert len(catalog)==12
original=next(item for item in catalog if 'bloc' in item['aliases'])
if not __import__('os').path.exists('/data/check.json'):
    out=io.BytesIO(); Image.new('RGBA',(960,360),(10,30,100,150)).save(out,'PNG')
    req=urllib.request.Request(base+'/items',data=out.getvalue(),method='POST',headers={**headers,'Content-Type':'image/png','X-Rebost-Name':'Fons','X-Rebost-Type':'background'})
    item=json.load(urllib.request.urlopen(req))
    assert (item['width'],item['height'])==(960,360)
    request=urllib.request.Request(base+'/items',data=out.getvalue(),method='POST',headers={**headers,'Content-Type':'image/png','X-Rebost-Name':'Edited','X-Rebost-Type':'illustration','X-Rebost-Source':original['id'],'If-Match':'"'+str(original['revision'])+'"'})
    copied=json.load(urllib.request.urlopen(request))
    assert copied['provenance']['license']=='GPL-3.0-only'
    assert 'Derived image' in copied['provenance']['changes']
    item={'id':item['id'],'copy_id':copied['id'],'catalog_id':original['id']}
    open('/data/check.json','w').write(json.dumps(item))
else:
    item=json.load(open('/data/check.json'))
req=urllib.request.Request(base+'/items/'+item['id']+'/content',headers=headers)
with urllib.request.urlopen(req) as result:
    assert result.status==200 and result.headers['Cache-Control']=='private, no-store'
    image=Image.open(io.BytesIO(result.read())); assert image.size==(960,360)
assert item['catalog_id']==original['id']
req=urllib.request.Request(base+'/items/'+item['copy_id']+'/source',headers=headers)
with urllib.request.urlopen(req) as result:
    assert result.status==200 and result.headers['Content-Disposition'].startswith('attachment;')
    saved_source=result.read()
req=urllib.request.Request(base+'/items/'+original['id']+'/source',headers=headers)
assert urllib.request.urlopen(req).read()==saved_source
req=urllib.request.Request(base+'/items/'+item['copy_id']+'/license',headers=headers)
assert b'GNU GENERAL PUBLIC LICENSE' in urllib.request.urlopen(req).read()
with main.get_conn() as db:
    assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
    assert db.execute('SELECT COUNT(*) FROM assets').fetchone()[0]==2
    assert db.execute('SELECT COUNT(*) FROM asset_provenance').fetchone()[0]==1
print('private image, shared catalogue and GPL derivative/source persistence: OK')
'''


def ready():
    for _ in range(40):
        try:
            docker('exec', name, 'python', '-c', "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8005/api/health',timeout=2).read()")
            return
        except RuntimeError:
            time.sleep(.2)
    raise RuntimeError('Isolated API did not start')


created = False
try:
    docker('volume', 'create', volume); created = True
    with tempfile.TemporaryDirectory(prefix='rebost-env-') as directory:
        env = Path(directory) / 'test.env'
        env.touch(mode=0o600)
        env.write_text('EDUTICTAC_ID_SECRET=' + secrets.token_urlsafe(32) +
                       '\nEDUTICTAC_ID_DB=/data/id.db\nEDUTICTAC_ID_COOKIE_SECURE=0\nQUIOSC_MODE=disabled\nREBOST_DISK_RESERVE=1048576\n')
        docker('run', '--detach', '--name', name, '--pull=never', '--network=none', '--read-only',
               '--tmpfs', '/tmp:rw,noexec,nosuid,size=64m', '--mount', f'type=volume,src={volume},dst=/data',
               '--env-file', str(env), IMAGE)
    ready()
    print(docker('exec', '-i', name, 'python', '-', content=CHECK).strip(), flush=True)
    docker('restart', name); ready()
    print(docker('exec', '-i', name, 'python', '-', content=CHECK).strip(), flush=True)
    print('Rebost restart persistence: OK', flush=True)
finally:
    subprocess.run(['docker','rm','-f',name],capture_output=True)
    if created:
        subprocess.run(['docker','volume','rm',volume],capture_output=True)
