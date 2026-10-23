"""Coordinate new supervised sessions with host module maintenance."""
from contextlib import contextmanager
import fcntl
import os
import json
from pathlib import Path

from fastapi import HTTPException


def public_modules():
    allowed = {"play", "eduhoot", "recursos", "blocs", "llibres", "quiosc"}
    profiles = set(os.environ.get("COMMONS_MODULE_PROFILES", "play").split(",")) & allowed
    if os.environ.get("QUIOSC_MODE", "disabled") != "disabled":
        profiles.add("quiosc")
    path = Path(os.environ.get("EDUTICTAC_ID_DB", "/data/id.db")).parent / "modules.json"
    try:
        state = json.loads(path.read_text())
        if state.get("schema") == 1 and isinstance(state.get("enabled"), list) and all(isinstance(item, str) and item in allowed for item in state["enabled"]):
            profiles = set(state["enabled"])
    except (OSError, ValueError, TypeError, AttributeError):
        pass
    return {"enabled": sorted(profiles)}


@contextmanager
def quiosc_start_guard():
    path = Path(os.environ.get("EDUTICTAC_ID_DB", "/data/id.db")).parent / ".modules-quiosc.lock"
    descriptor = os.open(path, os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o644)
    try:
        try:
            fcntl.flock(descriptor, fcntl.LOCK_SH | fcntl.LOCK_NB)
        except BlockingIOError:
            raise HTTPException(409, "maintenance_in_progress") from None
        yield
    finally:
        os.close(descriptor)
