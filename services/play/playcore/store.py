"""Emmagatzematge d'activitats en fitxers JSON i previsualitzacions en memòria."""

from __future__ import annotations

import hashlib
import json
import re
import secrets
import shutil
import time
import os
import tempfile
from datetime import datetime, timezone

from .config import ACTIVITIES_DIR

ID_RE = re.compile(r"^[A-Za-z0-9]{8}$")
PREVIEW_RE = re.compile(r"^preview-[A-Za-z0-9]{8}$")
PREVIEWS: dict[str, dict] = {}

ACTIVITY_ID_PATTERN = r"(?:[A-Za-z0-9]{8}|preview-[A-Za-z0-9]{8})"

def new_id() -> str:
    while True:
        value = secrets.token_hex(4)
        if not (ACTIVITIES_DIR / value / "activity.json").exists():
            return value


def save_activity(activity: dict) -> None:
    folder = ACTIVITIES_DIR / activity["id"]
    folder.mkdir(parents=True, exist_ok=True)
    handle, temporary = tempfile.mkstemp(prefix='.activity-', dir=folder)
    try:
        with os.fdopen(handle, 'w', encoding='utf-8') as stream:
            json.dump(activity, stream, ensure_ascii=False, indent=2)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, folder / 'activity.json')
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def read_activity(activity_id: str) -> dict | None:
    if PREVIEW_RE.fullmatch(activity_id):
        return PREVIEWS.get(activity_id)
    if not ID_RE.fullmatch(activity_id):
        return None
    file = ACTIVITIES_DIR / activity_id / "activity.json"
    try:
        activity = json.loads(file.read_text(encoding="utf-8"))
        return None if activity_expired(activity) else activity
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def activity_expired(activity: dict) -> bool:
    expires_at = activity.get("expiresAt")
    if not expires_at:
        return False
    try:
        expiry = datetime.fromisoformat(str(expires_at).replace("Z", "+00:00"))
    except ValueError:
        return False
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    return expiry <= datetime.now(timezone.utc)


def activity_matches(activity: dict, filters: dict) -> bool:
    identity = filters.get("identity_id", "")
    if activity.get("visibility", "public") != "public" and activity.get("owner_id") != identity:
        return False
    for key in ("type", "language", "subject", "educational_stage", "license"):
        value = filters.get(key)
        if value and str(activity.get(key, "")).lower() != value.lower():
            return False
    tag = filters.get("tag")
    if tag and tag.lower() not in [str(item).lower() for item in activity.get("tags", [])]:
        return False
    query = filters.get("q")
    if query:
        haystack = f"{activity.get('title', '')} {activity.get('question', '')} {activity.get('description', '')}".lower()
        if query.lower() not in haystack:
            return False
    return True


def list_activities(filters: dict) -> tuple[list[dict], int]:
    """Return a page of saved activities (newest first) and the total after filters."""

    items = []
    if ACTIVITIES_DIR.exists():
        for folder in ACTIVITIES_DIR.iterdir():
            if not folder.is_dir() or not ID_RE.fullmatch(folder.name):
                continue
            activity = read_activity(folder.name)
            if activity:
                items.append(activity)
    items.sort(key=lambda activity: activity.get("createdAt", ""), reverse=True)
    matches = [activity for activity in items if activity_matches(activity, filters)]
    offset = filters["offset"]
    return matches[offset:offset + filters["limit"]], len(matches)


def creator_key_hash(value: str) -> str:
    """Return the sha256 of a valid anonymous creator key, or an empty string."""

    if not re.fullmatch(r"[A-Za-z0-9_-]{16,128}", value or ""):
        return ""
    return hashlib.sha256(value.encode()).hexdigest()


def is_owned(activity: dict, creator_hash: str) -> bool:
    if not creator_hash:
        return False
    owner_hash = str(activity.get("owner_key_hash", ""))
    return bool(owner_hash and secrets.compare_digest(owner_hash, creator_hash))


def public_activity(activity: dict, creator_hash: str = "") -> dict:
    result = {key: value for key, value in activity.items() if key not in {"owner_key_hash", "review", "owner_group_id"}}
    result["owned"] = is_owned(activity, creator_hash)
    return result


def activity_summary(activity: dict, creator_hash: str = "") -> dict:
    return {
        "id": activity.get("id"),
        "type": activity.get("type"),
        "title": activity.get("title"),
        "question": activity.get("question"),
        "language": activity.get("language"),
        "createdAt": activity.get("createdAt"),
        "description": activity.get("description", ""),
        "subject": activity.get("subject", ""),
        "educational_stage": activity.get("educational_stage", ""),
        "educational_level": activity.get("educational_level", ""),
        "license": activity.get("license", ""),
        "author_pseudonym": activity.get("author_pseudonym", ""),
        "tags": activity.get("tags", []),
        "visibility": activity.get("visibility", "public"),
        "owned": is_owned(activity, creator_hash),
    }


def delete_activity(activity_id: str) -> bool:
    if not ID_RE.fullmatch(activity_id):
        return False
    folder = ACTIVITIES_DIR / activity_id
    if not (folder / "activity.json").is_file():
        return False
    shutil.rmtree(folder)
    return True


def purge_expired_activities() -> int:
    """Esborra del disc les activitats anònimes caducades i en retorna el nombre."""

    removed = 0
    if not ACTIVITIES_DIR.exists():
        return removed
    for folder in ACTIVITIES_DIR.iterdir():
        if not folder.is_dir() or not ID_RE.fullmatch(folder.name):
            continue
        try:
            activity = json.loads((folder / "activity.json").read_text(encoding="utf-8"))
        except (FileNotFoundError, json.JSONDecodeError):
            continue
        if activity_expired(activity):
            shutil.rmtree(folder, ignore_errors=True)
            removed += 1
    return removed


def purge_loop(interval: int) -> None:
    while True:
        try:
            purge_expired_activities()
        except OSError:
            pass
        time.sleep(interval)
