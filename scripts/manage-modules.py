#!/usr/bin/env python3
"""Apply an allowlisted module selection on the host; never remove persistent data."""
import argparse
from contextlib import contextmanager
import fcntl
import json
import os
import re
from pathlib import Path
import sqlite3
import stat
import subprocess
import sys
import tempfile
import time
import urllib.request

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "admin"))
from modules import PROFILES, SERVICES, selection, revision, snapshot


class ModuleError(Exception):
    """Only fixed error codes may cross into job logs or the public state."""


def read_env(path):
    values = {}
    for line in path.read_text().splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            value = value.strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            values[key.strip()] = value
    return values


def atomic_write(path, data, mode=0o600, owner=None):
    descriptor, temporary = tempfile.mkstemp(prefix=".modules-", dir=path.parent)
    try:
        os.fchmod(descriptor, mode)
        if owner is not None:
            os.fchown(descriptor, *owner)
        with os.fdopen(descriptor, "w") as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def replace_settings(text, changes):
    lines, seen = [], set()
    for line in text.splitlines():
        key = line.split("=", 1)[0] if "=" in line and not line.lstrip().startswith("#") else None
        if key in changes:
            if key not in seen:
                lines.append(f"{key}={changes[key]}")
                seen.add(key)
        else:
            lines.append(line)
    lines.extend(f"{key}={value}" for key, value in changes.items() if key not in seen)
    return "\n".join(lines) + "\n"


@contextmanager
def locked(path):
    descriptor = os.open(path, os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o644)
    try:
        try:
            fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ModuleError("operation_busy") from None
        yield
    finally:
        os.close(descriptor)


class Controller:
    def __init__(self, root):
        self.root = Path(root).resolve()
        self.env_path = self.root / ".env"
        self.data = self.root / "data"
        self.state_path = self.data / "modules.json"

    def quiosc_ready(self, values):
        # Preparation remains a one-time administrative action, never a side effect
        # of selecting a box in the browser.
        return (values.get("QUIOSC_LOCAL_AUTH") == "1"
                and values.get("QUIOSC_DISCOVERY") == "epoptes"
                and Path("/usr/local/lib/edutictac-quiosc/launcher.py").is_file()
                and Path("/etc/edutictac-quiosc.json").is_file()
                and Path(values.get("QUIOSC_HOST_EPOPTES_SOCKET", "/run/epoptes/epoptes.socket")).is_socket())

    def publish(self, values, phase="idle", error=None):
        state = snapshot(values, quiosc_ready=self.quiosc_ready(values), phase=phase, error=error)
        self.data.mkdir(exist_ok=True)
        uid, gid = int(values.get("PUID", os.getuid())), int(values.get("PGID", os.getgid()))
        owner = (uid, gid) if os.geteuid() == 0 else None
        atomic_write(self.state_path, json.dumps(state) + "\n", 0o644, owner)
        return state

    def command(self, arguments, values, code, timeout=240):
        # Compose must read this installation's file, without stale shell overrides.
        env = {k: v for k, v in os.environ.items() if k not in values and not k.startswith("COMPOSE_")}
        env.update(PWD=str(self.root), REPO_DIR=str(self.root), COMMONS_OPERATION_LOCK_HELD="1", COMMONS_QUIOSC_LOCK_HELD="1")
        try:
            result = subprocess.run(arguments, cwd=self.root, env=env, capture_output=True, text=True, timeout=timeout)
        except (OSError, subprocess.TimeoutExpired):
            raise ModuleError(code) from None
        if result.returncode:
            if code.startswith('backup'):
                for line in result.stderr.splitlines():
                    if re.fullmatch(r'backup: [A-Za-z_:]+', line):
                        print(line, flush=True)
            # Docker/Compose diagnostics can contain interpolated credentials.
            raise ModuleError(code)
        return result.stdout

    def compose(self, arguments, values, code):
        return self.command(["docker", "compose", "--project-directory", str(self.root),
                             "--env-file", str(self.env_path), "-f", str(self.root / "compose.yml"),
                             *arguments], values, code)

    def ensure_quiosc_idle(self):
        path = self.data / "quiosc.db"
        if not path.exists():
            return
        try:
            with sqlite3.connect(path.as_uri() + "?mode=ro", uri=True) as conn:
                exists = conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='devices'").fetchone()
                if exists and conn.execute("SELECT 1 FROM devices WHERE state NOT IN ('finished','simulation_finished') LIMIT 1").fetchone():
                    raise ModuleError("quiosc_sessions_pending")
        except sqlite3.Error:
            raise ModuleError("quiosc_state_unavailable") from None

    def health(self, values):
        checks = [(values.get("PORTAL_PORT", "8082"), "/api/health"),
                  (values.get("AUTHENTIK_PORT", "9000"), "/-/health/ready/")]
        profiles = set(values.get("COMPOSE_PROFILES", "").split(","))
        for module, port, path in [("play", "8084", "/api/health"),
                                   ("eduhoot", "8090", "/"),
                                   ("recursos", "8086", "/api/health")]:
            if module in profiles:
                checks.append((values.get(module.upper() + "_PORT", port), path))
        for port, path in checks:
            ready = False
            for _ in range(30):
                try:
                    with urllib.request.urlopen(f"http://127.0.0.1:{int(port)}{path}", timeout=3) as response:
                        ready = response.status == 200
                except (OSError, ValueError):
                    pass
                if ready:
                    break
                time.sleep(1)
            if not ready:
                raise ModuleError("core_health_failed") from None

    def apply(self, enabled, expected):
        enabled, expected = selection({"enabled": enabled, "revision": expected})
        self.data.mkdir(exist_ok=True)
        with locked(self.data / ".stack-operation.lock"), locked(self.data / ".modules-quiosc.lock"):
            old = read_env(self.env_path)
            if "authentik" not in old.get("COMPOSE_PROFILES", "").split(","):
                raise ModuleError("core_setup_required")
            if revision(old) != expected:
                self.publish(old, "failed", "configuration_changed")
                raise ModuleError("configuration_changed")
            if "quiosc" in enabled and not self.quiosc_ready(old):
                raise ModuleError("quiosc_not_prepared")
            if old.get("QUIOSC_MODE", "disabled") != "disabled":
                self.ensure_quiosc_idle()
            original = self.env_path.read_text()
            metadata = self.env_path.stat()
            if stat.S_IMODE(metadata.st_mode) & 0o007:
                raise ModuleError("configuration_permissions")
            profiles = set(filter(None, old.get("COMPOSE_PROFILES", "").split(","))) - PROFILES
            profiles.update({"authentik"} | (set(enabled) & PROFILES))
            changes = {"COMPOSE_PROFILES": ",".join(sorted(profiles)), "MODULES_CONFIGURED": "1",
                       "QUIOSC_MODE": "real" if "quiosc" in enabled else "disabled"}
            updated = {**old, **changes}
            self.publish(old, "applying")
            changed = False
            try:
                print("modules: backup", flush=True)
                self.command(["sh", "scripts/backup.sh"], old, "backup_failed")
                self.command(["sh", "scripts/backup-check.sh"], old, "backup_check_failed")
                # Retain the previous configuration only in this host process's
                # memory, never in public state or a student-accessible volume.
                atomic_write(self.env_path, replace_settings(original, changes),
                             stat.S_IMODE(metadata.st_mode), (metadata.st_uid, metadata.st_gid))
                changed = True
                self.compose(["config", "--quiet"], updated, "compose_configuration_failed")
                print("modules: start", flush=True)
                self.compose(["up", "-d", "--no-build", "--wait", "--wait-timeout", "180"], updated, "services_start_failed")
                self.health(updated)
                # Stop optional services explicitly: changing a profile alone does
                # not stop a container. Never down/rm volumes or delete data.
                disabled = [name for module in sorted(PROFILES - set(enabled)) for name in SERVICES[module]]
                if disabled:
                    self.command(["docker", "compose", "--profile", "play", "--profile", "eduhoot",
                                  "--profile", "recursos", "--env-file", str(self.env_path), "-f", "compose.yml",
                                  "stop", *disabled], updated, "services_stop_failed")
                self.publish(updated)
                print("modules: success", flush=True)
            except Exception as error:
                code = str(error) if isinstance(error, ModuleError) else "operation_failed"
                rollback_ok = True
                if changed:
                    print("modules: rollback", flush=True)
                    try:
                        atomic_write(self.env_path, original, stat.S_IMODE(metadata.st_mode),
                                     (metadata.st_uid, metadata.st_gid))
                        self.compose(["up", "-d", "--no-build", "--wait", "--wait-timeout", "180"], old, "rollback_failed")
                        added = (set(enabled) & PROFILES) - set(old.get("COMPOSE_PROFILES", "").split(","))
                        if added:
                            self.compose(["--profile", "play", "--profile", "eduhoot", "--profile", "recursos",
                                          "stop", *[s for module in sorted(added) for s in SERVICES[module]]], old, "rollback_failed")
                        self.health(old)
                    except Exception:
                        rollback_ok = False
                self.publish(old if rollback_ok else read_env(self.env_path), "failed",
                             code if rollback_ok else "rollback_failed")
                raise ModuleError(code if rollback_ok else "rollback_failed") from None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    sub = parser.add_subparsers(dest="action", required=True)
    status = sub.add_parser("status")
    status.add_argument("--write", action="store_true")
    apply = sub.add_parser("apply")
    apply.add_argument("--enabled", required=True)
    apply.add_argument("--revision", required=True)
    args = parser.parse_args()
    controller = Controller(args.root)
    if args.action == "status":
        values = read_env(controller.env_path)
        result = controller.publish(values) if args.write else snapshot(values, quiosc_ready=controller.quiosc_ready(values))
        print(json.dumps(result))
    else:
        try:
            controller.apply(args.enabled.split(",") if args.enabled else [], args.revision)
        except (ModuleError, ValueError) as error:
            print("modules: " + str(error), file=sys.stderr)
            raise SystemExit(1)


if __name__ == "__main__":
    main()
