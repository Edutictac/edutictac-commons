"""Run the host update/rollback scripts against a disposable fake Docker stack."""
import json
import os
from pathlib import Path
import shutil
import subprocess

import pytest

ROOT = Path(__file__).parents[1]


def executable(path, source):
    path.write_text(source)
    path.chmod(0o755)


@pytest.fixture
def installation(tmp_path):
    scripts = tmp_path / 'scripts'
    scripts.mkdir()
    for name in ('update-images.sh', 'rollback-images.sh', 'image-digests.py',
                 'apply-update-tags.py', 'operation-lock.sh'):
        shutil.copy2(ROOT / 'scripts' / name, scripts / name)
    (tmp_path / '.env').write_text('IMAGE_TAG=old\nADMIN_TAG=old\nEDUHOOT_TAG=old\nRECURSOS_TAG=bank-old\n')
    (tmp_path / 'VERSION').write_text('old\n')
    executable(scripts / 'backup.sh', '''#!/bin/sh
mkdir -p backups/commons-20261024T200000Z
''')
    for name in ('backup-check.sh', 'check-images.sh', 'test-flow.sh'):
        executable(scripts / name, '#!/bin/sh\nexit 0\n')
    executable(scripts / 'check-updates.py', '''#!/usr/bin/env python3
import json, os
changed = os.environ.get('TEST_CHANGED') == '1'
print(json.dumps({key: {'update_available': changed, 'candidate': tag}
                  for key, tag in [('commons','new'), ('recursos','bank-new')]}))
''')
    fake_bin = tmp_path / 'bin'
    fake_bin.mkdir()
    executable(fake_bin / 'curl', '#!/bin/sh\nexit 0\n')
    executable(fake_bin / 'docker', '''#!/usr/bin/env python3
import json, os, sys
from pathlib import Path
args = sys.argv[1:]
root = Path.cwd()
with (root/'docker-calls.jsonl').open('a') as stream:
    stream.write(json.dumps(args)+'\\n')
if args[0] == 'compose':
    if 'config' in args:
        env = dict(line.split('=',1) for line in (root/'.env').read_text().splitlines())
        print('registry.example/api:'+env['IMAGE_TAG'])
        print('registry.example/bank:'+env['RECURSOS_TAG'])
    elif 'up' in args:
        marker = root/'up-failed'
        if not marker.exists():
            marker.touch()
            sys.exit(1)
elif args[:2] == ['image','inspect']:
    if '--format' in args:
        if os.environ.get('TEST_MISSING_DIGEST') == '1':
            sys.exit(1)
        print(json.dumps([args[-1].rsplit(':',1)[0]+'@sha256:'+'a'*64]))
elif args[:2] == ['manifest','inspect']:
    print(json.dumps({'Descriptor': {'digest':'sha256:'+'b'*64}}))
''')
    env = dict(os.environ, PATH=str(fake_bin)+os.pathsep+os.environ['PATH'], DOCKER='docker')
    env.pop('COMMONS_OPERATION_LOCK_HELD', None)
    return tmp_path, env


@pytest.mark.parametrize('changed', ['0', '1'])
def test_failed_restart_rolls_back_exact_images_and_resource_tag(installation, changed):
    root, env = installation
    env['TEST_CHANGED'] = changed
    result = subprocess.run([str(root/'scripts/update-images.sh')], cwd=root, env=env,
                            capture_output=True, text=True, timeout=30)
    assert result.returncode != 0
    assert 'Rollback automatic completat.' in result.stdout
    values = dict(line.split('=',1) for line in (root/'.env').read_text().splitlines())
    assert values['IMAGE_TAG'] == 'old'
    assert values['RECURSOS_TAG'] == 'bank-old'
    metadata = json.loads((root/'backups/commons-20261024T200000Z/update.json').read_text())
    assert len(metadata['previous_images']) == 2
    calls = [json.loads(line) for line in (root/'docker-calls.jsonl').read_text().splitlines()]
    assert sum(args[0] == 'compose' and 'up' in args for args in calls) == 2
    for ref in metadata['previous_images'].values():
        assert any(args[:2] == ['tag', ref] for args in calls)


def test_missing_previous_digest_aborts_before_pull_or_tag_change(installation):
    root, env = installation
    env['TEST_MISSING_DIGEST'] = '1'
    env['TEST_CHANGED'] = '1'
    result = subprocess.run([str(root/'scripts/update-images.sh')], cwd=root, env=env,
                            capture_output=True, text=True, timeout=30)
    assert result.returncode != 0
    calls = [json.loads(line) for line in (root/'docker-calls.jsonl').read_text().splitlines()]
    assert not any(args[0] == 'compose' and ('pull' in args or 'up' in args) for args in calls)
    assert 'IMAGE_TAG=old\n' in (root/'.env').read_text()
