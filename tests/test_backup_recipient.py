import importlib.util
import stat
from pathlib import Path

import pytest

ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location("set_backup_recipient", ROOT / "scripts/set-backup-recipient.py")
recipient = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(recipient)

PUBLIC_KEY = "age1" + "q" * 58


def test_saves_only_the_public_key_and_keeps_private_settings(tmp_path):
    (tmp_path / "data").mkdir()
    env = tmp_path / ".env"
    env.write_text("BACKUP_ENCRYPTION_REQUIRED=1\nBACKUP_AGE_RECIPIENT=\nPRIVATE_SETTING=synthetic-keep\n")
    env.chmod(0o600)
    recipient.set_recipient(tmp_path, PUBLIC_KEY)
    text = env.read_text()
    assert f"BACKUP_AGE_RECIPIENT={PUBLIC_KEY}\n" in text
    assert "PRIVATE_SETTING=synthetic-keep\n" in text
    assert stat.S_IMODE(env.stat().st_mode) == 0o600
    marker = tmp_path / "data" / "backup-recipient"
    assert marker.read_text() == PUBLIC_KEY + "\n"
    assert stat.S_IMODE(marker.stat().st_mode) == 0o644


def test_rejects_a_recipient_without_age_format(tmp_path):
    env = tmp_path / ".env"
    env.write_text("BACKUP_AGE_RECIPIENT=\n")
    with pytest.raises(ValueError):
        recipient.set_recipient(tmp_path, "not-an-age-key")
    assert "BACKUP_AGE_RECIPIENT=\n" in env.read_text()
    assert not (tmp_path / "data" / "backup-recipient").exists()
