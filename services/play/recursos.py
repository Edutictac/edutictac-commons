"""Contract-only adapter for publishing public Play activities to Recursos.

This module deliberately does not perform HTTP requests.  It gives both sides
of the future integration one deterministic payload to implement and test,
without making Recursos a runtime dependency of Play.
"""

from __future__ import annotations

import hashlib
import json
from typing import Any
from urllib.parse import quote


SUPPORTED_TYPES = {"multiple-choice", "true-false", "memory", "matching", "classify", "ordering", "fill-blanks", "find-words", "drag-text", "mark-words", "dialog-cards", "crossword"}
PUBLIC_VISIBILITY = "public"
DEFAULT_LICENSE = "CC BY-SA"


class RecursosContractError(ValueError):
    """The activity cannot be represented by the Recursos contract."""


def _text(value: Any, *, field: str, required: bool = False, limit: int = 5000) -> str:
    result = str(value or "").strip()
    if required and not result:
        raise RecursosContractError(f"{field} is required")
    return result[:limit]


def _tags(value: Any) -> list[str]:
    if value is None:
        return []
    if not isinstance(value, list):
        raise RecursosContractError("tags must be a list")
    return list(dict.fromkeys(_text(item, field="tag", limit=80) for item in value if str(item).strip()))[:20]


def activity_version(activity: dict[str, Any]) -> str:
    """Return a stable version for idempotent publication and updates."""

    canonical = json.dumps(activity, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16]


def build_publish_payload(
    activity: dict[str, Any],
    *,
    public_base_url: str,
    author_pseudonym: str = "",
) -> dict[str, Any]:
    """Build the versioned Recursos publication payload without network I/O.

    Only public activities are eligible.  The H5P package remains downloadable
    from Play; Recursos may later choose upload, signed URL, or shared storage.
    """

    activity_id = _text(activity.get("id"), field="activity_id", required=True, limit=64)
    activity_type = _text(activity.get("type"), field="type", required=True, limit=40)
    if activity_type not in SUPPORTED_TYPES:
        raise RecursosContractError(f"unsupported activity type: {activity_type}")
    if activity.get("visibility", PUBLIC_VISIBILITY) != PUBLIC_VISIBILITY:
        raise RecursosContractError("only public activities can be published to Recursos")

    base = public_base_url.rstrip("/")
    if not base:
        raise RecursosContractError("public_base_url is required")
    version = activity_version(activity)
    metadata = {
        "title": _text(activity.get("title"), field="title", required=True, limit=200),
        "description": _text(activity.get("description"), field="description", limit=2000),
        "type": activity_type,
        "language": _text(activity.get("language") or "es", field="language", limit=12),
        "subject": _text(activity.get("subject"), field="subject", limit=120),
        "educational_stage": _text(activity.get("educational_stage"), field="educational_stage", limit=120),
        "tags": _tags(activity.get("tags")),
        "license": _text(activity.get("license") or DEFAULT_LICENSE, field="license", limit=80),
        "author_pseudonym": _text(author_pseudonym or activity.get("author_pseudonym"), field="author_pseudonym", limit=120),
    }
    return {
        "contract_version": "1",
        "external_id": f"edutictac-play:{activity_id}",
        "version": version,
        "idempotency_key": f"edutictac-play:{activity_id}:{version}",
        "metadata": metadata,
        "visibility": PUBLIC_VISIBILITY,
        "canonical_url": f"{base}/play/{quote(activity_id)}",
        "download_url": f"{base}/play/api/activities/{quote(activity_id)}/download",
        "package": {"format": "h5p", "delivery": "download_url"},
    }
