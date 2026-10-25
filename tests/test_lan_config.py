"""LAN/mDNS and IP fallback configuration."""

from pathlib import Path

ROOT = Path(__file__).parents[1]


def test_installer_limits_avahi_to_physical_interfaces_and_supports_ip():
    text = (ROOT / 'packaging/debian/postinst').read_text()
    assert 'EDUTICTAC_PUBLIC_HOST' in text
    assert 'allow-interfaces=' in text
    assert 'docker' in text and 'br-' in text and 'veth' in text


def test_lan_doctor_and_docs_exist():
    assert (ROOT / 'scripts/lan-doctor.sh').is_file()
    docs = (ROOT / 'docs/LAN-SENSE-INTERNET.md').read_text()
    assert 'EDUTICTAC_PUBLIC_HOST' in docs
    assert 'mDNS' in docs
    assert 'IP' in docs

def test_desktop_icon_uses_runtime_launcher_and_installer_prints_ip():
    desktop = (ROOT / 'packaging/debian/edutictac-commons.desktop').read_text()
    postinst = (ROOT / 'packaging/debian/postinst').read_text()
    build = (ROOT / 'packaging/build-deb.sh').read_text()
    assert 'Exec=edutictac-commons-open' in desktop
    assert 'packaging/edutictac-commons-open.sh' in build
    assert 'Accés per IP:' in postinst
    assert 'allow-interfaces=' in postinst


def test_launcher_falls_back_to_ip(tmp_path):
    import os
    import subprocess
    env_file = tmp_path / '.env'
    env_file.write_text('PORTAL_PORT=8082\nEDUTICTAC_MDNS_NAME=edutictac\nEDUTICTAC_PUBLIC_HOST=\n')
    bin_dir = tmp_path / 'bin'
    bin_dir.mkdir()
    curl = bin_dir / 'curl'
    curl.write_text('#!/bin/sh\ncase "$*" in *192.0.2.10*) exit 0;; *) exit 1;; esac\n')
    curl.chmod(0o755)
    opened = tmp_path / 'opened'
    xdg = bin_dir / 'xdg-open'
    xdg.write_text('#!/bin/sh\nprintf "%s\\n" "$1" > "' + str(opened) + '"\n')
    xdg.chmod(0o755)
    env = os.environ.copy()
    env['PATH'] = str(bin_dir) + ':' + env['PATH']
    env['EDUTICTAC_ENV_FILE'] = str(env_file)
    env['EDUTICTAC_OPEN_IP'] = '192.0.2.10'
    subprocess.run([str(ROOT / 'packaging/edutictac-commons-open.sh')], check=True, env=env, timeout=10)
    for _ in range(20):
        if opened.exists():
            break
        import time; time.sleep(0.05)
    assert opened.read_text().strip() == 'http://192.0.2.10:8082/'


def test_installer_guide_documents_url_ip_icon_and_port():
    guide = (ROOT / 'docs/INSTALACION-RAPIDA.md').read_text()
    assert 'edutictac-commons-open' in guide
    assert 'Accés per IP' in guide
    assert 'PORTAL_PORT' in guide
    assert 'escritorio' in guide


def test_installer_repairs_the_service_user_systemd_directory():
    postinst = (ROOT / 'packaging/debian/postinst').read_text()
    compose = (ROOT / 'compose.yml').read_text()
    assert 'EDUTICTAC_USER_CONFIG_HOME' in postinst
    assert 'chown "$target_uid:$target_gid" "$user_config" "$user_config/systemd" "$user_config/systemd/user"' in postinst
    assert 'EDUTICTAC_USER_CONFIG_HOME:-${XDG_CONFIG_HOME:-$HOME/.config}' in compose
    assert 'EDUTICTAC_USER_CONFIG_HOME=' in (ROOT / '.env.example').read_text()
