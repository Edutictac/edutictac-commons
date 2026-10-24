"""Codis públics, PIN, testimonis i galetes signades."""

from __future__ import annotations

import hashlib
import hmac
import re
import secrets
from typing import Any

from fastapi import HTTPException

from edutictac_community.session import SignedSession

from .settings import Settings

SESSION_COOKIE = "edutictac_id"
TEACHER_COOKIE = "edutictac_teacher"
OIDC_COOKIE = "edutictac_oidc"
CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
CODE_RE = re.compile(r"^[A-Z2-9]{3}$")
PIN_RE = re.compile(r"^[0-9]{4,6}$")
TEACHER_ID_RE = re.compile(r"(?:oidc:)?[A-Za-z0-9:_-]{3,128}")
SESSION_TTL_DAYS = 180
OIDC_SESSION_TTL_SECONDS = 12 * 60 * 60
LAUNCH_TOKEN_TTL_SECONDS = 5 * 60


def hash_token(token: str) -> str:
    """Resum dels testimonis de sessió i de llançament; mai es guarden en clar."""
    return hashlib.sha256(token.encode()).hexdigest()


def hash_pin(pin: str, iterations: int, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", pin.encode(), salt.encode(), iterations)
    return f"pbkdf2_sha256${iterations}${salt}${digest.hex()}"


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


def bearer_matches(authorization: str, expected: str) -> bool:
    return authorization.startswith("Bearer ") and hmac.compare_digest(
        authorization[7:].encode(), expected.encode()
    )


class Cookies:
    """Galetes signades amb la clau del servei i els atributs comuns."""

    def __init__(self, settings: Settings):
        self.settings = settings

    def require_secret(self) -> None:
        if not self.settings.session_secret:
            raise HTTPException(status_code=503, detail="service secret not configured")

    def encode(self, payload: dict[str, Any]) -> str:
        self.require_secret()
        return SignedSession(self.settings.session_secret, "").encode(payload)

    def decode(self, raw: str | None) -> dict[str, Any] | None:
        return SignedSession(self.settings.session_secret, "").decode(raw)

    def options(self, max_age: int | None = None) -> dict[str, Any]:
        kwargs: dict[str, Any] = {
            "httponly": True,
            "secure": self.settings.cookie_secure,
            "samesite": "lax",
            "path": "/",
        }
        if self.settings.cookie_domain:
            kwargs["domain"] = self.settings.cookie_domain
        if max_age is not None:
            kwargs["max_age"] = max_age
        return kwargs

    def delete_options(self) -> dict[str, Any]:
        kwargs: dict[str, Any] = {"path": "/"}
        if self.settings.cookie_domain:
            kwargs["domain"] = self.settings.cookie_domain
        return kwargs
