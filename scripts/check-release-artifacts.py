#!/usr/bin/env python3
"""Reject local work data and credentials in container/installer artifacts.

Only member names are inspected. File contents and credentials are never logged.
"""
import argparse
from pathlib import PurePosixPath
import subprocess
import tarfile
import zipfile


def forbidden(name):
    parts = PurePosixPath(name).parts
    return any(part in {'.recall', '.git', '.ssh', '.gnupg'}
               or part == '.env'
               or (part.startswith('.env.') and part != '.env.example')
               for part in parts)


def check_tar(command):
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    try:
        with tarfile.open(fileobj=process.stdout, mode='r|') as archive:
            # Base OS images may contain empty .ssh directories. Reject files
            # and links within them, without mistaking an empty directory for data.
            bad = sum(forbidden(entry.name) and not entry.isdir() for entry in archive)
    finally:
        process.stdout.close()
    if process.wait() != 0:
        raise RuntimeError('Artifact could not be inspected')
    return bad


def check_image(image):
    cid = subprocess.check_output(['docker', 'create', image], text=True).strip()
    try:
        return check_tar(['docker', 'export', cid])
    finally:
        subprocess.run(['docker', 'rm', cid], stdout=subprocess.DEVNULL,
                       stderr=subprocess.DEVNULL, check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--image', action='append', default=[])
    parser.add_argument('--deb', action='append', default=[])
    parser.add_argument('--source', action='append', default=[])
    args = parser.parse_args()
    counts = []
    for image in args.image:
        counts.append(check_image(image))
    for package in args.deb:
        counts.append(check_tar(['dpkg-deb', '--fsys-tarfile', package]))
    for source in args.source:
        with zipfile.ZipFile(source) as archive:
            counts.append(sum(forbidden(entry.filename) and not entry.is_dir() for entry in archive.infolist()))
    if not counts:
        parser.error('Specify an image, installer or source archive')
    if any(counts):
        raise SystemExit('Rejected: local work data or credential paths found; rebuild the affected artifact')
    print(f'{len(counts)} artifacts verified: no local work or credential paths')


if __name__ == '__main__':
    main()
