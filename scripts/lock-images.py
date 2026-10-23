#!/usr/bin/env python3
"""Record published image digests and source revisions for a Commons release."""
import argparse
import json
from pathlib import Path
import subprocess


def output(command, cwd=None):
    return subprocess.check_output(command, cwd=cwd, text=True).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--registry', default='registry.edutictac.es/edutictac')
    parser.add_argument('--eduhoot-source', type=Path)
    parser.add_argument('--eduhoot-tag', default='1.0.2')
    parser.add_argument('--tag', help='Candidate tag; defaults to VERSION')
    parser.add_argument('--commons-revision', default='HEAD')
    parser.add_argument('--reuse-third-party', type=Path, help='Keep prior tested Authentik, PostgreSQL, EduHoot and Mongo digests')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    version = args.tag or (root / 'VERSION').read_text().strip()
    refs = {service: f'{args.registry}/commons-{service}:{version}'
            for service in ('id-api', 'portal', 'admin', 'play', 'blocs', 'llibres')}
    refs.update({name: f'{args.registry}/{name}:{version}' for name in ('recursos', 'recursos-api')})
    images, platforms = {}, {}
    if args.reuse_third_party:
        previous = json.loads(args.reuse_third_party.read_text())
        for service in ('authentik-postgresql', 'authentik-server', 'authentik-worker', 'eduhoot', 'eduhoot-mongo'):
            images[service] = previous['images'][service]
            platforms[service] = previous['platforms'][service]
    else:
        refs.update({'eduhoot': f'{args.registry}/eduhoot:{args.eduhoot_tag}', 'eduhoot-mongo': 'mongo:7'})
    for name, ref in refs.items():
        info = json.loads(output(['docker', 'image', 'inspect', ref]))[0]
        repository = ref.rsplit(':', 1)[0]
        digest = next((item for item in info.get('RepoDigests', []) if item.startswith(repository + '@')), None)
        if not digest:
            raise SystemExit('Published digest missing for ' + name)
        images[name] = digest
        platforms[name] = f"{info['Os']}/{info['Architecture']}"
        if platforms[name] != 'linux/amd64':
            raise SystemExit('Installer image is not linux/amd64: ' + name)
    sources = {'commons': output(['git', 'rev-parse', args.commons_revision], root)}
    for name, folder in [('recursos', 'recursos'), ('recursos-api', 'recursos-api'), ('blocs', 'edutictac-blocs'), ('llibres', 'edutictac-llibres')]:
        sources[name] = output(['git', 'rev-parse', 'HEAD'], root.parent / folder)
    if args.eduhoot_source:
        sources['eduhoot'] = output(['git', 'rev-parse', 'HEAD'], args.eduhoot_source)
    destination = root / 'releases' / version
    destination.mkdir(parents=True, exist_ok=True)
    manifest = {'version': version, 'source_revisions': sources, 'images': images, 'platforms': platforms}
    (destination / 'images.json').write_text(json.dumps(manifest, indent=2) + '\n')
    (destination / 'compose.images.json').write_text(json.dumps({'services': {name: {'image': image} for name, image in images.items()}}, indent=2) + '\n')
    print('Release manifest generated:', destination.relative_to(root))


if __name__ == '__main__':
    main()
