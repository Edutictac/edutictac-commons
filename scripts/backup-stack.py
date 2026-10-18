#!/usr/bin/env python3
"""Private, complete backups and verified restores; no credentials in diagnostics."""
import argparse
from contextlib import closing, contextmanager
from datetime import datetime, timezone
import fcntl
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shlex
import shutil
import signal
import sqlite3
import subprocess
import sys
import tarfile
import tempfile
import time
import uuid

ROOT = Path(__file__).resolve().parent.parent
NAME = re.compile(r'commons-\d{8}T\d{6}Z')
WRITERS = {'id-api', 'admin', 'play', 'recursos-api', 'eduhoot', 'authentik-server', 'authentik-worker'}
FRONTENDS = {'recursos'}  # nginx resolves its API address when the frontend starts.
GROUPS = {'play': ['play'], 'recursos': ['recursos-api', 'recursos-www'],
          'authentik': ['authentik', 'authentik-templates'],
          'eduhoot': ['eduhoot-uploads', 'eduhoot-logs']}
DATABASES = {'id-api': 'id.db', 'recursos': 'recursos-api/recursos.db', 'quiosc': 'quiosc.db'}
SQLITE_FILES = {value + suffix for value in DATABASES.values() for suffix in ('', '-wal', '-shm', '-journal')}
RUNTIME = {'.stack-operation.lock', '.modules-quiosc.lock', 'modules.json'}
ARTIFACTS = {name: {name + '/files.tar.gz'} for name in [*GROUPS, 'local-data']}
for _service, _database in DATABASES.items():
    ARTIFACTS.setdefault(_service, set()).add(_service + '/' + Path(_database).name)
ARTIFACTS['authentik'].add('authentik/database.dump')
ARTIFACTS['eduhoot'].add('eduhoot/mongo.archive.gz')
ARTIFACTS['configuration'] = {'configuration/environment.env', 'configuration/files.tar.gz',
                            'configuration/quiosc-host.json', 'configuration/quiosc-tmpfiles.conf'}


class BackupError(Exception):
    pass


def read_env(path):
    result = {}
    for line in path.read_text().splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            key, value = line.split('=', 1)
            result[key.strip()] = value.strip().strip('\"\'')
    return result


def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(chunk)
    return 'sha256:' + h.hexdigest()


def atomic_config(path, text):
    descriptor, temporary = tempfile.mkstemp(dir=path.parent)
    try:
        os.fchmod(descriptor, 0o600)
        with os.fdopen(descriptor, 'w') as stream:
            stream.write(text)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def safe_name(name):
    path = PurePosixPath(name)
    if path.is_absolute() or not path.parts or '..' in path.parts or '\\' in name:
        raise BackupError('unsafe_archive_path')
    return path


def archive_members(archive, allowed=None):
    members = archive.getmembers()
    seen = set()
    for member in members:
        path = safe_name(member.name)
        if str(path) in seen:
            raise BackupError('duplicate_archive_path')
        seen.add(str(path))
        if allowed is not None and path.parts[0] not in allowed:
            raise BackupError('unexpected_archive_path')
        if not (member.isfile() or member.isdir() or member.issym()):
            raise BackupError('unsafe_archive_type')
        if member.issym():
            target = PurePosixPath(member.linkname)
            if target.is_absolute() or '..' in target.parts:
                raise BackupError('unsafe_archive_link')
        # A file may never traverse a symlink created by an earlier member.
    links = {PurePosixPath(m.name) for m in members if m.issym()}
    if any(parent in links for m in members for parent in PurePosixPath(m.name).parents):
        raise BackupError('archive_link_parent')
    return members


def check_sqlite(path):
    with closing(sqlite3.connect(path.as_uri() + '?mode=ro&immutable=1', uri=True, timeout=10)) as conn:
        if conn.execute('PRAGMA integrity_check').fetchall() != [('ok',)]:
            raise BackupError('sqlite_integrity_failed')


def copy_sqlite(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    # Writers are stopped. Copy the database and any committed WAL/hot journal
    # first: SQLite may need to recover shared memory, which must happen on the
    # private copy, never on the read-only source mount.
    with tempfile.TemporaryDirectory(prefix='.sqlite-', dir=destination.parent) as temporary:
        staged = Path(temporary) / source.name
        shutil.copyfile(source, staged)
        for suffix in ('-wal', '-journal'):
            journal = Path(str(source) + suffix)
            if journal.exists():
                shutil.copyfile(journal, Path(str(staged) + suffix))
        src, dst = sqlite3.connect(staged), sqlite3.connect(destination)
        try:
            src.backup(dst, pages=256, sleep=0.05)
            dst.execute('PRAGMA journal_mode=DELETE')
        finally:
            dst.close()
            src.close()
    check_sqlite(destination)
    destination.chmod(0o600)


def make_archive(data, destination, entries):
    with tarfile.open(destination, 'w:gz') as archive:
        def selected(info):
            if info.name in SQLITE_FILES:
                return None
            if info.issym():
                target = (data / info.name).resolve()
                if not target.is_relative_to(data.resolve()):
                    raise BackupError('external_data_link')
            if not (info.isfile() or info.isdir() or info.issym()):
                raise BackupError('unsupported_data_file')
            return info
        for entry in entries:
            if (data / entry).exists() or (data / entry).is_symlink():
                archive.add(data / entry, arcname=entry, filter=selected)
    with tarfile.open(destination) as archive:
        archive_members(archive, set(entries))
    destination.chmod(0o600)


def helper(action, payload, data=Path('/snapshot-data'), backup=Path('/snapshot-backup')):
    """Runs in an offline helper with only the intended data/backup mounts."""
    if action == 'snapshot':
        services = []
        for service, relative in DATABASES.items():
            source = data / relative
            if source.exists():
                destination = backup / service / Path(relative).name
                copy_sqlite(source, destination)
                services.append((service, str(destination.relative_to(backup))))
        known = {entry for entries in GROUPS.values() for entry in entries} | {'eduhoot-mongo'}
        extra = [p.name for p in data.iterdir() if p.name not in known | RUNTIME
                 and p.name not in SQLITE_FILES]
        groups = {**GROUPS, 'local-data': extra}
        for service, entries in groups.items():
            if any((data / entry).exists() for entry in entries):
                folder = backup / service
                folder.mkdir(exist_ok=True)
                make_archive(data, folder / 'files.tar.gz', entries)
                services.append((service, service + '/files.tar.gz'))
        uid, gid = payload['uid'], payload['gid']
        for path in backup.rglob('*'):
            os.chown(path, uid, gid, follow_symlinks=False)
            if not path.is_symlink():
                path.chmod(0o700 if path.is_dir() else 0o600)
        mongo = data / 'eduhoot-mongo'
        print(json.dumps({'services': services, 'mongo_data': mongo.is_dir() and any(mongo.iterdir())}))
    elif action == 'restore':
        for service in payload['services']:
            for relative in service['paths']:
                source = backup / relative
                if relative.endswith('/files.tar.gz'):
                    with tarfile.open(source) as archive:
                        allowed = set(GROUPS.get(service['name'], payload.get('extra_roots', [])))
                        members = archive_members(archive, allowed)
                        for name in {PurePosixPath(m.name).parts[0] for m in members}:
                            target = data / name
                            if target.is_symlink() or target.is_file():
                                target.unlink()
                            elif target.exists():
                                shutil.rmtree(target)
                        # All member names, types, link targets and parents were validated.
                        archive.extractall(data, members=members, filter='tar', numeric_owner=True)
                elif relative.endswith('.db'):
                    target = data / DATABASES[service['name']]
                    target.parent.mkdir(parents=True, exist_ok=True)
                    for suffix in ('-wal', '-shm', '-journal'):
                        Path(str(target) + suffix).unlink(missing_ok=True)
                    shutil.copyfile(source, target)
                    owner = target.parent.stat() if service['name'] == 'recursos' else None
                    os.chown(target, owner.st_uid if owner else payload['uid'], owner.st_gid if owner else payload['gid'])
                    target.chmod(0o600)
        # No sockets, process handles or maintenance locks are restored.
    else:
        raise BackupError('invalid_helper_action')


class Stack:
    def __init__(self, root=ROOT):
        self.root = Path(root).resolve()
        self.backups = self.root / 'backups'
        self.backups.mkdir(mode=0o700, exist_ok=True)
        self.values = read_env(self.root / '.env')
        self.docker = shlex.split(os.environ.get('DOCKER', 'docker'))
        self.env = {k: v for k, v in os.environ.items() if k not in self.values and not k.startswith('COMPOSE_')}
        self.env['PWD'] = str(self.root)

    def command(self, arguments, code, *, output=None, input_file=None, input_data=None, timeout=600):
        try:
            with (output.open('wb') if output else open(os.devnull, 'wb')) as out:
                with (input_file.open('rb') if input_file else open(os.devnull, 'rb')) as source:
                    result = subprocess.run(arguments, cwd=self.root, env=self.env,
                        stdout=out if output else subprocess.PIPE, stderr=subprocess.PIPE,
                        stdin=source if input_file else None, input=input_data, timeout=timeout)
            if result.returncode:
                # Only fixed error codes from this script may reach job logs.
                for line in result.stderr.decode(errors='replace').splitlines():
                    if re.fullmatch(r'backup: [A-Za-z_:]+', line):
                        print(line, file=sys.stderr, flush=True)
                raise BackupError(code)
            return result.stdout if not output else b''
        except (OSError, subprocess.TimeoutExpired):
            raise BackupError(code) from None

    def compose(self, args, code, **kwargs):
        # A full start follows the selected profiles. Named maintenance services
        # may be addressed even when their optional module is disabled.
        profiles = [] if args[0] == 'up' and '--no-deps' not in args else ['--profile', '*']
        return self.command([*self.docker, 'compose', '--project-directory', str(self.root),
            '--env-file', str(self.root / '.env'), '-f', str(self.root / 'compose.yml'), *profiles, *args], code, **kwargs)

    def model(self):
        return json.loads(self.compose(['config', '--format', 'json'], 'compose_configuration_failed'))

    def running(self):
        return set(self.compose(['ps', '--status', 'running', '--services'], 'container_state_failed').decode().split())

    def file_helper(self, action, backup, payload, restore=False):
        image = self.model()['services']['id-api']['image']
        script = Path(__file__).resolve()
        token = uuid.uuid4().hex
        container = 'commons-backup-helper-' + token
        try:
            return self.command([*self.docker, 'run', '--rm', '-i', '--name', container,
                '--label', 'commons.backup.operation=' + token, '--pull=never', '--network=none', '--read-only', '--user=0',
                '--mount', f'type=bind,src={self.root / "data"},dst=/snapshot-data' + ('' if restore else ',readonly'),
                '--mount', f'type=bind,src={backup},dst=/snapshot-backup' + (',readonly' if restore else ''),
                '--mount', f'type=bind,src={script},dst=/backup-stack.py,readonly',
                '--entrypoint=python', image, '/backup-stack.py', 'helper', action], 'file_snapshot_failed' if not restore else 'file_restore_failed',
                input_data=json.dumps(payload).encode())
        finally:
            # Remove only this invocation's helper if the client timed out or
            # was interrupted; a surviving helper must not race a later restore.
            result = subprocess.run([*self.docker, 'inspect', '--format',
                '{{.Id}} {{index .Config.Labels "commons.backup.operation"}}', container], capture_output=True, text=True, timeout=30)
            fields = result.stdout.split()
            if result.returncode == 0 and len(fields) == 2 and re.fullmatch(r'[a-f0-9]{64}', fields[0]) and fields[1] == token:
                subprocess.run([*self.docker, 'rm', '-f', fields[0]], capture_output=True, timeout=30)

    @contextmanager
    def locks(self):
        descriptors = []
        directory = self.backups / '.backup.lock'
        acquired = False
        try:
            for filename, marker in [('.stack-operation.lock', 'COMMONS_OPERATION_LOCK_HELD'),
                                     ('.modules-quiosc.lock', 'COMMONS_QUIOSC_LOCK_HELD')]:
                if os.environ.get(marker) == '1':
                    continue
                fd = os.open(self.root / 'data' / filename, os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
                descriptors.append(fd)
                try:
                    fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
                except BlockingIOError:
                    raise BackupError('operation_busy') from None
            if os.environ.get('BACKUP_LOCK_HELD') != '1':
                try:
                    directory.mkdir(mode=0o700)
                    acquired = True
                except FileExistsError:
                    raise BackupError('backup_busy') from None
            yield
        finally:
            if acquired:
                directory.rmdir()
            for fd in descriptors:
                os.close(fd)

    def ensure_idle(self):
        path = self.root / 'data/quiosc.db'
        if path.exists():
            with closing(sqlite3.connect(path.as_uri() + '?mode=ro', uri=True)) as conn:
                exists = conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='devices'").fetchone()
                if exists and conn.execute("SELECT 1 FROM devices WHERE state NOT IN ('finished','simulation_finished') LIMIT 1").fetchone():
                    raise BackupError('quiosc_sessions_pending')

    @contextmanager
    def stopped_writers(self):
        self.ensure_idle()
        before = self.running()
        stopped = sorted(before & WRITERS)
        frontends = sorted(before & FRONTENDS)
        started = []
        try:
            if stopped or frontends:
                print('backup: breu parada dels serveis amb escriptura', flush=True)
                self.compose(['stop', *frontends, *stopped], 'writers_stop_failed')
            yield before, started
        finally:
            if started:
                self.compose(['stop', *started], 'temporary_database_stop_failed')
            if stopped:
                self.compose(['up', '-d', '--no-build', '--no-deps', '--wait', '--wait-timeout', '180', *stopped], 'writers_restart_failed')
            if frontends:
                self.compose(['up', '-d', '--no-build', '--no-deps', '--wait', '--wait-timeout', '60', *frontends], 'frontends_restart_failed')

    def database_available(self, service, before, started):
        if service in before:
            return True
        profiles = set(self.values.get('COMPOSE_PROFILES', '').split(','))
        exists = bool(self.compose(['ps', '-aq', service], 'database_state_failed').strip())
        needed = service == 'eduhoot-mongo' and ('eduhoot' in profiles or getattr(self, 'mongo_data', False))
        if service == 'authentik-postgresql':
            resource = self.model().get('volumes', {}).get('authentik_database', {})
            name = resource.get('name')
            if name:
                result = subprocess.run([*self.docker, 'volume', 'inspect', name], capture_output=True)
                exists = exists or result.returncode == 0
            needed = 'authentik' in profiles
        if not (exists or needed):
            return False
        self.compose(['up', '-d', '--no-deps', '--no-build', '--wait', '--wait-timeout', '120', service], 'database_start_failed')
        started.append(service)
        return True

    def create(self):
        with self.stopped_writers() as (before, started):
            stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
            while (self.backups / ('commons-' + stamp)).exists():
                time.sleep(1)
                stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
            destination = self.backups / ('commons-' + stamp)
            temporary = Path(tempfile.mkdtemp(prefix='.backup-', dir=self.backups))
            try:
                snapshot = json.loads(self.file_helper('snapshot', temporary, {'uid': os.getuid(), 'gid': os.getgid()}))
                pairs, self.mongo_data = snapshot['services'], snapshot['mongo_data']
                if not any(service == 'id-api' for service, _ in pairs):
                    raise BackupError('identity_database_missing')
                configuration = temporary / 'configuration'
                configuration.mkdir(mode=0o700)
                shutil.copyfile(self.root / '.env', configuration / 'environment.env')
                pairs.append(['configuration', 'configuration/environment.env'])
                for source, name in [('/etc/edutictac-quiosc.json', 'quiosc-host.json'),
                                     ('/etc/tmpfiles.d/edutictac-quiosc.conf', 'quiosc-tmpfiles.conf')]:
                    if Path(source).is_file():
                        shutil.copyfile(source, configuration / name)
                        pairs.append(['configuration', 'configuration/' + name])
                references = ['compose.yml', 'VERSION', 'authentik-blueprints', 'authentik-compat']
                make_archive(self.root, configuration / 'files.tar.gz', references)
                pairs.append(['configuration', 'configuration/files.tar.gz'])
                metadata = {}
                if self.database_available('authentik-postgresql', before, started):
                    folder = temporary / 'authentik'; folder.mkdir(exist_ok=True, mode=0o700)
                    self.compose(['exec', '-T', 'authentik-postgresql', 'pg_dump', '-U', self.values.get('AUTHENTIK_PG_USER', 'authentik'),
                        '-d', self.values.get('AUTHENTIK_PG_DB', 'authentik'), '-Fc', '--no-owner', '--no-acl'], 'postgres_dump_failed', output=folder / 'database.dump')
                    self.compose(['exec', '-T', 'authentik-postgresql', 'pg_restore', '--list'], 'postgres_dump_invalid', input_file=folder / 'database.dump')
                    pairs.append(['authentik', 'authentik/database.dump'])
                    metadata['postgres'] = {'user': self.values.get('AUTHENTIK_PG_USER', 'authentik'), 'database': self.values.get('AUTHENTIK_PG_DB', 'authentik')}
                if self.database_available('eduhoot-mongo', before, started):
                    folder = temporary / 'eduhoot'; folder.mkdir(exist_ok=True, mode=0o700)
                    self.compose(['exec', '-T', 'eduhoot-mongo', 'mongodump', '--quiet', '--archive', '--gzip'], 'mongo_dump_failed', output=folder / 'mongo.archive.gz')
                    pairs.append(['eduhoot', 'eduhoot/mongo.archive.gz'])
                services = []
                for name in sorted({name for name, _ in pairs}):
                    paths = sorted(path for service, path in pairs if service == name)
                    services.append({'name': name, 'status': 'ok', 'paths': paths,
                                     'checksums': {path: digest(temporary / path) for path in paths}})
                manifest = {'manifest_version': 2, 'created_at': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'stack_version': (self.root / 'VERSION').read_text().strip(), 'services': services, 'warnings': [],
                    'profiles': sorted(filter(None, self.values.get('COMPOSE_PROFILES', '').split(','))),
                    'metadata': metadata, 'extra_roots': self.extra_roots(), 'complete': True}
                (temporary / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
                for path in temporary.rglob('*'):
                    if not path.is_symlink():
                        path.chmod(0o700 if path.is_dir() else 0o600)
                self.validate(temporary, age=False)
                os.replace(temporary, destination)
            finally:
                if temporary.exists():
                    shutil.rmtree(temporary)
        print('Còpia completa creada: ' + destination.name, flush=True)
        return destination

    def extra_roots(self):
        known = {entry for group in GROUPS.values() for entry in group} | {'eduhoot-mongo'} | RUNTIME | SQLITE_FILES
        return sorted(p.name for p in (self.root / 'data').iterdir() if p.name not in known)

    def validate(self, backup, age=True):
        backup = Path(backup).resolve()
        if not backup.is_relative_to(self.backups.resolve()):
            raise BackupError('invalid_backup_directory')
        try:
            manifest = json.loads((backup / 'manifest.json').read_text())
            if manifest['manifest_version'] not in (1, 2):
                raise BackupError('unsupported_manifest')
            created = datetime.strptime(manifest['created_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
            if age and (datetime.now(timezone.utc) - created).total_seconds() > float(os.environ.get('BACKUP_MAX_AGE_HOURS', '24')) * 3600:
                raise BackupError('backup_too_old')
            names = set()
            reserved = {entry for group in GROUPS.values() for entry in group} | {'eduhoot-mongo'} | RUNTIME | SQLITE_FILES
            if any(len(safe_name(name).parts) != 1 or name in reserved for name in manifest.get('extra_roots', [])):
                raise BackupError('invalid_extra_roots')
            for service in manifest['services']:
                name, paths = service['name'], service['paths']
                if name not in set(DATABASES) | set(GROUPS) | {'configuration', 'local-data'} or name in names or not paths:
                    raise BackupError('invalid_service_manifest')
                names.add(name)
                if set(paths) != set(service['checksums']):
                    raise BackupError('incomplete_checksums')
                allowed_paths = ARTIFACTS[name]
                if manifest['manifest_version'] == 1 and name == 'eduhoot':
                    allowed_paths = {'eduhoot/mongo.archive', 'eduhoot/uploads.tar', 'eduhoot/logs.tar'}
                if not set(paths) <= allowed_paths or service.get('status') != 'ok':
                    raise BackupError('invalid_service_path')
                for relative in paths:
                    path = safe_name(relative)
                    if path.parts[0] != name:
                        raise BackupError('invalid_service_path')
                    source = backup / relative
                    if source.is_symlink() or not source.resolve().is_relative_to(backup) or not source.is_file():
                        raise BackupError('missing_backup_file')
                    if digest(source) != service['checksums'][relative]:
                        raise BackupError('checksum_mismatch')
                    if relative.endswith('.db'):
                        check_sqlite(source)
                    if relative.endswith(('.tar.gz', '.tar')):
                        with tarfile.open(source) as archive:
                            allowed = set(GROUPS.get(name, manifest.get('extra_roots', [])))
                            if name == 'configuration':
                                allowed = {'compose.yml', 'VERSION', 'authentik-blueprints', 'authentik-compat'}
                            if manifest['manifest_version'] == 1 and name == 'eduhoot':
                                allowed = {'eduhoot-uploads', 'eduhoot-logs'}
                            archive_members(archive, allowed)
            if 'id-api' not in names:
                raise BackupError('identity_database_missing')
            if not any('id-api/id.db' in s['paths'] for s in manifest['services']):
                raise BackupError('identity_database_missing')
            if manifest['manifest_version'] == 1 and 'eduhoot' in names:
                required = {'eduhoot/mongo.archive', 'eduhoot/uploads.tar', 'eduhoot/logs.tar'}
                if not required <= {p for s in manifest['services'] for p in s['paths']}:
                    raise BackupError('incomplete_legacy_backup')
            if manifest['manifest_version'] == 2:
                if not manifest.get('complete') or 'configuration' not in names or manifest.get('warnings'):
                    raise BackupError('incomplete_backup')
                profiles = set(manifest['profiles'])
                if not (profiles & {'play', 'eduhoot', 'recursos', 'authentik'}) <= names:
                    raise BackupError('module_not_covered')
                paths = {p for s in manifest['services'] for p in s['paths']}
                required = {'configuration/environment.env', 'configuration/files.tar.gz'}
                for profile, relative in [('authentik', 'authentik/database.dump'), ('eduhoot', 'eduhoot/mongo.archive.gz'), ('recursos', 'recursos/recursos.db')]:
                    if profile in profiles:
                        required.add(relative)
                if not required <= paths:
                    raise BackupError('module_not_covered')
            return manifest
        except (OSError, ValueError, TypeError, KeyError, tarfile.TarError, sqlite3.Error):
            raise BackupError('invalid_backup') from None

    def latest(self):
        candidates = sorted(p for p in self.backups.iterdir() if p.is_dir() and NAME.fullmatch(p.name))
        if not candidates:
            raise BackupError('backup_missing')
        return candidates[-1]

    def restore(self, backup):
        backup = Path(backup).resolve()
        if not NAME.fullmatch(backup.name):
            raise BackupError('invalid_backup_name')
        manifest = self.validate(backup, age=False)
        # Full safety backup must succeed before any data or configuration changes.
        safety = self.create()
        original = (self.root / '.env').read_text()
        before = self.running()
        stopped = sorted(before & (WRITERS | FRONTENDS))
        self.ensure_idle()
        self.compose(['stop', *stopped], 'writers_stop_failed') if stopped else None
        try:
            if manifest['manifest_version'] == 2:
                restored = read_env(backup / 'configuration/environment.env')
                current = self.values
                keep = {'COMPOSE_PROJECT_NAME', 'REPO_DIR', 'PUID', 'PGID', 'IMAGE_TAG', 'ADMIN_TAG', 'IMAGE_REGISTRY', 'EDUHOOT_TAG', 'RECURSOS_TAG', 'AUTHENTIK_TAG', 'AUTHENTIK_IMAGE', 'AUTHENTIK_PG_PASS', 'AUTHENTIK_PG_USER', 'AUTHENTIK_PG_DB', 'EDUTICTAC_MDNS_NAME'}
                keep.update(key for key in current if key.endswith(('_URL', '_URI', '_PORT', '_HOST')))
                keep.update(key for key in set(current) | set(restored) if key.startswith('QUIOSC_'))
                for key in keep:
                    if key in current:
                        restored[key] = current[key]
                    else:
                        restored.pop(key, None)
                restored['REPO_DIR'] = str(self.root)
                # Host preparation and live classroom sessions cannot be replayed.
                restored['QUIOSC_MODE'] = 'disabled'
                atomic_config(self.root / '.env', ''.join(key + '=' + value + '\n' for key, value in restored.items()))
                self.values = restored
                self.env = {k: v for k, v in os.environ.items() if k not in self.values and not k.startswith('COMPOSE_')}
                self.env['PWD'] = str(self.root)
            names = {s['name'] for s in manifest['services']}
            if 'authentik' in names and any(p.endswith('.dump') for s in manifest['services'] for p in s['paths']):
                self.compose(['up', '-d', '--no-deps', '--no-build', '--wait', 'authentik-postgresql'], 'postgres_start_failed')
                self.compose(['exec', '-T', 'authentik-postgresql', 'pg_restore', '-U', self.values.get('AUTHENTIK_PG_USER', 'authentik'),
                    '-d', self.values.get('AUTHENTIK_PG_DB', 'authentik'), '--clean', '--if-exists', '--no-owner', '--no-acl', '--exit-on-error', '--single-transaction'],
                    'postgres_restore_failed', input_file=backup / 'authentik/database.dump')
            if 'eduhoot' in names:
                self.compose(['up', '-d', '--no-deps', '--no-build', '--wait', 'eduhoot-mongo'], 'mongo_start_failed')
                modern = manifest['manifest_version'] == 2
                self.compose(['exec', '-T', 'eduhoot-mongo', 'mongorestore', '--quiet', '--drop', '--archive', *(['--gzip'] if modern else [])],
                    'mongo_restore_failed', input_file=backup / ('eduhoot/mongo.archive.gz' if modern else 'eduhoot/mongo.archive'))
            uid, gid = int(self.values.get('PUID', os.getuid())), int(self.values.get('PGID', os.getgid()))
            if manifest['manifest_version'] == 1:
                # Legacy archives use the same constrained extraction helper.
                for service in manifest['services']:
                    if service['name'] == 'eduhoot':
                        # Normalize names without altering the original backup.
                        with tempfile.TemporaryDirectory(prefix='.legacy-', dir=self.backups) as work:
                            folder = Path(work); (folder / 'eduhoot').mkdir()
                            for entry in ('uploads', 'logs'):
                                source = backup / ('eduhoot/' + entry + '.tar')
                                shutil.copyfile(source, folder / 'eduhoot/files.tar.gz')
                                self.file_helper('restore', folder, {'uid': uid, 'gid': gid, 'services': [{'name': 'eduhoot', 'paths': ['eduhoot/files.tar.gz']}]}, True)
                selected = [s for s in manifest['services'] if s['name'] == 'id-api']
            else:
                selected = [s for s in manifest['services'] if s['name'] != 'configuration']
            self.file_helper('restore', backup, {'uid': uid, 'gid': gid, 'services': selected, 'extra_roots': manifest.get('extra_roots', [])}, True)
            if (self.root / 'scripts/manage-modules.py').exists():
                self.command([sys.executable, str(self.root / 'scripts/manage-modules.py'), 'status', '--write'], 'module_state_refresh_failed')
            self.compose(['up', '-d', '--no-build', '--wait', '--wait-timeout', '180'], 'restored_services_start_failed')
            profiles = set(self.values.get('COMPOSE_PROFILES', '').split(','))
            for service, profile in [('eduhoot-mongo', 'eduhoot'), ('authentik-postgresql', 'authentik')]:
                if profile not in profiles:
                    self.compose(['stop', service], 'restored_selection_failed')
            (self.backups / 'restore-failed.json').unlink(missing_ok=True)
            print('Restauració completa verificada; Quiosc requerix revisió abans de reactivar-lo', flush=True)
        except Exception:
            # Never announce a successful restore after a partial failure. The
            # pre-restore safety backup remains available for recovery.
            self.compose(['stop', *sorted(WRITERS & self.running())], 'failed_restore_stop_failed')
            (self.backups / 'restore-failed.json').write_text(json.dumps({'backup': backup.name, 'safety_backup': safety.name}) + '\n')
            print('Restauració interrompuda; serveis amb escriptura aturats i còpia prèvia disponible', flush=True)
            raise


def main():
    os.umask(0o077)
    def interrupted(_signal, _frame):
        raise BackupError('interrupted')
    signal.signal(signal.SIGTERM, interrupted)
    signal.signal(signal.SIGINT, interrupted)
    if len(sys.argv) >= 3 and sys.argv[1] == 'helper':
        payload = json.load(sys.stdin)
        try:
            helper(sys.argv[2], payload)
        finally:
            if sys.argv[2] == 'snapshot':
                for path in Path('/snapshot-backup').rglob('*'):
                    os.chown(path, payload['uid'], payload['gid'], follow_symlinks=False)
                    if not path.is_symlink():
                        path.chmod(0o700 if path.is_dir() else 0o600)
        return
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    parser.add_argument('action', choices=['create', 'check', 'restore'])
    parser.add_argument('backup', nargs='?')
    args = parser.parse_args()
    stack = Stack(args.root)
    if args.action == 'check':
        manifest = stack.validate(Path(args.backup) if args.backup else stack.latest())
        print('Backup verificat: ' + ', '.join(s['name'] for s in manifest['services']))
        if manifest['manifest_version'] == 1:
            print('Avís: format antic; cobertura parcial, sense configuració completa')
    else:
        with stack.locks():
            if args.action == 'create':
                destination = stack.create()
                # Writers have already resumed. A missing removable device must
                # not invalidate the complete local backup or stop retention.
                from backup_secondary import Secondary
                secondary = Secondary(stack.backups)
                try:
                    with secondary.locked():
                        result = secondary.copy(destination, stack.validate)
                    if result != 'disabled':
                        print('secondary: success', flush=True)
                except Exception:
                    print('secondary: warning; revisa l’estat de la segona còpia en Administració', flush=True)
            elif args.backup:
                stack.restore(args.backup)
            else:
                raise BackupError('backup_required')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        code = str(error) if isinstance(error, BackupError) else 'operation_failed_' + type(error).__name__
        print('backup: ' + code, file=sys.stderr)
        sys.exit(1)
