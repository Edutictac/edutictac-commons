"""Matriu d'accés docent a aules: cada ruta contra cada perfil, amb galetes reals.

Cada cas usa una SQLite nova i dades sintètiques. El perfil `former` va crear
una assignació mentre col·laborava i després va eixir de l'aula: ja no hi
té cap accés, tampoc a les assignacions que va crear.
"""
import importlib.util
import json
import os
import shutil
import sqlite3
import sys
from contextlib import closing
from pathlib import Path

import pytest
from fastapi import Response
from fastapi.testclient import TestClient

ROOT = Path(__file__).parents[1] / "services/id-api"
ACTORS = ["owner", "member", "former", "stranger", "admin"]
CASES = {
    "files.list": ("GET", "/api/teacher/groups/G/files", None),
    "members.list": ("GET", "/api/teacher/groups/G/members", None),
    "members.add": ("POST", "/api/teacher/groups/G/members", {"teacher_id": "newbie"}),
    "members.remove": ("DELETE", "/api/teacher/groups/G/members/member", None),
    "group.delete": ("DELETE", "/api/teacher/groups/G", None),
    "identities.add": ("POST", "/api/teacher/groups/G/identities", {"count": 1}),
    "identity.pin": ("POST", "/api/identities/i1/regenerate-pin", None),
    "identity.revoke": ("POST", "/api/identities/i1/revoke", None),
    "summary": ("GET", "/api/teacher/summary", None),
    "identities.list": ("GET", "/api/teacher/identities", None),
    "identity.by_code": ("GET", "/api/teacher/identities/by-code/ABC", None),
    "cards": ("GET", "/api/groups/G/cards", None),
    "codes.csv": ("GET", "/api/groups/G/csv", None),
    "roster": ("POST", "/api/apps/play/roster", {"group_id": "G"}),
    "assignment.create": ("POST", "/api/teacher/activity-assignments", {"group_id": "G", "app_id": "play", "activity_id": "x1"}),
    "assignments.list": ("GET", "/api/teacher/activity-assignments", None),
    "results.former": ("GET", "/api/teacher/activity-assignments/aG1/results", None),
    "results.owner": ("GET", "/api/teacher/activity-assignments/aG2/results", None),
    "complete": ("POST", "/api/teacher/activity-assignments/aG1/students/i1/complete", None),
    "stats.csv": ("GET", "/api/teacher/stats.csv", None),
    "itinerary.create": ("POST", "/api/teacher/itineraries", {"title": "T", "group_id": "G"}),
    "itineraries.list": ("GET", "/api/teacher/itineraries", None),
    "itinerary.select": ("PUT", "/api/teacher/groups/G/itinerary", {"itinerary_id": None, "expected_itinerary_id": "itG"}),
    "itinerary.add": ("POST", "/api/teacher/itineraries/itG/items", {"assignment_id": "aG1"}),
    "itinerary.replace": ("PUT", "/api/teacher/itineraries/itG/items", {"assignment_ids": [], "expected_assignment_ids": ["aG2"]}),
    "owner.transfer": ("PUT", "/api/teacher/groups/G/owner", {"teacher_id": "member", "expected_owner_id": "owner"}),
    "members.add_owner": ("POST", "/api/teacher/groups/G/members", {"teacher_id": "newbie", "role": "owner"}),
    "admin.groups": ("GET", "/api/admin/groups", None),
}

# Estat HTTP i, quan escau, quants elements veu cada perfil. Administració
# gestiona aules (col·laboradors, propietat, baixa) però no hi fa treball
# pedagògic. Qualsevol canvi d'accés ha de modificar esta taula.
EXPECTED = {
    "files.list": {"owner": [200, 2], "member": [200, 2], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    # cas: owner, member, former, stranger, admin
    "members.list": {"owner": [200, 2], "member": [404, None], "former": [404, None], "stranger": [404, None], "admin": [200, 2]},
    "members.add": {"owner": [201, None], "member": [404, None], "former": [404, None], "stranger": [404, None], "admin": [201, None]},
    "members.remove": {"owner": [200, None], "member": [404, None], "former": [404, None], "stranger": [404, None], "admin": [200, None]},
    "group.delete": {"owner": [200, None], "member": [404, None], "former": [404, None], "stranger": [404, None], "admin": [200, None]},
    "identities.add": {"owner": [201, 1], "member": [201, 1], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "identity.pin": {"owner": [200, None], "member": [200, None], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "identity.revoke": {"owner": [200, None], "member": [200, None], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "summary": {"owner": [200, 1], "member": [200, 1], "former": [200, 0], "stranger": [200, 1], "admin": [200, 0]},
    "identities.list": {"owner": [200, 1], "member": [200, 1], "former": [200, 0], "stranger": [200, 1], "admin": [200, 0]},
    "identity.by_code": {"owner": [200, None], "member": [200, None], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "cards": {"owner": [200, 13], "member": [200, 13], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "codes.csv": {"owner": [200, 2], "member": [200, 2], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "roster": {"owner": [200, 1], "member": [200, 1], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "assignment.create": {"owner": [201, None], "member": [201, None], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "assignments.list": {"owner": [200, 2], "member": [200, 2], "former": [200, 0], "stranger": [200, 1], "admin": [200, 0]},
    "results.former": {"owner": [200, 1], "member": [200, 1], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "results.owner": {"owner": [200, 1], "member": [200, 1], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "complete": {"owner": [201, None], "member": [201, None], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "stats.csv": {"owner": [200, 2], "member": [200, 2], "former": [200, 1], "stranger": [200, 2], "admin": [200, 1]},
    "itinerary.create": {"owner": [201, None], "member": [201, None], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "itineraries.list": {"owner": [200, 1], "member": [200, 1], "former": [200, 0], "stranger": [200, 1], "admin": [200, 0]},
    "itinerary.select": {"owner": [200, None], "member": [200, None], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "itinerary.add": {"owner": [201, None], "member": [201, None], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "itinerary.replace": {"owner": [200, None], "member": [200, None], "former": [404, None], "stranger": [404, None], "admin": [404, None]},
    "owner.transfer": {"owner": [200, 2], "member": [404, None], "former": [404, None], "stranger": [404, None], "admin": [200, 2]},
    "members.add_owner": {"owner": [422, None], "member": [422, None], "former": [422, None], "stranger": [422, None], "admin": [422, None]},
    "admin.groups": {"owner": [403, None], "member": [403, None], "former": [403, None], "stranger": [403, None], "admin": [200, 2]},
}


def load(tmp_path, monkeypatch):
    """Carrega l'API una sola vegada i guarda una còpia neta de la base."""
    monkeypatch.syspath_prepend(str(ROOT / "vendor"))
    monkeypatch.syspath_prepend(str(ROOT))
    monkeypatch.setenv("EDUTICTAC_ID_DB", str(tmp_path / "id.db"))
    monkeypatch.setenv("EDUTICTAC_ID_SECRET", "synthetic-access-matrix-signing-key")
    monkeypatch.setenv("EDUTICTAC_ID_TEACHER_TOKEN", "synthetic-access-matrix-token")
    monkeypatch.setenv("EDUTICTAC_ID_COOKIE_SECURE", "0")
    monkeypatch.setenv("EDUTICTAC_ID_OIDC_ISSUER_URL", "https://identity.test/application/o/commons")
    spec = importlib.util.spec_from_file_location("access_matrix_api", ROOT / "main.py")
    module = importlib.util.module_from_spec(spec)
    monkeypatch.setitem(sys.modules, spec.name, module)
    spec.loader.exec_module(module)
    with module.get_conn() as db:
        db.executescript(
            """
            INSERT INTO groups VALUES ('G', 'GAAAAA', 't', 'owner', '2026', '2026');
            INSERT INTO groups VALUES ('H', 'GBBBBB', 't', 'stranger', '2026', '2026');
            INSERT INTO group_memberships VALUES ('G', 'owner', 'owner', '2026');
            INSERT INTO group_memberships VALUES ('G', 'member', 'teacher', '2026');
            INSERT INTO group_memberships VALUES ('H', 'stranger', 'owner', '2026');
            INSERT INTO student_identities (id, group_id, public_code, pin_hash, created_at, updated_at)
                VALUES ('i1', 'G', 'ABC', 'unused', '2026', '2026'), ('i2', 'H', 'DEF', 'unused', '2026', '2026');
            INSERT INTO activity_assignments (id, app_id, activity_id, title, group_id, created_by_teacher_id, created_at, updated_at)
                VALUES ('aG1', 'play', 'a1', 'Former', 'G', 'former', '2026-01', '2026'),
                       ('aG2', 'play', 'a2', 'Owner', 'G', 'owner', '2026-02', '2026'),
                       ('aH', 'play', 'a3', 'Other', 'H', 'stranger', '2026-03', '2026');
            INSERT INTO scores (id, identity_id, assignment_id, app_id, activity_id, score, created_at)
                VALUES ('s1', 'i1', 'aG1', 'play', 'a1', 5, '2026'), ('s2', 'i2', 'aH', 'play', 'a3', 9, '2026');
            INSERT INTO itineraries VALUES ('itG', 'G route', 'G', 'owner', 1, '2026', '2026');
            INSERT INTO itineraries VALUES ('itH', 'H route', 'H', 'stranger', 1, '2026', '2026');
            INSERT INTO itinerary_items VALUES ('itG', 'aG2', 0, '2026'), ('itH', 'aH', 0, '2026');
            INSERT INTO group_itinerary_selection VALUES ('G', 'itG'), ('H', 'itH');
            """
        )
    with module.get_conn() as db:
        for file_id,scope,identity in [('shared','shared',None),('private','submission','i1')]:
            db.execute("INSERT INTO classroom_files VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1)",
                       (file_id,'G',scope,identity,'owner',file_id+'.txt','unavailable/'+file_id+'.txt','application/octet-stream',4,'a'*64,'2026','2026'))
    return module


def client_for(module, actor):
    response = Response()
    if actor == "admin":
        module.set_oidc_cookie(response, {"iss": module.OIDC_ISSUER_URL, "sub": "synthetic-admin"}, "administrador")
    else:
        response.set_cookie("edutictac_teacher", module.make_cookie({"teacher": True, "teacher_id": actor}))
    client = TestClient(module.app)
    client.headers["Cookie"] = response.headers["set-cookie"].split(";")[0]
    client.headers["Origin"] = "http://testserver"
    return client


def visible(response):
    """Resum estable del que veu el perfil, sense dependre d'identificadors aleatoris."""
    if response.status_code >= 300:
        return None
    if response.headers.get("content-type", "").startswith("text/"):
        return len(response.text.strip().splitlines())
    body = response.json()
    for key in ("members", "identities", "assignments", "itineraries", "results", "files"):
        if isinstance(body, dict) and isinstance(body.get(key), list):
            return len(body[key])
    if isinstance(body, dict) and "total" in body:
        return body["total"]
    if isinstance(body, dict) and isinstance(body.get("groups"), list):
        return len(body["groups"])
    return None


@pytest.fixture(scope="module")
def api(tmp_path_factory):
    patcher = pytest.MonkeyPatch()
    path = tmp_path_factory.mktemp("access-matrix")
    module = load(path, patcher)
    pristine = path / "pristine.db"
    with module.get_conn() as db:
        db.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    shutil.copy(module.DB_PATH, pristine)
    yield module, pristine
    patcher.undo()


def observe(api, case, actor):
    module, pristine = api
    # La còpia es restaura per l'API de SQLite: les connexions obertes la veuen neta.
    with closing(sqlite3.connect(pristine)) as source, closing(sqlite3.connect(module.DB_PATH)) as target:
        source.backup(target)
    method, path, body = CASES[case]
    response = client_for(module, actor).request(method, path, json=body)
    return [response.status_code, visible(response)]


@pytest.mark.parametrize("actor", ACTORS)
@pytest.mark.parametrize("case", list(CASES))
def test_group_access_matrix(api, case, actor):
    observed = observe(api, case, actor)
    record = os.environ.get("RECORD_ACCESS_MATRIX")
    if record:
        with open(record, "a", encoding="utf-8") as out:
            out.write(json.dumps([case, actor, observed]) + "\n")
        return
    assert observed == EXPECTED[case][actor]


def test_admin_rescues_orphaned_classroom_without_reading_pupil_data(api):
    """La propietària se'n va: administració traspassa l'aula i ella en perd l'accés."""
    module, pristine = api
    with closing(sqlite3.connect(pristine)) as source, closing(sqlite3.connect(module.DB_PATH)) as target:
        source.backup(target)
    admin, owner, member = (client_for(module, actor) for actor in ("admin", "owner", "member"))

    listed = {group["id"]: group for group in admin.get("/api/admin/groups").json()["groups"]}
    assert listed["G"]["owner_id"] == "owner" and listed["G"]["collaborators"] == 1
    assert set(listed["G"]) == {"id", "group_code", "tenant_id", "owner_id", "collaborators", "created_at"}
    assert admin.get("/api/teacher/activity-assignments/aG2/results").status_code == 404

    stale = admin.put("/api/teacher/groups/G/owner", json={"teacher_id": "member", "expected_owner_id": "someone"})
    assert stale.status_code == 409
    moved = admin.put("/api/teacher/groups/G/owner", json={"teacher_id": "member", "expected_owner_id": "owner"})
    assert moved.status_code == 200
    assert {(m["teacher_id"], m["role"]) for m in moved.json()["members"]} == {("member", "owner"), ("owner", "teacher")}

    # La nova propietària gestiona l'aula; l'anterior ja no pot.
    assert owner.get("/api/teacher/groups/G/members").status_code == 404
    assert member.delete("/api/teacher/groups/G/members/owner").status_code == 200
    assert owner.get("/api/teacher/activity-assignments/aG2/results").status_code == 404
    assert member.get("/api/teacher/activity-assignments/aG2/results").status_code == 200
