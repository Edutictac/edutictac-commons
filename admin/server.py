#!/usr/bin/env python3
"""Panell d'administracio operativa per a EduTicTac Commons.

Nomes libreria estandard (cap dependencia pip). Serveix els fitxers
estatics de public/ i exposa una API JSON minima, protegida per la sessio
Authentik del primer administrador autoritzat,
per llegir l'estat del stack i disparar un conjunt tancat (allowlist) de
scripts ja existents al repo.
"""

import json
import os
import re
import secrets
import socket
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

_scripts = Path(__file__).resolve().parent / "scripts"
if not _scripts.is_dir():
    _scripts = Path(__file__).resolve().parent.parent / "scripts"
sys.path.insert(0, str(_scripts))
from backup_secondary import public_status as secondary_status, mount_path, SecondaryError

from content_sync import sync_channel
from modules import load_public_state, selection as module_selection, snapshot as module_snapshot

APP_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = APP_DIR / "public"
BACKUPS_DIR = APP_DIR / "backups"
VERSION_FILE = APP_DIR / "VERSION"

PORT = int(os.environ.get("ADMIN_INTERNAL_PORT", "8091"))
ID_API_ME_URL = os.environ.get("ID_API_ME_URL", "http://id-api:8005/api/auth/me")
ADMIN_OIDC_USERNAME = os.environ.get("ADMIN_OIDC_USERNAME", "akadmin").strip().lower()
AUTHENTIK_API_URL = os.environ.get("AUTHENTIK_API_URL", "http://authentik-server:9000/api/v3").rstrip("/")
AUTHENTIK_API_TOKEN = os.environ.get("AUTHENTIK_API_TOKEN", "").strip()
AUTHENTIK_TEACHER_GROUP = os.environ.get("AUTHENTIK_TEACHER_GROUP", "profesor").strip()
CONTENT_CATALOG_BASE_URL = os.environ.get("CONTENT_CATALOG_BASE_URL", "").strip()
CONTENT_SYNC_DIR = os.environ.get("CONTENT_SYNC_DIR", "/app/content-sync").strip()
RESOURCES_API_URL = os.environ.get("RESOURCES_API_URL", "http://recursos-api:8004").rstrip("/")
RESOURCES_IMPORT_TOKEN = os.environ.get("RESOURCES_IMPORT_TOKEN", "").strip()
EDUHOOT_API_URL = os.environ.get("EDUHOOT_API_URL", "http://eduhoot:3000").rstrip("/")
EDUHOOT_RESOURCES_TOKEN = os.environ.get("EDUHOOT_RESOURCES_TOKEN", "").strip()

PORTAL_HEALTH_URL = os.environ.get("PORTAL_HEALTH_URL", "http://portal/api/health")
ID_API_HEALTH_URL = os.environ.get("ID_API_HEALTH_URL", "http://id-api:8005/api/health")

IMAGE_REGISTRY = os.environ.get("IMAGE_REGISTRY", "edutictac")
IMAGE_TAG = os.environ.get("IMAGE_TAG", "unknown")
EDUHOOT_TAG = os.environ.get("EDUHOOT_TAG", "unknown")
UPDATE_CHANNEL = os.environ.get("UPDATE_CHANNEL", "testing")
COMPOSE_PROFILES = os.environ.get("COMPOSE_PROFILES", "")
ACTIVE_PROFILES = {p for p in COMPOSE_PROFILES.split(",") if p}

TIMER_UNIT = "edutictac-commons-backup.timer"
SERVICE_UNIT = "edutictac-commons-backup.service"

SCRIPT_TIMEOUT = 120
BACKUP_NAME_RE = re.compile(r"^commons-\d{8}T\d{6}Z$")
AGE_RECIPIENT_RE = re.compile(r"^age1[0-9a-z]{20,}$")
JOB_UNIT_RE = re.compile(r"^edutictac-commons-(?:(update|restore|rollback)-\d{14}|(?:modules|backup|config)-\d{14}-[a-f0-9]{8})$")


def identity_is_admin(identity):
    """Authentik admin or the explicit bootstrap username."""
    provider = str(identity.get("provider", "")).strip().lower()
    username = str(identity.get("username", "")).strip().lower()
    role = str(identity.get("role", "")).strip().lower()
    return provider == "authentik" and (username == ADMIN_OIDC_USERNAME or role == "administrador")


def same_origin_request(headers):
    """Same-origin browser request, or a non-browser client without Origin."""
    if headers.get("Sec-Fetch-Site", "").lower() == "cross-site":
        return False
    origin = headers.get("Origin")
    if origin is None:
        return True
    try:
        parsed = urllib.parse.urlsplit(origin)
    except ValueError:
        return False
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return False
    host = headers.get("Host", "").strip().lower()
    scheme = headers.get("X-Forwarded-Proto", "http").split(",", 1)[0].strip().lower()
    return bool(host) and parsed.netloc.lower() == host and parsed.scheme == scheme


def admin_post_allowed(headers):
    """All admin mutations need same-origin and a JSON body."""
    if not same_origin_request(headers):
        return False
    content_type = headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
    return content_type == "application/json"



def backup_recipient():
    value = os.environ.get("BACKUP_AGE_RECIPIENT", "").strip()
    if value:
        return value
    try:
        return (APP_DIR / "data" / "backup-recipient").read_text(encoding="utf-8").strip()
    except OSError:
        return ""


def backup_encryption_required():
    return os.environ.get("BACKUP_ENCRYPTION_REQUIRED", "0").strip() == "1"


def get_modules():
    fallback = module_snapshot({"COMPOSE_PROFILES": COMPOSE_PROFILES,
                                "QUIOSC_MODE": os.environ.get("QUIOSC_MODE", "disabled"),
                                "MODULES_CONFIGURED": os.environ.get("MODULES_CONFIGURED", "1")})
    state = load_public_state(APP_DIR / "data" / "modules.json", fallback)
    # A missing host-side state file means the installation needs the matching
    # installer/scripts before it can apply module selections.
    state["manageable"] = (APP_DIR / "data" / "modules.json").is_file()
    state["backup_encryption_required"] = backup_encryption_required()
    state["backup_key_configured"] = bool(backup_recipient())
    state["backup_key_required"] = state["backup_encryption_required"] and not state["backup_key_configured"]
    return state


def action_modules(payload):
    try:
        enabled, expected = module_selection(payload)
    except ValueError as error:
        return False, str(error), 400
    state = get_modules()
    if not state["manageable"]:
        return False, "installer_update_required", 409
    if state.get("backup_key_required"):
        return False, "backup_key_required", 409
    if state.get("phase") == "applying":
        return False, "operation_busy", 409
    if expected != state["revision"]:
        return False, "configuration_changed", 409
    if "quiosc" in enabled and not state["available"].get("quiosc"):
        return False, "quiosc_not_prepared", 409
    repo = os.environ.get("REPO_DIR", str(APP_DIR))
    unit = "edutictac-commons-modules-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S") + "-" + secrets.token_hex(4)
    ok, _ = run_script("systemd-run", "--user", "--service-type=oneshot", "--no-block",
                       "--property=RemainAfterExit=yes", f"--unit={unit}",
                       f"--property=WorkingDirectory={repo}", "/usr/bin/env", "/usr/bin/python3",
                       str(Path(repo) / "scripts/manage-modules.py"), "apply",
                       "--enabled", ",".join(enabled), "--revision", expected)
    return ok, "modules_started" if ok else "host_runner_unavailable", 202 if ok else 503, {"unit": unit} if ok else {}


def read_stack_version():
    try:
        return VERSION_FILE.read_text().strip()
    except OSError:
        return "unknown"


def http_probe(url, timeout=3):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            return resp.status < 500, f"HTTP {resp.status}"
    except urllib.error.HTTPError as exc:
        return exc.code < 500, f"HTTP {exc.code}"
    except (urllib.error.URLError, OSError, TimeoutError) as exc:
        return False, str(exc)


def tcp_probe(host, port, timeout=2):
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True, "TCP OK"
    except OSError as exc:
        return False, str(exc)


def probe_services():
    services = {}

    ok, detail = http_probe(ID_API_HEALTH_URL)
    services["id-api"] = {"reachable": ok, "detail": detail}

    ok, detail = http_probe(PORTAL_HEALTH_URL)
    services["portal"] = {"reachable": ok, "detail": detail}

    if "eduhoot" in ACTIVE_PROFILES:
        ok, detail = tcp_probe("eduhoot", 3000)
        services["eduhoot"] = {"reachable": ok, "detail": detail, "expected": True}
        ok, detail = tcp_probe("eduhoot-mongo", 27017)
        services["eduhoot-mongo"] = {"reachable": ok, "detail": detail, "expected": True}
    else:
        services["eduhoot"] = {"reachable": False, "detail": "perfil eduhoot inactiu", "expected": False}
        services["eduhoot-mongo"] = {"reachable": False, "detail": "perfil eduhoot inactiu", "expected": False}

    return services


def list_backups(limit=20):
    if not BACKUPS_DIR.is_dir():
        return []
    dirs = sorted(
        (d for d in BACKUPS_DIR.iterdir() if d.is_dir() and d.name.startswith("commons-")),
        key=lambda d: d.name,
        reverse=True,
    )
    result = []
    for d in dirs[:limit]:
        manifest_path = d / "manifest.json"
        entry = {"name": d.name}
        if manifest_path.is_file():
            try:
                manifest = json.loads(manifest_path.read_text())
                entry["created_at"] = manifest.get("created_at")
                entry["stack_version"] = manifest.get("stack_version")
                entry["warnings"] = list(manifest.get("warnings", []))
                entry["complete"] = manifest.get("manifest_version") == 2 and manifest.get("complete") is True
                entry["encrypted"] = bool(manifest.get("encrypted"))
                if not entry["complete"]:
                    entry["warnings"].append("Còpia antiga amb cobertura parcial; consulta els serveis inclosos abans de restaurar.")
                entry["services"] = [s.get("name") for s in manifest.get("services", [])]
                update_path = d / "update.json"
                if update_path.is_file():
                    try:
                        entry["update"] = json.loads(update_path.read_text())
                    except (OSError, json.JSONDecodeError):
                        entry["update_error"] = "update.json il·legible"
            except (OSError, json.JSONDecodeError) as exc:
                entry["error"] = f"manifest il·legible: {exc}"
        else:
            entry["error"] = "manifest.json no trobat"
        result.append(entry)
    return result


def systemctl_show(unit, properties):
    args = ["systemctl", "--user", "show", unit]
    for prop in properties:
        args += ["-p", prop]
    try:
        proc = subprocess.run(args, capture_output=True, text=True, timeout=10)
    except (OSError, subprocess.TimeoutExpired) as exc:
        return {"error": str(exc)}
    if proc.returncode != 0:
        return {"error": proc.stderr.strip() or f"exit code {proc.returncode}"}
    values = {}
    for line in proc.stdout.splitlines():
        if "=" in line:
            key, _, value = line.partition("=")
            values[key] = value
    return values


def get_timer_status():
    timer = systemctl_show(
        TIMER_UNIT,
        ["UnitFileState", "ActiveState", "LastTriggerUSec", "NextElapseUSecRealtime"],
    )
    service = systemctl_show(
        SERVICE_UNIT,
        ["ActiveState", "Result", "ExecMainStatus"],
    )
    return {"timer": timer, "service": service}


def build_status():
    backups = list_backups()
    last_backup = backups[0] if backups else None

    coverage_warnings = list(last_backup.get("warnings", [])) if last_backup else []
    if last_backup is None:
        coverage_warnings.append("no hi ha cap backup encara")
    if (BACKUPS_DIR / "restore-failed.json").is_file():
        coverage_warnings.append("Restauració interrompuda: revisa el treball i la còpia de seguretat prèvia.")

    return {
        "stack_version": read_stack_version(),
        "image_registry": IMAGE_REGISTRY,
        "image_tag": IMAGE_TAG,
        "eduhoot_tag": EDUHOOT_TAG,
        "update_channel": UPDATE_CHANNEL,
        "active_profiles": sorted(ACTIVE_PROFILES),
        "services": probe_services(),
        "last_backup": last_backup,
        "backups": backups,
        "coverage_warnings": coverage_warnings,
        "backup_timer": get_timer_status(),
        "backup_secondary": secondary_status(BACKUPS_DIR),
        "checked_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


def run_script(*args, timeout=SCRIPT_TIMEOUT):
    try:
        proc = subprocess.run(
            args,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=str(APP_DIR),
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return False, str(exc)
    output = proc.stdout + proc.stderr
    return proc.returncode == 0, output


def job_status(unit_name):
    state = systemctl_show(unit_name, ["ActiveState", "SubState", "Result"])
    active_state = state.get("ActiveState", "")
    running = active_state in {"activating", "active", "reloading", "deactivating"}
    if state.get("SubState") == "exited":
        running = False
    _, log = run_script(
        "journalctl", "--user", "-u", unit_name, "--no-pager", "-o", "cat",
        timeout=10,
    )
    return {
        "unit": unit_name,
        "running": running,
        "active_state": active_state,
        "result": state.get("Result", ""),
        "log": log,
    }


def authentik_api(path, method="GET", payload=None):
    if not AUTHENTIK_API_TOKEN:
        raise RuntimeError("API de Authentik no configurada")
    body = None
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {AUTHENTIK_API_TOKEN}",
    }
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(
        f"{AUTHENTIK_API_URL}/{path.lstrip('/')}",
        data=body,
        headers=headers,
        method=method,
    )
    try:
        with urllib.request.urlopen(request, timeout=8) as response:
            raw = response.read()
            return response.status, json.loads(raw.decode("utf-8")) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:500]
        raise RuntimeError(f"Authentik HTTP {exc.code}: {detail}") from exc


def create_teacher(payload):
    username = str(payload.get("username", "")).strip().lower()
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    if not re.fullmatch(r"[a-z0-9][a-z0-9._-]{2,149}", username):
        raise ValueError("El usuario debe tener entre 3 y 150 caracteres y solo usar letras, números, punto, guion o guion bajo")
    if not name or len(name) > 150:
        raise ValueError("El nombre es obligatorio y no puede superar 150 caracteres")
    if email and (len(email) > 254 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email)):
        raise ValueError("El correo no es válido")

    _, groups = authentik_api(f"core/groups/?name={urllib.parse.quote(AUTHENTIK_TEACHER_GROUP)}")
    results = groups.get("results", [])
    if results:
        group_pk = results[0]["pk"]
    else:
        _, group = authentik_api("core/groups/", "POST", {"name": AUTHENTIK_TEACHER_GROUP, "is_superuser": False})
        group_pk = group["pk"]

    _, user = authentik_api("core/users/", "POST", {
        "username": username,
        "name": name,
        "email": email,
        "is_active": True,
        "type": "internal",
    })
    temporary_password = secrets.token_urlsafe(12)
    authentik_api(f"core/users/{user['pk']}/set_password/", "POST", {"password": temporary_password})
    authentik_api(f"core/groups/{group_pk}/add_user/", "POST", {"pk": user["pk"]})
    return {
        "username": username,
        "name": name,
        "email": email,
        "group": AUTHENTIK_TEACHER_GROUP,
        "temporary_password": temporary_password,
    }


def action_backup_key(payload):
    if not isinstance(payload, dict):
        return False, "invalid_recipient", 400
    recipient = str(payload.get("recipient", "")).strip()
    if not AGE_RECIPIENT_RE.fullmatch(recipient):
        return False, "invalid_recipient", 400
    repo = os.environ.get("REPO_DIR", str(APP_DIR))
    unit = "edutictac-commons-config-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S") + "-" + secrets.token_hex(4)
    ok, _ = run_script("systemd-run", "--user", "--service-type=oneshot", "--no-block",
                       "--property=RemainAfterExit=yes", f"--unit={unit}",
                       f"--property=WorkingDirectory={repo}", "/usr/bin/env", "/usr/bin/python3",
                       str(Path(repo) / "scripts" / "set-backup-recipient.py"), "--root", repo,
                       "--recipient", recipient)
    return ok, "backup_key_started" if ok else "host_runner_unavailable", 202 if ok else 503, {"unit": unit} if ok else {}


ACTIONS = {
    "/api/modules": action_modules,
    "/api/backup/key": action_backup_key,
    "/api/backup-timer/install": lambda payload: run_script(str(APP_DIR / "scripts" / "install-backup-timer.sh")),
    "/api/backup-timer/uninstall": lambda payload: run_script(str(APP_DIR / "scripts" / "uninstall-backup-timer.sh")),
}


def action_backup_create(payload):
    repo = os.environ.get("REPO_DIR", str(APP_DIR))
    unit = "edutictac-commons-backup-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S") + "-" + secrets.token_hex(4)
    ok, _ = run_script("systemd-run", "--user", "--service-type=oneshot", "--no-block",
                       "--property=RemainAfterExit=yes", "--property=TimeoutStartSec=30min", "--property=TimeoutStopSec=5min", f"--unit={unit}",
                       f"--property=WorkingDirectory={repo}", "/usr/bin/env", "/usr/bin/python3",
                       str(Path(repo) / "scripts/backup-stack.py"), "create")
    return ok, "backup_started" if ok else "host_runner_unavailable", 202 if ok else 503, {"unit": unit} if ok else {}


ACTIONS["/api/backup/create"] = action_backup_create


def action_backup_secondary(payload):
    if not isinstance(payload, dict) or not isinstance(payload.get("action"), str) or payload["action"] not in {"configure", "disable", "copy"}:
        return False, "invalid_action", 400
    action = payload["action"]
    arguments = [action]
    if action == "configure":
        try:
            mount = mount_path(payload.get("mount"))
        except SecondaryError:
            return False, "invalid_mount", 400
        arguments += ["--mount", str(mount)]
    repo = os.environ.get("REPO_DIR", str(APP_DIR))
    unit = "edutictac-commons-backup-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S") + "-" + secrets.token_hex(4)
    ok, _ = run_script("systemd-run", "--user", "--service-type=oneshot", "--no-block",
                       "--property=RemainAfterExit=yes", "--property=TimeoutStartSec=30min",
                       "--property=TimeoutStopSec=5min", f"--unit={unit}",
                       f"--property=WorkingDirectory={repo}", "/usr/bin/env", "/usr/bin/python3",
                       str(Path(repo) / "scripts/backup-secondary.py"), *arguments)
    return ok, "secondary_started" if ok else "host_runner_unavailable", 202 if ok else 503, {"unit": unit} if ok else {}


ACTIONS["/api/backup/secondary"] = action_backup_secondary


def action_backup_restore(payload):
    name = str(payload.get("backup", ""))
    if not BACKUP_NAME_RE.match(name):
        return False, "Backup invalid: selecciona una carpeta commons-YYYYmmddTHHMMSSZ", 400

    backup_dir = BACKUPS_DIR / name
    if not backup_dir.is_dir() or not (backup_dir / "manifest.json").is_file():
        return False, f"Backup no trobat o incomplet: {name}", 400

    repo_dir = os.environ.get("REPO_DIR", str(APP_DIR))
    host_backup_dir = str(Path(repo_dir) / "backups" / name)
    restore_script = str(Path(repo_dir) / "scripts" / "restore.sh")

    unit_name = f"edutictac-commons-restore-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    ok, output = run_script(
        "systemd-run",
        "--user",
        "--service-type=oneshot", "--no-block",
        "--property=RemainAfterExit=yes", "--property=TimeoutStartSec=30min", "--property=TimeoutStopSec=5min",
        f"--unit={unit_name}",
        f"--property=WorkingDirectory={repo_dir}",
        "/bin/sh",
        restore_script,
        host_backup_dir,
    )
    if ok:
        output += (
            "\nRestauracio iniciada. El panell pot desconnectar-se uns segons "
            "mentre el stack es para i torna a arrancar."
        )
    return ok, output, (200 if ok else 500), {"unit": unit_name}


ACTIONS["/api/backup/restore"] = action_backup_restore


def get_update_status():
    ok, output = run_script(str(APP_DIR / "scripts" / "check-updates.py"), "--json", timeout=30)
    if not ok:
        return False, {"ok": False, "output": output}
    try:
        return True, json.loads(output)
    except json.JSONDecodeError as exc:
        return False, {"ok": False, "output": f"Resposta d'actualitzacions no valida: {exc}\n{output}"}


def action_update_images(payload):
    repo_dir = os.environ.get("REPO_DIR", str(APP_DIR))
    update_script = str(Path(repo_dir) / "scripts" / "update-images.sh")

    unit_name = f"edutictac-commons-update-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    ok, output = run_script(
        "systemd-run",
        "--user",
        "--collect",
        f"--unit={unit_name}",
        f"--property=WorkingDirectory={repo_dir}",
        "/bin/sh",
        update_script,
    )
    if ok:
        output += (
            "\nActualitzacio iniciada. El proces crea i verifica un backup, "
            "descarrega imatges, reinicia el stack i executa comprovacions."
        )
    return ok, output, (200 if ok else 500), {"unit": unit_name}


ACTIONS["/api/images/update"] = action_update_images


def action_content_sync(channel):
    def action(payload):
        base_url = str(payload.get("base_url", "")).strip() or CONTENT_CATALOG_BASE_URL
        try:
            result = sync_channel(channel, base_url, CONTENT_SYNC_DIR)
            imported = None
            if channel == "resources":
                catalog_path = Path(result["path"]) / "resources" / "catalog.json"
                if not catalog_path.is_file():
                    raise ValueError("el catálogo de recursos no contiene resources/catalog.json")
                if not RESOURCES_IMPORT_TOKEN:
                    raise ValueError("RESOURCES_IMPORT_TOKEN no está configurado")
                catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
                body = json.dumps({"catalog": catalog}, ensure_ascii=False).encode("utf-8")
                request = urllib.request.Request(
                    f"{RESOURCES_API_URL}/api/internal/import-catalog",
                    data=body,
                    method="POST",
                    headers={
                        "Authorization": f"Bearer {RESOURCES_IMPORT_TOKEN}",
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                )
                with urllib.request.urlopen(request, timeout=120) as response:
                    imported = json.loads(response.read().decode("utf-8"))
                if imported.get("errors", 0):
                    raise ValueError("el índice rechazó algunos recursos; revisa el catálogo")
                # Regenera games.json/games-home.json al volum compartit amb el frontend recursos
                export_request = urllib.request.Request(
                    f"{RESOURCES_API_URL}/api/internal/export-catalog",
                    data=b"{}",
                    method="POST",
                    headers={
                        "Authorization": f"Bearer {RESOURCES_IMPORT_TOKEN}",
                        "Content-Type": "application/json",
                    },
                )
                with urllib.request.urlopen(export_request, timeout=60) as export_response:
                    json.loads(export_response.read().decode("utf-8"))
            elif channel == "eduhoot":
                if not EDUHOOT_RESOURCES_TOKEN:
                    raise ValueError("EDUHOOT_RESOURCES_TOKEN no está configurado")
                catalog_path = Path(result["path"]) / "eduhoot" / "quizzes.json"
                catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
                request = urllib.request.Request(
                    f"{EDUHOOT_API_URL}/api/integrations/recursos/import-catalog",
                    data=json.dumps(catalog, ensure_ascii=False).encode("utf-8"),
                    method="POST",
                    headers={"Authorization": f"Bearer {EDUHOOT_RESOURCES_TOKEN}",
                             "Content-Type": "application/json"},
                )
                with urllib.request.urlopen(request, timeout=120) as response:
                    imported = json.loads(response.read().decode("utf-8"))
                if not imported.get("ok") or imported.get("failed", 0):
                    raise ValueError("EduHoot no ha completado la importación")
        except urllib.error.HTTPError as exc:
            return False, f"Sincronización de {channel} fallida: API de importación HTTP {exc.code}", 502
        except (OSError, RuntimeError, ValueError, json.JSONDecodeError) as exc:
            return False, f"Sincronización de {channel} fallida: {exc}", 502
        suffix = ""
        if channel == "eduhoot" and imported is not None:
            suffix = (f" EduHoot local: {imported['imported']} cuestionarios importados, "
                      f"{imported['skipped']} ya existentes.")
        elif imported is not None:
            suffix = (
                f" Índice actualizado: {imported['total']} recursos "
                f"({imported['created']} nuevos, {imported['updated']} modificados)."
            )
        return True, (
            f"Canal {channel} sincronizado: versión {result['version']}, "
            f"{result['items']} elementos.{suffix} Copia local: {result['path']}"
        )
    return action


ACTIONS["/api/content-sync/resources"] = action_content_sync("resources")
ACTIONS["/api/content-sync/eduhoot"] = action_content_sync("eduhoot")


def action_rollback_images(payload):
    name = str(payload.get("backup", ""))
    if not BACKUP_NAME_RE.match(name):
        return False, "Backup invalid: selecciona una carpeta commons-YYYYmmddTHHMMSSZ", 400
    backup_dir = BACKUPS_DIR / name
    if not backup_dir.is_dir() or not (backup_dir / "update.json").is_file():
        return False, f"El backup no contiene una actualización reversible: {name}", 400
    repo_dir = os.environ.get("REPO_DIR", str(APP_DIR))
    rollback_script = str(Path(repo_dir) / "scripts" / "rollback-images.sh")
    unit_name = f"edutictac-commons-rollback-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    ok, output = run_script(
        "systemd-run", "--user", "--collect", f"--unit={unit_name}",
        f"--property=WorkingDirectory={repo_dir}", "/bin/sh", rollback_script, name,
    )
    return ok, output, (200 if ok else 500), {"unit": unit_name}


ACTIONS["/api/images/rollback"] = action_rollback_images


class Handler(BaseHTTPRequestHandler):
    server_version = "EduTicTacAdmin/1.0"

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _is_authorized(self):
        cookie = self.headers.get("Cookie", "")
        if not cookie:
            return False
        request = urllib.request.Request(ID_API_ME_URL, headers={"Cookie": cookie})
        try:
            with urllib.request.urlopen(request, timeout=3) as response:
                if response.status != 200:
                    return False
                payload = json.loads(response.read().decode("utf-8"))
        except (OSError, urllib.error.URLError, json.JSONDecodeError, TimeoutError):
            return False
        identity = payload.get("identity") or {}
        return identity_is_admin(identity)

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self):
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0:
            return {}
        if length > 8192:
            raise ValueError("cos de peticio massa gran")
        body = self.rfile.read(length)
        try:
            return json.loads(body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise ValueError(f"JSON invalid: {exc}") from exc

    def _send_static(self, rel_path):
        if rel_path in ("", "/"):
            rel_path = "index.html"
        rel_path = rel_path.lstrip("/")
        target = (PUBLIC_DIR / rel_path).resolve()
        if PUBLIC_DIR not in target.parents and target != PUBLIC_DIR:
            self.send_error(404)
            return
        if not target.is_file():
            self.send_error(404)
            return
        content_type = "text/html; charset=utf-8"
        if target.suffix == ".js":
            content_type = "application/javascript; charset=utf-8"
        elif target.suffix == ".css":
            content_type = "text/css; charset=utf-8"
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _files_settings(self, method="GET"):
        if not self._is_authorized():
            self._send_json(401, {"error": "unauthorized"})
            return
        headers = {"Cookie": self.headers.get("Cookie", ""), "Host": self.headers.get("Host", "")}
        data = None
        if method == "PUT":
            origin = self.headers.get("Origin", "")
            if (not origin or urllib.parse.urlsplit(origin).netloc.lower() != self.headers.get("Host", "").lower()
                    or self.headers.get("Sec-Fetch-Site") == "cross-site" or self.headers.get("X-Commons-Files") != "1"):
                self._send_json(403, {"error": "request_not_allowed"})
                return
            try: data = json.dumps(self._read_json_body()).encode()
            except ValueError:
                self._send_json(400, {"error": "invalid_request"})
                return
            headers.update({"Origin": origin, "Content-Type": "application/json", "X-Forwarded-Proto": urllib.parse.urlsplit(origin).scheme})
        url = ID_API_ME_URL.rsplit("/api/", 1)[0] + "/api/admin/files/settings"
        try:
            with urllib.request.urlopen(urllib.request.Request(url, data=data, headers=headers, method=method), timeout=10) as response:
                payload = json.loads(response.read())
            self._send_json(200, payload)
        except urllib.error.HTTPError as error:
            self._send_json(error.code, {"error": "files_settings_failed"})
        except (OSError, ValueError):
            self._send_json(502, {"error": "files_settings_unavailable"})

    def do_PUT(self):
        if self.path == "/api/admin/files/settings":
            self._files_settings("PUT")
        else:
            self._send_json(404, {"error": "not_found"})

    def do_GET(self):
        if self.path == "/api/admin/files/settings":
            self._files_settings()
            return
        if self.path.startswith("/api/"):
            if not self._is_authorized():
                self._send_json(401, {"error": "no autoritzat"})
                return
            parsed = urllib.parse.urlparse(self.path)
            if parsed.path == "/api/status":
                self._send_json(200, build_status())
                return
            if parsed.path == "/api/modules":
                self._send_json(200, get_modules())
                return
            if parsed.path == "/api/updates":
                ok, payload = get_update_status()
                self._send_json(200 if ok else 500, payload)
                return
            if parsed.path == "/api/job-status":
                unit = urllib.parse.parse_qs(parsed.query).get("unit", [""])[0]
                if not JOB_UNIT_RE.match(unit):
                    self._send_json(400, {"error": "unit invalid o absent"})
                    return
                self._send_json(200, job_status(unit))
                return
            self._send_json(404, {"error": "no trobat"})
            return
        self._send_static(self.path)

    def do_POST(self):
        if not self.path.startswith("/api/"):
            self.send_error(404)
            return
        if not admin_post_allowed(self.headers):
            self._send_json(403, {"ok": False, "output": "request_not_allowed"})
            return
        if not self._is_authorized():
            self._send_json(401, {"error": "no autoritzat"})
            return
        if self.path in {"/api/modules", "/api/backup/create", "/api/backup/key", "/api/backup/restore", "/api/backup/secondary"}:
            header = "X-Commons-Modules" if self.path == "/api/modules" else "X-Commons-Backup"
            if self.headers.get(header) != "1":
                self._send_json(403, {"ok": False, "output": "request_not_allowed"})
                return
        if self.path == "/api/teachers":
            try:
                teacher = create_teacher(self._read_json_body())
            except ValueError as exc:
                self._send_json(400, {"error": str(exc)})
            except (RuntimeError, KeyError) as exc:
                self._send_json(502, {"error": str(exc)})
            else:
                self._send_json(201, {"ok": True, "teacher": teacher})
            return
        action = ACTIONS.get(self.path)
        if action is None:
            self._send_json(404, {"error": "no trobat"})
            return
        try:
            payload = self._read_json_body()
        except ValueError as exc:
            self._send_json(400, {"ok": False, "output": str(exc)})
            return
        result = action(payload)
        ok, output = result[:2]
        status = result[2] if len(result) > 2 else (200 if ok else 500)
        extra = result[3] if len(result) > 3 else {}
        self._send_json(status, {"ok": ok, "output": output, **extra})


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
