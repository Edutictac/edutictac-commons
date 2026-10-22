#!/usr/bin/env python3
"""Mirror encrypted ID snapshots to the NAS, or check health and backup age."""
import argparse
import fcntl
from datetime import datetime, timezone
import hashlib
import io
import json
import os
from pathlib import Path
import re
import shlex
import sqlite3
import subprocess
import tarfile
import tempfile
import urllib.parse
import urllib.request

ARCHIVE = re.compile(r'id-api-\d{8}T\d{6}Z\.tar\.gz\.gpg')
SSH = ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=8', '-o', 'ServerAliveInterval=15', '-o', 'ServerAliveCountMax=2']


def send_telegram(config, message):
    """Reuse secure storage references from the existing helper, without executing it."""
    helper = Path(config['telegram_helper']).read_text()
    token_line = re.search(r'^BOT_TOKEN=(.*)$', helper, re.M)
    chat_line = re.search(r'^CHAT_ID=(.*)$', helper, re.M)
    if not token_line or not chat_line:
        raise ValueError('notification credential references unavailable')
    reference = re.search(r'\$\(pass\s+(?:show\s+)?([A-Za-z0-9_./-]+)', token_line.group(1))
    chat = shlex.split(chat_line.group(1))
    if not reference or len(chat) != 1 or not re.fullmatch(r'-?\d+', chat[0]):
        raise ValueError('unsupported notification credential references')
    result = subprocess.run(['pass', 'show', reference.group(1)], capture_output=True, timeout=20)
    if result.returncode or not result.stdout.strip():
        raise RuntimeError('notification secure storage unavailable')
    token = result.stdout.decode().splitlines()[0].strip()
    request = urllib.request.Request('https://api.telegram.org/bot'+token+'/sendMessage',
        data=urllib.parse.urlencode({'chat_id': chat[0], 'text': message}).encode(), method='POST')
    # Never propagate raw HTTP errors: their URL contains the bot credential.
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            if not json.load(response).get('ok'):
                raise RuntimeError('notification delivery rejected')
    except Exception:
        raise RuntimeError('notification delivery failed') from None


def notify_transition(config, healthy):
    if not config.get('telegram_enabled'):
        return
    directory = Path(config['state_dir'])
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    with (directory/'alert.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        state_file = directory/'alert-state.json'
        previous = json.loads(state_file.read_text()).get('announced') if state_file.exists() else None
        current = 'healthy' if healthy else 'failed'
        if previous == current:
            return
        if not healthy:
            send_telegram(config, 'EduTicTac Commons: incidencia al comprobar identidad o sus copias de seguridad. '
                          'Se revisará de nuevo cada cinco minutos. Consulta edutictac-id-monitor.service en debiandesktop.')
        elif previous == 'failed':
            send_telegram(config, 'EduTicTac Commons: incidencia resuelta. Identidad responde y las copias '
                          'del VPS y del NAS vuelven a estar verificadas.')
        # Persist only acknowledged delivery; a failed send is retried at the next check.
        write_status(state_file, {'announced': current, 'checked_at': datetime.now(timezone.utc).isoformat()})


def remote(host, code, data=None):
    result = subprocess.run(SSH + [host, 'python3 -c ' + shlex.quote(code)], input=data,
                            capture_output=True, timeout=120)
    if result.returncode:
        raise RuntimeError('remote operation failed')
    return result.stdout


def safe_report(value):
    if not isinstance(value, dict) or not ARCHIVE.fullmatch(str(value.get('name', ''))):
        raise ValueError('invalid backup name')
    if not re.fullmatch(r'[a-f0-9]{64}', str(value.get('sha256', ''))):
        raise ValueError('invalid archive digest')
    if value.get('encrypted') is not True or value.get('integrity') != 'ok':
        raise ValueError('unsuccessful source backup')
    if not isinstance(value.get('bytes'), int) or not 0 < value['bytes'] <= 512 * 1024**2:
        raise ValueError('unexpected archive size')
    created = datetime.strptime(value['created_at'], '%Y%m%dT%H%M%SZ').replace(tzinfo=timezone.utc)
    if value['name'] != f"id-api-{value['created_at']}.tar.gz.gpg":
        raise ValueError('backup date mismatch')
    return created


def assert_fresh(report, now=None, max_hours=36):
    age = ((now or datetime.now(timezone.utc)) - safe_report(report)).total_seconds()
    if age < -300 or age > max_hours * 3600:
        raise ValueError('backup is missing or stale')


def verify_recovery(ciphertext):
    result = subprocess.run(['gpg', '--batch', '--decrypt'], input=ciphertext,
                            capture_output=True, timeout=120)
    if result.returncode:
        raise RuntimeError('backup recovery decryption failed')
    with tarfile.open(fileobj=io.BytesIO(result.stdout), mode='r:gz') as archive:
        members = archive.getmembers()
        if any(not m.isfile() or m.name.startswith('/') or '..' in Path(m.name).parts for m in members):
            raise ValueError('unsafe backup structure')
        names = [m.name for m in members]
        if len(names) != len(set(names)) or 'manifest.json' not in names:
            raise ValueError('duplicate or missing manifest')
        manifest = json.load(archive.extractfile('manifest.json'))
        if manifest.get('format') != 'edutictac-id-backup' or manifest.get('version') != 1:
            raise ValueError('unsupported backup manifest')
        for name, expected in manifest['files'].items():
            member = archive.getmember(name)
            if member.size > 512 * 1024**2:
                raise ValueError('backup member too large')
            if hashlib.sha256(archive.extractfile(member).read()).hexdigest() != expected:
                raise ValueError('backup content digest mismatch')
        databases = ['id.db']
        if 'resources/recursos.db' in manifest['files']:
            databases.append('resources/recursos.db')
        for name in databases:
            data = archive.extractfile(name).read()
            if name == 'id.db' and hashlib.sha256(data).hexdigest() != manifest['database_sha256']:
                raise ValueError('database manifest mismatch')
            # Never extract arbitrary archive paths; write known DB bytes privately.
            with tempfile.TemporaryDirectory(prefix='commons-backup-check-') as directory:
                database = Path(directory) / 'snapshot.db'
                database.write_bytes(data)
                os.chmod(database, 0o600)
                with sqlite3.connect(database.as_uri() + '?mode=ro', uri=True) as conn:
                    if conn.execute('PRAGMA integrity_check').fetchone()[0] != 'ok':
                        raise ValueError('recovered database integrity failed')


def write_status(path, value):
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd, temporary = tempfile.mkstemp(dir=path.parent, prefix='.status-')
    try:
        with os.fdopen(fd, 'w') as stream:
            json.dump(value, stream, indent=2)
            stream.write('\n')
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def mirror(config):
    source = config['source_dir']
    raw = remote(config['vps'], f"import pathlib,json; p=pathlib.Path({source!r}); print(json.dumps([json.loads(f.read_text()) for f in sorted(p.glob('id-api-*.tar.gz.gpg.json'))]))")
    reports = json.loads(raw)
    if not reports:
        raise ValueError('no source backups')
    local = Path(config['state_dir'])
    local.mkdir(parents=True, exist_ok=True, mode=0o700)
    verified = []
    for report in reports:
        safe_report(report)
        name = report['name']
        destination = config['nas_dir'].rstrip('/') + '/' + name
        cipher = remote(config['vps'], f"import pathlib,sys; sys.stdout.buffer.write(pathlib.Path({(source+'/'+name)!r}).read_bytes())")
        if len(cipher) != report['bytes'] or hashlib.sha256(cipher).hexdigest() != report['sha256']:
            raise ValueError('source archive digest mismatch')
        # Idempotent upload, with atomic rename; never overwrite a different archive.
        code = f'''import pathlib,os,sys,hashlib
os.umask(0o077)
p=pathlib.Path({destination!r});p.parent.mkdir(parents=True,exist_ok=True,mode=0o700);os.chmod(p.parent,0o700)
data=sys.stdin.buffer.read()
assert hashlib.sha256(data).hexdigest()=={report['sha256']!r}
if p.exists():
 assert hashlib.sha256(p.read_bytes()).hexdigest()=={report['sha256']!r}
else:
 t=p.with_name(p.name+'.partial');f=t.open('wb');os.chmod(t,0o600);f.write(data);f.flush();os.fsync(f.fileno());f.close();t.replace(p)
os.chmod(p,0o600)
'''
        remote(config['nas'], code, cipher)
        recovered = remote(config['nas'], f"import pathlib,sys; sys.stdout.buffer.write(pathlib.Path({destination!r}).read_bytes())")
        if hashlib.sha256(recovered).hexdigest() != report['sha256']:
            raise ValueError('NAS recovered archive digest mismatch')
        verify_recovery(recovered)
        verified.append(report)
    latest = max(verified, key=lambda r: safe_report(r))
    assert_fresh(latest)
    prune = fr'''import pathlib,re
p=pathlib.Path({config['nas_dir']!r})
files=sorted(f for f in p.iterdir() if re.fullmatch(r'id-api-\d{{8}}T\d{{6}}Z\.tar\.gz\.gpg',f.name) and f.is_file() and not f.is_symlink())
for f in files[:-30]:f.unlink()
'''
    remote(config['nas'], prune)
    result = dict(latest, recovered_from_nas=True, decryption_verified=True,
                  checked_at=datetime.now(timezone.utc).isoformat(), archives_verified=len(verified))
    write_status(local/'offsite-success.json', result)
    return {'result': 'ok', 'archives_verified': len(verified), 'latest': latest['name']}


def check(config):
    code = f'''import json,pathlib,urllib.request,subprocess
assert subprocess.run(['systemctl','is-failed','--quiet','edutictac-id-backup.service']).returncode!=0
with urllib.request.urlopen('http://127.0.0.1:8005/api/health',timeout=8) as r:
 assert r.status==200
print(pathlib.Path({(config['source_dir']+'/latest.json')!r}).read_text())
'''
    source = json.loads(remote(config['vps'], code))
    assert_fresh(source)
    local = Path(config['state_dir'])
    if json.loads((local/'mirror-status.json').read_text()).get('result') != 'ok':
        raise ValueError('last offsite backup attempt failed')
    offsite = json.loads((local/'offsite-success.json').read_text())
    assert_fresh(offsite)
    if not offsite.get('recovered_from_nas') or not offsite.get('decryption_verified'):
        raise ValueError('offsite backup recovery not verified')
    # Verify the NAS still holds the last recovered file, without downloading it again.
    path = config['nas_dir'].rstrip('/')+'/'+offsite['name']
    remote(config['nas'], f"import pathlib,hashlib; p=pathlib.Path({path!r}); assert hashlib.sha256(p.read_bytes()).hexdigest()=={offsite['sha256']!r}")
    return {'result': 'ok', 'identity_health': 'ok', 'source_backup': source['name'],
            'offsite_backup': offsite['name'], 'max_age_hours': 36}


def main():
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['mirror', 'check', 'notify-test'])
    parser.add_argument('--config', type=Path, required=True)
    args = parser.parse_args()
    try:
        config = json.loads(args.config.read_text())
        if args.command == 'notify-test':
            if not config.get('telegram_enabled'):
                raise ValueError('notifications disabled')
            send_telegram(config, 'EduTicTac Commons: prueba de avisos correcta. Recibirás un aviso si falla '
                          'la comprobación de identidad o de sus copias, y otro al recuperarse. '
                          'Este mensaje es una prueba; no indica ninguna incidencia.')
            print('{"notification_test":"sent"}')
            return
        result = mirror(config) if args.command == 'mirror' else check(config)
        result['checked_at'] = datetime.now(timezone.utc).isoformat()
        write_status(Path(config['state_dir'])/(args.command+'-status.json'), result)
        print(json.dumps(result))
    except Exception:
        # Successful recovery metadata is retained on failure, so age checks cannot be reset.
        try:
            write_status(Path(config['state_dir'])/(args.command+'-status.json'), {'result': 'failed'})
        except Exception:
            pass
        if args.command == 'check':
            try:
                notify_transition(config, False)
            except Exception:
                parser.exit(1, 'Monitor check and/or notification failed; delivery will be retried.\n')
        parser.exit(1, 'ID API backup/monitor check failed; successful recovery timestamp unchanged.\n')
    if args.command == 'check':
        try:
            notify_transition(config, True)
        except Exception:
            parser.exit(1, 'Monitor passed, but notification delivery failed; delivery will be retried.\n')


if __name__ == '__main__':
    main()
