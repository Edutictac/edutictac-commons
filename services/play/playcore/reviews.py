"""Private reviews stored atomically with immutable saved Play activities.

No second user database: every request resolves the current Commons classroom
scope. Only approving an exact revision publishes through the existing bank adapter.
"""
import copy
import json
import threading
from datetime import datetime, timezone
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from .store import ACTIVITIES_DIR, ID_RE, read_activity, save_activity, public_activity
from .config import COMMONS_API_URL, COMMONS_AUTH_ME_URL, RECURSOS_API_URL, RECURSOS_INGEST_TOKEN, PLAY_PUBLIC_URL, URL_PREFIX

LOCK = threading.RLock()

class ReviewError(Exception):
    def __init__(self, status, code):
        self.status, self.code = status, code


def access(handler, group='', student=''):
    if not COMMONS_API_URL or not handler.headers.get('Cookie'):
        raise ReviewError(401, 'session_required')
    query = '?' + urlencode({'group_id': group, 'student_id': student}) if group else ''
    try:
        request = Request(COMMONS_API_URL + '/api/play/access' + query, headers={'Cookie': handler.headers['Cookie']})
        with urlopen(request, timeout=8) as result:
            data = json.loads(result.read())
        if not isinstance(data, dict) or not data.get('actor') or data.get('role') not in {'student', 'teacher'}:
            raise ReviewError(503, 'review_unavailable')
        return data
    except HTTPError as exc:
        raise ReviewError(exc.code if exc.code in {401, 403, 404, 409} else 503, 'review_access_denied')
    except (URLError, OSError, ValueError):
        raise ReviewError(503, 'review_unavailable')


def check_write(handler, strict=True):
    origin = handler.headers.get('Origin')
    if ((strict and handler.headers.get('X-Play-Review') != '1') or handler.headers.get('Sec-Fetch-Site') == 'cross-site'
            or (origin and urlsplit(origin).netloc.lower() != handler.headers.get('Host', '').lower())
            or handler.headers.get('Content-Type', '').split(';')[0] != 'application/json'):
        raise ReviewError(403, 'request_not_allowed')


def read_body(handler):
    try:
        length = int(handler.headers.get('Content-Length', '0'))
        if not 0 < length <= 8192:
            raise ValueError()
        data = json.loads(handler.rfile.read(length))
        if not isinstance(data, dict):
            raise ValueError()
        return data
    except (ValueError, UnicodeDecodeError):
        raise ReviewError(400, 'invalid_review')


def activity(key):
    if not ID_RE.fullmatch(key):
        raise ReviewError(404, 'not_found')
    data = read_activity(key)
    if not data:
        raise ReviewError(404, 'not_found')
    return data


def result(data, include_content=False):
    review = data.get('review') or {}
    output = {'id': data['id'], 'title': data['title'], 'type': data['type'], 'revision': review.get('revision', 0),
              'status': review.get('status', 'draft'), 'feedback': review.get('feedback', ''),
              'group_id': review.get('group_id', ''), 'updated_at': review.get('updated_at', ''),
              'published': data.get('recursos', {}).get('status') in {'published', 'updated'}}
    if include_content:
        output['activity'] = public_activity(data)
    return output


def publish(data, withdraw=False):
    if not RECURSOS_API_URL or not RECURSOS_INGEST_TOKEN or not PLAY_PUBLIC_URL:
        raise ReviewError(503, 'publication_unavailable')
    from recursos import build_publish_payload
    payload = {key: value for key, value in data.items() if key not in {'review', 'recursos', 'owner_group_id', 'owner_id', 'owner_key_hash'}}
    payload['visibility'] = 'public'
    body = b'' if withdraw else json.dumps(build_publish_payload(payload, public_base_url=PLAY_PUBLIC_URL, url_prefix=URL_PREFIX), ensure_ascii=False).encode()
    request = Request(f'{RECURSOS_API_URL}/api/integrations/recursos/activities/{data["id"]}/'+('unpublish' if withdraw else 'publish'),
                      data=body, headers={'Authorization': 'Bearer '+RECURSOS_INGEST_TOKEN, 'Content-Type': 'application/json'}, method='POST')
    try:
        with urlopen(request, timeout=20) as response:
            output = json.loads(response.read())
        if not isinstance(output, dict) or output.get('status') not in ({'withdrawn', 'unpublished'} if withdraw else {'published', 'updated'}):
            raise ReviewError(502, 'publication_unavailable')
        return output
    except (HTTPError, URLError, OSError, ValueError):
        raise ReviewError(503, 'publication_unavailable')


def dispatch(handler, path, method):
    if not (path == '/api/reviews' or path.startswith('/api/reviews/') or path.startswith('/api/submissions/') or path == '/api/publication/me'):
        return False
    try:
        if path == '/api/publication/me' and method == 'GET':
            try:
                scope = access(handler)
            except ReviewError as exc:
                if exc.status not in {401, 403}:
                    raise
                scope = {'can_publish': False, 'can_submit': False, 'can_review': False, 'reason': exc.code}
            handler.send_json(200, scope)
            return True
        if method == 'POST':
            check_write(handler)
        scope = access(handler)
        if path == '/api/reviews' and method == 'GET':
            if not scope.get('can_review'):
                raise ReviewError(403, 'teacher_required')
            from urllib.parse import parse_qs
            query = parse_qs(urlsplit(handler.path).query)
            try:
                offset = int(query.get('offset', ['0'])[0])
                if offset < 0 or offset > 100000:
                    raise ValueError()
            except ValueError:
                raise ReviewError(400, 'invalid_review')
            groups = {g['id']:g['name'] for g in scope['groups']}
            rows = []
            with LOCK:
                for folder in ACTIVITIES_DIR.iterdir() if ACTIVITIES_DIR.exists() else []:
                    if not ID_RE.fullmatch(folder.name):
                        continue
                    data = read_activity(folder.name)
                    if data and data.get('review', {}).get('group_id') in groups:
                        item = result(data);item['class_name'] = groups[item['group_id']]
                        rows.append(item)
            rows.sort(key=lambda r:(r['status'] == 'pending', r['updated_at'], r['id']), reverse=True)
            handler.send_json(200, {'items': rows[offset:offset+25], 'more': len(rows)>offset+25, 'offset': offset})
            return True
        key = path.rsplit('/', 1)[-1]
        with LOCK:
            data = activity(key)
            if path.startswith('/api/submissions/'):
                if not scope.get('can_submit') or data.get('owner_id') != scope['actor']:
                    raise ReviewError(404, 'not_found')
                if method == 'GET':
                    handler.send_json(200, result(data))
                    return True
                if method != 'POST':
                    raise ReviewError(405, 'method_not_allowed')
                body = read_body(handler)
                old = data.get('review') or {}
                if old.get('status') in {'pending', 'approved'}:
                    handler.send_json(200, result(data));return True
                if body.get('revision') != old.get('revision', 0):
                    raise ReviewError(409, 'review_conflict')
                if data.get('owner_group_id') and data['owner_group_id'] != scope['group_id']:
                    raise ReviewError(409, 'review_class_changed')
                data['owner_group_id'] = scope['group_id']
                data['visibility'] = 'private'
                data['review'] = {'group_id': scope['group_id'], 'revision': old.get('revision', 0)+1, 'status': 'pending', 'feedback': '', 'updated_at': datetime.now(timezone.utc).isoformat()}
                save_activity(data);handler.send_json(200, result(data));return True
            if not scope.get('can_review') or not data.get('review'):
                raise ReviewError(404, 'not_found')
            review = data['review']
            access(handler, review['group_id'])
            if method == 'GET':
                handler.send_json(200, result(data, True));return True
            if method != 'POST':
                raise ReviewError(405, 'method_not_allowed')
            body = read_body(handler)
            decision = body.get('decision')
            if body.get('revision') != review['revision']:
                if decision == 'approve' and review['status'] == 'approved' and body.get('revision') == review['revision']-1:
                    handler.send_json(200, result(data));return True
                raise ReviewError(409, 'review_conflict')
            if decision not in {'approve', 'return', 'withdraw'}:
                raise ReviewError(400, 'invalid_review')
            feedback = str(body.get('feedback', '')).strip()[:2000]
            if decision == 'return' and not feedback:
                raise ReviewError(400, 'feedback_required')
            if decision == 'approve' and review['status'] == 'approved':
                handler.send_json(200, result(data));return True
            if decision == 'approve' and review['status'] != 'pending':
                raise ReviewError(409, 'review_conflict')
            if decision == 'return' and review['status'] != 'pending':
                raise ReviewError(409, 'review_conflict')
            if decision == 'withdraw' and review['status'] != 'approved':
                raise ReviewError(409, 'review_conflict')
            # Authorize current pupil/group immediately before publishing, never a client-supplied scope.
            if decision == 'approve':
                access(handler, review['group_id'], data.get('owner_id', ''))
            if decision in {'approve', 'withdraw'}:
                data['recursos'] = publish(data, decision == 'withdraw')
                data['visibility'] = 'public' if decision == 'approve' else 'private'
            review.update(status={'approve':'approved', 'return':'returned', 'withdraw':'withdrawn'}[decision], feedback=feedback,
                          reviewed_by=scope['actor'], updated_at=datetime.now(timezone.utc).isoformat())
            # A decision consumes the expected revision, preventing stale approval/return races.
            review['revision'] += 1
            save_activity(data);handler.send_json(200, result(data));return True
    except ReviewError as exc:
        handler.send_json(exc.status, {'error': exc.code})
        return True
