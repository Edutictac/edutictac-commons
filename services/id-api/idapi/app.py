"""Construcció de l'aplicació FastAPI i de les extensions Quiosc, Rebost i Llibres."""

from __future__ import annotations

import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response
from starlette.middleware.sessions import SessionMiddleware

from .context import Commons
from .origins import origin_allowed, same_host
from .routes import ROUTERS
from .settings import Settings


def install_quiosc(app: FastAPI, c: Commons) -> None:
    from module_guard import quiosc_start_guard
    from quiosc.api import install
    from quiosc.local_auth import COOKIE as QUIOSC_LOCAL_COOKIE, LOCAL_GROUP, LocalAuth
    from quiosc.service import Quiosc

    service = Quiosc()
    local_auth = LocalAuth(service, c.settings.session_secret)

    def require_quiosc_teacher(request: Request) -> str:
        # Una demo no ha d'obtindre execució remota només per muntar el socket
        # d'Epoptes. Els docents OIDC usen la seua identitat normal de Commons.
        real = os.environ.get("QUIOSC_MODE", "disabled") == "real"
        if real and len(c.settings.session_secret) < 32:
            raise HTTPException(503, "Quiosc real requiere una clave de firma de producción (32 caracteres mínimo)")
        local_teacher = local_auth.identity(request.cookies.get(QUIOSC_LOCAL_COOKIE))
        if local_teacher:
            return local_teacher
        teacher_id = c.auth.require_teacher(request)
        if real and teacher_id == "teacher-token" and len(c.settings.teacher_token) < 24:
            raise HTTPException(503, "Quiosc real no admite el acceso docente de desarrollo; usa OIDC o un token de producción")
        return teacher_id

    def require_quiosc_group_access(request: Request, group_id: str) -> str:
        if group_id == LOCAL_GROUP:
            actor = local_auth.identity(request.cookies.get(QUIOSC_LOCAL_COOKIE))
            if not actor:
                raise HTTPException(404, "Local Epoptes authorization required")
            return actor
        # El permís local d'Epoptes no dona accés als grups de Commons.
        return c.auth.require_group_access(request, group_id)

    install(app, require_quiosc_teacher, require_quiosc_group_access,
            service=service, local_auth=local_auth, start_guard=quiosc_start_guard)


def install_library(app: FastAPI, c: Commons) -> None:
    # Biblioteca privada d'imatges compartida; no depén de cap editor concret.
    from assets import Library
    from books import install_books

    c.rebost = Library(c.connect, c.settings.db_path, c.auth.oidc_cookie, c.auth.current_identity)
    app.include_router(c.rebost.router())
    def moderated_group_access(request: Request, group_id: str, **kwargs) -> str:
        # La moderació de Llibres és l'única tasca d'aula oberta a administració.
        return c.auth.require_group_access(request, group_id, admin=True, **kwargs)

    install_books(app, c.rebost, c.auth.oidc_cookie, c.settings.resources_api_url,
                  c.settings.app_token, moderated_group_access)

    @app.middleware("http")
    async def rebost_private_headers(request: Request, call_next):
        response = await call_next(request)
        if request.url.path.startswith("/api/assets/v1/"):
            response.headers["Cache-Control"] = "private, no-store"
            response.headers["X-Content-Type-Options"] = "nosniff"
            response.headers["Content-Security-Policy"] = "default-src 'none'; sandbox"
            response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
            response.headers["Referrer-Policy"] = "no-referrer"
        return response


# Només la sessió central s'obri a altres orígens propis: la resta de l'API
# continua sent del mateix origen i no rep capçaleres CORS.
SESSION_CORS_PATHS = frozenset({"/api/auth/session", "/api/auth/session/logout"})


def install_session_cors(app: FastAPI, c: Commons) -> None:
    @app.middleware("http")
    async def session_cors(request: Request, call_next):
        origin = request.headers.get("origin", "")
        allowed = (
            request.url.path in SESSION_CORS_PATHS
            and bool(origin)
            and (
                origin_allowed(origin, c.settings.allowed_origins)
                or same_host(origin, request.headers.get("host", ""))
            )
        )
        if request.method == "OPTIONS" and request.url.path in SESSION_CORS_PATHS:
            response = Response(status_code=204 if allowed else 403)
            if allowed:
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "Content-Type"
                response.headers["Access-Control-Max-Age"] = "600"
        else:
            response = await call_next(request)
        if allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        if request.url.path in SESSION_CORS_PATHS:
            response.headers["Vary"] = "Cookie, Origin"
        return response


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings.from_env()
    c = Commons(settings)
    c.db.migrate()

    app = FastAPI(title="EduTicTac ID API")
    app.state.commons = c
    # Authlib usa esta sessió curta només per a l'estat i el nonce d'OIDC.
    # La sessió de l'aplicació és la galeta signada pròpia.
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.session_secret or "oidc-not-configured",
        session_cookie="edutictac_oidc_state",
        https_only=settings.cookie_secure,
        same_site="lax",
    )
    for router in ROUTERS:
        app.include_router(router)
    install_quiosc(app, c)
    install_library(app, c)
    install_session_cors(app, c)
    return app
