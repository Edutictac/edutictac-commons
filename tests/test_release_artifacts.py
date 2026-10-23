import importlib.util
from pathlib import Path
import pytest

SPEC = importlib.util.spec_from_file_location('release_artifacts', Path(__file__).parents[1] / 'scripts/check-release-artifacts.py')
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)


@pytest.mark.parametrize('path', [
    'usr/share/nginx/html/.recall/history.md', 'app/.env',
    './opt/commons/.env.production', 'app/.git/config', 'home/user/.ssh/id_ed25519',
])
def test_private_work_paths_are_rejected_at_any_depth(path):
    assert module.forbidden(path)


@pytest.mark.parametrize('path', [
    'opt/commons/.env.example', 'app/.gitignore', 'public/about.html',
    'edutictac-llibres/LICENSE',
])
def test_distributable_source_and_examples_are_allowed(path):
    assert not module.forbidden(path)
