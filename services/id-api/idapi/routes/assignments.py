"""Activitats assignades a una aula, resultats i finalització manual."""

from __future__ import annotations

import csv
import io
import secrets
import sqlite3
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import PlainTextResponse

from ..context import Commons, commons
from ..access import member_of, teacher_params
from ..db import iso_now
from ..models import (
    ActivityAssignmentIn,
    normalize_activity_id,
    normalize_app_id,
    normalize_launch_url,
    public_assignment,
)

router = APIRouter()


def teacher_assignment(conn: sqlite3.Connection, assignment_id: str, teacher_id: str) -> sqlite3.Row:
    """Assignació activa d'una aula on el docent és propietari o col·laborador."""
    assignment = conn.execute(
        f"""
        SELECT a.* FROM activity_assignments a
        WHERE a.id = ? AND a.active = 1 AND {member_of("a.group_id", "a.created_by_teacher_id")}
        """,
        (assignment_id, *teacher_params(teacher_id)),
    ).fetchone()
    if not assignment:
        raise HTTPException(status_code=404, detail="assignment not found")
    return assignment


@router.post("/api/teacher/activity-assignments", status_code=201)
def create_activity_assignment(payload: ActivityAssignmentIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    app_id = normalize_app_id(payload.app_id)
    activity_id = normalize_activity_id(payload.activity_id)
    title = (payload.title or "").strip()[:160]
    launch_url = normalize_launch_url(payload.launch_url)
    assignment_id = secrets.token_urlsafe(14)
    ts = iso_now()
    with c.connect() as conn:
        group = conn.execute(
            f"SELECT g.id FROM groups g WHERE g.id = ? AND {member_of('g.id')}",
            (payload.group_id, *teacher_params(teacher_id)),
        ).fetchone()
        if not group and not c.auth.is_oidc_admin(request):
            raise HTTPException(status_code=404, detail="group not found")
        conn.execute(
            """
            INSERT INTO activity_assignments
                (id, app_id, activity_id, title, launch_url, group_id, created_by_teacher_id, active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
            """,
            (assignment_id, app_id, activity_id, title, launch_url, payload.group_id, teacher_id, ts, ts),
        )
        row = conn.execute(
            "SELECT * FROM activity_assignments WHERE id = ?",
            (assignment_id,),
        ).fetchone()
    return {"assignment": public_assignment(row)}


@router.get("/api/teacher/activity-assignments")
def teacher_activity_assignments(
    request: Request,
    group_id: str = "",
    limit: int = Query(100, ge=1, le=500),
    c: Commons = Depends(commons),
) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    params: list[Any] = [*teacher_params(teacher_id)]
    where = f"WHERE active = 1 AND {member_of('a.group_id', 'a.created_by_teacher_id')}"
    if group_id:
        where += " AND group_id = ?"
        params.append(group_id)
    params.append(limit)
    with c.connect() as conn:
        rows = conn.execute(
            f"""
            SELECT a.* FROM activity_assignments a
            {where}
            ORDER BY created_at DESC, title, app_id, activity_id
            LIMIT ?
            """,
            params,
        ).fetchall()
    return {"assignments": [public_assignment(row) for row in rows]}


@router.get("/api/teacher/activity-assignments/{assignment_id}/results")
def teacher_activity_assignment_results(assignment_id: str, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    with c.connect() as conn:
        assignment = teacher_assignment(conn, assignment_id, teacher_id)
        rows = conn.execute(
            """
            SELECT
                i.id AS identity_id,
                i.public_code,
                COUNT(s.id) AS attempts,
                MAX(s.score) AS best_score,
                MAX(s.created_at) AS last_score_at,
                EXISTS(
                    SELECT 1 FROM manual_completions m
                    WHERE m.assignment_id = ? AND m.identity_id = i.id
                ) AS manual_completed
            FROM student_identities i
            LEFT JOIN scores s
                ON s.assignment_id = ?
               AND s.identity_id = i.id
            WHERE i.group_id = ? AND i.active = 1
            GROUP BY i.id
            ORDER BY best_score DESC, last_score_at DESC, i.public_code
            """,
            (assignment_id, assignment_id, assignment["group_id"]),
        ).fetchall()
    return {
        "assignment": public_assignment(assignment),
        "results": [
            {
                "identity_id": row["identity_id"],
                "public_code": row["public_code"],
                "attempts": int(row["attempts"] or 0),
                "best_score": row["best_score"],
                "last_score_at": row["last_score_at"],
                "completed": int(row["attempts"] or 0) > 0 or bool(row["manual_completed"]),
            }
            for row in rows
        ],
    }


@router.post("/api/teacher/activity-assignments/{assignment_id}/students/{identity_id}/complete", status_code=201)
def mark_assignment_completed(assignment_id: str, identity_id: str, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    with c.connect() as conn:
        assignment = teacher_assignment(conn, assignment_id, teacher_id)
        identity = conn.execute(
            "SELECT id FROM student_identities WHERE id = ? AND group_id = ? AND active = 1",
            (identity_id, assignment["group_id"]),
        ).fetchone()
        if not identity:
            raise HTTPException(status_code=404, detail="identity not found")
        conn.execute(
            """
            INSERT OR IGNORE INTO manual_completions (id, assignment_id, identity_id, teacher_id, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (secrets.token_urlsafe(14), assignment_id, identity_id, teacher_id, iso_now()),
        )
    return {"completed": True}


@router.delete("/api/teacher/activity-assignments/{assignment_id}/students/{identity_id}/complete")
def unmark_assignment_completed(assignment_id: str, identity_id: str, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    with c.connect() as conn:
        teacher_assignment(conn, assignment_id, teacher_id)
        conn.execute(
            "DELETE FROM manual_completions WHERE assignment_id = ? AND identity_id = ?",
            (assignment_id, identity_id),
        )
    return {"completed": False}


@router.get("/api/teacher/stats.csv", response_class=PlainTextResponse)
def teacher_stats_csv(request: Request, group_id: str | None = None, c: Commons = Depends(commons)) -> str:
    teacher_id = c.auth.require_teacher(request)
    out = io.StringIO()
    writer = csv.writer(out)
    writer.writerow(["group_code", "public_code", "app_id", "activity_id", "attempts", "best_score", "last_score_at"])
    params: list[Any] = [*teacher_params(teacher_id)]
    where = f"WHERE i.active = 1 AND {member_of('g.id')}"
    if group_id:
        where += " AND i.group_id = ?"
        params.append(group_id)
    with c.connect() as conn:
        rows = conn.execute(
            f"""
            SELECT g.name AS group_code, i.public_code, s.app_id, s.activity_id,
                   COUNT(s.id) AS attempts, MAX(s.score) AS best_score, MAX(s.created_at) AS last_score_at
            FROM student_identities i
            JOIN groups g ON g.id = i.group_id
            LEFT JOIN scores s ON s.identity_id = i.id
            {where}
            GROUP BY g.name, i.public_code, s.app_id, s.activity_id
            ORDER BY g.name, i.public_code, s.app_id, s.activity_id
            """,
            params,
        ).fetchall()
    for row in rows:
        writer.writerow(
            [
                row["group_code"],
                row["public_code"],
                row["app_id"] or "",
                row["activity_id"] or "",
                row["attempts"],
                row["best_score"] if row["best_score"] is not None else "",
                row["last_score_at"] or "",
            ]
        )
    return out.getvalue()
