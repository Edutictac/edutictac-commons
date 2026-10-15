"""Bounded synchronous AMP subset for Epoptes' public GUI socket.

Independent implementation of AMP framing (16-bit lengths, empty key ends box).
No REST, root fallback, shell from callers, or access to response filenames.
"""
from concurrent.futures import ThreadPoolExecutor
import socket
import struct
import time


class EpoptesError(Exception):
    pass


def encode_box(box):
    out = bytearray()
    for key, value in box.items():
        if not key or len(key) > 255 or len(value) > 65535:
            raise EpoptesError('invalid AMP field')
        out += struct.pack('!H', len(key)) + key
        out += struct.pack('!H', len(value)) + value
    return bytes(out) + b'\0\0'


def read_exact(sock, size, deadline=None):
    result = bytearray()
    while len(result) < size:
        if deadline is not None:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise EpoptesError('Epoptes protocol timeout')
            sock.settimeout(remaining)
        part = sock.recv(size - len(result))
        if not part:
            raise EpoptesError('Epoptes closed connection')
        result.extend(part)
    return bytes(result)


def read_box(sock, deadline=None):
    result = {}
    total = 0
    while True:
        size = struct.unpack('!H', read_exact(sock, 2, deadline))[0]
        if not size:
            return result
        if size > 255 or len(result) >= 32:
            raise EpoptesError('invalid AMP box')
        key = read_exact(sock, size, deadline)
        size = struct.unpack('!H', read_exact(sock, 2, deadline))[0]
        total += size
        if total > 131072 or key in result:
            raise EpoptesError('oversized or duplicate AMP field')
        result[key] = read_exact(sock, size, deadline)


class Epoptes:
    def __init__(self, path, timeout=12):
        self.path = path
        self.timeout = timeout

    def call(self, command_name, **fields):
        deadline = time.monotonic() + self.timeout
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
                sock.settimeout(self.timeout)
                sock.connect(self.path)
                sock.sendall(encode_box({b'_command': command_name.encode(), b'_ask': b'1',
                                        **{k.encode(): v.encode() for k, v in fields.items()}}))
                for _ in range(256):
                    sock.settimeout(max(0.001, deadline - time.monotonic()))
                    box = read_box(sock, deadline)
                    if b'_command' in box:
                        # Epoptes broadcasts these notifications to all connected GUIs.
                        if box[b'_command'] not in (b'ClientConnected', b'ClientDisconnected'):
                            raise EpoptesError('unsupported Epoptes notification')
                        if b'_ask' in box:
                            sock.sendall(encode_box({b'_answer': box[b'_ask']}))
                        continue
                    if box.get(b'_error') == b'1':
                        raise EpoptesError('Epoptes rejected AMP command')
                    if box.get(b'_answer') == b'1':
                        return box
                raise EpoptesError('too many Epoptes notifications')
        except (OSError, UnicodeError, struct.error) as exc:
            # Do not log remote output or command payloads (may contain exam URL).
            raise EpoptesError('Epoptes unavailable, permission denied or protocol timeout') from exc

    def handles(self):
        try:
            data = self.call('EnumerateClients')[b'handles']
            result = []
            # amp.ListOf(Unicode) uses a 16-bit length for each element.
            while data:
                if len(data) < 2:
                    raise ValueError()
                size = struct.unpack('!H', data[:2])[0]
                if len(data) < size + 2 or len(result) >= 128:
                    raise ValueError()
                result.append(data[2:2 + size].decode())
                data = data[2 + size:]
            return result
        except (KeyError, ValueError, UnicodeError) as exc:
            raise EpoptesError('invalid Epoptes client list') from exc

    def _command(self, handle, command):
        box = self.call('ClientCommand', handle=handle, command=command)
        if box.get(b'filename') != b'' or b'result' not in box:
            raise EpoptesError('unsupported large or malformed Epoptes response')
        return box[b'result'].decode('utf-8', errors='strict').strip()

    def inventory(self):
        handles = self.handles()
        def inspect(handle):
            try:
                reader = Epoptes(self.path, timeout=min(3, self.timeout))
                info = dict(line.split('=', 1) for line in reader._command(handle, 'info').splitlines())
                # System connections must NEVER be used for browser execution.
                if int(info.get('uid', '0')) > 0:
                    return {'handle': handle, 'mac': info['mac'].lower(),
                            'uid': info['uid'], 'hostname': info['hostname'],
                            'version': info.get('version', 'unknown')}
            except (ValueError, KeyError, UnicodeError, EpoptesError):
                return None  # Missing/invalid info is not readiness.
        with ThreadPoolExecutor(max_workers=8) as pool:
            return [client for client in pool.map(inspect, handles) if client is not None]

    def run(self, client, action, session_id, url='', seconds=60):
        from .remote import build_command
        return self._command(client['handle'], build_command(action, session_id, url, seconds))
