"""Exercise itinerary editing against a disposable SQLite database."""
import importlib.util
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def api(tmp_path, monkeypatch):
    root = Path(__file__).parents[1] / "services/id-api"
    monkeypatch.syspath_prepend(str(root / "vendor"))
    monkeypatch.syspath_prepend(str(root))
    monkeypatch.setenv("EDUTICTAC_ID_DB", str(tmp_path / "id.db"))
    monkeypatch.setenv("EDUTICTAC_ID_SECRET", "test-only-session-secret")
    monkeypatch.setenv("EDUTICTAC_ID_TEACHER_TOKEN", "test-only-teacher")
    monkeypatch.setenv("EDUTICTAC_ID_COOKIE_SECURE", "0")
    spec = importlib.util.spec_from_file_location("itinerary_test_api", root / "main.py")
    module = importlib.util.module_from_spec(spec)
    # FastAPI resolves postponed annotations through the module registry.
    import sys
    monkeypatch.setitem(sys.modules, spec.name, module)
    spec.loader.exec_module(module)
    client = TestClient(module.app)
    client.headers["Authorization"] = "Bearer test-only-teacher"
    with module.get_conn() as conn:
        for group, teacher in [("group", "teacher-token"), ("other", "other-teacher")]:
            conn.execute("INSERT INTO groups VALUES (?, ?, 'test', ?, '2026-10-17', '2026-10-17')", (group, group, teacher))
        for assignment, group, active in [("a", "group", 1), ("b", "group", 1), ("c", "group", 1), ("foreign", "other", 1), ("inactive", "group", 0)]:
            conn.execute(
                """INSERT INTO activity_assignments
                (id, app_id, activity_id, title, group_id, created_by_teacher_id, active, created_at, updated_at)
                VALUES (?, 'play', ?, ?, ?, 'teacher-token', ?, '2026-10-17', '2026-10-17')""",
                (assignment, assignment, assignment, group, active),
            )
    itinerary = client.post("/api/teacher/itineraries", json={"title": "Science", "group_id": "group"}).json()["itinerary"]
    url = f'/api/teacher/itineraries/{itinerary["id"]}/items'
    for position, assignment in enumerate(["a", "b", "c"]):
        assert client.post(url, json={"assignment_id": assignment, "position": position * 10}).status_code == 201
    return client, module, url


def replace(client, url, ids, previous=None):
    return client.put(url, json={"assignment_ids": ids, "expected_assignment_ids": previous if previous is not None else ["a", "b", "c"]})


def test_order_reaches_student_and_removal_preserves_results(api, monkeypatch):
    client, module, url = api
    with module.get_conn() as conn:
        conn.execute("INSERT INTO student_identities (id, group_id, public_code, pin_hash, created_at, updated_at) VALUES ('pupil', 'group', 'ABC', 'unused', '2026-10-17', '2026-10-17')")
        conn.execute("INSERT INTO scores (id, identity_id, assignment_id, app_id, activity_id, score, created_at) VALUES ('score', 'pupil', 'a', 'play', 'a', 90, '2026-10-17')")
    monkeypatch.setattr(module, "current_identity", lambda request: {"id": "pupil", "group_id": "group"})
    response = replace(client, url, ["c", "a", "b"])
    assert response.status_code == 200
    assert response.json()["itinerary"]["is_selected"] is True
    assert [item["position"] for item in response.json()["itinerary"]["items"]] == [0, 1, 2]
    assert [item["id"] for item in client.get("/api/student/dashboard").json()["assignments"]] == ["c", "a", "b"]
    assert replace(client, url, ["c", "b"], ["c", "a", "b"]).status_code == 200
    assignments = client.get("/api/student/dashboard").json()["assignments"]
    assert [item["id"] for item in assignments] == ["c", "b", "a"]
    assert assignments[-1]["best_score"] == 90
    assert assignments[-1]["completed"] is True
    assert replace(client, url, [], ["c", "b"]).json()["itinerary"]["items"] == []
    assert len(client.get("/api/student/dashboard").json()["assignments"]) == 3
    first = selected_id(client)
    second = client.post("/api/teacher/itineraries", json={"title": "Revision", "group_id": "group"}).json()["itinerary"]["id"]
    assert select(client, second, first).status_code == 200
    dashboard = client.get("/api/student/dashboard").json()
    completed = next(item for item in dashboard["assignments"] if item["id"] == "a")
    assert completed["best_score"] == 90
    assert completed["completed"] is True


@pytest.mark.parametrize("ids,status", [(["a", "a"], 422), (["foreign"], 404), (["inactive"], 404), (["missing"], 404)])
def test_invalid_edit_is_atomic(api, ids, status):
    client, module, url = api
    assert replace(client, url, ids).status_code == status
    items = client.get("/api/teacher/itineraries?group_id=group").json()["itineraries"][0]["items"]
    assert [item["assignment_id"] for item in items] == ["a", "b", "c"]


def test_stale_edit_does_not_overwrite_collaborator(api):
    client, module, url = api
    assert replace(client, url, ["b", "a", "c"]).status_code == 200
    assert replace(client, url, ["a", "c"]).status_code == 409
    items = client.get("/api/teacher/itineraries?group_id=group").json()["itineraries"][0]["items"]
    assert [item["assignment_id"] for item in items] == ["b", "a", "c"]


def test_authentication_and_group_membership(api, monkeypatch):
    client, module, url = api
    del client.headers["Authorization"]
    assert replace(client, url, []).status_code == 401
    monkeypatch.setattr(module, "require_teacher", lambda request: "collaborator")
    assert replace(client, url, []).status_code == 404
    with module.get_conn() as conn:
        conn.execute("INSERT INTO group_memberships VALUES ('group', 'collaborator', 'teacher', '2026-10-17')")
    assert replace(client, url, ["b", "a", "c"]).status_code == 200
    with module.get_conn() as conn:
        conn.execute("DELETE FROM group_memberships WHERE teacher_id = 'collaborator'")
    assert replace(client, url, [], ["b", "a", "c"]).status_code == 404


def select(client, itinerary_id, previous, group="group"):
    return client.put(f"/api/teacher/groups/{group}/itinerary", json={
        "itinerary_id": itinerary_id, "expected_itinerary_id": previous,
    })


def selected_id(client):
    itineraries = client.get("/api/teacher/itineraries?group_id=group").json()["itineraries"]
    return next((item["id"] for item in itineraries if item["is_selected"]), None)


def test_selected_itinerary_controls_title_and_order_without_hiding_assignments(api, monkeypatch):
    client, module, url = api
    first = selected_id(client)
    second = client.post("/api/teacher/itineraries", json={"title": "Reading", "group_id": "group"}).json()["itinerary"]
    assert second["is_selected"] is False
    assert selected_id(client) == first
    second_url = f'/api/teacher/itineraries/{second["id"]}/items'
    assert client.post(second_url, json={"assignment_id": "c", "position": 0}).status_code == 201
    assert client.post(second_url, json={"assignment_id": "b", "position": 1}).status_code == 201
    monkeypatch.setattr(module, "current_identity", lambda request: {"id": "pupil", "group_id": "group"})
    assert select(client, second["id"], first).status_code == 200
    dashboard = client.get("/api/student/dashboard").json()
    assert dashboard["selected_itinerary"] == {"id": second["id"], "title": "Reading"}
    assert [item["id"] for item in dashboard["assignments"]] == ["c", "b", "a"]
    assert [item["itinerary_position"] for item in dashboard["assignments"]] == [0, 1, None]
    assert select(client, None, second["id"]).status_code == 200
    dashboard = client.get("/api/student/dashboard").json()
    assert dashboard["selected_itinerary"] is None
    assert len(dashboard["assignments"]) == 3
    assert all(item["itinerary_position"] is None for item in dashboard["assignments"])
    assert select(client, first, None).status_code == 200
    assert client.get("/api/student/dashboard").json()["selected_itinerary"]["title"] == "Science"


def test_selection_rejects_stale_foreign_and_inactive_itineraries(api):
    client, module, url = api
    first = selected_id(client)
    with module.get_conn() as conn:
        for itinerary_id, group, active in [("foreign-journey", "other", 1), ("inactive-journey", "group", 0)]:
            conn.execute("INSERT INTO itineraries VALUES (?, 'Other', ?, 'other-teacher', ?, '2026-10-17', '2026-10-17')", (itinerary_id, group, active))
    for target in ["foreign-journey", "inactive-journey", "missing"]:
        assert select(client, target, first).status_code == 404
        assert selected_id(client) == first
    assert select(client, None, first).status_code == 200
    assert select(client, first, first).status_code == 409
    assert selected_id(client) is None


def test_selection_requires_current_group_access(api, monkeypatch):
    client, module, url = api
    first = selected_id(client)
    del client.headers["Authorization"]
    assert select(client, None, first).status_code == 401
    monkeypatch.setattr(module, "require_teacher", lambda request: "collaborator")
    assert select(client, None, first).status_code == 404
    with module.get_conn() as conn:
        conn.execute("INSERT INTO group_memberships VALUES ('group', 'collaborator', 'teacher', '2026-10-17')")
    assert select(client, None, first).status_code == 200
    with module.get_conn() as conn:
        conn.execute("DELETE FROM group_memberships WHERE teacher_id = 'collaborator'")
    assert select(client, first, None).status_code == 404


def test_selection_migration_is_idempotent_and_preserves_explicit_none(api):
    client, module, url = api
    first = selected_id(client)
    second = client.post("/api/teacher/itineraries", json={"title": "Later", "group_id": "group"}).json()["itinerary"]["id"]
    with module.get_conn() as conn:
        # Simulate the previous database schema, before selection existed.
        conn.execute("DROP TABLE group_itinerary_selection")
        conn.execute("UPDATE itineraries SET updated_at = '2099-01-01' WHERE id = ?", (second,))
    module.init_db()
    assert selected_id(client) == second
    assert select(client, first, second).status_code == 200
    module.init_db()
    assert selected_id(client) == first
    assert select(client, None, first).status_code == 200
    module.init_db()
    assert selected_id(client) is None
    third = client.post("/api/teacher/itineraries", json={"title": "Third", "group_id": "group"}).json()["itinerary"]
    assert third["is_selected"] is False
    assert selected_id(client) is None


def test_inactive_selected_itinerary_can_be_replaced(api):
    client, module, url = api
    first = selected_id(client)
    second = client.post("/api/teacher/itineraries", json={"title": "New", "group_id": "group"}).json()["itinerary"]["id"]
    with module.get_conn() as conn:
        conn.execute("UPDATE itineraries SET active = 0 WHERE id = ?", (first,))
    assert selected_id(client) is None
    assert select(client, second, None).status_code == 200
    assert selected_id(client) == second


def test_student_cannot_see_other_group_title(api, monkeypatch):
    client, module, url = api
    monkeypatch.setattr(module, "current_identity", lambda request: {"id": "other-pupil", "group_id": "other"})
    dashboard = client.get("/api/student/dashboard").json()
    assert dashboard["selected_itinerary"] is None
    assert [item["id"] for item in dashboard["assignments"]] == ["foreign"]


def test_revoked_collaborator_cannot_access_even_the_itinerary_they_created(api, monkeypatch):
    client, module, url = api
    original_teacher = module.require_teacher
    with module.get_conn() as conn:
        conn.execute("INSERT INTO group_memberships VALUES ('group', 'collaborator', 'teacher', '2026-10-17')")
    monkeypatch.setattr(module, "require_teacher", lambda request: "collaborator")
    created = client.post("/api/teacher/itineraries", json={"title": "Collaborative", "group_id": "group"})
    assert created.status_code == 201
    itinerary_id = created.json()["itinerary"]["id"]
    items_url = f"/api/teacher/itineraries/{itinerary_id}/items"
    assert client.post(items_url, json={"assignment_id": "a"}).status_code == 201
    with module.get_conn() as conn:
        conn.execute("DELETE FROM group_memberships WHERE teacher_id = 'collaborator'")
    assert client.get("/api/teacher/itineraries?group_id=group").json()["itineraries"] == []
    assert client.post(items_url, json={"assignment_id": "b"}).status_code == 404
    assert replace(client, items_url, [], ["a"]).status_code == 404
    assert select(client, itinerary_id, selected_id(client)).status_code == 404
    monkeypatch.setattr(module, "require_teacher", original_teacher)
    # The group owner retains access even when somebody else created the itinerary.
    assert itinerary_id in {item["id"] for item in client.get("/api/teacher/itineraries?group_id=group").json()["itineraries"]}
    assert replace(client, items_url, ["b"], ["a"]).status_code == 200


def test_itinerary_title_cannot_be_blank(api):
    client, module, url = api
    assert client.post("/api/teacher/itineraries", json={"title": " \n\t ", "group_id": "group"}).status_code == 422
