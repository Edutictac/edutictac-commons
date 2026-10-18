"""Exercise snapshots, rollback preconditions and legacy compatibility with private fixtures."""
from contextlib import redirect_stdout
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import sqlite3
import tarfile

import pytest

ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location('backup_stack_tests', ROOT / 'scripts/backup-stack.py')
b = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(b)


class LocalStack(b.Stack):
    def __init__(self, root):
        super().__init__(root)
        self.active = set(b.WRITERS) | {'authentik-postgresql', 'eduhoot-mongo'}
        self.calls = []
        self.fail = None

    def model(self):
        return {'services': {'id-api': {'image': 'synthetic-python'}}}

    def running(self):
        return set(self.active)

    def compose(self, args, code, **kwargs):
        self.calls.append((args, code))
        if code == self.fail:
            raise b.BackupError(code)
        if args[0] == 'stop':
            self.active -= set(args[1:])
        if args[0] == 'up':
            self.active |= (set(args) & b.WRITERS) or b.WRITERS
        if kwargs.get('output'):
            kwargs['output'].write_bytes(b'synthetic-database-export')
        return b''

    def database_available(self, service, before, started):
        return True

    def command(self, args, code, **kwargs):
        self.calls.append((args, code))
        return b''

    def file_helper(self, action, backup, payload, restore=False):
        capture = io.StringIO()
        with redirect_stdout(capture):
            b.helper(action, payload, self.root / 'data', backup)
        return capture.getvalue().encode()


@pytest.fixture
def stack(tmp_path):
    (tmp_path / '.env').write_text('COMPOSE_PROJECT_NAME=isolated-destination\nCOMPOSE_PROFILES=authentik,play,recursos,eduhoot\n'
        'AUTHENTIK_PG_PASS=synthetic-current-database-secret\nEDUTICTAC_ID_SECRET=synthetic-original-signing-key\n'
        'IMAGE_TAG=synthetic-newer-version\nPORTAL_PORT=18282\nQUIOSC_MODE=disabled\n')
    (tmp_path / '.env').chmod(0o600)
    (tmp_path / 'VERSION').write_text('synthetic-version')
    (tmp_path / 'compose.yml').write_text('services: {}\n')
    (tmp_path / 'scripts').mkdir()
    shutil.copy2(ROOT / 'scripts/manage-modules.py', tmp_path / 'scripts/manage-modules.py')
    data = tmp_path / 'data';data.mkdir()
    for relative in b.DATABASES.values():
        path = data / relative;path.parent.mkdir(exist_ok=True)
        with sqlite3.connect(path) as conn:
            conn.execute('CREATE TABLE evidence (value TEXT)')
            conn.execute("INSERT INTO evidence VALUES ('original')")
    for group in ['play', 'authentik', 'eduhoot-uploads', 'eduhoot-logs']:
        (data / group).mkdir(exist_ok=True)
        (data / group / 'fixture.txt').write_text('original')
    (data / 'recursos-api/documents').mkdir()
    (data / 'recursos-api/documents/document.txt').write_text('original')
    (data / 'content-sync/version').mkdir(parents=True)
    (data / 'content-sync/version/catalog.json').write_text('{}')
    (data / 'content-sync/current').symlink_to('version')
    (data / 'eduhoot-mongo').mkdir()
    (data / 'eduhoot-mongo/raw-engine-file').write_text('must-not-be-copied')
    return LocalStack(tmp_path)


def create(stack):
    with stack.locks():
        return stack.create()


def test_complete_snapshot_has_private_config_sqlite_and_all_services(stack):
    backup = create(stack)
    manifest = stack.validate(backup)
    assert manifest['manifest_version'] == 2 and manifest['complete']
    assert {s['name'] for s in manifest['services']} == {'id-api','configuration','play','recursos','quiosc','authentik','eduhoot','local-data'}
    assert 'synthetic-original-signing-key' not in (backup / 'manifest.json').read_text()
    for path in backup.rglob('*'):
        assert path.stat().st_mode & 0o077 == 0
    with tarfile.open(backup / 'recursos/files.tar.gz') as archive:
        assert 'recursos-api/recursos.db' not in archive.getnames()
    assert not any('raw-engine-file' in p.name for p in backup.rglob('*'))
    assert b.WRITERS <= stack.active


def test_full_restore_preserves_destination_identity_and_replays_data(stack):
    backup = create(stack)
    (stack.root / 'data/play/fixture.txt').write_text('changed')
    (stack.root / 'data/play/new.txt').write_text('remove-on-restore')
    with sqlite3.connect(stack.root / 'data/id.db') as conn:
        conn.execute("UPDATE evidence SET value='changed'")
    config = (stack.root / '.env').read_text().replace('synthetic-original-signing-key','synthetic-later-signing-key')
    config = config.replace('synthetic-current-database-secret','synthetic-new-destination-secret')
    (stack.root / '.env').write_text(config)
    stack.values = b.read_env(stack.root / '.env')
    with stack.locks():
        stack.restore(backup)
    assert (stack.root / 'data/play/fixture.txt').read_text() == 'original'
    assert not (stack.root / 'data/play/new.txt').exists()
    with sqlite3.connect(stack.root / 'data/id.db') as conn:
        assert conn.execute('SELECT value FROM evidence').fetchone()[0] == 'original'
    values = b.read_env(stack.root / '.env')
    assert values['EDUTICTAC_ID_SECRET'] == 'synthetic-original-signing-key'
    assert values['AUTHENTIK_PG_PASS'] == 'synthetic-new-destination-secret'
    assert values['COMPOSE_PROJECT_NAME'] == 'isolated-destination'
    assert values['IMAGE_TAG'] == 'synthetic-newer-version'
    assert values['PORTAL_PORT'] == '18282'
    assert values['QUIOSC_MODE'] == 'disabled'
    assert (stack.root / 'data/content-sync/current/catalog.json').read_text() == '{}'


@pytest.mark.parametrize('corruption', ['checksum','path','checksums','sqlite','tar','missing-module'])
def test_invalid_backup_is_rejected_before_services_stop(stack, corruption):
    backup = create(stack);manifest=json.loads((backup/'manifest.json').read_text())
    identity=next(s for s in manifest['services'] if s['name']=='id-api')
    if corruption=='checksum': (backup/'id-api/id.db').write_bytes(b'bad')
    if corruption=='path': identity['paths']=['id-api/../../outside']
    if corruption=='checksums': identity['checksums']={}
    if corruption=='sqlite':
        (backup/'id-api/id.db').write_bytes(b'not-sqlite')
        identity['checksums']['id-api/id.db']=b.digest(backup/'id-api/id.db')
    if corruption=='missing-module': manifest['services']=[s for s in manifest['services'] if s['name']!='authentik']
    if corruption=='tar':
        path=backup/'play/files.tar.gz'
        with tarfile.open(path,'w:gz') as archive:
            member=tarfile.TarInfo('../../outside');member.size=1;archive.addfile(member,io.BytesIO(b'x'))
        next(s for s in manifest['services'] if s['name']=='play')['checksums']['play/files.tar.gz']=b.digest(path)
    (backup/'manifest.json').write_text(json.dumps(manifest));stack.calls.clear()
    with pytest.raises(b.BackupError):
        with stack.locks(): stack.restore(backup)
    assert not stack.calls


def test_failure_restarts_previously_running_writers_and_does_not_publish_partial_copy(stack):
    stack.fail='postgres_dump_failed'
    with pytest.raises(b.BackupError): create(stack)
    assert b.WRITERS <= stack.active
    assert not list(stack.backups.glob('commons-*'))
    assert not list(stack.backups.glob('.backup-*'))


def test_failed_restore_keeps_safety_copy_and_stops_writers(stack):
    backup=create(stack);stack.fail='postgres_restore_failed'
    with pytest.raises(b.BackupError):
        with stack.locks(): stack.restore(backup)
    assert not stack.active & b.WRITERS
    failure=json.loads((stack.backups/'restore-failed.json').read_text())
    assert failure['safety_backup'] != backup.name
    assert (stack.backups/failure['safety_backup']/'manifest.json').exists()


def test_legacy_identity_backup_remains_valid_and_restorable(stack):
    backup=stack.backups/'commons-20261018T010000Z';(backup/'id-api').mkdir(parents=True)
    b.copy_sqlite(stack.root/'data/id.db',backup/'id-api/id.db')
    manifest={'manifest_version':1,'created_at':'2026-10-18T01:00:00Z','stack_version':'old','warnings':[],
        'services':[{'name':'id-api','status':'ok','paths':['id-api/id.db'],'checksums':{'id-api/id.db':b.digest(backup/'id-api/id.db')}}]}
    (backup/'manifest.json').write_text(json.dumps(manifest))
    with stack.locks(): stack.restore(backup)
    assert b.WRITERS <= stack.active


def test_quiosc_pending_sessions_prevent_interruption(stack):
    with sqlite3.connect(stack.root/'data/quiosc.db') as conn:
        conn.execute('CREATE TABLE devices(state TEXT)');conn.execute("INSERT INTO devices VALUES ('unknown')")
    with pytest.raises(b.BackupError,match='quiosc_sessions_pending'): create(stack)
    assert not stack.calls


def test_operation_and_pruning_locks_are_respected(stack):
    with stack.locks():
        with pytest.raises(b.BackupError,match='operation_busy'):
            with stack.locks(): pass
    assert not (stack.backups/'.backup.lock').exists()


@pytest.mark.parametrize('target', ['/etc/passwd','../../outside'])
def test_archive_links_cannot_escape_data_directory(tmp_path,target):
    path=tmp_path/'unsafe.tar'
    with tarfile.open(path,'w') as archive:
        member=tarfile.TarInfo('play/link');member.type=tarfile.SYMTYPE;member.linkname=target;archive.addfile(member)
    with tarfile.open(path) as archive:
        with pytest.raises(b.BackupError): b.archive_members(archive,{'play'})


def test_restored_start_never_enables_disabled_profiles(stack,monkeypatch):
    calls=[]
    monkeypatch.setattr(stack,'command',lambda args,*a,**kw: calls.append(args))
    b.Stack.compose(stack,['up','-d','--no-build'],'test')
    assert '--profile' not in calls[-1]
    b.Stack.compose(stack,['up','-d','--no-deps','eduhoot-mongo'],'test')
    assert calls[-1][calls[-1].index('--profile')+1]=='*'


def test_unused_eduhoot_directory_does_not_start_or_pull_mongo(stack,monkeypatch):
    real=b.Stack(stack.root);real.values['COMPOSE_PROFILES']='authentik'
    calls=[]
    monkeypatch.setattr(real,'compose',lambda args,*a,**kw: calls.append(args) or b'')
    assert real.database_available('eduhoot-mongo',set(),[]) is False
    assert not any('up' in call for call in calls)
