"""Conexión SQLite compartida (WAL + Row factory)."""
import os
import sqlite3
from pathlib import Path

DEFAULT_BUSY_TIMEOUT_MS = 5000


def busy_timeout_ms() -> int:
    try:
        value = int(os.environ.get("EDUTICTAC_SQLITE_BUSY_TIMEOUT_MS", DEFAULT_BUSY_TIMEOUT_MS))
    except (TypeError, ValueError):
        return DEFAULT_BUSY_TIMEOUT_MS
    return max(0, min(value, 60000))


def connect(db_path: str) -> sqlite3.Connection:
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute(f"PRAGMA busy_timeout={busy_timeout_ms()};")
    return conn
