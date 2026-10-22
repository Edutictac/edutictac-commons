from fastapi.testclient import TestClient
from test_rebost import api
from test_books_access import teacher


def test_play_student_scope_is_verified_and_cannot_be_spoofed(api):
    module, pupil, other, _ = api
    data = pupil.get('/api/play/access?group_id=elsewhere&student_id=other').json()
    assert data['role'] == 'student' and data['actor'] == 'a' and data['group_id'] == 'group'
    assert data['can_submit'] and not data['can_publish'] and not data['can_review']
    assert TestClient(module.app).get('/api/play/access').status_code == 401
    assert teacher(module, 'alumno').get('/api/play/access').status_code == 403
    assert TestClient(module.app, headers={'Authorization': 'Bearer '+module.TEACHER_TOKEN}).get('/api/play/access').status_code == 401


def test_play_class_teacher_and_collaborator_review_only_their_classes(api):
    module, *_ = api
    owner=teacher(module,subject='play-owner')
    identity=owner.get('/api/auth/me').json()['identity']['id']
    with module.get_conn() as db:
        db.execute("UPDATE groups SET created_by_teacher_id=? WHERE id='group'",(identity,))
    assert owner.get('/api/play/access').json()['groups'][0]['id']=='group'
    assert owner.get('/api/play/access?group_id=group&student_id=a').status_code==200
    outsider=teacher(module,subject='outside')
    assert outsider.get('/api/play/access').json()['groups']==[]
    assert outsider.get('/api/play/access?group_id=group').status_code==404
    with module.get_conn() as db:
        db.execute("UPDATE groups SET created_by_teacher_id='new' WHERE id='group'")
        db.execute("INSERT INTO group_memberships VALUES ('group',?,'teacher','2026')",(identity,))
    assert owner.get('/api/play/access?group_id=group&student_id=a').status_code==200
    with module.get_conn() as db:
        db.execute("UPDATE student_identities SET active=0 WHERE id='a'")
    assert owner.get('/api/play/access?group_id=group&student_id=a').status_code==409
    assert owner.get('/api/play/access?group_id=group').status_code==200  # Withdrawal still possible.
    with module.get_conn() as db:
        db.execute('DELETE FROM group_memberships')
    assert owner.get('/api/play/access?group_id=group').status_code==404


def test_play_revoked_individual_teacher_cannot_review(api):
    module,*_=api
    client=teacher(module)
    assert client.get('/api/play/access').status_code==200
    with module.get_conn() as db:
        db.execute("UPDATE asset_sessions SET revoked_at='2026'")
    assert client.get('/api/play/access').status_code==401
