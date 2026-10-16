#!/usr/bin/env python3
"""Host-only launcher for the existing Epoptes teacher session. No new agent.

Uses Python's standard library and xdg-open already present in LliureX. Never
passes a login ticket in a URL, process argument, log, or configuration file.
"""
import array
import html
import grp
import pwd
import shlex
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
from pathlib import Path
import secrets
import shutil
import socket
import stat
import subprocess
import sys
import time
from urllib.parse import urlsplit

PROTOCOL = b'QUIOSC_LOCAL_V1\n'


def loopback_client_uid(client_port, server_port, table='/proc/net/tcp'):
    # Linux exposes the owner of the client TCP socket. A different local user
    # must not be able to steal the handoff by reading a browser process's URL.
    local = '0100007F:%04X' % client_port
    remote = '0100007F:%04X' % server_port
    owners = set()
    for line in Path(table).read_text().splitlines()[1:]:
        fields = line.split()
        if len(fields) >= 8 and fields[1] == local and fields[2] == remote and fields[3] == '01':
            owners.add(int(fields[7]))
    return next(iter(owners)) if len(owners) == 1 else None


def request_ticket(config):
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as proof:
        proof.settimeout(3)
        # OS permission enforcement happens as the real desktop user, not sudo.
        proof.connect(config['epoptes_socket'])
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as broker:
            broker.settimeout(5)
            broker.connect(config['broker_socket'])
            descriptors = array.array('i', [proof.fileno()])
            broker.sendmsg([PROTOCOL], [(socket.SOL_SOCKET, socket.SCM_RIGHTS, descriptors)])
            result = bytearray()
            while b'\n' not in result and len(result) < 128:
                part = broker.recv(128 - len(result))
                if not part:
                    break
                result.extend(part)
    ticket = bytes(result).decode('ascii').strip()
    if len(ticket) != 43 or any(c not in 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_' for c in ticket):
        raise PermissionError('Local permission not verified')
    return ticket


def handoff_server(config, ticket, uid=None):
    owner = os.getuid() if uid is None else uid
    route = '/open/' + secrets.token_urlsafe(24)
    parsed = urlsplit(config['commons_url'])
    if (parsed.username or parsed.password or parsed.path or parsed.query or parsed.fragment
            or parsed.scheme not in ('http', 'https') or not parsed.hostname
            or (parsed.scheme == 'http' and parsed.hostname not in ('127.0.0.1', 'localhost', '::1'))):
        raise ValueError('Unsafe Commons URL')
    target = config['commons_url'] + '/api/quiosc/local/login'

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            if (self.client_address[0] != '127.0.0.1' or self.path != route
                    or self.headers.get('Host') != '127.0.0.1:%d' % self.server.server_port
                    or self.server.used
                    or loopback_client_uid(self.client_address[1], self.server.server_port) != owner):
                self.send_error(403)
                return
            self.server.used = True
            nonce = secrets.token_urlsafe(24)
            body = ('<!doctype html><html lang="ca"><meta charset="utf-8"><title>EduTicTac Quiosc</title>'
                    '<form method="post" action="' + html.escape(target, quote=True) + '">'
                    '<input type="hidden" name="ticket" value="' + html.escape(ticket, quote=True) + '">'
                    '<button type="submit">Obrir EduTicTac Quiosc</button></form>'
                    '<script nonce="' + nonce + '">document.forms[0].submit()</script></html>').encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Referrer-Policy', 'no-referrer')
            self.send_header('Content-Security-Policy', "default-src 'none'; form-action " + config['commons_url'] + "; script-src 'nonce-" + nonce + "'; frame-ancestors 'none'; base-uri 'none'")
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *_args):
            pass  # URLs and handoff capabilities must never enter logs.

    server = HTTPServer(('127.0.0.1', 0), Handler)
    server.used = False
    server.timeout = .5
    return server, 'http://127.0.0.1:%d%s' % (server.server_port, route)


def main():
    if os.getuid() == 0:
        raise PermissionError('Open from the teacher desktop, never sudo')
    path = Path('/etc/edutictac-quiosc.json')
    metadata = path.lstat()
    if not stat.S_ISREG(metadata.st_mode) or metadata.st_uid != 0 or metadata.st_mode & 0o022:
        raise PermissionError('Administrative launcher configuration required')
    config = json.loads(path.read_text())
    try:
        ticket = request_ticket(config)
    except PermissionError:
        # Epoptes itself uses sg for a newly granted group not yet present in
        # the running desktop session. NSS remains the source of membership.
        account = pwd.getpwuid(os.getuid())
        gid = Path(config['epoptes_socket']).stat().st_gid
        if (os.environ.get('QUIOSC_SG_RELAUNCH') or gid in os.getgroups()
                or gid not in os.getgrouplist(account.pw_name, account.pw_gid)
                or not shutil.which('sg')):
            raise
        command = shlex.join(['/usr/bin/python3', str(Path(__file__).resolve())])
        result = subprocess.run(['sg', grp.getgrgid(gid).gr_name, '-c', command],
                                env={**os.environ, 'QUIOSC_SG_RELAUNCH': '1'}, stdin=subprocess.DEVNULL)
        if result.returncode:
            raise PermissionError()
        return
    server, url = handoff_server(config, ticket)
    try:
        # The URL contains only a one-use local route, never the login ticket.
        opener = shutil.which('xdg-open')
        if not opener:
            raise OSError('Desktop URL opener unavailable')
        subprocess.Popen([opener, url], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                         stderr=subprocess.DEVNULL, close_fds=True)
        deadline = time.monotonic() + 45
        while not server.used and time.monotonic() < deadline:
            server.handle_request()
        if not server.used:
            raise TimeoutError()
    finally:
        server.server_close()


if __name__ == '__main__':
    try:
        main()
    except Exception:
        message = 'No s’ha pogut obrir Quiosc. Comprova que pots obrir Epoptes amb la teua sessió LliureX i que Commons està en marxa.'
        dialog = shutil.which('kdialog')
        if dialog:
            subprocess.run([dialog, '--error', message], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            print(message, file=sys.stderr)
        raise SystemExit(1)
