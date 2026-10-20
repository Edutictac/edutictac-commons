"""Secure launch wrappers preserve an explicitly selected local OIDC client."""
import json
import os
from pathlib import Path
import subprocess

import pytest

ROOT = Path(__file__).resolve().parents[1]


@pytest.mark.parametrize('explicit', [False, True])
def test_oidc_wrapper_respects_selected_client(tmp_path, explicit):
    fake_pass = tmp_path / 'pass'
    fake_pass.write_text('''#!/usr/bin/env python3
import os,sys
with open(os.environ['WRAPPER_PASS_CALLS'],'a') as log: log.write(sys.argv[-1]+'\\n')
print('synthetic-fallback-id' if sys.argv[-1].endswith('client-id') else 'synthetic-fallback-secret')
''')
    fake_docker = tmp_path / 'docker'
    fake_docker.write_text('''#!/usr/bin/env python3
import json,os,sys
print(json.dumps({'arguments':sys.argv[1:],
 'id_preserved':os.environ['EDUTICTAC_ID_OIDC_CLIENT_ID']==os.environ['WRAPPER_EXPECT_ID'],
 'secret_preserved':os.environ['EDUTICTAC_ID_OIDC_CLIENT_SECRET']==os.environ['WRAPPER_EXPECT_SECRET'],
 'eduhoot_id_preserved':os.environ['EDUHOOT_AUTHENTIK_CLIENT_ID']==os.environ['WRAPPER_EXPECT_ID']}))
''')
    fake_pass.chmod(0o755); fake_docker.chmod(0o755)
    env = {k:v for k,v in os.environ.items() if not k.startswith(('EDUTICTAC_ID_OIDC_', 'EDUHOOT_AUTHENTIK_'))}
    env['PATH'] = str(tmp_path) + os.pathsep + env['PATH']
    calls = tmp_path / 'calls'
    env['WRAPPER_PASS_CALLS'] = str(calls)
    env['WRAPPER_EXPECT_ID'] = 'synthetic-selected-id' if explicit else 'synthetic-fallback-id'
    env['WRAPPER_EXPECT_SECRET'] = 'synthetic-selected-secret' if explicit else 'synthetic-fallback-secret'
    if explicit:
        env['EDUTICTAC_ID_OIDC_CLIENT_ID'] = env['WRAPPER_EXPECT_ID']
        env['EDUTICTAC_ID_OIDC_CLIENT_SECRET'] = env['WRAPPER_EXPECT_SECRET']
    result = subprocess.run([str(ROOT / 'scripts/up-authentik-pass.sh'), 'config', '--quiet'],
                            env=env, capture_output=True, text=True, check=True)
    data = json.loads(result.stdout)
    assert data == {'arguments':['compose','config','--quiet'], 'id_preserved':True,
                    'secret_preserved':True, 'eduhoot_id_preserved':True}
    assert (not calls.exists()) if explicit else len(calls.read_text().splitlines()) == 2
