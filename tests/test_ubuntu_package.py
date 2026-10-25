"""Validate installer configuration without invoking systemd or touching the host."""
import os
from pathlib import Path
import subprocess
import sys


def configure(path, existing=False):
    source = (Path(__file__).parents[1] / "packaging/debian/postinst").read_text()
    block = source.split("<<'PY'\n", 1)[1].split("\nPY", 1)[0]
    result = subprocess.run([sys.executable, "-", str(path), str(os.getuid()), str(os.getgid()), "1" if existing else "0"],
                            input=block, capture_output=True, text=True)
    # stdout contains the synthetic activation code: do not include it in diagnostics.
    assert result.returncode == 0
    return dict(line.split("=", 1) for line in path.read_text().splitlines() if "=" in line and not line.startswith("#"))


def test_fresh_install_uses_selector_release_images(tmp_path):
    path = tmp_path / "test.env"
    path.touch(mode=0o600)
    values = configure(path)
    assert values["IMAGE_TAG"] == (Path(__file__).parents[1] / "VERSION").read_text().strip()
    assert values["ADMIN_TAG"] == (Path(__file__).parents[1] / "VERSION").read_text().strip()
    assert values["COMPOSE_PROFILES"] == "authentik"
    assert values["MODULES_CONFIGURED"] == "0"
    assert values.get("QUIOSC_MODE", "disabled") == "disabled"
    assert values["RECURSOS_CENTRAL_SESSION"] == "1"


def test_upgrade_keeps_explicit_independent_bank_login(tmp_path):
    path = tmp_path / "test.env"
    path.write_text("RECURSOS_CENTRAL_SESSION=0\n")
    assert configure(path, existing=True)["RECURSOS_CENTRAL_SESSION"] == "0"


def test_installer_sets_the_bank_portal_url_without_replacing_custom_hosts(tmp_path):
    source = (Path(__file__).parents[1] / "packaging/debian/postinst").read_text()
    blocks = source.split("<<'PY'\n")
    # The public URL configuration block follows the secret generation block.
    block = next(part.split("\nPY", 1)[0] for part in blocks[2:]
                 if '"RECURSOS_COMMONS_URL": portal_base' in part.split("\nPY", 1)[0])
    path = tmp_path / "test.env"
    for port in ("80", "8082"):
        path.write_text(f"PORTAL_PORT={port}\nEDUTICTAC_MDNS_NAME=aula\n")
        result = subprocess.run([sys.executable, "-", str(path)], input=block, capture_output=True, text=True)
        assert result.returncode == 0
        expected = "http://aula.local" + (":8082" if port == "8082" else "")
        assert f"RECURSOS_COMMONS_URL={expected}\n" in path.read_text()
    path.write_text("RECURSOS_COMMONS_URL=https://commons.centre.test\n")
    result = subprocess.run([sys.executable, "-", str(path)], input=block, capture_output=True, text=True)
    assert result.returncode == 0
    assert "RECURSOS_COMMONS_URL=https://commons.centre.test\n" in path.read_text()


def test_upgrade_preserves_configured_images_and_activation_state(tmp_path):
    path = tmp_path / "test.env"
    path.write_text("IMAGE_TAG=0.1.1-alpha24\nADMIN_TAG=0.1.1-alpha22\n"
                    "QUIOSC_MODE=disabled\nEDUTICTAC_SETUP_TOKEN=synthetic-retained-code\n")
    values = configure(path, existing=True)
    assert values["IMAGE_TAG"] == "0.1.1-alpha24"
    assert values["ADMIN_TAG"] == "0.1.1-alpha22"
    assert values["QUIOSC_MODE"] == "disabled"
    assert values["EDUTICTAC_SETUP_TOKEN"] == "synthetic-retained-code"
    assert set(values["COMPOSE_PROFILES"].split(",")) == {"authentik", "play"}
    assert values["MODULES_CONFIGURED"] == "1"


def test_upgrade_preserves_existing_optional_services_and_explicit_selection(tmp_path):
    path = tmp_path / "test.env"
    path.write_text("COMPOSE_PROFILES=authentik,eduhoot,recursos\n")
    values = configure(path, existing=True)
    assert set(values["COMPOSE_PROFILES"].split(",")) == {"authentik", "play", "eduhoot", "recursos"}
    path.write_text("COMPOSE_PROFILES=authentik,recursos\nMODULES_CONFIGURED=1\n")
    values = configure(path, existing=True)
    assert values["COMPOSE_PROFILES"] == "authentik,recursos"


def test_fresh_install_from_example_starts_only_core(tmp_path):
    path = tmp_path / "test.env"
    path.write_text((Path(__file__).parents[1] / ".env.example").read_text())
    values = configure(path)
    assert values["COMPOSE_PROFILES"] == "authentik"
    assert values["MODULES_CONFIGURED"] == "0"
    assert values["IMAGE_TAG"] == (Path(__file__).parents[1] / "VERSION").read_text().strip()
    assert values["ADMIN_TAG"] == (Path(__file__).parents[1] / "VERSION").read_text().strip()


def test_installer_announces_real_portal_port():
    # En LliureX el port 80 és d'Apache: Commons passa al 8082 i ha d'anunciar-ho.
    postinst = (Path(__file__).parents[1] / "packaging/debian/postinst").read_text(encoding="utf-8")
    assert 'portal_url="http://${primary_host}${url_suffix}/"' in postinst
    assert 'ip_url="http://${ip}${url_suffix}/"' in postinst
    assert "Obri ${bold}${portal_url}${reset}" in postinst
    assert "obri ${bold}${ip_url}${reset}" in postinst
    assert 'sed -i "s#^Exec=.*#Exec=edutictac-commons-open#" "$desktop_file"' in postinst
    assert 'portal_port="${portal_port:-80}"' in postinst
    assert 'url_suffix=":${portal_port}"' in postinst


def test_installer_gives_service_user_docker_and_linger_only_if_admin():
    # LliureX: uid 1000 no està en el grup docker i les tasques del panell fallaven.
    postinst = (Path(__file__).parents[1] / "packaging/debian/postinst").read_text(encoding="utf-8")
    assert 'usermod -aG docker "$service_user"' in postinst
    assert 'loginctl enable-linger "$service_user"' in postinst
    assert '[ "$service_user" = "${SUDO_USER:-}" ]' in postinst
    assert "grep -qx -E 'sudo|admin'" in postinst


def test_database_images_are_pinned_to_tested_release_digests():
    import json
    root = Path(__file__).parents[1]
    release = json.loads((root / 'releases/0.1.1-beta1/images.json').read_text())
    compose = (root / 'compose.yml').read_text()
    assert 'image: ' + release['images']['authentik-postgresql'] in compose
    assert 'image: ' + release['images']['eduhoot-mongo'] in compose


def test_backup_encryption_is_required_on_fresh_install_and_upgrade(tmp_path):
    for existing in (False, True):
        path = tmp_path / ("upgrade.env" if existing else "fresh.env")
        path.touch(mode=0o600)
        values = configure(path, existing=existing)
        assert values["BACKUP_ENCRYPTION_REQUIRED"] == "1"
        assert values["EDUTICTAC_ENV"] == "production"
        assert all(len(values[name]) >= 24 for name in
                   ("PLAY_ID_APP_TOKEN", "RECURSOS_ID_APP_TOKEN", "EDUHOOT_ID_APP_TOKEN"))


def test_installer_preserves_external_backup_key_configuration(tmp_path):
    path = tmp_path / "existing.env"
    path.write_text("BACKUP_ENCRYPTION_REQUIRED=1\nBACKUP_AGE_RECIPIENT=age-public-fixture\n")
    values = configure(path, existing=True)
    assert values["BACKUP_ENCRYPTION_REQUIRED"] == "1"
    assert values["BACKUP_AGE_RECIPIENT"] == "age-public-fixture"


def test_fresh_install_uses_installer_tags_over_copied_template(tmp_path):
    path = tmp_path / "fresh-template.env"
    path.write_text("IMAGE_TAG=template\nADMIN_TAG=template\nRECURSOS_TAG=template\n")
    expected = (Path(__file__).parents[1] / "VERSION").read_text().strip()
    values = configure(path, existing=False)
    assert all(values[name] == expected for name in ("IMAGE_TAG", "ADMIN_TAG", "RECURSOS_TAG"))


def test_user_config_block_writes_real_lines(tmp_path):
    source = (Path(__file__).parents[1] / "packaging/debian/postinst").read_text()
    block = source.split('python3 - "$ENV_FILE" "$user_config" <<\'PY\'\n', 1)[1].split("\nPY", 1)[0]
    path = tmp_path / ".env"
    path.write_text("EDUTICTAC_ENV=production\n")
    result = subprocess.run([sys.executable, "-", str(path), str(tmp_path / ".config")],
                            input=block, capture_output=True, text=True)
    assert result.returncode == 0
    lines = path.read_text().splitlines()
    assert "EDUTICTAC_ENV=production" in lines
    assert "EDUTICTAC_USER_CONFIG_HOME=" + str(tmp_path / ".config") in lines
    assert "\\n" not in path.read_text()
