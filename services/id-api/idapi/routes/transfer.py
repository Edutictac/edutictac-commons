"""Primer tall del trasllat manual d'una aula: paquet xifrat i alta en destí."""

from __future__ import annotations

import base64
import binascii
import hashlib
import json
import secrets
import sqlite3
from typing import Any

from assets import check_origin
from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from ..context import Commons, commons

router = APIRouter()
MAGIC = b"ETC-AULA-1\n"
MAX_PLAINTEXT = 8 * 1024 * 1024
MAX_PACKAGE = MAX_PLAINTEXT + len(MAGIC) + 12 + 16

# Columnes explícites: el paquet no pot importar taules ni SQL arbitraris.
TABLES = {
    "student_identities": ("id", "group_id", "public_code", "pin_hash", "active",
                           "avatar_icon", "created_at", "updated_at", "pin_rotated_at"),
    "activity_assignments": ("id", "app_id", "activity_id", "title", "launch_url",
                             "group_id", "created_by_teacher_id", "active", "created_at", "updated_at"),
    "scores": ("id", "identity_id", "assignment_id", "app_id", "activity_id",
               "score", "result_id", "metadata_json", "created_at"),
    "manual_completions": ("id", "assignment_id", "identity_id", "teacher_id", "created_at"),
    "itineraries": ("id", "title", "group_id", "created_by_teacher_id",
                    "active", "created_at", "updated_at"),
    "itinerary_items": ("itinerary_id", "assignment_id", "position", "created_at"),
    "group_itinerary_selection": ("group_id", "itinerary_id"),
}
GROUP_COLUMNS = ("id", "name", "tenant_id", "created_by_teacher_id", "created_at", "updated_at", "label")
ROW_LIMITS = {
    "student_identities": 1000, "activity_assignments": 5000, "scores": 100000,
    "manual_completions": 100000, "itineraries": 1000, "itinerary_items": 5000,
    "group_itinerary_selection": 1,
}


class ImportIn(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    package: str = Field(max_length=12 * 1024 * 1024)
    recovery_key: str = Field(min_length=43, max_length=44)


def enabled(c: Commons) -> None:
    if not c.settings.classroom_transfer_enabled:
        raise HTTPException(404, "classroom transfer unavailable")


def teacher(c: Commons, request: Request) -> str:
    # Amb OIDC activat, el token docent compartit no pot exportar dades.
    if c.settings.oidc_configured:
        identity = c.auth.oidc_cookie(request)
        if not identity or identity.get("role") not in {"profesor", "administrador"}:
            raise HTTPException(401, "individual teacher authentication required")
        return str(identity["id"])
    return c.auth.require_teacher(request)


def rows(conn: sqlite3.Connection, table: str, group_id: str) -> list[dict[str, Any]]:
    if table in {"student_identities", "activity_assignments", "itineraries",
                 "group_itinerary_selection"}:
        sql = f"SELECT * FROM {table} WHERE group_id = ?"
    elif table == "scores":
        sql = ("SELECT s.* FROM scores s JOIN student_identities i ON i.id=s.identity_id "
               "WHERE i.group_id=?")
    elif table == "manual_completions":
        sql = ("SELECT m.* FROM manual_completions m JOIN activity_assignments a "
               "ON a.id=m.assignment_id WHERE a.group_id=?")
    else:
        sql = ("SELECT ii.* FROM itinerary_items ii JOIN itineraries i "
               "ON i.id=ii.itinerary_id WHERE i.group_id=?")
    result = conn.execute(sql, (group_id,)).fetchall()
    if len(result) > ROW_LIMITS[table]:
        raise HTTPException(413, "group too large for this transfer version")
    return [{key: row[key] for key in TABLES[table]} for row in result]


def snapshot(conn: sqlite3.Connection, group_id: str, actor: str) -> dict[str, Any]:
    group = conn.execute("SELECT * FROM groups WHERE id=?", (group_id,)).fetchone()
    if not group or group["created_by_teacher_id"] != actor:
        raise HTTPException(404, "group not found")
    if conn.execute("SELECT COUNT(*) FROM group_memberships WHERE group_id=? AND teacher_id<>?",
                    (group_id, actor)).fetchone()[0]:
        raise HTTPException(409, "collaborative groups are not supported yet")
    if conn.execute("SELECT COUNT(*) FROM classroom_files WHERE group_id=?",
                    (group_id,)).fetchone()[0]:
        raise HTTPException(409, "groups with classroom files are not supported yet")
    if conn.execute("""SELECT COUNT(*) FROM asset_contents c
        JOIN asset_principals p ON p.id=c.principal
        JOIN student_identities i ON i.id=p.subject
        WHERE p.kind='student' AND p.issuer='commons' AND i.group_id=?""",
                    (group_id,)).fetchone()[0]:
        raise HTTPException(409, "groups with private student assets are not supported yet")
    data = {"format": 2, "group": {key: group[key] for key in GROUP_COLUMNS},
            "tables": {table: rows(conn, table, group_id) for table in TABLES}}
    for table in ("activity_assignments", "itineraries"):
        if any(row["created_by_teacher_id"] not in ("", actor) for row in data["tables"][table]):
            raise HTTPException(409, "another teacher owns group content")
    if any(row["teacher_id"] not in ("", actor) for row in data["tables"]["manual_completions"]):
        raise HTTPException(409, "another teacher owns group content")
    return data


def digest(data: dict[str, Any]) -> str:
    """Resum estable encara que cada instal·lació tinga un ID docent local."""
    group = dict(data["group"])
    owner = group["created_by_teacher_id"]
    group["created_by_teacher_id"] = "@owner"
    normalized = {}
    for table, source in data["tables"].items():
        items = []
        for original in source:
            row = dict(original)
            teacher_column = "teacher_id" if table == "manual_completions" else "created_by_teacher_id"
            if teacher_column in row and row[teacher_column] == owner:
                row[teacher_column] = "@owner"
            items.append(row)
        normalized[table] = sorted(items, key=lambda row: json.dumps(row, sort_keys=True, ensure_ascii=False))
    canonical = json.dumps({"group": group, "tables": normalized}, sort_keys=True,
                           ensure_ascii=False, separators=(",", ":")).encode()
    return hashlib.sha256(canonical).hexdigest()


def decode_key(value: str) -> bytes:
    try:
        key = base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))
    except (ValueError, binascii.Error):
        key = b""
    if len(key) != 32:
        raise HTTPException(400, "invalid recovery key")
    return key


def unpack(package: str, recovery_key: str) -> dict[str, Any]:
    try:
        raw = base64.b64decode(package, validate=True)
    except (ValueError, binascii.Error):
        raise HTTPException(400, "invalid package") from None
    if len(raw) > MAX_PACKAGE or len(raw) < len(MAGIC) + 12 + 16 or not raw.startswith(MAGIC):
        raise HTTPException(400, "invalid package")
    try:
        plaintext = AESGCM(decode_key(recovery_key)).decrypt(
            raw[len(MAGIC):len(MAGIC) + 12], raw[len(MAGIC) + 12:], MAGIC)
        data = json.loads(plaintext)
    except (InvalidTag, ValueError, UnicodeDecodeError, TypeError):
        raise HTTPException(400, "invalid package or recovery key") from None
    if len(plaintext) > MAX_PLAINTEXT or not isinstance(data, dict):
        raise HTTPException(400, "invalid package")
    return data


def validate(data: dict[str, Any]) -> tuple[dict[str, Any], dict[str, list[dict[str, Any]]], str | None, str]:
    if set(data) != {"format", "group", "tables", "base_digest", "digest"} or data["format"] != 2:
        raise HTTPException(400, "unsupported package format")
    group, tables = data["group"], data["tables"]
    if not isinstance(group, dict) or set(group) != set(GROUP_COLUMNS) or not isinstance(tables, dict) or set(tables) != set(TABLES):
        raise HTTPException(400, "invalid package structure")
    if not isinstance(group["id"], str) or not group["id"] or len(group["id"]) > 128:
        raise HTTPException(400, "invalid group")
    if any(value is not None and not isinstance(value, (str, int, float))
           for value in group.values()):
        raise HTTPException(400, "invalid package structure")
    for table, columns in TABLES.items():
        items = tables[table]
        if not isinstance(items, list) or len(items) > ROW_LIMITS[table]:
            raise HTTPException(400, "invalid package structure")
        if any(not isinstance(row, dict) or set(row) != set(columns) for row in items):
            raise HTTPException(400, "invalid package structure")
        if any(value is not None and not isinstance(value, (str, int, float))
               for row in items for value in row.values()):
            raise HTTPException(400, "invalid package structure")
    group_id = group["id"]
    for table in ("student_identities", "activity_assignments", "itineraries",
                  "group_itinerary_selection"):
        if any(row["group_id"] != group_id for row in tables[table]):
            raise HTTPException(400, "foreign group in package")
    students = {row["id"] for row in tables["student_identities"]}
    assignments = {row["id"] for row in tables["activity_assignments"]}
    itineraries = {row["id"] for row in tables["itineraries"]}
    if any(row["identity_id"] not in students or
           (row["assignment_id"] and row["assignment_id"] not in assignments)
           for row in tables["scores"]):
        raise HTTPException(400, "foreign result in package")
    if any(row["identity_id"] not in students or row["assignment_id"] not in assignments
           for row in tables["manual_completions"]):
        raise HTTPException(400, "foreign completion in package")
    if any(row["itinerary_id"] not in itineraries or row["assignment_id"] not in assignments
           for row in tables["itinerary_items"]):
        raise HTTPException(400, "foreign itinerary item in package")
    if any(row["itinerary_id"] is not None and row["itinerary_id"] not in itineraries
           for row in tables["group_itinerary_selection"]):
        raise HTTPException(400, "foreign itinerary selection in package")
    original = group["created_by_teacher_id"]
    if not isinstance(original, str) or not original:
        raise HTTPException(400, "invalid owner")
    for table in ("activity_assignments", "itineraries"):
        if any(row["created_by_teacher_id"] not in ("", original) for row in tables[table]):
            raise HTTPException(400, "foreign teacher in package")
    if any(row["teacher_id"] not in ("", original) for row in tables["manual_completions"]):
        raise HTTPException(400, "foreign teacher in package")
    base_digest, package_digest = data["base_digest"], data["digest"]
    if (base_digest is not None and
            (not isinstance(base_digest, str) or len(base_digest) != 64 or
             any(c not in "0123456789abcdef" for c in base_digest))):
        raise HTTPException(400, "invalid package revision")
    if not isinstance(package_digest, str) or package_digest != digest(data):
        raise HTTPException(400, "invalid package revision")
    return group, tables, base_digest, package_digest


@router.get("/api/teacher/transfer/status")
def transfer_status(request: Request, c: Commons = Depends(commons)) -> JSONResponse:
    enabled(c)
    teacher(c, request)
    return JSONResponse({"enabled": True}, headers={"Cache-Control": "no-store"})


@router.post("/api/teacher/groups/{group_id}/transfer/export")
def export_group(group_id: str, request: Request, c: Commons = Depends(commons)) -> JSONResponse:
    enabled(c)
    check_origin(request)
    if request.headers.get("sec-fetch-site") == "cross-site":
        raise HTTPException(403, "origin_required")
    actor = teacher(c, request)
    with c.connect() as conn:
        conn.execute("BEGIN")
        data = snapshot(conn, group_id, actor)
        state = conn.execute("SELECT baseline_digest FROM group_transfer_state WHERE group_id=?",
                             (group_id,)).fetchone()
        data["base_digest"] = state["baseline_digest"] if state else None
        data["digest"] = digest(data)
    plaintext = json.dumps(data, ensure_ascii=False, sort_keys=True,
                           separators=(",", ":")).encode()
    if len(plaintext) > MAX_PLAINTEXT:
        raise HTTPException(413, "group too large for this transfer version")
    key, nonce = secrets.token_bytes(32), secrets.token_bytes(12)
    package = MAGIC + nonce + AESGCM(key).encrypt(nonce, plaintext, MAGIC)
    return JSONResponse({
        "package": base64.b64encode(package).decode("ascii"),
        "recovery_key": base64.urlsafe_b64encode(key).rstrip(b"=").decode("ascii"),
    }, headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"})


@router.post("/api/teacher/groups/transfer/import")
def import_group(payload: ImportIn, request: Request, c: Commons = Depends(commons)) -> JSONResponse:
    enabled(c)
    check_origin(request)
    if request.headers.get("sec-fetch-site") == "cross-site":
        raise HTTPException(403, "origin_required")
    actor = teacher(c, request)
    group, tables, base_digest, package_digest = validate(unpack(payload.package, payload.recovery_key))
    group_id = group["id"]
    original = group["created_by_teacher_id"]
    with c.connect() as conn:
        conn.execute("BEGIN IMMEDIATE")
        existing = conn.execute("SELECT 1 FROM groups WHERE id=?", (group_id,)).fetchone()
        if conn.execute("SELECT 1 FROM groups WHERE name=? AND id<>?",
                        (group["name"], group_id)).fetchone():
            raise HTTPException(409, "group code already exists")
        if existing:
            current = snapshot(conn, group_id, actor)
            if base_digest is None or digest(current) != base_digest:
                raise HTTPException(409, "group changed since the exported baseline")
            conn.execute("DELETE FROM groups WHERE id=?", (group_id,))
        try:
            group["created_by_teacher_id"] = actor
            conn.execute(f"INSERT INTO groups ({','.join(GROUP_COLUMNS)}) VALUES ({','.join('?' for _ in GROUP_COLUMNS)})",
                         tuple(group[key] for key in GROUP_COLUMNS))
            conn.execute("INSERT INTO group_memberships (group_id,teacher_id,role,created_at) VALUES (?,?,?,?)",
                         (group_id, actor, "owner", group["created_at"]))
            for table, columns in TABLES.items():
                for row in tables[table]:
                    teacher_column = "teacher_id" if table == "manual_completions" else "created_by_teacher_id"
                    if teacher_column in row and row[teacher_column] == original:
                        row[teacher_column] = actor
                    conn.execute(
                        f"INSERT INTO {table} ({','.join(columns)}) VALUES ({','.join('?' for _ in columns)})",
                        tuple(row[key] for key in columns),
                    )
            conn.execute("INSERT INTO group_transfer_state (group_id,baseline_digest) VALUES (?,?)",
                         (group_id, package_digest))
        except (sqlite3.IntegrityError, sqlite3.OperationalError):
            raise HTTPException(409, "package conflicts with local data") from None
    return JSONResponse({"group_id": group_id, "imported": True}, status_code=200 if existing else 201,
                        headers={"Cache-Control": "no-store"})
