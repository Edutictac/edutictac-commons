"""Versioned, read-only artwork bundled once with the API, never a human owner.

Original Commons code (MIT). Artwork retains its separately recorded license.
"""
import copy
import hashlib
import json
import math
from pathlib import Path
import re


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',',':')).encode()


class Catalogue:
    def __init__(self, folder, normalizer, collection="catalog"):
        if collection not in {"catalog","scratch"}:raise ValueError("Unreviewed collection")
        expected_license = "GPL-3.0-only" if collection=="catalog" else "CC-BY-SA-2.0"
        folder=Path(folder).resolve()
        self.items={}
        self.families={}
        self.total_bytes=0
        manifest_raw=(folder/'manifest.json').read_bytes()
        if len(manifest_raw)>1024*1024:raise ValueError('Catalogue manifest too large')
        manifest=json.loads(manifest_raw)
        if manifest.get('format')!='rebost-catalog' or manifest.get('version')!=1 or not isinstance(manifest.get('items'),list) or len(manifest['items'])>500:
            raise ValueError('Invalid catalogue manifest')
        def read(record, prefix, suffix, maximum):
            relative=record['path']
            parts=Path(relative).parts
            if not isinstance(relative,str) or len(parts)!=2 or parts[0]!=prefix or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]*'+re.escape(suffix),parts[1]):
                raise ValueError('Invalid catalogue path')
            target=folder/relative
            if any((folder/Path(*parts[:i])).is_symlink() for i in range(1,len(parts)+1)) or not target.resolve().is_relative_to(folder) or not target.is_file():
                raise ValueError('Invalid catalogue file')
            if target.stat().st_size>maximum:raise ValueError('Catalogue file too large')
            raw=target.read_bytes()
            if hashlib.sha256(raw).hexdigest()!=record['sha256']:raise ValueError('Catalogue checksum mismatch')
            return raw
        license_raw=read(manifest['license_file'],'licenses','.txt',65536)
        license_text=license_raw.decode('utf-8')
        if collection=='catalog' and ('GNU GENERAL PUBLIC LICENSE' not in license_text or 'Version 3' not in license_text):raise ValueError('Invalid catalogue license')
        if collection=='scratch' and ('Attribution-ShareAlike 2.0' not in license_text or 'License Grant' not in license_text or 'Restrictions' not in license_text):raise ValueError('Invalid Scratch license')
        self.total_bytes=len(manifest_raw)+len(license_raw)
        reviewed={}
        if collection=='scratch':
            review_raw=read(manifest['review_file'],'reviews','.json',1024*1024)
            review=json.loads(review_raw)
            reviewed={item['id']:item for item in review['items']}
            if len(reviewed)!=len(manifest['items']):raise ValueError('Scratch review incomplete')
            self.total_bytes+=len(review_raw)
        source_ids=set();aliases=set()
        for record in manifest['items']:
            item=copy.deepcopy(record)
            source_id=item['source_id']
            expected='img-'+hashlib.sha256(source_id.encode()).hexdigest()
            namespace=r'edutictac-blocs:[a-z0-9-]{1,100}' if collection=='catalog' else r'scratch:[0-9a-f]{32}\.svg'
            if not re.fullmatch(namespace,source_id) or item['id']!=expected or expected in self.items or source_id in source_ids:
                raise ValueError('Invalid/duplicate catalogue identity')
            if item['type'] not in {'sprite','background','object','illustration'} or item['license']!=expected_license:
                raise ValueError('Unreviewed catalogue type/license')
            for name in [item['name'],item['names']['ca'],item['names']['es'],item['attribution']]:
                if not isinstance(name,str) or not 0<len(name)<=300 or any(ord(c)<32 for c in name):raise ValueError('Invalid catalogue name')
            if not isinstance(item['aliases'],list) or not item['aliases'] or len(set(item['aliases']))!=len(item['aliases']) or any(not isinstance(alias,str) or not re.fullmatch(r'[a-z][a-z0-9-]{0,63}',alias) or alias in aliases for alias in item['aliases']):
                raise ValueError('Invalid/duplicate catalogue alias')
            revision=item.pop('revision')
            if revision!=int(hashlib.sha256(canonical(item)).hexdigest()[:12],16):raise ValueError('Catalogue revision mismatch')
            item['revision']=revision
            data=read(item['image'],'images','.png',5*1024*1024)
            thumb=read(item['thumbnail'],'thumbnails','.png',5*1024*1024)
            source=read(item['source'],'sources','.svg',512*1024)
            if collection=='scratch':
                approved=reviewed.get(item['id'],{})
                if approved.get('md5ext')!=hashlib.md5(source).hexdigest()+'.svg' or approved.get('sha256')!=hashlib.sha256(source).hexdigest() or source_id!='scratch:'+approved['md5ext']:
                    raise ValueError('Scratch source is not reviewed')
            clean,_,width,height=normalizer(data,'image/png')
            _,_,tw,th=normalizer(thumb,'image/png')
            if (width,height)!=(item['width'],item['height']) or max(tw,th)>256:raise ValueError('Catalogue dimensions mismatch')
            public={key:item[key] for key in ['id','source_id','aliases','name','names','type','width','height',
                    'license','attribution','source_revision','source_path','source_repository','changes','revision']}
            public.update({'collection':collection,'readonly':True,'bytes':len(clean)})
            if collection=='scratch':
                pivot=approved.get('rotation_center')
                if not isinstance(pivot,dict) or set(pivot)!={'x','y'} or any(type(value) not in {int,float} or not math.isfinite(value) or abs(value)>8192 for value in pivot.values()):
                    raise ValueError('Invalid reviewed rotation centre')
                public['rotation_center']=copy.deepcopy(pivot)
            metadata=canonical(public).decode()
            self.items[item['id']]={'metadata':public,'data':clean,'thumbnail':thumb,
                                   'provenance':(metadata,source,license_text)}
            self.total_bytes+=len(data)+len(thumb)+len(source)
            source_ids.add(source_id);aliases.update(item['aliases'])
        if collection=='scratch':
            groups={}
            for asset_id,item in self.items.items():
                name=reviewed[asset_id].get('original_name')
                if not isinstance(name,str) or not 0<len(name)<=100:
                    raise ValueError('Invalid Scratch family')
                fragment=item['metadata']['source_path'].split('#',1)[-1]
                costume=reviewed[asset_id].get('costume')
                if fragment!=name.strip()+('/'+costume if costume else ''):
                    raise ValueError('Scratch family does not match reviewed source')
                groups.setdefault(name,[]).append(asset_id)
            for name,members in groups.items():
                primary=[key for key in members if not reviewed[key].get('costume')]
                if len(primary)!=1 or len(members)>32:
                    raise ValueError('Invalid Scratch family primary/size')
                primary=primary[0]
                members=[primary]+sorted((key for key in members if key!=primary),key=lambda key:reviewed[key]['costume'])
                meta=self.items[primary]['metadata']
                if any(self.items[key]['metadata']['type']!=meta['type'] for key in members):
                    raise ValueError('Mixed Scratch family roles')
                revision=int(hashlib.sha256(canonical([(key,self.items[key]['metadata']['revision'],self.items[key]['metadata']['rotation_center']) for key in members])).hexdigest()[:12],16)
                family={'id':primary,'revision':revision,'count':len(members),'names':copy.deepcopy(meta['names'])}
                self.families[primary]={'family':family,'members':members}
                for position,key in enumerate(members):
                    self.items[key]['metadata']['family']={**copy.deepcopy(family),'position':position}

    def extend(self, other):
        aliases={alias for item in self.items.values() for alias in item['metadata']['aliases']}
        if self.items.keys() & other.items.keys() or any(aliases.intersection(item['metadata']['aliases']) for item in other.items.values()):
            raise ValueError('Duplicate catalogue identity or alias')
        self.items.update(other.items)
        self.families.update(other.families)
        self.total_bytes+=other.total_bytes

    def family(self, primary_id):
        group=self.families.get(primary_id)
        if not group:return None
        return {'format':'rebost-asset-family','version':1,**copy.deepcopy(group['family']),
                'items':[copy.deepcopy(self.items[key]['metadata']) for key in group['members']]}

    def list_families(self,q,kind,cursor,limit):
        matches=[]
        for primary,group in sorted(self.families.items()):
            meta=self.items[primary]['metadata']
            names=' '.join(' '.join([self.items[key]['metadata']['name'],
                                    *self.items[key]['metadata']['names'].values(),
                                    *self.items[key]['metadata']['aliases']]) for key in group['members'])
            if primary>cursor and (not kind or meta['type']==kind) and q.casefold() in names.casefold():
                matches.append(copy.deepcopy(meta))
        return {'items':matches[:limit],'next_cursor':matches[limit-1]['id'] if len(matches)>limit else None}

    def get(self, asset_id):
        return self.items.get(asset_id)

    def list(self, q, kind, cursor, limit, collection="catalog"):
        needle=q.casefold()
        matches=[]
        for asset_id,item in sorted(self.items.items()):
            meta=item['metadata']
            names=' '.join([meta['name'],*meta['names'].values(),*meta['aliases']]).casefold()
            if meta['collection']==collection and asset_id>cursor and (not kind or meta['type']==kind) and needle in names:
                matches.append(copy.deepcopy(meta))
        return {'items':matches[:limit],'next_cursor':matches[limit-1]['id'] if len(matches)>limit else None}
