"""Second-device backups: verified publication, unplugging and safe retries."""
from contextlib import contextmanager
import importlib.util
import json
import os
from pathlib import Path
import stat
import sys

import pytest

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import backup_secondary as module


@pytest.fixture
def storage(tmp_path, monkeypatch):
    backups = tmp_path / 'backups'; backups.mkdir(mode=0o700)
    mounted = tmp_path / 'device'; mounted.mkdir(mode=0o700)
    secondary = module.Secondary(backups)
    available = {'online': True, 'identity': 'device-one'}

    @contextmanager
    def device(config, local):
        if not available['online']:
            raise module.SecondaryError('device_unavailable')
        if config.get('fingerprint', available['identity']) != available['identity']:
            raise module.SecondaryError('device_changed')
        yield mounted, available['identity']
    monkeypatch.setattr(module, 'device', device)
    source = backups / 'commons-20261018T061500Z'; source.mkdir(mode=0o700)
    (source / 'configuration').mkdir(mode=0o700)
    (source / 'configuration/environment.env').write_text('SYNTHETIC_SETTING=fixture\n')
    (source / 'manifest.json').write_text('{"manifest_version":2,"complete":true}')
    for p in source.rglob('*'):
        if p.is_file(): p.chmod(0o600)
    def validate(path, age=False):
        assert path == source
        return json.loads((source / 'manifest.json').read_text())
    return secondary, mounted, source, validate, available


def destination(secondary, mounted, source):
    config = json.loads(secondary.config_path.read_text())
    return mounted / 'edutictac-commons' / config['installation'] / source.name


def test_optional_disabled_never_touches_a_device(storage):
    secondary, mounted, source, validate, available = storage
    available['online'] = False
    assert secondary.copy(source, validate) == 'disabled'
    assert not list(mounted.iterdir())


def test_configure_copy_verify_retry_and_disable_preserve_local_and_remote(storage):
    secondary, mounted, source, validate, available = storage
    secondary.configure(str(mounted))
    assert module.public_status(secondary.backups)['last']['result'] == 'ready'
    assert secondary.copy(source, validate) == 'success'
    target = destination(secondary, mounted, source)
    assert module.hashes(target) == module.hashes(source)
    for p in [target, *target.rglob('*')]:
        assert stat.S_IMODE(p.stat().st_mode) == (0o700 if p.is_dir() else 0o600)
    stamp = target.stat().st_mtime_ns
    assert secondary.copy(source, validate) == 'success'
    assert target.stat().st_mtime_ns == stamp
    secondary.disable(); available['online'] = False
    assert secondary.copy(source, validate) == 'disabled'
    assert target.is_dir() and source.is_dir()
    assert module.public_status(secondary.backups)['enabled'] is False


@pytest.mark.parametrize('failure', ['unplugged', 'other-device', 'full', 'write-error'])
def test_copy_failure_keeps_local_and_previous_copies_and_can_retry(storage, monkeypatch, failure):
    secondary, mounted, source, validate, available = storage
    secondary.configure(str(mounted)); secondary.copy(source, validate)
    first = destination(secondary, mounted, source)
    previous = first / 'manifest.json'; original = previous.read_bytes()
    # A later complete backup has a different name.
    newer = source.with_name('commons-20261019T061500Z')
    import shutil
    shutil.copytree(source, newer)
    def validate_new(path, age=False): return {'manifest_version': 2, 'complete': True}
    with monkeypatch.context() as patch:
        if failure == 'unplugged': available['online'] = False
        elif failure == 'other-device': available['identity'] = 'different'
        elif failure == 'full': patch.setattr(module.shutil, 'disk_usage', lambda p: type('Usage', (), {'free': 0})())
        else: patch.setattr(module.shutil, 'copyfileobj', lambda *a: (_ for _ in ()).throw(OSError('synthetic')))
        with pytest.raises(module.SecondaryError): secondary.copy(newer, validate_new)
    assert newer.is_dir() and previous.read_bytes() == original
    assert not first.with_name(newer.name).exists()
    assert not list(first.parent.glob('.partial-*'))
    assert module.public_status(secondary.backups)['last']['result'] == 'failed'
    available.update(online=True, identity='device-one')
    assert secondary.copy(newer, validate_new) == 'success'


def test_existing_different_copy_is_never_overwritten(storage):
    secondary, mounted, source, validate, _ = storage
    secondary.configure(str(mounted)); secondary.copy(source, validate)
    target = destination(secondary, mounted, source)
    (target / 'manifest.json').write_text('different')
    with pytest.raises(module.SecondaryError, match='destination_conflict'):
        secondary.copy(source, validate)
    assert (target / 'manifest.json').read_text() == 'different'


@pytest.mark.parametrize('unsafe', ['source-link', 'target-link', 'partial-manifest', 'failed-validation'])
def test_unsafe_or_unverified_backups_are_not_published(storage, unsafe):
    secondary, mounted, source, validate, _ = storage
    secondary.configure(str(mounted))
    target = destination(secondary, mounted, source)
    if unsafe == 'source-link': (source / 'linked').symlink_to(source / 'manifest.json')
    elif unsafe == 'target-link': target.symlink_to(source, target_is_directory=True)
    elif unsafe == 'partial-manifest': (source / 'manifest.json').write_text('{"manifest_version":1}')
    else:
        def validate(*a, **kw): raise RuntimeError('checksum mismatch')
    with pytest.raises(module.SecondaryError): secondary.copy(source, validate)
    assert module.public_status(secondary.backups)['last']['result'] == 'failed'
    assert source.is_dir()


def test_configuration_rejects_public_destination_and_does_not_enable_it(storage):
    secondary, mounted, source, validate, _ = storage
    (mounted / 'edutictac-commons').mkdir(mode=0o755)
    with pytest.raises(module.SecondaryError, match='private_permissions_required'):
        secondary.configure(str(mounted))
    assert module.public_status(secondary.backups)['enabled'] is False


@pytest.mark.parametrize('value', ['', '/', 'relative', '/mnt/../tmp', '/mnt/usb\nextra', None])
def test_mount_requires_absolute_non_root_path(value):
    with pytest.raises(module.SecondaryError, match='invalid_mount'): module.mount_path(value)


def test_symlink_mount_is_rejected(tmp_path):
    (tmp_path / 'link').symlink_to(tmp_path, target_is_directory=True)
    with pytest.raises(module.SecondaryError): module.mount_path(str(tmp_path / 'link'))


def test_unmounted_directory_is_not_used_as_fallback(tmp_path):
    with pytest.raises(module.SecondaryError, match='device_unavailable'):
        module.mount_identity(tmp_path)
    assert list(tmp_path.iterdir()) == []


def test_actual_device_check_rejects_same_disk(tmp_path, monkeypatch):
    monkeypatch.setattr(module, 'mount_identity', lambda path: 'identity')
    with pytest.raises(module.SecondaryError, match='same_device'):
        with module.device({'mount': str(tmp_path)}, tmp_path): pass


def test_concurrent_configuration_or_copy_is_rejected(storage):
    secondary, *_ = storage
    with secondary.locked():
        with pytest.raises(module.SecondaryError, match='operation_busy'):
            with secondary.locked(): pass


def test_optional_copy_failure_does_not_fail_complete_local_backup(storage, monkeypatch, capsys):
    secondary, mounted, source, validate, available = storage
    secondary.configure(str(mounted)); available['online'] = False
    spec = importlib.util.spec_from_file_location('secondary_stack_test', ROOT / 'scripts/backup-stack.py')
    stack_module = importlib.util.module_from_spec(spec);spec.loader.exec_module(stack_module)
    @contextmanager
    def locks(): yield
    class Stack:
        def __init__(self, root): self.backups = secondary.backups
        def locks(self): return locks()
        def create(self): return source
        def validate(self, *a, **kw): return validate(*a, **kw)
    monkeypatch.setattr(stack_module, 'Stack', Stack)
    monkeypatch.setattr(sys, 'argv', ['backup-stack.py', 'create'])
    stack_module.main()
    assert source.is_dir()
    assert 'secondary: warning' in capsys.readouterr().out
    assert module.public_status(secondary.backups)['last']['error'] == 'device_unavailable'


def test_pinned_device_never_falls_back_to_empty_mount_directory(tmp_path, monkeypatch):
    mounted = tmp_path / 'usb'; mounted.mkdir()
    monkeypatch.setattr(module, 'mount_identity', lambda p: 'fixed-device')
    class LocalBackups:
        def stat(self): return type('Stat', (), {'st_dev': os.makedev(250, 250)})()
    with module.device({'mount':str(mounted)}, LocalBackups()) as (pinned, identity):
        # Model the mount path being replaced after opening its descriptor.
        original = tmp_path / 'detached-device'; mounted.rename(original); mounted.mkdir()
        (pinned / 'copy').write_text('synthetic')
    assert not list(mounted.iterdir())
    assert (original / 'copy').read_text() == 'synthetic'


def test_invalid_config_is_visible_without_breaking_admin_status(storage):
    secondary, *_ = storage
    secondary.config_path.write_text('[]')
    assert module.public_status(secondary.backups)['last']['error'] == 'invalid_configuration'


def test_another_partition_of_same_physical_disk_is_rejected(tmp_path, monkeypatch):
    monkeypatch.setattr(module, 'mount_identity', lambda path: 'identity')
    monkeypatch.setattr(module, 'physical_disks', lambda number: {'same-physical-disk'})
    class LocalBackups:
        def stat(self): return type('Stat', (), {'st_dev': os.makedev(250, 250)})()
    with pytest.raises(module.SecondaryError, match='same_device'):
        with module.device({'mount':str(tmp_path)}, LocalBackups()): pass
