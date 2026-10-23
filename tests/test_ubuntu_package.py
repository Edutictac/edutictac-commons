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
    assert 'portal_url="http://edutictac.local:${portal_port}/"' in postinst
    assert "Obri ${bold}${portal_url}${reset}" in postinst
    assert "obri ${portal_url}'" in postinst
    assert 'sed -i "s#^Exec=xdg-open .*#Exec=xdg-open ${portal_url}#"' in postinst
    assert "http://edutictac.local/${reset}" not in postinst


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
