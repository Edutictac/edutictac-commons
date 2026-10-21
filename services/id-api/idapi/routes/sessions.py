"""Inici i tancament de sessió: OIDC, testimoni docent i codi/PIN d'alumnat."""

from __future__ import annotations

import hmac
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse

from ..auth import oidc_identity
from ..context import Commons, client_ip, commons
from ..db import iso_now
from ..models import StudentAuthIn, TeacherLoginIn, public_identity
from ..security import (
    OIDC_COOKIE,
    SESSION_COOKIE,
    TEACHER_COOKIE,
    hash_token,
    normalize_code,
    validate_pin,
    verify_pin,
)

router = APIRouter()


def safe_next(value: Any) -> str:
    if not isinstance(value, str) or not value.startswith("/") or value.startswith("//"):
        return "/"
    return value


@router.get("/api/auth/oidc/status")
def oidc_status(c: Commons = Depends(commons)) -> dict[str, Any]:
    enabled = c.settings.oidc_enabled
    return {
        "enabled": enabled,
        "provider": "authentik" if enabled else None,
        "issuer": c.settings.oidc_issuer_url or None,
        "scopes": c.settings.oidc_scopes,
    }


@router.get("/api/auth/oidc/login")
async def oidc_login(request: Request, c: Commons = Depends(commons)):
    if not c.settings.oidc_enabled:
        raise HTTPException(status_code=503, detail="OIDC is not configured")
    c.cookies.require_secret()
    request.session["oidc_next"] = safe_next(request.query_params.get("next", "/"))
    return await c.oauth.authentik.authorize_redirect(request, c.settings.oidc_redirect_url)


@router.get("/api/auth/oidc/callback")
async def oidc_callback(request: Request, c: Commons = Depends(commons)):
    if not c.settings.oidc_enabled:
        raise HTTPException(status_code=503, detail="OIDC is not configured")
    c.cookies.require_secret()
    accepted = c.settings.oidc_accepted_issuers()
    try:
        token = await c.oauth.authentik.authorize_access_token(
            request,
            claims_options={"iss": {"essential": True, "values": accepted}},
        )
    except Exception as exc:
        # No s'exposen al navegador ni les respostes del proveïdor ni els testimonis.
        c.logger.exception("OIDC authentication failed: %s", type(exc).__name__)
        raise HTTPException(status_code=401, detail="OIDC authentication failed") from exc
    claims = token.get("userinfo") or {}
    if not isinstance(claims, dict) or not claims.get("sub"):
        raise HTTPException(status_code=401, detail="OIDC identity missing")
    token_issuer = (
        claims.get("iss")
        or (token.get("id_token_claims") or {}).get("iss")
        or c.settings.oidc_issuer_url
    )
    if str(token_issuer).rstrip("/") not in {issuer.rstrip("/") for issuer in accepted}:
        raise HTTPException(status_code=401, detail="OIDC issuer mismatch")
    response = RedirectResponse(url=safe_next(request.session.pop("oidc_next", "/")), status_code=303)
    c.set_oidc_cookie(response, claims, c.auth.oidc_role(claims))
    return response


@router.post("/api/auth/oidc/logout")
def oidc_logout(request: Request, response: Response, c: Commons = Depends(commons)) -> dict[str, bool]:
    c.rebost.revoke_oidc(request)
    response.delete_cookie(OIDC_COOKIE, **c.cookies.delete_options())
    return {"ok": True}


@router.post("/api/teacher/login")
def teacher_login(payload: TeacherLoginIn, request: Request, response: Response, c: Commons = Depends(commons)) -> dict[str, bool]:
    if not c.settings.teacher_token:
        raise HTTPException(status_code=503, detail="teacher token not configured")
    if c.rate_limited(f"teacher-login:{client_ip(request)}"):
        raise HTTPException(status_code=429, detail="too many attempts")
    if not hmac.compare_digest(payload.token.encode(), c.settings.teacher_token.encode()):
        raise HTTPException(status_code=401, detail="invalid teacher token")
    response.set_cookie(
        TEACHER_COOKIE,
        c.cookies.encode({"teacher": True, "teacher_id": "teacher-token"}),
        **c.cookies.options(max_age=8 * 60 * 60),
    )
    return {"ok": True}


@router.post("/api/teacher/logout")
def teacher_logout(response: Response, c: Commons = Depends(commons)) -> dict[str, bool]:
    response.delete_cookie(TEACHER_COOKIE, **c.cookies.delete_options())
    return {"ok": True}


@router.post("/api/auth/student")
def student_login(payload: StudentAuthIn, request: Request, response: Response, c: Commons = Depends(commons)) -> dict[str, Any]:
    code = normalize_code(payload.public_code)
    pin = validate_pin(payload.pin)
    group_id = (payload.group_id or "").strip()
    if c.rate_limited(f"{client_ip(request)}:{group_id}:{code}"):
        raise HTTPException(status_code=429, detail="too many attempts")
    with c.connect() as conn:
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
    c.auth.set_student_session(response, row["id"])
    return {"identity": public_identity(row)}


@router.get("/api/auth/me")
def me(request: Request, c: Commons = Depends(commons)) -> dict[str, Any]:
    oidc = c.auth.oidc_cookie(request)
    if oidc:
        return {"identity": oidc_identity(oidc)}
    teacher = c.cookies.decode(request.cookies.get(TEACHER_COOKIE))
    if teacher and teacher.get("teacher"):
        return {"identity": {"id": str(teacher.get("teacher_id") or "teacher"), "role": "teacher", "provider": "local"}}
    return {"identity": c.auth.require_student(request)}


@router.post("/api/auth/logout")
def logout(request: Request, response: Response, c: Commons = Depends(commons)) -> dict[str, bool]:
    c.rebost.revoke_oidc(request)
    cookie = c.cookies.decode(request.cookies.get(SESSION_COOKIE))
    if cookie and cookie.get("sid"):
        with c.connect() as conn:
            conn.execute(
                "UPDATE student_sessions SET revoked_at = ? WHERE token_hash = ?",
                (iso_now(), hash_token(str(cookie["sid"]))),
            )
    response.delete_cookie(SESSION_COOKIE, **c.cookies.delete_options())
    response.delete_cookie(OIDC_COOKIE, **c.cookies.delete_options())
    return {"ok": True}
