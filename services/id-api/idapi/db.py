"""Connexió SQLite i migracions versionades de l'ID API.

Cada canvi d'esquema nou s'afig com una migració numerada al final de
`MIGRATIONS`; mai es modifica una migració ja publicada. La versió aplicada es
guarda en `_edutictac_migrations` amb l'espai de noms `id-api`, de manera que
una còpia restaurada indica a quina versió de l'esquema pertany.
"""

from __future__ import annotations

import sqlite3
from datetime import datetime, timezone

from edutictac_community.db import connect as db_connect
from edutictac_community.migrations import Migration, apply_migrations, current_version

NAMESPACE = "id-api"


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso_now() -> str:
    return now_utc().isoformat()


def _columns(conn: sqlite3.Connection, table: str) -> set[str]:
    return {row["name"] for row in conn.execute(f"PRAGMA table_info({table})").fetchall()}


def _baseline(conn: sqlite3.Connection) -> None:
    """Esquema de la beta1 i totes les actualitzacions anteriors a les migracions.

    Les bases existents no tenen cap versió registrada i poden vindre de
    qualsevol alpha: per això tot és idempotent i les columnes noves es
    comproven abans d'afegir-les.
    """
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS groups (
            id TEXT PRIMARY KEY,
            name TEXT DEFAULT '',
            tenant_id TEXT NOT NULL DEFAULT 'default',
            created_by_teacher_id TEXT DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS student_identities (
            id TEXT PRIMARY KEY,
            group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            public_code TEXT NOT NULL,
            pin_hash TEXT NOT NULL,
            active INTEGER NOT NULL DEFAULT 1,
            avatar_icon TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            pin_rotated_at TEXT,
            UNIQUE(group_id, public_code)
        );

        CREATE TABLE IF NOT EXISTS student_sessions (
            id TEXT PRIMARY KEY,
            identity_id TEXT NOT NULL REFERENCES student_identities(id) ON DELETE CASCADE,
            token_hash TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            revoked_at TEXT
        );

        CREATE TABLE IF NOT EXISTS scores (
            id TEXT PRIMARY KEY,
            identity_id TEXT NOT NULL REFERENCES student_identities(id) ON DELETE CASCADE,
            assignment_id TEXT DEFAULT '',
            app_id TEXT NOT NULL,
            activity_id TEXT NOT NULL,
            score INTEGER NOT NULL,
            result_id TEXT NOT NULL DEFAULT '',
            metadata_json TEXT NOT NULL DEFAULT '{}',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS activity_assignments (
            id TEXT PRIMARY KEY,
            app_id TEXT NOT NULL,
            activity_id TEXT NOT NULL,
            title TEXT NOT NULL DEFAULT '',
            launch_url TEXT NOT NULL DEFAULT '',
            group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            created_by_teacher_id TEXT NOT NULL DEFAULT '',
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS manual_completions (
            id TEXT PRIMARY KEY,
            assignment_id TEXT NOT NULL REFERENCES activity_assignments(id) ON DELETE CASCADE,
            identity_id TEXT NOT NULL REFERENCES student_identities(id) ON DELETE CASCADE,
            teacher_id TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            UNIQUE(assignment_id, identity_id)
        );

        CREATE TABLE IF NOT EXISTS itineraries (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            created_by_teacher_id TEXT NOT NULL,
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS itinerary_items (
            itinerary_id TEXT NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
            assignment_id TEXT NOT NULL REFERENCES activity_assignments(id) ON DELETE CASCADE,
            position INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            PRIMARY KEY(itinerary_id, assignment_id)
        );

        CREATE TABLE IF NOT EXISTS group_itinerary_selection (
            group_id TEXT PRIMARY KEY REFERENCES groups(id) ON DELETE CASCADE,
            itinerary_id TEXT REFERENCES itineraries(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS group_memberships (
            group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            teacher_id TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'teacher',
            created_at TEXT NOT NULL,
            PRIMARY KEY (group_id, teacher_id)
        );

        CREATE TABLE IF NOT EXISTS app_launch_tokens (
            id TEXT PRIMARY KEY,
            token_hash TEXT NOT NULL UNIQUE,
            identity_id TEXT NOT NULL REFERENCES student_identities(id) ON DELETE CASCADE,
            assignment_id TEXT NOT NULL REFERENCES activity_assignments(id) ON DELETE CASCADE,
            app_id TEXT NOT NULL,
            activity_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            consumed_at TEXT
        );

        CREATE TABLE IF NOT EXISTS installation_setup (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            activated_at TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_scores_rank
            ON scores(app_id, activity_id, score DESC, created_at ASC);
        CREATE INDEX IF NOT EXISTS idx_assignments_teacher
            ON activity_assignments(created_by_teacher_id, created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_assignments_group
            ON activity_assignments(group_id, active);
        CREATE INDEX IF NOT EXISTS idx_itineraries_group
            ON itineraries(group_id, active, updated_at DESC);
        CREATE INDEX IF NOT EXISTS idx_itinerary_items_order
            ON itinerary_items(itinerary_id, position);
        CREATE INDEX IF NOT EXISTS idx_sessions_identity
            ON student_sessions(identity_id);
        CREATE INDEX IF NOT EXISTS idx_identities_public_code
            ON student_identities(public_code);
        CREATE INDEX IF NOT EXISTS idx_launch_tokens_hash
            ON app_launch_tokens(token_hash);
        """
    )
    if "avatar_icon" not in _columns(conn, "student_identities"):
        conn.execute("ALTER TABLE student_identities ADD COLUMN avatar_icon TEXT NOT NULL DEFAULT ''")
    score_columns = _columns(conn, "scores")
    if "assignment_id" not in score_columns:
        conn.execute("ALTER TABLE scores ADD COLUMN assignment_id TEXT DEFAULT ''")
    if "launch_url" not in _columns(conn, "activity_assignments"):
        conn.execute("ALTER TABLE activity_assignments ADD COLUMN launch_url TEXT NOT NULL DEFAULT ''")
    conn.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_scores_assignment
            ON scores(assignment_id, score DESC, created_at ASC)
        """
    )
    conn.execute(
        """
        INSERT OR IGNORE INTO group_memberships (group_id, teacher_id, role, created_at)
        SELECT id, created_by_teacher_id, 'owner', created_at
        FROM groups
        WHERE created_by_teacher_id <> ''
        """
    )
    if "result_id" not in score_columns:
        conn.execute("ALTER TABLE scores ADD COLUMN result_id TEXT NOT NULL DEFAULT ''")
    # Els grups antics reben una selecció inicial una sola vegada. Un NULL
    # guardat és una decisió explícita del docent i no es torna a omplir.
    conn.execute(
        """INSERT OR IGNORE INTO group_itinerary_selection (group_id, itinerary_id)
        SELECT g.id, (SELECT i.id FROM itineraries i
                      WHERE i.group_id = g.id AND i.active = 1
                      ORDER BY i.updated_at DESC, i.created_at DESC, i.id LIMIT 1)
        FROM groups g
        WHERE EXISTS (SELECT 1 FROM itineraries i WHERE i.group_id = g.id AND i.active = 1)"""
    )
    conn.execute(
        """
        CREATE UNIQUE INDEX IF NOT EXISTS idx_scores_result_unique
            ON scores(identity_id, assignment_id, result_id)
            WHERE result_id <> ''
        """
    )


def _classroom_files(conn: sqlite3.Connection) -> None:
    if not conn.in_transaction:
        conn.execute("BEGIN IMMEDIATE")
    statements = """
        CREATE TABLE classroom_files (
            id TEXT PRIMARY KEY, group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            scope TEXT NOT NULL CHECK(scope IN ('shared','submission')),
            identity_id TEXT REFERENCES student_identities(id) ON DELETE CASCADE,
            uploaded_by_teacher_id TEXT NOT NULL DEFAULT '', relative_path TEXT NOT NULL,
            storage_name TEXT NOT NULL UNIQUE, content_type TEXT NOT NULL, size INTEGER NOT NULL CHECK(size>=0),
            sha256 TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
            active INTEGER NOT NULL DEFAULT 1,
            CHECK ((scope='shared' AND identity_id IS NULL) OR (scope='submission' AND identity_id IS NOT NULL))
        );
        CREATE UNIQUE INDEX idx_classroom_files_path ON classroom_files(group_id,scope,COALESCE(identity_id,''),relative_path) WHERE active=1;
        CREATE INDEX idx_classroom_files_group ON classroom_files(group_id,active);
        CREATE TABLE classroom_file_settings (
            id INTEGER PRIMARY KEY CHECK(id=1), max_file_bytes INTEGER NOT NULL,
            group_quota_bytes INTEGER NOT NULL, student_quota_bytes INTEGER NOT NULL,
            students_can_upload INTEGER NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL
        );
    """
    for statement in statements.split(";"):
        if statement.strip():
            conn.execute(statement)


def _oidc_sessions(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS oidc_sessions (
            id TEXT PRIMARY KEY,
            token_hash TEXT NOT NULL UNIQUE,
            issuer TEXT NOT NULL,
            subject TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            revoked_at TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_oidc_sessions_hash
            ON oidc_sessions(token_hash);
        CREATE INDEX IF NOT EXISTS idx_oidc_sessions_expiry
            ON oidc_sessions(expires_at);
        """
    )


def _group_labels(conn: sqlite3.Connection) -> None:
    if "label" not in _columns(conn, "groups"):
        conn.execute("ALTER TABLE groups ADD COLUMN label TEXT NOT NULL DEFAULT ''")


MIGRATIONS = [
    Migration(1, _baseline),
    Migration(2, _classroom_files),
    Migration(3, _group_labels),
]
SCHEMA_VERSION = MIGRATIONS[-1].version

# Namespace propi per poder afegir la sessió revocable sense xocar amb les
# migracions de l'aula que estan en altres branques.
OIDC_NAMESPACE = "id-api-oidc"
OIDC_MIGRATIONS = [Migration(1, _oidc_sessions)]


class Database:
    def __init__(self, path: str):
        self.path = path

    def connect(self) -> sqlite3.Connection:
        conn = db_connect(self.path)
        conn.execute("PRAGMA foreign_keys=ON;")
        return conn

    def migrate(self) -> int:
        with self.connect() as conn:
            apply_migrations(conn, OIDC_NAMESPACE, OIDC_MIGRATIONS)
            return apply_migrations(conn, NAMESPACE, MIGRATIONS)

    def version(self) -> int:
        with self.connect() as conn:
            return current_version(conn, NAMESPACE)
