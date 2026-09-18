import importlib.util
import io
import json
from pathlib import Path
import sys
import urllib.error

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / 'admin'))
SPEC = importlib.util.spec_from_file_location('commons_admin', ROOT / 'admin/server.py')
admin = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(admin)


def test_eduhoot_sync_imports_into_service_and_reports_failure(tmp_path, monkeypatch):
    (tmp_path / 'eduhoot').mkdir()
    (tmp_path / 'eduhoot/quizzes.json').write_text(json.dumps({'items': [{'id': 1}]}))
    monkeypatch.setattr(admin, 'sync_channel', lambda *a: {'path': str(tmp_path), 'version': 'test', 'items': 1})
    monkeypatch.setattr(admin, 'EDUHOOT_RESOURCES_TOKEN', 'test-only')
    requests = []

    def send(request, timeout):
        requests.append(request)
        return io.BytesIO(b'{"ok":true,"imported":1,"skipped":0,"failed":0}')

    monkeypatch.setattr(admin.urllib.request, 'urlopen', send)
    result = admin.action_content_sync('eduhoot')({})
    assert result[0] is True
    assert '1 cuestionarios importados' in result[1]
    assert requests[0].full_url.endswith('/api/integrations/recursos/import-catalog')
    assert json.loads(requests[0].data)['items'] == [{'id': 1}]

    def fail(*args, **kwargs):
        raise urllib.error.HTTPError('http://eduhoot', 500, 'failed', {}, None)

    monkeypatch.setattr(admin.urllib.request, 'urlopen', fail)
    result = admin.action_content_sync('eduhoot')({})
    assert result[0] is False
    assert result[2] == 502
