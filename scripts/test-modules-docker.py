#!/usr/bin/env python3
"""Exercise module lifecycle on an isolated core with real Authentik and volumes.

Build commons-selector-{id,portal,admin}:test first. Requires cached optional
service images; never installs or modifies the active Commons project.
"""
import argparse
from contextlib import closing
import importlib.util
import json
import os
from pathlib import Path
import secrets
import shutil
import socket
import subprocess
import tempfile
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("modules_check_controller", ROOT / "scripts/manage-modules.py")
manager = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(manager)


def free_port():
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        return listener.getsockname()[1]


def isolate_resources(model, project):
    """Normalized Compose keeps explicit resource names; replace all of them."""
    if not project.startswith("commons-modules-check-"):
        raise ValueError("Invalid test namespace")
    model["name"] = project
    for kind in ("volumes", "networks"):
        for key, resource in model.get(kind, {}).items():
            if resource.get("external") or resource.get("driver_opts"):
                raise ValueError("External resources are forbidden in this test")
            resource["name"] = project + "_" + key
    for service in model["services"].values():
        if service.get("container_name"):
            raise ValueError("Fixed container names are forbidden in this test")
    return model


def assert_new_resources(model):
    for kind, command in (("volumes", "volume"), ("networks", "network")):
        for resource in model.get(kind, {}).values():
            result = subprocess.run(["docker", command, "inspect", resource["name"]], capture_output=True)
            if result.returncode == 0:
                raise ValueError("Refusing to reuse an existing Docker resource")


def assert_isolated_model(model, work):
    for kind in ("networks", "volumes"):
        for resource in model.get(kind, {}).values():
            if resource.get("external") or not resource.get("name", "").startswith(work.name + "_"):
                raise ValueError("Docker resource escaped the test namespace")
    for service in model["services"].values():
        if service.get("container_name"):
            raise ValueError("Fixed container names are forbidden")
        for mount in service.get("volumes", []):
            if mount.get("type") == "bind" and not Path(mount["source"]).resolve().is_relative_to(work.resolve()):
                raise ValueError("Host bind escaped the disposable directory")


def verify_backup_roundtrip(work, controller, current):
    import sqlite3
    spec = importlib.util.spec_from_file_location('roundtrip_backup', work / 'scripts/backup-stack.py')
    backups = importlib.util.module_from_spec(spec); spec.loader.exec_module(backups)
    stack = backups.Stack(work)
    expected = {}
    for relative in ['id.db', 'quiosc.db', 'recursos-api/recursos.db']:
        with closing(sqlite3.connect(work / 'data' / relative)) as conn, conn:
            conn.execute('CREATE TABLE IF NOT EXISTS commons_backup_probe(value TEXT)');conn.execute('DELETE FROM commons_backup_probe')
            conn.execute("INSERT INTO commons_backup_probe VALUES ('before')")
    files = ['play/roundtrip.txt', 'recursos-api/documents/roundtrip.txt', 'authentik/roundtrip.txt', 'eduhoot-uploads/roundtrip.txt']
    seed = """import os,json,sys
from pathlib import Path
for relative in json.loads(sys.argv[1]):
 p=Path('/data')/relative
 if not p.parent.exists():
  p.parent.mkdir(parents=True);os.chown(p.parent,int(sys.argv[2]),int(sys.argv[3]))
 p.write_text(sys.argv[4])
 if sys.argv[4]=='before': os.chown(p,int(sys.argv[2]),int(sys.argv[3]))
"""
    stack.command([*stack.docker, 'run', '--rm', '--pull=never', '--network=none', '--user=0',
        '--mount', 'type=bind,src=' + str(work / 'data') + ',dst=/data', '--entrypoint=python',
        'commons-selector-id:test', '-c', seed, json.dumps(files), str(os.getuid()), str(os.getgid()), 'before'], 'seed_files_failed')
    expected = {relative: 'before' for relative in files}
    stack.compose(['exec', '-T', 'authentik-postgresql', 'psql', '-U', 'authentik', '-d', 'authentik', '-v', 'ON_ERROR_STOP=1', '-c',
        "CREATE TABLE IF NOT EXISTS commons_backup_probe(value TEXT); DELETE FROM commons_backup_probe; INSERT INTO commons_backup_probe VALUES ('before');"], 'seed_postgres_failed')
    stack.compose(['exec', '-T', 'eduhoot-mongo', 'mongosh', '--quiet', '--eval',
        "db.getSiblingDB('commons_backup_probe').evidence.deleteMany({});db.getSiblingDB('commons_backup_probe').evidence.insertOne({value:'before'})"], 'seed_mongo_failed')
    print('backup Docker check: creating complete backup', flush=True)
    with stack.locks():
        backup = stack.create()
    manifest = stack.validate(backup)
    assert {'id-api', 'quiosc', 'play', 'recursos', 'authentik', 'eduhoot', 'configuration'} <= {s['name'] for s in manifest['services']}
    for relative in ['id.db', 'quiosc.db', 'recursos-api/recursos.db']:
        with closing(sqlite3.connect(work / 'data' / relative)) as conn, conn:
            conn.execute("UPDATE commons_backup_probe SET value='after'")
    stack.command([*stack.docker, 'run', '--rm', '--pull=never', '--network=none', '--user=0',
        '--mount', 'type=bind,src=' + str(work / 'data') + ',dst=/data', '--entrypoint=python',
        'commons-selector-id:test', '-c', seed, json.dumps(files), str(os.getuid()), str(os.getgid()), 'after'], 'mutate_files_failed')
    stack.compose(['exec', '-T', 'authentik-postgresql', 'psql', '-U', 'authentik', '-d', 'authentik', '-v', 'ON_ERROR_STOP=1', '-c',
        "UPDATE commons_backup_probe SET value='after'"], 'mutate_postgres_failed')
    stack.compose(['exec', '-T', 'eduhoot-mongo', 'mongosh', '--quiet', '--eval',
        "db.getSiblingDB('commons_backup_probe').evidence.updateOne({},{$set:{value:'after'}})"], 'mutate_mongo_failed')
    print('backup Docker check: restoring verified backup', flush=True)
    with stack.locks():
        stack.restore(backup)
    for relative in ['id.db', 'quiosc.db', 'recursos-api/recursos.db']:
        with closing(sqlite3.connect(work / 'data' / relative)) as conn, conn:
            assert conn.execute('SELECT value FROM commons_backup_probe').fetchone()[0] == 'before'
    verify = "import json,sys;from pathlib import Path;assert all((Path('/data')/p).read_text()=='before' for p in json.loads(sys.argv[1]))"
    stack.command([*stack.docker, 'run', '--rm', '--pull=never', '--network=none', '--user=0',
        '--mount', 'type=bind,src=' + str(work / 'data') + ',dst=/data,readonly', '--entrypoint=python',
        'commons-selector-id:test', '-c', verify, json.dumps(files)], 'check_restored_files_failed')
    assert stack.compose(['exec', '-T', 'authentik-postgresql', 'psql', '-U', 'authentik', '-d', 'authentik', '-Atc',
        'SELECT value FROM commons_backup_probe'], 'check_postgres_failed').strip() == b'before'
    assert stack.compose(['exec', '-T', 'eduhoot-mongo', 'mongosh', '--quiet', '--eval',
        "db.getSiblingDB('commons_backup_probe').evidence.findOne().value"], 'check_mongo_failed').strip() == b'before'
    controller.health(manager.read_env(work / '.env'))
    print('backup Docker check: PostgreSQL, Mongo, three SQLite DBs, files, configuration and service health OK', flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--backup-roundtrip', action='store_true')
    parser.add_argument('--keep-on-failure', action='store_true')
    args = parser.parse_args()
    clean_environment = {key: os.environ[key] for key in ("PATH", "HOME") if key in os.environ}
    clean_environment.update(PWD=str(ROOT), LANG="C.UTF-8")
    result = subprocess.run(["docker", "compose", "--env-file", ".env.example", "--profile", "*",
                             "-f", "compose.yml", "config", "--format", "json"], cwd=ROOT,
                            env=clean_environment, capture_output=True, text=True, check=True)
    model = json.loads(result.stdout)
    image_overrides = {"id-api": "commons-selector-id:test", "portal": "commons-selector-portal:test",
                       "admin": "commons-selector-admin:test",
                       "play": "registry.edutictac.es/edutictac/commons-play:0.1.1-alpha25",
                       "recursos": "registry.edutictac.es/edutictac/recursos:0.1.1-alpha18",
                       "recursos-api": "registry.edutictac.es/edutictac/recursos-api:0.1.1-alpha18",
                       "eduhoot": "registry.edutictac.es/edutictac/eduhoot:1.0.5"}
    model.pop("name", None)
    for name, service in model["services"].items():
        service.pop("build", None)
        if name in image_overrides:
            service["image"] = image_overrides[name]
        service["pull_policy"] = "never"
        for port in service.get("ports", []):
            port["host_ip"] = "127.0.0.1"
    admin = model["services"]["admin"]
    admin.pop("pid", None)
    admin["volumes"] = [value for value in admin["volumes"] if value["target"] in
                        {"/app/data", "/app/backups", "/app/content-sync"}]
    # A private directory and unique Compose name keep this separate from .env,
    # the host user bus, Epoptes sockets and persistent data of the real stack.
    work = Path(tempfile.mkdtemp(prefix="commons-modules-check-"))
    isolate_resources(model, work.name)
    assert_new_resources(model)
    values = {"COMPOSE_PROJECT_NAME": work.name, "COMPOSE_PROFILES": "authentik", "MODULES_CONFIGURED": "0",
              "PUID": str(os.getuid()), "PGID": str(os.getgid()), "REPO_DIR": str(work),
              "QUIOSC_MODE": "disabled", "IMAGE_TAG": "0.1.1-alpha25", "ADMIN_TAG": "0.1.1-alpha25",
              "IMAGE_REGISTRY": "registry.edutictac.es/edutictac", "EDUHOOT_TAG": "1.0.5",
              "RECURSOS_TAG": "0.1.1-alpha18", "AUTHENTIK_TAG": "2026.8.3",
              "EDUTICTAC_ID_DB": "/data/id.db", "EDUTICTAC_ID_COOKIE_SECURE": "0",
              "EDUHOOT_PUBLIC_IMPORT_SOURCE": "", "CONTENT_CATALOG_BASE_URL": ""}
    for key in ["EDUTICTAC_ID_SECRET", "EDUTICTAC_ID_TEACHER_TOKEN", "EDUTICTAC_ID_APP_TOKEN",
                "AUTHENTIK_PG_PASS", "AUTHENTIK_SECRET_KEY", "AUTHENTIK_BOOTSTRAP_PASSWORD",
                "AUTHENTIK_API_TOKEN", "EDUTICTAC_ID_OIDC_CLIENT_SECRET", "RECURSOS_SECRET",
                "EDUHOOT_RESOURCES_TOKEN", "RESOURCES_IMPORT_TOKEN", "PLAY_INGEST_TOKEN"]:
        values[key] = secrets.token_hex(32)
    for key in ["PORTAL_PORT", "ADMIN_PORT", "PLAY_PORT", "EDUHOOT_PORT", "RECURSOS_PORT",
                "AUTHENTIK_PORT", "AUTHENTIK_HTTPS_PORT"]:
        values[key] = str(free_port())
    values.update(EDUTICTAC_ID_OIDC_CLIENT_ID="commons-synthetic-check",
                  EDUTICTAC_ID_OIDC_REDIRECT_URL=f"http://127.0.0.1:{values['PORTAL_PORT']}/api/auth/oidc/callback",
                  RECURSOS_OIDC_REDIRECT_URI=f"http://127.0.0.1:{values['RECURSOS_PORT']}/api/auth/callback")
    for service in model["services"].values():
        for mount in service.get("volumes", []):
            if mount.get("type") == "bind":
                relative = Path(mount["source"]).relative_to(ROOT)
                mount["source"] = str(work / relative)
        for port in service.get("ports", []):
            # Replace every exposed port with its synthetic loopback allocation.
            target = int(port["target"])
            key = {80: "RECURSOS_PORT", 8083: "PLAY_PORT", 8091: "ADMIN_PORT", 3000: "EDUHOOT_PORT",
                   9000: "AUTHENTIK_PORT", 9443: "AUTHENTIK_HTTPS_PORT"}.get(target)
            if service is model["services"]["portal"]:
                key = "PORTAL_PORT"
            assert key is not None
            port["published"] = values[key]
        environment = service.get("environment", {})
        for key in environment:
            if key in values:
                environment[key] = values[key]
        for key, value in {"POSTGRES_PASSWORD": values["AUTHENTIK_PG_PASS"],
                           "AUTHENTIK_POSTGRESQL__PASSWORD": values["AUTHENTIK_PG_PASS"]}.items():
            if key in environment:
                environment[key] = value
    # These settings must continue following the .env file as the controller
    # switches modules. Every other resolved value is synthetic and isolated.
    for service in (model["services"]["id-api"], model["services"]["admin"]):
        for key in ("COMPOSE_PROFILES", "MODULES_CONFIGURED", "QUIOSC_MODE"):
            if key in service["environment"]:
                service["environment"][key] = "${" + key + "}"
    model["services"]["id-api"]["environment"]["COMMONS_MODULE_PROFILES"] = "${COMPOSE_PROFILES}"
    controller = manager.Controller(work)
    current = values
    preserve = False
    try:
        for name in ["scripts", "admin", "authentik-blueprints", "authentik-compat"]:
            shutil.copytree(ROOT / name, work / name, ignore=shutil.ignore_patterns("__pycache__"))
        shutil.copy2(ROOT / "VERSION", work / "VERSION")
        (work / "data").mkdir()
        # Match postinst: non-root services must own their bind directories
        # before Docker creates them as root.
        for directory in ("play", "recursos-api", "recursos-www", "eduhoot"):
            (work / "data" / directory).mkdir()
        (work / "backups").mkdir()
        manager.atomic_write(work / ".env", "".join(f"{key}={value}\n" for key, value in values.items()))
        manager.atomic_write(work / "compose.yml", json.dumps(model))
        resolved = json.loads(controller.compose(["config", "--format", "json"], values, "isolation_check_failed"))
        assert_isolated_model(resolved, work)
        print("modules Docker check: starting isolated core", flush=True)
        controller.compose(["up", "-d", "--no-build", "--wait", "--wait-timeout", "180"], values, "core_start_failed")
        controller.health(values)
        controller.publish(values)
        assert not json.loads((work / "data/modules.json").read_text())["configured"]
        with urllib.request.urlopen(f"http://127.0.0.1:{values['PORTAL_PORT']}/api/modules/status", timeout=10) as response:
            assert json.load(response)["enabled"] == []
        print("modules Docker check: enable optional tools", flush=True)
        if args.backup_roundtrip:
            manager.atomic_write(work / '.env', manager.replace_settings((work / '.env').read_text(),
                {'COMPOSE_PROFILES': 'authentik,play,recursos,eduhoot', 'MODULES_CONFIGURED': '1'}))
            current = manager.read_env(work / '.env')
            controller.compose(['up', '-d', '--no-build', '--wait', '--wait-timeout', '180'], current, 'optional_start_failed')
            controller.health(current)
        else:
            controller.apply(["play", "eduhoot", "recursos"], manager.revision(values))
        current = manager.read_env(work / ".env")
        if args.backup_roundtrip:
            verify_backup_roundtrip(work, controller, current)
            return
        marker = work / "data/play/selector-retention-probe.txt"
        marker.write_text("retained")
        print("modules Docker check: disable optional tools", flush=True)
        controller.apply([], manager.revision(current))
        current = manager.read_env(work / ".env")
        assert marker.read_text() == "retained"
        running = controller.compose(["ps", "--status", "running", "--services"], current, "state_check_failed").splitlines()
        assert not set(running) & {"play", "eduhoot", "eduhoot-mongo", "recursos", "recursos-api"}
        assert {"id-api", "portal", "admin", "authentik-server"} <= set(running)
        print("modules Docker check: re-enable and preserve data", flush=True)
        controller.apply(["play"], manager.revision(current))
        current = manager.read_env(work / ".env")
        assert marker.read_text() == "retained"
        controller.apply([], manager.revision(current))
        current = manager.read_env(work / ".env")
        print("modules Docker check: missing image rollback", flush=True)
        model["services"]["play"]["image"] = "commons-selector-missing:never-published"
        manager.atomic_write(work / "compose.yml", json.dumps(model))
        before = (work / ".env").read_bytes()
        try:
            controller.apply(["play"], manager.revision(current))
        except manager.ModuleError as error:
            assert str(error) == "services_start_failed"
        else:
            raise AssertionError("Missing image must fail")
        assert (work / ".env").read_bytes() == before
        assert json.loads((work / "data/modules.json").read_text())["phase"] == "failed"
        controller.health(current)
        print("modules Docker check: core access, enable/disable, retained data and rollback OK", flush=True)
    except Exception:
        preserve = args.keep_on_failure
        if preserve:
            print('Isolated test retained for debugging: ' + str(work), flush=True)
        # Container state is useful without exposing environment or service logs.
        result = subprocess.run(["docker", "ps", "-a", "--filter", "label=com.docker.compose.project=" + work.name,
                                 "--format", "{{.Names}} {{.Status}}"], capture_output=True, text=True)
        print(result.stdout, flush=True)
        raise
    finally:
        if not preserve:
            if (work / "compose.yml").exists():
                try:
                    controller.compose(["--profile", "*", "down", "--volumes", "--remove-orphans"], current, "cleanup_failed")
                finally:
                    # Database containers own files under this disposable directory.
                    # Remove only that bind-mounted test directory, never host data.
                    subprocess.run(["docker", "run", "--rm", "--pull=never", "--network=none", "--user=0",
                                    "--entrypoint=python", "-v", str(work / "data") + ":/cleanup",
                                    "commons-selector-id:test", "-c",
                                    "from pathlib import Path; import shutil; [shutil.rmtree(p) if p.is_dir() else p.unlink() for p in Path('/cleanup').iterdir()]"],
                                   capture_output=True)
            shutil.rmtree(work, ignore_errors=True)


if __name__ == "__main__":
    main()
