"""Migracions versionades de l'ID API sobre SQLite d'un sol ús."""
import sqlite3
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).parents[1] / "services/id-api"


@pytest.fixture
def db_module(monkeypatch):
    monkeypatch.syspath_prepend(str(ROOT / "vendor"))
    monkeypatch.syspath_prepend(str(ROOT))
    import idapi.db
    return sys.modules["idapi.db"]


def columns(path, table):
    with sqlite3.connect(path) as conn:
        return {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}


def test_new_database_records_current_version_once(tmp_path, db_module):
    database = db_module.Database(str(tmp_path / "id.db"))
    assert database.version() == 0
    assert database.migrate() == db_module.SCHEMA_VERSION
    with database.connect() as conn:
        conn.execute("INSERT INTO groups (id, created_at, updated_at) VALUES ('g', 'x', 'x')")
        # Una versió ja aplicada no es torna a executar en cada arrancada.
        conn.execute("DROP TABLE installation_setup")
    assert database.migrate() == db_module.SCHEMA_VERSION
    assert "id" not in columns(database.path, "installation_setup")
    assert database.version() == db_module.SCHEMA_VERSION


def test_legacy_alpha_database_is_upgraded_without_losing_data(tmp_path, db_module):
    path = tmp_path / "legacy.db"
    with sqlite3.connect(path) as conn:
        # Forma de les primeres alpha: sense icona, URL de llançament,
        # result_id ni membres de grup.
        conn.executescript(
            """
            CREATE TABLE groups (id TEXT PRIMARY KEY, name TEXT DEFAULT '', tenant_id TEXT NOT NULL DEFAULT 'default',
                created_by_teacher_id TEXT DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE student_identities (id TEXT PRIMARY KEY, group_id TEXT NOT NULL, public_code TEXT NOT NULL,
                pin_hash TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL, pin_rotated_at TEXT, UNIQUE(group_id, public_code));
            CREATE TABLE scores (id TEXT PRIMARY KEY, identity_id TEXT NOT NULL, app_id TEXT NOT NULL,
                activity_id TEXT NOT NULL, score INTEGER NOT NULL, metadata_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL);
            CREATE TABLE activity_assignments (id TEXT PRIMARY KEY, app_id TEXT NOT NULL, activity_id TEXT NOT NULL,
                title TEXT NOT NULL DEFAULT '', group_id TEXT NOT NULL, created_by_teacher_id TEXT NOT NULL DEFAULT '',
                active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            INSERT INTO groups VALUES ('g', 'GABCDE', 'centre', 'teacher-a', '2026-09-01', '2026-09-01');
            INSERT INTO student_identities VALUES ('i', 'g', 'ABC', 'hash', 1, '2026-09-01', '2026-09-01', NULL);
            INSERT INTO scores VALUES ('s', 'i', 'eduhoot', 'quiz', 7, '{}', '2026-09-02');
            """
        )
    database = db_module.Database(str(path))
    assert database.version() == 0
    assert database.migrate() == db_module.SCHEMA_VERSION
    assert {"avatar_icon"} <= columns(path, "student_identities")
    assert {"assignment_id", "result_id"} <= columns(path, "scores")
    assert "launch_url" in columns(path, "activity_assignments")
    with database.connect() as conn:
        assert conn.execute("SELECT score FROM scores WHERE id = 's'").fetchone()["score"] == 7
        assert conn.execute("SELECT public_code FROM student_identities").fetchone()["public_code"] == "ABC"
        owner = conn.execute("SELECT teacher_id, role FROM group_memberships WHERE group_id = 'g'").fetchone()
    assert (owner["teacher_id"], owner["role"]) == ("teacher-a", "owner")


def test_beta2_schema_upgrades_additively_to_classroom_files(tmp_path, db_module):
    from edutictac_community.migrations import apply_migrations
    database=db_module.Database(str(tmp_path/'beta2.db'))
    with database.connect() as conn:
        apply_migrations(conn,db_module.NAMESPACE,db_module.MIGRATIONS[:1])
        conn.execute("INSERT INTO groups (id,created_at,updated_at) VALUES ('previous','x','x')")
    assert database.version()==1
    assert database.migrate()==2
    with database.connect() as conn:
        assert conn.execute("SELECT id FROM groups WHERE id='previous'").fetchone()['id']=='previous'
        assert conn.execute('SELECT COUNT(*) FROM classroom_files').fetchone()[0]==0
    assert database.migrate()==2


def test_classroom_migration_rolls_back_incomplete_ddl(tmp_path,db_module):
    from edutictac_community.migrations import apply_migrations
    database=db_module.Database(str(tmp_path/'interrupted.db'))
    with database.connect() as conn:
        apply_migrations(conn,db_module.NAMESPACE,db_module.MIGRATIONS[:1])
        conn.execute('CREATE TABLE classroom_file_settings (unexpected TEXT)')
    with pytest.raises(sqlite3.OperationalError):database.migrate()
    assert database.version()==1
    assert columns(database.path,'classroom_files')==set()
    with database.connect() as conn:conn.execute('DROP TABLE classroom_file_settings')
    assert database.migrate()==2
