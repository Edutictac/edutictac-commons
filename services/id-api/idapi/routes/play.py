"""Verified classroom scope for Play's private publication review workflow."""
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from ..context import Commons, commons
from ..access import member_of, teacher_params

router = APIRouter()

@router.get('/api/play/access')
def access(request: Request, response: Response, group_id: str = '', student_id: str = '', c: Commons = Depends(commons)):
    response.headers['Cache-Control'] = 'private, no-store'
    oidc = c.auth.oidc_cookie(request)
    if oidc:
        if oidc.get('role') not in {'profesor', 'administrador'}:
            raise HTTPException(403, 'verified_class_required')
        c.rebost.principal(request)  # Enforce human-session expiry and revocation as in Llibres.
        if group_id:
            c.auth.require_group_access(request, group_id, individual=True, admin=True)
            if student_id:
                with c.connect() as db:
                    if not db.execute('SELECT 1 FROM student_identities WHERE id=? AND group_id=? AND active=1', (student_id, group_id)).fetchone():
                        raise HTTPException(409, 'review_student_unavailable')
        with c.connect() as db:
            if oidc['role'] == 'administrador':
                groups = db.execute('SELECT id,name FROM groups ORDER BY id LIMIT 1001').fetchall()
            else:
                groups = db.execute(f'SELECT g.id,g.name FROM groups g WHERE {member_of("g.id")} ORDER BY g.id LIMIT 1001', teacher_params(oidc['id'])).fetchall()
        if len(groups) > 1000:
            raise HTTPException(413, 'class_limit')
        return {'actor': oidc['id'], 'role': 'teacher', 'can_publish': True, 'can_submit': False, 'can_review': True,
                'groups': [{'id': row['id'], 'name': row['name'] or row['id']} for row in groups]}
    student = c.auth.current_identity(request)
    if not student:
        raise HTTPException(401, 'session_required')
    c.rebost.principal(request)
    with c.connect() as db:
        group = db.execute('SELECT id,name FROM groups WHERE id=?', (student['group_id'],)).fetchone()
    if not group:
        raise HTTPException(403, 'verified_class_required')
    return {'actor': student['id'], 'role': 'student', 'group_id': group['id'], 'class_name': group['name'] or group['id'],
            'can_publish': False, 'can_submit': True, 'can_review': False}
