"""Inici i tancament de sessió: OIDC, testimoni docent i codi/PIN d'alumnat."""

from __future__ import annotations

import hmac
from typing import Any
from urllib.parse import quote, urlsplit

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse

from ..auth import oidc_identity
from ..context import Commons, client_ip, commons
from ..db import iso_now
from ..models import StudentAuthIn, TeacherLoginIn, public_identity
from ..origins import origin_allowed, same_host, url_origin
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


def safe_next(value: Any, allowed: tuple[str, ...] = (), host: str = "") -> str:
    """Ruta relativa pròpia o URL absoluta d'un origen de confiança.

    Rebutja `//host`, barres invertides, credencials incrustades, esquemes que
    no siguen http(s) i qualsevol host fora de la llista: sense açò el retorn
    després d'entrar seria una redirecció oberta.
    """
    if not isinstance(value, str) or not value or "\\" in value or any(ord(ch) < 32 for ch in value):
        return "/"
    if value.startswith("/") and not value.startswith("//"):
        return value
    try:
        parsed = urlsplit(value)
    except ValueError:
        return "/"
    if parsed.scheme in {"http", "https"} and parsed.netloc and (
        origin_allowed(url_origin(value), allowed) or (host and same_host(url_origin(value), host))
    ):
        return value
    return "/"


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
    request.session["oidc_next"] = safe_next(
        request.query_params.get("next", "/"), c.settings.allowed_origins, request.headers.get("host", "")
    )
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
    response = RedirectResponse(url=safe_next(request.session.pop("oidc_next", "/"), c.settings.allowed_origins, request.headers.get("host", "")), status_code=303)
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


def revoke_student_session(request: Request, c: Commons) -> None:
    cookie = c.cookies.decode(request.cookies.get(SESSION_COOKIE))
    if cookie and cookie.get("sid"):
        with c.connect() as conn:
            conn.execute(
                "UPDATE student_sessions SET revoked_at = ? WHERE token_hash = ?",
                (iso_now(), hash_token(str(cookie["sid"]))),
            )


@router.post("/api/auth/logout")
def logout(request: Request, response: Response, c: Commons = Depends(commons)) -> dict[str, bool]:
    c.rebost.revoke_oidc(request)
    revoke_student_session(request, c)
    response.delete_cookie(SESSION_COOKIE, **c.cookies.delete_options())
    response.delete_cookie(OIDC_COOKIE, **c.cookies.delete_options())
    return {"ok": True}


# --- Sessió central ------------------------------------------------------
#
# El xip de compte de les pàgines i apps pròpies només necessita saber si hi ha
# sessió i com mostrar-la. Mai torna correu, identificadors interns ni secrets.

def display_name(oidc: dict[str, Any]) -> str:
    name = str(oidc.get("name") or "").strip()
    if name:
        return name
    username = str(oidc.get("username") or "").strip()
    # Si Authentik no envia nom d'usuari, la galeta pot portar el correu.
    return username.split("@", 1)[0] if "@" in username else username


def session_links(request: Request, c: Commons) -> dict[str, str | None]:
    """Rutes relatives a Commons; el widget les resol amb la seua `data-base`.

    Darrere de dos proxies `request.base_url` no sap si és HTTPS, per això no
    es construïxen URL absolutes ací.
    """
    supplied = request.headers.get("origin", "")
    back = request.query_params.get("next", "")
    host = request.headers.get("host", "")
    if not back and supplied and (origin_allowed(supplied, c.settings.allowed_origins) or same_host(supplied, host)):
        back = supplied + "/"
    next_url = safe_next(back or "/", c.settings.allowed_origins, host)
    return {
        "login": f"/api/auth/oidc/login?next={quote(next_url, safe='')}" if c.settings.oidc_enabled else None,
        "teacher": "/teacher.html",
        "student": "/student.html",
        "account": c.settings.account_url or None,
        "logout": "/api/auth/session/logout",
    }


def session_state(request: Request, c: Commons) -> dict[str, Any]:
    anonymous = {
        "authenticated": False,
        "kind": "anonymous",
        "role": None,
        "display_name": None,
        "username": None,
        "public_code": None,
    }
    oidc = c.auth.oidc_cookie(request)
    if oidc:
        username = str(oidc.get("username") or "")
        state = {
            **anonymous,
            "authenticated": True,
            "kind": "oidc",
            "role": str(oidc.get("role") or "alumno"),
            "display_name": display_name(oidc),
            "username": username.split("@", 1)[0] if "@" in username else username,
        }
    elif (teacher := c.cookies.decode(request.cookies.get(TEACHER_COOKIE))) and teacher.get("teacher"):
        state = {**anonymous, "authenticated": True, "kind": "teacher", "role": "profesor"}
    elif student := c.auth.current_identity(request):
        state = {
            **anonymous,
            "authenticated": True,
            "kind": "student",
            "role": "alumno",
            "public_code": student["public_code"],
        }
    else:
        state = anonymous
    return {**state, "login_available": c.settings.oidc_enabled, "links": session_links(request, c)}


def session_origin_ok(request: Request, c: Commons) -> bool:
    supplied = request.headers.get("origin", "")
    if supplied and supplied != "null":
        # Les galetes no distingixen ports i nginx pot reenviar `Host` sense port:
        # n'hi ha prou que coincidisca el nom del host.
        return same_host(supplied, request.headers.get("host", "")) or origin_allowed(supplied, c.settings.allowed_origins)
    return request.headers.get("sec-fetch-site", "") == "same-origin"


def no_store(response: Response) -> None:
    response.headers["Cache-Control"] = "no-store"
    response.headers["Vary"] = "Cookie, Origin"


@router.get("/api/auth/session")
def central_session(request: Request, response: Response, c: Commons = Depends(commons)) -> dict[str, Any]:
    no_store(response)
    return session_state(request, c)


@router.post("/api/auth/session/logout")
def central_logout(request: Request, response: Response, c: Commons = Depends(commons)) -> dict[str, bool]:
    """Tanca qualsevol sessió de Commons; repetir-ho no és cap error."""
    no_store(response)
    if not session_origin_ok(request, c):
        raise HTTPException(status_code=403, detail="origin not allowed")
    c.rebost.revoke_oidc(request)
    revoke_student_session(request, c)
    for name in (SESSION_COOKIE, OIDC_COOKIE, TEACHER_COOKIE):
        response.delete_cookie(name, **c.cookies.delete_options())
    return {"ok": True}


# --- Resolució interna per a aplicacions pròpies (Banc de recursos) -------
#
# L'app reenvia les galetes centrals de la persona i rep la identitat estable
# amb què guarda les seues dades: el `sub` d'Authentik (igual en tots els
# proveïdors, `hashed_user_id`) o la identitat de l'alumnat. Només amb el
# testimoni d'aplicació i només per la xarxa interna: nginx la bloqueja fora.

@router.get("/api/internal/session/resolve")
def internal_session_resolve(request: Request, response: Response, c: Commons = Depends(commons)) -> dict[str, Any]:
    c.auth.require_app_token(request)
    no_store(response)
    oidc = c.auth.oidc_cookie(request)
    if oidc:
        return {
            "kind": "oidc",
            "sub": str(oidc.get("sub") or ""),
            "role": str(oidc.get("role") or "alumno"),
            "display_name": display_name(oidc),
        }
    student = c.auth.current_identity(request)
    if student:
        return {"kind": "student", "id": student["id"], "public_code": student["public_code"]}
    return {"kind": "anonymous"}
