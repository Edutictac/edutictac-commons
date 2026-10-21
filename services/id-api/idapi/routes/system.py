"""Salut, mòduls visibles i activació inicial de la instal·lació."""

from __future__ import annotations

import hmac
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request

from module_guard import public_modules

from ..context import Commons, client_ip, commons
from ..db import iso_now
from ..models import SetupActivationIn

router = APIRouter()


@router.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/api/modules/status")
def public_module_status() -> dict[str, Any]:
    return public_modules()


def setup_pending(c: Commons) -> bool:
    if not c.settings.setup_token or not c.settings.authentik_bootstrap_password:
        return False
    with c.connect() as conn:
        row = conn.execute(
            "SELECT activated_at FROM installation_setup WHERE id = 1"
        ).fetchone()
    return not row or not row["activated_at"]


@router.get("/api/setup/status")
def setup_status(c: Commons = Depends(commons)) -> dict[str, bool]:
    """Només exposa si l'assistent d'arrancada continua pendent."""
    return {"pending": setup_pending(c)}


@router.post("/api/setup/activate")
def setup_activate(payload: SetupActivationIn, request: Request, c: Commons = Depends(commons)) -> dict[str, str]:
    """Bescanvia una sola vegada el codi generat per l'instal·lador.

    La contrasenya inicial no es guarda en el navegador ni es torna a mostrar
    després d'escriure l'activació. El codi d'alta entropia és el lliurament
    de confiança entre l'instal·lador local i qui administra.
    """
    settings = c.settings
    if not settings.setup_token or not settings.authentik_bootstrap_password:
        raise HTTPException(status_code=404, detail="first-run setup unavailable")
    if c.rate_limited(f"setup-activate:{client_ip(request)}"):
        raise HTTPException(status_code=429, detail="too many attempts")
    if not hmac.compare_digest(payload.code.strip(), settings.setup_token):
        raise HTTPException(status_code=401, detail="invalid activation code")
    with c.connect() as conn:
        row = conn.execute(
            "SELECT activated_at FROM installation_setup WHERE id = 1"
        ).fetchone()
        if row and row["activated_at"]:
            raise HTTPException(status_code=410, detail="activation code already used")
        conn.execute(
            "INSERT OR REPLACE INTO installation_setup (id, activated_at) VALUES (1, ?)",
            (iso_now(),),
        )
    return {"username": "akadmin", "password": settings.authentik_bootstrap_password}
