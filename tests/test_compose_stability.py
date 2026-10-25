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
    section = text.split('\nnetworks:\n', 1)[0]
    services = list(re.finditer(r'^  ([a-z0-9-]+):$', section, re.M))
    blocks = {}
    for index, match in enumerate(services):
        end = services[index + 1].start() if index + 1 < len(services) else len(section)
        blocks[match.group(1)] = section[match.start():end]
    for service in ('portal', 'play', 'recursos', 'admin', 'eduhoot'):
        assert 'healthcheck:' in blocks[service], service


def test_optional_apps_are_isolated_from_core():
    text = (ROOT / 'compose.yml').read_text()
    section = text.split('\nnetworks:\n', 1)[0]
    services = list(re.finditer(r'^  ([a-z0-9-]+):$', section, re.M))
    blocks = {}
    for index, match in enumerate(services):
        end = services[index + 1].start() if index + 1 < len(services) else len(section)
        blocks[match.group(1)] = section[match.start():end]

    def networks(name):
        line = next(line for line in blocks[name].splitlines() if line.strip().startswith('networks:'))
        return {item.strip() for item in line.split('[', 1)[1].rstrip(']').split(',')}

    assert networks('id-api') == {'core', 'recursos', 'play', 'eduhoot', 'authentik'}
    assert networks('portal') == {'core', 'recursos', 'editors'}
    assert networks('admin') == {'core', 'recursos', 'eduhoot', 'authentik'}
    assert networks('recursos-api') == {'recursos', 'eduhoot'}
    assert networks('play') == {'play', 'recursos'}
    assert networks('eduhoot') == {'eduhoot', 'eduhoot-db'}
    assert networks('blocs') == {'editors'}
    assert networks('llibres') == {'editors'}
    assert networks('authentik-server') == {'authentik', 'authentik-db'}
    assert 'core' not in networks('blocs')
    assert 'core' not in networks('eduhoot')
    assert 'eduhoot' not in networks('portal')
    assert 'eduhoot-db' not in networks('admin')
    assert 'authentik-db' not in networks('admin')
