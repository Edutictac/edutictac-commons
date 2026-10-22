#!/usr/bin/env python3
"""Consistent, encrypted ID API backup. No service changes or private GPG keys."""
import argparse
from datetime import datetime, timezone
import hashlib
import io
import json
import os
from pathlib import Path
import re
import shutil
import sqlite3
import subprocess
import tarfile
import tempfile

ARCHIVE = re.compile(r"id-api-\d{8}T\d{6}Z\.tar\.gz\.gpg")


def digest(path):
    result = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            result.update(block)
    return result.hexdigest()


def atomic_json(path, value, owner):
    fd, temporary = tempfile.mkstemp(prefix='.metadata-', dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as stream:
            json.dump(value, stream, indent=2)
            stream.write('\n')
            stream.flush()
            os.fsync(stream.fileno())
        os.chmod(temporary, 0o600)
        if owner is not None:
            os.chown(temporary, owner, owner)
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def add_bytes(archive, name, content):
    info = tarfile.TarInfo(name)
    info.size = len(content)
    info.mode = 0o600
    archive.addfile(info, io.BytesIO(content))


def snapshot_database(source, destination):
    with sqlite3.connect(source.resolve().as_uri() + '?mode=ro', uri=True) as src, sqlite3.connect(destination) as dst:
        src.backup(dst, pages=128, sleep=0.1)
        dst.execute('PRAGMA journal_mode=DELETE')
        if dst.execute('PRAGMA integrity_check').fetchone()[0] != 'ok':
            raise RuntimeError('snapshot integrity check failed')


def backup(base, output, env_file, gpg_home, recipient, owner=None, keep=30,
           resources_db=None, resources_config=None):
    os.umask(0o077)
    if keep < 2:
        raise ValueError('keep must be at least two')
    if output.is_symlink():
        raise ValueError('output must not be a symlink')
    output.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(output, 0o700)
    if owner is not None:
        os.chown(output, owner, owner)
    source = base / 'data/id.db'
    if bool(resources_db) != bool(resources_config):
        raise ValueError('resources database and configuration must be backed up together')
    required = source.stat().st_size + (resources_db.stat().st_size if resources_db else 0)
    if shutil.disk_usage(output).free < required * 3 + 256 * 1024**2:
        raise RuntimeError('insufficient backup disk space')
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    name = f'id-api-{stamp}.tar.gz.gpg'
    final = output / name
    if final.exists():
        raise RuntimeError('archive already exists for this timestamp')
    partial = output / (name + '.partial')
    try:
        with tempfile.TemporaryDirectory(prefix='.snapshot-', dir=output) as directory:
            snapshot = Path(directory) / 'id.db'
            # Book owners exist in identity before publication: snapshot the bank first.
            resources_snapshot = Path(directory) / 'recursos.db'
            if resources_db:
                snapshot_database(resources_db, resources_snapshot)
            snapshot_database(source, snapshot)
            manifest = {'created_at': stamp, 'database_sha256': digest(snapshot),
                        'format': 'edutictac-id-backup', 'version': 1, 'files': {}}
            files = [('id.db', snapshot), ('legacy/main.py', base / 'main.py'),
                     ('legacy/requirements.txt', base / 'requirements.txt'),
                     ('configuration/legacy.env', env_file)]
            for item in ['compose.yml', 'service.env']:
                if (base / 'docker' / item).exists():
                    files.append(('configuration/docker/' + item, base / 'docker' / item))
            if resources_db:
                files.append(('resources/recursos.db', resources_snapshot))
                for item in ['compose.yml', 'service.env']:
                    files.append(('configuration/resources/' + item, resources_config / item))
            command = ['gpg', '--homedir', str(gpg_home), '--batch', '--yes',
                       '--trust-model', 'always', '--recipient', recipient, '--encrypt']
            with partial.open('xb') as encrypted:
                process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=encrypted, stderr=subprocess.DEVNULL)
                try:
                    with tarfile.open(fileobj=process.stdin, mode='w|gz') as archive:
                        for arcname, path in files:
                            if not path.is_file() or path.is_symlink():
                                raise RuntimeError('required backup file unavailable')
                            # Hash the exact bytes archived, even if a config changes during a run.
                            content = path.read_bytes()
                            manifest['files'][arcname] = hashlib.sha256(content).hexdigest()
                            add_bytes(archive, arcname, content)
                        unit = subprocess.run(['systemctl', 'cat', 'edutictac-id-api.service'],
                                              capture_output=True, timeout=20)
                        if unit.returncode == 0:
                            add_bytes(archive, 'configuration/legacy-unit.txt', unit.stdout)
                        add_bytes(archive, 'manifest.json', json.dumps(manifest).encode())
                    process.stdin.close()
                    if process.wait(timeout=60) != 0:
                        raise RuntimeError('backup encryption failed')
                finally:
                    if process.stdin and not process.stdin.closed:
                        process.stdin.close()
                    if process.poll() is None:
                        process.kill()
                        process.wait()
                encrypted.flush()
                os.fsync(encrypted.fileno())
        os.chmod(partial, 0o600)
        if owner is not None:
            os.chown(partial, owner, owner)
        os.replace(partial, final)
        report = {'created_at': stamp, 'name': name, 'sha256': digest(final),
                  'bytes': final.stat().st_size, 'integrity': 'ok', 'encrypted': True}
        atomic_json(output / (name + '.json'), report, owner)
        atomic_json(output / 'latest.json', report, owner)
        # Never delete manual/pre-deployment backups, only older archives produced here.
        archives = sorted(p for p in output.iterdir() if ARCHIVE.fullmatch(p.name) and not p.is_symlink())
        for expired in archives[:-keep]:
            expired.unlink()
            expired.with_name(expired.name + '.json').unlink(missing_ok=True)
        return report
    finally:
        partial.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', type=Path, default=Path('/opt/edutictac-id-api'))
    parser.add_argument('--output', type=Path, default=Path('/opt/edutictac-id-api/automatic-backups'))
    parser.add_argument('--env-file', type=Path, default=Path('/etc/edutictac-id-api.env'))
    parser.add_argument('--gpg-home', type=Path, required=True)
    parser.add_argument('--recipient', required=True)
    parser.add_argument('--owner', type=int)
    parser.add_argument('--resources-db', type=Path)
    parser.add_argument('--resources-config', type=Path)
    args = parser.parse_args()
    try:
        print(json.dumps(backup(args.base, args.output, args.env_file, args.gpg_home, args.recipient, args.owner,
                                resources_db=args.resources_db, resources_config=args.resources_config)))
    except Exception:
        # Neither external command diagnostics nor exception values may disclose credentials.
        parser.exit(1, 'ID API backup failed; no successful backup status was recorded.\n')


if __name__ == '__main__':
    main()
