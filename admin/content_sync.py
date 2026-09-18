"""Download and atomically stage one channel of the shared content catalogue."""

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path, PurePosixPath


CHANNELS = {"resources", "eduhoot"}
VERSION_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$")
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


def _text(value, field):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} must be a non-empty string")
    return value.strip()


def _relative_path(value, field):
    path = _text(value, field)
    candidate = PurePosixPath(path)
    if candidate.is_absolute() or ".." in candidate.parts or "\\" in path:
        raise ValueError(f"{field} must be a safe relative path")
    return path


def _validate_manifest(payload, channel):
    if not isinstance(payload, dict) or payload.get("schema_version") != 1:
        raise ValueError("manifest schema_version must be 1")
    version = _text(payload.get("catalog_version"), "catalog_version")
    if not VERSION_RE.fullmatch(version):
        raise ValueError("catalog_version contains unsupported characters")
    _text(payload.get("published_at"), "published_at")
    _text(payload.get("source"), "source")
    items = payload.get("items")
    if not isinstance(items, list):
        raise ValueError("manifest items must be an array")
    selected = []
    seen = set()
    for item in items:
        if not isinstance(item, dict):
            raise ValueError("manifest item must be an object")
        item_channel = _text(item.get("channel"), "item.channel")
        if item_channel not in CHANNELS:
            raise ValueError("item.channel must be resources or eduhoot")
        if item_channel != channel:
            continue
        item_id = _text(item.get("id"), "item.id")
        key = (item_channel, item_id)
        if key in seen:
            raise ValueError(f"duplicate item: {item_channel}/{item_id}")
        seen.add(key)
        _text(item.get("title"), "item.title")
        _text(item.get("language"), "item.language")
        _text(item.get("license"), "item.license")
        if not isinstance(item.get("revision"), int) or item["revision"] < 1:
            raise ValueError("item.revision must be a positive integer")
        artifact = item.get("artifact")
        if not isinstance(artifact, dict):
            raise ValueError("item.artifact must be an object")
        path = _relative_path(artifact.get("path"), "artifact.path")
        digest = _text(artifact.get("sha256"), "artifact.sha256").lower()
        if not SHA256_RE.fullmatch(digest):
            raise ValueError("artifact.sha256 must be a SHA-256 hex digest")
        _text(artifact.get("media_type"), "artifact.media_type")
        selected.append((item, path, digest))
    return version, selected


def _download(url, destination, timeout):
    request = urllib.request.Request(url, headers={"Accept": "application/json, application/octet-stream"})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response, destination.open("wb") as output:
            shutil.copyfileobj(response, output)
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"catalogue returned HTTP {exc.code}: {url}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"catalogue unavailable: {exc.reason}") from exc


def sync_channel(channel, base_url, sync_dir, timeout=20):
    if channel not in CHANNELS:
        raise ValueError("unsupported content channel")
    base_url = _text(base_url, "content catalogue URL").rstrip("/") + "/"
    sync_dir = Path(sync_dir)
    sync_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=f"{channel}-", dir=sync_dir) as temporary:
        staging = Path(temporary)
        manifest_path = staging / "manifest.json"
        _download(urllib.parse.urljoin(base_url, "manifest.json"), manifest_path, timeout)
        try:
            payload = json.loads(manifest_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise ValueError(f"invalid catalogue manifest: {exc}") from exc
        version, selected = _validate_manifest(payload, channel)
        channel_manifest = dict(payload)
        channel_manifest["items"] = [item for item, _, _ in selected]
        manifest_path.write_text(json.dumps(channel_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        for _, relative_path, digest in selected:
            target = staging / relative_path
            target.parent.mkdir(parents=True, exist_ok=True)
            _download(urllib.parse.urljoin(base_url, relative_path), target, timeout)
            actual = hashlib.sha256(target.read_bytes()).hexdigest()
            if actual != digest:
                raise ValueError(f"artifact hash mismatch: {relative_path}")
        final_dir = sync_dir / channel / version
        final_dir.parent.mkdir(parents=True, exist_ok=True)
        if final_dir.exists():
            shutil.rmtree(staging)
        else:
            os.replace(staging, final_dir)
        current = final_dir.parent / "current"
        temporary_link = final_dir.parent / f".current-{os.getpid()}"
        temporary_link.unlink(missing_ok=True)
        temporary_link.symlink_to(final_dir.name)
        os.replace(temporary_link, current)
    return {"channel": channel, "version": version, "items": len(selected), "path": str(final_dir)}
