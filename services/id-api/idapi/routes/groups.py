"""Aules, col·laboració docent i credencials pseudònimes de l'alumnat."""

from __future__ import annotations

import csv
import io
import secrets
import sqlite3
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import HTMLResponse, PlainTextResponse

from ..access import member_of, teacher_params
from ..context import Commons, commons
from ..db import iso_now
from ..models import AddIdentitiesIn, BatchIn, GroupIn, GroupMemberIn, public_teacher_identity
from ..security import TEACHER_ID_RE, make_code, make_group_code, make_pin, normalize_code

router = APIRouter()


def generate_identities(c: Commons, conn: sqlite3.Connection, group_id: str, count: int, pin_length: int, ts: str) -> list[dict[str, str]]:
    generated: list[dict[str, str]] = []
    for _ in range(count):
        for _attempt in range(200):
            code = make_code()
            exists = conn.execute(
                "SELECT 1 FROM student_identities WHERE public_code = ?",
                (code,),
            ).fetchone()
            if not exists:
                break
        else:
            raise HTTPException(status_code=409, detail="unable to generate unique code")
        pin = make_pin(pin_length)
        identity_id = secrets.token_urlsafe(16)
        conn.execute(
            """
            INSERT INTO student_identities
                (id, group_id, public_code, pin_hash, active, created_at, updated_at, pin_rotated_at)
            VALUES (?, ?, ?, ?, 1, ?, ?, ?)
            """,
            (identity_id, group_id, code, c.hash_pin(pin), ts, ts, ts),
        )
        generated.append({"id": identity_id, "public_code": code, "pin": pin})
    return generated


def insert_group(conn: sqlite3.Connection, tenant_id: str, teacher_id: str, ts: str) -> tuple[str, str]:
    """Crea l'aula i registra qui la crea com a propietari."""
    group_id = secrets.token_urlsafe(10)
    group_code = make_group_code()
    conn.execute(
        """
        INSERT INTO groups (id, name, tenant_id, created_by_teacher_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (group_id, group_code, tenant_id, teacher_id, ts, ts),
    )
    conn.execute(
        "INSERT INTO group_memberships (group_id, teacher_id, role, created_at) VALUES (?, ?, 'owner', ?)",
        (group_id, teacher_id, ts),
    )
    return group_id, group_code


def accessible_group(conn: sqlite3.Connection, group_id: str, teacher_id: str, columns: str = "id") -> sqlite3.Row:
    group = conn.execute(
        f"SELECT {columns} FROM groups g WHERE g.id = ? AND {member_of('g.id')}",
        (group_id, *teacher_params(teacher_id)),
    ).fetchone()
    if not group:
        raise HTTPException(status_code=404, detail="group not found")
    return group


@router.post("/api/groups", status_code=201)
def create_group(payload: GroupIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    with c.connect() as conn:
        group_id, group_code = insert_group(conn, payload.tenant_id, teacher_id, iso_now())
    return {"id": group_id, "group_code": group_code, "tenant_id": payload.tenant_id}


@router.get("/api/teacher/groups/{group_id}/members")
def group_members(group_id: str, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    c.auth.require_group_owner(request, group_id)
    with c.connect() as conn:
        rows = conn.execute(
            "SELECT teacher_id, role, created_at FROM group_memberships WHERE group_id = ? ORDER BY role DESC, created_at",
            (group_id,),
        ).fetchall()
    return {"group_id": group_id, "members": [dict(row) for row in rows]}


@router.post("/api/teacher/groups/{group_id}/members", status_code=201)
def add_group_member(group_id: str, payload: GroupMemberIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    c.auth.require_group_owner(request, group_id)
    with c.connect() as conn:
        conn.execute(
            "INSERT INTO group_memberships (group_id, teacher_id, role, created_at) VALUES (?, ?, ?, ?) "
            "ON CONFLICT(group_id, teacher_id) DO UPDATE SET role = excluded.role",
            (group_id, payload.teacher_id, payload.role, iso_now()),
        )
        row = conn.execute(
            "SELECT teacher_id, role, created_at FROM group_memberships WHERE group_id = ? AND teacher_id = ?",
            (group_id, payload.teacher_id),
        ).fetchone()
    return {"group_id": group_id, "member": dict(row)}


@router.post("/api/teacher/groups/{group_id}/identities", status_code=201)
def add_group_identities(group_id: str, payload: AddIdentitiesIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    c.auth.require_group_access(request, group_id)
    if payload.pin_length not in (4, 6):
        raise HTTPException(status_code=400, detail="pin_length must be 4 or 6")
    ts = iso_now()
    with c.connect() as conn:
        group = conn.execute("SELECT id, name, tenant_id FROM groups WHERE id = ?", (group_id,)).fetchone()
        if not group:
            raise HTTPException(status_code=404, detail="group not found")
        generated = generate_identities(c, conn, group_id, payload.count, payload.pin_length, ts)
        conn.execute("UPDATE groups SET updated_at = ? WHERE id = ?", (ts, group_id))
    return {"group": {"id": group["id"], "group_code": group["name"], "tenant_id": group["tenant_id"]}, "identities": generated}


@router.delete("/api/teacher/groups/{group_id}")
def delete_group(group_id: str, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    c.auth.require_group_owner(request, group_id)
    with c.connect() as conn:
        group = conn.execute("SELECT id, name FROM groups WHERE id = ?", (group_id,)).fetchone()
        if not group:
            raise HTTPException(status_code=404, detail="group not found")
        conn.execute(
            "DELETE FROM app_launch_tokens WHERE assignment_id IN (SELECT id FROM activity_assignments WHERE group_id = ?)",
            (group_id,),
        )
        conn.execute(
            "DELETE FROM scores WHERE identity_id IN (SELECT id FROM student_identities WHERE group_id = ?) "
            "OR assignment_id IN (SELECT id FROM activity_assignments WHERE group_id = ?)",
            (group_id, group_id),
        )
        conn.execute("DELETE FROM itineraries WHERE group_id = ?", (group_id,))
        conn.execute("DELETE FROM activity_assignments WHERE group_id = ?", (group_id,))
        conn.execute("DELETE FROM student_identities WHERE group_id = ?", (group_id,))
        conn.execute("DELETE FROM group_memberships WHERE group_id = ?", (group_id,))
        conn.execute("DELETE FROM groups WHERE id = ?", (group_id,))
    return {"deleted": group_id, "group_code": group["name"]}


@router.delete("/api/teacher/groups/{group_id}/members/{teacher_id}")
def remove_group_member(group_id: str, teacher_id: str, request: Request, c: Commons = Depends(commons)) -> dict[str, bool]:
    c.auth.require_group_owner(request, group_id)
    if not TEACHER_ID_RE.fullmatch(teacher_id):
        raise HTTPException(status_code=400, detail="invalid teacher_id")
    with c.connect() as conn:
        row = conn.execute(
            "SELECT role FROM group_memberships WHERE group_id = ? AND teacher_id = ?",
            (group_id, teacher_id),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="member not found")
        if row["role"] == "owner":
            raise HTTPException(status_code=400, detail="group owner cannot be removed")
        conn.execute(
            "DELETE FROM group_memberships WHERE group_id = ? AND teacher_id = ?",
            (group_id, teacher_id),
        )
    return {"ok": True}


@router.post("/api/identities/batch", status_code=201)
def create_batch(payload: BatchIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    if payload.pin_length not in (4, 6):
        raise HTTPException(status_code=400, detail="pin_length must be 4 or 6")
    ts = iso_now()
    with c.connect() as conn:
        group_id, group_code = insert_group(conn, payload.tenant_id, teacher_id, ts)
        generated = generate_identities(c, conn, group_id, payload.count, payload.pin_length, ts)
    return {
        "group": {"id": group_id, "group_code": group_code, "tenant_id": payload.tenant_id},
        "identities": generated,
    }


@router.post("/api/identities/{identity_id}/regenerate-pin")
def regenerate_pin(identity_id: str, request: Request, pin_length: int = Query(4), c: Commons = Depends(commons)) -> dict[str, str]:
    teacher_id = c.auth.require_teacher(request)
    pin = make_pin(pin_length)
    ts = iso_now()
    with c.connect() as conn:
        cur = conn.execute(
            f"""
            UPDATE student_identities
            SET pin_hash = ?, updated_at = ?, pin_rotated_at = ?
            WHERE id = ?
              AND active = 1
              AND group_id IN (SELECT g.id FROM groups g WHERE {member_of("g.id")})
            """,
            (c.hash_pin(pin), ts, ts, identity_id, *teacher_params(teacher_id)),
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="identity not found")
        conn.execute(
            "UPDATE student_sessions SET revoked_at = ? WHERE identity_id = ? AND revoked_at IS NULL",
            (ts, identity_id),
        )
    return {"id": identity_id, "pin": pin}


@router.post("/api/identities/{identity_id}/revoke")
def revoke_identity(identity_id: str, request: Request, c: Commons = Depends(commons)) -> dict[str, bool]:
    teacher_id = c.auth.require_teacher(request)
    ts = iso_now()
    with c.connect() as conn:
        cur = conn.execute(
            f"""
            UPDATE student_identities
            SET active = 0, updated_at = ?
            WHERE id = ?
              AND group_id IN (SELECT g.id FROM groups g WHERE {member_of("g.id")})
            """,
            (ts, identity_id, *teacher_params(teacher_id)),
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="identity not found")
        conn.execute(
            "UPDATE student_sessions SET revoked_at = ? WHERE identity_id = ? AND revoked_at IS NULL",
            (ts, identity_id),
        )
    return {"ok": True}


@router.get("/api/teacher/summary")
def teacher_summary(request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    with c.connect() as conn:
        totals = conn.execute(
            f"""
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN active = 0 THEN 1 ELSE 0 END) AS inactive
            FROM student_identities
            JOIN groups g ON g.id = student_identities.group_id
            WHERE {member_of("g.id")}
            """,
            teacher_params(teacher_id),
        ).fetchone()
        groups = conn.execute(
            f"""
            SELECT
                g.id,
                g.name,
                g.tenant_id,
                g.created_at,
                COUNT(i.id) AS total,
                SUM(CASE WHEN i.active = 1 THEN 1 ELSE 0 END) AS active
            FROM groups g
            LEFT JOIN student_identities i ON i.group_id = g.id
            WHERE {member_of("g.id")}
            GROUP BY g.id, g.name, g.tenant_id, g.created_at
            ORDER BY g.created_at DESC
            LIMIT 20
            """,
            teacher_params(teacher_id),
        ).fetchall()
    return {
        "total": int(totals["total"] or 0),
        "active": int(totals["active"] or 0),
        "inactive": int(totals["inactive"] or 0),
        "groups": [
            {
                "id": row["id"],
                "name": row["name"],
                "tenant_id": row["tenant_id"],
                "created_at": row["created_at"],
                "total": int(row["total"] or 0),
                "active": int(row["active"] or 0),
            }
            for row in groups
        ],
    }


@router.get("/api/teacher/identities")
def teacher_identities(request: Request, limit: int = Query(200, ge=1, le=500), c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    with c.connect() as conn:
        rows = conn.execute(
            f"""
            SELECT i.id, i.public_code, i.active, i.created_at, i.pin_rotated_at,
                   g.id AS group_id, g.name AS group_name, g.tenant_id
            FROM student_identities i
            JOIN groups g ON g.id = i.group_id
            WHERE i.active = 1
              AND {member_of("g.id")}
            ORDER BY i.created_at DESC, i.public_code
            LIMIT ?
            """,
            (*teacher_params(teacher_id), limit),
        ).fetchall()
    return {"identities": [public_teacher_identity(row) for row in rows]}


@router.get("/api/teacher/identities/by-code/{public_code}")
def teacher_identity_by_code(public_code: str, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    code = normalize_code(public_code)
    with c.connect() as conn:
        row = conn.execute(
            f"""
            SELECT i.id, i.public_code, i.active, i.created_at, i.pin_rotated_at,
                   g.id AS group_id, g.name AS group_name, g.tenant_id
            FROM student_identities i
            JOIN groups g ON g.id = i.group_id
            WHERE i.public_code = ?
              AND i.active = 1
              AND {member_of("g.id")}
            """,
            (code, *teacher_params(teacher_id)),
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="identity not found")
    return {"identity": public_teacher_identity(row)}


@router.get("/api/groups/{group_id}/cards", response_class=HTMLResponse)
def printable_cards(group_id: str, request: Request, c: Commons = Depends(commons)) -> str:
    teacher_id = c.auth.require_teacher(request)
    with c.connect() as conn:
        group = accessible_group(conn, group_id, teacher_id, "*")
        rows = conn.execute(
            """
            SELECT id, public_code, avatar_icon FROM student_identities
            WHERE group_id = ? AND active = 1
            ORDER BY public_code
            """,
            (group_id,),
        ).fetchall()
    cards = "\n".join(
        f"<article><h2>EduTicTac</h2><p>Codi</p><strong>{row['public_code']}</strong>"
        "<p>PIN</p><em>Consulta la targeta original o regenera'l</em>"
        "<small>Utilitza aquest codi en les activitats EduTicTac.</small></article>"
        for row in rows
    )
    return f"""<!doctype html>
<html lang="ca">
<meta charset="utf-8">
<title>Targetes EduTicTac {group['name']}</title>
<style>
body{{font-family:Arial,sans-serif;margin:16px;color:#111}}
main{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}}
article{{border:1px dashed #555;padding:10px;min-height:130px;break-inside:avoid}}
h2{{font-size:18px;margin:0 0 8px}}p{{margin:6px 0 2px}}strong{{font-size:28px}}em{{display:block;font-style:normal;color:#555}}small{{display:block;margin-top:10px}}
@media print{{body{{margin:8mm}}}}
</style>
<main>{cards}</main>
</html>"""


@router.get("/api/groups/{group_id}/csv", response_class=PlainTextResponse)
def export_codes_csv(group_id: str, request: Request, c: Commons = Depends(commons)) -> str:
    """Exporta només els codis públics. Els PIN no s'exporten mai després."""
    teacher_id = c.auth.require_teacher(request)
    out = io.StringIO()
    writer = csv.writer(out)
    writer.writerow(["codi", "grup"])
    with c.connect() as conn:
        accessible_group(conn, group_id, teacher_id)
        rows = conn.execute(
            """
            SELECT i.public_code, g.name FROM student_identities i
            JOIN groups g ON g.id = i.group_id
            WHERE i.group_id = ? AND i.active = 1
            ORDER BY i.public_code
            """,
            (group_id,),
        ).fetchall()
    for row in rows:
        writer.writerow([row["public_code"], row["name"]])
    return out.getvalue()
