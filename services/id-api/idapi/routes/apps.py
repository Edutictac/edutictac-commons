"""Contracte amb les aplicacions: puntuacions, testimonis, rànquings i llistes."""

from __future__ import annotations

import json
import re
import secrets
import sqlite3
from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from ..context import Commons, commons
from ..db import iso_now, now_utc
from ..models import AppRosterIn, AppScoreIn, ConsumeLaunchTokenIn, ScoreIn, normalize_activity_id, normalize_app_id
from ..security import hash_token
from .groups import accessible_group

router = APIRouter()


def check_assignment(conn: sqlite3.Connection, assignment_id: str, app_id: str, activity_id: str, group_id: str) -> None:
    assignment = conn.execute(
        """
        SELECT id, app_id, activity_id, group_id
        FROM activity_assignments
        WHERE id = ? AND active = 1
        """,
        (assignment_id,),
    ).fetchone()
    if not assignment:
        raise HTTPException(status_code=404, detail="assignment not found")
    if assignment["app_id"] != app_id or assignment["activity_id"] != activity_id:
        raise HTTPException(status_code=400, detail="assignment does not match activity")
    if assignment["group_id"] != group_id:
        raise HTTPException(status_code=403, detail="assignment is not for this group")


def record_score(
    conn: sqlite3.Connection,
    *,
    identity_id: str,
    public_code: str,
    assignment_id: str,
    app_id: str,
    activity_id: str,
    result_id: str,
    score: int,
    metadata: dict[str, Any],
) -> dict[str, Any]:
    """Guarda un intent. Un `result_id` repetit torna l'intent original."""
    if result_id:
        existing = conn.execute(
            "SELECT id, score, assignment_id FROM scores WHERE identity_id = ? AND assignment_id = ? AND result_id = ?",
            (identity_id, assignment_id, result_id),
        ).fetchone()
        if existing:
            return {
                "ok": True,
                "duplicate": True,
                "id": existing["id"],
                "public_code": public_code,
                "assignment_id": existing["assignment_id"],
                "score": existing["score"],
            }
    score_id = secrets.token_urlsafe(12)
    conn.execute(
        """
        INSERT INTO scores (id, identity_id, assignment_id, app_id, activity_id, score, result_id, metadata_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (score_id, identity_id, assignment_id, app_id, activity_id, score, result_id, json.dumps(metadata), iso_now()),
    )
    return {
        "ok": True,
        "id": score_id,
        "public_code": public_code,
        "assignment_id": assignment_id,
        "score": score,
    }


@router.post("/api/scores", status_code=201)
def add_score(payload: ScoreIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    identity = c.auth.require_student(request)
    app_id = normalize_app_id(payload.app_id)
    activity_id = normalize_activity_id(payload.activity_id)
    assignment_id = (payload.assignment_id or "").strip()
    with c.connect() as conn:
        if assignment_id:
            check_assignment(conn, assignment_id, app_id, activity_id, identity["group_id"])
        return record_score(
            conn,
            identity_id=identity["id"],
            public_code=identity["public_code"],
            assignment_id=assignment_id,
            app_id=app_id,
            activity_id=activity_id,
            result_id=(payload.result_id or "").strip(),
            score=payload.score,
            metadata=payload.metadata,
        )


@router.post("/api/apps/{app_id}/scores", status_code=201)
def add_app_score(app_id: str, payload: AppScoreIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    app_key = normalize_app_id(app_id)
    c.auth.require_app_token(request, app_key)
    activity_id = normalize_activity_id(payload.activity_id)
    assignment_id = (payload.assignment_id or "").strip()
    with c.connect() as conn:
        identity = conn.execute(
            """
            SELECT i.*, g.created_by_teacher_id
            FROM student_identities i
            JOIN groups g ON g.id = i.group_id
            WHERE i.id = ? AND i.active = 1
            """,
            (payload.identity_id,),
        ).fetchone()
        if not identity:
            raise HTTPException(status_code=404, detail="identity not found")
        if assignment_id:
            check_assignment(conn, assignment_id, app_key, activity_id, identity["group_id"])
        else:
            # Sense assignació explícita s'associa a la més recent de l'aula.
            assignment = conn.execute(
                """
                SELECT id
                FROM activity_assignments
                WHERE app_id = ?
                  AND activity_id = ?
                  AND group_id = ?
                  AND active = 1
                ORDER BY created_at DESC
                LIMIT 1
                """,
                (app_key, activity_id, identity["group_id"]),
            ).fetchone()
            assignment_id = assignment["id"] if assignment else ""
        return record_score(
            conn,
            identity_id=identity["id"],
            public_code=identity["public_code"],
            assignment_id=assignment_id,
            app_id=app_key,
            activity_id=activity_id,
            result_id=(payload.result_id or "").strip(),
            score=payload.score,
            metadata=payload.metadata,
        )


@router.post("/api/apps/{app_id}/launch-tokens/consume")
def consume_app_launch_token(app_id: str, payload: ConsumeLaunchTokenIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    app_key = normalize_app_id(app_id)
    c.auth.require_app_token(request, app_key)
    token = (payload.token or "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="invalid launch token")
    ts_dt = now_utc()
    with c.connect() as conn:
        row = conn.execute(
            """
            SELECT
                t.*,
                i.group_id,
                i.public_code,
                i.avatar_icon,
                i.active
            FROM app_launch_tokens t
            JOIN student_identities i ON i.id = t.identity_id
            WHERE t.token_hash = ?
            """,
            (hash_token(token),),
        ).fetchone()
        expires_at = datetime.fromisoformat(row["expires_at"]) if row else ts_dt
        if (
            not row
            or row["app_id"] != app_key
            or row["consumed_at"]
            or expires_at <= ts_dt
            or not row["active"]
        ):
            raise HTTPException(status_code=401, detail="invalid launch token")
        conn.execute(
            "UPDATE app_launch_tokens SET consumed_at = ? WHERE id = ?",
            (ts_dt.isoformat(), row["id"]),
        )
    return {
        "identity": {
            "id": row["identity_id"],
            "group_id": row["group_id"],
            "public_code": row["public_code"],
            "avatar_icon": row["avatar_icon"],
            "active": bool(row["active"]),
        },
        "assignment": {
            "id": row["assignment_id"],
            "app_id": row["app_id"],
            "activity_id": row["activity_id"],
        },
    }


@router.get("/api/rankings")
def rankings(
    request: Request,
    app_id: str = Query(...),
    activity_id: str = Query(...),
    limit: int = Query(10, ge=1, le=100),
    c: Commons = Depends(commons),
) -> list[dict[str, Any]]:
    c.auth.require_ranking_viewer(request)
    app_key = normalize_app_id(app_id)
    activity_key = re.sub(r"[^a-z0-9_.:-]+", "-", activity_id.lower()).strip("-")[:128]
    with c.connect() as conn:
        rows = conn.execute(
            """
            SELECT i.public_code, s.score, s.created_at
            FROM scores s
            JOIN student_identities i ON i.id = s.identity_id
            WHERE s.app_id = ? AND s.activity_id = ? AND i.active = 1
            ORDER BY s.score DESC, s.created_at ASC
            LIMIT ?
            """,
            (app_key, activity_key, limit),
        ).fetchall()
    return [{"public_code": r["public_code"], "score": r["score"], "ts": r["created_at"]} for r in rows]


@router.post("/api/apps/{app_id}/roster")
def app_roster(app_id: str, payload: AppRosterIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    app_key = normalize_app_id(app_id)
    with c.connect() as conn:
        accessible_group(conn, payload.group_id, teacher_id)
        rows = conn.execute(
            """
            SELECT id, public_code, avatar_icon FROM student_identities
            WHERE group_id = ? AND active = 1
            ORDER BY public_code
            """,
            (payload.group_id,),
        ).fetchall()
    identities = [
        {
            "identity_id": row["id"],
            "public_code": row["public_code"],
            "avatar_icon": row["avatar_icon"],
            "app_user": f"{app_key}-{row['public_code'].lower()}",
        }
        for row in rows
    ]
    return {"app_id": app_key, "group_id": payload.group_id, "identities": identities}
