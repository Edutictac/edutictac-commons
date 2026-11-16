"""Read-only bridge to the public Rebost catalogues for the Play demo.

Only the public, read-only collections are exposed. Personal libraries require
a Commons session and are intentionally not proxied here.
"""

from __future__ import annotations

import json
import re
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from .config import REBOST_API_URL

IMAGE_TYPES = {"sprite", "background", "object", "illustration", "image"}
SOUND_TYPES = {"sound"}
COLLECTIONS = {"catalog", "scratch", "effects"}
CONTENT_TYPES = {
    "image/png", "image/jpeg", "image/webp", "image/svg+xml",
    "audio/ogg", "audio/mpeg", "audio/wav",
}
ITEM_ID = re.compile(r"img-[0-9a-f]{64}")
CURSOR = re.compile(r"img-[0-9a-f]{64}")
MAX_CONTENT = 8 * 1024 * 1024
TIMEOUT = 10
KEEP_FIELDS = (
    "id", "name", "names", "aliases", "type", "width", "height",
    "collection", "readonly", "bytes", "license", "attribution",
    "source_id", "duration_ms", "pack", "category",
)


class RebostError(Exception):
    def __init__(self, status: int, code: str):
        self.status = status
        self.code = code


def available() -> bool:
    return bool(REBOST_API_URL)


def _json(url: str) -> dict:
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "EduTicTac-Play/0.1",
        },
    )
    try:
        with urlopen(request, timeout=TIMEOUT) as response:
            if response.status != 200:
                raise RebostError(503, "rebost_unavailable")
            payload = json.loads(response.read(2 * 1024 * 1024))
    except RebostError:
        raise
    except (HTTPError, URLError, OSError, ValueError, json.JSONDecodeError):
        raise RebostError(503, "rebost_unavailable")
    if not isinstance(payload, dict):
        raise RebostError(503, "rebost_unavailable")
    return payload


def list_items(params: dict) -> dict:
    if not available():
        raise RebostError(503, "rebost_unavailable")
    collection = str(params.get("collection", "")).strip()
    if collection not in COLLECTIONS:
        raise RebostError(400, "invalid_collection")
    kind = str(params.get("type", "")).strip()
    allowed = SOUND_TYPES if collection == "effects" else IMAGE_TYPES
    if kind and kind not in allowed:
        raise RebostError(400, "invalid_type")
    try:
        limit = max(1, min(40, int(params.get("limit", "24"))))
    except (TypeError, ValueError):
        limit = 24
    query = {"collection": collection, "limit": str(limit)}
    if kind:
        query["type"] = kind
    term = str(params.get("q", "")).strip()[:80]
    if term:
        query["q"] = term
    cursor = str(params.get("cursor", "")).strip()
    if cursor:
        if not CURSOR.fullmatch(cursor):
            raise RebostError(400, "invalid_cursor")
        query["cursor"] = cursor
    payload = _json(f"{REBOST_API_URL}/items?{urlencode(query)}")
    items = []
    for item in payload.get("items", []):
        if not isinstance(item, dict) or not ITEM_ID.fullmatch(str(item.get("id", ""))):
            continue
        items.append({key: item[key] for key in KEEP_FIELDS if key in item})
    next_cursor = payload.get("next_cursor")
    return {
        "items": items,
        "next_cursor": next_cursor if isinstance(next_cursor, str) and CURSOR.fullmatch(next_cursor) else None,
    }


def fetch_content(item_id: str) -> tuple[bytes, str]:
    if not available():
        raise RebostError(503, "rebost_unavailable")
    if not ITEM_ID.fullmatch(item_id):
        raise RebostError(400, "invalid_id")
    request = Request(
        f"{REBOST_API_URL}/items/{item_id}/content",
        headers={"Accept": "image/*,audio/*", "User-Agent": "EduTicTac-Play/0.1"},
    )
    try:
        with urlopen(request, timeout=TIMEOUT) as response:
            if response.status != 200:
                raise RebostError(503, "rebost_unavailable")
            content_type = (response.headers.get("Content-Type") or "").split(";")[0].strip().lower()
            if content_type not in CONTENT_TYPES:
                raise RebostError(502, "unsupported_media")
            body = response.read(MAX_CONTENT + 1)
    except RebostError:
        raise
    except (HTTPError, URLError, OSError, ValueError):
        raise RebostError(503, "rebost_unavailable")
    if len(body) > MAX_CONTENT:
        raise RebostError(502, "media_too_large")
    return body, content_type
