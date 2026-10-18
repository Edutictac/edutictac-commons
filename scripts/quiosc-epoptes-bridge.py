#!/usr/bin/env python3
"""Pont local entre Quiosc i l'Epoptes de LliureX, sense modificar LliureX.

L'Epoptes de LliureX no publica /run/epoptes/epoptes.socket: la GUI parla per
TCP en el port 10000, protegit pels connectors n4d EpoptesServer (obri el port
per IP) i EpoptesFilter (només deixa eixir cap al port els grups autoritzats).
Este pont torna a oferir un socket Unix de root amb la mateixa política:

- setup-socket: l'executa systemd en crear el socket. Posa el grup de servei de
  Commons i una ACL amb els grups que LliureX autoritza per a Epoptes.
- relay: una instància per connexió (Accept=yes). Comprova que el port 10000 és
  del dimoni Epoptes de root, registra 127.0.0.1 en n4d si cal i fa de passarel·la.
- detect: ix amb 0 si l'equip té l'Epoptes de LliureX.

No canvia cap fitxer, regla ni servei de LliureX: usa les seues API (n4d) i
llig la seua política. No demana ni guarda contrasenyes.
"""
import argparse
import os
from pathlib import Path
import re
import selectors
import socket
import subprocess
import sys
import time

APP_DIR = Path('/opt/edutictac-commons')
SOCKET_PATH = Path('/run/edutictac-quiosc-epoptes/epoptes.socket')
FILTER_PLUGIN = Path('/usr/share/n4d/python-plugins/EpoptesFilter.py')
SERVER_PLUGIN = Path('/usr/share/n4d/python-plugins/EpoptesServer.py')
EPOPTES_PORT = 10000
IDLE_TIMEOUT = 300


def log(message):
    # Només missatges fixos: mai dades del protocol ni ordres als equips.
    print('quiosc-epoptes-bridge: ' + message, file=sys.stderr, flush=True)


def lliurex_epoptes_present():
    return SERVER_PLUGIN.is_file() and FILTER_PLUGIN.is_file()


def allowed_gids(filter_plugin=FILTER_PLUGIN, rules=None):
    """Grups que LliureX deixa connectar amb Epoptes (sense root, que ja té accés)."""
    gids = set()
    match = re.search(r'allowed_groups\s*=\s*\[([0-9,\s]*)\]', filter_plugin.read_text())
    if match:
        gids.update(int(value) for value in re.findall(r'\d+', match.group(1)))
    if rules is None:
        result = subprocess.run(['iptables', '-w', '5', '-S', 'OUTPUT'], capture_output=True, text=True)
        rules = result.stdout if result.returncode == 0 else ''
    for line in rules.splitlines():
        if '--dport %d' % EPOPTES_PORT in line and '-j ACCEPT' in line:
            match = re.search(r'--gid-owner (\d+)', line)
            if match:
                gids.add(int(match.group(1)))
    gids.discard(0)
    return sorted(gids)


def service_gid(env_file=APP_DIR / '.env'):
    for line in env_file.read_text().splitlines():
        if line.startswith('PGID='):
            gid = int(line.split('=', 1)[1].strip().strip('"\''))
            if gid > 0:
                return gid
    raise ValueError('PGID de Commons no vàlid')


def setup_socket(path=SOCKET_PATH):
    gid = service_gid()
    os.chown(path, 0, gid)
    os.chmod(path, 0o660)
    entries = ['g:%d:rw' % value for value in allowed_gids()] + ['m::rw']
    subprocess.run(['setfacl', '-m', ','.join(entries), str(path)], check=True)
    try:
        ensure_loopback_registered()
    except Exception:
        # En arrancar l'equip n4d pot no estar llest; cada connexió ho torna a provar.
        log('registre local pendent')


def loopback_registered(rules=None):
    if rules is None:
        result = subprocess.run(['iptables', '-w', '5', '-S', 'INPUT'], capture_output=True, text=True)
        rules = result.stdout if result.returncode == 0 else ''
    return any('-s 127.0.0.1/32' in line and '--dport %d' % EPOPTES_PORT in line and '-j ACCEPT' in line
               for line in rules.splitlines())


def ensure_loopback_registered():
    """Obri el port local com fa la GUI d'Epoptes, però amb la clau mestra de n4d."""
    if loopback_registered():
        return
    # Mateixa crida que /usr/bin/epoptes; n4d substituïx l'argument per la IP de qui crida.
    import n4d.client
    client = n4d.client.Client(address='https://localhost:9779', key=n4d.client.Key.master_key())
    client.EpoptesServer.register_ip('')
    if not loopback_registered():
        raise PermissionError('n4d no ha obert el port local d’Epoptes')


def listening_inodes(port=EPOPTES_PORT, table='/proc/net/tcp'):
    inodes = set()
    for line in Path(table).read_text().splitlines()[1:]:
        fields = line.split()
        if len(fields) < 10 or fields[3] != '0A':
            continue
        address, hex_port = fields[1].split(':')
        if int(hex_port, 16) == port and address in ('00000000', '0100007F'):
            inodes.add(fields[9])
    return inodes


def listener_is_root_epoptes(port=EPOPTES_PORT, proc=Path('/proc')):
    """El port 10000 no és privilegiat: cal que l'escolte el dimoni Epoptes de root."""
    inodes = listening_inodes(port, proc / 'net/tcp')
    if not inodes:
        return False
    owners = []
    for entry in proc.iterdir():
        if not entry.name.isdigit():
            continue
        try:
            targets = {os.readlink(fd) for fd in (entry / 'fd').iterdir()}
        except OSError:
            continue
        if any('socket:[%s]' % inode in targets for inode in inodes):
            try:
                status = (entry / 'status').read_text()
                cmdline = (entry / 'cmdline').read_bytes().split(b'\0')
            except OSError:
                return False
            uid = re.search(r'^Uid:\s+(\d+)\s+(\d+)', status, re.M)
            owners.append((uid and uid.group(1) == '0' and uid.group(2) == '0',
                           any(part.endswith(b'twistd3') or part.endswith(b'twistd') for part in cmdline)
                           and b'epoptes' in cmdline))
    return bool(owners) and all(root and daemon for root, daemon in owners)


def relay(client):
    if not listener_is_root_epoptes():
        raise PermissionError('El port d’Epoptes no és del dimoni de root')
    ensure_loopback_registered()
    upstream = socket.create_connection(('127.0.0.1', EPOPTES_PORT), timeout=5)
    upstream.settimeout(None)
    client.setblocking(False)
    upstream.setblocking(False)
    peers = {client: upstream, upstream: client}
    selector = selectors.DefaultSelector()
    for sock in peers:
        selector.register(sock, selectors.EVENT_READ)
    deadline = time.monotonic() + IDLE_TIMEOUT
    try:
        while time.monotonic() < deadline:
            events = selector.select(timeout=max(0.1, deadline - time.monotonic()))
            for key, _ in events:
                data = key.fileobj.recv(65536)
                if not data:
                    return
                peers[key.fileobj].setblocking(True)
                peers[key.fileobj].sendall(data)
                peers[key.fileobj].setblocking(False)
                deadline = time.monotonic() + IDLE_TIMEOUT
    finally:
        selector.close()
        upstream.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['setup-socket', 'relay', 'detect'])
    args = parser.parse_args()
    if args.action == 'detect':
        raise SystemExit(0 if lliurex_epoptes_present() else 1)
    if os.geteuid() != 0:
        raise PermissionError('El pont l’arranca systemd com a root')
    if args.action == 'setup-socket':
        setup_socket()
        return
    # systemd (Accept=yes) passa la connexió acceptada com a entrada estàndard.
    client = socket.socket(fileno=os.dup(0))
    try:
        relay(client)
    finally:
        client.close()


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        log('no disponible (%s)' % type(exc).__name__)
        raise SystemExit(1)
