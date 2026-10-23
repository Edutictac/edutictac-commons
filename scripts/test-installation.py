#!/usr/bin/env python3
"""Prova instal·lacio i restauracio en un projecte Docker temporal independent."""

import argparse
from contextlib import closing
import json
import os
from pathlib import Path
import secrets
import shutil
import socket
import sqlite3
import subprocess
import tempfile
import urllib.request


def free_port():
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        return listener.getsockname()[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", default="registry.edutictac.es/edutictac")
    parser.add_argument("--commons-tag", default="0.1.1-alpha")
    parser.add_argument("--eduhoot-tag", default="1.0.2")
    parser.add_argument("--pull", action="store_true")
    parser.add_argument("--editors", action="store_true", help="Include optional Blocs and Llibres with isolated ports")
    parser.add_argument("--lock", type=Path, help="Manifest JSON amb imatges fixades per digest")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    locked = json.loads(args.lock.read_text())["images"] if args.lock else None

    with tempfile.TemporaryDirectory(prefix="commons-install-test-") as temporary:
        work = Path(temporary)
        for name in ("compose.yml", "VERSION"):
            shutil.copy2(root / name, work / name)
        shutil.copytree(root / "scripts", work / "scripts", ignore=shutil.ignore_patterns("__pycache__"))
        (work / "admin").mkdir()
        shutil.copy2(root / "admin/modules.py", work / "admin/modules.py")
        (work / "data").mkdir()
        (work / "backups").mkdir()
        portal_port, eduhoot_port, admin_port = free_port(), free_port(), free_port()
        config = {
            "COMPOSE_PROJECT_NAME": "commons-check-" + secrets.token_hex(5),
            "COMPOSE_PROFILES": "eduhoot,blocs,llibres" if args.editors else "eduhoot",
            "LLIBRES_PORT": str(free_port()),
            "IMAGE_REGISTRY": args.registry,
            "IMAGE_TAG": args.commons_tag,
            "EDUHOOT_TAG": args.eduhoot_tag,
            "PORTAL_PORT": str(portal_port),
            "EDUHOOT_PORT": str(eduhoot_port),
            "ADMIN_PORT": str(admin_port),
            "PUID": str(os.getuid()),
            "PGID": str(os.getgid()),
            "EDUTICTAC_ID_SECRET": secrets.token_hex(32),
            "EDUTICTAC_ID_TEACHER_TOKEN": secrets.token_hex(32),
            "EDUTICTAC_ID_APP_TOKEN": secrets.token_hex(32),
            "ADMIN_OIDC_USERNAME": "akadmin",
            "EDUTICTAC_ID_COOKIE_SECURE": "0",
            "EDUHOOT_ID_AUTH_REQUIRED": "0",
            "EDUHOOT_PUBLIC_IMPORT_SOURCE": "",
        }
        env_path = work / ".env"
        env_path.touch(mode=0o600)
        env_path.write_text("".join(f"{key}={value}\n" for key, value in config.items()))
        env = dict(os.environ, **config, PWD=str(work))
        # Do not inherit an unrelated Compose project, extra file or live DB path.
        for key in ("COMPOSE_FILE", "EDUTICTAC_ID_DB", "BACKUP_LOCK_DIR", "BACKUP_LOCK_HELD"):
            env.pop(key, None)
        compose = ["docker", "compose", "--env-file", ".env", "-f", "compose.yml"]

        def run(command, **kwargs):
            return subprocess.run(command, cwd=work, env=env, check=True, **kwargs)

        model = json.loads(run(compose + ["config", "--format", "json"], capture_output=True, text=True).stdout)
        for name, service in model["services"].items():
            service.pop("build", None)
            if locked:
                service["image"] = locked[name]
            for port in service.get("ports", []):
                port["host_ip"] = "127.0.0.1"
        admin = model["services"]["admin"]
        admin.pop("pid", None)
        admin["volumes"] = [v for v in admin["volumes"] if v["target"] in ("/app/backups", "/app/data")]
        (work / "compose.yml").chmod(0o600)
        (work / "compose.yml").write_text(json.dumps(model, indent=2) + "\n")

        def mongo(script):
            return run(compose + ["exec", "-T", "eduhoot-mongo", "mongosh", "--quiet", "kahootDB", "--eval", script], capture_output=True, text=True).stdout.strip()

        try:
            print("Instal·lant imatges en un stack temporal...", flush=True)
            if args.pull:
                run(compose + ["pull"])
            run(compose + ["up", "-d", "--no-build", "--wait", "--wait-timeout", "120"])
            for port, path in ((portal_port, "/api/health"), (eduhoot_port, "/"), (admin_port, "/")):
                with urllib.request.urlopen(f"http://127.0.0.1:{port}{path}", timeout=10) as response:
                    assert response.status == 200
            if args.editors:
                for port, path in ((portal_port, "/blocs/editor.html"), (int(config["LLIBRES_PORT"]), "/engine/index.html")):
                    with urllib.request.urlopen(f"http://127.0.0.1:{port}{path}", timeout=15) as response:
                        assert response.status == 200
                with urllib.request.urlopen(f"http://127.0.0.1:{config['LLIBRES_PORT']}/publication-status", timeout=10) as response:
                    assert "recursos" not in json.load(response)["enabled"]
            run(["sh", "scripts/test-flow.sh"])
            run(["sh", "scripts/test-eduhoot-flow.sh"])

            with closing(sqlite3.connect(work / "data/id.db")) as database, database:
                database.execute("CREATE TABLE release_restore_probe(value TEXT)")
                database.execute("INSERT INTO release_restore_probe VALUES ('abans')")
            mongo("db.release_restore_probe.insertOne({_id:'release', value:'abans'})")
            run(compose + ["exec", "-T", "eduhoot", "node", "-e",
                "const fs=require('fs'); for(const p of ['public/uploads/release-probe.txt','logs/release-probe.txt']) fs.writeFileSync(p,'abans');"])
            run(["sh", "scripts/backup.sh"])
            run(["sh", "scripts/backup-check.sh"])
            backup = next((work / "backups").glob("commons-*"))
            manifest = json.loads((backup / "manifest.json").read_text())
            assert not manifest["warnings"], "El backup ha de cobrir tots els serveis"
            assert {s["name"] for s in manifest["services"]} == {"id-api", "eduhoot", "configuration"}

            with closing(sqlite3.connect(work / "data/id.db")) as database, database:
                database.execute("UPDATE release_restore_probe SET value='despres'")
            mongo("db.release_restore_probe.updateOne({_id:'release'}, {$set:{value:'despres'}})")
            run(compose + ["exec", "-T", "eduhoot", "node", "-e",
                "const fs=require('fs'); for(const p of ['public/uploads/release-probe.txt','logs/release-probe.txt']) fs.writeFileSync(p,'despres');"])
            run(["sh", "scripts/restore.sh", str(backup)])
            with closing(sqlite3.connect(work / "data/id.db")) as database:
                assert database.execute("SELECT value FROM release_restore_probe").fetchone()[0] == "abans"
            assert mongo("db.release_restore_probe.findOne({_id:'release'}).value") == "abans"
            run(compose + ["exec", "-T", "eduhoot", "node", "-e",
                "const fs=require('fs'),assert=require('assert'); for(const p of ['public/uploads/release-probe.txt','logs/release-probe.txt']) assert.equal(fs.readFileSync(p,'utf8'),'abans');"])
            run(["sh", "scripts/test-eduhoot-flow.sh"])
            print("OK instal·lacio, SQLite, MongoDB, uploads i informes restaurats", flush=True)
        finally:
            run(compose + ["down", "--volumes", "--remove-orphans"])
            # MongoDB files belong to the container UID; remove only this test's data.
            run(["docker", "run", "--rm", "-v", f"{work / 'data'}:/test-data",
                 model["services"]["eduhoot-mongo"]["image"], "sh", "-c", "find /test-data -mindepth 1 -delete"])


if __name__ == "__main__":
    main()
