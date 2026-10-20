"""Private Commons image library. Original Commons implementation (MIT).

Independent of the Blocs GUI, VM and database. No image transformation UI and no
network fetches. All content belongs to a verified, individual Commons principal.
"""
from __future__ import annotations

import hashlib
import io
import json
import os
import re
import secrets
import shutil
import threading
import warnings
from contextlib import closing
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import unquote, urlsplit

from fastapi import APIRouter, HTTPException, Request, Response
from PIL import Image, ImageOps, UnidentifiedImageError
from .catalogue import Catalogue
from starlette.concurrency import run_in_threadpool

TYPES = {"sprite", "background", "object", "illustration"}
MAX_IMAGE = 5 * 1024 * 1024
MAX_DIMENSION = 4096
MAX_ITEMS = 200
MAX_USER_BYTES = 100 * 1024 * 1024
ID = re.compile(r"img-[a-f0-9]{64}\Z")
_DECODERS = threading.BoundedSemaphore(2)


def timestamp():
    return datetime.now(timezone.utc).isoformat()


def fail(status, code):
    raise HTTPException(status, code)


def check_metadata(name, kind):
    if not isinstance(name, str) or not name.strip() or len(name) > 200 or any(ord(c) < 32 for c in name):
        fail(422, "invalid_name")
    if kind not in TYPES:
        fail(422, "invalid_type")
    return name.strip(), kind


def normalize(raw, declared):
    """Decode verified raster formats, discard metadata and encode inert PNGs."""
    if not raw or len(raw) > MAX_IMAGE:
        fail(413, "image_limit")
    accepted = {"PNG": "image/png", "JPEG": "image/jpeg", "WEBP": "image/webp"}
    with _DECODERS, warnings.catch_warnings():
        warnings.simplefilter("error", Image.DecompressionBombWarning)
        try:
            with Image.open(io.BytesIO(raw)) as probe:
                if probe.format not in accepted or accepted[probe.format] != declared:
                    fail(415, "invalid_image")
                width, height = probe.size
                if not (0 < width <= MAX_DIMENSION and 0 < height <= MAX_DIMENSION):
                    fail(413, "dimension_limit")
                if getattr(probe, "n_frames", 1) != 1:
                    fail(415, "animated_image")
                probe.verify()
            with Image.open(io.BytesIO(raw)) as source:
                source.load()
                image = ImageOps.exif_transpose(source).convert("RGBA")
                # A new image excludes EXIF, ICC, text and all other source metadata.
                clean = Image.new("RGBA", image.size)
                clean.paste(image)
                output = io.BytesIO()
                clean.save(output, "PNG")
                content = output.getvalue()
                if len(content) > MAX_IMAGE:
                    fail(413, "image_limit")
                clean.thumbnail((256, 256))
                thumb = io.BytesIO()
                clean.save(thumb, "PNG")
                return content, thumb.getvalue(), image.width, image.height
        except (UnidentifiedImageError, OSError, ValueError, SyntaxError,
                Image.DecompressionBombError, Image.DecompressionBombWarning):
            fail(415, "invalid_image")


class Library:
    def __init__(self, connect, db_path, oidc, student):
        self.catalogue = Catalogue(Path(__file__).parent / "catalog", normalize)
        self.connect, self.db_path = connect, db_path
        self.oidc, self.student = oidc, student
        self.public_origin = os.environ.get("REBOST_PUBLIC_ORIGIN", "").rstrip("/")
        if self.public_origin:
            parsed = urlsplit(self.public_origin)
            if parsed.scheme not in {"http", "https"} or not parsed.hostname or parsed.path or parsed.query or parsed.fragment or parsed.username:
                raise ValueError("Invalid Rebost public origin configuration")
        self.global_limit = int(os.environ.get("REBOST_MAX_BYTES", str(2 * 1024 ** 3)))
        self.disk_reserve = int(os.environ.get("REBOST_DISK_RESERVE", str(256 * 1024 ** 2)))
        with closing(connect()) as db, db:
            db.executescript("""
                CREATE TABLE IF NOT EXISTS asset_principals (
                    id TEXT PRIMARY KEY, kind TEXT NOT NULL, issuer TEXT NOT NULL,
                    subject TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1,
                    UNIQUE(kind, issuer, subject));
                CREATE TABLE IF NOT EXISTS asset_sessions (
                    token_hash TEXT PRIMARY KEY, principal TEXT NOT NULL REFERENCES asset_principals(id),
                    expires_at TEXT NOT NULL, revoked_at TEXT);
                CREATE TABLE IF NOT EXISTS asset_contents (
                    id TEXT PRIMARY KEY, principal TEXT NOT NULL REFERENCES asset_principals(id),
                    sha256 TEXT NOT NULL, data BLOB NOT NULL, thumbnail BLOB NOT NULL,
                    width INTEGER NOT NULL, height INTEGER NOT NULL,
                    UNIQUE(principal, sha256));
                CREATE TABLE IF NOT EXISTS assets (
                    id TEXT PRIMARY KEY, principal TEXT NOT NULL REFERENCES asset_principals(id),
                    content_id TEXT NOT NULL REFERENCES asset_contents(id), name TEXT NOT NULL,
                    type TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1,
                    created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
                CREATE INDEX IF NOT EXISTS idx_assets_principal ON assets(principal, id);
                CREATE TABLE IF NOT EXISTS asset_provenance (
                    asset_id TEXT PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
                    metadata TEXT NOT NULL, source BLOB NOT NULL, license_text TEXT NOT NULL);

            """)

    def bind(self, db, kind, issuer, subject):
        db.execute("INSERT OR IGNORE INTO asset_principals (id,kind,issuer,subject) VALUES (?,?,?,?)",
                   (secrets.token_hex(24), kind, issuer, subject))
        row = db.execute("SELECT id,active FROM asset_principals WHERE kind=? AND issuer=? AND subject=?",
                         (kind, issuer, subject)).fetchone()
        if not row["active"]:
            fail(401, "session_required")
        return row["id"]

    def issue_oidc(self, issuer, subject):
        token = secrets.token_urlsafe(32)
        with closing(self.connect()) as db, db:
            owner = self.bind(db, "oidc", issuer, subject)
            # Existing Commons OIDC cookies are long lived; Rebost requires a
            # server-side, revocable session with a separate eight-hour expiry.
            db.execute("DELETE FROM asset_sessions WHERE expires_at <= ?", (timestamp(),))
            db.execute("INSERT INTO asset_sessions VALUES (?,?,?,NULL)",
                       (hashlib.sha256(token.encode()).hexdigest(), owner,
                        (datetime.now(timezone.utc) + timedelta(hours=8)).isoformat()))
        return token

    def revoke_oidc(self, request):
        cookie = self.oidc(request)
        if cookie and isinstance(cookie.get("rebost_sid"), str):
            with closing(self.connect()) as db, db:
                db.execute("UPDATE asset_sessions SET revoked_at=? WHERE token_hash=?",
                           (timestamp(), hashlib.sha256(cookie["rebost_sid"].encode()).hexdigest()))

    def principal(self, request):
        cookie = self.oidc(request)
        if cookie:
            token = cookie.get("rebost_sid")
            if not isinstance(token, str):
                fail(401, "session_required")
            with closing(self.connect()) as db:
                row = db.execute("""SELECT p.id FROM asset_sessions s
                    JOIN asset_principals p ON p.id=s.principal WHERE s.token_hash=?
                    AND s.revoked_at IS NULL AND s.expires_at>? AND p.active=1
                    AND p.kind='oidc' AND p.issuer=? AND p.subject=?""",
                    (hashlib.sha256(token.encode()).hexdigest(), timestamp(), cookie["iss"], cookie["sub"])).fetchone()
            if not row:
                fail(401, "session_required")
            return row["id"]
        identity = self.student(request)
        if not identity:
            # A teacher/app compatibility token never owns a human library.
            fail(401, "session_required")
        with closing(self.connect()) as db, db:
            return self.bind(db, "student", "commons", identity["id"])

    def row(self, db, owner, asset_id):
        if not ID.fullmatch(asset_id):
            fail(404, "not_found")
        row = db.execute("""SELECT a.*,c.width,c.height,length(c.data) AS bytes,p.metadata AS provenance FROM assets a
            JOIN asset_contents c ON c.id=a.content_id LEFT JOIN asset_provenance p ON p.asset_id=a.id WHERE a.id=? AND a.principal=?""", (asset_id, owner)).fetchone()
        if not row:
            fail(404, "not_found")
        return row

    @staticmethod
    def metadata(row):
        result = {key: row[key] for key in ("id", "name", "type", "width", "height", "bytes", "revision", "created_at", "updated_at")}
        result.update({"collection": "mine", "readonly": False})
        if row["provenance"]:
            result["provenance"] = json.loads(row["provenance"])
        return result

    @staticmethod
    def revision(request, row):
        if request.headers.get("if-match") != f'"{row["revision"]}"':
            fail(412, "revision_conflict")

    def capacity(self, db, owner, content_bytes=0, physical_bytes=0):
        count = db.execute("SELECT COUNT(*) FROM assets WHERE principal=?", (owner,)).fetchone()[0]
        used = db.execute("SELECT coalesce(sum(length(data)),0) FROM asset_contents WHERE principal=?", (owner,)).fetchone()[0]
        sources = db.execute("""SELECT coalesce(sum(length(p.source)+length(CAST(p.metadata AS BLOB))+length(CAST(p.license_text AS BLOB))),0)
            FROM asset_provenance p JOIN assets a ON a.id=p.asset_id WHERE a.principal=?""", (owner,)).fetchone()[0]
        if count >= MAX_ITEMS or used + sources + content_bytes > MAX_USER_BYTES:
            fail(413, "library_limit")
        total = db.execute("SELECT coalesce(sum(length(data)+length(thumbnail)),0) FROM asset_contents").fetchone()[0]
        total += db.execute("SELECT coalesce(sum(length(source)+length(CAST(metadata AS BLOB))+length(CAST(license_text AS BLOB))),0) FROM asset_provenance").fetchone()[0]
        total += self.catalogue.total_bytes
        if total + physical_bytes > self.global_limit:
            fail(413, "installation_limit")
        if physical_bytes and shutil.disk_usage(Path(self.db_path).parent).free < self.disk_reserve + physical_bytes:
            fail(507, "disk_limit")

    @staticmethod
    def provenance_size(provenance):
        return sum(len(part.encode()) if isinstance(part, str) else len(part) for part in provenance) if provenance else 0

    @staticmethod
    def write_provenance(db, asset_id, provenance):
        if provenance:
            db.execute("INSERT INTO asset_provenance VALUES (?,?,?,?)", (asset_id, *provenance))

    def add(self, owner, name, kind, normalized, provenance=None, source_id=None, source_revision=None):
        data, thumb, width, height = normalized
        digest = hashlib.sha256(data).hexdigest()
        with closing(self.connect()) as db, db:
            db.execute("BEGIN IMMEDIATE")
            if source_id is not None:
                if not ID.fullmatch(source_id):
                    fail(422, "invalid_source")
                catalog = self.catalogue.get(source_id)
                if catalog:
                    meta = catalog["metadata"]
                    provenance = catalog["provenance"]
                else:
                    meta = self.row(db, owner, source_id)
                    origin = db.execute("SELECT metadata,source,license_text FROM asset_provenance WHERE asset_id=?", (source_id,)).fetchone()
                    provenance = tuple(origin) if origin else None
                if source_revision != f'"{meta["revision"]}"':
                    fail(412, "revision_conflict")
                if not provenance:
                    fail(422, "invalid_source")
                metadata = json.loads(provenance[0])
                metadata["changes"] = "Derived image; original source and license retained."
                provenance = (json.dumps(metadata, ensure_ascii=False, sort_keys=True), provenance[1], provenance[2])
            found = db.execute("SELECT id FROM asset_contents WHERE principal=? AND sha256=?", (owner, digest)).fetchone()
            extra = self.provenance_size(provenance)
            self.capacity(db, owner, extra + (0 if found else len(data)), extra + (0 if found else len(data)+len(thumb)))
            content_id = found["id"] if found else secrets.token_hex(32)
            if not found:
                db.execute("INSERT INTO asset_contents VALUES (?,?,?,?,?,?,?)",
                           (content_id, owner, digest, data, thumb, width, height))
            asset_id = "img-" + secrets.token_hex(32)
            now = timestamp()
            db.execute("INSERT INTO assets VALUES (?,?,?,?,?,1,?,?)", (asset_id, owner, content_id, name, kind, now, now))
            self.write_provenance(db, asset_id, provenance)
            return self.metadata(self.row(db, owner, asset_id))

    def router(self):
        router = APIRouter(prefix="/api/assets/v1", tags=["Rebost"])

        @router.get("/me")
        def me(request: Request):
            self.principal(request)
            return {"capabilities": ["private_library", "catalog", "derived_upload"], "catalog_items": len(self.catalogue.items), "limits": {
                "image_bytes": MAX_IMAGE, "dimension": MAX_DIMENSION,
                "items": MAX_ITEMS, "library_bytes": MAX_USER_BYTES}}

        @router.get("/items")
        def items(request: Request, q: str = "", type: str = "", cursor: str = "", limit: int = 40, collection: str = "mine"):
            owner = self.principal(request)
            if len(q) > 200 or (type and type not in TYPES) or not (1 <= limit <= 80) or (cursor and not ID.fullmatch(cursor)):
                fail(422, "invalid_filter")
            if collection not in {"mine", "catalog"}:
                fail(422, "invalid_collection")
            if collection == "catalog":
                return self.catalogue.list(q, type, cursor, limit)
            search = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
            with closing(self.connect()) as db:
                rows = db.execute("""SELECT a.*,c.width,c.height,length(c.data) AS bytes,p.metadata AS provenance FROM assets a
                    JOIN asset_contents c ON c.id=a.content_id LEFT JOIN asset_provenance p ON p.asset_id=a.id WHERE a.principal=? AND a.id>?
                    AND a.name LIKE ? ESCAPE '\\' AND (?='' OR a.type=?) ORDER BY a.id LIMIT ?""",
                    (owner, cursor, f"%{search}%", type, type, limit+1)).fetchall()
            return {"items": [self.metadata(row) for row in rows[:limit]],
                    "next_cursor": rows[limit-1]["id"] if len(rows)>limit else None}

        @router.post("/items", status_code=201, openapi_extra={
            "parameters": [
                {"in": "header", "name": "X-Rebost-Name", "required": True,
                 "description": "UTF-8 name encoded with encodeURIComponent (maximum 200 decoded characters)",
                 "schema": {"type": "string"}},
                {"in": "header", "name": "X-Rebost-Source", "required": False,
                 "description": "Authorized source item ID for a derivative; requires If-Match of its revision. Server retains immutable provenance.",
                 "schema": {"type": "string"}},
                {"in": "header", "name": "If-Match", "required": False,
                 "schema": {"type": "string"}},
                {"in": "header", "name": "X-Rebost-Type", "required": True,
                 "schema": {"type": "string", "enum": sorted(TYPES)}},
            ],
            "requestBody": {"required": True, "content": {
                mime: {"schema": {"type": "string", "format": "binary"}}
                for mime in ("image/png", "image/jpeg", "image/webp")}},
        })
        async def upload(request: Request):
            check_origin(request, self.public_origin)
            owner = await run_in_threadpool(self.principal, request)
            name, kind = check_metadata(unquote(request.headers.get("x-rebost-name", "")), request.headers.get("x-rebost-type"))
            if request.headers.get("content-length", "").isdigit() and int(request.headers["content-length"]) > MAX_IMAGE:
                fail(413, "image_limit")
            body = bytearray()
            async for chunk in request.stream():
                if len(body) + len(chunk) > MAX_IMAGE:
                    fail(413, "image_limit")
                body.extend(chunk)
            normalized = await run_in_threadpool(normalize, bytes(body), request.headers.get("content-type", "").split(";")[0])
            source_id = request.headers.get("x-rebost-source")
            if "if-match" in request.headers and not source_id:
                fail(422, "invalid_source")
            return await run_in_threadpool(self.add, owner, name, kind, normalized, None,
                                           source_id, request.headers.get("if-match"))

        @router.get("/items/{asset_id}")
        def metadata(asset_id: str, request: Request, response: Response):
            owner = self.principal(request)
            catalog = self.catalogue.get(asset_id)
            if catalog:
                response.headers["ETag"] = f'"{catalog["metadata"]["revision"]}"'
                return catalog["metadata"]
            with closing(self.connect()) as db:
                row = self.row(db, owner, asset_id)
            response.headers["ETag"] = f'"{row["revision"]}"'
            return self.metadata(row)

        @router.get("/items/{asset_id}/content")
        @router.get("/items/{asset_id}/thumbnail")
        def content(asset_id: str, request: Request):
            owner = self.principal(request)
            field = "thumbnail" if request.url.path.endswith("/thumbnail") else "data"
            catalog = self.catalogue.get(asset_id)
            if catalog:
                data = catalog[field]
            else:
                with closing(self.connect()) as db:
                    row = self.row(db, owner, asset_id)
                    data = db.execute(f"SELECT {field} FROM asset_contents WHERE id=?", (row["content_id"],)).fetchone()[0]
            return Response(data, media_type="image/png", headers={"Content-Disposition": f'inline; filename="{asset_id}.png"'})

        @router.get("/items/{asset_id}/source")
        @router.get("/items/{asset_id}/license")
        def source(asset_id: str, request: Request):
            owner = self.principal(request)
            catalog = self.catalogue.get(asset_id)
            if catalog:
                provenance = catalog["provenance"]
            else:
                with closing(self.connect()) as db:
                    self.row(db, owner, asset_id)
                    row = db.execute("SELECT metadata,source,license_text FROM asset_provenance WHERE asset_id=?", (asset_id,)).fetchone()
                    if not row:
                        fail(404, "not_found")
                    provenance = tuple(row)
            license_file = request.url.path.endswith("/license")
            data = provenance[2].encode() if license_file else provenance[1]
            filename = f'{asset_id}.license.txt' if license_file else f'{asset_id}.source.svg'
            # SVG originals are attachments only; never render imported SVG content.
            return Response(data, media_type="application/octet-stream",
                            headers={"Content-Disposition": f'attachment; filename="{filename}"'})

        @router.patch("/items/{asset_id}")
        async def update(asset_id: str, request: Request):
            check_origin(request, self.public_origin)
            owner = self.principal(request)
            raw = bytearray()
            async for chunk in request.stream():
                raw.extend(chunk)
                if len(raw)>4096:
                    fail(413, "metadata_limit")
            try:
                payload = json.loads(raw)
                if not isinstance(payload, dict) or set(payload) != {"name", "type"}:
                    fail(422, "invalid_metadata")
                name, kind = check_metadata(payload["name"], payload["type"])
            except (ValueError, TypeError):
                fail(422, "invalid_metadata")
            with closing(self.connect()) as db, db:
                db.execute("BEGIN IMMEDIATE")
                row = self.row(db, owner, asset_id)
                self.revision(request, row)
                db.execute("UPDATE assets SET name=?,type=?,revision=revision+1,updated_at=? WHERE id=?",
                           (name, kind, timestamp(), asset_id))
                return self.metadata(self.row(db, owner, asset_id))

        @router.post("/items/{asset_id}/copies", status_code=201)
        def copy(asset_id: str, request: Request):
            check_origin(request, self.public_origin)
            owner = self.principal(request)
            catalog = self.catalogue.get(asset_id)
            if catalog:
                meta = catalog["metadata"]
                self.revision(request, meta)
                return self.add(owner, meta["name"], meta["type"],
                                (catalog["data"], catalog["thumbnail"], meta["width"], meta["height"]), catalog["provenance"])
            with closing(self.connect()) as db, db:
                db.execute("BEGIN IMMEDIATE")
                row = self.row(db, owner, asset_id)
                self.revision(request, row)
                origin = db.execute("SELECT metadata,source,license_text FROM asset_provenance WHERE asset_id=?", (asset_id,)).fetchone()
                provenance = tuple(origin) if origin else None
                extra = self.provenance_size(provenance)
                self.capacity(db, owner, extra, extra)
                new_id, now = "img-"+secrets.token_hex(32), timestamp()
                db.execute("INSERT INTO assets VALUES (?,?,?,?,?,1,?,?)",
                           (new_id, owner, row["content_id"], row["name"], row["type"], now, now))
                self.write_provenance(db, new_id, provenance)
                return self.metadata(self.row(db, owner, new_id))

        @router.delete("/items/{asset_id}", status_code=204)
        def remove(asset_id: str, request: Request):
            check_origin(request, self.public_origin)
            owner = self.principal(request)
            with closing(self.connect()) as db, db:
                db.execute("BEGIN IMMEDIATE")
                row = self.row(db, owner, asset_id)
                self.revision(request, row)
                db.execute("DELETE FROM assets WHERE id=?", (asset_id,))
                db.execute("DELETE FROM asset_contents WHERE id=? AND NOT EXISTS(SELECT 1 FROM assets WHERE content_id=?)",
                           (row["content_id"], row["content_id"]))
            return Response(status_code=204)

        return router


def check_origin(request, expected=""):
    def origin(value):
        try:
            parsed = urlsplit(value)
            return (parsed.scheme, parsed.hostname, parsed.port or (443 if parsed.scheme == "https" else 80))
        except ValueError:
            return None
    supplied = request.headers.get("origin", "")
    if not supplied or supplied == "null" or origin(supplied) != origin(expected or str(request.base_url)):
        fail(403, "origin_required")
