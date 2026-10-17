"""Validate installer configuration without invoking systemd or touching the host."""
import os
from pathlib import Path
import subprocess
import sys


def configure(path):
    source = (Path(__file__).parents[1] / "packaging/debian/postinst").read_text()
    block = source.split("<<'PY'\n", 1)[1].split("\nPY", 1)[0]
    result = subprocess.run([sys.executable, "-", str(path), str(os.getuid()), str(os.getgid())],
                            input=block, capture_output=True, text=True)
    # stdout contains the synthetic activation code: do not include it in diagnostics.
    assert result.returncode == 0
    return dict(line.split("=", 1) for line in path.read_text().splitlines() if "=" in line and not line.startswith("#"))


def test_fresh_install_uses_published_images(tmp_path):
    path = tmp_path / "test.env"
    path.touch(mode=0o600)
    values = configure(path)
    assert values["IMAGE_TAG"] == "0.1.1-alpha25"
    assert values["ADMIN_TAG"] == "0.1.1-alpha25"
    assert values["COMPOSE_PROFILES"] == "authentik,eduhoot,recursos"
    assert values.get("QUIOSC_MODE", "disabled") == "disabled"


def test_upgrade_preserves_configured_images_and_activation_state(tmp_path):
    path = tmp_path / "test.env"
    path.write_text("IMAGE_TAG=0.1.1-alpha24\nADMIN_TAG=0.1.1-alpha22\n"
                    "QUIOSC_MODE=disabled\nEDUTICTAC_SETUP_TOKEN=synthetic-retained-code\n")
    values = configure(path)
    assert values["IMAGE_TAG"] == "0.1.1-alpha24"
    assert values["ADMIN_TAG"] == "0.1.1-alpha22"
    assert values["QUIOSC_MODE"] == "disabled"
    assert values["EDUTICTAC_SETUP_TOKEN"] == "synthetic-retained-code"
