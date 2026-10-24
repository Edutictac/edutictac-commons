"""Private classroom downloads, stored in the existing Commons data volume."""
from __future__ import annotations

from contextlib import contextmanager, asynccontextmanager
import asyncio
import time
import fcntl
import hashlib
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import uuid
from urllib.parse import unquote, quote

from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from edutictac_community.ratelimit import RateLimiter

from .db import iso_now

MB = 1024**2
DEFAULTS = dict(max_file_bytes=50*MB, group_quota_bytes=500*MB,
                student_quota_bytes=50*MB, students_can_upload=True)
EXTENSIONS = set('pdf doc docx xls xlsx ppt pptx odt ods odp odg txt md csv png jpg jpeg webp gif mp3 ogg wav m4a mp4 webm epub zip'.split())
TEXT = {'txt', 'md', 'csv'}


def fail(status, code):
    raise HTTPException(status, code)


def relative_path(raw):
    try:
        value = unquote(raw, errors='strict')
    except (UnicodeError, ValueError):
        fail(422, 'invalid_path')
    if not value or len(value.encode('utf-8')) > 1000 or '\\' in value or ':' in value or any(ord(c)<32 or ord(c)==127 for c in value):
        fail(422, 'invalid_path')
    parts = value.split('/')
    if len(parts)>16 or any(not p or p in {'.', '..'} or p.startswith('.') or len(p.encode('utf-8'))>200 for p in parts):
        fail(422, 'invalid_path')
    if value.startswith('/') or PurePosixPath(value).suffix.lower().lstrip('.') not in EXTENSIONS:
        fail(415, 'file_type_not_allowed')
    return value


def validate_content(path, extension):
    with path.open('rb') as stream:
        head = stream.read(1024)
    trimmed = head.lstrip(b'\xef\xbb\xbf \t\r\n').lower()
    if not head or head.startswith((b'MZ', b'\x7fELF', b'#!')) or trimmed.startswith((b'<html', b'<!doctype html', b'<svg', b'<script', b'<?php')):
        fail(415, 'file_content_not_allowed')
    signatures = {
        'pdf': (b'%PDF-',), 'png': (b'\x89PNG\r\n\x1a\n',), 'jpg': (b'\xff\xd8\xff',), 'jpeg': (b'\xff\xd8\xff',),
        'gif': (b'GIF87a', b'GIF89a'), 'zip': (b'PK\x03\x04', b'PK\x05\x06'),
        'docx': (b'PK\x03\x04',), 'xlsx': (b'PK\x03\x04',), 'pptx': (b'PK\x03\x04',),
        'odt': (b'PK\x03\x04',), 'ods': (b'PK\x03\x04',), 'odp': (b'PK\x03\x04',), 'odg': (b'PK\x03\x04',), 'epub': (b'PK\x03\x04',),
        'doc': (b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1',), 'xls': (b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1',), 'ppt': (b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1',),
        'ogg': (b'OggS',), 'webm': (b'\x1aE\xdf\xa3',),
    }
    if extension in signatures and not head.startswith(signatures[extension]):
        fail(415, 'file_content_not_allowed')
    if extension in {'webp', 'wav'} and not (head.startswith(b'RIFF') and head[8:12] == (b'WEBP' if extension=='webp' else b'WAVE')):
        fail(415, 'file_content_not_allowed')
    if extension in {'mp4', 'm4a'} and head[4:8] != b'ftyp':
        fail(415, 'file_content_not_allowed')
    if extension == 'mp3' and not (head.startswith(b'ID3') or len(head)>1 and head[0]==255 and head[1]&224==224):
        fail(415, 'file_content_not_allowed')
    if extension in TEXT:
        try:
            with path.open('r', encoding='utf-8-sig') as stream:
                while chunk := stream.read(65536):
                    if '\x00' in chunk: fail(415, 'file_content_not_allowed')
        except UnicodeError:
            fail(415, 'file_content_not_allowed')


class ClassroomFiles:
    def __init__(self, commons):
        self.c = commons
        self.root = Path(commons.settings.files_dir or str(Path(commons.settings.db_path).parent / 'id-api' / 'files'))
        defaults = {**DEFAULTS, **commons.settings.file_defaults}
        if (not 0 < defaults['max_file_bytes'] <= 100*MB
                or not 0 < defaults['student_quota_bytes'] <= defaults['group_quota_bytes'] <= 100000*MB
                or defaults['max_file_bytes'] > defaults['group_quota_bytes']
                or commons.settings.files_disk_reserve_bytes < 0):
            raise ValueError('Invalid classroom file limits')
        self.reserve = commons.settings.files_disk_reserve_bytes
        self.rate = RateLimiter(max_calls=1200, window_seconds=60)

    def cleanup(self):
        # Run at startup under the same inter-process lock as uploads. Referenced
        # blobs survive; interrupted uploads and uncommitted blobs can be removed.
        if not self.root.exists():return
        try:
            with self.lock(), self.c.connect() as conn:
                retained = {row[0] for row in conn.execute('SELECT storage_name FROM classroom_files')}
                for directory in self.root.iterdir():
                    if not re.fullmatch('[a-f0-9]{64}', directory.name) or directory.is_symlink() or not directory.is_dir():continue
                    for path in directory.iterdir():
                        if path.is_symlink() or not path.is_file():continue
                        if str(path.relative_to(self.root)) not in retained and (path.name.startswith('.upload-') or re.fullmatch(r'[a-f0-9]{32}\.[a-z0-9]+',path.name)):
                            path.unlink()
        except HTTPException as error:
            if error.status_code!=409:raise

    def settings(self, conn):
        row = conn.execute('SELECT * FROM classroom_file_settings WHERE id=1').fetchone()
        values = {**DEFAULTS, **self.c.settings.file_defaults}
        if row:
            values.update({key: row[key] for key in DEFAULTS})
        values['students_can_upload'] = bool(values['students_can_upload'])
        return values

    def directory(self):
        self.root.mkdir(parents=True, exist_ok=True, mode=0o700)
        self.root.chmod(0o700)
        return self.root

    @contextmanager
    def lock(self):
        root = self.directory()
        fd = os.open(root / '.write.lock', os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
        try:
            try: fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError: fail(409, 'files_busy')
            yield
        finally:
            os.close(fd)

    @asynccontextmanager
    async def upload_lock(self):
        # Simultaneous pupil submissions queue without blocking the ASGI loop.
        # Other mutations and the encrypted snapshot use the same OS lock.
        deadline = time.monotonic() + 60
        while True:
            lock = self.lock()
            try:
                lock.__enter__()
                break
            except HTTPException as error:
                if error.status_code != 409 or time.monotonic() >= deadline:
                    raise
                await asyncio.sleep(0.05)
        try:
            yield
        finally:
            lock.__exit__(None, None, None)

    def group_dir(self, group):
        return self.root / hashlib.sha256(group.encode()).hexdigest()

    def blob(self, storage):
        parts = PurePosixPath(storage)
        if parts.is_absolute() or '..' in parts.parts or not re.fullmatch(r'[a-f0-9]{64}/[a-f0-9]{32}\.[a-z0-9]+', storage):
            fail(404, 'file_not_found')
        path = self.root / storage
        if path.is_symlink() or path.parent.is_symlink() or not path.is_file():
            fail(404, 'file_not_found')
        return path

    def usage(self, conn, group, identity=None):
        total = conn.execute('SELECT COALESCE(SUM(size),0) FROM classroom_files WHERE group_id=? AND active=1', (group,)).fetchone()[0]
        personal = conn.execute('SELECT COALESCE(SUM(size),0) FROM classroom_files WHERE group_id=? AND identity_id=? AND active=1', (group,identity)).fetchone()[0] if identity else 0
        return {'group_bytes': total, 'student_bytes': personal}

    @staticmethod
    def public(row):
        return {key: row[key] for key in ('id','group_id','scope','identity_id','relative_path','size','sha256','created_at','updated_at','public_code')}

    def listing(self, group, identity=None):
        with self.c.connect() as conn:
            where = 'f.group_id=? AND f.active=1'
            params = [group]
            if identity:
                where += " AND (f.scope='shared' OR f.identity_id=?)"
                params.append(identity)
            rows = conn.execute('SELECT f.*,i.public_code FROM classroom_files f LEFT JOIN student_identities i ON i.id=f.identity_id WHERE '+where+' ORDER BY f.relative_path,f.identity_id',params).fetchall()
            return {'files':[self.public(row) for row in rows], 'settings':self.settings(conn), 'usage':self.usage(conn,group,identity)}

    def row(self, conn, group, file_id, identity=None, deleting=False):
        row = conn.execute('SELECT * FROM classroom_files WHERE group_id=? AND id=? AND active=1',(group,file_id)).fetchone()
        if not row or identity and not (row['identity_id']==identity or not deleting and row['scope']=='shared'):
            fail(404, 'file_not_found')
        return row

    async def upload(self, request, group, identity, actor, authorize):
        name = relative_path(request.headers.get('x-file-path') or request.headers.get('x-file-name',''))
        extension = PurePosixPath(name).suffix.lower()[1:]
        length = request.headers.get('content-length')
        if length is not None and not length.isdigit(): fail(400, 'invalid_content_length')
        if self.rate(actor): fail(429, 'upload_rate_limit')
        async with self.upload_lock():
            with self.c.connect() as conn:
                settings = self.settings(conn)
            if identity and not settings['students_can_upload']: fail(403, 'student_upload_disabled')
            if length is not None and int(length)>settings['max_file_bytes']:
                # Finish receiving without storing bytes. Otherwise an early 413
                # can reset nginx's unbuffered upstream connection and become 502.
                async for _ in request.stream():pass
                fail(413, 'file_too_large')
            group_dir = self.group_dir(group)
            if group_dir.is_symlink():fail(507, "files_disk_full")
            group_dir.mkdir(mode=0o700, exist_ok=True)
            token = uuid.uuid4().hex
            temporary = group_dir / ('.upload-'+token)
            target = group_dir / (token+'.'+extension)
            fd = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
            size = 0
            sha = hashlib.sha256()
            committed = False
            try:
                with os.fdopen(fd, 'wb') as stream:
                    incoming = request.stream()
                    async for chunk in incoming:
                        size += len(chunk)
                        if size>settings['max_file_bytes']:
                            async for _ in incoming:pass
                            fail(413, 'file_too_large')
                        if shutil.disk_usage(self.root).free < len(chunk)+self.reserve: fail(507, 'files_disk_full')
                        stream.write(chunk);sha.update(chunk)
                    stream.flush();os.fsync(stream.fileno())
                if length is not None and size != int(length): fail(400, 'invalid_content_length')
                validate_content(temporary,extension)
                # Recheck current membership, session and quotas after receiving bytes.
                authorize()
                scope = 'submission' if identity else 'shared'
                with self.c.connect() as conn:
                    conn.execute('BEGIN IMMEDIATE')
                    settings = self.settings(conn)
                    if identity and not settings['students_can_upload']: fail(403, 'student_upload_disabled')
                    old = conn.execute('SELECT * FROM classroom_files WHERE group_id=? AND scope=? AND identity_id IS ? AND relative_path=? AND active=1',(group,scope,identity,name)).fetchone()
                    if old and request.headers.get('x-file-replace') != '1': fail(409, 'file_exists')
                    usage = self.usage(conn,group,identity)
                    previous = old['size'] if old else 0
                    count = conn.execute('SELECT COUNT(*) FROM classroom_files WHERE group_id=? AND active=1',(group,)).fetchone()[0]
                    own_count = conn.execute('SELECT COUNT(*) FROM classroom_files WHERE group_id=? AND identity_id=? AND active=1',(group,identity)).fetchone()[0] if identity else 0
                    if size>settings['max_file_bytes']: fail(413, 'file_too_large')
                    if usage['group_bytes']-previous+size>settings['group_quota_bytes'] or identity and usage['student_bytes']-previous+size>settings['student_quota_bytes']: fail(413, 'files_quota_exceeded')
                    if not old and (count>=1000 or identity and own_count>=200): fail(413, 'files_count_limit')
                    if shutil.disk_usage(self.root).free < self.reserve: fail(507, 'files_disk_full')
                    file_id = old['id'] if old else uuid.uuid4().hex
                    ts = iso_now()
                    os.replace(temporary,target)
                    conn.execute('''INSERT INTO classroom_files (id,group_id,scope,identity_id,uploaded_by_teacher_id,relative_path,storage_name,content_type,size,sha256,created_at,updated_at,active)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1)
                        ON CONFLICT(id) DO UPDATE SET storage_name=excluded.storage_name,size=excluded.size,sha256=excluded.sha256,updated_at=excluded.updated_at,uploaded_by_teacher_id=excluded.uploaded_by_teacher_id''',
                        (file_id,group,scope,identity,actor if not identity else '',name,str(target.relative_to(self.root)),'application/octet-stream',size,sha.hexdigest(),old['created_at'] if old else ts,ts))
                committed = True
                if old:
                    try:self.blob(old['storage_name']).unlink()
                    except HTTPException:pass
                return {'id':file_id,'replaced':bool(old)}
            finally:
                temporary.unlink(missing_ok=True)
                if not committed:target.unlink(missing_ok=True)

    def delete(self, group, file_id, identity=None):
        with self.lock():
            with self.c.connect() as conn:
                row = self.row(conn,group,file_id,identity,deleting=True)
                conn.execute('DELETE FROM classroom_files WHERE id=?',(file_id,))
            try:self.blob(row['storage_name']).unlink()
            except HTTPException:pass
        return {'deleted':file_id}

    def download(self, group, file_id, identity=None):
        with self.c.connect() as conn:row = self.row(conn,group,file_id,identity)
        try:stream = self.blob(row['storage_name']).open('rb')
        except OSError:fail(404,'file_not_found')
        def chunks():
            try:
                while data := stream.read(65536):yield data
            finally:stream.close()
        return StreamingResponse(chunks(),media_type='application/octet-stream',headers={
            'Content-Disposition':"attachment; filename*=UTF-8''"+quote(PurePosixPath(row['relative_path']).name,safe=''),
            'Content-Length':str(row['size']),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff',
            'Content-Security-Policy':"default-src 'none'; sandbox"})
