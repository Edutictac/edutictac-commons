"""Optional second copy on a mounted school device. No mounting or credentials."""
from contextlib import contextmanager
from datetime import datetime, timezone
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import tempfile
import uuid

NAME = re.compile(r'commons-\d{8}T\d{6}Z')
AGE_ARCHIVE = 'backup.tar.gz.age'


class SecondaryError(Exception):
    pass


def atomic_json(path, value):
    fd, temporary = tempfile.mkstemp(prefix='.secondary-', dir=path.parent)
    try:
        os.fchmod(fd, 0o600)
        with os.fdopen(fd, 'w') as stream:
            json.dump(value, stream)
            stream.write('\n')
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def load_json(path, default):
    try:
        value = json.loads(path.read_text())
        if not isinstance(value, dict):
            raise ValueError
        return value
    except FileNotFoundError:
        return default
    except (OSError, ValueError):
        raise SecondaryError('invalid_configuration') from None


def public_status(backups):
    try:
        config = load_json(backups / 'secondary.json', {})
        last = load_json(backups / 'secondary-status.json', {})
        return {'enabled': config.get('enabled', False), 'mount': config.get('mount', ''),
                'last': last}
    except SecondaryError:
        return {'enabled': False, 'mount': '', 'last': {'result': 'failed', 'error': 'invalid_configuration'}}


def mount_identity(path):
    # findmnt reads kernel mount information. Never return its source (which can
    # contain account names); persist only a fingerprint and the selected path.
    result = subprocess.run(['findmnt', '--json', '--mountpoint', str(path),
                             '--output', 'TARGET,SOURCE,FSTYPE,UUID,FSROOT'],
                            capture_output=True, text=True, timeout=10)
    try:
        rows = json.loads(result.stdout)['filesystems']
        if result.returncode or len(rows) != 1 or rows[0]['target'] != str(path):
            raise ValueError
        row = rows[0]
        if row['fstype'] in {'tmpfs', 'devtmpfs', 'overlay', 'proc', 'sysfs'}:
            raise ValueError
        if row['source'].startswith('/dev/') and not row.get('uuid'):
            raise ValueError
        identity = [row.get('uuid') or row['source'], row['fstype'], row.get('fsroot')]
        return hashlib.sha256(json.dumps(identity).encode()).hexdigest()
    except (ValueError, KeyError, TypeError):
        raise SecondaryError('device_unavailable') from None


def mount_path(value):
    if not isinstance(value, str) or len(value) > 1024 or any(ord(c) < 32 for c in value):
        raise SecondaryError('invalid_mount')
    path = Path(value)
    if not value or not path.is_absolute() or '..' in path.parts or path == Path('/'):
        raise SecondaryError('invalid_mount')
    if any(p.is_symlink() for p in [path, *path.parents]):
        raise SecondaryError('invalid_mount')
    return path


def physical_disks(device_number, seen=None):
    """Resolve partition/LVM/RAID backing disks where sysfs exposes them."""
    seen = set() if seen is None else seen
    if device_number in seen:
        return set()
    seen.add(device_number)
    entry = Path('/sys/dev/block') / f'{os.major(device_number)}:{os.minor(device_number)}'
    if not entry.exists():
        return set()  # Network filesystems do not have local backing block disks.
    entry = entry.resolve()
    if (entry / 'partition').exists():
        entry = entry.parent
    slaves = list((entry / 'slaves').iterdir()) if (entry / 'slaves').exists() else []
    if not slaves:
        return {str(entry)}
    result = set()
    for slave in slaves:
        major, minor = (int(value) for value in (slave / 'dev').read_text().strip().split(':'))
        result |= physical_disks(os.makedev(major, minor), seen)
    return result


@contextmanager
def device(config, backups):
    path = mount_path(config['mount'])
    identity = mount_identity(path)
    if config.get('fingerprint', identity) != identity:
        raise SecondaryError('device_changed')
    fd = os.open(path, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    try:
        if mount_identity(path) != identity or os.stat(path).st_dev != os.fstat(fd).st_dev:
            raise SecondaryError('device_changed')
        target_dev, local_dev = os.fstat(fd).st_dev, backups.stat().st_dev
        if target_dev == local_dev or physical_disks(target_dev) & physical_disks(local_dev):
            raise SecondaryError('same_device')
        # Pin the mounted filesystem: if it disappears, all subsequent writes
        # still use this descriptor, never the empty mount directory underneath.
        yield Path('/proc/self/fd') / str(fd), identity
    finally:
        os.close(fd)


def private_directory(parent, name):
    path = parent / name
    try:
        path.mkdir(mode=0o700)
    except FileExistsError:
        pass
    fd = os.open(path, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    mode = os.fstat(fd).st_mode
    if stat.S_IMODE(mode) != 0o700:
        os.close(fd)
        raise SecondaryError('private_permissions_required')
    return fd


def hashes(folder):
    if stat.S_IMODE(folder.lstat().st_mode) != 0o700:
        raise SecondaryError('private_permissions_required')
    result = {}
    for path in sorted(folder.rglob('*')):
        mode = path.lstat().st_mode
        if stat.S_ISDIR(mode):
            if stat.S_IMODE(mode) != 0o700:
                raise SecondaryError('private_permissions_required')
            result[str(path.relative_to(folder))] = 'directory'
            continue
        if not stat.S_ISREG(mode):
            raise SecondaryError('unsafe_backup_file')
        if stat.S_IMODE(mode) != 0o600:
            raise SecondaryError('private_permissions_required')
        h = hashlib.sha256()
        with path.open('rb') as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b''):
                h.update(chunk)
        result[str(path.relative_to(folder))] = h.hexdigest()
    return result


class Secondary:
    def __init__(self, backups):
        self.backups = Path(backups)
        self.config_path = self.backups / 'secondary.json'
        self.status_path = self.backups / 'secondary-status.json'

    @contextmanager
    def locked(self):
        fd = os.open(self.backups / '.secondary.lock', os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
        try:
            try:
                fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                raise SecondaryError('operation_busy') from None
            yield
        finally:
            os.close(fd)

    @contextmanager
    def destination(self, config):
        with device(config, self.backups) as (mounted, identity):
            fd = private_directory(mounted, 'edutictac-commons')
            try:
                root = Path('/proc/self/fd') / str(fd)
                instance_fd = private_directory(root, config['installation'])
                try:
                    yield Path('/proc/self/fd') / str(instance_fd), identity
                finally:
                    os.close(instance_fd)
            finally:
                os.close(fd)

    def configure(self, mount):
        previous = load_json(self.config_path, {})
        config = {'enabled': True, 'mount': str(mount_path(mount)),
                  'installation': previous.get('installation', uuid.uuid4().hex)}
        if not re.fullmatch(r'[a-f0-9]{32}', config['installation']):
            raise SecondaryError('invalid_configuration')
        with self.destination(config) as (folder, identity):
            # Require actual writable storage and effective private permissions.
            fd, probe = tempfile.mkstemp(prefix='.probe-', dir=folder)
            try:
                os.fchmod(fd, 0o600)
                if stat.S_IMODE(os.fstat(fd).st_mode) != 0o600:
                    raise SecondaryError('private_permissions_required')
                os.fsync(fd)
            finally:
                os.close(fd)
                Path(probe).unlink(missing_ok=True)
        config['fingerprint'] = identity
        atomic_json(self.config_path, config)
        atomic_json(self.status_path, {'result': 'ready', 'checked_at': self.now()})

    def disable(self):
        config = load_json(self.config_path, {})
        config['enabled'] = False
        atomic_json(self.config_path, config)
        atomic_json(self.status_path, {'result': 'disabled', 'checked_at': self.now()})

    @staticmethod
    def now():
        return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    def copy(self, source, validate):
        config = load_json(self.config_path, {})
        if not config.get('enabled'):
            return 'disabled'
        try:
            if not re.fullmatch(r'[a-f0-9]{32}', config.get('installation', '')):
                raise SecondaryError('invalid_configuration')
            if not NAME.fullmatch(source.name) or source.is_symlink() or source.parent != self.backups:
                raise SecondaryError('invalid_backup')
            try:
                manifest = validate(source, age=False)
            except Exception as error:
                if str(error) != 'backup_encryption_key_missing' or not (source / AGE_ARCHIVE).is_file():
                    raise
                manifest = json.loads((source / 'manifest.json').read_text())
            if manifest.get('manifest_version') != 2 or manifest.get('complete') is not True:
                raise SecondaryError('complete_backup_required')
            expected = hashes(source)
            with self.destination(config) as (folder, _):
                target = folder / source.name
                if target.exists() or target.is_symlink():
                    if target.is_symlink() or not target.is_dir() or hashes(target) != expected:
                        raise SecondaryError('destination_conflict')
                else:
                    required = sum(p.stat().st_size for p in source.rglob('*') if p.is_file())
                    if shutil.disk_usage(folder).free < required + 16 * 1024 * 1024:
                        raise SecondaryError('destination_full')
                    temporary = Path(tempfile.mkdtemp(prefix='.partial-', dir=folder))
                    try:
                        for path in sorted(source.rglob('*')):
                            dest = temporary / path.relative_to(source)
                            if path.is_dir():
                                dest.mkdir(mode=0o700)
                            else:
                                with path.open('rb') as src, dest.open('xb') as dst:
                                    os.fchmod(dst.fileno(), 0o600)
                                    shutil.copyfileobj(src, dst, 1024 * 1024)
                                    dst.flush()
                                    os.fsync(dst.fileno())
                                if stat.S_IMODE(dest.stat().st_mode) != 0o600:
                                    raise SecondaryError('private_permissions_required')
                        for directory in [temporary, *(p for p in temporary.rglob('*') if p.is_dir())]:
                            fd = os.open(directory, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
                            try:
                                if stat.S_IMODE(os.fstat(fd).st_mode) != 0o700:
                                    raise SecondaryError('private_permissions_required')
                                os.fsync(fd)
                            finally:
                                os.close(fd)
                        if hashes(temporary) != expected:
                            raise SecondaryError('copy_verification_failed')
                        os.rename(temporary, target)
                        fd = os.open(folder, os.O_RDONLY | os.O_DIRECTORY)
                        try:
                            os.fsync(fd)
                        finally:
                            os.close(fd)
                    finally:
                        if temporary.exists():
                            shutil.rmtree(temporary)
            atomic_json(self.status_path, {'result': 'success', 'backup': source.name, 'checked_at': self.now()})
            return 'success'
        except Exception as exc:
            code = str(exc) if isinstance(exc, SecondaryError) else 'copy_failed'
            atomic_json(self.status_path, {'result': 'failed', 'error': code, 'checked_at': self.now()})
            raise SecondaryError(code) from None
