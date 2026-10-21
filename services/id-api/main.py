"""EduTicTac ID API: credencials pseudònimes de l'alumnat.

El servei no guarda noms, correus ni identificadors institucionals de
l'alumnat. El professorat crea grups i codis públics; l'alumnat entra amb codi
públic i PIN. Els PIN es guarden resumits i només es mostren just després de
generar-los o regenerar-los.

L'aplicació es construïx en `idapi.create_app()`; este fitxer és el punt
d'entrada d'uvicorn (`main:app`).
"""

from __future__ import annotations

from idapi import Settings, create_app
from idapi.security import TEACHER_COOKIE

settings = Settings.from_env()
app = create_app(settings)
commons = app.state.commons

# Accessos directes usats per les proves i les eines de manteniment.
DB_PATH = settings.db_path
TEACHER_TOKEN = settings.teacher_token
OIDC_ISSUER_URL = settings.oidc_issuer_url
rebost = commons.rebost
get_conn = commons.connect
init_db = commons.db.migrate
hash_pin = commons.hash_pin
make_cookie = commons.cookies.encode
set_oidc_cookie = commons.set_oidc_cookie
set_student_session = commons.auth.set_student_session
oidc_cookie = commons.auth.oidc_cookie
current_identity = commons.auth.current_identity

__all__ = ["TEACHER_COOKIE", "app", "commons"]
