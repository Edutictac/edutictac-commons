#!/usr/bin/env python3
"""Capture or pin OCI image digests for the Commons stack.

`local` reads the digests Docker already has; `remote` asks the registry for
the digest the tag currently resolves to. `pin` pulls those exact digests and
retags them with the compose tag, so later restarts do not depend on a moving
tag.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import shlex
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent


def docker():
    return shlex.split(os.environ.get('DOCKER', 'docker'))


def run(arguments, *, text=True):
    return subprocess.run(arguments, capture_output=True, text=text, timeout=120)


def compose_images(env_file):
    result = run([*docker(), 'compose', '--env-file', str(env_file), '-f', str(ROOT / 'compose.yml'),
                  '--profile', '*', 'config', '--images'])
    if result.returncode:
        raise SystemExit('image_digests: compose_config_failed')
    return sorted({line.strip() for line in result.stdout.splitlines() if line.strip()})


def split_tag(ref):
    if '@' in ref or ':' not in ref:
        return None, None
    repository, tag = ref.rsplit(':', 1)
    if '/' in tag:
        return None, None
    return repository, tag


def local_digest(ref):
    result = run([*docker(), 'image', 'inspect', '--format', '{{json .RepoDigests}}', ref])
    if result.returncode:
        return None
    try:
        values = json.loads(result.stdout)
    except json.JSONDecodeError:
        return None
    for value in values:
        if isinstance(value, str) and '@sha256:' in value:
            return value
    return None


def remote_digest(ref):
    repository, _ = split_tag(ref)
    if not repository:
        return None
    result = run([*docker(), 'manifest', 'inspect', '--verbose', ref])
    if result.returncode:
        return None
    try:
        value = json.loads(result.stdout)
    except json.JSONDecodeError:
        return None
    if isinstance(value, dict):
        digest = (value.get('Descriptor') or {}).get('digest')
        if isinstance(digest, str) and digest.startswith('sha256:'):
            return f'{repository}@{digest}'
        return None
    # Multi-arch manifests: hash the raw index returned by buildx.
    raw = run([*docker(), 'buildx', 'imagetools', 'inspect', '--raw', ref])
    if raw.returncode:
        return None
    digest = hashlib.sha256(raw.stdout.encode()).hexdigest()
    return f'{repository}@sha256:{digest}'


def capture(mode, env_file):
    values = {}
    for ref in compose_images(env_file):
        if '@sha256:' in ref:
            continue
        digest = local_digest(ref) if mode == 'local' else remote_digest(ref)
        if digest:
            values[ref] = digest
    return values


def pin(path):
    try:
        values = json.loads(Path(path).read_text())
    except (OSError, json.JSONDecodeError):
        raise SystemExit('image_digests: invalid_digest_file')
    if not isinstance(values, dict):
        raise SystemExit('image_digests: invalid_digest_file')
    for ref, digest in sorted(values.items()):
        if not isinstance(ref, str) or not isinstance(digest, str) or '@sha256:' not in digest:
            raise SystemExit('image_digests: invalid_digest_entry')
        local = run([*docker(), 'image', 'inspect', digest])
        if local.returncode:
            pulled = run([*docker(), 'pull', digest])
            if pulled.returncode:
                raise SystemExit('image_digests: pull_failed')
        tagged = run([*docker(), 'tag', digest, ref])
        if tagged.returncode:
            raise SystemExit('image_digests: tag_failed')
    return len(values)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['local', 'remote', 'pin'])
    parser.add_argument('--env-file', default=str(ROOT / '.env'))
    parser.add_argument('--output')
    parser.add_argument('--digests')
    args = parser.parse_args()
    os.chdir(ROOT)
    if args.mode == 'pin':
        if not args.digests:
            parser.error('--digests is required for pin')
        count = pin(args.digests)
        print(f'image-digests: pinned {count}')
        return 0
    env_file = Path(args.env_file)
    if not env_file.is_file():
        env_file = ROOT / '.env.example'
    values = capture(args.mode, env_file)
    text = json.dumps(values, indent=2, sort_keys=True) + '\n'
    if args.output:
        Path(args.output).write_text(text)
    else:
        sys.stdout.write(text)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
