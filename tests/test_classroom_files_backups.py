"""Prove files introduced by a Docker update are covered by the beta2 host helper."""
import importlib.util
import subprocess
import sys
from pathlib import Path

import test_backups
from test_backups import stack


def test_unchanged_beta2_backup_restores_classroom_blobs_with_database(stack,monkeypatch):
    root=Path(__file__).parents[1]
    # This exact released helper is what remains installed after an image-only update.
    source=subprocess.check_output(['git','show','80f909c:scripts/backup-stack.py'],cwd=root,text=True)
    spec=importlib.util.spec_from_loader('beta2_backup_compatibility',loader=None)
    old=importlib.util.module_from_spec(spec);old.__file__=str(root/'scripts/backup-stack.py')
    exec(compile(source,old.__file__,'exec'),old.__dict__)
    monkeypatch.setattr(test_backups,'b',old)
    folder=stack.root/'data/id-api/files'/('a'*64);folder.mkdir(parents=True)
    shared=folder/('b'*32+'.txt');shared.write_bytes(b'Shared classroom file')
    private=folder/('c'*32+'.txt');private.write_bytes(b'Private pupil submission')
    backup=test_backups.create(stack)
    manifest=stack.validate(backup)
    assert 'id-api' in manifest['extra_roots']
    shared.write_bytes(b'changed');private.unlink()
    # Restore exercises the real beta2 extraction and its path allowlist.
    with stack.locks():stack.restore(backup)
    assert shared.read_bytes()==b'Shared classroom file'
    assert private.read_bytes()==b'Private pupil submission'
