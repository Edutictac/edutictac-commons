"""L'interruptor administratiu governa el trasllat sense reiniciar l'API."""

import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).parents[1] / "services/id-api"
sys.path.insert(0, str(ROOT / "vendor"))
sys.path.insert(0, str(ROOT))

from idapi.app import create_app  # noqa: E402
from idapi.db import Database, MIGRATIONS, NAMESPACE, apply_migrations  # noqa: E402
from idapi.settings import Settings  # noqa: E402


def make_client(path, *, initial=False):
    settings = Settings(db_path=str(path), session_secret="synthetic-session-secret-for-tests",
                        teacher_token="synthetic-teacher-token", cookie_secure=False,
                        classroom_transfer_enabled=initial)
    app = create_app(settings)
    client = TestClient(app, headers={"Origin": "http://testserver"})
    return client, app.state.commons


def test_fresh_install_has_transfer_enabled_by_default(tmp_path):
    settings = Settings(db_path=str(tmp_path / "id.db"),
                        session_secret="synthetic-session-secret-for-tests",
                        teacher_token="synthetic-teacher-token", cookie_secure=False)
    assert Settings.from_env({}).classroom_transfer_enabled is True
    client = TestClient(create_app(settings),
                        headers={"Authorization": "Bearer synthetic-teacher-token"})
    assert client.get("/api/teacher/transfer/status").json() == {"enabled": True}
    with client.app.state.commons.connect() as conn:
        assert conn.execute("SELECT enabled FROM classroom_transfer_settings WHERE id=1").fetchone()[0] == 1


def test_beta63_database_upgrades_and_keeps_existing_group(tmp_path):
    path = tmp_path / "id.db"
    database = Database(str(path))
    with database.connect() as conn:
        apply_migrations(conn, NAMESPACE, MIGRATIONS[:4])
        conn.execute("""INSERT INTO groups (id, name, created_at, updated_at)
            VALUES ('existing', 'Aula existent', '2026', '2026')""")
    settings = Settings(db_path=str(path), session_secret="synthetic-session-secret-for-tests",
                        teacher_token="synthetic-teacher-token", cookie_secure=False)
    app = create_app(settings)
    with app.state.commons.connect() as conn:
        assert database.version() == 5
        assert conn.execute("SELECT name FROM groups WHERE id='existing'").fetchone()[0] == "Aula existent"
        assert conn.execute("SELECT enabled FROM classroom_transfer_settings WHERE id=1").fetchone()[0] == 1


def test_admin_can_toggle_and_setting_survives_restart(tmp_path, monkeypatch):
    path = tmp_path / "id.db"
    client, commons = make_client(path)
    route = "/api/admin/transfer/settings"
    assert client.get(route).status_code == 403
    assert client.put(route, json={"enabled": True}).status_code == 403
    monkeypatch.setattr(commons.auth, "is_oidc_admin", lambda request: True)
    monkeypatch.setattr(commons.auth, "oidc_cookie", lambda request: {"id": "oidc:test-admin"})
    assert client.get(route).json()["enabled"] is False
    assert client.put(route, json={"enabled": True, "unexpected": 1}).status_code == 422
    assert client.put(route, json={"enabled": True},
                      headers={"Origin": "http://elsewhere.invalid"}).status_code == 403
    assert client.put(route, json={"enabled": True},
                      headers={"Sec-Fetch-Site": "cross-site"}).status_code == 403
    response = client.put(route, json={"enabled": True})
    assert response.status_code == 200
    assert response.json()["enabled"] is True
    assert response.json()["updated_by"] == "oidc:test-admin"
    assert response.headers["cache-control"] == "no-store"
    client.headers["Authorization"] = "Bearer synthetic-teacher-token"
    assert client.get("/api/teacher/transfer/status").status_code == 200
    assert client.put(route, json={"enabled": False}).json()["enabled"] is False
    assert client.get("/api/teacher/transfer/status").status_code == 404

    restarted, new_commons = make_client(path, initial=True)
    monkeypatch.setattr(new_commons.auth, "is_oidc_admin", lambda request: True)
    monkeypatch.setattr(new_commons.auth, "oidc_cookie", lambda request: {"id": "oidc:test-admin"})
    assert restarted.get(route).json()["enabled"] is False


def test_legacy_environment_flag_sets_only_first_value(tmp_path, monkeypatch):
    path = tmp_path / "id.db"
    client, commons = make_client(path, initial=True)
    monkeypatch.setattr(commons.auth, "is_oidc_admin", lambda request: True)
    monkeypatch.setattr(commons.auth, "oidc_cookie", lambda request: {"id": "oidc:test-admin"})
    assert client.get("/api/admin/transfer/settings").json()["enabled"] is True
    assert client.put("/api/admin/transfer/settings", json={"enabled": False}).status_code == 200
    restarted, new_commons = make_client(path, initial=True)
    monkeypatch.setattr(new_commons.auth, "is_oidc_admin", lambda request: True)
    monkeypatch.setattr(new_commons.auth, "oidc_cookie", lambda request: {"id": "oidc:test-admin"})
    assert restarted.get("/api/admin/transfer/settings").json()["enabled"] is False
