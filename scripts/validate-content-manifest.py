#!/usr/bin/env python3
"""Validate the versioned manifest used by the shared content catalogue."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path


HEX_SHA256 = re.compile(r"^[0-9a-f]{64}$")
CHANNELS = {"resources", "eduhoot"}


def fail(message: str) -> None:
    raise ValueError(message)


def text(value, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        fail(f"{field} must be a non-empty string")
    return value.strip()


def relative_artifact_path(value: str) -> str:
    path = text(value, "artifact.path")
    candidate = Path(path)
    if candidate.is_absolute() or ".." in candidate.parts:
        fail("artifact.path must be relative and cannot contain '..'")
    return path


def validate(manifest_path: Path, check_files: bool = False) -> dict:
    try:
        payload = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"cannot read manifest: {exc}")
    if not isinstance(payload, dict):
        fail("manifest must be an object")
    if payload.get("schema_version") != 1:
        fail("schema_version must be 1")
    text(payload.get("catalog_version"), "catalog_version")
    text(payload.get("published_at"), "published_at")
    text(payload.get("source"), "source")
    items = payload.get("items")
    if not isinstance(items, list):
        fail("items must be an array")

    seen = set()
    for index, item in enumerate(items):
        prefix = f"items[{index}]"
        if not isinstance(item, dict):
            fail(f"{prefix} must be an object")
        item_id = text(item.get("id"), f"{prefix}.id")
        channel = text(item.get("channel"), f"{prefix}.channel")
        if channel not in CHANNELS:
            fail(f"{prefix}.channel must be resources or eduhoot")
        key = (channel, item_id)
        if key in seen:
            fail(f"duplicate item: {channel}/{item_id}")
        seen.add(key)
        text(item.get("title"), f"{prefix}.title")
        text(item.get("language"), f"{prefix}.language")
        text(item.get("license"), f"{prefix}.license")
        if not isinstance(item.get("revision"), int) or item["revision"] < 1:
            fail(f"{prefix}.revision must be a positive integer")
        artifact = item.get("artifact")
        if not isinstance(artifact, dict):
            fail(f"{prefix}.artifact must be an object")
        path = relative_artifact_path(artifact.get("path"))
        digest = text(artifact.get("sha256"), f"{prefix}.artifact.sha256").lower()
        if not HEX_SHA256.fullmatch(digest):
            fail(f"{prefix}.artifact.sha256 must be a SHA-256 hex digest")
        text(artifact.get("media_type"), f"{prefix}.artifact.media_type")
        if check_files:
            artifact_path = manifest_path.parent / path
            if not artifact_path.is_file():
                fail(f"artifact does not exist: {path}")
            actual = hashlib.sha256(artifact_path.read_bytes()).hexdigest()
            if actual != digest:
                fail(f"artifact hash mismatch: {path}")
    return payload


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--check-files", action="store_true")
    args = parser.parse_args()
    try:
        payload = validate(args.manifest, args.check_files)
    except ValueError as exc:
        print(f"invalid content manifest: {exc}", file=sys.stderr)
        return 1
    print(f"valid content manifest: {payload['catalog_version']} ({len(payload['items'])} items)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
