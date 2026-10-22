"""Servidor HTTP d'EduTicTac Play, sense dependències externes."""

from __future__ import annotations

import json
import os
import re
import secrets
import tempfile
import threading
import time
import zipfile
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from recursos import RecursosContractError, build_publish_payload
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, unquote, urlparse
from urllib.request import Request as UpstreamRequest, urlopen

from playcore import reviews
from playcore.catalog import read_catalog, read_catalog_labels, save_catalog
from playcore.config import (
    ACTIVITIES_DIR,
    ANONYMOUS_ACTIVITY_TTL_SECONDS,
    COMMONS_API_URL,
    COMMONS_APP_ID,
    COMMONS_APP_TOKEN,
    COMMONS_AUTH_ME_URL,
    HOST,
    LIBRARIES_DIR,
    MAX_BODY,
    PLAY_ADMIN_TOKEN,
    PLAY_DEFAULT_VISIBILITY,
    PLAY_DEMO_COMMONS_URL,
    PLAY_PUBLIC_URL,
    PLAY_TEACHER_LOGIN_URL,
    PLAY_TRUSTED_IDENTITY_HEADER,
    PUBLIC_DIR,
    PURGE_INTERVAL_SECONDS,
    RECURSOS_API_URL,
    RECURSOS_INGEST_TOKEN,
    URL_PREFIX,
)
from playcore.h5p import content_type_for, package_files
from playcore.store import (
    ACTIVITY_ID_PATTERN,
    ID_RE,
    PREVIEWS,
    activity_summary,
    creator_key_hash,
    delete_activity,
    list_activities,
    new_id,
    public_activity,
    purge_loop,
    read_activity,
    save_activity,
)
from playcore.validation import VISIBILITIES, validate_activity

LAUNCH_CONTEXTS: dict[str, dict] = {}


class Handler(BaseHTTPRequestHandler):
    server_version = "EduTicTacPlay/0.1"

    def identity_id(self) -> str:
        """Return the identity supplied by a configured trusted auth adapter."""

        if not PLAY_TRUSTED_IDENTITY_HEADER:
            return ""
        value = self.headers.get(PLAY_TRUSTED_IDENTITY_HEADER, "").strip()
        return value[:160] if re.fullmatch(r"[A-Za-z0-9._:@/-]{1,160}", value) else ""

    def teacher_identity(self) -> str:
        """Return the Authentik-backed teacher identity from Commons."""

        identity = self.authenticated_identity()
        if identity.get("role") not in {"profesor", "administrador", "teacher"}:
            return ""
        value = str(identity.get("id", "")).strip()
        return value[:160] if re.fullmatch(r"[A-Za-z0-9._:@/-]{1,160}", value) else ""

    def authenticated_identity(self) -> dict:
        """Return the authenticated Commons identity, if the browser has one."""

        if not COMMONS_AUTH_ME_URL:
            return {}
        if COMMONS_API_URL:
            try:
                scope = reviews.access(self)
                identity = {'id': scope['actor'], 'role': 'profesor' if scope['role'] == 'teacher' else 'alumno',
                            'provider': 'authentik' if scope['role'] == 'teacher' else 'commons'}
                if scope['role'] == 'student':
                    identity['group_id'] = scope['group_id']
                return identity
            except reviews.ReviewError:
                return {}
        cookie = self.headers.get("Cookie", "").strip()
        if not cookie:
            return {}
        request = UpstreamRequest(COMMONS_AUTH_ME_URL, headers={"Cookie": cookie})
        try:
            with urlopen(request, timeout=5) as response:
                if response.status != HTTPStatus.OK:
                    return {}
                payload = json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, ValueError, json.JSONDecodeError):
            return {}
        identity = payload.get("identity") if isinstance(payload, dict) else None
        return identity if isinstance(identity, dict) and identity.get("id") else {}

    def authenticated_identity_id(self) -> str:
        identity = self.authenticated_identity()
        value = str(identity.get("id", "")).strip()
        return value[:160] if re.fullmatch(r"[A-Za-z0-9._:@/-]{1,160}", value) else ""

    def require_teacher(self) -> str:
        # Standalone Play remains usable for its local unit tests and for
        # development without Commons. The Compose deployment always sets
        # COMMONS_AUTH_ME_URL, so production authoring takes the Authentik path.
        if not COMMONS_AUTH_ME_URL:
            return self.identity_id() or "local-teacher"
        identity = self.teacher_identity()
        if identity:
            return identity
        self.send_json(HTTPStatus.UNAUTHORIZED, {
            "error": "Se necesita una sesión docente de Authentik.",
            "login_url": PLAY_TEACHER_LOGIN_URL or None,
        })
        return ""

    def redirect_teacher_login(self) -> None:
        if PLAY_TEACHER_LOGIN_URL:
            location = PLAY_TEACHER_LOGIN_URL
        else:
            host = self.headers.get("Host", "")
            if ":" in host:
                hostname = host.rsplit(":", 1)[0]
                host = f"{hostname}:8082"
            location = f"//{host}/api/auth/oidc/login" if host else "/api/auth/oidc/login"
        self.send_response(HTTPStatus.SEE_OTHER)
        self.send_header("Location", location)
        self.end_headers()

    def creator_hash(self) -> str:
        """Hash of the anonymous creator key sent by the browser via header."""

        return creator_key_hash(self.headers.get("X-Play-Creator", ""))

    def can_access_activity(self, activity: dict) -> bool:
        visibility = activity.get("visibility", "public")
        if visibility == "public":
            return True
        identity = self.authenticated_identity_id() or self.identity_id()
        if identity and activity.get('owner_id') == identity:
            return True
        group = activity.get('review', {}).get('group_id')
        if group:
            try:
                return bool(reviews.access(self, group).get('can_review'))
            except reviews.ReviewError:
                pass
        return False

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def normalize_path(self, raw: str) -> str:
        path = unquote(urlparse(raw).path)
        if URL_PREFIX and (path == URL_PREFIX or path.startswith(URL_PREFIX + "/")):
            path = path[len(URL_PREFIX):] or "/"
        return path

    def do_GET(self) -> None:  # noqa: N802
        path = self.normalize_path(self.path)
        if reviews.dispatch(self, path, "GET"):
            return
        if path == "/api/publication/login":
            self.redirect_teacher_login()
            return
        if path == "/api/health":
            self.send_json(HTTPStatus.OK, {"status": "ok", "service": "edutictac-play"})
            return
        if path == "/api/config":
            self.send_json(HTTPStatus.OK, {
                "demo": bool(PLAY_DEMO_COMMONS_URL),
                "commonsUrl": PLAY_DEMO_COMMONS_URL or None,
                "integrated": bool(COMMONS_AUTH_ME_URL),
            })
            return
        if path == "/api/catalog":
            self.send_json(HTTPStatus.OK, {**read_catalog(), "labels": read_catalog_labels()})
            return
        if path == "/api/activities":
            query = parse_qs(urlparse(self.path).query)
            try:
                limit = max(1, min(100, int(query.get("limit", ["20"])[0])))
                offset = max(0, int(query.get("offset", ["0"])[0]))
            except ValueError:
                self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Paginación no válida."})
                return
            filters = {
                "limit": limit,
                "offset": offset,
                "type": query.get("type", [""])[0],
                "language": query.get("language", [""])[0],
                "subject": query.get("subject", [""])[0],
                "educational_stage": query.get("educational_stage", [""])[0],
                "license": query.get("license", [""])[0],
                "tag": query.get("tag", [""])[0],
                "q": query.get("q", [""])[0],
            }
            filters["identity_id"] = self.authenticated_identity_id() or self.identity_id()
            creator_hash = self.creator_hash()
            items, total = list_activities(filters)
            self.send_json(HTTPStatus.OK, {
                "items": [activity_summary(activity, creator_hash) for activity in items],
                "total": total,
                "limit": limit,
                "offset": offset,
                "hasMore": offset + len(items) < total,
            })
            return
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})", path)
        if match:
            activity = read_activity(match.group(1))
            if activity and self.can_access_activity(activity):
                self.send_json(HTTPStatus.OK, public_activity(activity, self.creator_hash()))
            else:
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
            return
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})/download", path)
        if match:
            activity = read_activity(match.group(1))
            if not activity or not self.can_access_activity(activity):
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
                return
            self.download_package(activity)
            return
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})/h5p/(.+)", path)
        if match:
            activity = read_activity(match.group(1))
            if not activity or not self.can_access_activity(activity):
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            files = package_files(activity)
            body = files.get(match.group(2))
            if body is None:
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", content_type_for(Path(match.group(2))))
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if path.startswith("/h5p-libraries/"):
            relative = path.removeprefix("/h5p-libraries/")
            candidate = (LIBRARIES_DIR / relative).resolve()
            if LIBRARIES_DIR not in candidate.parents or not candidate.is_file():
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            body = candidate.read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", content_type_for(candidate))
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self.serve_static(path)

    def admin_authorized(self) -> bool:
        if not PLAY_ADMIN_TOKEN:
            return False
        token = self.headers.get("X-Admin-Token", "").strip()
        if not token:
            authorization = self.headers.get("Authorization", "")
            if authorization.lower().startswith("bearer "):
                token = authorization[7:].strip()
        return secrets.compare_digest(token, PLAY_ADMIN_TOKEN)

    def do_DELETE(self) -> None:  # noqa: N802
        with reviews.LOCK:
            self.delete_locked()

    def delete_locked(self) -> None:
        path = self.normalize_path(self.path)
        match = re.fullmatch(rf"/api/activities/({ACTIVITY_ID_PATTERN})", path)
        if not match:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Ruta no encontrada."})
            return
        activity = read_activity(match.group(1))
        owner_id = self.authenticated_identity_id() or (self.identity_id() if not COMMONS_AUTH_ME_URL else "")
        authorized = self.admin_authorized()
        if activity and activity.get('owner_id') and COMMONS_AUTH_ME_URL and not owner_id and not authorized:
            self.send_json(HTTPStatus.UNAUTHORIZED, {'error': 'session_required'})
            return
        if owner_id and not authorized:
            authorized = activity is not None and activity.get("owner_id") == owner_id
        if not owner_id and not authorized:
            creator_hash = self.creator_hash()
            owner_hash = str(activity.get("owner_key_hash", "")) if activity else ""
            authorized = bool(creator_hash and owner_hash and secrets.compare_digest(owner_hash, creator_hash))
        if COMMONS_AUTH_ME_URL and not authorized:
            self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Se necesita una sesión docente o la clave de creador."})
            return
        if not authorized:
            creator_hash = self.creator_hash()
            owner_hash = str(activity.get("owner_key_hash", "")) if activity else ""
            authorized = bool(creator_hash and owner_hash and secrets.compare_digest(owner_hash, creator_hash))
        if not authorized:
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "Borrado no autorizado."})
            return
        if activity and activity.get('review', {}).get('status') == 'approved':
            self.send_json(HTTPStatus.CONFLICT, {'error': 'withdraw_review_first'})
            return
        if not activity or not delete_activity(match.group(1)):
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Actividad no encontrada."})
            return
        self.send_json(HTTPStatus.OK, {"deleted": match.group(1)})

    def do_POST(self) -> None:  # noqa: N802
        route = self.normalize_path(self.path)
        if reviews.dispatch(self, route, "POST"):
            return
        if route == "/api/catalog":
            if not self.require_teacher():
                return
            self.update_catalog()
            return
        if route == "/api/commons/launch":
            self.consume_commons_launch()
            return
        if route == "/api/commons/score":
            self.forward_commons_score()
            return
        if route == "/api/recursos/publish":
            if not self.require_teacher():
                return
            self.publish_recursos_activity()
            return
        if route == "/api/recursos/unpublish":
            if not self.require_teacher():
                return
            self.unpublish_recursos_activity()
            return
        if route not in {"/api/activities", "/api/previews"}:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Ruta no encontrada."})
            return
        authenticated = self.authenticated_identity()
        identity = str(authenticated.get('id', '')) or (self.identity_id() if not COMMONS_AUTH_ME_URL else '')
        student = bool(identity and authenticated.get('provider') != 'authentik' and authenticated.get('group_id'))
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > MAX_BODY:
                raise ValueError("El contenido es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
        except (ValueError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Datos no válidos."})
            return
        activity, errors = validate_activity(payload)
        if errors:
            self.send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"errors": errors})
            return
        if route == "/api/previews":
            activity["id"] = f"preview-{new_id()}"
            if identity:
                activity['visibility'] = 'private'
                activity['owner_id'] = identity
            PREVIEWS[activity["id"]] = activity
            self.send_json(HTTPStatus.CREATED, activity)
            return
        activity["id"] = new_id()
        if COMMONS_AUTH_ME_URL and not PLAY_DEMO_COMMONS_URL:
            try:
                scope = reviews.access(self)
                identity = scope['actor']
                student = scope['role'] == 'student'
                if student:
                    authenticated['group_id'] = scope['group_id']
            except reviews.ReviewError as exc:
                self.send_json(exc.status, {'error': exc.code})
                return
        requested_visibility = str(payload.get('visibility', PLAY_DEFAULT_VISIBILITY)).strip().lower()
        if requested_visibility not in VISIBILITIES:
            self.send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"errors": ["Visibilidad no válida."]})
            return
        activity['visibility'] = 'private' if student else requested_visibility if identity else 'public'
        if student:
            activity['owner_group_id'] = authenticated['group_id']
        if identity:
            activity["owner_id"] = identity
        else:
            activity["expiresAt"] = (
                __import__("datetime").datetime.now(__import__("datetime").timezone.utc)
                + __import__("datetime").timedelta(seconds=ANONYMOUS_ACTIVITY_TTL_SECONDS)
            ).isoformat()
        creator_hash = self.creator_hash()
        if creator_hash:
            activity["owner_key_hash"] = creator_hash
        activity["createdAt"] = __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()
        save_activity(activity)
        self.send_json(HTTPStatus.CREATED, public_activity(activity, creator_hash))

    def update_catalog(self) -> None:
        if not self.admin_authorized():
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "Catálogo no autorizado."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 32 * 1024:
                raise ValueError("El catálogo es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
            if not isinstance(payload, dict):
                raise ValueError("El catálogo no es válido.")
            catalog = save_catalog(payload)
        except (ValueError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Catálogo no válido."})
            return
        self.send_json(HTTPStatus.OK, catalog)

    def publish_recursos_activity(self) -> None:
        try:
            reviews.check_write(self, strict=False)
            payload = reviews.read_body(self)
            with reviews.LOCK:
                data = reviews.activity(str(payload.get('activity_id', '')))
                scope = reviews.access(self) if COMMONS_AUTH_ME_URL else {}
                if COMMONS_AUTH_ME_URL and (not scope.get('can_publish') or data.get('review') or data.get('owner_id') != scope.get('actor')):
                    raise reviews.ReviewError(403, 'activity_owner_required')
                output = reviews.publish(data, False)
                data['recursos'] = output
                if not False:
                    data['visibility'] = 'public'
                save_activity(data)
            self.send_json(200, output)
        except reviews.ReviewError as exc:
            self.send_json(exc.status, {'error': exc.code})

    def unpublish_recursos_activity(self) -> None:
        try:
            reviews.check_write(self, strict=False)
            payload = reviews.read_body(self)
            with reviews.LOCK:
                data = reviews.activity(str(payload.get('activity_id', '')))
                scope = reviews.access(self) if COMMONS_AUTH_ME_URL else {}
                if COMMONS_AUTH_ME_URL and (not scope.get('can_publish') or data.get('review') or data.get('owner_id') != scope.get('actor')):
                    raise reviews.ReviewError(403, 'activity_owner_required')
                output = reviews.publish(data, True)
                data['recursos'] = output
                if not True:
                    data['visibility'] = 'public'
                save_activity(data)
            self.send_json(200, output)
        except reviews.ReviewError as exc:
            self.send_json(exc.status, {'error': exc.code})

    def forward_commons_score(self) -> None:
        if not COMMONS_API_URL:
            self.send_json(HTTPStatus.NOT_IMPLEMENTED, {"error": "La integración con Commons no está configurada."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 32 * 1024:
                raise ValueError("El contenido es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
            activity_id = str(payload.get("activity_id", "")).strip()
            assignment_id = str(payload.get("assignment_id", "")).strip()
            result_id = str(payload.get("result_id", "")).strip()
            launch_context = str(payload.get("launch_context", "")).strip()
            score = int(payload.get("score"))
            metadata = payload.get("metadata", {})
            if not ID_RE.fullmatch(activity_id) or not assignment_id or len(result_id) > 512 or not isinstance(metadata, dict):
                raise ValueError("Datos de resultado no válidos.")
            if score < 0 or score > 100:
                raise ValueError("La puntuación debe estar entre 0 y 100.")
        except (TypeError, ValueError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Datos de resultado no válidos."})
            return
        context = LAUNCH_CONTEXTS.get(launch_context) if launch_context else None
        if launch_context:
            if not context or context["expires_at"] <= time.time():
                LAUNCH_CONTEXTS.pop(launch_context, None)
                self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Lanzamiento de Commons caducado."})
                return
            if context["assignment_id"] != assignment_id or context["activity_id"] != activity_id:
                self.send_json(HTTPStatus.FORBIDDEN, {"error": "La actividad no coincide con el lanzamiento."})
                return
            if not context["identity_id"] or not COMMONS_APP_TOKEN:
                self.send_json(HTTPStatus.NOT_IMPLEMENTED, {"error": "El lanzamiento no tiene identidad válida."})
                return
            upstream_path = f"/api/apps/{COMMONS_APP_ID}/scores"
            upstream_payload = {
                "identity_id": context["identity_id"],
                "activity_id": activity_id,
                "assignment_id": assignment_id,
                "result_id": result_id,
                "score": score,
                "metadata": metadata,
            }
            upstream_headers = {"Authorization": f"Bearer {COMMONS_APP_TOKEN}"}
        else:
            upstream_path = "/api/scores"
            upstream_payload = {
                "app_id": COMMONS_APP_ID,
                "activity_id": activity_id,
                "assignment_id": assignment_id,
                "result_id": result_id,
                "score": score,
                "metadata": metadata,
            }
            upstream_headers = {"Cookie": self.headers.get("Cookie", "")}
        body = json.dumps(upstream_payload).encode()
        upstream_headers.update({"Content-Type": "application/json", "Accept": "application/json"})
        request = UpstreamRequest(
            f"{COMMONS_API_URL}{upstream_path}",
            data=body,
            headers=upstream_headers,
            method="POST",
        )
        try:
            with urlopen(request, timeout=5) as response:
                response_body = response.read()
                status = response.status
        except HTTPError as error:
            response_body = error.read()
            status = error.code
        except URLError:
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "No se ha podido contactar con Commons."})
            return
        try:
            result = json.loads(response_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            result = {"error": "Respuesta no válida de Commons."}
        self.send_json(status, result if isinstance(result, dict) else {"result": result})

    def consume_commons_launch(self) -> None:
        if not COMMONS_API_URL or not COMMONS_APP_TOKEN:
            self.send_json(HTTPStatus.NOT_IMPLEMENTED, {"error": "Los lanzamientos de Commons no están configurados."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 8 * 1024:
                raise ValueError("El contenido es demasiado grande.")
            payload = json.loads(self.rfile.read(length))
            token = str(payload.get("token", "")).strip()
            if not token or len(token) > 512:
                raise ValueError("Token no válido.")
        except (TypeError, ValueError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "Token de lanzamiento no válido."})
            return
        body = json.dumps({"token": token}).encode()
        request = UpstreamRequest(
            f"{COMMONS_API_URL}/api/apps/{COMMONS_APP_ID}/launch-tokens/consume",
            data=body,
            headers={
                "Authorization": f"Bearer {COMMONS_APP_TOKEN}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=5) as response:
                response_body = response.read()
                status = response.status
        except HTTPError as error:
            response_body = error.read()
            status = error.code
        except URLError:
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "No se ha podido contactar con Commons."})
            return
        try:
            result = json.loads(response_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "Respuesta no válida de Commons."})
            return
        if status >= 400 or not isinstance(result, dict):
            self.send_json(status, result if isinstance(result, dict) else {"error": "Lanzamiento no válido."})
            return
        assignment = result.get("assignment") or {}
        if assignment.get("app_id") != COMMONS_APP_ID or not assignment.get("id") or not assignment.get("activity_id"):
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "Asignación no válida de Commons."})
            return
        context_id = secrets.token_urlsafe(32)
        LAUNCH_CONTEXTS[context_id] = {
            "identity_id": (result.get("identity") or {}).get("id", ""),
            "assignment_id": assignment["id"],
            "activity_id": assignment["activity_id"],
            "expires_at": time.time() + 3600,
        }
        self.send_json(HTTPStatus.OK, {"context_id": context_id, "assignment": assignment})

    def download_package(self, activity: dict) -> None:
        with tempfile.NamedTemporaryFile(suffix=".h5p") as tmp:
            with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as archive:
                for name, content in package_files(activity).items():
                    archive.writestr(name, content)
            tmp.flush()
            body = Path(tmp.name).read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/zip")
        self.send_header("Content-Disposition", f'attachment; filename="{activity["id"]}.h5p"')
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_static(self, path: str) -> None:
        activity_match = re.fullmatch(rf"/({ACTIVITY_ID_PATTERN})", path)
        if activity_match and read_activity(activity_match.group(1)):
            path = "/index.html"
        if path == "/":
            path = "/index.html"
        candidate = (PUBLIC_DIR / path.lstrip("/")).resolve()
        if PUBLIC_DIR not in candidate.parents or not candidate.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        content_type = {".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json"}.get(candidate.suffix, "application/octet-stream")
        body = candidate.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self) -> None:
        self.send_header("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; frame-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()



def main() -> None:
    ACTIVITIES_DIR.mkdir(parents=True, exist_ok=True)
    if PURGE_INTERVAL_SECONDS > 0:
        threading.Thread(target=purge_loop, args=(PURGE_INTERVAL_SECONDS,), daemon=True).start()
    port = int(os.environ.get("PORT", "8083"))
    ThreadingHTTPServer((HOST, port), Handler).serve_forever()


if __name__ == "__main__":
    main()
