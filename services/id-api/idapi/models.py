"""Models d'entrada, normalització d'identificadors i representació pública."""

from __future__ import annotations

import re
import sqlite3
from typing import Any
from urllib.parse import urlparse

from fastapi import HTTPException
from pydantic import BaseModel, Field, field_validator

from .security import TEACHER_ID_RE

IDENTITY_ICONS = {
    "🦊", "🐱", "🐶", "🐼", "🐧", "🐸", "🦉", "🦄", "🐰", "🐢",
    "🐙", "🦁", "🐨", "🐝", "🐯", "🐻", "🦕", "🦖", "🐉", "🚀",
    "🌈", "⚽️", "🏀", "🏆", "🎮", "🎧", "📚", "🎨",
}


class TeacherLoginIn(BaseModel):
    token: str


class SetupActivationIn(BaseModel):
    code: str = Field(min_length=8, max_length=64)


class GroupIn(BaseModel):
    tenant_id: str = "default"

    @field_validator("tenant_id")
    @classmethod
    def _tenant(cls, value: str) -> str:
        tenant = re.sub(r"[^a-z0-9_-]+", "-", (value or "default").lower()).strip("-")
        return tenant[:48] or "default"


class GroupMemberIn(BaseModel):
    teacher_id: str = Field(min_length=3, max_length=128)
    role: str = "teacher"

    @field_validator("teacher_id")
    @classmethod
    def _teacher_id(cls, value: str) -> str:
        value = (value or "").strip()
        if not TEACHER_ID_RE.fullmatch(value):
            raise ValueError("invalid teacher_id")
        return value

    @field_validator("role")
    @classmethod
    def _role(cls, value: str) -> str:
        # La propietat només canvia per traspàs: una aula té un sol propietari.
        value = (value or "teacher").strip().lower()
        if value != "teacher":
            raise ValueError("role must be teacher; transfer ownership instead")
        return value


class GroupOwnerIn(BaseModel):
    teacher_id: str = Field(min_length=3, max_length=128)
    expected_owner_id: str = Field(max_length=128)

    @field_validator("teacher_id")
    @classmethod
    def _teacher_id(cls, value: str) -> str:
        value = (value or "").strip()
        if not TEACHER_ID_RE.fullmatch(value):
            raise ValueError("invalid teacher_id")
        return value


class BatchIn(GroupIn):
    count: int = Field(ge=1, le=120)
    pin_length: int = 4


class AddIdentitiesIn(BaseModel):
    count: int = Field(ge=1, le=120)
    pin_length: int = 4


class StudentAuthIn(BaseModel):
    group_id: str = ""
    public_code: str
    pin: str


class StudentProfileIn(BaseModel):
    avatar_icon: str = ""

    @field_validator("avatar_icon")
    @classmethod
    def _avatar_icon(cls, value: str) -> str:
        icon = (value or "").strip()
        if icon and icon not in IDENTITY_ICONS:
            raise ValueError("invalid avatar icon")
        return icon


class ScoreIn(BaseModel):
    app_id: str
    activity_id: str
    assignment_id: str = ""
    result_id: str = Field(default="", max_length=512)
    score: int
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("score")
    @classmethod
    def _score(cls, value: int) -> int:
        if value < 0 or value > 1_000_000:
            raise ValueError("score out of range")
        return value


class AppScoreIn(BaseModel):
    identity_id: str
    activity_id: str
    assignment_id: str = ""
    result_id: str = Field(default="", max_length=512)
    score: int
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("score")
    @classmethod
    def _score(cls, value: int) -> int:
        if value < 0 or value > 1_000_000:
            raise ValueError("score out of range")
        return value


class LaunchTokenIn(BaseModel):
    assignment_id: str


class ConsumeLaunchTokenIn(BaseModel):
    token: str


class AppRosterIn(BaseModel):
    group_id: str


class ActivityAssignmentIn(BaseModel):
    group_id: str
    app_id: str
    activity_id: str
    title: str = ""
    launch_url: str = Field(default="", max_length=2048)


class ItineraryIn(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    group_id: str = Field(min_length=1, max_length=128)

    @field_validator("title")
    @classmethod
    def _title(cls, value: str) -> str:
        title = value.strip()
        if not title:
            raise ValueError("itinerary title must not be blank")
        return title


class ItineraryItemIn(BaseModel):
    assignment_id: str = Field(min_length=1, max_length=128)
    position: int = Field(default=0, ge=0, le=10000)


class ItineraryItemsIn(BaseModel):
    assignment_ids: list[str] = Field(max_length=1000)
    expected_assignment_ids: list[str] = Field(max_length=1000)

    @field_validator("assignment_ids", "expected_assignment_ids")
    @classmethod
    def _unique_assignments(cls, value: list[str]) -> list[str]:
        if len(value) != len(set(value)) or any(not item or len(item) > 128 for item in value):
            raise ValueError("assignment IDs must be unique and non-empty")
        return value


class GroupItineraryIn(BaseModel):
    itinerary_id: str | None = Field(max_length=128)
    expected_itinerary_id: str | None = Field(max_length=128)


def normalize_app_id(raw: str) -> str:
    app_id = re.sub(r"[^a-z0-9_-]+", "-", (raw or "").lower()).strip("-")[:64]
    if not app_id:
        raise HTTPException(status_code=400, detail="invalid app_id")
    return app_id


def normalize_activity_id(raw: str) -> str:
    activity_id = re.sub(r"[^a-z0-9_.:-]+", "-", (raw or "").lower()).strip("-")[:128]
    if not activity_id:
        raise HTTPException(status_code=400, detail="invalid activity_id")
    return activity_id


def normalize_launch_url(raw: str) -> str:
    launch_url = (raw or "").strip()
    if not launch_url:
        return ""
    parsed = urlparse(launch_url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise HTTPException(status_code=400, detail="invalid launch_url")
    return launch_url


def public_identity(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "group_id": row["group_id"],
        "public_code": row["public_code"],
        "avatar_icon": row["avatar_icon"],
        "active": bool(row["active"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def public_assignment(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "app_id": row["app_id"],
        "activity_id": row["activity_id"],
        "title": row["title"],
        "launch_url": row["launch_url"] if "launch_url" in row.keys() else "",
        "group_id": row["group_id"],
        "created_by_teacher_id": row["created_by_teacher_id"],
        "active": bool(row["active"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def public_itinerary(row: sqlite3.Row, items: list[sqlite3.Row] | None = None, *, selected: bool = False) -> dict[str, Any]:
    return {
        "id": row["id"],
        "title": row["title"],
        "group_id": row["group_id"],
        "created_by_teacher_id": row["created_by_teacher_id"],
        "active": bool(row["active"]),
        "is_selected": selected,
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "items": [
            {"assignment_id": item["assignment_id"], "position": item["position"]}
            for item in (items or [])
        ],
    }


def public_teacher_identity(row: sqlite3.Row) -> dict[str, Any]:
    """Credencial vista pel docent: mai inclou el PIN ni el seu resum."""
    return {
        "id": row["id"],
        "public_code": row["public_code"],
        "active": bool(row["active"]),
        "created_at": row["created_at"],
        "pin_rotated_at": row["pin_rotated_at"],
        "group_id": row["group_id"],
        "group_name": row["group_name"],
        "tenant_id": row["tenant_id"],
    }
