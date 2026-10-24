"""Compose defaults that protect the school server."""

import re
from pathlib import Path

ROOT = Path(__file__).parents[1]


def test_compose_has_logging_restart_and_resource_limits():
    text = (ROOT / 'compose.yml').read_text()
    assert 'x-logging: &default-logging' in text
    assert text.count('logging: *default-logging') == 13
    assert text.count('restart: unless-stopped') == 13
    assert text.count('mem_limit:') == 13
    assert text.count('pids_limit:') == 13
    assert 'PRAGMA busy_timeout' in (ROOT / 'services/id-api/vendor/edutictac_community/db.py').read_text()


def test_portal_play_recursos_admin_and_eduhoot_have_healthchecks():
    text = (ROOT / 'compose.yml').read_text()
    services = list(re.finditer(r'^  ([a-z0-9-]+):$', text, re.M))
    blocks = {}
    for index, match in enumerate(services):
        end = services[index + 1].start() if index + 1 < len(services) else len(text)
        blocks[match.group(1)] = text[match.start():end]
    for service in ('portal', 'play', 'recursos', 'admin', 'eduhoot'):
        assert 'healthcheck:' in blocks[service], service
