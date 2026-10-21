"""Existing ownership rules used by the Vue group panels; disposable SQLite only."""
from test_itineraries import api


def test_owner_can_manage_collaborators_but_collaborator_cannot(api, monkeypatch):
    client, module, items_url = api
    endpoint = '/api/teacher/groups/group/members'
    assert client.post(endpoint, json={'teacher_id': 'collaborator', 'role': 'teacher'}).status_code == 201
    assert any(row['teacher_id'] == 'collaborator' for row in client.get(endpoint).json()['members'])
    monkeypatch.setattr(module.commons.auth, 'require_teacher', lambda request: 'collaborator')
    assert len(client.get('/api/teacher/itineraries?group_id=group').json()['itineraries']) == 1
    assert client.get(endpoint).status_code == 404
    assert client.post(endpoint, json={'teacher_id': 'another-teacher', 'role': 'teacher'}).status_code == 404
    assert client.delete(endpoint + '/collaborator').status_code == 404
    assert client.delete('/api/teacher/groups/group').status_code == 404
    monkeypatch.setattr(module.commons.auth, 'require_teacher', lambda request: 'teacher-token')
    assert client.delete(endpoint + '/collaborator').status_code == 200
    monkeypatch.setattr(module.commons.auth, 'require_teacher', lambda request: 'collaborator')
    assert client.get('/api/teacher/itineraries?group_id=group').json()['itineraries'] == []
    assert client.put(items_url, json={'assignment_ids': [], 'expected_assignment_ids': ['a', 'b', 'c']}).status_code == 404


def test_owner_is_protected_and_deleting_group_is_scoped(api):
    client, module, _ = api
    with module.get_conn() as db:
        db.execute("INSERT OR IGNORE INTO group_memberships VALUES ('group','teacher-token','owner','2026')")
    assert client.delete('/api/teacher/groups/group/members/teacher-token').status_code == 400
    assert client.delete('/api/teacher/groups/other').status_code == 404
    assert client.delete('/api/teacher/groups/group').status_code == 200
    with module.get_conn() as db:
        assert db.execute("SELECT count(*) FROM groups WHERE id='group'").fetchone()[0] == 0
        assert db.execute("SELECT count(*) FROM activity_assignments WHERE group_id='group'").fetchone()[0] == 0
        assert db.execute("SELECT count(*) FROM itineraries WHERE group_id='group'").fetchone()[0] == 0
        assert db.execute("SELECT count(*) FROM group_memberships WHERE group_id='group'").fetchone()[0] == 0
        assert db.execute("SELECT count(*) FROM groups WHERE id='other'").fetchone()[0] == 1
        assert db.execute("SELECT count(*) FROM activity_assignments WHERE id='foreign'").fetchone()[0] == 1


def test_member_identifiers_are_validated_and_guests_cannot_manage_groups(api):
    client, _, _ = api
    endpoint = '/api/teacher/groups/group/members'
    assert client.post(endpoint, json={'teacher_id': '<img src=x>', 'role': 'teacher'}).status_code == 422
    assert client.post(endpoint, json={'teacher_id': 'valid-id', 'role': 'administrator'}).status_code == 422
    client.headers.pop('Authorization')
    assert client.get(endpoint).status_code == 401
    assert client.post(endpoint, json={'teacher_id': 'valid-id', 'role': 'teacher'}).status_code == 401
    assert client.delete('/api/teacher/groups/group').status_code == 401
