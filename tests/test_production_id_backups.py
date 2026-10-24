"""Real encryption/recovery and failure handling, using disposable keys and data."""
from datetime import datetime, timedelta, timezone
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import tarfile
from types import SimpleNamespace

import pytest


def load(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).parents[1]/'scripts'/f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def encrypted_backup(tmp_path, monkeypatch):
    if not shutil.which('gpg'):
        pytest.skip('gpg required for recovery integration')
    module = load('production-id-backup')
    gpg = tmp_path/'gpg';gpg.mkdir(mode=0o700)
    commands = ['gpg', '--homedir', str(gpg), '--batch', '--pinentry-mode', 'loopback', '--passphrase', '',
                '--quick-generate-key', 'Disposable backup test', 'rsa1024', 'encr', '0']
    subprocess.run(commands, check=True, capture_output=True)
    key = subprocess.check_output(['gpg','--homedir',str(gpg),'--batch','--with-colons','--list-keys'],stderr=subprocess.DEVNULL).decode()
    recipient = next(line.split(':')[9] for line in key.splitlines() if line.startswith('fpr:'))
    base=tmp_path/'service';(base/'data').mkdir(parents=True)
    (base/'main.py').write_text('# old application\n')
    (base/'requirements.txt').write_text('fastapi\n')
    secret=tmp_path/'private.env';secret.write_text('SYNTHETIC_SECRET=never-log-this-fixture\n')
    conn=sqlite3.connect(base/'data/id.db');conn.execute('PRAGMA journal_mode=WAL')
    conn.execute('CREATE TABLE fixture (id INTEGER PRIMARY KEY, value TEXT)')
    conn.execute("INSERT INTO fixture(value) VALUES ('first')");conn.commit()
    output=tmp_path/'output'
    actual_datetime=module.datetime
    class Clock:
        offset=0
        @classmethod
        def now(cls, tz):
            value=actual_datetime.now(tz)+timedelta(seconds=cls.offset)
            cls.offset+=1
            return value
    monkeypatch.setattr(module,'datetime',Clock)
    try:
        yield module,base,output,secret,gpg,recipient,conn
    finally:
        conn.close()
        subprocess.run(['gpgconf','--homedir',str(gpg),'--kill','gpg-agent'],capture_output=True)


def recover(path,gpg):
    result=subprocess.run(['gpg','--homedir',str(gpg),'--batch','--decrypt',str(path)],capture_output=True,check=True)
    return tarfile.open(fileobj=io.BytesIO(result.stdout),mode='r:gz')


def test_fresh_wal_snapshot_is_encrypted_and_recovers_without_changing_source(encrypted_backup):
    module,base,out,env,gpg,recipient,conn=encrypted_backup
    first=module.backup(base,out,env,gpg,recipient)
    conn.execute("INSERT INTO fixture(value) VALUES ('committed in WAL')");conn.commit()
    second=module.backup(base,out,env,gpg,recipient)
    assert first['name']!=second['name']
    assert not list(out.glob('*.partial')) and not list(out.glob('.snapshot-*'))
    archive_path=out/second['name']
    assert archive_path.stat().st_mode&0o077==0
    assert b'never-log-this-fixture' not in archive_path.read_bytes()
    assert hashlib.sha256(archive_path.read_bytes()).hexdigest()==second['sha256']
    with recover(archive_path,gpg) as archive:
        manifest=json.load(archive.extractfile('manifest.json'))
        db=archive.extractfile('id.db').read()
        assert hashlib.sha256(db).hexdigest()==manifest['database_sha256']
        assert archive.extractfile('configuration/legacy.env').read()==env.read_bytes()
        restored=sqlite3.connect(':memory:');restored.deserialize(db)
        assert restored.execute('SELECT value FROM fixture ORDER BY id').fetchall()==[('first',),('committed in WAL',)]
        restored.close()
    assert conn.execute('SELECT count(*) FROM fixture').fetchone()[0]==2


def test_failed_encryption_preserves_last_success_and_removes_plaintext(encrypted_backup):
    module,base,out,env,gpg,recipient,_=encrypted_backup
    module.backup(base,out,env,gpg,recipient)
    successful=(out/'latest.json').read_bytes()
    with pytest.raises(Exception):
        module.backup(base,out,env,gpg,'missing-fixture-key')
    assert (out/'latest.json').read_bytes()==successful
    assert not list(out.glob('*.partial')) and not list(out.glob('.snapshot-*'))


def test_retention_preserves_manual_predeployment_archives(encrypted_backup):
    module,base,out,env,gpg,recipient,_=encrypted_backup
    out.mkdir();manual=out/'commons-id-before-docker-manual.tar.gz.gpg';manual.write_bytes(b'manual')
    for _ in range(3):module.backup(base,out,env,gpg,recipient,keep=2)
    assert manual.exists()
    assert len([p for p in out.iterdir() if module.ARCHIVE.fullmatch(p.name)])==2


def test_monitor_rejects_stale_future_and_unsafe_backup_reports():
    module=load('production-id-offsite')
    report={'name':'id-api-20261022T030000Z.tar.gz.gpg','created_at':'20261022T030000Z',
            'sha256':'a'*64,'bytes':1024,'encrypted':True,'integrity':'ok'}
    now=datetime(2026,10,22,4,tzinfo=timezone.utc)
    module.assert_fresh(report,now)
    with pytest.raises(ValueError):module.assert_fresh(report,now+timedelta(hours=37))
    with pytest.raises(ValueError):module.assert_fresh(report,now-timedelta(hours=2))
    with pytest.raises(ValueError):module.safe_report(dict(report,name='../../id.db'))
    with pytest.raises(ValueError):module.safe_report(dict(report,sha256='not-a-hash'))
    with pytest.raises(ValueError):module.safe_report(dict(report,encrypted=False))


def test_failed_mirror_does_not_replace_successful_recovery(tmp_path,monkeypatch):
    module=load('production-id-offsite')
    success=tmp_path/'offsite-success.json';success.write_text('{"previous":"success"}')
    monkeypatch.setattr(module,'remote',lambda *args: (_ for _ in ()).throw(RuntimeError('offline')))
    with pytest.raises(RuntimeError):module.mirror({'source_dir':'/unused','vps':'fixture','state_dir':str(tmp_path)})
    assert json.loads(success.read_text())=={'previous':'success'}


def test_mirror_retrieves_decrypts_and_detects_remote_corruption(encrypted_backup,tmp_path,monkeypatch):
    backup,base,out,env,gpg,recipient,_=encrypted_backup
    backup.backup(base,out,env,gpg,recipient)
    module=load('production-id-offsite')
    monkeypatch.setenv('GNUPGHOME',str(gpg))
    state=tmp_path/'state'
    config={'source_dir':str(out),'vps':'fixture-source','nas':'fixture-nas',
            'nas_dir':str(tmp_path/'nas'),'state_dir':str(state)}
    corrupt=False
    def transport(host,code,data=None):
        result=subprocess.run([sys.executable,'-c',code],input=data,capture_output=True,check=True)
        if corrupt and host=='fixture-nas' and 'stdout.buffer.write' in code:
            return result.stdout+b'corrupt'
        return result.stdout
    monkeypatch.setattr(module,'remote',transport)
    assert module.mirror(config)['result']=='ok'
    successful=(state/'offsite-success.json').read_bytes()
    assert json.loads(successful)['decryption_verified']
    # Repeated copies are idempotent and do not create duplicate NAS archives.
    assert module.mirror(config)['result']=='ok'
    assert len(list((tmp_path/'nas').glob('*.gpg')))==1
    successful=(state/'offsite-success.json').read_bytes()
    corrupt=True
    with pytest.raises(ValueError,match='NAS recovered'):
        module.mirror(config)
    assert (state/'offsite-success.json').read_bytes()==successful


@pytest.mark.parametrize('kind',['traversal','absolute','symlink','duplicate'])
def test_recovery_rejects_unsafe_archive_before_writing_files(monkeypatch,kind):
    module=load('production-id-offsite');payload=io.BytesIO()
    with tarfile.open(fileobj=payload,mode='w:gz') as archive:
        name={'traversal':'../outside','absolute':'/tmp/outside','symlink':'outside','duplicate':'manifest.json'}[kind]
        member=tarfile.TarInfo(name)
        if kind=='symlink':member.type=tarfile.SYMTYPE;member.linkname='/tmp/outside'
        archive.addfile(member)
        if kind=='duplicate':archive.addfile(tarfile.TarInfo(name))
    monkeypatch.setattr(module.subprocess,'run',lambda *args,**kwargs:SimpleNamespace(returncode=0,stdout=payload.getvalue()))
    with pytest.raises(ValueError):module.verify_recovery(b'encrypted fixture')


def test_alerts_only_notify_failure_and_recovery_transitions(tmp_path,monkeypatch):
    module=load('production-id-offsite');messages=[]
    config={'state_dir':str(tmp_path),'telegram_enabled':True}
    monkeypatch.setattr(module,'send_telegram',lambda config,message:messages.append(message))
    for healthy in [True,True,False,False,True,True]:module.notify_transition(config,healthy)
    assert len(messages)==2
    assert 'incidencia al comprobar' in messages[0]
    assert 'incidencia resuelta' in messages[1]
    assert json.loads((tmp_path/'alert-state.json').read_text())['announced']=='healthy'


def test_alert_delivery_failure_is_retried_without_acknowledging_it(tmp_path,monkeypatch):
    module=load('production-id-offsite')
    config={'state_dir':str(tmp_path),'telegram_enabled':True}
    module.notify_transition(config,True)
    original=(tmp_path/'alert-state.json').read_bytes()
    monkeypatch.setattr(module,'send_telegram',lambda *args: (_ for _ in ()).throw(RuntimeError('offline')))
    with pytest.raises(RuntimeError):module.notify_transition(config,False)
    assert (tmp_path/'alert-state.json').read_bytes()==original
    messages=[]
    monkeypatch.setattr(module,'send_telegram',lambda config,message:messages.append(message))
    module.notify_transition(config,False)
    failed=(tmp_path/'alert-state.json').read_bytes()
    monkeypatch.setattr(module,'send_telegram',lambda *args: (_ for _ in ()).throw(RuntimeError('offline')))
    with pytest.raises(RuntimeError):module.notify_transition(config,True)
    assert (tmp_path/'alert-state.json').read_bytes()==failed
    monkeypatch.setattr(module,'send_telegram',lambda config,message:messages.append(message))
    module.notify_transition(config,True)
    assert len(messages)==2


def test_disabled_alerts_do_not_send_or_create_state(tmp_path,monkeypatch):
    module=load('production-id-offsite')
    monkeypatch.setattr(module,'send_telegram',lambda *args:pytest.fail('disabled alert sent'))
    module.notify_transition({'state_dir':str(tmp_path)},False)
    assert not (tmp_path/'alert-state.json').exists()


def test_telegram_http_error_never_exposes_credential_url(tmp_path,monkeypatch):
    module=load('production-id-offsite');helper=tmp_path/'helper'
    helper.write_text("BOT_TOKEN=$(pass show fixture/telegram)\nCHAT_ID='123456'\n")
    monkeypatch.setattr(module.subprocess,'run',lambda *args,**kwargs:SimpleNamespace(returncode=0,stdout=b'fictional-bot-credential\n'))
    def unavailable(*args,**kwargs):
        raise RuntimeError('HTTP error at /botfictional-bot-credential/sendMessage')
    monkeypatch.setattr(module.urllib.request,'urlopen',unavailable)
    with pytest.raises(RuntimeError,match='^notification delivery failed$') as error:
        module.send_telegram({'telegram_helper':str(helper)},'test')
    assert error.value.__suppress_context__


def test_combined_backup_recovers_bank_wal_publications_and_configuration(encrypted_backup, tmp_path, monkeypatch):
    module, base, out, env, gpg, recipient, _ = encrypted_backup
    bank = tmp_path / 'bank.db'
    with sqlite3.connect(bank) as db:
        db.execute('PRAGMA journal_mode=WAL')
        db.execute('CREATE TABLE publications (id TEXT PRIMARY KEY, content BLOB)')
        db.execute("INSERT INTO publications VALUES ('synthetic-book', x'010203')")
    config = tmp_path / 'bank-config'; config.mkdir()
    (config / 'compose.yml').write_text('services: {}\n')
    (config / 'service.env').write_text('SYNTHETIC_TOKEN=not-a-real-credential\n')
    report = module.backup(base, out, env, gpg, recipient, resources_db=bank, resources_config=config)
    with recover(out / report['name'], gpg) as archive:
        assert archive.extractfile('configuration/resources/service.env').read() == (config / 'service.env').read_bytes()
        restored = sqlite3.connect(':memory:')
        restored.deserialize(archive.extractfile('resources/recursos.db').read())
        assert restored.execute('SELECT count(*) FROM publications').fetchone()[0] == 1
        restored.close()
    offsite = load('production-id-offsite')
    monkeypatch.setenv('GNUPGHOME', str(gpg))
    offsite.verify_recovery((out / report['name']).read_bytes())


def test_combined_backup_failure_does_not_record_success(encrypted_backup, tmp_path):
    module, base, out, env, gpg, recipient, _ = encrypted_backup
    module.backup(base, out, env, gpg, recipient)
    previous = (out / 'latest.json').read_bytes()
    bad = tmp_path / 'corrupt.db'; bad.write_bytes(b'not a sqlite database')
    with pytest.raises(Exception):
        module.backup(base, out, env, gpg, recipient, resources_db=bad, resources_config=tmp_path)
    assert (out / 'latest.json').read_bytes() == previous
    assert not list(out.glob('*.partial'))


def test_classroom_blobs_are_streamed_encrypted_and_match_snapshot(encrypted_backup):
    module,base,out,env,gpg,recipient,conn=encrypted_backup
    name='a'*64+'/'+'b'*32+'.txt'
    content=b'Private pupil submission'
    blob=base/'data/id-api/files'/name;blob.parent.mkdir(parents=True,mode=0o700);blob.write_bytes(content)
    conn.execute('CREATE TABLE classroom_files (storage_name TEXT,size INTEGER,sha256 TEXT,active INTEGER)')
    conn.execute('INSERT INTO classroom_files VALUES (?,?,?,1)',(name,len(content),hashlib.sha256(content).hexdigest()));conn.commit()
    report=module.backup(base,out,env,gpg,recipient)
    with recover(out/report['name'],gpg) as archive:
        manifest=json.load(archive.extractfile('manifest.json'))
        restored=archive.extractfile('data/id-api/files/'+name).read()
        assert restored==content
        assert manifest['files']['data/id-api/files/'+name]==hashlib.sha256(restored).hexdigest()
        db=sqlite3.connect(':memory:');db.deserialize(archive.extractfile('id.db').read())
        assert db.execute('SELECT storage_name FROM classroom_files').fetchone()[0]==name
        db.close()
    assert not list(out.glob('.snapshot-*'))


def test_missing_or_modified_classroom_blob_fails_closed(encrypted_backup):
    module,base,out,env,gpg,recipient,conn=encrypted_backup
    module.backup(base,out,env,gpg,recipient)
    previous=(out/'latest.json').read_bytes()
    conn.execute('CREATE TABLE classroom_files (storage_name TEXT,size INTEGER,sha256 TEXT,active INTEGER)')
    conn.execute('INSERT INTO classroom_files VALUES (?,?,?,1)',('a'*64+'/'+'b'*32+'.txt',12,'b'*64));conn.commit()
    with pytest.raises(RuntimeError,match='classroom blob unavailable'):
        module.backup(base,out,env,gpg,recipient)
    assert (out/'latest.json').read_bytes()==previous
    assert not list(out.glob('*.partial'))
