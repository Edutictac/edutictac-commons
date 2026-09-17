"""EduTicTac ID API: pseudonymous student credentials.

The service stores no student names, emails or institutional identifiers. A
teacher creates groups and public codes; pupils authenticate with public code +
PIN. PINs are hashed and are only returned immediately after generation or
rotation.
"""

from __future__ import annotations

import csv
import hashlib
import hmac
import logging
import io
import json
import os
import re
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.responses import HTMLResponse, PlainTextResponse, RedirectResponse
from pydantic import BaseModel, Field, field_validator
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware
from edutictac_community.db import connect as db_connect
from edutictac_community.ratelimit import RateLimiter
from edutictac_community.session import SignedSession

DB_PATH = os.environ.get("EDUTICTAC_ID_DB", "/var/lib/edutictac-id-api/id.db")
SESSION_SECRET = os.environ.get("EDUTICTAC_ID_SECRET", "")
TEACHER_TOKEN = os.environ.get("EDUTICTAC_ID_TEACHER_TOKEN", "")
APP_TOKEN = os.environ.get("EDUTICTAC_ID_APP_TOKEN", "")
COOKIE_DOMAIN = os.environ.get("EDUTICTAC_ID_COOKIE_DOMAIN", "")
COOKIE_SECURE = os.environ.get("EDUTICTAC_ID_COOKIE_SECURE", "1") != "0"
SESSION_COOKIE = "edutictac_id"
TEACHER_COOKIE = "edutictac_teacher"
CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
CODE_RE = re.compile(r"^[A-Z2-9]{3}$")
PIN_RE = re.compile(r"^[0-9]{4,6}$")
GROUP_CODE_RE = re.compile(r"^G[A-Z2-9]{5}$")
SESSION_TTL_DAYS = 180
LAUNCH_TOKEN_TTL_SECONDS = 5 * 60
IDENTITY_ICONS = {
    "🦊", "🐱", "🐶", "🐼", "🐧", "🐸", "🦉", "🦄", "🐰", "🐢",
    "🐙", "🦁", "🐨", "🐝", "🐯", "🐻", "🦕", "🦖", "🐉", "🚀",
    "🌈", "⚽️", "🏀", "🏆", "🎮", "🎧", "📚", "🎨",
}
RATE_WINDOW = 60
RATE_MAX = 12
PIN_HASH_ITERATIONS = int(os.environ.get("EDUTICTAC_ID_PIN_HASH_ITERATIONS", "210000"))
OIDC_ISSUER_URL = os.environ.get("EDUTICTAC_ID_OIDC_ISSUER_URL", "").strip().rstrip("/")
OIDC_DISCOVERY_URL = os.environ.get("EDUTICTAC_ID_OIDC_DISCOVERY_URL", "").strip()
OIDC_AUTHORIZATION_URL = os.environ.get("EDUTICTAC_ID_OIDC_AUTHORIZATION_URL", "").strip()
OIDC_CLIENT_ID = os.environ.get("EDUTICTAC_ID_OIDC_CLIENT_ID", "").strip()
OIDC_CLIENT_SECRET = os.environ.get("EDUTICTAC_ID_OIDC_CLIENT_SECRET", "")
OIDC_REDIRECT_URL = os.environ.get("EDUTICTAC_ID_OIDC_REDIRECT_URL", "").strip()
OIDC_SCOPES = os.environ.get("EDUTICTAC_ID_OIDC_SCOPES", "openid profile").strip()
OIDC_ROLE_CLAIM = os.environ.get("EDUTICTAC_ID_OIDC_ROLE_CLAIM", "roles").strip() or "roles"
OIDC_COOKIE = "edutictac_oidc"
OIDC_ROLE_ORDER = ("administrador", "profesor", "alumno")

app = FastAPI(title="EduTicTac ID API")
logger = logging.getLogger("edutictac.id.oidc")

# Authlib uses this short-lived signed session only for the OIDC state/nonce
# exchange. The resulting application session is our own signed cookie below.
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET or "oidc-not-configured",
    session_cookie="edutictac_oidc_state",
    https_only=COOKIE_SECURE,
    same_site="lax",
)

oauth = OAuth()


def oidc_discovery_url() -> str:
    if OIDC_DISCOVERY_URL:
        return OIDC_DISCOVERY_URL
    if not OIDC_ISSUER_URL:
        return ""
    if OIDC_ISSUER_URL.endswith("/.well-known/openid-configuration"):
        return OIDC_ISSUER_URL
    return f"{OIDC_ISSUER_URL}/.well-known/openid-configuration"


if OIDC_ISSUER_URL and OIDC_CLIENT_ID and OIDC_CLIENT_SECRET:
    # In Docker, Authentik may only be reachable through its service name.
    # Keep the issuer and browser authorization endpoint public, but use the
    # private network for token, userinfo and JWKS requests.
    if OIDC_DISCOVERY_URL:
        internal_root = OIDC_DISCOVERY_URL.split("/application/o/", 1)[0]
        public_root = OIDC_ISSUER_URL.split("/application/o/", 1)[0]
        application_path = "/application/o/" + OIDC_ISSUER_URL.split("/application/o/", 1)[1]
        oidc_metadata = {
            "issuer": OIDC_ISSUER_URL + "/",
            "authorization_endpoint": OIDC_AUTHORIZATION_URL or f"{public_root}/application/o/authorize/",
            "token_endpoint": f"{internal_root}/application/o/token/",
            "userinfo_endpoint": f"{internal_root}/application/o/userinfo/",
            "jwks_uri": f"{internal_root}{application_path}/jwks/",
        }
        oauth.register(
            name="authentik",
            client_id=OIDC_CLIENT_ID,
            client_secret=OIDC_CLIENT_SECRET,
            client_kwargs={"scope": OIDC_SCOPES},
            **oidc_metadata,
        )
    else:
        oauth.register(
            name="authentik",
            client_id=OIDC_CLIENT_ID,
            client_secret=OIDC_CLIENT_SECRET,
            server_metadata_url=oidc_discovery_url(),
            authorize_url=OIDC_AUTHORIZATION_URL or None,
            client_kwargs={"scope": OIDC_SCOPES},
        )


def oidc_enabled() -> bool:
    return bool(OIDC_ISSUER_URL and OIDC_CLIENT_ID and OIDC_CLIENT_SECRET and OIDC_REDIRECT_URL)


def oidc_accepted_issuers() -> list[str]:
    accepted = {OIDC_ISSUER_URL, f"{OIDC_ISSUER_URL}/"}
    if OIDC_DISCOVERY_URL:
        accepted.add(f"{OIDC_DISCOVERY_URL.split('/.well-known/', 1)[0].rstrip('/')}/")
    return sorted(value for value in accepted if value)


def normalize_role(value: Any) -> str | None:
    aliases = {
        "admin": "administrador",
        "administrator": "administrador",
        "administrador": "administrador",
        "teacher": "profesor",
        "profesor": "profesor",
        "student": "alumno",
        "alumno": "alumno",
    }
    return aliases.get(str(value).strip().lower())


def oidc_role(claims: dict[str, Any]) -> str:
    raw = claims.get(OIDC_ROLE_CLAIM, [])
    if isinstance(raw, str):
        raw = [part for part in re.split(r"[,\s]+", raw) if part]
    if not isinstance(raw, (list, tuple, set)):
        raw = []
    roles = {role for role in (normalize_role(item) for item in raw) if role}
    for role in OIDC_ROLE_ORDER:
        if role in roles:
            return role
    return "alumno"


def oidc_identity(cookie: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(cookie.get("id", "")),
        "role": str(cookie.get("role", "alumno")),
        "pseudonym": str(cookie.get("pseudonym", "")),
        "provider": "authentik",
    }


def oidc_cookie(request: Request) -> dict[str, Any] | None:
    cookie = parse_cookie(request.cookies.get(OIDC_COOKIE))
    if not cookie or not cookie.get("sub") or not cookie.get("iss"):
        return None
    if not hmac.compare_digest(str(cookie["iss"]), OIDC_ISSUER_URL):
        return None
    return cookie


def set_oidc_cookie(response: Response, claims: dict[str, Any], role: str) -> None:
    # The subject is opaque and provider-scoped. It is enough to correlate
    # Commons records without copying profile data from the identity provider.
    subject = str(claims.get("sub", ""))
    pseudonym = hmac.new(
        SESSION_SECRET.encode(),
        f"{OIDC_ISSUER_URL}:{subject}".encode(),
        hashlib.sha256,
    ).hexdigest()[:20]
    response.set_cookie(
        OIDC_COOKIE,
        make_cookie({
            "oidc": True,
            "iss": OIDC_ISSUER_URL,
            "sub": subject,
            "id": f"oidc:{pseudonym}",
            "pseudonym": pseudonym,
            "role": role,
        }),
        **cookie_kwargs(max_age=SESSION_TTL_DAYS * 24 * 60 * 60),
    )

_rate_limiter = RateLimiter(max_calls=RATE_MAX, window_seconds=RATE_WINDOW)


def get_conn() -> sqlite3.Connection:
    conn = db_connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso_now() -> str:
    return now_utc().isoformat()


def init_db() -> None:
    with get_conn() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS groups (
                id TEXT PRIMARY KEY,
                name TEXT DEFAULT '',
                tenant_id TEXT NOT NULL DEFAULT 'default',
                created_by_teacher_id TEXT DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS student_identities (
                id TEXT PRIMARY KEY,
                group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
                public_code TEXT NOT NULL,
                pin_hash TEXT NOT NULL,
                active INTEGER NOT NULL DEFAULT 1,
                avatar_icon TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                pin_rotated_at TEXT,
                UNIQUE(group_id, public_code)
            );

            CREATE TABLE IF NOT EXISTS student_sessions (
                id TEXT PRIMARY KEY,
                identity_id TEXT NOT NULL REFERENCES student_identities(id) ON DELETE CASCADE,
                token_hash TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                revoked_at TEXT
            );

            CREATE TABLE IF NOT EXISTS scores (
                id TEXT PRIMARY KEY,
                identity_id TEXT NOT NULL REFERENCES student_identities(id) ON DELETE CASCADE,
                assignment_id TEXT DEFAULT '',
                app_id TEXT NOT NULL,
                activity_id TEXT NOT NULL,
                score INTEGER NOT NULL,
                result_id TEXT NOT NULL DEFAULT '',
                metadata_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS activity_assignments (
                id TEXT PRIMARY KEY,
                app_id TEXT NOT NULL,
                activity_id TEXT NOT NULL,
                title TEXT NOT NULL DEFAULT '',
                launch_url TEXT NOT NULL DEFAULT '',
                group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
                created_by_teacher_id TEXT NOT NULL DEFAULT '',
                active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS itineraries (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
                created_by_teacher_id TEXT NOT NULL,
                active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS itinerary_items (
                itinerary_id TEXT NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
                assignment_id TEXT NOT NULL REFERENCES activity_assignments(id) ON DELETE CASCADE,
                position INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                PRIMARY KEY(itinerary_id, assignment_id)
            );

            CREATE TABLE IF NOT EXISTS group_memberships (
                group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
                teacher_id TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'teacher',
                created_at TEXT NOT NULL,
                PRIMARY KEY (group_id, teacher_id)
            );

            CREATE TABLE IF NOT EXISTS app_launch_tokens (
                id TEXT PRIMARY KEY,
                token_hash TEXT NOT NULL UNIQUE,
                identity_id TEXT NOT NULL REFERENCES student_identities(id) ON DELETE CASCADE,
                assignment_id TEXT NOT NULL REFERENCES activity_assignments(id) ON DELETE CASCADE,
                app_id TEXT NOT NULL,
                activity_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                consumed_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_scores_rank
                ON scores(app_id, activity_id, score DESC, created_at ASC);
            CREATE INDEX IF NOT EXISTS idx_assignments_teacher
                ON activity_assignments(created_by_teacher_id, created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_assignments_group
                ON activity_assignments(group_id, active);
            CREATE INDEX IF NOT EXISTS idx_itineraries_group
                ON itineraries(group_id, active, updated_at DESC);
            CREATE INDEX IF NOT EXISTS idx_itinerary_items_order
                ON itinerary_items(itinerary_id, position);
            CREATE INDEX IF NOT EXISTS idx_sessions_identity
                ON student_sessions(identity_id);
            CREATE INDEX IF NOT EXISTS idx_identities_public_code
                ON student_identities(public_code);
            CREATE INDEX IF NOT EXISTS idx_launch_tokens_hash
                ON app_launch_tokens(token_hash);
            """
        )
        identity_columns = {
            row["name"] for row in conn.execute("PRAGMA table_info(student_identities)").fetchall()
        }
        if "avatar_icon" not in identity_columns:
            conn.execute("ALTER TABLE student_identities ADD COLUMN avatar_icon TEXT NOT NULL DEFAULT ''")
        score_columns = {row["name"] for row in conn.execute("PRAGMA table_info(scores)").fetchall()}
        if "assignment_id" not in score_columns:
            conn.execute("ALTER TABLE scores ADD COLUMN assignment_id TEXT DEFAULT ''")
        assignment_columns = {row["name"] for row in conn.execute("PRAGMA table_info(activity_assignments)").fetchall()}
        if "launch_url" not in assignment_columns:
            conn.execute("ALTER TABLE activity_assignments ADD COLUMN launch_url TEXT NOT NULL DEFAULT ''")
        conn.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_scores_assignment
                ON scores(assignment_id, score DESC, created_at ASC)
            """
        )
        conn.execute(
            """
            INSERT OR IGNORE INTO group_memberships (group_id, teacher_id, role, created_at)
            SELECT id, created_by_teacher_id, 'owner', created_at
            FROM groups
            WHERE created_by_teacher_id <> ''
            """
        )
        if "result_id" not in score_columns:
            conn.execute("ALTER TABLE scores ADD COLUMN result_id TEXT NOT NULL DEFAULT ''")
        conn.execute(
            """
            CREATE UNIQUE INDEX IF NOT EXISTS idx_scores_result_unique
                ON scores(identity_id, assignment_id, result_id)
                WHERE result_id <> ''
            """
        )


init_db()


def require_secret() -> None:
    if not SESSION_SECRET:
        raise HTTPException(status_code=503, detail="service secret not configured")


def make_cookie(payload: dict[str, Any]) -> str:
    require_secret()
    return SignedSession(SESSION_SECRET, "").encode(payload)


def parse_cookie(raw: str | None) -> dict[str, Any] | None:
    return SignedSession(SESSION_SECRET, "").decode(raw)


def cookie_kwargs(max_age: int | None = None) -> dict[str, Any]:
    kwargs: dict[str, Any] = {
        "httponly": True,
        "secure": COOKIE_SECURE,
        "samesite": "lax",
        "path": "/",
    }
    if COOKIE_DOMAIN:
        kwargs["domain"] = COOKIE_DOMAIN
    if max_age is not None:
        kwargs["max_age"] = max_age
    return kwargs


def delete_cookie_kwargs() -> dict[str, Any]:
    kwargs: dict[str, Any] = {"path": "/"}
    if COOKIE_DOMAIN:
        kwargs["domain"] = COOKIE_DOMAIN
    return kwargs


def hash_pin(pin: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", pin.encode(), salt.encode(), PIN_HASH_ITERATIONS)
    return f"pbkdf2_sha256${PIN_HASH_ITERATIONS}${salt}${digest.hex()}"


def verify_pin(pin: str, encoded: str) -> bool:
    try:
        algo, iterations_raw, salt, expected = encoded.split("$", 3)
        if algo != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac("sha256", pin.encode(), salt.encode(), int(iterations_raw))
        return hmac.compare_digest(digest.hex(), expected)
    except Exception:
        return False


def normalize_code(raw: str) -> str:
    code = (raw or "").strip().upper()
    if not CODE_RE.fullmatch(code):
        raise HTTPException(status_code=400, detail="invalid public code")
    if any(ch not in CODE_ALPHABET for ch in code):
        raise HTTPException(status_code=400, detail="confusing characters are not allowed")
    return code


def validate_pin(raw: str) -> str:
    pin = (raw or "").strip()
    if not PIN_RE.fullmatch(pin):
        raise HTTPException(status_code=400, detail="invalid PIN")
    return pin


def make_code() -> str:
    return "".join(secrets.choice(CODE_ALPHABET) for _ in range(3))


def make_pin(length: int = 4) -> str:
    if length not in (4, 6):
        raise HTTPException(status_code=400, detail="pin_length must be 4 or 6")
    return "".join(secrets.choice("0123456789") for _ in range(length))


def make_group_code() -> str:
    return "G" + "".join(secrets.choice(CODE_ALPHABET) for _ in range(5))


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


def _client_ip(request: Request) -> str:
    return request.client.host if request.client else "?"


def rate_limited(key: str) -> bool:
    return _rate_limiter(key)


def require_teacher(request: Request) -> str:
    cookie = parse_cookie(request.cookies.get(TEACHER_COOKIE))
    if cookie and cookie.get("teacher"):
        return str(cookie.get("teacher_id") or "teacher")
    oidc = oidc_cookie(request)
    if oidc and oidc.get("role") in {"profesor", "administrador"}:
        return str(oidc.get("id"))
    if not TEACHER_TOKEN:
        raise HTTPException(status_code=503, detail="teacher token not configured")
    auth = request.headers.get("authorization", "")
    if auth.startswith("Bearer ") and hmac.compare_digest(auth[7:].encode(), TEACHER_TOKEN.encode()):
        return "teacher-token"
    raise HTTPException(status_code=401, detail="teacher authentication required")


def require_app_token(request: Request) -> None:
    if not APP_TOKEN:
        raise HTTPException(status_code=503, detail="app token not configured")
    auth = request.headers.get("authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="app token required")
    if not hmac.compare_digest(auth[7:].encode(), APP_TOKEN.encode()):
        raise HTTPException(status_code=403, detail="invalid app token")


def is_teacher(request: Request) -> bool:
    try:
        require_teacher(request)
        return True
    except HTTPException:
        return False


def is_oidc_admin(request: Request) -> bool:
    session = oidc_cookie(request)
    return bool(session and session.get("role") == "administrador")


def require_group_owner(request: Request, group_id: str) -> str:
    teacher_id = require_teacher(request)
    with get_conn() as conn:
        row = conn.execute(
            "SELECT created_by_teacher_id FROM groups WHERE id = ?",
            (group_id,),
        ).fetchone()
    if not row or (row["created_by_teacher_id"] != teacher_id and not is_oidc_admin(request)):
        raise HTTPException(status_code=404, detail="group not found")
    return teacher_id


def require_group_access(request: Request, group_id: str) -> str:
    teacher_id = require_teacher(request)
    with get_conn() as conn:
        row = conn.execute(
            """
            SELECT g.id
            FROM groups g
            WHERE g.id = ?
              AND (g.created_by_teacher_id = ? OR EXISTS (
                  SELECT 1 FROM group_memberships m
                  WHERE m.group_id = g.id AND m.teacher_id = ?
              ))
            """,
            (group_id, teacher_id, teacher_id),
        ).fetchone()
    if not row and not is_oidc_admin(request):
        raise HTTPException(status_code=404, detail="group not found")
    return teacher_id


def current_identity(request: Request) -> dict[str, Any] | None:
    cookie = parse_cookie(request.cookies.get(SESSION_COOKIE))
    if not cookie or not cookie.get("sid"):
        return None
    token_hash = hashlib.sha256(str(cookie["sid"]).encode()).hexdigest()
    with get_conn() as conn:
        row = conn.execute(
            """
            SELECT i.* FROM student_sessions s
            JOIN student_identities i ON i.id = s.identity_id
            WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ? AND i.active = 1
            """,
            (token_hash, iso_now()),
        ).fetchone()
    return public_identity(row) if row else None


def require_ranking_viewer(request: Request) -> dict[str, Any] | None:
    identity = current_identity(request)
    if identity:
        return identity
    if is_teacher(request):
        return None
    raise HTTPException(status_code=401, detail="student or teacher authentication required")


def set_student_session(response: Response, identity_id: str) -> str:
    session_token = secrets.token_urlsafe(32)
    session_id = secrets.token_urlsafe(18)
    token_hash = hashlib.sha256(session_token.encode()).hexdigest()
    created_at = now_utc()
    expires_at = created_at + timedelta(days=SESSION_TTL_DAYS)
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO student_sessions (id, identity_id, token_hash, created_at, expires_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (session_id, identity_id, token_hash, created_at.isoformat(), expires_at.isoformat()),
        )
    response.set_cookie(
        SESSION_COOKIE,
        make_cookie({"sid": session_token}),
        **cookie_kwargs(),
    )
    return session_id


def hash_launch_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


class TeacherLoginIn(BaseModel):
    token: str


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
        if not re.fullmatch(r"(?:oidc:)?[A-Za-z0-9:_-]{3,128}", value):
            raise ValueError("invalid teacher_id")
        return value

    @field_validator("role")
    @classmethod
    def _role(cls, value: str) -> str:
        value = (value or "teacher").strip().lower()
        if value not in {"teacher", "owner"}:
            raise ValueError("role must be teacher or owner")
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


class ItineraryItemIn(BaseModel):
    assignment_id: str = Field(min_length=1, max_length=128)
    position: int = Field(default=0, ge=0, le=10000)


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


def public_itinerary(row: sqlite3.Row, items: list[sqlite3.Row] | None = None) -> dict[str, Any]:
    return {
        "id": row["id"],
        "title": row["title"],
        "group_id": row["group_id"],
        "created_by_teacher_id": row["created_by_teacher_id"],
        "active": bool(row["active"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "items": [
            {"assignment_id": item["assignment_id"], "position": item["position"]}
            for item in (items or [])
        ],
    }


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/auth/oidc/status")
def oidc_status() -> dict[str, Any]:
    return {
        "enabled": oidc_enabled(),
        "provider": "authentik" if oidc_enabled() else None,
        "issuer": OIDC_ISSUER_URL or None,
        "scopes": OIDC_SCOPES,
    }


@app.get("/api/auth/oidc/login")
async def oidc_login(request: Request):
    if not oidc_enabled():
        raise HTTPException(status_code=503, detail="OIDC is not configured")
    require_secret()
    return await oauth.authentik.authorize_redirect(request, OIDC_REDIRECT_URL)


@app.get("/api/auth/oidc/callback")
async def oidc_callback(request: Request):
    if not oidc_enabled():
        raise HTTPException(status_code=503, detail="OIDC is not configured")
    require_secret()
    try:
        token = await oauth.authentik.authorize_access_token(
            request,
            claims_options={"iss": {"essential": True, "values": oidc_accepted_issuers()}},
        )
    except Exception as exc:
        # Do not expose provider responses or token details to the browser.
        logger.exception("OIDC authentication failed: %s", type(exc).__name__)
        raise HTTPException(status_code=401, detail="OIDC authentication failed") from exc
    claims = token.get("userinfo") or {}
    if not isinstance(claims, dict) or not claims.get("sub"):
        raise HTTPException(status_code=401, detail="OIDC identity missing")
    if str(claims.get("iss", "")).rstrip("/") not in {
        issuer.rstrip("/") for issuer in oidc_accepted_issuers()
    }:
        raise HTTPException(status_code=401, detail="OIDC issuer mismatch")
    response = RedirectResponse(url="/", status_code=303)
    set_oidc_cookie(response, claims, oidc_role(claims))
    return response


@app.post("/api/auth/oidc/logout")
def oidc_logout(response: Response) -> dict[str, bool]:
    response.delete_cookie(OIDC_COOKIE, **delete_cookie_kwargs())
    return {"ok": True}


@app.post("/api/teacher/login")
def teacher_login(payload: TeacherLoginIn, request: Request, response: Response) -> dict[str, bool]:
    if not TEACHER_TOKEN:
        raise HTTPException(status_code=503, detail="teacher token not configured")
    if rate_limited(f"teacher-login:{_client_ip(request)}"):
        raise HTTPException(status_code=429, detail="too many attempts")
    if not hmac.compare_digest(payload.token.encode(), TEACHER_TOKEN.encode()):
        raise HTTPException(status_code=401, detail="invalid teacher token")
    response.set_cookie(
        TEACHER_COOKIE,
        make_cookie({"teacher": True, "teacher_id": "teacher-token"}),
        **cookie_kwargs(max_age=8 * 60 * 60),
    )
    return {"ok": True}


@app.post("/api/teacher/logout")
def teacher_logout(response: Response) -> dict[str, bool]:
    response.delete_cookie(TEACHER_COOKIE, **delete_cookie_kwargs())
    return {"ok": True}


@app.post("/api/groups", status_code=201)
def create_group(payload: GroupIn, request: Request) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    group_id = secrets.token_urlsafe(10)
    group_code = make_group_code()
    ts = iso_now()
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO groups (id, name, tenant_id, created_by_teacher_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (group_id, group_code, payload.tenant_id, teacher_id, ts, ts),
        )
        conn.execute(
            "INSERT INTO group_memberships (group_id, teacher_id, role, created_at) VALUES (?, ?, 'owner', ?)",
            (group_id, teacher_id, ts),
        )
    return {"id": group_id, "group_code": group_code, "tenant_id": payload.tenant_id}


@app.get("/api/teacher/groups/{group_id}/members")
def group_members(group_id: str, request: Request) -> dict[str, Any]:
    require_group_owner(request, group_id)
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT teacher_id, role, created_at FROM group_memberships WHERE group_id = ? ORDER BY role DESC, created_at",
            (group_id,),
        ).fetchall()
    return {"group_id": group_id, "members": [dict(row) for row in rows]}


@app.post("/api/teacher/groups/{group_id}/members", status_code=201)
def add_group_member(group_id: str, payload: GroupMemberIn, request: Request) -> dict[str, Any]:
    require_group_owner(request, group_id)
    ts = iso_now()
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO group_memberships (group_id, teacher_id, role, created_at) VALUES (?, ?, ?, ?) "
            "ON CONFLICT(group_id, teacher_id) DO UPDATE SET role = excluded.role",
            (group_id, payload.teacher_id, payload.role, ts),
        )
        row = conn.execute(
            "SELECT teacher_id, role, created_at FROM group_memberships WHERE group_id = ? AND teacher_id = ?",
            (group_id, payload.teacher_id),
        ).fetchone()
    return {"group_id": group_id, "member": dict(row)}


@app.post("/api/teacher/groups/{group_id}/identities", status_code=201)
def add_group_identities(group_id: str, payload: AddIdentitiesIn, request: Request) -> dict[str, Any]:
    require_group_access(request, group_id)
    if payload.pin_length not in (4, 6):
        raise HTTPException(status_code=400, detail="pin_length must be 4 or 6")
    ts = iso_now()
    generated: list[dict[str, str]] = []
    with get_conn() as conn:
        group = conn.execute("SELECT id, name, tenant_id FROM groups WHERE id = ?", (group_id,)).fetchone()
        if not group:
            raise HTTPException(status_code=404, detail="group not found")
        generated = generate_identities(conn, group_id, payload.count, payload.pin_length, ts)
        conn.execute("UPDATE groups SET updated_at = ? WHERE id = ?", (ts, group_id))
    return {"group": {"id": group["id"], "group_code": group["name"], "tenant_id": group["tenant_id"]}, "identities": generated}


@app.delete("/api/teacher/groups/{group_id}")
def delete_group(group_id: str, request: Request) -> dict[str, Any]:
    require_group_owner(request, group_id)
    with get_conn() as conn:
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


@app.delete("/api/teacher/groups/{group_id}/members/{teacher_id}")
def remove_group_member(group_id: str, teacher_id: str, request: Request) -> dict[str, bool]:
    require_group_owner(request, group_id)
    if not re.fullmatch(r"(?:oidc:)?[A-Za-z0-9:_-]{3,128}", teacher_id):
        raise HTTPException(status_code=400, detail="invalid teacher_id")
    with get_conn() as conn:
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


def generate_identities(conn: sqlite3.Connection, group_id: str, count: int, pin_length: int, ts: str) -> list[dict[str, str]]:
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
            (identity_id, group_id, code, hash_pin(pin), ts, ts, ts),
        )
        generated.append({"id": identity_id, "public_code": code, "pin": pin})
    return generated


@app.post("/api/identities/batch", status_code=201)
def create_batch(payload: BatchIn, request: Request) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    pin_length = payload.pin_length
    if pin_length not in (4, 6):
        raise HTTPException(status_code=400, detail="pin_length must be 4 or 6")
    group_id = secrets.token_urlsafe(10)
    group_code = make_group_code()
    ts = iso_now()
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO groups (id, name, tenant_id, created_by_teacher_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (group_id, group_code, payload.tenant_id, teacher_id, ts, ts),
        )
        conn.execute(
            "INSERT INTO group_memberships (group_id, teacher_id, role, created_at) VALUES (?, ?, 'owner', ?)",
            (group_id, teacher_id, ts),
        )
        generated = generate_identities(conn, group_id, payload.count, pin_length, ts)
    return {
        "group": {"id": group_id, "group_code": group_code, "tenant_id": payload.tenant_id},
        "identities": generated,
    }


@app.post("/api/auth/student")
def student_login(payload: StudentAuthIn, request: Request, response: Response) -> dict[str, Any]:
    code = normalize_code(payload.public_code)
    pin = validate_pin(payload.pin)
    group_id = (payload.group_id or "").strip()
    key = f"{_client_ip(request)}:{group_id}:{code}"
    if rate_limited(key):
        raise HTTPException(status_code=429, detail="too many attempts")
    with get_conn() as conn:
        if group_id:
            rows = conn.execute(
                """
                SELECT * FROM student_identities
                WHERE group_id = ? AND public_code = ? AND active = 1
                """,
                (group_id, code),
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT * FROM student_identities
                WHERE public_code = ? AND active = 1
                """,
                (code,),
            ).fetchall()
    matches = [row for row in rows if verify_pin(pin, row["pin_hash"])]
    if len(matches) != 1:
        raise HTTPException(status_code=401, detail="invalid code or PIN")
    row = matches[0]
    set_student_session(response, row["id"])
    return {"identity": public_identity(row)}


@app.get("/api/auth/me")
def me(request: Request) -> dict[str, Any]:
    oidc = oidc_cookie(request)
    if oidc:
        return {"identity": oidc_identity(oidc)}
    identity = current_identity(request)
    if not identity:
        raise HTTPException(status_code=401, detail="not authenticated")
    return {"identity": identity}


@app.patch("/api/student/profile")
def update_student_profile(payload: StudentProfileIn, request: Request) -> dict[str, Any]:
    identity = current_identity(request)
    if not identity:
        raise HTTPException(status_code=401, detail="not authenticated")
    ts = iso_now()
    with get_conn() as conn:
        conn.execute(
            """
            UPDATE student_identities
            SET avatar_icon = ?, updated_at = ?
            WHERE id = ? AND active = 1
            """,
            (payload.avatar_icon, ts, identity["id"]),
        )
        row = conn.execute(
            "SELECT * FROM student_identities WHERE id = ? AND active = 1",
            (identity["id"],),
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="identity not found")
    return {"identity": public_identity(row)}


@app.get("/api/student/dashboard")
def student_dashboard(request: Request) -> dict[str, Any]:
    identity = current_identity(request)
    if not identity:
        raise HTTPException(status_code=401, detail="not authenticated")
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT
                a.*,
                COUNT(s.id) AS attempts,
                MAX(s.score) AS best_score,
                MAX(s.created_at) AS last_score_at,
                (SELECT ii.position FROM itinerary_items ii
                 JOIN itineraries it ON it.id = ii.itinerary_id
                 WHERE ii.assignment_id = a.id AND it.group_id = a.group_id AND it.active = 1
                 ORDER BY ii.position LIMIT 1) AS itinerary_position
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
            (identity["id"], identity["group_id"]),
        ).fetchall()
    return {
        "identity": identity,
        "assignments": [
            {
                **public_assignment(row),
                "attempts": int(row["attempts"] or 0),
                "best_score": row["best_score"],
                "last_score_at": row["last_score_at"],
                "completed": int(row["attempts"] or 0) > 0,
                "itinerary_position": row["itinerary_position"],
            }
            for row in rows
        ],
    }


@app.post("/api/student/launch-token", status_code=201)
def create_student_launch_token(payload: LaunchTokenIn, request: Request) -> dict[str, Any]:
    identity = current_identity(request)
    if not identity:
        raise HTTPException(status_code=401, detail="not authenticated")
    assignment_id = (payload.assignment_id or "").strip()
    token = secrets.token_urlsafe(32)
    token_hash = hash_launch_token(token)
    launch_id = secrets.token_urlsafe(14)
    created_at = now_utc()
    expires_at = created_at + timedelta(seconds=LAUNCH_TOKEN_TTL_SECONDS)
    with get_conn() as conn:
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
                token_hash,
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


@app.post("/api/auth/logout")
def logout(request: Request, response: Response) -> dict[str, bool]:
    cookie = parse_cookie(request.cookies.get(SESSION_COOKIE))
    if cookie and cookie.get("sid"):
        token_hash = hashlib.sha256(str(cookie["sid"]).encode()).hexdigest()
        with get_conn() as conn:
            conn.execute(
                "UPDATE student_sessions SET revoked_at = ? WHERE token_hash = ?",
                (iso_now(), token_hash),
            )
    response.delete_cookie(SESSION_COOKIE, **delete_cookie_kwargs())
    response.delete_cookie(OIDC_COOKIE, **delete_cookie_kwargs())
    return {"ok": True}


@app.post("/api/identities/{identity_id}/regenerate-pin")
def regenerate_pin(identity_id: str, request: Request, pin_length: int = Query(4)) -> dict[str, str]:
    teacher_id = require_teacher(request)
    pin = make_pin(pin_length)
    ts = iso_now()
    with get_conn() as conn:
        cur = conn.execute(
            """
            UPDATE student_identities
            SET pin_hash = ?, updated_at = ?, pin_rotated_at = ?
            WHERE id = ?
              AND active = 1
              AND group_id IN (
                  SELECT id FROM groups WHERE created_by_teacher_id = ? OR id IN (
                      SELECT group_id FROM group_memberships WHERE teacher_id = ?
                  )
              )
            """,
            (hash_pin(pin), ts, ts, identity_id, teacher_id, teacher_id),
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="identity not found")
        conn.execute(
            "UPDATE student_sessions SET revoked_at = ? WHERE identity_id = ? AND revoked_at IS NULL",
            (ts, identity_id),
        )
    return {"id": identity_id, "pin": pin}


@app.post("/api/identities/{identity_id}/revoke")
def revoke_identity(identity_id: str, request: Request) -> dict[str, bool]:
    teacher_id = require_teacher(request)
    ts = iso_now()
    with get_conn() as conn:
        cur = conn.execute(
            """
            UPDATE student_identities
            SET active = 0, updated_at = ?
            WHERE id = ?
              AND group_id IN (
                  SELECT id FROM groups WHERE created_by_teacher_id = ? OR id IN (
                      SELECT group_id FROM group_memberships WHERE teacher_id = ?
                  )
              )
            """,
            (ts, identity_id, teacher_id, teacher_id),
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="identity not found")
        conn.execute(
            "UPDATE student_sessions SET revoked_at = ? WHERE identity_id = ? AND revoked_at IS NULL",
            (ts, identity_id),
        )
    return {"ok": True}


@app.post("/api/teacher/activity-assignments", status_code=201)
def create_activity_assignment(payload: ActivityAssignmentIn, request: Request) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    app_id = normalize_app_id(payload.app_id)
    activity_id = normalize_activity_id(payload.activity_id)
    title = (payload.title or "").strip()[:160]
    launch_url = normalize_launch_url(payload.launch_url)
    assignment_id = secrets.token_urlsafe(14)
    ts = iso_now()
    with get_conn() as conn:
        group = conn.execute(
            """SELECT id FROM groups WHERE id = ? AND
               (created_by_teacher_id = ? OR EXISTS (
                 SELECT 1 FROM group_memberships m
                 WHERE m.group_id = groups.id AND m.teacher_id = ?))""",
            (payload.group_id, teacher_id, teacher_id),
        ).fetchone()
        if not group and not is_oidc_admin(request):
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


@app.get("/api/teacher/activity-assignments")
def teacher_activity_assignments(
    request: Request,
    group_id: str = "",
    limit: int = Query(100, ge=1, le=500),
) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    params: list[Any] = [teacher_id, teacher_id]
    where = """WHERE active = 1 AND (a.created_by_teacher_id = ? OR EXISTS (
        SELECT 1 FROM group_memberships m
        WHERE m.group_id = a.group_id AND m.teacher_id = ?))"""
    if group_id:
        where += " AND group_id = ?"
        params.append(group_id)
    params.append(limit)
    with get_conn() as conn:
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


@app.post("/api/teacher/itineraries", status_code=201)
def create_itinerary(payload: ItineraryIn, request: Request) -> dict[str, Any]:
    teacher_id = require_group_access(request, payload.group_id)
    itinerary_id = secrets.token_urlsafe(12)
    ts = iso_now()
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO itineraries (id, title, group_id, created_by_teacher_id, active, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, ?, ?)
            """,
            (itinerary_id, payload.title.strip(), payload.group_id, teacher_id, ts, ts),
        )
        row = conn.execute("SELECT * FROM itineraries WHERE id = ?", (itinerary_id,)).fetchone()
    return {"itinerary": public_itinerary(row)}


@app.get("/api/teacher/itineraries")
def teacher_itineraries(request: Request, group_id: str = "") -> dict[str, Any]:
    teacher_id = require_teacher(request)
    params: list[Any] = [teacher_id, teacher_id]
    where = """WHERE i.active = 1 AND (i.created_by_teacher_id = ? OR EXISTS (
        SELECT 1 FROM group_memberships m WHERE m.group_id = i.group_id AND m.teacher_id = ?
    ))"""
    if group_id:
        where += " AND i.group_id = ?"
        params.append(group_id)
    with get_conn() as conn:
        rows = conn.execute(
            f"SELECT i.* FROM itineraries i {where} ORDER BY i.updated_at DESC, i.title",
            params,
        ).fetchall()
        result = []
        for row in rows:
            items = conn.execute(
                "SELECT assignment_id, position FROM itinerary_items WHERE itinerary_id = ? ORDER BY position, assignment_id",
                (row["id"],),
            ).fetchall()
            result.append(public_itinerary(row, items))
    return {"itineraries": result}


@app.post("/api/teacher/itineraries/{itinerary_id}/items", status_code=201)
def add_itinerary_item(itinerary_id: str, payload: ItineraryItemIn, request: Request) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    ts = iso_now()
    with get_conn() as conn:
        itinerary = conn.execute(
            """SELECT i.* FROM itineraries i WHERE i.id = ? AND i.active = 1 AND
            (i.created_by_teacher_id = ? OR EXISTS (
                SELECT 1 FROM group_memberships m WHERE m.group_id = i.group_id AND m.teacher_id = ?
            ))""",
            (itinerary_id, teacher_id, teacher_id),
        ).fetchone()
        if not itinerary:
            raise HTTPException(status_code=404, detail="itinerary not found")
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
        items = conn.execute(
            "SELECT assignment_id, position FROM itinerary_items WHERE itinerary_id = ? ORDER BY position, assignment_id",
            (itinerary_id,),
        ).fetchall()
    return {"itinerary": public_itinerary(itinerary, items)}


@app.get("/api/teacher/activity-assignments/{assignment_id}/results")
def teacher_activity_assignment_results(assignment_id: str, request: Request) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    with get_conn() as conn:
        assignment = conn.execute(
            """
            SELECT a.* FROM activity_assignments a
            WHERE a.id = ? AND a.active = 1 AND (a.created_by_teacher_id = ? OR EXISTS (
                SELECT 1 FROM group_memberships m
                WHERE m.group_id = a.group_id AND m.teacher_id = ?
            ))
            """,
            (assignment_id, teacher_id, teacher_id),
        ).fetchone()
        if not assignment:
            raise HTTPException(status_code=404, detail="assignment not found")
        rows = conn.execute(
            """
            SELECT
                i.public_code,
                COUNT(s.id) AS attempts,
                MAX(s.score) AS best_score,
                MAX(s.created_at) AS last_score_at
            FROM scores s
            JOIN student_identities i ON i.id = s.identity_id
            WHERE s.assignment_id = ? AND i.active = 1
            GROUP BY i.public_code
            ORDER BY best_score DESC, last_score_at DESC, i.public_code
            """,
            (assignment_id,),
        ).fetchall()
    return {
        "assignment": public_assignment(assignment),
        "results": [
            {
                "public_code": row["public_code"],
                "attempts": int(row["attempts"] or 0),
                "best_score": row["best_score"],
                "last_score_at": row["last_score_at"],
            }
            for row in rows
        ],
    }


@app.post("/api/scores", status_code=201)
def add_score(payload: ScoreIn, request: Request) -> dict[str, Any]:
    identity = current_identity(request)
    if not identity:
        raise HTTPException(status_code=401, detail="not authenticated")
    score_id = secrets.token_urlsafe(12)
    ts = iso_now()
    app_id = normalize_app_id(payload.app_id)
    activity_id = normalize_activity_id(payload.activity_id)
    assignment_id = (payload.assignment_id or "").strip()
    result_id = (payload.result_id or "").strip()
    with get_conn() as conn:
        if assignment_id:
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
            if assignment["group_id"] != identity["group_id"]:
                raise HTTPException(status_code=403, detail="assignment is not for this group")
        if result_id:
            existing = conn.execute(
                "SELECT id, score, assignment_id FROM scores WHERE identity_id = ? AND assignment_id = ? AND result_id = ?",
                (identity["id"], assignment_id, result_id),
            ).fetchone()
            if existing:
                return {
                    "ok": True,
                    "duplicate": True,
                    "id": existing["id"],
                    "public_code": identity["public_code"],
                    "assignment_id": existing["assignment_id"],
                    "score": existing["score"],
                }
        conn.execute(
            """
            INSERT INTO scores (id, identity_id, assignment_id, app_id, activity_id, score, result_id, metadata_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                score_id,
                identity["id"],
                assignment_id,
                app_id,
                activity_id,
                payload.score,
                result_id,
                json.dumps(payload.metadata),
                ts,
            ),
        )
    return {
        "ok": True,
        "id": score_id,
        "public_code": identity["public_code"],
        "assignment_id": assignment_id,
        "score": payload.score,
    }


@app.post("/api/apps/{app_id}/scores", status_code=201)
def add_app_score(app_id: str, payload: AppScoreIn, request: Request) -> dict[str, Any]:
    require_app_token(request)
    score_id = secrets.token_urlsafe(12)
    ts = iso_now()
    app_key = normalize_app_id(app_id)
    activity_id = normalize_activity_id(payload.activity_id)
    assignment_id = (payload.assignment_id or "").strip()
    result_id = (payload.result_id or "").strip()
    with get_conn() as conn:
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
            if assignment["app_id"] != app_key or assignment["activity_id"] != activity_id:
                raise HTTPException(status_code=400, detail="assignment does not match activity")
            if assignment["group_id"] != identity["group_id"]:
                raise HTTPException(status_code=403, detail="assignment is not for this group")
        else:
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
        if result_id:
            existing = conn.execute(
                "SELECT id, score, assignment_id FROM scores WHERE identity_id = ? AND assignment_id = ? AND result_id = ?",
                (identity["id"], assignment_id, result_id),
            ).fetchone()
            if existing:
                return {
                    "ok": True,
                    "duplicate": True,
                    "id": existing["id"],
                    "public_code": identity["public_code"],
                    "assignment_id": existing["assignment_id"],
                    "score": existing["score"],
                }
        conn.execute(
            """
            INSERT INTO scores (id, identity_id, assignment_id, app_id, activity_id, score, result_id, metadata_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                score_id,
                identity["id"],
                assignment_id,
                app_key,
                activity_id,
                payload.score,
                result_id,
                json.dumps(payload.metadata),
                ts,
            ),
        )
    return {
        "ok": True,
        "id": score_id,
        "public_code": identity["public_code"],
        "assignment_id": assignment_id,
        "score": payload.score,
    }


@app.post("/api/apps/{app_id}/launch-tokens/consume")
def consume_app_launch_token(app_id: str, payload: ConsumeLaunchTokenIn, request: Request) -> dict[str, Any]:
    require_app_token(request)
    app_key = normalize_app_id(app_id)
    token = (payload.token or "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="invalid launch token")
    token_hash = hash_launch_token(token)
    ts_dt = now_utc()
    ts = ts_dt.isoformat()
    with get_conn() as conn:
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
            (token_hash,),
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
            (ts, row["id"]),
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


@app.get("/api/rankings")
def rankings(
    request: Request,
    app_id: str = Query(...),
    activity_id: str = Query(...),
    limit: int = Query(10, ge=1, le=100),
) -> list[dict[str, Any]]:
    require_ranking_viewer(request)
    app_key = normalize_app_id(app_id)
    activity_key = re.sub(r"[^a-z0-9_.:-]+", "-", activity_id.lower()).strip("-")[:128]
    with get_conn() as conn:
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


@app.get("/api/teacher/stats.csv", response_class=PlainTextResponse)
def teacher_stats_csv(request: Request, group_id: str | None = None) -> str:
    teacher_id = require_teacher(request)
    out = io.StringIO()
    writer = csv.writer(out)
    writer.writerow(["group_code", "public_code", "app_id", "activity_id", "attempts", "best_score", "last_score_at"])
    params: list[Any] = [teacher_id, teacher_id]
    where = "WHERE i.active = 1 AND (g.created_by_teacher_id = ? OR EXISTS (SELECT 1 FROM group_memberships m WHERE m.group_id = g.id AND m.teacher_id = ?))"
    if group_id:
        where += " AND i.group_id = ?"
        params.append(group_id)
    with get_conn() as conn:
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


@app.get("/api/teacher/summary")
def teacher_summary(request: Request) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    with get_conn() as conn:
        totals = conn.execute(
            """
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN active = 0 THEN 1 ELSE 0 END) AS inactive
            FROM student_identities
            JOIN groups g ON g.id = student_identities.group_id
            WHERE g.created_by_teacher_id = ? OR EXISTS (
                SELECT 1 FROM group_memberships m
                WHERE m.group_id = g.id AND m.teacher_id = ?
            )
            """,
            (teacher_id, teacher_id),
        ).fetchone()
        groups = conn.execute(
            """
            SELECT
                g.id,
                g.name,
                g.tenant_id,
                g.created_at,
                COUNT(i.id) AS total,
                SUM(CASE WHEN i.active = 1 THEN 1 ELSE 0 END) AS active
            FROM groups g
            LEFT JOIN student_identities i ON i.group_id = g.id
            WHERE g.created_by_teacher_id = ? OR EXISTS (
                SELECT 1 FROM group_memberships m
                WHERE m.group_id = g.id AND m.teacher_id = ?
            )
            GROUP BY g.id, g.name, g.tenant_id, g.created_at
            ORDER BY g.created_at DESC
            LIMIT 20
            """,
            (teacher_id, teacher_id),
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


@app.get("/api/teacher/identities")
def teacher_identities(request: Request, limit: int = Query(200, ge=1, le=500)) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT i.id, i.public_code, i.active, i.created_at, i.pin_rotated_at,
                   g.id AS group_id, g.name AS group_name, g.tenant_id
            FROM student_identities i
            JOIN groups g ON g.id = i.group_id
            WHERE i.active = 1
              AND (g.created_by_teacher_id = ? OR EXISTS (
                  SELECT 1 FROM group_memberships m
                  WHERE m.group_id = g.id AND m.teacher_id = ?
              ))
            ORDER BY i.created_at DESC, i.public_code
            LIMIT ?
            """,
            (teacher_id, teacher_id, limit),
        ).fetchall()
    return {
        "identities": [
            {
                "id": row["id"],
                "public_code": row["public_code"],
                "active": bool(row["active"]),
                "created_at": row["created_at"],
                "pin_rotated_at": row["pin_rotated_at"],
                "group_id": row["group_id"],
                "group_name": row["group_name"],
                "tenant_id": row["tenant_id"],
            }
            for row in rows
        ]
    }


@app.get("/api/teacher/identities/by-code/{public_code}")
def teacher_identity_by_code(public_code: str, request: Request) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    code = normalize_code(public_code)
    with get_conn() as conn:
        row = conn.execute(
            """
            SELECT i.id, i.public_code, i.active, i.created_at, i.pin_rotated_at,
                   g.id AS group_id, g.name AS group_name, g.tenant_id
            FROM student_identities i
            JOIN groups g ON g.id = i.group_id
            WHERE i.public_code = ?
              AND i.active = 1
              AND (g.created_by_teacher_id = ? OR EXISTS (
                  SELECT 1 FROM group_memberships m
                  WHERE m.group_id = g.id AND m.teacher_id = ?
              ))
            """,
            (code, teacher_id, teacher_id),
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="identity not found")
    return {
        "identity": {
            "id": row["id"],
            "public_code": row["public_code"],
            "active": bool(row["active"]),
            "created_at": row["created_at"],
            "pin_rotated_at": row["pin_rotated_at"],
            "group_id": row["group_id"],
            "group_name": row["group_name"],
            "tenant_id": row["tenant_id"],
        }
    }


@app.get("/api/groups/{group_id}/cards", response_class=HTMLResponse)
def printable_cards(group_id: str, request: Request) -> str:
    teacher_id = require_teacher(request)
    with get_conn() as conn:
        group = conn.execute(
            """SELECT * FROM groups WHERE id = ? AND (created_by_teacher_id = ? OR EXISTS (
                SELECT 1 FROM group_memberships m WHERE m.group_id = groups.id AND m.teacher_id = ?
            ))""",
            (group_id, teacher_id, teacher_id),
        ).fetchone()
        if not group:
            raise HTTPException(status_code=404, detail="group not found")
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


@app.get("/api/groups/{group_id}/csv", response_class=PlainTextResponse)
def export_codes_csv(group_id: str, request: Request) -> str:
    """Export only public codes. PIN export is intentionally unavailable later."""
    teacher_id = require_teacher(request)
    out = io.StringIO()
    writer = csv.writer(out)
    writer.writerow(["codi", "grup"])
    with get_conn() as conn:
        group = conn.execute(
            """SELECT id FROM groups WHERE id = ? AND (created_by_teacher_id = ? OR EXISTS (
                SELECT 1 FROM group_memberships m WHERE m.group_id = groups.id AND m.teacher_id = ?
            ))""",
            (group_id, teacher_id, teacher_id),
        ).fetchone()
        if not group:
            raise HTTPException(status_code=404, detail="group not found")
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


@app.post("/api/apps/{app_id}/roster")
def app_roster(app_id: str, payload: AppRosterIn, request: Request) -> dict[str, Any]:
    teacher_id = require_teacher(request)
    app_key = normalize_app_id(app_id)
    with get_conn() as conn:
        group = conn.execute(
            """SELECT id FROM groups WHERE id = ? AND (created_by_teacher_id = ? OR EXISTS (
                SELECT 1 FROM group_memberships m WHERE m.group_id = groups.id AND m.teacher_id = ?
            ))""",
            (payload.group_id, teacher_id, teacher_id),
        ).fetchone()
        if not group:
            raise HTTPException(status_code=404, detail="group not found")
        rows = conn.execute(
            """
            SELECT id, public_code FROM student_identities
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
