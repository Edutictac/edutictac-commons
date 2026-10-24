"""Identitat de docents, alumnat i aplicacions, i regles d'accés als grups.

Les rutes criden estos mètodes a través de `commons.auth`, no per importació
directa: així una prova pot substituir una sola regla en una instància concreta
sense afectar altres aplicacions creades en el mateix procés.
"""

from __future__ import annotations

import hmac
import re
import secrets
from datetime import timedelta
from typing import Any

from authlib.integrations.starlette_client import OAuth
from fastapi import HTTPException, Request, Response

from .access import member_of, teacher_params
from .db import Database, iso_now, now_utc
from .models import public_identity
from .security import (
    OIDC_COOKIE,
    SESSION_COOKIE,
    SESSION_TTL_DAYS,
    TEACHER_COOKIE,
    Cookies,
    bearer_matches,
    hash_token,
)
from .settings import Settings

OIDC_ROLE_ORDER = ("administrador", "profesor", "alumno")
ROLE_ALIASES = {
    "admin": "administrador",
    "administrator": "administrador",
    "administrador": "administrador",
    "teacher": "profesor",
    "profesor": "profesor",
    "student": "alumno",
    "alumno": "alumno",
}


def normalize_role(value: Any) -> str | None:
    return ROLE_ALIASES.get(str(value).strip().lower())


def oidc_identity(cookie: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(cookie.get("id", "")),
        "role": str(cookie.get("role", "alumno")),
        "pseudonym": str(cookie.get("pseudonym", "")),
        "username": str(cookie.get("username", "")),
        "name": str(cookie.get("name", "")),
        "provider": "authentik",
    }


def build_oauth(settings: Settings) -> OAuth:
    oauth = OAuth()
    if not settings.oidc_configured:
        return oauth
    if settings.oidc_discovery_url:
        # En Docker, Authentik pot ser accessible només pel nom del servei.
        # L'emissor i l'autorització del navegador continuen sent públics; el
        # testimoni, userinfo i JWKS viatgen per la xarxa interna.
        issuer = settings.oidc_issuer_url
        internal_root = settings.oidc_discovery_url.split("/application/o/", 1)[0]
        public_root = issuer.split("/application/o/", 1)[0]
        application_path = "/application/o/" + issuer.split("/application/o/", 1)[1]
        oauth.register(
            name="authentik",
            client_id=settings.oidc_client_id,
            client_secret=settings.oidc_client_secret,
            client_kwargs={"scope": settings.oidc_scopes},
            issuer=issuer + "/",
            authorization_endpoint=settings.oidc_authorization_url or f"{public_root}/application/o/authorize/",
            token_endpoint=f"{internal_root}/application/o/token/",
            userinfo_endpoint=f"{internal_root}/application/o/userinfo/",
            jwks_uri=f"{internal_root}{application_path}/jwks/",
        )
    else:
        oauth.register(
            name="authentik",
            client_id=settings.oidc_client_id,
            client_secret=settings.oidc_client_secret,
            server_metadata_url=settings.oidc_metadata_url(),
            authorize_url=settings.oidc_authorization_url or None,
            client_kwargs={"scope": settings.oidc_scopes},
        )
    return oauth


class Auth:
    def __init__(self, settings: Settings, cookies: Cookies, db: Database):
        self.settings = settings
        self.cookies = cookies
        self.db = db

    # --- OIDC -----------------------------------------------------------

    def oidc_role(self, claims: dict[str, Any]) -> str:
        raw = claims.get(self.settings.oidc_role_claim, [])
        if isinstance(raw, str):
            raw = [part for part in re.split(r"[,\s]+", raw) if part]
        if not isinstance(raw, (list, tuple, set)):
            raw = []
        roles = {role for role in (normalize_role(item) for item in raw) if role}
        for role in OIDC_ROLE_ORDER:
            if role in roles:
                return role
        return "alumno"

    def oidc_cookie(self, request: Request) -> dict[str, Any] | None:
        cookie = self.cookies.decode(request.cookies.get(OIDC_COOKIE))
        if not cookie or not cookie.get("sub") or not cookie.get("iss"):
            return None
        if not hmac.compare_digest(str(cookie["iss"]), self.settings.oidc_issuer_url):
            return None
        session_token = cookie.get("sid")
        if not isinstance(session_token, str) or not session_token:
            return None
        with self.db.connect() as conn:
            row = conn.execute(
                """
                SELECT id FROM oidc_sessions
                WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?
                """,
                (hash_token(session_token), iso_now()),
            ).fetchone()
        return cookie if row else None

    def revoke_oidc_session(self, request: Request) -> None:
        cookie = self.cookies.decode(request.cookies.get(OIDC_COOKIE))
        session_token = cookie.get("sid") if cookie else None
        if not isinstance(session_token, str) or not session_token:
            return
        with self.db.connect() as conn:
            conn.execute(
                "UPDATE oidc_sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL",
                (iso_now(), hash_token(session_token)),
            )

    def is_oidc_admin(self, request: Request) -> bool:
        session = self.oidc_cookie(request)
        return bool(session and session.get("role") == "administrador")

    # --- Docents ----------------------------------------------------------

    def require_teacher(self, request: Request) -> str:
        cookie = self.cookies.decode(request.cookies.get(TEACHER_COOKIE))
        if cookie and cookie.get("teacher"):
            return str(cookie.get("teacher_id") or "teacher")
        oidc = self.oidc_cookie(request)
        if oidc and oidc.get("role") in {"profesor", "administrador"}:
            return str(oidc.get("id"))
        if not self.settings.teacher_token:
            raise HTTPException(status_code=503, detail="teacher token not configured")
        if bearer_matches(request.headers.get("authorization", ""), self.settings.teacher_token):
            return "teacher-token"
        raise HTTPException(status_code=401, detail="teacher authentication required")

    def is_teacher(self, request: Request) -> bool:
        try:
            self.require_teacher(request)
            return True
        except HTTPException:
            return False

    def require_group_owner(self, request: Request, group_id: str) -> str:
        """Gestió de l'aula: propietari o administració del centre.

        Administració pot gestionar col·laboradors, propietat i baixa de l'aula,
        però no les dades pedagògiques (vegeu `require_group_access`).
        """
        teacher_id = self.require_teacher(request)
        with self.db.connect() as conn:
            row = conn.execute(
                "SELECT created_by_teacher_id FROM groups WHERE id = ?",
                (group_id,),
            ).fetchone()
        if not row or (row["created_by_teacher_id"] != teacher_id and not self.is_oidc_admin(request)):
            raise HTTPException(status_code=404, detail="group not found")
        return teacher_id

    def require_group_access(
        self, request: Request, group_id: str, *, individual: bool = False, admin: bool = False
    ) -> str:
        """Treball pedagògic en l'aula: només propietari o col·laborador actual.

        `admin=True` l'obri també a administració; només ho usa la moderació
        de Llibres, que revisa els enviaments de totes les aules.
        """
        if individual:
            identity = self.oidc_cookie(request)
            if not identity or identity.get("role") not in {"profesor", "administrador"}:
                raise HTTPException(status_code=401, detail="individual teacher authentication required")
            teacher_id = str(identity["id"])
        else:
            teacher_id = self.require_teacher(request)
        with self.db.connect() as conn:
            row = conn.execute(
                f"""
                SELECT g.id
                FROM groups g
                WHERE g.id = ?
                  AND {member_of("g.id")}
                """,
                (group_id, *teacher_params(teacher_id)),
            ).fetchone()
        if not row and not (admin and self.is_oidc_admin(request)):
            raise HTTPException(status_code=404, detail="group not found")
        return teacher_id

    # --- Aplicacions ------------------------------------------------------

    def require_app_token(self, request: Request) -> None:
        if not self.settings.app_token:
            raise HTTPException(status_code=503, detail="app token not configured")
        auth = request.headers.get("authorization", "")
        if not auth.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="app token required")
        if not hmac.compare_digest(auth[7:].encode(), self.settings.app_token.encode()):
            raise HTTPException(status_code=403, detail="invalid app token")

    # --- Alumnat ----------------------------------------------------------

    def current_identity(self, request: Request) -> dict[str, Any] | None:
        cookie = self.cookies.decode(request.cookies.get(SESSION_COOKIE))
        if not cookie or not cookie.get("sid"):
            return None
        with self.db.connect() as conn:
            row = conn.execute(
                """
                SELECT i.* FROM student_sessions s
                JOIN student_identities i ON i.id = s.identity_id
                WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ? AND i.active = 1
                """,
                (hash_token(str(cookie["sid"])), iso_now()),
            ).fetchone()
        return public_identity(row) if row else None

    def require_student(self, request: Request) -> dict[str, Any]:
        identity = self.current_identity(request)
        if not identity:
            raise HTTPException(status_code=401, detail="not authenticated")
        return identity

    def require_ranking_viewer(self, request: Request) -> dict[str, Any] | None:
        identity = self.current_identity(request)
        if identity:
            return identity
        if self.is_teacher(request):
            return None
        raise HTTPException(status_code=401, detail="student or teacher authentication required")

    def set_student_session(self, response: Response, identity_id: str) -> str:
        session_token = secrets.token_urlsafe(32)
        session_id = secrets.token_urlsafe(18)
        created_at = now_utc()
        expires_at = created_at + timedelta(days=SESSION_TTL_DAYS)
        with self.db.connect() as conn:
            conn.execute(
                """
                INSERT INTO student_sessions (id, identity_id, token_hash, created_at, expires_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (session_id, identity_id, hash_token(session_token), created_at.isoformat(), expires_at.isoformat()),
            )
        response.set_cookie(
            SESSION_COOKIE,
            self.cookies.encode({"sid": session_token}),
            **self.cookies.options(),
        )
        return session_id
