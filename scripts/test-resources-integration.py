#!/usr/bin/env python3
"""Exercise the configured classroom catalogue without logging credentials."""
import argparse
import http.cookiejar
import json
import os
from pathlib import Path
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid


def configuration():
    values = {}
    path = Path(__file__).resolve().parents[1] / '.env'
    if path.is_file():
        for line in path.read_text().splitlines():
            if line.strip() and not line.lstrip().startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                values[key.strip()] = value.strip().strip('"').strip("'")
    return {**values, **os.environ}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('flow', choices=['catalogue', 'teacher'])
    args = parser.parse_args()
    env = configuration()
    resources = env.get('RECURSOS_TEST_URL') or 'http://127.0.0.1:' + env.get('RECURSOS_PORT', '8086')
    portal = env.get('COMMONS_TEST_URL') or 'http://127.0.0.1:' + env.get('PORTAL_PORT', '8082')
    play = env.get('PLAY_PUBLIC_URL') or 'http://localhost:8084'
    ingest = env.get('PLAY_INGEST_TOKEN', 'local-play-ingest-token')
    teacher = env.get('EDUTICTAC_ID_TEACHER_TOKEN', 'dev-teacher')
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))

    def request(url, payload=None, *, method=None, ingest_auth=False):
        headers = {}
        if ingest_auth:
            headers['Authorization'] = 'Bearer ' + ingest
        if payload is not None:
            headers['Content-Type'] = 'application/json'
        req = urllib.request.Request(url, method=method,
            data=json.dumps(payload).encode() if payload is not None else None, headers=headers)
        try:
            with opener.open(req, timeout=20) as response:
                return json.loads(response.read())
        except urllib.error.HTTPError as error:
            raise RuntimeError(f'{req.get_method()} {urllib.parse.urlsplit(url).path}: HTTP {error.code}') from None

    aid = 'resflow' + uuid.uuid4().hex[:12]
    external = 'edutictac-play:' + aid
    endpoint = resources.rstrip('/') + '/api/integrations/recursos/activities/' + aid
    payload = {
        'contract_version': '1', 'external_id': external, 'version': 'flow-v1',
        'idempotency_key': external + ':flow-v1', 'visibility': 'public',
        'canonical_url': play.rstrip('/') + '/play/' + aid,
        'download_url': play.rstrip('/') + '/api/activities/' + aid + '/download',
        'metadata': {'title': 'Commons integration ' + aid, 'description': 'Temporary integration fixture',
            'type': 'multiple-choice', 'language': 'es', 'subject': 'Pruebas',
            'educational_stage': 'Primaria', 'tags': ['integration-test'],
            'license': 'CC BY-SA', 'author_pseudonym': 'Aula de pruebas'},
        'package': {'format': 'h5p', 'delivery': 'download_url'},
    }
    group_id = None
    published = False
    try:
        first = request(endpoint + '/publish', payload, ingest_auth=True)
        published = True
        second = request(endpoint + '/publish', payload, ingest_auth=True)
        assert first['resource_id'] == second['resource_id'] == external
        assert first['status'] == second['status'] == 'published'
        query = urllib.parse.urlencode({'provider': 'edutictac-play', 'q': aid})
        indexed = request(resources.rstrip('/') + '/api/resources?' + query)
        assert [r['external_id'] for r in indexed['items']] == [external]
        if args.flow == 'teacher':
            request(portal + '/api/teacher/login', {'token': teacher})
            batch = request(portal + '/api/identities/batch',
                {'tenant_id': 'resources-flow-test', 'count': 1, 'pin_length': 4})
            group_id = batch['group']['id']
            assignment = request(portal + '/api/teacher/activity-assignments',
                {'group_id': group_id, 'app_id': 'edutictac-play', 'activity_id': aid,
                 'title': 'Recurso del catálogo'})
            assert assignment['assignment']['activity_id'] == aid
    finally:
        try:
            if group_id:
                request(portal + '/api/teacher/groups/' + group_id, method='DELETE')
        finally:
            if published:
                request(endpoint + '/unpublish', {}, ingest_auth=True)
    print('Teacher Recursos assignment flow: OK' if args.flow == 'teacher' else 'Recursos catalogue integration: OK')


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, AssertionError, OSError, ValueError, KeyError) as error:
        print(str(error) if isinstance(error, RuntimeError) else 'Resources integration failed (' + type(error).__name__ + ')', file=sys.stderr)
        raise SystemExit(1)
