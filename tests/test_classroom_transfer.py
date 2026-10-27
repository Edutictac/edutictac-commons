"""Trasllat manual amb dos SQLite temporals i dades fictícies."""

import base64
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).parents[1] / "services/id-api"
sys.path.insert(0, str(ROOT / "vendor"))
sys.path.insert(0, str(ROOT))

from idapi.app import create_app  # noqa: E402
from idapi.settings import Settings  # noqa: E402


def client(tmp_path, name, *, enabled=True):
    settings = Settings(
        db_path=str(tmp_path / name / "id.db"),
        session_secret="synthetic-session-secret-for-tests",
        teacher_token="synthetic-teacher-token",
        cookie_secure=False,
        classroom_transfer_enabled=enabled,
    )
    (tmp_path / name).mkdir()
    app = create_app(settings)
    result = TestClient(app)
    result.headers.update({
        "Authorization": "Bearer synthetic-teacher-token",
        "Origin": "http://testserver",
    })
    return result, app.state.commons


def seed(commons):
    with commons.connect() as db:
        db.execute("""INSERT INTO groups
            (id,name,tenant_id,created_by_teacher_id,created_at,updated_at,label)
            VALUES ('g1','GTEST1','centre','teacher-token','2026','2026','Aula fictícia')""")
        db.execute("INSERT INTO group_memberships VALUES ('g1','teacher-token','owner','2026')")
        db.execute("""INSERT INTO student_identities
            (id,group_id,public_code,pin_hash,created_at,updated_at)
            VALUES ('p1','g1','ABC',?,'2026','2026')""", (commons.hash_pin("123456"),))
        db.execute("""INSERT INTO activity_assignments
            (id,app_id,activity_id,title,group_id,created_by_teacher_id,created_at,updated_at)
            VALUES ('a1','play','quiz','Qüestionari','g1','teacher-token','2026','2026')""")
        db.execute("""INSERT INTO scores
            (id,identity_id,assignment_id,app_id,activity_id,score,created_at)
            VALUES ('s1','p1','a1','play','quiz',8,'2026')""")
        db.execute("""INSERT INTO itineraries
            (id,title,group_id,created_by_teacher_id,created_at,updated_at)
            VALUES ('i1','Ruta','g1','teacher-token','2026','2026')""")
        db.execute("INSERT INTO itinerary_items VALUES ('i1','a1',0,'2026')")
        db.execute("INSERT INTO group_itinerary_selection VALUES ('g1','i1')")


def test_export_import_new_group_and_reject_duplicate(tmp_path):
    source, source_db = client(tmp_path, "source")
    target, target_db = client(tmp_path, "target")
    seed(source_db)
    exported = source.post("/api/teacher/groups/g1/transfer/export")
    assert exported.status_code == 200
    assert exported.headers["cache-control"] == "no-store"
    package = exported.json()
    assert "Qüestionari" not in package["package"]
    imported = target.post("/api/teacher/groups/transfer/import", json=package)
    assert imported.status_code == 201, imported.text
    with target_db.connect() as db:
        assert db.execute("SELECT label FROM groups WHERE id='g1'").fetchone()[0] == 'Aula fictícia'
        assert db.execute("SELECT COUNT(*) FROM student_identities WHERE group_id='g1'").fetchone()[0] == 1
        assert db.execute("SELECT score FROM scores WHERE id='s1'").fetchone()[0] == 8
        assert db.execute("SELECT itinerary_id FROM group_itinerary_selection WHERE group_id='g1'").fetchone()[0] == "i1"
        assert db.execute("SELECT COUNT(*) FROM student_sessions").fetchone()[0] == 0
    login = target.post("/api/auth/student", json={"group_id": "g1", "public_code": "ABC", "pin": "123456"})
    assert login.status_code == 200
    assert target.post("/api/teacher/groups/transfer/import", json=package).status_code == 409


def test_wrong_key_tampering_and_source_permissions(tmp_path):
    source, db = client(tmp_path, "source")
    target, target_db = client(tmp_path, "target")
    seed(db)
    endpoint = "/api/teacher/groups/g1/transfer/export"
    source.headers.pop("Authorization")
    assert source.post(endpoint).status_code == 401
    source.headers["Authorization"] = "Bearer synthetic-teacher-token"
    package = source.post(endpoint).json()
    db.settings.oidc_issuer_url = "https://identity.example/application/o/commons"
    db.settings.oidc_client_id = "commons"
    db.settings.oidc_client_secret = "synthetic-client-secret"
    assert source.post(endpoint).status_code == 401
    endpoint = "/api/teacher/groups/transfer/import"
    bad_key = dict(package, recovery_key=base64.urlsafe_b64encode(b"0" * 32).decode().rstrip("="))
    assert target.post(endpoint, json=bad_key).status_code == 400
    tampered = bytearray(base64.b64decode(package["package"]))
    tampered[-1] ^= 1
    bad_package = dict(package, package=base64.b64encode(tampered).decode())
    assert target.post(endpoint, json=bad_package).status_code == 400
    with target_db.connect() as db:
        assert db.execute("SELECT COUNT(*) FROM groups").fetchone()[0] == 0


def test_import_maps_owner_to_destination_teacher(tmp_path, monkeypatch):
    source, source_db = client(tmp_path, "source")
    target, target_db = client(tmp_path, "target")
    seed(source_db)
    package = source.post("/api/teacher/groups/g1/transfer/export").json()
    monkeypatch.setattr(target_db.auth, "require_teacher", lambda request: "oidc:destination")
    assert target.post("/api/teacher/groups/transfer/import", json=package).status_code == 201
    with target_db.connect() as db:
        assert db.execute("SELECT created_by_teacher_id FROM groups WHERE id='g1'").fetchone()[0] == "oidc:destination"
        assert db.execute("SELECT teacher_id FROM group_memberships WHERE group_id='g1'").fetchone()[0] == "oidc:destination"
        assert db.execute("SELECT created_by_teacher_id FROM activity_assignments WHERE id='a1'").fetchone()[0] == "oidc:destination"


def test_round_trip_and_divergent_group_rejected(tmp_path, monkeypatch):
    source, source_db = client(tmp_path, "source")
    target, target_db = client(tmp_path, "target")
    seed(source_db)
    monkeypatch.setattr(target_db.auth, "require_teacher", lambda request: "oidc:destination")
    first = source.post("/api/teacher/groups/g1/transfer/export").json()
    assert target.post("/api/teacher/groups/transfer/import", json=first).status_code == 201
    with target_db.connect() as db:
        db.execute("""INSERT INTO scores
            (id,identity_id,assignment_id,app_id,activity_id,score,created_at)
            VALUES ('s2','p1','a1','play','quiz',9,'2026-10-27')""")
    second = target.post("/api/teacher/groups/g1/transfer/export").json()
    assert source.post("/api/teacher/groups/transfer/import", json=second).status_code == 200
    with source_db.connect() as db:
        assert db.execute("SELECT COUNT(*) FROM scores WHERE identity_id='p1'").fetchone()[0] == 2
    assert source.post("/api/auth/student", json={"group_id": "g1", "public_code": "ABC", "pin": "123456"}).status_code == 200
    assert source.post("/api/teacher/groups/transfer/import", json=second).status_code == 409
    with target_db.connect() as db:
        db.execute("""INSERT INTO scores
            (id,identity_id,assignment_id,app_id,activity_id,score,created_at)
            VALUES ('s3','p1','a1','play','quiz',10,'2026-10-27')""")
    with source_db.connect() as db:
        db.execute("""INSERT INTO scores
            (id,identity_id,assignment_id,app_id,activity_id,score,created_at)
            VALUES ('s4','p1','a1','play','quiz',11,'2026-10-27')""")
    divergent = target.post("/api/teacher/groups/g1/transfer/export").json()
    assert source.post("/api/teacher/groups/transfer/import", json=divergent).status_code == 409
    with source_db.connect() as db:
        assert db.execute("SELECT COUNT(*) FROM scores WHERE identity_id='p1'").fetchone()[0] == 3


def test_disabled_and_unsupported_files(tmp_path):
    source, db = client(tmp_path, "source")
    seed(db)
    endpoint = "/api/teacher/groups/g1/transfer/export"
    source.app.state.commons.settings.classroom_transfer_enabled = False
    assert source.get("/api/teacher/transfer/status").status_code == 404
    assert source.post(endpoint).status_code == 404
    source.app.state.commons.settings.classroom_transfer_enabled = True
    assert source.get("/api/teacher/transfer/status").json() == {"enabled": True}
    with db.connect() as conn:
        conn.execute("""INSERT INTO classroom_files
            (id,group_id,scope,relative_path,storage_name,content_type,size,sha256,created_at,updated_at)
            VALUES ('f1','g1','shared','test.pdf','blob.pdf','application/pdf',1,'a','2026','2026')""")
    assert source.post(endpoint).status_code == 409


@pytest.mark.parametrize("header,value", [("Origin", "https://elsewhere.invalid"), ("Sec-Fetch-Site", "cross-site")])
def test_cross_site_export_rejected(tmp_path, header, value):
    source, db = client(tmp_path, "source")
    seed(db)
    source.headers[header] = value
    assert source.post("/api/teacher/groups/g1/transfer/export").status_code == 403
