"""Persistent session orchestration and classroom inventory allowlist."""
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3
import threading
import time
import uuid

from .epoptes import Epoptes, EpoptesError
from .remote import validate_url


class Quiosc:
    def __init__(self):
        self.lock = threading.RLock()

    @property
    def mode(self):
        mode = os.environ.get('QUIOSC_MODE', 'disabled')
        if mode not in ('disabled', 'simulation', 'real'):
            raise ValueError('QUIOSC_MODE no válido')
        return mode

    @property
    def discovery(self):
        value = os.environ.get('QUIOSC_DISCOVERY', 'manual')
        if value not in ('manual', 'epoptes'):
            raise ValueError('Invalid discovery mode')
        return value

    def automatic_room(self, refresh=False):
        from .local_auth import LOCAL_GROUP, LOCAL_ROOM
        if os.environ.get('QUIOSC_LOCAL_AUTH') != '1' or self.mode != 'real':
            raise ValueError('Automatic classroom requires verified local authorization')
        with self.db() as conn:
            conn.execute('CREATE TABLE IF NOT EXISTS discovered_devices (id TEXT PRIMARY KEY, mac TEXT NOT NULL, uid TEXT NOT NULL, label TEXT NOT NULL, last_seen REAL NOT NULL, UNIQUE(mac,uid))')
        server_macs = {mac.lower() for mac in os.environ.get('QUIOSC_SERVER_MACS', '').split(',') if mac}
        if refresh:
            clients = self.adapter.inventory()  # Missing socket/protocol fails, never fabricates PCs.
            with self.db() as conn:
                for client in clients:
                    mac, uid = client['mac'].lower(), str(client['uid'])
                    if mac in server_macs or not re.fullmatch(r'(?:[0-9a-f]{2}:){5}[0-9a-f]{2}', mac) or not uid.isdigit() or int(uid) <= 0:
                        continue
                    device_id = 'pc-' + hashlib.sha256((mac + ':' + uid).encode()).hexdigest()[:24]
                    conn.execute('INSERT INTO discovered_devices VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET label=excluded.label,last_seen=excluded.last_seen',
                                 (device_id, mac, uid, str(client.get('hostname') or device_id)[:128], time.time()))
        with self.db() as conn:
            devices = [dict(r) for r in conn.execute('SELECT id,mac,uid,label,last_seen FROM (SELECT *,ROW_NUMBER() OVER (PARTITION BY mac ORDER BY last_seen DESC,id) AS position FROM discovered_devices) WHERE position=1 ORDER BY label,id')]
        return {'id': LOCAL_ROOM, 'name': 'Epoptes', 'group_id': LOCAL_GROUP, 'devices': [d for d in devices if d['mac'] not in server_macs]}

    @property
    def adapter(self):
        return Epoptes(os.environ.get('QUIOSC_SOCKET', '/run/epoptes/epoptes.socket'),
                       trusted_uid=0 if self.discovery == 'epoptes' else None)

    def rooms(self):
        if self.mode == 'disabled':
            return []
        if self.discovery == 'epoptes':
            return [self.automatic_room()]
        rooms = json.loads(Path(os.environ['QUIOSC_ROOMS_FILE']).read_text())
        ids, machines = set(), set()
        if not isinstance(rooms, list) or len(rooms) > 100:
            raise ValueError('Configuración de aulas no válida')
        for room in rooms:
            if not re.fullmatch(r'[a-zA-Z0-9_-]{1,64}', room['id']) or room['id'] in ids or not room['group_id']:
                raise ValueError('Aula no válida o duplicada')
            ids.add(room['id'])
            if not 1 <= len(room['devices']) <= 60:
                raise ValueError('Se requieren entre 1 y 60 equipos por aula')
            local_ids = set()
            for device in room['devices']:
                key = (device['mac'].lower(), str(device['uid']))
                if not re.fullmatch(r'[a-zA-Z0-9_-]{1,64}', device['id']) or device['id'] in local_ids:
                    raise ValueError('Identificador de equipo no válido')
                if not re.fullmatch(r'(?:[0-9a-f]{2}:){5}[0-9a-f]{2}', key[0]) or not key[1].isdigit() or int(key[1]) <= 0 or key in machines:
                    raise ValueError('MAC/UID no válido o repetido')
                local_ids.add(device['id'])
                machines.add(key)
        return rooms

    def room(self, room_id):
        if self.discovery == 'epoptes' and self.mode != 'disabled':
            room = self.automatic_room()
            if room['id'] != room_id:
                return None
            return self.automatic_room(refresh=True)
        return next((r for r in self.rooms() if r['id'] == room_id), None)

    @contextmanager
    def db(self):
        path = os.environ.get('QUIOSC_DB', '/data/quiosc.db')
        conn = sqlite3.connect(path, timeout=15)
        conn.row_factory = sqlite3.Row
        try:
            conn.executescript('''
                CREATE TABLE IF NOT EXISTS sessions (
                  id TEXT PRIMARY KEY, room_id TEXT NOT NULL, group_id TEXT NOT NULL,
                  teacher TEXT NOT NULL, mode TEXT NOT NULL, created REAL NOT NULL,
                  seconds INTEGER NOT NULL);
                CREATE TABLE IF NOT EXISTS devices (
                  session_id TEXT NOT NULL, id TEXT NOT NULL, mac TEXT NOT NULL,
                  uid TEXT NOT NULL, label TEXT NOT NULL, state TEXT NOT NULL,
                  evidence TEXT NOT NULL, updated REAL NOT NULL,
                  PRIMARY KEY(session_id,id));
                CREATE UNIQUE INDEX IF NOT EXISTS one_exam_per_device
                  ON devices(mac,uid) WHERE state <> 'finished' AND state <> 'simulation_finished';
                CREATE TABLE IF NOT EXISTS audit (
                  at REAL NOT NULL, actor TEXT NOT NULL, operation TEXT NOT NULL,
                  session_id TEXT NOT NULL, device_id TEXT NOT NULL, state TEXT NOT NULL);
            ''')
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def session(self, session_id):
        with self.db() as conn:
            row = conn.execute('SELECT * FROM sessions WHERE id=?', (session_id,)).fetchone()
            return dict(row) if row else None

    def snapshot(self, session_id):
        with self.db() as conn:
            rows = conn.execute('SELECT id,label,state,evidence,updated FROM devices WHERE session_id=? ORDER BY id', (session_id,)).fetchall()
        return {'session': self.session(session_id), 'devices': [dict(r, evidence=json.loads(r['evidence'])) for r in rows]}

    def clients(self, devices):
        inventory = self.adapter.inventory()
        result = {}
        for device in devices:
            matches = [c for c in inventory if c['mac'] == device['mac'].lower() and c['uid'] == str(device['uid'])]
            # Multiple graphical sessions with the same UID are ambiguous.
            if self.discovery == 'epoptes' and sum(c['mac'] == device['mac'].lower() for c in inventory) != 1:
                continue  # Multiple sessions on the same PC need administrative review.
            if len(matches) == 1:
                result[device['id']] = matches[0]
        return result

    def invoke(self, client, action, session_id, url='', seconds=60):
        if client is None:
            return {'state': 'unknown', 'ready': False, 'reason': 'Equipo desconectado o sesión ambigua'}
        try:
            reply = self.adapter.run(client, action, session_id, url, seconds)
            lines = [line[7:] for line in reply.splitlines() if line.startswith('QUIOSC:')]
            if len(lines) != 1:
                raise ValueError()
            value = json.loads(lines[0])
            allowed = {'available', 'incompatible', 'starting', 'basic_kiosk', 'restoring', 'error', 'finished', 'unknown'}
            if value.get('state') not in allowed:
                raise ValueError()
            return value
        except (EpoptesError, ValueError, UnicodeError, TypeError):
            return {'state': 'unknown', 'ready': False, 'reason': 'Sin confirmación verificable de Epoptes'}

    def discover(self, room):
        if self.mode == 'simulation':
            return [dict(d, state='simulation_available', ready=True,
                         reason='SIMULACIÓN: equipo ficticio; no se consulta Epoptes') for d in room['devices']]
        clients = self.clients(room['devices'])
        def probe(d):
            return dict(d, **self.invoke(clients.get(d['id']), 'probe', '0' * 32))
        with ThreadPoolExecutor(max_workers=8) as pool:
            return list(pool.map(probe, room['devices']))

    def update(self, sid, device_id, actor, operation, value):
        with self.db() as conn:
            conn.execute('UPDATE devices SET state=?,evidence=?,updated=? WHERE session_id=? AND id=?',
                         (value['state'], json.dumps(value), time.time(), sid, device_id))
            conn.execute('INSERT INTO audit VALUES (?,?,?,?,?,?)',
                         (time.time(), actor, operation, sid, device_id, value['state']))

    def start(self, room, selected, url, seconds, actor):
        validate_url(url)
        if not selected or len(selected) != len(set(selected)) or len(selected) > 60:
            raise ValueError('Selecciona equipos sin duplicados')
        devices = [d for d in room['devices'] if d['id'] in selected]
        if len(devices) != len(selected):
            raise ValueError('Equipo fuera del aula autorizada')
        if self.mode not in ('real', 'simulation'):
            raise ValueError('Quiosc está desactivado')
        sid = uuid.uuid4().hex
        # Persist dispatch intent BEFORE remote execution, including uncertain results.
        with self.lock:
            with self.db() as conn:
                conn.execute('INSERT INTO sessions VALUES (?,?,?,?,?,?,?)',
                             (sid, room['id'], room['group_id'], actor, self.mode, time.time(), seconds))
                for d in devices:
                    conn.execute('INSERT INTO devices VALUES (?,?,?,?,?,?,?,?)',
                                 (sid, d['id'], d['mac'].lower(), str(d['uid']), d.get('label', d['id']),
                                  'starting', '{}', time.time()))
                    conn.execute('INSERT INTO audit VALUES (?,?,?,?,?,?)',
                                 (time.time(), actor, 'dispatch_start', sid, d['id'], 'starting'))
            self.operate(sid, actor, 'start', url=url, seconds=seconds)
        return self.snapshot(sid)

    def operate(self, sid, actor, action, device_id=None, url='', seconds=60):
        with self.lock:
            session = self.session(sid)
            with self.db() as conn:
                devices = [dict(r) for r in conn.execute('SELECT * FROM devices WHERE session_id=?', (sid,))]
            if device_id and device_id not in {d['id'] for d in devices}:
                raise ValueError('Equipo no incluido en la sesión')
            devices = [d for d in devices if (not device_id or d['id'] == device_id)
                       and d['state'] not in ('finished', 'simulation_finished')]
            if not devices:
                return self.snapshot(sid)
            clients = {}
            if session['mode'] == 'real':
                if self.mode != 'real':
                    raise ValueError('Para recuperar una sesión real se requiere QUIOSC_MODE=real')
                try:
                    clients = self.clients(devices)
                except EpoptesError:
                    pass
            def execute(d):
                if action == 'stop' and session['mode'] == 'real':
                    self.update(sid, d['id'], actor, 'dispatch_stop',
                                {'state': 'restoring', 'reason': 'Esperando confirmación local de cierre'})
                if session['mode'] == 'simulation':
                    state = 'simulation_finished' if action == 'stop' or time.time() > session['created'] + session['seconds'] else 'simulation_running'
                    value = {'state': state, 'reason': 'SIMULACIÓN: no hay ejecución ni restricciones reales'}
                else:
                    if action == 'start':
                        value = self.invoke(clients.get(d['id']), 'probe', sid)
                        if value.get('ready') is True:
                            value = self.invoke(clients.get(d['id']), 'start', sid, url, seconds)
                    else:
                        value = self.invoke(clients.get(d['id']), action, sid)
                self.update(sid, d['id'], actor, action, value)
            with ThreadPoolExecutor(max_workers=8) as pool:
                list(pool.map(execute, devices))
            return self.snapshot(sid)
