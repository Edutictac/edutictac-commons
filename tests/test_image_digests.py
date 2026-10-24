"""Digest capture and pinning helper."""

import importlib.util
import json
import os
from pathlib import Path

ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location('image_digests_test', ROOT / 'scripts/image-digests.py')
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)


def test_split_tag_handles_registry_ports():
    assert module.split_tag('registry.example:5000/team/app:1.2.3') == ('registry.example:5000/team/app', '1.2.3')
    assert module.split_tag('registry.example/team/app@sha256:abc') == (None, None)
    assert module.split_tag('scratch') == (None, None)


def test_capture_prefers_digests_for_tagged_images(monkeypatch):
    monkeypatch.setattr(module, 'compose_images', lambda env: [
        'registry.example/team/app:1.0',
        'registry.example/team/other@sha256:abc',
    ])
    monkeypatch.setattr(module, 'local_digest', lambda ref: 'registry.example/team/app@sha256:def')
    assert module.capture('local', ROOT / '.env.example') == {
        'registry.example/team/app:1.0': 'registry.example/team/app@sha256:def'
    }


def test_pin_pulls_digest_then_retags(tmp_path, monkeypatch):
    calls = []
    fake = tmp_path / 'docker'
    fake.write_text('#!/bin/sh\nprintf "%s\\n" "$*" >> "' + str(tmp_path / 'calls') + '"\nif [ "$1" = "image" ]; then exit 1; fi\n')
    fake.chmod(0o755)
    monkeypatch.setenv('DOCKER', str(fake))
    digests = tmp_path / 'digests.json'
    digests.write_text(json.dumps({
        'registry.example/team/app:1.0': 'registry.example/team/app@sha256:def'
    }))
    assert module.pin(digests) == 1
    lines = (tmp_path / 'calls').read_text().splitlines()
    assert any(line.startswith('pull registry.example/team/app@sha256:def') for line in lines)
    assert any(line.startswith('tag registry.example/team/app@sha256:def registry.example/team/app:1.0') for line in lines)


def test_capture_rejects_incomplete_digests(monkeypatch):
    import pytest
    monkeypatch.setattr(module, 'compose_images', lambda env: ['registry.example/team/app:1.0'])
    monkeypatch.setattr(module, 'local_digest', lambda ref: None)
    with pytest.raises(SystemExit, match='unresolved_digest'):
        module.capture('local', ROOT / '.env.example')
