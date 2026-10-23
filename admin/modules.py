"""Public module state and strict request validation (no credentials in state)."""
import hashlib
import json
from pathlib import Path

MODULES = ("play", "eduhoot", "recursos", "blocs", "llibres", "quiosc")
PROFILES = frozenset(MODULES[:-1])
SERVICES = {"play": ("play",), "eduhoot": ("eduhoot", "eduhoot-mongo"),
            "recursos": ("recursos", "recursos-api"), "blocs": ("blocs",),
            "llibres": ("llibres",), "quiosc": ()}


def selection(payload):
    if not isinstance(payload, dict) or set(payload) != {"enabled", "revision"}:
        raise ValueError("invalid_request")
    enabled, revision = payload["enabled"], payload["revision"]
    if (not isinstance(enabled, list) or len(enabled) > len(MODULES)
            or any(not isinstance(item, str) or item not in MODULES for item in enabled)
            or len(enabled) != len(set(enabled))):
        raise ValueError("invalid_modules")
    if not isinstance(revision, str) or len(revision) != 64 or any(c not in "0123456789abcdef" for c in revision):
        raise ValueError("invalid_revision")
    return sorted(enabled), revision


def revision(values):
    # Hash only non-secret settings, never the complete .env file.
    settings = {"profiles": sorted(filter(None, values.get("COMPOSE_PROFILES", "").split(","))),
                "quiosc": values.get("QUIOSC_MODE", "disabled"),
                "configured": values.get("MODULES_CONFIGURED", "1")}
    return hashlib.sha256(json.dumps(settings, sort_keys=True).encode()).hexdigest()


def snapshot(values, *, quiosc_ready=False, phase="idle", error=None):
    profiles = set(values.get("COMPOSE_PROFILES", "").split(","))
    enabled = sorted(PROFILES & profiles)
    if values.get("QUIOSC_MODE", "disabled") != "disabled":
        enabled.append("quiosc")
    return {"schema": 1, "configured": values.get("MODULES_CONFIGURED", "1") == "1",
            "revision": revision(values), "enabled": enabled, "phase": phase, "error": error,
            "available": {name: name != "quiosc" or quiosc_ready for name in MODULES},
            "required": ["portal", "identity", "admin", "authentik"]}


def load_public_state(path, fallback):
    try:
        value = json.loads(Path(path).read_text())
        enabled, _ = selection({"enabled": value["enabled"], "revision": value["revision"]})
        if value.get("schema") != 1 or not isinstance(value.get("available"), dict):
            raise ValueError("invalid_state")
        if value.get("phase") not in {"idle", "applying", "failed"} or not isinstance(value.get("configured"), bool):
            raise ValueError("invalid_state")
        return {"schema": 1, "configured": value["configured"], "revision": value["revision"],
                "enabled": enabled, "phase": value["phase"],
                "error": "operation_failed" if value.get("error") else None,
                "available": {name: value["available"].get(name) is True for name in MODULES},
                "required": ["portal", "identity", "admin", "authentik"]}
    except (OSError, ValueError, KeyError, TypeError):
        return fallback
