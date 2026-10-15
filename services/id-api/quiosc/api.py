"""Routes reuse Commons teacher identity and group membership authorization."""
import sqlite3
from urllib.parse import urlsplit

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field

from .epoptes import EpoptesError
from .service import Quiosc


class StartIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    room_id: str = Field(min_length=1, max_length=64)
    devices: list[str] = Field(min_length=1, max_length=60)
    url: str = Field(min_length=1, max_length=2048)
    seconds: int = Field(strict=True, ge=60, le=14400)


class StopIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    device_id: str | None = Field(default=None, max_length=64)


def install(app, require_teacher, require_group_access, service=None):
    service = service or Quiosc()
    router = APIRouter(prefix='/api/quiosc', tags=['Quiosc'])

    def mutate(request):
        if request.headers.get('x-quiosc-request') != '1':
            raise HTTPException(403, 'Cabecera de protección CSRF requerida')
        origin = request.headers.get('origin')
        if origin and urlsplit(origin).netloc != request.headers.get('host'):
            raise HTTPException(403, 'Origen no autorizado')

    def guarded(fn):
        try:
            return fn()
        except sqlite3.IntegrityError:
            raise HTTPException(409, 'Un equipo tiene una sesión pendiente; consúltala y recupéralo antes de iniciar otra')
        except EpoptesError:
            raise HTTPException(503, 'Epoptes no disponible: comprueba conexión y permisos del socket')
        except (OSError, KeyError, TypeError):
            raise HTTPException(503, 'Configuración Quiosc incompleta o no disponible')
        except ValueError:
            raise HTTPException(400, 'Petición o configuración Quiosc no válida')

    def room_access(request, room_id):
        require_teacher(request)
        room = guarded(lambda: service.room(room_id))
        if not room:
            raise HTTPException(404, 'Aula no disponible')
        require_group_access(request, room['group_id'])
        return room

    def session_access(request, sid):
        actor = require_teacher(request)
        session = guarded(lambda: service.session(sid))
        if not session:
            raise HTTPException(404, 'Sesión no disponible')
        require_group_access(request, session['group_id'])
        return actor

    @router.get('/rooms')
    def rooms(request: Request):
        require_teacher(request)
        visible = []
        for room in guarded(service.rooms):
            try:
                require_group_access(request, room['group_id'])
            except HTTPException as exc:
                if exc.status_code == 404:
                    continue
                raise
            visible.append({k: room[k] for k in ('id', 'name', 'group_id')})
        return {'mode': service.mode, 'assurance': 'basic_kiosk', 'rooms': visible}

    @router.get('/rooms/{room_id}/devices')
    def devices(room_id: str, request: Request):
        room = room_access(request, room_id)
        return {'mode': service.mode, 'devices': guarded(lambda: service.discover(room))}

    @router.get('/rooms/{room_id}/sessions')
    def sessions(room_id: str, request: Request):
        room = room_access(request, room_id)
        def query():
            with service.db() as conn:
                return [dict(r) for r in conn.execute(
                    'SELECT * FROM sessions WHERE room_id=? AND group_id=? ORDER BY created DESC LIMIT 100',
                    (room_id, room['group_id']))]
        return {'sessions': guarded(query)}

    @router.post('/sessions')
    def start(payload: StartIn, request: Request):
        mutate(request)
        room = room_access(request, payload.room_id)
        actor = require_teacher(request)
        return guarded(lambda: service.start(room, payload.devices, payload.url, payload.seconds, actor))

    @router.get('/sessions/{sid}')
    def status(sid: str, request: Request):
        session_access(request, sid)
        # GET reads stored observations only. Active remote polling uses CSRF-protected POST.
        return guarded(lambda: service.snapshot(sid))

    @router.post('/sessions/{sid}/refresh')
    def refresh(sid: str, request: Request):
        mutate(request)
        actor = session_access(request, sid)
        return guarded(lambda: service.operate(sid, actor, 'status'))

    @router.post('/sessions/{sid}/stop')
    def stop(sid: str, payload: StopIn, request: Request):
        mutate(request)
        actor = session_access(request, sid)
        return guarded(lambda: service.operate(sid, actor, 'stop', payload.device_id))

    app.include_router(router)
    return service
