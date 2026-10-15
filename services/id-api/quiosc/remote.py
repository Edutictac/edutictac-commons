"""Only fixed, server-owned Python is sent over Epoptes; parameters are quoted."""
import json
from pathlib import Path
import re
import shlex
from urllib.parse import urlsplit, parse_qsl

SOURCE = Path(__file__).with_name('student.py').read_text()


def validate_url(url):
    if len(url) > 2048 or any(ord(c) < 33 for c in url):
        raise ValueError('URL no válida')
    parsed = urlsplit(url)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError('Usa una URL HTTP(S) sin credenciales')
    if any(re.search(r'password|token|secret|auth|key|ticket', key, re.I) for key, _ in parse_qsl(parsed.query)):
        raise ValueError('No incluyas credenciales en la URL')
    return url


def build_command(action, session_id, url='', seconds=60):
    if action not in ('probe', 'start', 'status', 'stop') or not re.fullmatch(r'[a-f0-9]{32}', session_id):
        raise ValueError('invalid operation')
    if action == 'start':
        validate_url(url)
    if not isinstance(seconds, int) or not 1 <= seconds <= 14400:
        raise ValueError('invalid duration')
    args = json.dumps({'action': action, 'id': session_id, 'url': url, 'seconds': seconds}, ensure_ascii=True)
    return shlex.join(['python3', '-c', SOURCE, args, SOURCE])
