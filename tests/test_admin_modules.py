import http.client
from http.server import ThreadingHTTPServer
import importlib.util
import io
import json
from pathlib import Path
import sys
import threading

import pytest

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / "admin"))
SPEC = importlib.util.spec_from_file_location("admin_modules_test", ROOT / "admin/server.py")
admin = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(admin)


@pytest.fixture
def api(tmp_path, monkeypatch):
    (tmp_path / "data").mkdir()
    state = admin.module_snapshot({"COMPOSE_PROFILES": "authentik", "MODULES_CONFIGURED": "0"})
    (tmp_path / "data/modules.json").write_text(json.dumps(state))
    monkeypatch.setattr(admin, "APP_DIR", tmp_path)
    monkeypatch.setenv("REPO_DIR", "/opt/synthetic-commons")
    identity = {"provider": "authentik", "username": "akadmin"}
    calls = []
    def user(request, timeout):
        return io.BytesIO(json.dumps({"identity": identity}).encode())
    # Preserve real authorization logic, replace only the upstream identity API.
    class Reply(io.BytesIO):
        status = 200
    monkeypatch.setattr(admin.urllib.request, "urlopen", lambda *args, **kwargs: Reply(json.dumps({"identity": identity}).encode()))
    def run(*args, **kwargs):
        calls.append(args)
        return True, ""
    monkeypatch.setattr(admin, "run_script", run)
    server = ThreadingHTTPServer(("127.0.0.1", 0), admin.Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    def request(method, path, body=None, headers=None):
        connection = http.client.HTTPConnection(*server.server_address, timeout=3)
        values = {"Cookie": "synthetic-session", "Content-Type": "application/json", "X-Commons-Modules": "1"}
        values.update(headers or {})
        connection.request(method, path, json.dumps(body) if body is not None else None, values)
        response = connection.getresponse()
        result = response.status, json.loads(response.read())
        connection.close()
        return result
    try:
        yield request, state, identity, calls
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def test_only_authentik_admin_can_read_or_apply(api):
    request, state, identity, calls = api
    assert request("GET", "/api/modules", headers={"Cookie": ""})[0] == 401
    identity["username"] = "teacher"
    assert request("GET", "/api/modules")[0] == 401
    assert request("POST", "/api/modules", {"enabled": [], "revision": state["revision"]})[0] == 401
    assert calls == []
    identity["username"] = "akadmin"
    status, result = request("GET", "/api/modules")
    assert status == 200
    assert result["configured"] is False


@pytest.mark.parametrize("headers", [{"X-Commons-Modules": ""}, {"Origin": "https://untrusted.example"},
                                    {"Sec-Fetch-Site": "cross-site"}, {"Content-Type": "text/plain"}])
def test_cross_origin_and_form_requests_are_rejected(api, headers):
    request, state, identity, calls = api
    assert request("POST", "/api/modules", {"enabled": ["play"], "revision": state["revision"]}, headers)[0] == 403
    assert calls == []


def test_apply_runs_only_fixed_host_command_and_returns_trackable_job(api):
    request, state, identity, calls = api
    status, result = request("POST", "/api/modules", {"enabled": ["play"], "revision": state["revision"]})
    assert status == 202
    assert admin.JOB_UNIT_RE.fullmatch(result["unit"])
    command = calls[0]
    assert command[:2] == ("systemd-run", "--user")
    assert "/opt/synthetic-commons/scripts/manage-modules.py" in command
    assert "--enabled" in command and "play" in command
    assert not any("shell" in item for item in command)
    assert request("POST", "/api/modules", {"enabled": ["play; arbitrary"], "revision": state["revision"]})[0] == 400


def test_stale_selection_and_unprepared_quiosc_are_rejected(api):
    request, state, identity, calls = api
    assert request("POST", "/api/modules", {"enabled": [], "revision": "0" * 64})[0] == 409
    assert request("POST", "/api/modules", {"enabled": ["quiosc"], "revision": state["revision"]})[0] == 409
    assert calls == []


def test_completed_module_job_remains_queryable_after_admin_restart(monkeypatch):
    monkeypatch.setattr(admin, "systemctl_show", lambda *args: {"ActiveState": "active", "SubState": "exited", "Result": "success"})
    monkeypatch.setattr(admin, "run_script", lambda *args, **kwargs: (True, "modules: success"))
    result = admin.job_status("edutictac-commons-modules-20261017120000-01234567")
    assert result["running"] is False
    assert result["result"] == "success"


def test_backup_runs_as_retained_host_job(api):
    request, state, identity, calls = api
    status, result = request('POST', '/api/backup/create', {}, headers={'X-Commons-Backup': '1'})
    assert status == 202 and result['ok']
    assert result['unit'].startswith('edutictac-commons-backup-')
    command = calls[-1]
    assert '--service-type=oneshot' in command and '--property=RemainAfterExit=yes' in command
    assert '/opt/synthetic-commons/scripts/backup-stack.py' in command
    assert command[-1] == 'create'
    assert admin.JOB_UNIT_RE.fullmatch(result['unit'])


def test_backup_is_protected_from_cross_site_requests(api):
    request, state, identity, calls = api
    assert request('POST', '/api/backup/create', {})[0] == 403
    assert request('POST', '/api/backup/create', {}, headers={'X-Commons-Backup': '1', 'Origin': 'https://untrusted.example'})[0] == 403
    assert calls == []


def test_completed_backup_job_is_still_queryable(monkeypatch):
    monkeypatch.setattr(admin, 'systemctl_show', lambda *args: {'ActiveState': 'active', 'SubState': 'exited', 'Result': 'success'})
    monkeypatch.setattr(admin, 'run_script', lambda *args, **kwargs: (True, 'complete'))
    result = admin.job_status('edutictac-commons-backup-20261018060000-aabbccdd')
    assert result['running'] is False and result['result'] == 'success'


def test_secondary_backup_configuration_runs_on_host_and_needs_csrf(api):
    request, state, identity, calls = api
    assert request('POST', '/api/backup/secondary', {'action': 'disable'})[0] == 403
    assert request('POST', '/api/backup/secondary', {'action': 'disable'}, headers={'X-Commons-Backup':'1', 'Origin':'https://untrusted.example'})[0] == 403
    for action in ['configure', 'copy', 'disable']:
        code, result = request('POST', '/api/backup/secondary', {'action':action, 'mount':'/media/school usb'}, headers={'X-Commons-Backup':'1'})
        assert code == 202 and admin.JOB_UNIT_RE.fullmatch(result['unit'])
        assert '/opt/synthetic-commons/scripts/backup-secondary.py' in calls[-1]
    configure = calls[0]
    assert configure[-3:] == ('configure', '--mount', '/media/school usb')
    assert '--property=RemainAfterExit=yes' in configure


@pytest.mark.parametrize('payload', [{'action':[]}, {'action':'mount'}, {'action':'configure','mount':'relative'}, {'action':'configure','mount':'/'}, []])
def test_secondary_backup_rejects_invalid_configuration(api, payload):
    request, state, identity, calls = api
    assert request('POST', '/api/backup/secondary', payload, headers={'X-Commons-Backup':'1'})[0] == 400
    assert calls == []


def test_admin_imports_secondary_support_in_container_layout(tmp_path):
    import shutil
    import subprocess
    for name in ['server.py', 'content_sync.py', 'modules.py']:
        shutil.copyfile(ROOT / 'admin' / name, tmp_path / name)
    (tmp_path / 'scripts').mkdir()
    shutil.copyfile(ROOT / 'scripts/backup_secondary.py', tmp_path / 'scripts/backup_secondary.py')
    result = subprocess.run([sys.executable, '-c', 'import server; assert callable(server.secondary_status)'],
                            cwd=tmp_path, capture_output=True, timeout=10)
    assert result.returncode == 0
