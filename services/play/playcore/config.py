"""Configuració de Play llegida de l'entorn en arrancar."""

from __future__ import annotations

import os
from pathlib import Path

# Directori del servei (on viuen public/ i h5p-libraries/), no el del paquet.
ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.environ.get("PLAY_DATA_DIR", ROOT / "data"))
ACTIVITIES_DIR = DATA_DIR / "activities"
LIBRARIES_DIR = ROOT / "h5p-libraries"
PUBLIC_DIR = ROOT / "public"
MAX_BODY = 4 * 1024 * 1024
MAX_MATCHING_IMAGE_BYTES = 400 * 1024
HOST = os.environ.get("HOST", "0.0.0.0")
URL_PREFIX = os.environ.get("URL_PREFIX", "").rstrip("/")
COMMONS_API_URL = os.environ.get("EDUTICTAC_ID_API_URL", "").rstrip("/")
COMMONS_AUTH_ME_URL = os.environ.get(
    "EDUTICTAC_AUTH_ME_URL",
    f"{COMMONS_API_URL}/api/auth/me" if COMMONS_API_URL else "",
).rstrip("/")
PLAY_TEACHER_LOGIN_URL = os.environ.get("PLAY_TEACHER_LOGIN_URL", "").strip()
# URL pública del portal de Commons per al xip de compte. Si falta, en un centre
# es deduïx del mateix host amb el port del portal (8082).
PLAY_COMMONS_URL = os.environ.get("PLAY_COMMONS_URL", "").strip().rstrip("/")
ANONYMOUS_ACTIVITY_TTL_SECONDS = int(os.environ.get("PLAY_ANONYMOUS_TTL_SECONDS", str(24 * 60 * 60)))
# Cada quant s'esborren del disc les activitats caducades; 0 ho desactiva.
PURGE_INTERVAL_SECONDS = int(os.environ.get("PLAY_PURGE_INTERVAL_SECONDS", "3600"))
# Si es definix, Play es mostra com a demo pública amb un enllaç a Commons.
PLAY_DEMO_COMMONS_URL = os.environ.get("PLAY_DEMO_COMMONS_URL", "").strip()
COMMONS_APP_ID = os.environ.get("EDUTICTAC_PLAY_APP_ID", "edutictac-play")
COMMONS_APP_TOKEN = os.environ.get("EDUTICTAC_ID_APP_TOKEN", "")
PLAY_ADMIN_TOKEN = os.environ.get("EDUTICTAC_PLAY_ADMIN_TOKEN", "").strip()
RECURSOS_API_URL = os.environ.get("RECURSOS_API_URL", "").rstrip("/")
RECURSOS_INGEST_TOKEN = os.environ.get("PLAY_INGEST_TOKEN", "").strip()
PLAY_PUBLIC_URL = os.environ.get("PLAY_PUBLIC_URL", "").rstrip("/")
PLAY_DEFAULT_VISIBILITY = os.environ.get("PLAY_DEFAULT_VISIBILITY", "public").strip().lower()
# Solo debe configurarse detrás de un proxy que elimine y vuelva a establecer
# esta cabecera a partir de una identidad OIDC validada.
PLAY_TRUSTED_IDENTITY_HEADER = os.environ.get("PLAY_TRUSTED_IDENTITY_HEADER", "").strip()
PLAY_CONTROLLED_CATALOG = os.environ.get("PLAY_CONTROLLED_CATALOG", "1").strip().lower() not in {"0", "false", "no"}
