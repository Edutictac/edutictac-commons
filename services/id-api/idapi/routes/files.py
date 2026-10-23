"""Files shared by teachers and private submissions authenticated by code/PIN."""
import shutil

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, ConfigDict, Field, model_validator
from assets import check_origin

from ..classroom_files import fail, MB
from ..context import Commons, commons
from ..db import iso_now

router = APIRouter()


def writing(request):
    check_origin(request)
    if request.headers.get('sec-fetch-site') == 'cross-site':fail(403,'origin_required')


class FileSettings(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    max_file_bytes: int = Field(ge=1,le=100*MB)
    group_quota_bytes: int = Field(ge=1,le=100000*MB)
    student_quota_bytes: int = Field(ge=1,le=100000*MB)
    students_can_upload: bool

    @model_validator(mode='after')
    def quotas(self):
        if self.student_quota_bytes>self.group_quota_bytes or self.max_file_bytes>self.group_quota_bytes:
            raise ValueError('inconsistent quotas')
        return self


def require_admin(c, request):
    if not c.auth.is_oidc_admin(request):fail(403,'administrator_required')
    return str(c.auth.oidc_cookie(request)['id'])


def settings_report(c):
    with c.connect() as conn:
        settings = c.files.settings(conn)
        usage = conn.execute('SELECT COALESCE(SUM(size),0), COUNT(*) FROM classroom_files WHERE active=1').fetchone()
    existing = c.files.root
    while not existing.exists():existing = existing.parent
    return {'settings':settings,'usage':{'total_bytes':usage[0],'files':usage[1]},'disk_free_bytes':shutil.disk_usage(existing).free}


@router.get('/api/admin/files/settings')
def get_settings(request: Request,c: Commons=Depends(commons)):
    require_admin(c,request)
    return settings_report(c)


@router.put('/api/admin/files/settings')
def put_settings(payload: FileSettings,request: Request,c: Commons=Depends(commons)):
    writing(request)
    actor = require_admin(c,request)
    with c.connect() as conn:
        conn.execute('INSERT INTO classroom_file_settings VALUES(1,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET max_file_bytes=excluded.max_file_bytes,group_quota_bytes=excluded.group_quota_bytes,student_quota_bytes=excluded.student_quota_bytes,students_can_upload=excluded.students_can_upload,updated_at=excluded.updated_at,updated_by=excluded.updated_by',
            (payload.max_file_bytes,payload.group_quota_bytes,payload.student_quota_bytes,int(payload.students_can_upload),iso_now(),actor))
    return settings_report(c)


@router.get('/api/teacher/groups/{group_id}/files')
def teacher_list(group_id: str,request: Request,c: Commons=Depends(commons)):
    c.auth.require_group_access(request,group_id)
    return c.files.listing(group_id)


@router.post('/api/teacher/groups/{group_id}/files',status_code=201)
async def teacher_upload(group_id: str,request: Request,c: Commons=Depends(commons)):
    writing(request)
    actor = c.auth.require_group_access(request,group_id)
    return await c.files.upload(request,group_id,None,actor,lambda:c.auth.require_group_access(request,group_id))


@router.get('/api/teacher/groups/{group_id}/files/{file_id}/download')
def teacher_download(group_id: str,file_id: str,request: Request,c: Commons=Depends(commons)):
    c.auth.require_group_access(request,group_id)
    return c.files.download(group_id,file_id)


@router.delete('/api/teacher/groups/{group_id}/files/{file_id}')
def teacher_delete(group_id: str,file_id: str,request: Request,c: Commons=Depends(commons)):
    writing(request)
    c.auth.require_group_access(request,group_id)
    return c.files.delete(group_id,file_id)


@router.get('/api/student/group-files')
def student_list(request: Request,c: Commons=Depends(commons)):
    who = c.auth.require_student(request)
    return c.files.listing(who['group_id'],who['id'])


@router.post('/api/student/group-files',status_code=201)
async def student_upload(request: Request,c: Commons=Depends(commons)):
    writing(request)
    who = c.auth.require_student(request)
    return await c.files.upload(request,who['group_id'],who['id'],'student:'+who['id'],lambda:c.auth.require_student(request))


@router.get('/api/student/group-files/{file_id}/download')
def student_download(file_id: str,request: Request,c: Commons=Depends(commons)):
    who = c.auth.require_student(request)
    return c.files.download(who['group_id'],file_id,who['id'])


@router.delete('/api/student/group-files/{file_id}')
def student_delete(file_id: str,request: Request,c: Commons=Depends(commons)):
    writing(request)
    who = c.auth.require_student(request)
    return c.files.delete(who['group_id'],file_id,who['id'])
