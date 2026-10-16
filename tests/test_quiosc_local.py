import array
import importlib.util
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import threading
import time

import pytest
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / 'services/id-api'))
from quiosc.api import install
from quiosc.local_auth import COOKIE, LOCAL_GROUP, LocalAuth, PROTOCOL, verify_epoptes_connection
from quiosc.service import Quiosc

spec = importlib.util.spec_from_file_location('local_launcher', ROOT / 'scripts/quiosc-local-launcher.py')
launcher = importlib.util.module_from_spec(spec); spec.loader.exec_module(launcher)


class Inventory:
    path = '/nonexistent'
    def __init__(self):
        self.rows = [{'mac': '02:00:00:00:00:01', 'uid': '1000', 'hostname': 'pc1', 'handle': 'h1'}]
        self.calls = 0
    def inventory(self):
        self.calls += 1
        return self.rows
    def run(self, *_args):
        return 'QUIOSC:' + json.dumps({'state': 'incompatible', 'ready': False})


@pytest.fixture
def local(tmp_path, monkeypatch):
    monkeypatch.setenv('QUIOSC_DB', str(tmp_path / 'quiosc.db'))
    monkeypatch.setenv('QUIOSC_MODE', 'real')
    monkeypatch.setenv('QUIOSC_DISCOVERY', 'epoptes')
    monkeypatch.setenv('QUIOSC_LOCAL_AUTH', '1')
    monkeypatch.setenv('QUIOSC_LOCAL_URL', 'http://127.0.0.1:8082')
    monkeypatch.setenv('QUIOSC_LOCAL_SOCKET', str(tmp_path / 'broker.socket'))
    service = Quiosc(); inventory = Inventory()
    monkeypatch.setattr(Quiosc, 'adapter', property(lambda self: inventory))
    auth = LocalAuth(service, 'synthetic-local-test-signing-secret-1234567890')
    app = FastAPI()
    def teacher(request):
        actor = auth.identity(request.cookies.get(COOKIE))
        if actor:
            return actor
        if request.headers.get('authorization') == 'Bearer generic-commons-teacher':
            return 'commons-teacher'
        raise HTTPException(401)
    def group_access(request, group):
        if group != LOCAL_GROUP or not auth.identity(request.cookies.get(COOKIE)):
            raise HTTPException(404)
    install(app, teacher, group_access, service, auth)
    client = TestClient(app, base_url='http://127.0.0.1:8082')
    return service, inventory, auth, client


def login(auth, client, origin='http://127.0.0.1:12345'):
    ticket = auth.issue(os.getuid())
    return client.post('/api/quiosc/local/login', data={'ticket': ticket},
                       headers={'Origin': origin}, follow_redirects=False)


def test_local_one_use_grant_cookie_scope_and_no_commons_role_bypass(local):
    service, inventory, auth, client = local
    assert client.get('/api/quiosc/access').json() == {'local_launcher': True}
    assert client.get('/api/quiosc/rooms').status_code == 401
    assert client.get('/api/quiosc/rooms', headers={'Authorization': 'Bearer generic-commons-teacher'}).json()['rooms'] == []
    assert inventory.calls == 0  # Generic role cannot trigger Epoptes discovery.
    ticket = auth.issue(os.getuid())
    headers = {'Origin': 'http://127.0.0.1:12345'}
    response = client.post('/api/quiosc/local/login', data={'ticket': ticket}, headers=headers, follow_redirects=False)
    assert response.status_code == 303
    cookie = response.headers['set-cookie']
    assert 'HttpOnly' in cookie and 'Path=/api/quiosc' in cookie and 'SameSite=lax' in cookie
    assert response.headers['location'] == '/quiosc.html'
    assert client.post('/api/quiosc/local/login', data={'ticket': ticket}, headers=headers, follow_redirects=False).status_code == 401
    rooms = client.get('/api/quiosc/rooms').json()['rooms']
    assert rooms == [{'id': 'epoptes', 'name': 'Epoptes', 'group_id': LOCAL_GROUP}]
    devices = client.get('/api/quiosc/rooms/epoptes/devices').json()['devices']
    assert devices[0]['label'] == 'pc1' and devices[0]['state'] == 'incompatible'
    assert inventory.calls > 0
    with service.db() as conn:
        stored = json.dumps([dict(r) for r in conn.execute('SELECT * FROM audit')])
        assert ticket not in stored
        assert conn.execute('SELECT count(*) FROM local_login_tickets').fetchone()[0] == 0


@pytest.mark.parametrize('origin', ['https://evil.test', 'http://localhost:12345', 'null', 'http://127.0.0.1:12345/evil'])
def test_local_handoff_rejects_foreign_origin(local, origin):
    _, _, auth, client = local
    assert login(auth, client, origin).status_code == 403
    assert client.get('/api/quiosc/rooms').status_code == 401


def test_expired_forged_and_root_grants_denied(local):
    service, _, auth, client = local
    with pytest.raises(PermissionError):
        auth.issue(0)
    assert auth.identity('forged') is None
    ticket = auth.issue(os.getuid())
    with service.db() as conn:
        conn.execute('UPDATE local_login_tickets SET expires=0')
    response = client.post('/api/quiosc/local/login', data={'ticket': ticket},
                           headers={'Origin': 'http://127.0.0.1:12345'}, follow_redirects=False)
    assert response.status_code == 401


def test_auto_inventory_stable_ids_offline_and_new_uid(local):
    service, inventory, auth, client = local
    assert login(auth, client).status_code == 303
    first = client.get('/api/quiosc/rooms/epoptes/devices').json()['devices'][0]
    inventory.rows[0]['handle'] = 'new-handle'
    assert client.get('/api/quiosc/rooms/epoptes/devices').json()['devices'][0]['id'] == first['id']
    inventory.rows = []
    offline = client.get('/api/quiosc/rooms/epoptes/devices').json()['devices']
    assert offline[0]['id'] == first['id'] and offline[0]['state'] == 'unknown'
    inventory.rows = [{'mac': first['mac'], 'uid': '1001', 'hostname': 'pc1', 'handle': 'h2'}]
    updated = client.get('/api/quiosc/rooms/epoptes/devices').json()['devices']
    assert len(updated) == 1 and updated[0]['id'] != first['id']
    assert updated[0]['uid'] == '1001'
    # An injected or stale device identifier is not dispatched.
    response = client.post('/api/quiosc/sessions', json={'room_id': 'epoptes', 'devices': [first['id']], 'url': 'https://example.org', 'seconds': 60}, headers={'X-Quiosc-Request': '1'})
    assert response.status_code == 400


def test_auto_inventory_ignores_root_and_ambiguous_sessions(local):
    service, inventory, _, _ = local
    inventory.rows = [
        {'mac': '02:00:00:00:00:01', 'uid': '0', 'hostname': 'system', 'handle': 'root'},
        {'mac': '02:00:00:00:00:02', 'uid': '1000', 'hostname': 'pc2', 'handle': 'h1'},
        {'mac': '02:00:00:00:00:02', 'uid': '1001', 'hostname': 'pc2', 'handle': 'h2'},
    ]
    room = service.automatic_room(refresh=True)
    assert len(room['devices']) == 1
    assert service.clients(room['devices']) == {}


def test_proof_rejects_plain_uid_and_untrusted_endpoint(local, tmp_path, monkeypatch):
    _, _, auth, _ = local
    left, right = socket.socketpair()
    try:
        thread = threading.Thread(target=auth.handle, args=(left,))
        thread.start(); right.sendall(PROTOCOL); right.shutdown(socket.SHUT_WR)
        assert right.recv(128) == b'DENIED\n'; thread.join(timeout=5)
    finally:
        left.close(); right.close()
    path = tmp_path / 'untrusted.socket'
    server = socket.socket(socket.AF_UNIX); server.bind(str(path)); server.listen(1)
    proof = socket.socket(socket.AF_UNIX); proof.connect(str(path))
    accepted, _ = server.accept()
    try:
        with pytest.raises(PermissionError):
            verify_epoptes_connection(proof, str(path), path)  # Teacher-owned fake daemon is not root.
        verify_epoptes_connection(proof, str(path), path, trusted_uid=os.getuid())  # Test-only trusted endpoint.
        with pytest.raises(PermissionError):
            verify_epoptes_connection(proof, '/wrong/path', path, trusted_uid=os.getuid())
    finally:
        proof.close(); accepted.close(); server.close()


def test_scm_rights_transport_and_replay(local, tmp_path, monkeypatch):
    _, _, auth, _ = local
    path = tmp_path / 'epoptes.socket'
    server = socket.socket(socket.AF_UNIX); server.bind(str(path)); server.listen(2)
    # Only this transport test trusts the unprivileged test daemon. Production
    # verify() unconditionally requires a root-owned socket and root peer.
    monkeypatch.setattr(auth, 'verify', lambda connection: verify_epoptes_connection(connection, str(path), path, trusted_uid=os.getuid()))
    auth.start()
    try:
        ticket = launcher.request_ticket({'epoptes_socket': str(path), 'broker_socket': os.environ['QUIOSC_LOCAL_SOCKET']})
        cookie = auth.consume(ticket)
        assert auth.identity(cookie).startswith('epoptes-local:')
        assert auth.consume(ticket) is None
    finally:
        auth.stop(); server.close()


def test_loopback_handoff_does_not_put_ticket_in_url_and_checks_uid(tmp_path):
    ticket = 'synthetic-ticket-only-for-loopback-test'
    server, url = launcher.handoff_server({'commons_url': 'http://127.0.0.1:8082'}, ticket)
    try:
        assert ticket not in url
        table = tmp_path / 'tcp'
        table.write_text('header\n0: 0100007F:3039 0100007F:1F92 01 0 0 0 1000 0\n')
        assert launcher.loopback_client_uid(12345, 8082, table) == 1000
        assert launcher.loopback_client_uid(12346, 8082, table) is None
    finally:
        server.server_close()


def test_local_broker_requires_secure_config(local):
    service, _, auth, _ = local
    auth.secret = 'weak'
    with pytest.raises(ValueError):
        auth.start()
    auth.secret = 'synthetic-long-signing-secret-1234567890'
    with pytest.raises(ValueError):
        # No arbitrary external cleartext destination for the browser grant.
        os.environ['QUIOSC_LOCAL_URL'] = 'http://evil.test'
        auth.start()


def test_loopback_handoff_enforces_kernel_client_uid():
    import urllib.request
    import urllib.error
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    for owner, expected in [(os.getuid(), 200), (os.getuid() + 1, 403)]:
        server, url = launcher.handoff_server({'commons_url': 'http://127.0.0.1:8082'}, 'synthetic-one-use-test-ticket', uid=owner)
        thread = threading.Thread(target=server.handle_request)
        thread.start()
        try:
            try:
                with opener.open(url, timeout=3) as response:
                    status = response.status
                    body = response.read()
                    assert b'method="post"' in body
                    assert response.headers['Cache-Control'] == 'no-store'
            except urllib.error.HTTPError as error:
                status = error.code
            assert status == expected
        finally:
            thread.join(timeout=4)
            server.server_close()


@pytest.mark.skipif(os.environ.get('QUIOSC_DOCKER_TEST') != '1', reason='opt-in root daemon socket proof through Docker')
def test_local_proof_with_actual_root_peer_and_unprivileged_launcher(local, tmp_path, monkeypatch):
    service, inventory, auth, _ = local
    socket_path = tmp_path / 'root-epoptes.socket'
    container = 'quiosc-proof-' + __import__('secrets').token_hex(4)
    source = "import socket,os; s=socket.socket(socket.AF_UNIX); s.bind('/proof/root-epoptes.socket'); os.chmod('/proof/root-epoptes.socket',0o666); s.listen(8); connections=[]\nwhile True: connections.append(s.accept()[0])\n"
    try:
        subprocess.run(['docker', 'run', '-d', '--name', container, '--network', 'none', '--user', '0:0',
                        '--mount', f'type=bind,src={tmp_path},dst=/proof', '--entrypoint', 'python',
                        'commons-quiosc-id-api:test', '-c', source], check=True, stdout=subprocess.DEVNULL)
        for _ in range(60):
            if socket_path.exists():
                break
            time.sleep(.05)
        assert socket_path.stat().st_uid == 0
        inventory.path = str(socket_path)
        monkeypatch.setenv('QUIOSC_HOST_EPOPTES_SOCKET', '/proof/root-epoptes.socket')
        auth.start()  # Uses the production verifier, without replacing its UID check.
        ticket = launcher.request_ticket({'epoptes_socket': str(socket_path), 'broker_socket': os.environ['QUIOSC_LOCAL_SOCKET']})
        cookie = auth.consume(ticket)
        assert auth.identity(cookie).startswith('epoptes-local:')
        assert auth.consume(ticket) is None
    finally:
        auth.stop()
        subprocess.run(['docker', 'rm', '-f', container], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def test_auto_discovery_excludes_the_teacher_server(local, monkeypatch):
    service, inventory, _, _ = local
    monkeypatch.setenv('QUIOSC_SERVER_MACS', '02:00:00:00:00:01')
    assert service.automatic_room(refresh=True)['devices'] == []
