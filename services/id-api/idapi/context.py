"""Context compartit per totes les rutes d'una instància de l'ID API."""

from __future__ import annotations

import hashlib
import hmac
import logging
import sqlite3
from typing import Any

from authlib.integrations.starlette_client import OAuth
from fastapi import Request, Response

from edutictac_community.ratelimit import RateLimiter

from .auth import Auth, build_oauth
from .db import Database
from .security import OIDC_COOKIE, SESSION_TTL_DAYS, Cookies, hash_pin
from .settings import Settings

RATE_WINDOW = 60
RATE_MAX = 12


class Commons:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.db = Database(settings.db_path)
        self.cookies = Cookies(settings)
        self.auth = Auth(settings, self.cookies, self.db)
        self.oauth: OAuth = build_oauth(settings)
        self.rate_limiter = RateLimiter(max_calls=RATE_MAX, window_seconds=RATE_WINDOW)
        self.logger = logging.getLogger("edutictac.id.oidc")
        # El Rebost s'instal·la amb les extensions; necessita les regles
        # d'identitat ja creades.
        self.rebost: Any = None

    def connect(self) -> sqlite3.Connection:
        return self.db.connect()

    def rate_limited(self, key: str) -> bool:
        return self.rate_limiter(key)

    def hash_pin(self, pin: str) -> str:
        return hash_pin(pin, self.settings.pin_hash_iterations)

    def set_oidc_cookie(self, response: Response, claims: dict[str, Any], role: str) -> None:
        # El subjecte és opac i propi del proveïdor. Basta per a relacionar
        # registres de Commons sense copiar dades de perfil.
        issuer = self.settings.oidc_issuer_url
        subject = str(claims.get("sub", ""))
        pseudonym = hmac.new(
            self.settings.session_secret.encode(),
            f"{issuer}:{subject}".encode(),
            hashlib.sha256,
        ).hexdigest()[:20]
        response.set_cookie(
            OIDC_COOKIE,
            self.cookies.encode({
                "oidc": True,
                "rebost_sid": self.rebost.issue_oidc(issuer, subject),
                "iss": issuer,
                "sub": subject,
                "id": f"oidc:{pseudonym}",
                "pseudonym": pseudonym,
                "username": str(
                    claims.get("preferred_username")
                    or claims.get("username")
                    or claims.get("email")
                    or ""
                ),
                # Nom visible del compte; només es torna a la mateixa persona.
                "name": str(claims.get("name") or "")[:120],
                "role": role,
            }),
            **self.cookies.options(max_age=SESSION_TTL_DAYS * 24 * 60 * 60),
        )


def commons(request: Request) -> Commons:
    """Dependència FastAPI: context de l'aplicació que atén la petició."""
    return request.app.state.commons


def client_ip(request: Request) -> str:
    return request.client.host if request.client else "?"
