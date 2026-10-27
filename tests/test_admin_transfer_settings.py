"""L'interruptor administratiu governa el trasllat sense reiniciar l'API."""

import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).parents[1] / "services/id-api"
sys.path.insert(0, str(ROOT / "vendor"))
sys.path.insert(0, str(ROOT))

from idapi.app import create_app  # noqa: E402
from idapi.settings import Settings  # noqa: E402


def make_client(path, *, initial=False):
    settings = Settings(db_path=str(path), session_secret="synthetic-session-secret-for-tests",
                        teacher_token="synthetic-teacher-token", cookie_secure=False,
                        classroom_transfer_enabled=initial)
    app = create_app(settings)
    client = TestClient(app, headers={"Origin": "http://testserver"})
    return client, app.state.commons


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
