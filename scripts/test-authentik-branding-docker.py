#!/usr/bin/env python3
"""Prova aïllada de la marca EduTicTac en Authentik.

Arranca PostgreSQL i Authentik amb `docker run` (no Compose), amb noms
aleatoris, una xarxa pròpia i la base de dades en tmpfs: no es crea cap volum
ni es comparteix cap recurs amb una instal·lació real. Comprova recursos
estàtics, blueprint de marca, títols dels fluxos, traducció i peu de pàgina.
"""

from __future__ import annotations

import json
import os
import secrets
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUTHENTIK_TAG = "2026.8.3"
PREFIX = f"edutictac-branding-test-{secrets.token_hex(4)}"
NETWORK = f"{PREFIX}-net"
DB = f"{PREFIX}-db"
SERVER = f"{PREFIX}-server"
WORKER = f"{PREFIX}-worker"
PORT = 19000 + secrets.randbelow(900)


def docker(*args: str, check: bool = True, capture: bool = True) -> str:
    result = subprocess.run(["docker", *args], check=check, text=True,
                            capture_output=capture)
    return result.stdout if capture else ""


def refuse_existing() -> None:
    names = docker("ps", "-a", "--format", "{{.Names}}").split()
    networks = docker("network", "ls", "--format", "{{.Name}}").split()
    if any(name.startswith(PREFIX) for name in names) or NETWORK in networks:
        sys.exit(f"Ja existixen recursos amb el prefix {PREFIX}; no es continua.")


def branding_mounts(service: str) -> list[str]:
    compat = ROOT / "authentik-compat" / AUTHENTIK_TAG
    branding = ROOT / "authentik-branding"
    i18n = branding / "i18n" / AUTHENTIK_TAG
    mounts = [
        f"{compat / 'migrate.py'}:/lifecycle/migrate.py:ro",
        f"{compat / 'tenant_to_brand.py'}:/lifecycle/system_migrations/tenant_to_brand.py:ro",
        f"{branding / 'startup_migration.py'}:/lifecycle/system_migrations/zz_edutictac_branding.py:ro",
        f"{i18n / 'django.mo'}:/locale/es_ES/LC_MESSAGES/django.mo:ro",
    ]
    if service == "server":
        mounts += [
            f"{branding / 'assets'}:/web/dist/assets/edutictac:ro",
            f"{i18n / 'es-ES.js'}:/web/dist/src/locales/chunks/MNQDNCSE.js:ro",
        ]
    else:
        mounts += [
            f"{ROOT / 'authentik-blueprints' / 'edutictac-branding.yaml'}:/blueprints/edutictac-branding.yaml:ro",
            f"{branding}:/blueprints/edutictac-branding:ro",
            f"{branding / 'default-blueprints' / AUTHENTIK_TAG}:/blueprints/default:ro",
        ]
    for mount in mounts:
        source = Path(mount.split(":", 1)[0])
        if not source.exists() or not source.is_relative_to(ROOT):
            sys.exit(f"Muntatge no vàlid: {source}")
    return [arg for mount in mounts for arg in ("-v", mount)]


def start_authentik(service: str, env: list[str]) -> None:
    name = SERVER if service == "server" else WORKER
    ports = ["-p", f"127.0.0.1:{PORT}:9000"] if service == "server" else []
    docker("run", "-d", "--name", name, "--network", NETWORK, *ports, *env,
           *branding_mounts(service), f"ghcr.io/goauthentik/server:{AUTHENTIK_TAG}", service)


def ak_shell(code: str) -> dict:
    out = docker("exec", WORKER, "ak", "shell", "-c", code)
    line = next(line for line in out.splitlines() if line.startswith("@@"))
    return json.loads(line[2:])


def wait_until(check, timeout: int, label: str):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            value = check()
            if value:
                return value
        except Exception:  # noqa: BLE001 - es reintenta fins al límit
            pass
        time.sleep(3)
    raise TimeoutError(label)


def http_status(path: str) -> int:
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{PORT}{path}", timeout=10) as response:
            return response.status
    except urllib.error.HTTPError as error:
        return error.code



def capture(url: str, path: str) -> None:
    """Captura opcional de la pantalla d'accés amb el Playwright del repositori."""

    script = (
        "const { chromium } = require('playwright');"
        "(async () => { const b = await chromium.launch(); const p = await b.newPage();"
        "await p.goto(process.argv[1]); await p.waitForTimeout(4000);"
        "await p.screenshot({ path: process.argv[2] }); await b.close(); })();"
    )
    subprocess.run(["node", "-e", script, url, path], check=True,
                   env={**os.environ, "NODE_PATH": str(ROOT / "node_modules")})


STATE = """
import json
from authentik.brands.models import Brand
from authentik.flows.models import Flow
from authentik.tenants.models import Tenant
from authentik.blueprints.models import BlueprintInstance
b = Brand.objects.get(domain='authentik-default')
print('@@' + json.dumps({
    'title': b.branding_title, 'logo': b.branding_logo, 'favicon': b.branding_favicon,
    'background': b.branding_default_flow_background, 'css': len(b.branding_custom_css),
    'settings': (b.attributes or {}).get('settings'),
    'flows': {f.slug: [f.title, str(f.background)] for f in Flow.objects.all()},
    'footer': Tenant.objects.get(schema_name='public').footer_links,
    'blueprint': [i.status for i in BlueprintInstance.objects.filter(name='EduTicTac Commons - Marca')],
}))
"""


def main() -> int:
    refuse_existing()
    password = secrets.token_urlsafe(24)
    env = ["-e", f"AUTHENTIK_POSTGRESQL__HOST={DB}", "-e", "AUTHENTIK_POSTGRESQL__NAME=authentik",
           "-e", "AUTHENTIK_POSTGRESQL__USER=authentik", "-e", f"AUTHENTIK_POSTGRESQL__PASSWORD={password}",
           "-e", f"AUTHENTIK_SECRET_KEY={secrets.token_urlsafe(48)}",
           "-e", "AUTHENTIK_ERROR_REPORTING__ENABLED=false"]
    failures: list[str] = []
    try:
        docker("network", "create", "--internal", NETWORK)
        docker("run", "-d", "--name", DB, "--network", NETWORK, "--tmpfs", "/var/lib/postgresql/data",
               "-e", "POSTGRES_DB=authentik", "-e", "POSTGRES_USER=authentik",
               "-e", f"POSTGRES_PASSWORD={password}", "postgres:16-alpine")
        wait_until(lambda: subprocess.run(["docker", "exec", DB, "pg_isready", "-U", "authentik"],
                                          capture_output=True).returncode == 0, 60, "PostgreSQL")
        start_authentik("server", env)
        start_authentik("worker", env)
        # La xarxa interna no té eixida; el port publicat necessita una xarxa amb pont.
        docker("network", "connect", "bridge", SERVER)
        wait_until(lambda: http_status("/-/health/ready/") == 200, 300, "Authentik preparat")
        # Marca i títols han de quedar bé ja en la primera arrancada, sense carrera
        # entre el blueprint de marca i els blueprints per defecte.
        wait_until(lambda: (s := ak_shell(STATE))["title"] == "EduTicTac"
                   and s["flows"].get("default-authentication-flow", [""])[0] == "Entra amb EduTicTac",
                   300, "marca i títols en la primera arrancada")
        time.sleep(20)
        state = ak_shell(STATE)
        if state["flows"]["default-authentication-flow"][0] != "Entra amb EduTicTac":
            failures.append("els blueprints per defecte han tornat a posar el títol en anglés")
        # El peu s'aplica en una arrancada amb la taula del tenant ja creada.
        docker("restart", SERVER)
        wait_until(lambda: http_status("/-/health/ready/") == 200, 300, "Authentik després de reiniciar")
        state = ak_shell(STATE)

        expect = {
            "logo": "/static/dist/assets/edutictac/logo.png",
            "favicon": "/static/dist/assets/edutictac/favicon.png",
            "background": "/static/dist/assets/edutictac/background.jpg",
        }
        for key, value in expect.items():
            if state[key] != value:
                failures.append(f"{key}: {state[key]!r}")
        if state["css"] < 1000:
            failures.append("CSS de marca absent")
        if state["settings"] != {"theme": {"base": "light"}, "locale": "es"}:
            failures.append(f"settings: {state['settings']!r}")
        if state["flows"].get("default-authentication-flow", [""])[0] != "Entra amb EduTicTac":
            failures.append(f"títol del flux: {state['flows'].get('default-authentication-flow')!r}")
        if not any(link.get("name") == "EduTicTac Commons" for link in state["footer"]):
            failures.append(f"peu: {state['footer']!r}")
        if state["blueprint"] != ["successful"]:
            failures.append(f"estat del blueprint: {state['blueprint']!r}")
        for path in ["logo.png", "favicon.png", "background.jpg",
                     "fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2"]:
            if http_status(f"/static/dist/assets/edutictac/{path}") != 200:
                failures.append(f"recurs no servit: {path}")
        chunk = urllib.request.urlopen(
            f"http://127.0.0.1:{PORT}/static/dist/src/locales/chunks/MNQDNCSE.js", timeout=10).read().decode()
        if "Contrasenya" not in chunk:
            failures.append("traducció valenciana no servida")
        print(json.dumps({**state, "flows": len(state["flows"])}, ensure_ascii=False))
        screenshot = os.environ.get("EDUTICTAC_BRANDING_SCREENSHOT")
        if screenshot:
            capture(f"http://127.0.0.1:{PORT}/if/flow/default-authentication-flow/", screenshot)
    except Exception:
        for name in (SERVER, WORKER):
            logs = subprocess.run(["docker", "logs", "--tail", "40", name], capture_output=True, text=True)
            print(f"--- {name}\n{logs.stdout}{logs.stderr}")
        raise
        if failures:
            logs = subprocess.run(["docker", "logs", WORKER], capture_output=True, text=True)
            for line in (logs.stdout + logs.stderr).splitlines():
                if '"level": "error"' in line or '"level": "warning"' in line and "blueprint" in line:
                    print(line[:600])
    finally:
        for name in (SERVER, WORKER, DB):
            subprocess.run(["docker", "rm", "-f", name], capture_output=True)
        subprocess.run(["docker", "network", "rm", NETWORK], capture_output=True)
    if failures:
        print("ERRORS:\n- " + "\n- ".join(failures))
        return 1
    print("OK: marca, fluxos, traducció i peu aplicats en Authentik aïllat.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
