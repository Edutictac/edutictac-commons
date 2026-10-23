#!/usr/bin/env python3
"""Detect available Docker/OCI image updates for EduTicTac Commons."""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT / ".env"
ENV_EXAMPLE = ROOT / ".env.example"
COMMON_IMAGES = ["commons-id-api", "commons-portal", "commons-admin", "commons-play", "commons-blocs", "commons-llibres"]
RECURSOS_IMAGES = ["recursos", "recursos-api"]


def read_env() -> dict[str, str]:
    env: dict[str, str] = {}
    source = ENV_FILE if ENV_FILE.is_file() else ENV_EXAMPLE
    try:
        for line in source.read_text().splitlines():
            if not line or line.lstrip().startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            env[key.strip()] = value.strip()
    except OSError:
        pass
    for key in [
        "IMAGE_REGISTRY",
        "IMAGE_TAG",
        "EDUHOOT_TAG",
        "RECURSOS_TAG",
        "COMPOSE_PROFILES",
        "UPDATE_CHANNEL",
        "REGISTRY_USERNAME",
        "REGISTRY_PASSWORD",
    ]:
        if os.environ.get(key):
            env[key] = os.environ[key]
    return env


def registry_url(registry: str, image: str) -> str:
    if "." not in registry and ":" not in registry and registry != "localhost":
        return f"https://registry.hub.docker.com/v2/repositories/{registry}/{image}/tags?page_size=100"
    host, _, prefix = registry.partition("/")
    repo = f"{prefix}/{image}" if prefix else image
    return f"https://{host}/v2/{repo}/tags/list"


def parse_www_authenticate(header: str) -> dict[str, str]:
    """Parse a `Bearer realm="...",service="...",scope="..."` challenge header."""
    params: dict[str, str] = {}
    if not header:
        return params
    _, _, rest = header.partition(" ")
    for part in rest.split(","):
        if "=" not in part:
            continue
        key, value = part.split("=", 1)
        params[key.strip()] = value.strip().strip('"')
    return params


def fetch_bearer_token(realm: str, service: str, scope: str, username: str, password: str) -> str:
    params = {k: v for k, v in (("service", service), ("scope", scope)) if v}
    url = realm + ("?" + urllib.parse.urlencode(params) if params else "")
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    if username and password:
        credentials = base64.b64encode(f"{username}:{password}".encode("utf-8")).decode("ascii")
        req.add_header("Authorization", f"Basic {credentials}")
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return str(data.get("token") or data.get("access_token") or "")


def fetch_tags(registry: str, image: str, username: str = "", password: str = "") -> list[str]:
    url = registry_url(registry, image)
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        if exc.code != 401:
            raise
        challenge = parse_www_authenticate(exc.headers.get("WWW-Authenticate", "") if exc.headers else "")
        realm = challenge.get("realm")
        if not realm:
            raise
        token = fetch_bearer_token(realm, challenge.get("service", ""), challenge.get("scope", ""), username, password)
        if not token:
            raise
        req = urllib.request.Request(
            url, headers={"Accept": "application/json", "Authorization": f"Bearer {token}"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    if "results" in data:
        return [str(item.get("name", "")) for item in data.get("results", []) if item.get("name")]
    return [str(tag) for tag in data.get("tags", []) if tag]


SEMVER_RE = re.compile(r"^v?(\d+)\.(\d+)\.(\d+)(?:[-.]([0-9A-Za-z.-]+))?$")


def semver_key(tag: str) -> tuple[int, int, int, int, str]:
    match = SEMVER_RE.match(tag)
    if not match:
        return (-1, -1, -1, -1, tag)
    major, minor, patch = (int(match.group(i)) for i in range(1, 4))
    prerelease = match.group(4) or ""
    stable_rank = 1 if not prerelease else 0
    return (major, minor, patch, stable_rank, prerelease)


def channel_match(tag: str, channel: str) -> bool:
    match = SEMVER_RE.match(tag)
    if channel == "dev":
        return bool(tag and tag != "latest")
    if not match:
        return False
    prerelease = match.group(4) or ""
    if channel == "stable":
        return not prerelease
    return True


def choose_intersection_update(
    registry: str, images: list[str], current: str, channel: str, username: str = "", password: str = ""
) -> dict[str, object]:
    """Tria la versio mes recent publicada per a TOTES les imatges donades
    (interseccio de tags), util quan varies imatges es publiquen sempre
    juntes amb el mateix tag (bundle Commons, o recursos+recursos-api)."""
    try:
        tag_sets = {image: set(fetch_tags(registry, image, username, password)) for image in images}
    except (OSError, urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as exc:
        return {"current": current, "candidate": "", "update_available": False, "error": str(exc)}

    common_tags = set.intersection(*(tag_sets[image] for image in images))
    candidates = sorted((tag for tag in common_tags if channel_match(tag, channel)), key=semver_key, reverse=True)
    candidate = candidates[0] if candidates else ""
    return {
        "current": current,
        "candidate": candidate,
        "update_available": bool(candidate and semver_key(candidate) > semver_key(current)),
        "images": {image: sorted(tag_sets[image], key=semver_key, reverse=True)[:10] for image in images},
    }


def choose_single_update(
    registry: str, image: str, current: str, channel: str, username: str = "", password: str = ""
) -> dict[str, object]:
    try:
        tags = fetch_tags(registry, image, username, password)
    except (OSError, urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as exc:
        return {"current": current, "candidate": "", "update_available": False, "error": str(exc)}
    candidates = sorted((tag for tag in tags if channel_match(tag, channel)), key=semver_key, reverse=True)
    candidate = candidates[0] if candidates else ""
    return {
        "current": current,
        "candidate": candidate,
        "update_available": bool(candidate and semver_key(candidate) > semver_key(current)),
        "recent_tags": candidates[:10],
    }


def build_status() -> dict[str, object]:
    env = read_env()
    registry = env.get("IMAGE_REGISTRY") or "edutictac"
    channel = (env.get("UPDATE_CHANNEL") or "testing").strip().lower()
    if channel not in {"stable", "testing", "dev"}:
        channel = "testing"
    profiles = {p for p in (env.get("COMPOSE_PROFILES") or "").split(",") if p}
    username = env.get("REGISTRY_USERNAME") or ""
    password = env.get("REGISTRY_PASSWORD") or ""
    status: dict[str, object] = {
        "registry": registry,
        "channel": channel,
        "commons": choose_intersection_update(
            registry, COMMON_IMAGES, env.get("IMAGE_TAG") or "unknown", channel, username, password
        ),
        "eduhoot": None,
        "recursos": None,
    }
    if "eduhoot" in profiles:
        status["eduhoot"] = choose_single_update(
            registry, "eduhoot", env.get("EDUHOOT_TAG") or "unknown", channel, username, password
        )
    if "recursos" in profiles:
        status["recursos"] = choose_intersection_update(
            registry, RECURSOS_IMAGES, env.get("RECURSOS_TAG") or "unknown", channel, username, password
        )
    return status


def print_human(status: dict[str, object]) -> None:
    print(f"Registre: {status['registry']}")
    print(f"Canal: {status['channel']}")
    print()
    for name in ["commons", "eduhoot", "recursos"]:
        item = status.get(name)
        if not item:
            continue
        assert isinstance(item, dict)
        print(f"== {name} ==")
        if item.get("error"):
            print(f"ERROR: {item['error']}")
        else:
            print(f"Instal·lada: {item.get('current') or '-'}")
            print(f"Disponible: {item.get('candidate') or '-'}")
            print("Actualització: " + ("sí" if item.get("update_available") else "no"))
        print()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="write machine-readable JSON")
    args = parser.parse_args()
    status = build_status()
    if args.json:
        print(json.dumps(status, indent=2, sort_keys=True))
    else:
        print_human(status)
    return 0


if __name__ == "__main__":
    sys.exit(main())
