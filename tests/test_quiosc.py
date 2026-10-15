import json
import os
from pathlib import Path
import shlex
import socket
import sqlite3
import subprocess
import sys
import threading
import time

import pytest
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).parents[1] / 'services/id-api'))
from quiosc.api import install
from quiosc.epoptes import Epoptes, EpoptesError, encode_box, read_box
from quiosc import remote
from quiosc.service import Quiosc


@pytest.fixture
def service(tmp_path, monkeypatch):
    room = {'id': 'lab', 'name': 'Aula', 'group_id': 'group-1', 'devices': [
        {'id': 'pc1', 'label': 'PC 1', 'mac': '02:00:00:00:00:01', 'uid': '1000'},
        {'id': 'pc2', 'label': 'PC 2', 'mac': '02:00:00:00:00:02', 'uid': '1000'}]}
    path = tmp_path / 'rooms.json'
    path.write_text(json.dumps([room]))
    monkeypatch.setenv('QUIOSC_MODE', 'simulation')
    monkeypatch.setenv('QUIOSC_DB', str(tmp_path / 'quiosc.db'))
    monkeypatch.setenv('QUIOSC_ROOMS_FILE', str(path))
    return Quiosc()


@pytest.fixture
def api(service):
    app = FastAPI()
    def teacher(request):
        if request.headers.get('authorization') != 'Bearer test-teacher':
            raise HTTPException(401)
        return 'teacher-1'
    def access(request, group_id):
        teacher(request)
        if request.headers.get('x-group') != group_id:
            raise HTTPException(404)
    install(app, teacher, access, service)
    return TestClient(app)


HEADERS = {'Authorization': 'Bearer test-teacher', 'X-Group': 'group-1', 'X-Quiosc-Request': '1'}
PAYLOAD = {'room_id': 'lab', 'devices': ['pc1', 'pc2'], 'url': 'https://example.org/quiz?id=1', 'seconds': 60}


def test_api_auth_group_csrf_and_no_arbitrary_commands(api):
    assert api.get('/api/quiosc/rooms').status_code == 401
    assert api.get('/api/quiosc/rooms', headers={'Authorization': 'Bearer test-teacher'}).json()['rooms'] == []
    assert api.post('/api/quiosc/sessions', headers={k: v for k, v in HEADERS.items() if k != 'X-Quiosc-Request'}, json=PAYLOAD).status_code == 403
    assert api.post('/api/quiosc/sessions', headers={**HEADERS, 'Origin': 'https://evil.test'}, json=PAYLOAD).status_code == 403
    assert api.post('/api/quiosc/sessions', headers=HEADERS, json={**PAYLOAD, 'command': 'id'}).status_code == 422
    assert api.post('/api/quiosc/sessions', headers={**HEADERS, 'X-Group': 'other'}, json=PAYLOAD).status_code == 404
    assert api.post('/api/quiosc/sessions', headers=HEADERS, json={**PAYLOAD, 'devices': ['outside']}).status_code == 400
    assert api.post('/api/quiosc/sessions', headers=HEADERS, json={**PAYLOAD, 'seconds': 1}).status_code == 422


def test_simulation_persistence_overlap_and_individual_restore(api, service):
    result = api.post('/api/quiosc/sessions', headers=HEADERS, json=PAYLOAD)
    assert result.status_code == 200, result.text
    value = result.json()
    sid = value['session']['id']
    assert all(d['state'] == 'simulation_running' for d in value['devices'])
    assert api.post('/api/quiosc/sessions', headers=HEADERS, json=PAYLOAD).status_code == 409
    assert Quiosc().snapshot(sid) == value  # Reconstruct service after a Docker restart.
    assert api.get(f'/api/quiosc/sessions/{sid}', headers={**HEADERS, 'X-Group': 'other'}).status_code == 404
    result = api.post(f'/api/quiosc/sessions/{sid}/stop', headers=HEADERS, json={'device_id': 'pc1'}).json()
    assert [d['state'] for d in result['devices']] == ['simulation_finished', 'simulation_running']
    for _ in range(2):
        result = api.post(f'/api/quiosc/sessions/{sid}/stop', headers=HEADERS, json={})
        assert result.status_code == 200
        assert all(d['state'] == 'simulation_finished' for d in result.json()['devices'])
    assert api.post('/api/quiosc/sessions', headers=HEADERS, json=PAYLOAD).status_code == 200
    with service.db() as conn:
        audit = [dict(r) for r in conn.execute('SELECT * FROM audit')]
    assert audit and 'example.org' not in json.dumps(audit)


@pytest.mark.parametrize('url', ['file:///etc/passwd', 'javascript:alert(1)', 'https://user:pass@example.org', 'https://example.org/\nfoo', 'https://example.org/?token=abc'])
def test_invalid_url(url):
    with pytest.raises(ValueError):
        remote.validate_url(url)


def test_fixed_command_quotes_url():
    url = "https://example.org/quiz?x=';$(touch${IFS}/tmp/quiosc-injected)`id`&id=1"
    args = shlex.split(remote.build_command('start', 'a' * 32, url, 60))
    assert args[:2] == ['python3', '-c']
    assert json.loads(args[3])['url'] == url
    assert len(args) == 5
    with pytest.raises(ValueError):
        remote.build_command('execute', 'a' * 32)


def test_real_partial_failure_never_claims_isolation(service, monkeypatch):
    monkeypatch.setenv('QUIOSC_MODE', 'real')
    room = service.room('lab')
    monkeypatch.setattr(service, 'clients', lambda devices: {'pc1': {'handle': 'h1'}})
    def invoke(client, action, *_args):
        if client is None:
            return {'state': 'unknown', 'ready': False}
        if action == 'stop':
            return {'state': 'finished'}
        return {'state': 'available', 'ready': True} if action == 'probe' else {'state': 'basic_kiosk'}
    monkeypatch.setattr(service, 'invoke', invoke)
    value = service.start(room, ['pc1', 'pc2'], 'https://example.org', 60, 'teacher')
    assert [d['state'] for d in value['devices']] == ['basic_kiosk', 'unknown']
    with pytest.raises(sqlite3.IntegrityError):
        service.start(room, ['pc2'], 'https://example.org', 60, 'teacher')
    restored = service.operate(value['session']['id'], 'teacher', 'stop')
    assert [d['state'] for d in restored['devices']] == ['finished', 'unknown']
    with service.db() as conn:
        assert conn.execute("SELECT count(*) FROM audit WHERE operation='dispatch_stop'").fetchone()[0] == 2


def test_protocol_socket_errors_and_bounds(tmp_path):
    with pytest.raises(EpoptesError):
        Epoptes(str(tmp_path / 'missing'), timeout=.1).handles()
    left, right = socket.socketpair()
    try:
        right.sendall(b'\x01\x00')  # AMP keys are bounded to 255 bytes.
        with pytest.raises(EpoptesError):
            read_box(left)
    finally:
        left.close(); right.close()


# An actual Twisted AMP responder, independent of our encoder/decoder. The
# declarations below match both audited Epoptes commits, not an invented API.
TWISTED_SERVER = r'''
import sys
from twisted.internet import reactor, protocol
from twisted.protocols import amp
class EnumerateClients(amp.Command):
    arguments=[]
    response=[(b'handles', amp.ListOf(amp.Unicode()))]
class ClientCommand(amp.Command):
    arguments=[(b'handle',amp.Unicode()),(b'command',amp.Unicode())]
    response=[(b'result',amp.String()),(b'filename',amp.Unicode())]
class ClientConnected(amp.Command):
    arguments=[(b'handle',amp.Unicode())]
    response=[]
class GUI(amp.AMP):
    @EnumerateClients.responder
    def enumerate(self):
        self.callRemote(ClientConnected, handle='10.0.0.1:1234')
        return {'handles':['10.0.0.1:1234','10.0.0.1:5678']}
    @ClientCommand.responder
    def command(self, handle, command):
        if command == 'large': return {'result':b'', 'filename':'/run/epoptes/untrusted'}
        uid='0' if handle.endswith('1234') else '1000'
        return {'result':('uid='+uid+'\nmac=02:00:00:00:00:01\nhostname=pc1\nversion=1.0\n').encode(), 'filename':''}
f=protocol.ServerFactory();f.protocol=GUI
reactor.listenUNIX(sys.argv[1], f)
reactor.run()
'''


def test_twisted_amp_interoperability_and_system_filter(tmp_path):
    path = tmp_path / 'epoptes.socket'
    process = subprocess.Popen([sys.executable, '-c', TWISTED_SERVER, str(path)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(100):
            if path.exists(): break
            time.sleep(.05)
        adapter = Epoptes(str(path))
        assert adapter.handles() == ['10.0.0.1:1234', '10.0.0.1:5678']
        assert adapter.inventory() == [{'handle': '10.0.0.1:5678', 'mac': '02:00:00:00:00:01', 'uid': '1000', 'hostname': 'pc1', 'version': '1.0'}]
        with pytest.raises(EpoptesError, match='large'):
            adapter._command('10.0.0.1:5678', 'large')
    finally:
        process.terminate(); process.wait(timeout=5)


@pytest.fixture
def student(tmp_path, monkeypatch):
    # Dummy Firefox tests lifecycle only; no display or restriction validation.
    browser = tmp_path / 'firefox'
    browser.write_text('#!/usr/bin/python3\nimport sys, time\nif "--version" in sys.argv:\n print("Mozilla Firefox 140.0");sys.exit(0)\ntime.sleep(120)\n')
    browser.chmod(0o700)
    root = tmp_path / 'student-state'
    monkeypatch.setattr(remote, 'SOURCE', remote.SOURCE.replace("Path('/tmp/edutictac-quiosc-%d' % os.getuid())", repr(root).replace('PosixPath', 'Path')))
    env = {**os.environ, 'PATH': str(tmp_path) + ':' + os.environ['PATH'], 'DISPLAY': ':123', 'XDG_SESSION_TYPE': 'x11', 'XDG_CURRENT_DESKTOP': 'KDE'}
    def run(action, sid='a' * 32, seconds=30):
        result = subprocess.run(remote.build_command(action, sid, 'https://example.org', seconds), shell=True,
                                env=env, capture_output=True, text=True, timeout=15)
        assert result.returncode == 0
        return json.loads(next(s[7:] for s in result.stdout.splitlines() if s.startswith('QUIOSC:')))
    yield run, root
    for directory in root.glob('*'):
        if directory.is_dir():
            (directory / 'stop').touch()
    time.sleep(1.5)


def test_student_start_stop_idempotent_preserves_other_process(student):
    run, root = student
    other = subprocess.Popen([sys.executable, '-c', 'import time;time.sleep(120)'])
    try:
        assert run('probe')['ready'] is True
        first = run('start')
        assert first['state'] == 'basic_kiosk'
        assert run('start')['browser'] == first['browser']
        assert run('status')['state'] == 'basic_kiosk'
        assert run('stop')['state'] == 'finished'
        assert run('stop')['state'] == 'finished'
        assert not (root / ('a' * 32) / 'profile').exists()
        assert other.poll() is None
    finally:
        other.terminate(); other.wait()


def test_student_deadline_without_server_and_late_start(student):
    run, root = student
    assert run('start', seconds=4)['state'] == 'basic_kiosk'
    time.sleep(3)
    assert run('status')['state'] == 'finished'
    assert not (root / ('a' * 32) / 'profile').exists()
    assert run('stop', 'b' * 32)['state'] == 'finished'
    assert run('start', 'b' * 32)['state'] == 'finished'


def test_student_rejects_wayland_and_root_connection(student, monkeypatch):
    run, _ = student
    # Probe code has an explicit X11/KDE/non-root gate; execute with Wayland.
    args = shlex.split(remote.build_command('probe', 'c' * 32))
    result = subprocess.run(args, capture_output=True, text=True,
                            env={**os.environ, 'XDG_SESSION_TYPE': 'wayland', 'XDG_CURRENT_DESKTOP': 'KDE'})
    assert json.loads(result.stdout[7:])['ready'] is False


def test_student_lost_supervisor_is_unknown(student):
    import signal
    run, root = student
    value = run('start')
    try:
        os.kill(value['worker'], signal.SIGKILL)
        time.sleep(.1)
        assert run('status')['state'] == 'unknown'
        assert run('stop')['state'] == 'unknown'
    finally:
        # Test-only cleanup of the known dummy browser's group, not production recovery.
        os.killpg(value['browser'], signal.SIGKILL)


def test_student_refuses_root_without_executing_browser():
    source = remote.SOURCE.replace("    os.umask(0o077)", "    os.getuid = lambda: 0\n    os.umask(0o077)")
    result = subprocess.run([sys.executable, '-c', source, json.dumps({'action': 'probe', 'id': 'a' * 32}), source],
                            capture_output=True, text=True, timeout=3)
    assert json.loads(result.stdout[7:])['state'] == 'unknown'


def test_ambiguous_sessions_never_selected(service, monkeypatch):
    class Adapter:
        def inventory(self):
            return [{'mac': '02:00:00:00:00:01', 'uid': '1000', 'handle': h} for h in ('h1', 'h2')]
    monkeypatch.setattr(Quiosc, 'adapter', property(lambda self: Adapter()))
    assert service.clients(service.room('lab')['devices']) == {}


def test_empty_command_response_is_unknown(service, monkeypatch):
    class Adapter:
        def run(self, *_args): return ''
    monkeypatch.setattr(Quiosc, 'adapter', property(lambda self: Adapter()))
    assert service.invoke({'handle': 'h1'}, 'status', 'a' * 32)['state'] == 'unknown'


def test_amp_total_timeout_for_slow_responses(tmp_path):
    path = str(tmp_path / 'slow.socket')
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind(path); server.listen(1)
    def slow():
        try:
            conn, _ = server.accept()
            with conn:
                read_box(conn)
                for byte in encode_box({b'_answer': b'1', b'handles': b''}):
                    conn.sendall(bytes([byte]))
                    time.sleep(.03)
        except (BrokenPipeError, OSError):
            pass
    thread = threading.Thread(target=slow, daemon=True); thread.start()
    start = time.monotonic()
    try:
        with pytest.raises(EpoptesError):
            Epoptes(path, timeout=.1).handles()
        assert time.monotonic() - start < 1
    finally:
        server.close(); thread.join(timeout=2)


def test_student_activation_failure_can_be_restored(student):
    run, root = student
    browser = root.parent / 'firefox'
    browser.write_text('#!/usr/bin/python3\nimport sys\nif "--version" in sys.argv:\n print("Mozilla Firefox 140.0");sys.exit(0)\nsys.exit(1)\n')
    assert run('start')['state'] == 'error'
    assert run('stop')['state'] == 'finished'
    assert not (root / ('a' * 32) / 'profile').exists()


@pytest.mark.skipif(os.environ.get('QUIOSC_DOCKER_TEST') != '1', reason='opt-in Docker image/socket integration')
def test_docker_image_connects_to_readonly_unix_socket(tmp_path):
    path = tmp_path / 'epoptes.socket'
    process = subprocess.Popen([sys.executable, '-c', TWISTED_SERVER, str(path)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(100):
            if path.exists(): break
            time.sleep(.05)
        code = "from quiosc.epoptes import Epoptes; c=Epoptes('/run/quiosc-test/epoptes.socket').inventory(); assert len(c)==1 and c[0]['uid']=='1000'; print('AMP through read-only bind mount passed')"
        result = subprocess.run([
            'docker', 'run', '--rm', '--network', 'none', '--user', f'{os.getuid()}:{os.getgid()}',
            '--mount', f'type=bind,src={tmp_path},dst=/run/quiosc-test,readonly',
            '--entrypoint', 'python', 'commons-quiosc-id-api:test', '-c', code
        ], capture_output=True, text=True, timeout=20)
        assert result.returncode == 0, result.stderr
        assert 'passed' in result.stdout
    finally:
        process.terminate(); process.wait(timeout=5)


@pytest.mark.parametrize('signing_length,teacher_length,expected', [(10, 30, 503), (40, 10, 503), (40, 30, 200)])
def test_real_module_requires_production_auth(service, tmp_path, signing_length, teacher_length, expected):
    root = Path(__file__).parents[1] / 'services/id-api'
    env = {
        'PATH': os.environ['PATH'], 'PYTHONPATH': str(root) + os.pathsep + str(root / 'vendor'),
        'EDUTICTAC_ID_DB': str(tmp_path / 'identity.db'), 'QUIOSC_DB': str(tmp_path / 'test-quiosc.db'),
        'EDUTICTAC_ID_SECRET': 's' * signing_length, 'EDUTICTAC_ID_TEACHER_TOKEN': 't' * teacher_length,
        'QUIOSC_MODE': 'real', 'QUIOSC_ROOMS_FILE': os.environ['QUIOSC_ROOMS_FILE']
    }
    code = "from main import app; from fastapi.testclient import TestClient; import os; r=TestClient(app).get('/api/quiosc/rooms',headers={'Authorization':'Bearer '+os.environ['EDUTICTAC_ID_TEACHER_TOKEN']}); assert r.status_code == " + str(expected)
    result = subprocess.run([sys.executable, '-c', code], env=env, capture_output=True, text=True, timeout=10)
    assert result.returncode == 0, result.stderr
