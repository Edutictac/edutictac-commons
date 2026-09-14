#!/usr/bin/env python3
"""Panell d'administracio operativa per a EduTicTac Commons.

Nomes libreria estandard (cap dependencia pip). Serveix els fitxers
estatics de public/ i exposa una API JSON minima, protegida per token,
per llegir l'estat del stack i disparar un conjunt tancat (allowlist) de
scripts ja existents al repo.
"""

import hmac
import json
import os
import re
import socket
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = APP_DIR / "public"
BACKUPS_DIR = APP_DIR / "backups"
VERSION_FILE = APP_DIR / "VERSION"

ADMIN_TOKEN = os.environ.get("EDUTICTAC_ADMIN_TOKEN", "change-this-admin-token")
PORT = int(os.environ.get("ADMIN_INTERNAL_PORT", "8091"))

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
                entry["warnings"] = manifest.get("warnings", [])
                entry["services"] = [s.get("name") for s in manifest.get("services", [])]
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


ACTIONS = {
    "/api/backup-timer/install": lambda payload: run_script(str(APP_DIR / "scripts" / "install-backup-timer.sh")),
    "/api/backup-timer/uninstall": lambda payload: run_script(str(APP_DIR / "scripts" / "uninstall-backup-timer.sh")),
}


def action_backup_create(payload):
    ok, out1 = run_script(str(APP_DIR / "scripts" / "backup.sh"))
    if not ok:
        return False, out1
    ok2, out2 = run_script(str(APP_DIR / "scripts" / "backup-check.sh"))
    return ok2, out1 + "\n" + out2


ACTIONS["/api/backup/create"] = action_backup_create


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
        "--collect",
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
    return ok, output


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
    return ok, output


ACTIONS["/api/images/update"] = action_update_images


class Handler(BaseHTTPRequestHandler):
    server_version = "EduTicTacAdmin/1.0"

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _is_authorized(self):
        header = self.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return False
        token = header[len("Bearer "):]
        return hmac.compare_digest(token, ADMIN_TOKEN)

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
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
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith("/api/"):
            if not self._is_authorized():
                self._send_json(401, {"error": "no autoritzat"})
                return
            if self.path == "/api/status":
                self._send_json(200, build_status())
                return
            if self.path == "/api/updates":
                ok, payload = get_update_status()
                self._send_json(200 if ok else 500, payload)
                return
            self._send_json(404, {"error": "no trobat"})
            return
        self._send_static(self.path)

    def do_POST(self):
        if not self.path.startswith("/api/"):
            self.send_error(404)
            return
        if not self._is_authorized():
            self._send_json(401, {"error": "no autoritzat"})
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
        self._send_json(status, {"ok": ok, "output": output})


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
