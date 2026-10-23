"""Large classroom uploads do not widen unrelated local API request limits."""
from pathlib import Path

ROOT=Path(__file__).parents[1]/'services/portal/nginx'


def test_local_json_and_upload_limits_are_separate():
    config=(ROOT/'default.conf').read_text()
    generic=config.split('    location /api/ {',1)[1].split('\n    }',1)[0]
    upload=config.split('    location ~ ^/api/(teacher/groups/[^/]+/files|student/group-files)$ {',1)[1].split('\n    }',1)[0]
    assert 'client_max_body_size 1m;' in generic
    assert 'client_max_body_size 110m;' in upload
    assert 'proxy_request_buffering off;' in upload
    assert 'proxy_set_header Host $http_host;' in upload
    assert 'client_max_body_size 30m;' in config.split('    location /api/llibres/ {',1)[1].split('\n    }',1)[0]
    assert 'client_max_body_size 5m;' in config.split('    location /api/assets/v1/ {',1)[1].split('\n    }',1)[0]


def test_federated_files_have_their_own_limit_without_widening_generic_api():
    config=(ROOT/'federated.conf').read_text()
    generic=config.split('    location /api/ {',1)[1].split('\n    }',1)[0]
    upload=config.split('    location ~ ^/api/(teacher/groups/[^/]+/files|student/group-files)$ {',1)[1].split('\n    }',1)[0]
    assert 'client_max_body_size 30m;' in generic
    assert 'client_max_body_size 110m;' in upload
    assert 'proxy_pass http://127.0.0.1:8005;' in upload
    assert 'proxy_set_header Host $http_host;' in upload
