#!/usr/bin/env python3
"""Build an explicitly reviewed subset of the historical Scratch image library.

Network is build-only and opt-in (--download). Runtime serves only local PNGs.
Original SVGs remain unchanged, downloadable attachments with CC BY-SA 2.0.
"""
import argparse
import hashlib
from html.parser import HTMLParser
import io
import json
import math
from pathlib import Path
import re
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'services/id-api/assets/catalog-scratch'
GUI = 'fa7ed724dd3070486ccf12424bd633f95572bdfd'
TERMS = '9c8ef43dc4dc9276cd22d42c36bbf14d5d0db4d0'
CC = '4d2de083a6dcc5095ed1a30885bc48f868b9bb55'
TERMS_URL = f'https://raw.githubusercontent.com/scratchfoundation/scratch-www/{TERMS}/src/views/terms/terms.jsx'
LICENSE_URL = f'https://raw.githubusercontent.com/creativecommons/legalcode/{CC}/by-sa_2.0.html'
INPUT_HASHES = {'terms.jsx': '8935e0d192188d6a8ac28010777901576092c45d87e72131e219253348ba4ca6', 'license.html': 'ba259d54fe3d8657ee0ed5d5eeead1807a6dc7866eee2a86a58b304a39286189', 'sprites.json': 'd04c42f6d9176da3cac58d2bde6c83b12490317ac544e890588c59875db95b3a', 'backdrops.json': 'ab5ad4666e1d8fbf1e3ad407a335366154a7872ada2a60ad9923d1a42594c4fa'}
ATTRIBUTION = 'Scratch is developed by the Lifelong Kindergarten Group at the MIT Media Lab. See http://scratch.mit.edu.'
# No mascots, logos, branded partners, photographs, sounds or new uploads.
# Circles and Underwater 1 are excluded: their source exceeds Blocs' 256 KiB limit.
SELECTION = [
    ('Apple', 'object', 'Poma', 'Manzana'),
    ('Ball', 'object', 'Pilota', 'Pelota'),
    ('Bananas', 'object', 'Plàtans', 'Plátanos'),
    ('Bat', 'sprite', 'Ratpenat', 'Murciélago'),
    ('Bear', 'sprite', 'Os', 'Oso'),
    ('Butterfly 1', 'sprite', 'Papallona 1', 'Mariposa 1'),
    ('Butterfly 2', 'sprite', 'Papallona 2', 'Mariposa 2'),
    ('Crab', 'sprite', 'Cranc', 'Cangrejo'),
    ('Dinosaur1', 'sprite', 'Dinosaure', 'Dinosaurio'),
    ('Dog1', 'sprite', 'Gos', 'Perro'),
    ('Duck', 'sprite', 'Ànec', 'Pato'),
    ('Fish', 'sprite', 'Peix', 'Pez'),
    ('Frog', 'sprite', 'Granota', 'Rana'),
    ('Ladybug1', 'sprite', 'Marieta 1', 'Mariquita 1'),
    ('Ladybug2', 'sprite', 'Marieta 2', 'Mariquita 2'),
    ('Octopus', 'sprite', 'Polp', 'Pulpo'),
    ('Parrot', 'sprite', 'Lloro', 'Loro'),
    ('Pencil', 'object', 'Llapis', 'Lápiz'),
    ('Rabbit', 'sprite', 'Conill', 'Conejo'),
    ('Star', 'object', 'Estrela', 'Estrella'),
    ('Tree1', 'object', 'Arbre', 'Árbol'),
    ('Blue Sky', 'background', 'Cel blau', 'Cielo azul'),
    ('Blue Sky 2 ', 'background', 'Cel blau 2', 'Cielo azul 2'),
    ('Hearts', 'background', 'Cors', 'Corazones'),
    ('Jurassic', 'background', 'Juràssic', 'Jurásico'),
    ('Light', 'background', 'Llum', 'Luz'),
    ('Party', 'background', 'Festa', 'Fiesta'),
    ('Rays', 'background', 'Raigs', 'Rayos'),
    ('Stripes', 'background', 'Ratlles', 'Rayas'),
    ('Winter', 'background', 'Hivern', 'Invierno'),
    ('Woods', 'background', 'Bosc', 'Bosque'),
]
BATCH_PATH = ROOT / 'scripts/scratch-costume-batch.json'


def costume_batch():
    batch = json.loads(BATCH_PATH.read_text())
    if batch.get('format') != 'rebost-scratch-costume-review' or batch.get('version') != 1 or batch.get('historical_revision') != GUI or batch.get('decision') != 'approved_for_catalogue':
        raise ValueError('Costume batch is not reviewed')
    ids = [row['md5ext'] for row in batch['items']]
    if len(ids) != 30 or len(ids) != len(set(ids)):
        raise ValueError('Unexpected costume batch')
    return batch['items']


TAGS = {'svg', 'circle', 'clipPath', 'defs', 'desc', 'ellipse', 'g', 'linearGradient',
        'path', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'title', 'use'}
ATTRS = {'clip-path', 'clip-rule', 'cx', 'cy', 'd', 'enable-background', 'fill', 'fill-rule',
         'gradientUnits', 'height', 'id', 'offset', 'overflow', 'points', 'r', 'rx', 'ry',
         'stop-color', 'stop-opacity', 'stroke', 'stroke-linecap', 'stroke-linejoin',
         'stroke-width', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset',
         'font-size', 'font-weight', 'font-family', 'text-anchor', 'opacity', 'style', 'transform', 'version', 'viewBox', 'width',
         'x', 'x1', 'x2', 'y', 'y1', 'y2', '{http://www.w3.org/1999/xlink}href',
         '{http://www.w3.org/XML/1998/namespace}space'}
STYLES = {'fill', 'fill-rule', 'clip-rule', 'stroke', 'stroke-width', 'stroke-linecap',
          'stroke-linejoin', 'stroke-miterlimit', 'opacity', 'fill-opacity',
          'stroke-opacity', 'mix-blend-mode', 'enable-background', 'overflow', 'stop-color', 'stop-opacity'}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()


def reviewed_svg(raw):
    # Remove only this exact legacy declaration; never resolve its external DTD.
    render_raw=raw.replace(b'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', b'')
    if len(raw) > 256 * 1024 or re.search(br'<!DOCTYPE|<!ENTITY', render_raw, re.I):
        raise ValueError('SVG declaration/size rejected')
    root = ET.fromstring(render_raw)
    if root.tag != '{http://www.w3.org/2000/svg}svg':
        raise ValueError('SVG root required')
    ids={node.get("id") for node in root.iter() if node.get("id")}
    for node in root.iter():
        if node.tag not in {'{http://www.w3.org/2000/svg}' + tag for tag in TAGS}:
            raise ValueError('Unreviewed SVG element')
        for key, value in list(node.attrib.items()):
            if key == 'data-paper-data':
                # Legacy editor metadata is not part of the drawing or renderer input.
                json.loads(value)
                del node.attrib[key]
                continue
            if key not in ATTRS or re.search(r'(?i)https?:|data:|javascript:|@|expression|[\\\x00-\x08\x0b\x0c\x0e-\x1f]', value):
                raise ValueError('Unreviewed SVG attribute')
            if key.endswith('}href') and (not value.startswith('#') or value[1:] not in ids):
                raise ValueError('External SVG reference')
            for url in re.findall(r'url\(([^)]*)\)', value, re.I):
                if not url.startswith('#') or url[1:] not in ids:
                    raise ValueError('External paint reference')
            if key == 'style':
                for declaration in value.split(';'):
                    if declaration.strip() and declaration.split(':', 1)[0].strip() not in STYLES:
                        raise ValueError('Unreviewed CSS property')
    dimensions = []
    for key in ('width', 'height'):
        value = root.get(key, '')
        if not re.fullmatch(r'[0-9]+(?:\.[0-9]+)?(?:px)?', value):
            raise ValueError('Explicit SVG dimensions required')
        size = math.ceil(float(value.removesuffix('px')))
        if not 0 < size <= 4096:
            raise ValueError('SVG dimensions exceeded')
        dimensions.append(size)
        root.set(key, str(size))
    # Only the validated XML tree is rendered; original bytes are attachments.
    ET.register_namespace('', 'http://www.w3.org/2000/svg')
    ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')
    return root, *dimensions


class LicenseText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in {'head', 'script', 'style'}:
            self.skip += 1
        if tag in {'p', 'li', 'div', 'h1', 'h2', 'h3', 'br'} and not self.skip:
            self.parts.append('\n')

    def handle_endtag(self, tag):
        if tag in {'head', 'script', 'style'}:
            self.skip -= 1

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache', type=Path, default=Path('/tmp/rebost-scratch-review'))
    parser.add_argument('--download', action='store_true')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    if args.check:
        manifest = json.loads((OUT / 'manifest.json').read_text())
        if len(manifest['items']) != len(SELECTION) + len(costume_batch()) or manifest['source_revision'] != GUI:
            raise ValueError('Unreviewed selection/revision')
        review=json.loads((OUT / manifest['review_file']['path']).read_text())
        if review.get('costume_batch_sha256') != sha(BATCH_PATH.read_bytes()):
            raise ValueError('Reviewed costume selection changed; rebuild required')
        for item in manifest['items']:
            for key in ('image', 'thumbnail', 'source'):
                record = item[key]
                if sha((OUT / record['path']).read_bytes()) != record['sha256']:
                    raise ValueError('Package checksum mismatch')
            raw = (OUT / item['source']['path']).read_bytes()
            if hashlib.md5(raw).hexdigest() + '.svg' != item['source_id'].removeprefix('scratch:'):
                raise ValueError('Original Scratch identity mismatch')
            reviewed_svg(raw)
        for key in ('license_file', 'review_file'):
            if sha((OUT / manifest[key]['path']).read_bytes()) != manifest[key]['sha256']:
                raise ValueError('Review/license checksum mismatch')
        print('Scratch catalogue: checksums, original identities and safe vectors verified')
        return
    args.cache.mkdir(parents=True, exist_ok=True)

    def cached(name, url):
        target = args.cache / name
        if not target.exists():
            if not args.download:
                raise ValueError('Cache incomplete; opt in with --download')
            with urllib.request.urlopen(url, timeout=30) as response:
                data = response.read(2 * 1024 * 1024 + 1)
            if len(data) > 2 * 1024 * 1024:
                raise ValueError('Build input too large')
            target.write_bytes(data)
        data=target.read_bytes()
        if name in INPUT_HASHES and sha(data)!=INPUT_HASHES[name]:
            raise ValueError('Pinned historical input changed')
        return data

    terms = cached('terms.jsx', TERMS_URL)
    if b'Creative Commons Attribution-ShareAlike 2.0' not in terms or b'5.2' not in terms:
        raise ValueError('Historical media license not verified')
    license_raw = cached('license.html', LICENSE_URL)
    text = LicenseText(); text.feed(license_raw.decode())
    license_text = ('CC BY-SA 2.0 — Attribution-ShareAlike 2.0\n'
                    'https://creativecommons.org/licenses/by-sa/2.0/\n\n' + ''.join(text.parts)).encode()
    libraries = {}
    evidence = {'terms_url': TERMS_URL, 'terms_sha256': sha(terms),
                'license_source_url': LICENSE_URL, 'license_source_sha256': sha(license_raw),
                'scope': 'Explicit unbranded historical selection and reviewed additional costumes. No general clearance of the Scratch library.',
                'costume_batch_sha256': sha(BATCH_PATH.read_bytes()),
                'items': []}
    for kind in ('sprites', 'backdrops'):
        url = f'https://raw.githubusercontent.com/scratchfoundation/scratch-gui/{GUI}/src/lib/libraries/{kind}.json'
        raw = cached(kind + '.json', url)
        libraries[kind] = {item['name']: item for item in json.loads(raw)}
        evidence[kind] = {'url': url, 'sha256': sha(raw)}
    from playwright.sync_api import sync_playwright
    from PIL import Image
    for name in ('images', 'thumbnails', 'sources', 'licenses', 'reviews'):
        (OUT / name).mkdir(parents=True, exist_ok=True)
    (OUT / 'licenses/CC-BY-SA-2.0.txt').write_bytes(license_text)
    items = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        context = browser.new_context(java_script_enabled=False, device_scale_factor=1)
        context.route('**/*', lambda route: route.abort())
        page = context.new_page()
        selection = [(name, kind, ca, es, None) for name, kind, ca, es in SELECTION]
        selection += [(row['family'], row['type'], row['names']['ca'], row['names']['es'], row) for row in costume_batch()]
        for name, kind, ca, es, variant in selection:
            library = 'backdrops' if kind == 'background' else 'sprites'
            original = libraries[library][name]
            if variant:
                costume = next((entry for entry in original['costumes'] if entry['name'] == variant['costume'] and entry['md5ext'] == variant['md5ext']), None)
                if costume is None:
                    raise ValueError('Reviewed costume missing from historical family')
            else:
                costume = original if kind == 'background' else original['costumes'][0]
            md5ext = costume['md5ext']
            raw = cached(md5ext, 'https://assets.scratch.mit.edu/internalapi/asset/' + md5ext + '/get/')
            if hashlib.md5(raw).hexdigest() + '.svg' != md5ext:
                raise ValueError('Downloaded asset does not match historical identity')
            if variant and sha(raw) != variant['sha256']:
                raise ValueError('Reviewed costume checksum changed')
            svg, width, height = reviewed_svg(raw)
            box=[float(value) for value in svg.get('viewBox',f'0 0 {width} {height}').replace(',', ' ').split()]
            if len(box)!=4 or not all(math.isfinite(value) for value in box) or box[2]<=0 or box[3]<=0:
                raise ValueError('Invalid original viewBox')
            # SVG defaults to xMidYMid meet: preserve aspect ratio and account for letterboxing.
            factor=min(width/box[2],height/box[3])
            pivot={'x':(costume['rotationCenterX']-box[0])*factor+(width-box[2]*factor)/2,
                   'y':(costume['rotationCenterY']-box[1])*factor+(height-box[3]*factor)/2}
            if not all(math.isfinite(value) and abs(value)<=8192 for value in pivot.values()):
                raise ValueError('Invalid original rotation centre')
            alias_name = variant['costume'] if variant else name
            alias = 'scratch-' + re.sub(r'[^a-z0-9]+', '-', alias_name.lower()).strip('-')
            source_fragment = name.strip() + ('/' + variant['costume'] if variant else '')
            item = {'id': 'img-' + sha(('scratch:' + md5ext).encode()),
                    'source_id': 'scratch:' + md5ext, 'aliases': [alias], 'name': ca,
                    'names': {'ca': ca, 'es': es}, 'type': kind, 'width': width, 'height': height,
                    'license': 'CC-BY-SA-2.0', 'attribution': ATTRIBUTION,
                    'source_revision': GUI, 'source_repository': 'https://github.com/scratchfoundation/scratch-gui',
                    'source_path': f'src/lib/libraries/{library}.json#{source_fragment}',
                    'changes': 'PNG rasterization and thumbnail; original SVG provided unchanged.'}
            def render(w, h):
                svg.set('viewBox', svg.get('viewBox', f'0 0 {width} {height}'))
                svg.set('width', str(w)); svg.set('height', str(h))
                page.set_viewport_size({'width': w, 'height': h})
                page.set_content('<html><body style="margin:0;background:transparent">' + ET.tostring(svg, encoding='unicode') + '</body></html>')
                output = io.BytesIO()
                image=Image.open(io.BytesIO(page.locator('svg').screenshot(omit_background=True))).convert('RGBA')
                if image.getchannel('A').getbbox() is None:
                    raise ValueError('Rendered artwork is empty')
                image.save(output, 'PNG')
                return output.getvalue()
            png = render(width, height)
            scale = 256 / max(width, height)
            thumb = render(max(1, round(width * scale)), max(1, round(height * scale)))
            for role, data, path in [('image', png, f'images/{alias}.png'),
                                     ('thumbnail', thumb, f'thumbnails/{alias}.png'),
                                     ('source', raw, f'sources/{md5ext}')]:
                (OUT / path).write_bytes(data)
                item[role] = {'path': path, 'sha256': sha(data)}
            item['revision'] = int(sha(canonical(item))[:12], 16)
            items.append(item)
            reviewed = {'id': item['id'], 'original_name': name, 'md5ext': md5ext, 'sha256': sha(raw), 'rotation_center': pivot}
            if variant:
                reviewed.update({'costume': variant['costume'], 'review_batch': '2026-10-21-additional-costumes'})
            evidence['items'].append(reviewed)
        browser.close()
    review = json.dumps(evidence, ensure_ascii=False, indent=2).encode() + b'\n'
    (OUT / 'reviews/review.json').write_bytes(review)
    manifest = {'format': 'rebost-catalog', 'version': 1, 'source_revision': GUI,
                'license_file': {'path': 'licenses/CC-BY-SA-2.0.txt', 'sha256': sha(license_text)},
                'review_file': {'path': 'reviews/review.json', 'sha256': sha(review)}, 'items': items}
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'Built {len(items)} reviewed Scratch images; runtime needs no external connection')


if __name__ == '__main__':
    main()
