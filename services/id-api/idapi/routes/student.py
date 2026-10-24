"""Tauler de l'alumnat: perfil, activitats assignades i llançament."""

from __future__ import annotations

import secrets
from datetime import datetime, timedelta
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Response

from ..context import Commons, commons
from ..db import iso_now, now_utc
from ..models import LaunchTokenIn, StudentProfileIn, public_assignment, public_identity
from ..security import LAUNCH_TOKEN_TTL_SECONDS, hash_token

router = APIRouter()


@router.patch("/api/student/profile")
def update_student_profile(payload: StudentProfileIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    identity = c.auth.require_student(request)
    with c.connect() as conn:
        conn.execute(
            """
            UPDATE student_identities
            SET avatar_icon = ?, updated_at = ?
            WHERE id = ? AND active = 1
            """,
            (payload.avatar_icon, iso_now(), identity["id"]),
        )
        row = conn.execute(
            "SELECT * FROM student_identities WHERE id = ? AND active = 1",
            (identity["id"],),
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="identity not found")
    return {"identity": public_identity(row)}


@router.get("/api/student/dashboard")
def student_dashboard(request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    identity = c.auth.require_student(request)
    with c.connect() as conn:
        selected = conn.execute(
            """SELECT i.id, i.title FROM group_itinerary_selection s
            JOIN itineraries i ON i.id = s.itinerary_id AND i.group_id = s.group_id AND i.active = 1
            WHERE s.group_id = ?""",
            (identity["group_id"],),
        ).fetchone()
        rows = conn.execute(
            """
            SELECT
                a.*,
                COUNT(s.id) AS attempts,
                MAX(s.score) AS best_score,
                MAX(s.created_at) AS last_score_at,
                (SELECT ii.position FROM itinerary_items ii
                 WHERE ii.assignment_id = a.id AND ii.itinerary_id = ?
                 LIMIT 1) AS itinerary_position,
                EXISTS(
                    SELECT 1 FROM app_launch_tokens t
                    WHERE t.assignment_id = a.id AND t.identity_id = ?
                ) AS started,
                EXISTS(
                    SELECT 1 FROM manual_completions m
                    WHERE m.assignment_id = a.id AND m.identity_id = ?
                ) AS manual_completed
            FROM activity_assignments a
            LEFT JOIN scores s
                ON s.assignment_id = a.id
               AND s.identity_id = ?
            WHERE a.group_id = ?
              AND a.active = 1
            GROUP BY a.id
            ORDER BY itinerary_position IS NULL, itinerary_position,
                     a.created_at DESC, a.title, a.app_id, a.activity_id
            """,
            (selected["id"] if selected else None, identity["id"], identity["id"], identity["id"], identity["group_id"]),
        ).fetchall()
    return {
        "identity": identity,
        "selected_itinerary": dict(selected) if selected else None,
        "assignments": [
            {
                **public_assignment(row),
                "attempts": int(row["attempts"] or 0),
                "best_score": row["best_score"],
                "last_score_at": row["last_score_at"],
                "completed": int(row["attempts"] or 0) > 0 or bool(row["manual_completed"]),
                "started": bool(row["started"]),
                "itinerary_position": row["itinerary_position"],
            }
            for row in rows
        ],
    }


@router.post("/api/student/launch-token", status_code=201)
def create_student_launch_token(payload: LaunchTokenIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    identity = c.auth.require_student(request)
    assignment_id = (payload.assignment_id or "").strip()
    token = secrets.token_urlsafe(32)
    launch_id = secrets.token_urlsafe(14)
    created_at = now_utc()
    expires_at = created_at + timedelta(seconds=LAUNCH_TOKEN_TTL_SECONDS)
    with c.connect() as conn:
        assignment = conn.execute(
            """
            SELECT *
            FROM activity_assignments
            WHERE id = ?
              AND group_id = ?
              AND active = 1
            """,
            (assignment_id, identity["group_id"]),
        ).fetchone()
        if not assignment:
            raise HTTPException(status_code=404, detail="assignment not found")
        conn.execute(
            """
            INSERT INTO app_launch_tokens
                (id, token_hash, identity_id, assignment_id, app_id, activity_id, created_at, expires_at, consumed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)
            """,
            (
                launch_id,
                hash_token(token),
                identity["id"],
                assignment["id"],
                assignment["app_id"],
                assignment["activity_id"],
                created_at.isoformat(),
                expires_at.isoformat(),
            ),
        )
    return {
        "token": token,
        "expires_at": expires_at.isoformat(),
        "assignment": public_assignment(assignment),
    }


@router.get("/api/student/activity-assignments/{assignment_id}/resource")
def student_document_resource(assignment_id: str, launch_token: str, request: Request, c: Commons = Depends(commons)) -> Response:
    """Intermediari de documents: exigix sessió d'alumne, assignació i testimoni de llançament."""
    identity = c.auth.require_student(request)
    token_hash = hash_token((launch_token or "").strip())
    now = now_utc()
    with c.connect() as conn:
        row = conn.execute(
            """
            SELECT t.*, a.group_id, a.active AS assignment_active, i.active AS identity_active
            FROM app_launch_tokens t
            JOIN activity_assignments a ON a.id = t.assignment_id
            JOIN student_identities i ON i.id = t.identity_id
            WHERE t.token_hash = ? AND t.assignment_id = ?
            """,
            (token_hash, assignment_id),
        ).fetchone()
    expires_at = datetime.fromisoformat(row["expires_at"]) if row else now
    if (
        not row
        or row["identity_id"] != identity["id"]
        or row["app_id"] != "resource"
        or not row["activity_id"].startswith("teacher-upload:")
        or row["consumed_at"]
        or expires_at <= now
        or not row["assignment_active"]
        or not row["identity_active"]
        or row["group_id"] != identity["group_id"]
    ):
        raise HTTPException(status_code=401, detail="invalid launch token")

    document_id = row["activity_id"][len("teacher-upload:"):]
    try:
        upstream = httpx.get(
            f"{c.settings.resources_api_url}/api/documents/{document_id}/download",
            headers={"Authorization": f"Bearer {c.settings.token_for_app('recursos')}"},
            timeout=30,
        )
    except httpx.HTTPError as exc:
        c.logger.exception("resources document proxy failed")
        raise HTTPException(status_code=502, detail="document service unavailable") from exc
    if upstream.status_code == 404:
        raise HTTPException(status_code=404, detail="document not found")
    if upstream.status_code >= 400:
        raise HTTPException(status_code=502, detail="document service rejected the request")
    with c.connect() as conn:
        conn.execute(
            "UPDATE app_launch_tokens SET consumed_at = ? WHERE id = ?",
            (now.isoformat(), row["id"]),
        )
    return Response(
        content=upstream.content,
        media_type=upstream.headers.get("content-type", "application/octet-stream"),
        headers={
            "Content-Disposition": upstream.headers.get("content-disposition", "inline"),
            "Cache-Control": "private, no-store",
        },
    )
