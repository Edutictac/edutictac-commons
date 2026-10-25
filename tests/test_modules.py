import importlib.util
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys

import pytest

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / "admin"))
SPEC = importlib.util.spec_from_file_location("manage_modules", ROOT / "scripts/manage-modules.py")
manager = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(manager)
from modules import load_public_state, selection, snapshot


class FakeController(manager.Controller):
    def __init__(self, root):
        super().__init__(root)
        self.calls = []
        self.fail = []
        self.prepared = False

    def command(self, arguments, values, code, timeout=240):
        self.calls.append((arguments, code))
        if code in self.fail:
            self.fail.remove(code)
            raise manager.ModuleError(code)
        return ""

    def health(self, values):
        self.command([], values, "core_health_failed")

    def quiosc_ready(self, values):
        return self.prepared


@pytest.fixture
def controller(tmp_path):
    path = tmp_path / ".env"
    path.write_text("COMPOSE_PROFILES=authentik,play,eduhoot\nMODULES_CONFIGURED=0\n"
                    "QUIOSC_MODE=disabled\nUNCHANGED_SETTING=synthetic-private-value\n"
                    f"PUID={os.getuid()}\nPGID={os.getgid()}\n")
    path.chmod(0o600)
    (tmp_path / "data/play").mkdir(parents=True)
    (tmp_path / "data/play/retained.txt").write_text("keep")
    return FakeController(tmp_path)


def apply(controller, enabled):
    values = manager.read_env(controller.env_path)
    controller.apply(enabled, manager.revision(values))


def test_apply_preserves_data_and_stops_disabled_services_explicitly(controller):
    apply(controller, ["recursos"])
    values = manager.read_env(controller.env_path)
    assert values["COMPOSE_PROFILES"] == "authentik,recursos"
    assert values["MODULES_CONFIGURED"] == "1"
    assert (controller.data / "play/retained.txt").read_text() == "keep"
    commands = [arguments for arguments, code in controller.calls]
    assert any("stop" in arguments and "play" in arguments and "eduhoot" in arguments for arguments in commands)
    assert not any("down" in arguments or "rm" in arguments or "--volumes" in arguments for arguments in commands)
    state = json.loads(controller.state_path.read_text())
    assert state["enabled"] == ["recursos"]
    assert "synthetic-private-value" not in controller.state_path.read_text()


@pytest.mark.parametrize("failure", ["services_start_failed", "services_stop_failed", "core_health_failed", "compose_configuration_failed"])
def test_failure_recovers_previous_configuration_and_stops_new_modules(controller, failure):
    original = controller.env_path.read_bytes()
    controller.fail = [failure]
    with pytest.raises(manager.ModuleError, match=failure):
        apply(controller, ["recursos"])
    assert controller.env_path.read_bytes() == original
    state = json.loads(controller.state_path.read_text())
    assert state["phase"] == "failed"
    assert state["enabled"] == ["eduhoot", "play"]
    assert any("stop" in args and "recursos-api" in args for args, code in controller.calls)


def test_failed_backup_never_changes_configuration_or_starts_services(controller):
    original = controller.env_path.read_bytes()
    controller.fail = ["backup_failed"]
    with pytest.raises(manager.ModuleError, match="backup_failed"):
        apply(controller, [])
    assert controller.env_path.read_bytes() == original
    assert not any("up" in args or "stop" in args for args, code in controller.calls)


def test_configuration_revision_and_locks_prevent_overlapping_operations(controller):
    with pytest.raises(manager.ModuleError, match="configuration_changed"):
        controller.apply([], "0" * 64)
    assert controller.calls == []
    with manager.locked(controller.data / ".stack-operation.lock"):
        with pytest.raises(manager.ModuleError, match="operation_busy"):
            apply(controller, [])
        result = subprocess.run(["sh", "-c", f'. "{ROOT}/scripts/operation-lock.sh"'],
                                cwd=controller.root, capture_output=True, text=True,
                                env={key: value for key, value in os.environ.items() if key != "COMMONS_OPERATION_LOCK_HELD"})
        assert result.returncode == 1


def test_quiosc_requires_preparation_and_an_idle_classroom(controller):
    with pytest.raises(manager.ModuleError, match="quiosc_not_prepared"):
        apply(controller, ["quiosc"])
    controller.prepared = True
    apply(controller, ["quiosc"])
    with sqlite3.connect(controller.data / "quiosc.db") as conn:
        conn.execute("CREATE TABLE devices (state TEXT)")
        conn.execute("INSERT INTO devices VALUES ('unknown')")
    controller.calls.clear()
    with pytest.raises(manager.ModuleError, match="quiosc_sessions_pending"):
        apply(controller, [])
    assert controller.calls == []
    with sqlite3.connect(controller.data / "quiosc.db") as conn:
        conn.execute("UPDATE devices SET state='finished'")
    apply(controller, [])
    assert manager.read_env(controller.env_path)["QUIOSC_MODE"] == "disabled"


def test_quiosc_start_and_maintenance_share_a_lock(controller, monkeypatch):
    monkeypatch.syspath_prepend(str(ROOT / "services/id-api"))
    monkeypatch.setenv("EDUTICTAC_ID_DB", str(controller.data / "id.db"))
    from module_guard import quiosc_start_guard
    from fastapi import HTTPException
    with manager.locked(controller.data / ".modules-quiosc.lock"):
        with pytest.raises(HTTPException) as error:
            with quiosc_start_guard():
                pytest.fail("Maintenance must block new supervised sessions")
        assert error.value.status_code == 409
    with quiosc_start_guard():
        with pytest.raises(manager.ModuleError, match="operation_busy"):
            apply(controller, [])


@pytest.mark.parametrize("payload", [[], {"enabled": ["authentik"], "revision": "0" * 64},
    {"enabled": ["play", "play"], "revision": "0" * 64},
    {"enabled": ["play; rm -rf /"], "revision": "0" * 64},
    {"enabled": [], "revision": "x"}, {"enabled": [], "revision": "0" * 64, "command": "arbitrary"}])
def test_requests_are_allowlisted(payload):
    with pytest.raises(ValueError):
        selection(payload)


def test_public_state_does_not_echo_unexpected_fields(controller):
    values = manager.read_env(controller.env_path)
    state = snapshot(values)
    state["unexpected_private_field"] = "must-not-be-exposed"
    controller.state_path.write_text(json.dumps(state))
    public = load_public_state(controller.state_path, {})
    assert "unexpected_private_field" not in public
    assert public["enabled"] == ["eduhoot", "play"]


def test_rollback_failure_is_reported(controller):
    controller.fail = ["services_start_failed", "rollback_failed"]
    with pytest.raises(manager.ModuleError, match="rollback_failed"):
        apply(controller, ["recursos"])
    assert json.loads(controller.state_path.read_text())["error"] == "rollback_failed"


@pytest.mark.parametrize('editor', ['blocs', 'llibres'])
def test_optional_editor_can_be_enabled_and_disabled_without_losing_files(controller, editor):
    retained = controller.data / (editor + '-project.bin')
    retained.write_bytes(b'synthetic retained project')
    assert editor not in snapshot(manager.read_env(controller.env_path))['enabled']
    apply(controller, [editor])
    assert editor in snapshot(manager.read_env(controller.env_path))['enabled']
    apply(controller, [])
    assert editor not in snapshot(manager.read_env(controller.env_path))['enabled']
    assert retained.read_bytes() == b'synthetic retained project'
    assert any('stop' in arguments and editor in arguments for arguments, _ in controller.calls)


@pytest.mark.parametrize('editor', ['blocs', 'llibres'])
def test_failed_editor_start_restores_previous_selection(controller, editor):
    previous = controller.env_path.read_bytes()
    controller.fail = ['services_start_failed']
    with pytest.raises(manager.ModuleError, match='services_start_failed'):
        apply(controller, [editor])
    assert controller.env_path.read_bytes() == previous
    assert editor not in json.loads(controller.state_path.read_text())['enabled']


def test_public_editor_port_is_validated_and_reports_the_selected_module(controller, monkeypatch):
    monkeypatch.syspath_prepend(str(ROOT / 'services/id-api'))
    monkeypatch.setenv('EDUTICTAC_ID_DB', str(controller.data / 'id.db'))
    monkeypatch.setenv('COMMONS_MODULE_PROFILES', 'authentik,blocs,llibres')
    monkeypatch.setenv('LLIBRES_PORT', '18298')
    from module_guard import public_modules
    assert public_modules() == {'enabled': ['blocs', 'llibres'], 'ports': {'llibres': 18298}}
    monkeypatch.setenv('LLIBRES_PORT', 'invalid:8098')
    assert public_modules()['ports']['llibres'] == 8098


def test_missing_backup_public_key_blocks_before_any_backup(controller):
    with controller.env_path.open("a") as stream:
        stream.write("BACKUP_ENCRYPTION_REQUIRED=1\nBACKUP_AGE_RECIPIENT=\n")
    with pytest.raises(manager.ModuleError, match="backup_key_required"):
        apply(controller, ["play"])
    assert controller.calls == []
    assert not controller.state_path.exists()


def test_configured_backup_public_key_allows_selection(controller):
    with controller.env_path.open("a") as stream:
        stream.write("BACKUP_ENCRYPTION_REQUIRED=1\nBACKUP_AGE_RECIPIENT=age1" + "q" * 58 + "\n")
    apply(controller, ["play"])
    assert manager.read_env(controller.env_path)["COMPOSE_PROFILES"] == "authentik,play"
