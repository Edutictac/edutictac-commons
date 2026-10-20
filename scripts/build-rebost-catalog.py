#!/usr/bin/env python3
"""Build the reviewed, local Blocs artwork collection; never download Scratch assets.

Build-only dependency: Python Playwright + Chromium. Runtime uses the resulting
PNG/thumbnail files, original SVGs and GPL license without a rendering dependency.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'services/id-api/assets/catalog'
SELECTED = [
    ('bloc','bloc.svg','sprite','Bloc','Bloc'),
    ('lua','lua.svg','sprite','Lua','Lua'),
    ('robot','robot.svg','sprite','Robot','Robot'),
    ('microbot','microbot.svg','sprite','Microbot','Microbot'),
    ('mascota','mascota-content.svg','sprite','Pip','Pip'),
    ('estrella','estrella.svg','sprite','Estrella','Estrella'),
    ('pilota','pilota.svg','sprite','Pilota','Pelota'),
    ('blank','fons-paper.svg','background','Fons clar','Fondo claro'),
    ('forest','fons-bosc.svg','background','Bosc','Bosque'),
    ('beach','fons-platja.svg','background','Platja','Playa'),
    ('sky','fons-cel.svg','background','Cel','Cielo'),
    ('classroom','fons-pissarra.svg','background','Aula','Aula'),
]
TAGS = {'svg','g','rect','circle','path','ellipse','text','defs','pattern','linearGradient','stop','polygon'}
ATTRS = {'width','height','viewBox','cx','cy','r','fill','stroke','stroke-width','d','x','y','rx',
         'text-anchor','font-family','font-size','font-weight','stroke-linejoin','stroke-linecap','ry',
         'opacity','transform','stroke-dasharray','fill-opacity','id','patternUnits','x1','y1','x2','y2',
         'offset','stop-color','points'}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',',':')).encode()


def safe_svg(raw):
    text=raw.decode('utf-8')
    if len(raw)>512*1024 or re.search(r'<!|<\?|\x00',text):
        raise ValueError('SVG declarations/size are not allowed')
    root=ET.fromstring(text)
    for node in root.iter():
        if node.tag not in {'{http://www.w3.org/2000/svg}'+tag for tag in TAGS}:
            raise ValueError('Unreviewed SVG element')
        for key,value in node.attrib.items():
            if key not in ATTRS or re.search(r'(?i)https?:|data:|javascript:|@import|expression\s*\(',value):
                raise ValueError('Unreviewed SVG attribute')
            for url in re.findall(r'url\(([^)]*)\)',value,flags=re.I):
                if not re.fullmatch(r'#[A-Za-z][A-Za-z0-9_-]*',url):
                    raise ValueError('Only local SVG paint references are allowed')
    def dimension(name):
        value=root.attrib.get(name,'')
        if not re.fullmatch(r'[0-9]+(?:\.[0-9]+)?',value):
            raise ValueError('Explicit pixel dimensions required')
        value=int(float(value))
        if not 0<value<=4096:raise ValueError('SVG dimensions exceed limits')
        return value
    return text,dimension('width'),dimension('height')


def inventory(blocs, revision):
    libs={name:json.loads((blocs/f'src/lib/libraries/{name}.json').read_text()) for name in ['sprites','costumes','backdrops','sounds']}
    images=set();audio=set()
    for item in libs['costumes']+libs['backdrops']:
        images.add(item['md5ext'])
    for sprite in libs['sprites']:
        images.update(item['md5ext'] for item in sprite.get('costumes',[]))
        audio.update(item['md5ext'] for item in sprite.get('sounds',[]))
    audio.update(item['md5ext'] for item in libs['sounds'])
    selected={entry[1] for entry in SELECTED}
    local=[]
    for file in sorted((blocs/'templates/assets').glob('*.svg')):
        raw=file.read_bytes()
        local.append({'path':str(file.relative_to(blocs)),'sha256':sha(raw),'bytes':len(raw),
                      'status':'selected' if file.name in selected else 'not_selected'})
    return {'format':'rebost-blocs-inventory','version':1,'source_revision':revision,
            'counts':{**{name:len(value) for name,value in libs.items()},'external_unique_images':len(images),
                      'external_unique_audio':len(audio),'local_svg':len(local),'selected':len(selected)},
            'external_policy':'not_bundled; existing Blocs proxy unchanged; media licensing needs a separate review',
            'external_images':sorted(images),'external_audio':sorted(audio),'local':local}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--blocs',type=Path,default=ROOT.parent/'edutictac-blocs')
    parser.add_argument('--check',action='store_true')
    args=parser.parse_args();blocs=args.blocs.resolve()
    revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=blocs,text=True).strip()
    if args.check:
        manifest=json.loads((OUT/'manifest.json').read_text())
        if manifest['source_revision']!=revision:raise ValueError('Blocs revision changed; review catalogue provenance')
        for item in manifest['items']:
            for role in ['image','thumbnail','source']:
                record=item[role]
                if sha((OUT/record['path']).read_bytes())!=record['sha256']:raise ValueError('Catalogue checksum mismatch')
            source=blocs/item['source_path']
            if sha(source.read_bytes())!=item['source']['sha256']:raise ValueError('Reviewed source changed')
        if sha((OUT/manifest['license_file']['path']).read_bytes())!=manifest['license_file']['sha256']:raise ValueError('License changed')
        if (OUT/manifest['license_file']['path']).read_bytes()!=subprocess.check_output(['git','show',revision+':LICENSE'],cwd=blocs):raise ValueError('Catalogue license differs from recorded source')
        if json.loads((ROOT/'docs/rebost-catalog-inventory.json').read_text())!=inventory(blocs,revision):raise ValueError('Inventory changed')
        print('Reviewed catalogue and inventory: up to date');return
    from playwright.sync_api import sync_playwright
    from PIL import Image
    import io
    for folder in ['images','thumbnails','sources','licenses']:(OUT/folder).mkdir(parents=True,exist_ok=True)
    license_raw=(blocs/'LICENSE').read_bytes()
    if b'GNU GENERAL PUBLIC LICENSE' not in license_raw or b'Version 3' not in license_raw:raise ValueError('Expected Blocs GPL v3 license')
    if subprocess.check_output(['git','show',revision+':LICENSE'],cwd=blocs)!=license_raw:raise ValueError('License differs from recorded source revision')
    (OUT/'licenses/GPL-3.0-only.txt').write_bytes(license_raw)
    items=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        context=browser.new_context(java_script_enabled=False,device_scale_factor=1)
        context.route('**/*',lambda route:route.abort())
        page=context.new_page()
        for alias,filename,kind,ca,es in SELECTED:
            source=blocs/'templates/assets'/filename;raw=source.read_bytes()
            recorded=subprocess.check_output(['git','show',revision+':'+str(source.relative_to(blocs))],cwd=blocs)
            if recorded!=raw:raise ValueError('Selected artwork differs from recorded source revision')
            svg,width,height=safe_svg(raw)
            page.set_viewport_size({'width':max(1,width),'height':max(1,height)})
            page.set_content('<html><body style="margin:0;background:transparent">'+svg+'</body></html>')
            png=page.locator('svg').screenshot(omit_background=True)
            # Re-encode the build output without renderer metadata.
            image=Image.open(io.BytesIO(png)).convert('RGBA');out=io.BytesIO();image.save(out,'PNG');png=out.getvalue()
            # Render a separate thumbnail from the vector: small sprites keep crisp previews.
            preview=ET.fromstring(svg)
            preview.set('viewBox',preview.attrib.get('viewBox',f'0 0 {width} {height}'))
            tw=max(1,round(width*256/max(width,height)));th=max(1,round(height*256/max(width,height)))
            preview.set('width',str(tw));preview.set('height',str(th))
            ET.register_namespace('', 'http://www.w3.org/2000/svg')
            page.set_viewport_size({'width':tw,'height':th})
            page.set_content('<html><body style="margin:0;background:transparent">'+ET.tostring(preview,encoding='unicode')+'</body></html>')
            rendered=page.locator('svg').screenshot(omit_background=True)
            image=Image.open(io.BytesIO(rendered)).convert('RGBA');out=io.BytesIO();image.save(out,'PNG');thumb=out.getvalue()
            key='edutictac-blocs:'+alias
            item={'id':'img-'+sha(key.encode()),'source_id':key,'aliases':[alias],
                  'name':ca,'names':{'ca':ca,'es':es},'type':kind,'width':width,'height':height,
                  'license':'GPL-3.0-only','attribution':'Contribuïdors d’EduTicTac Blocs',
                  'source_revision':revision,'source_path':str(source.relative_to(blocs)),
                  'source_repository':'https://git.edutictac.es/Edutictac/edutictac-blocs',
                  'changes':'PNG rasterization and thumbnail; original SVG provided unchanged.'}
            for role,data,path in [('image',png,f'images/{alias}.png'),('thumbnail',thumb,f'thumbnails/{alias}.png'),('source',raw,f'sources/{filename}')]:
                (OUT/path).write_bytes(data);item[role]={'path':path,'sha256':sha(data)}
            item['revision']=int(sha(canonical(item))[:12],16)
            items.append(item)
        browser.close()
    manifest={'format':'rebost-catalog','version':1,'source_revision':revision,
              'license_file':{'path':'licenses/GPL-3.0-only.txt','sha256':sha(license_raw)},'items':items}
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'docs/rebost-catalog-inventory.json').write_text(json.dumps(inventory(blocs,revision),ensure_ascii=False,indent=2)+'\n')
    print(f'Built {len(items)} reviewed local images; no external downloads')


if __name__=='__main__':main()
