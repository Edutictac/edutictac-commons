"""Itineraris d'aula: ordre de passos i recorregut actiu del grup."""

from __future__ import annotations

import secrets
import sqlite3
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request

from ..context import Commons, commons
from ..access import member_of, teacher_params
from ..db import iso_now
from ..models import (
    GroupItineraryIn,
    ItineraryIn,
    ItineraryItemIn,
    ItineraryItemsIn,
    public_itinerary,
)

router = APIRouter()


def teacher_itinerary(conn: sqlite3.Connection, itinerary_id: str, teacher_id: str) -> sqlite3.Row:
    itinerary = conn.execute(
        f"""SELECT i.* FROM itineraries i JOIN groups g ON g.id = i.group_id
        WHERE i.id = ? AND i.active = 1 AND {member_of("i.group_id")}""",
        (itinerary_id, *teacher_params(teacher_id)),
    ).fetchone()
    if not itinerary:
        raise HTTPException(status_code=404, detail="itinerary not found")
    return itinerary


def itinerary_items(conn: sqlite3.Connection, itinerary_id: str) -> list[sqlite3.Row]:
    return conn.execute(
        "SELECT assignment_id, position FROM itinerary_items WHERE itinerary_id = ? ORDER BY position, assignment_id",
        (itinerary_id,),
    ).fetchall()


def is_selected(conn: sqlite3.Connection, group_id: str, itinerary_id: str) -> bool:
    return conn.execute(
        "SELECT 1 FROM group_itinerary_selection WHERE group_id = ? AND itinerary_id = ?",
        (group_id, itinerary_id),
    ).fetchone() is not None


@router.post("/api/teacher/itineraries", status_code=201)
def create_itinerary(payload: ItineraryIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_group_access(request, payload.group_id)
    itinerary_id = secrets.token_urlsafe(12)
    ts = iso_now()
    with c.connect() as conn:
        conn.execute(
            """
            INSERT INTO itineraries (id, title, group_id, created_by_teacher_id, active, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, ?, ?)
            """,
            (itinerary_id, payload.title.strip(), payload.group_id, teacher_id, ts, ts),
        )
        conn.execute(
            "INSERT OR IGNORE INTO group_itinerary_selection (group_id, itinerary_id) VALUES (?, ?)",
            (payload.group_id, itinerary_id),
        )
        selected = conn.execute(
            "SELECT itinerary_id FROM group_itinerary_selection WHERE group_id = ?", (payload.group_id,)
        ).fetchone()
        row = conn.execute("SELECT * FROM itineraries WHERE id = ?", (itinerary_id,)).fetchone()
    return {"itinerary": public_itinerary(row, selected=selected["itinerary_id"] == itinerary_id)}


@router.get("/api/teacher/itineraries")
def teacher_itineraries(request: Request, group_id: str = "", c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    params: list[Any] = [*teacher_params(teacher_id)]
    where = f"WHERE i.active = 1 AND {member_of('i.group_id')}"
    if group_id:
        where += " AND i.group_id = ?"
        params.append(group_id)
    with c.connect() as conn:
        rows = conn.execute(
            f"""SELECT i.*, s.itinerary_id AS selected_id FROM itineraries i
            JOIN groups g ON g.id = i.group_id
            LEFT JOIN group_itinerary_selection s ON s.group_id = i.group_id
            {where} ORDER BY i.updated_at DESC, i.title""",
            params,
        ).fetchall()
        result = [
            public_itinerary(row, itinerary_items(conn, row["id"]), selected=row["selected_id"] == row["id"])
            for row in rows
        ]
    return {"itineraries": result}


@router.put("/api/teacher/groups/{group_id}/itinerary")
def select_group_itinerary(group_id: str, payload: GroupItineraryIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    c.auth.require_group_access(request, group_id)
    with c.connect() as conn:
        conn.execute("BEGIN IMMEDIATE")
        # L'administració pot saltar-se la propietat, però el grup ha d'existir.
        if not conn.execute("SELECT 1 FROM groups WHERE id = ?", (group_id,)).fetchone():
            raise HTTPException(status_code=404, detail="group not found")
        current = conn.execute(
            """SELECT i.id AS itinerary_id FROM group_itinerary_selection s
            JOIN itineraries i ON i.id = s.itinerary_id AND i.group_id = s.group_id AND i.active = 1
            WHERE s.group_id = ?""", (group_id,)
        ).fetchone()
        if (current["itinerary_id"] if current else None) != payload.expected_itinerary_id:
            raise HTTPException(status_code=409, detail="itinerary selection changed; reload before editing")
        if payload.itinerary_id is not None and not conn.execute(
            "SELECT 1 FROM itineraries WHERE id = ? AND group_id = ? AND active = 1",
            (payload.itinerary_id, group_id),
        ).fetchone():
            raise HTTPException(status_code=404, detail="itinerary not found")
        conn.execute(
            """INSERT INTO group_itinerary_selection (group_id, itinerary_id) VALUES (?, ?)
            ON CONFLICT(group_id) DO UPDATE SET itinerary_id = excluded.itinerary_id""",
            (group_id, payload.itinerary_id),
        )
    return {"selected_itinerary_id": payload.itinerary_id}


@router.post("/api/teacher/itineraries/{itinerary_id}/items", status_code=201)
def add_itinerary_item(itinerary_id: str, payload: ItineraryItemIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    ts = iso_now()
    with c.connect() as conn:
        itinerary = teacher_itinerary(conn, itinerary_id, teacher_id)
        assignment = conn.execute(
            "SELECT id FROM activity_assignments WHERE id = ? AND group_id = ? AND active = 1",
            (payload.assignment_id, itinerary["group_id"]),
        ).fetchone()
        if not assignment:
            raise HTTPException(status_code=404, detail="assignment not found")
        conn.execute(
            """INSERT INTO itinerary_items (itinerary_id, assignment_id, position, created_at)
            VALUES (?, ?, ?, ?) ON CONFLICT(itinerary_id, assignment_id)
            DO UPDATE SET position = excluded.position""",
            (itinerary_id, payload.assignment_id, payload.position, ts),
        )
        conn.execute("UPDATE itineraries SET updated_at = ? WHERE id = ?", (ts, itinerary_id))
        items = itinerary_items(conn, itinerary_id)
        selected = is_selected(conn, itinerary["group_id"], itinerary_id)
    return {"itinerary": public_itinerary(itinerary, items, selected=selected)}


@router.put("/api/teacher/itineraries/{itinerary_id}/items")
def replace_itinerary_items(itinerary_id: str, payload: ItineraryItemsIn, request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    teacher_id = c.auth.require_teacher(request)
    with c.connect() as conn:
        # Bloqueja abans de llegir: dos col·laboradors no poden trepitjar-se els canvis.
        conn.execute("BEGIN IMMEDIATE")
        itinerary = teacher_itinerary(conn, itinerary_id, teacher_id)
        current = itinerary_items(conn, itinerary_id)
        if [row["assignment_id"] for row in current] != payload.expected_assignment_ids:
            raise HTTPException(status_code=409, detail="itinerary changed; reload before editing")
        for assignment_id in payload.assignment_ids:
            if not conn.execute(
                "SELECT 1 FROM activity_assignments WHERE id = ? AND group_id = ? AND active = 1",
                (assignment_id, itinerary["group_id"]),
            ).fetchone():
                raise HTTPException(status_code=404, detail="assignment not found")
        ts = iso_now()
        # Només canvien els enllaços de l'itinerari; assignacions, puntuacions i progrés es conserven.
        conn.execute("DELETE FROM itinerary_items WHERE itinerary_id = ?", (itinerary_id,))
        conn.executemany(
            "INSERT INTO itinerary_items (itinerary_id, assignment_id, position, created_at) VALUES (?, ?, ?, ?)",
            [(itinerary_id, assignment_id, position, ts) for position, assignment_id in enumerate(payload.assignment_ids)],
        )
        conn.execute("UPDATE itineraries SET updated_at = ? WHERE id = ?", (ts, itinerary_id))
        row = conn.execute("SELECT * FROM itineraries WHERE id = ?", (itinerary_id,)).fetchone()
        items = itinerary_items(conn, itinerary_id)
        selected = is_selected(conn, row["group_id"], itinerary_id)
    return {"itinerary": public_itinerary(row, items, selected=selected)}
