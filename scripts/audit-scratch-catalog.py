#!/usr/bin/env python3
"""Triage Scratch images in batches. A historical match is NOT import approval.

Reads local library metadata and pinned historical JSON; never downloads images,
changes the running catalogue, infers a license, or modifies user projects.
"""
import argparse
from collections import Counter, defaultdict
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('scratch_builder', ROOT / 'scripts/build-scratch-catalog.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
HASHES = {name: builder.INPUT_HASHES[name] for name in ('sprites.json', 'backdrops.json')}
HASHES['costumes.json'] = '2d01310238824446123317ef884c32f819db7d08756247dc4b9d460ef101fdfd'
POSSIBLE_MARK = re.compile(r'\b(scratch|cat|gobo|pico|nano|giga|tera|terra|milli|zepto|lego|minecraft|makey)\b', re.I)


def references(libraries):
    result = defaultdict(list)
    for library in ('sprites', 'costumes', 'backdrops'):
        for item in libraries[library]:
            images = item.get('costumes', []) if library == 'sprites' else [item]
            for image in images:
                result[image['md5ext']].append({
                    'library': library, 'name': item['name'],
                    'costume': image.get('name', item['name']), 'tags': item.get('tags', [])})
    return result


def audit(current, historical, included):
    refs = references(current)
    old = references(historical)
    known_families = {entry['name'] for key in included for entry in refs.get(key, []) if entry['library'] == 'sprites'}
    records = []
    for key, entries in sorted(refs.items()):
        parents = sorted({entry['name'] for entry in entries if entry['library'] == 'sprites'})
        marks = sorted({entry['name'] for entry in entries + old.get(key, []) if POSSIBLE_MARK.search(entry['name'])})
        if key in included:
            state = 'already_in_rebost'
        elif marks:
            state = 'possible_mark_needs_review'
        elif key not in old:
            state = 'historical_evidence_missing'
        elif key.endswith('.svg'):
            state = 'historical_svg_needs_review'
        else:
            state = 'historical_bitmap_needs_review'
        backgrounds = sorted({entry['name'] for entry in entries if entry['library'] == 'backdrops'})
        family = 'sprite:' + parents[0] if parents else 'background:' + backgrounds[0] if backgrounds else 'costume:' + entries[0]['name']
        records.append({
            'md5ext': key, 'state': state,
            # This tool never authorizes a new image based on a metadata match.
            'approved_by_this_audit': False,
            'format': key.rsplit('.', 1)[-1], 'family': family,
            'family_already_in_rebost': bool(known_families.intersection(parents)),
            'possible_mark_names': marks, 'references': entries,
            'historical_references': old.get(key, [])})
    pending = [item for item in records if item['state'] != 'already_in_rebost']
    return {
        'format': 'rebost-scratch-triage', 'version': 1,
        'meaning': 'Metadata and historical hash-reference comparison only; no new license, visual, byte or security approval.',
        'historical_revision': builder.GUI,
        'counts': {'unique_images': len(records), 'already_in_rebost': len(records) - len(pending),
                   'pending': len(pending), 'review_families': len({item['family'] for item in pending}),
                   'pending_in_known_families': sum(item['family_already_in_rebost'] for item in pending),
                   'pending_by_state': dict(sorted(Counter(item['state'] for item in pending).items()))},
        'items': records}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--blocs', type=Path, default=ROOT.parent / 'edutictac-blocs')
    parser.add_argument('--cache', type=Path, default=Path('/tmp/rebost-scratch-review'))
    parser.add_argument('--download-metadata', action='store_true')
    parser.add_argument('--output', type=Path, default=ROOT / 'docs/rebost-scratch-audit.json')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    current = {}; historical = {}; sources = {}
    args.cache.mkdir(parents=True, exist_ok=True)
    for library in ('sprites', 'costumes', 'backdrops'):
        name = library + '.json'
        raw = (args.blocs / 'src/lib/libraries' / name).read_bytes()
        current[library] = json.loads(raw)
        sources[library] = {'current_sha256': hashlib.sha256(raw).hexdigest(),
                            'historical_sha256': HASHES[name]}
        url = f'https://raw.githubusercontent.com/scratchfoundation/scratch-gui/{builder.GUI}/src/lib/libraries/{name}'
        path = args.cache / name
        if not path.exists():
            if not args.download_metadata:
                raise ValueError('Missing pinned metadata; use --download-metadata')
            with urllib.request.urlopen(url, timeout=25) as response:
                data = response.read(4 * 1024 * 1024 + 1)
            if len(data) > 4 * 1024 * 1024:
                raise ValueError('Metadata too large')
            path.write_bytes(data)
        data = path.read_bytes()
        if hashlib.sha256(data).hexdigest() != HASHES[name]:
            raise ValueError('Historical metadata checksum mismatch')
        historical[library] = json.loads(data)
        sources[library]['historical_url'] = url
    manifest_path = ROOT / 'services/id-api/assets/catalog-scratch/manifest.json'
    manifest_raw = manifest_path.read_bytes()
    included = {item['source_id'].removeprefix('scratch:') for item in json.loads(manifest_raw)['items']}
    result = audit(current, historical, included)
    result['sources'] = sources
    result['included_manifest_sha256'] = hashlib.sha256(manifest_raw).hexdigest()
    if args.check:
        if json.loads(args.output.read_text()) != result:
            raise ValueError('Audit report is stale')
    else:
        args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result['counts'], ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
