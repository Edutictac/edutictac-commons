#!/usr/bin/env python3
"""Guarda la clau publica age de les copies, sense guardar la privada."""

import argparse
import os
import re
import stat
import tempfile
from pathlib import Path

AGE_RECIPIENT = re.compile(r"^age1[0-9a-z]{20,}$")
MARKER_NAME = "backup-recipient"


def atomic_write(path, text, mode=None, owner=None):
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(prefix=f".{path.name}-", dir=path.parent)
    try:
        current = path.stat() if path.exists() else None
        file_mode = mode if mode is not None else stat.S_IMODE(current.st_mode)
        os.fchmod(descriptor, file_mode)
        if os.geteuid() == 0:
            if owner is not None:
                os.fchown(descriptor, *owner)
            elif current is not None:
                os.fchown(descriptor, current.st_uid, current.st_gid)
        with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
            stream.write(text)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def replace_setting(text, key, value):
    lines = text.splitlines()
    found = False
    for index, line in enumerate(lines):
        if line.startswith(key + "="):
            lines[index] = f"{key}={value}"
            found = True
    if not found:
        lines.append(f"{key}={value}")
    return "\n".join(lines) + "\n"


def set_recipient(root, recipient):
    recipient = recipient.strip()
    if not AGE_RECIPIENT.fullmatch(recipient):
        raise ValueError("invalid_recipient")
    root = Path(root)
    env_path = root / ".env"
    original = env_path.read_text(encoding="utf-8")
    metadata = env_path.stat()
    atomic_write(
        env_path,
        replace_setting(original, "BACKUP_AGE_RECIPIENT", recipient),
        stat.S_IMODE(metadata.st_mode),
        (metadata.st_uid, metadata.st_gid),
    )
    atomic_write(
        root / "data" / MARKER_NAME,
        recipient + "\n",
        0o644,
        (metadata.st_uid, metadata.st_gid),
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--recipient", required=True)
    parser.add_argument("--root", type=Path, default=None)
    args = parser.parse_args()
    root = args.root or Path(os.environ.get("REPO_DIR", Path(__file__).resolve().parents[1]))
    try:
        set_recipient(root, args.recipient)
    except ValueError:
        print("invalid_recipient", flush=True)
        raise SystemExit(2)
    except OSError:
        print("backup_key_save_failed", flush=True)
        raise SystemExit(1)
    print("recipient_saved", flush=True)


if __name__ == "__main__":
    main()
