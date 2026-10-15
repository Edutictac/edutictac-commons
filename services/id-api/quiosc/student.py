"""Ephemeral per-exam supervisor. Executed as the existing Epoptes session user.

Only the dedicated Firefox process group is signalled. No KDE/profile/network
settings are changed. State is evidence of process liveness, not isolation.
"""
import fcntl
import json
import os
from pathlib import Path
import re
import shutil
import signal
import stat
import subprocess
import sys
import time


def emit(value):
    print('QUIOSC:' + json.dumps(value), flush=True)


def process_ticks(pid):
    try:
        # comm may contain spaces or parentheses.
        fields = Path('/proc/%d/stat' % pid).read_text().rsplit(')', 1)[1].split()
        return '' if fields[0] == 'Z' else fields[19]
    except (OSError, IndexError):
        return ''


def alive(pid, ticks):
    return bool(ticks and process_ticks(pid) == ticks)


def safe_dir(path):
    try:
        path.mkdir(mode=0o700)
    except FileExistsError:
        pass
    st = path.lstat()
    if not stat.S_ISDIR(st.st_mode) or st.st_uid != os.getuid() or st.st_mode & 0o077:
        raise ValueError('unsafe temporary directory')


def save(path, value):
    temp = path.with_suffix('.new')
    # All files are in a private directory; student owns it and can tamper,
    # therefore no state from this file is claimed to be a security boundary.
    temp.write_text(json.dumps(value))
    temp.replace(path)


def observe(path):
    if not path.exists():
        return {'state': 'unknown', 'reason': 'No hay confirmación local'}
    value = json.loads(path.read_text())
    if value['state'] in ('starting', 'basic_kiosk', 'restoring'):
        if not alive(value.get('worker', 0), value.get('worker_ticks', '')):
            return {'state': 'unknown', 'reason': 'Supervisor no verificable; recuperación administrativa necesaria'}
        if value['state'] == 'basic_kiosk' and not alive(value.get('browser', 0), value.get('browser_ticks', '')):
            return {'state': 'unknown', 'reason': 'Navegador no verificable'}
    return value


def probe():
    browser = shutil.which('firefox') or shutil.which('firefox-esr')
    version = ''
    if browser:
        try:
            result = subprocess.run([browser, '--version'], capture_output=True, text=True, timeout=3)
            match = re.search(r'(\d+)\.', result.stdout)
            if result.returncode == 0 and match:
                version = match.group(1)
        except (OSError, subprocess.TimeoutExpired):
            pass
    desktop = os.environ.get('XDG_CURRENT_DESKTOP', '')
    session = os.environ.get('XDG_SESSION_TYPE', '')
    if not session and os.environ.get('DISPLAY') and not os.environ.get('WAYLAND_DISPLAY'):
        session = 'x11'
    ready = bool(os.getuid() > 0 and browser and version and int(version) >= 71 and os.environ.get('DISPLAY')
                 and session == 'x11' and ('KDE' in desktop.upper() or 'PLASMA' in desktop.upper()))
    return {'state': 'available' if ready else 'incompatible', 'ready': ready,
            'desktop': desktop[:80], 'display_server': session, 'browser': browser, 'browser_major': version,
            'uid': os.getuid(), 'assurance': 'basic_kiosk',
            'reason': 'Solo quiosco básico supervisado; escritorio y navegación sin aislar'}


def worker(args, directory, state_path):
    # This lock remains held while Firefox is running, independently of Docker.
    lock = open(directory.parent / 'active.lock', 'a')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        save(state_path, {'state': 'error', 'cleaned': True, 'reason': 'Ya hay otra sesión local'})
        return
    value = {'state': 'starting', 'worker': os.getpid(),
             'worker_ticks': process_ticks(os.getpid()), 'assurance': 'basic_kiosk'}
    child = None
    stopping = [False]
    signal.signal(signal.SIGTERM, lambda *_: stopping.__setitem__(0, True))
    signal.signal(signal.SIGHUP, signal.SIG_IGN)
    profile = directory / 'profile'
    try:
        save(state_path, value)
        safe_dir(profile)
        browser = probe()['browser']
        child = subprocess.Popen([browser, '--no-remote', '--new-instance', '--profile', str(profile),
                                  '--kiosk', args['url']], stdin=subprocess.DEVNULL,
                                 stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                                 start_new_session=True, close_fds=True)
        value.update(browser=child.pid, browser_ticks=process_ticks(child.pid))
        deadline = time.monotonic() + args['seconds']
        started = time.monotonic()
        while os.waitid(os.P_PID, child.pid, os.WEXITED | os.WNOHANG | os.WNOWAIT) is None and time.monotonic() < deadline and not stopping[0] and not (directory / 'stop').exists():
            # Process surviving startup is not evidence of fullscreen or focus.
            if time.monotonic() - started > 2:
                value['state'] = 'basic_kiosk'
            save(state_path, value)
            time.sleep(0.25)
        exit_info = os.waitid(os.P_PID, child.pid, os.WEXITED | os.WNOHANG | os.WNOWAIT)
        if exit_info is not None and (exit_info.si_code != os.CLD_EXITED or exit_info.si_status != 0):
            value.update(state='error', reason='Firefox terminó con error')
        else:
            value['state'] = 'finished'
    except Exception:
        value.update(state='error', reason='No se pudo iniciar o supervisar Firefox')
    finally:
        save(state_path, dict(value, state='restoring'))
        if child is not None:
            # Retain the group leader as a zombie until signalling completes:
            # do not signal a saved PID from another invocation or session.
            try:
                os.killpg(child.pid, signal.SIGTERM)
                time.sleep(1)
                os.killpg(child.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
            child.wait()
        try:
            shutil.rmtree(profile)
            value['cleaned'] = True
        except FileNotFoundError:
            value['cleaned'] = True
        except OSError:
            value.update(state='error', reason='Perfil temporal pendiente de limpieza')
        save(state_path, value)


def main():
    os.umask(0o077)
    args = json.loads(sys.argv[1])
    if os.getuid() == 0 or not re.fullmatch('[a-f0-9]{32}', args['id']):
        raise ValueError('session user required')
    if args['action'] == 'probe':
        emit(probe())
        return
    root = Path('/tmp/edutictac-quiosc-%d' % os.getuid())
    safe_dir(root)
    directory = root / args['id']
    safe_dir(directory)
    state_path = directory / 'state.json'
    action = args['action']
    if action == 'worker':
        worker(args, directory, state_path)
        return
    if action == 'start':
        if not probe()['ready']:
            emit(probe())
            return
        # Prevent duplicate workers even when Epoptes times out after dispatch.
        start_lock = open(directory / 'start.lock', 'a')
        fcntl.flock(start_lock, fcntl.LOCK_EX)
        if not state_path.exists():
            worker_args = dict(args, action='worker')
            save(state_path, {'state': 'starting', 'reason': 'Esperando supervisor'})
            subprocess.Popen([sys.executable, '-c', sys.argv[2], json.dumps(worker_args), sys.argv[2]],
                             stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                             stderr=subprocess.DEVNULL, start_new_session=True, close_fds=True)
        time.sleep(2.8)
    elif action == 'stop':
        (directory / 'stop').touch(mode=0o600)
        # A tombstone prevents a late start with this same ID after stop.
        if not state_path.exists():
            save(state_path, {'state': 'finished', 'reason': 'Cancelado antes del inicio'})
        for _ in range(24):
            value = observe(state_path)
            if value['state'] == 'error' and value.get('cleaned') is True:
                value.update(state='finished', reason='Restaurado tras error de activación')
                save(state_path, value)
            if value['state'] not in ('starting', 'basic_kiosk', 'restoring'):
                break
            time.sleep(0.25)
    elif action != 'status':
        raise ValueError('invalid action')
    emit(observe(state_path))


if __name__ == '__main__':
    try:
        main()
    except Exception:
        emit({'state': 'unknown', 'reason': 'Fallo local; no se confirma restauración'})
