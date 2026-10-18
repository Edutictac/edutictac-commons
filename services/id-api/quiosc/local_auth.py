"""Local Epoptes authorization, without collecting institutional passwords.

A host launcher passes a connected Epoptes socket over SCM_RIGHTS. The kernel
has already enforced the teacher's local ACL/groups at connect(). A username,
UID in JSON, or generic Commons teacher role is never accepted as that proof.
"""
import array
from contextlib import asynccontextmanager
import hashlib
import hmac
import os
from pathlib import Path
import secrets
import socket
import socketserver
import stat
import struct
import threading
import time
from urllib.parse import urlsplit

from itsdangerous import BadSignature, URLSafeTimedSerializer

LOCAL_GROUP = '@epoptes-local'
LOCAL_ROOM = 'epoptes'
COOKIE = 'edutictac_quiosc_local'
PROTOCOL = b'QUIOSC_LOCAL_V1\n'


def verify_epoptes_connection(connection, expected_path, mounted_path, trusted_uid=0):
    """Only the protected, connected daemon socket is an authorization proof."""
    metadata = Path(mounted_path).lstat()
    if not stat.S_ISSOCK(metadata.st_mode) or metadata.st_uid != trusted_uid:
        raise PermissionError('Untrusted Epoptes socket owner')
    if connection.family != socket.AF_UNIX or connection.getsockopt(socket.SOL_SOCKET, socket.SO_TYPE) != socket.SOCK_STREAM:
        raise PermissionError('Expected Unix stream socket')
    if connection.getpeername() != expected_path:
        raise PermissionError('Wrong Epoptes endpoint')
    _, peer_uid, _ = struct.unpack('3i', connection.getsockopt(socket.SOL_SOCKET, socket.SO_PEERCRED, struct.calcsize('3i')))
    if peer_uid != trusted_uid:
        raise PermissionError('Wrong Epoptes daemon identity')


class LocalAuth:
    def __init__(self, service, secret):
        self.service = service
        self.secret = secret
        self.signer = URLSafeTimedSerializer(secret, salt='quiosc-local-session-v1')
        self.server = None
        self.thread = None

    @property
    def enabled(self):
        # La preparació deixa QUIOSC_LOCAL_AUTH=1 però Quiosc desactivat fins que
        # Administració l'activa: llavors no s'obri cap accés local.
        return os.environ.get('QUIOSC_LOCAL_AUTH', '0') == '1' and self.service.mode != 'disabled'

    @property
    def url(self):
        url = os.environ.get('QUIOSC_LOCAL_URL', 'http://127.0.0.1:8082').rstrip('/')
        parsed = urlsplit(url)
        if (parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path
                or not parsed.hostname or parsed.scheme not in ('http', 'https')
                or (parsed.scheme == 'http' and parsed.hostname not in ('127.0.0.1', 'localhost', '::1'))):
            raise ValueError('Local login requires loopback HTTP or HTTPS')
        return url

    def identity(self, cookie):
        if not self.enabled or not cookie:
            return None
        try:
            value = self.signer.loads(cookie, max_age=14400)
            if value.get('scope') == LOCAL_GROUP and str(value.get('actor', '')).startswith('epoptes-local:'):
                return value['actor']
        except (BadSignature, TypeError, AttributeError):
            pass
        return None

    def _schema(self, conn):
        conn.execute('CREATE TABLE IF NOT EXISTS local_login_tickets (digest TEXT PRIMARY KEY, actor TEXT NOT NULL, expires REAL NOT NULL)')

    def issue(self, uid):
        if uid <= 0 or not self.enabled or len(self.secret) < 32:
            raise PermissionError('Local authorization unavailable')
        actor = 'epoptes-local:' + hmac.new(self.secret.encode(), str(uid).encode(), hashlib.sha256).hexdigest()[:24]
        ticket = secrets.token_urlsafe(32)
        with self.service.db() as conn:
            self._schema(conn)
            conn.execute('DELETE FROM local_login_tickets WHERE expires < ?', (time.time(),))
            if conn.execute('SELECT count(*) FROM local_login_tickets').fetchone()[0] >= 256:
                raise PermissionError('Too many outstanding logins')
            conn.execute('INSERT INTO local_login_tickets VALUES (?,?,?)',
                         (hashlib.sha256(ticket.encode()).hexdigest(), actor, time.time() + 60))
            conn.execute('INSERT INTO audit VALUES (?,?,?,?,?,?)', (time.time(), actor, 'local_login_issued', '', '', 'authorized'))
        return ticket

    def consume(self, ticket):
        if not self.enabled or len(self.secret) < 32 or not isinstance(ticket, str) or not 20 <= len(ticket) <= 128:
            return None
        with self.service.db() as conn:
            self._schema(conn)
            conn.execute('BEGIN IMMEDIATE')
            digest = hashlib.sha256(ticket.encode()).hexdigest()
            row = conn.execute('SELECT actor,expires FROM local_login_tickets WHERE digest=?', (digest,)).fetchone()
            conn.execute('DELETE FROM local_login_tickets WHERE digest=?', (digest,))
            if not row or row['expires'] < time.time():
                return None
            conn.execute('INSERT INTO audit VALUES (?,?,?,?,?,?)', (time.time(), row['actor'], 'local_login', '', '', 'authorized'))
            return self.signer.dumps({'actor': row['actor'], 'scope': LOCAL_GROUP})

    def verify(self, connection):
        verify_epoptes_connection(connection,
            os.environ.get('QUIOSC_HOST_EPOPTES_SOCKET', '/run/epoptes/epoptes.socket'),
            self.service.adapter.path)

    def handle(self, channel):
        descriptors = []
        try:
            channel.settimeout(3)
            _, uid, _ = struct.unpack('3i', channel.getsockopt(socket.SOL_SOCKET, socket.SO_PEERCRED, struct.calcsize('3i')))
            if uid <= 0:
                raise PermissionError()
            payload, ancillary, flags, _ = channel.recvmsg(128, socket.CMSG_SPACE(4 * array.array('i').itemsize))
            for level, kind, data in ancillary:
                if level == socket.SOL_SOCKET and kind == socket.SCM_RIGHTS:
                    values = array.array('i')
                    values.frombytes(data[:len(data) - len(data) % values.itemsize])
                    descriptors.extend(values)
            if flags & (socket.MSG_CTRUNC | socket.MSG_TRUNC) or payload != PROTOCOL or len(descriptors) != 1:
                raise PermissionError()
            descriptor = descriptors.pop()
            try:
                proof = socket.socket(fileno=descriptor)
            except OSError:
                os.close(descriptor)
                raise
            with proof:
                self.verify(proof)
                # No ticket is issued until both the kernel UID and endpoint are verified.
                ticket = self.issue(uid)
            # Never write grants, cookies or remote output to logs.
            channel.sendall(ticket.encode() + b'\n')
        except Exception:
            try:
                channel.sendall(b'DENIED\n')
            except OSError:
                pass
        finally:
            for descriptor in descriptors:
                os.close(descriptor)

    def start(self):
        if not self.enabled:
            return
        if self.service.mode != 'real' or self.service.discovery != 'epoptes' or len(self.secret) < 32:
            raise ValueError('Local Epoptes login requires real discovery and production signing key')
        self.url  # Validate before opening a host-facing socket.
        path = Path(os.environ.get('QUIOSC_LOCAL_SOCKET', '/run/quiosc-local/local-auth.socket'))
        if path.exists():
            metadata = path.lstat()
            if not stat.S_ISSOCK(metadata.st_mode) or metadata.st_uid != os.getuid():
                raise ValueError('Unsafe local login socket')
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as probe:
                probe.settimeout(.2)
                try:
                    probe.connect(str(path))
                except ConnectionRefusedError:
                    path.unlink()
                else:
                    raise ValueError('Local login broker is already running')
        auth = self
        class Handler(socketserver.BaseRequestHandler):
            def handle(self):
                auth.handle(self.request)
        # Requests are short and serialized: no unbounded thread creation.
        self.server = socketserver.UnixStreamServer(str(path), Handler)
        os.chmod(path, 0o666)  # Connecting alone confers no authority; proof is mandatory.
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def stop(self):
        if self.server:
            path = Path(self.server.server_address)
            self.server.shutdown()
            self.server.server_close()
            path.unlink(missing_ok=True)
            self.server = None

    def install_lifespan(self, app):
        previous = app.router.lifespan_context
        auth = self
        @asynccontextmanager
        async def lifespan(application):
            async with previous(application):
                auth.start()
                try:
                    yield
                finally:
                    auth.stop()
        app.router.lifespan_context = lifespan
