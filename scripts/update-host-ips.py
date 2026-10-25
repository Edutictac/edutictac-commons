#!/usr/bin/env python3
"""Actualitza les IP locals exactes que poden entrar al panell d'administracio."""

import argparse
import ipaddress
import os
import stat
import subprocess
import sys
import tempfile
from pathlib import Path

KEY = "EDUTICTAC_HOST_IPS"


def parse_addresses(output):
    addresses = []
    for line in output.splitlines():
        fields = line.split()
        for marker in ("inet", "inet6"):
            if marker in fields:
                index = fields.index(marker) + 1
                if index < len(fields):
                    try:
                        address = ipaddress.ip_address(fields[index].split("/", 1)[0].split("%", 1)[0])
                    except ValueError:
                        continue
                    if address.is_loopback or address.is_link_local or address.is_multicast or address.is_unspecified:
                        continue
                    addresses.append(address)
                break
    return addresses


def collect_addresses():
    try:
        output = subprocess.run(
            ["ip", "-o", "addr", "show", "scope", "global"],
            capture_output=True, text=True, timeout=10, check=False,
        ).stdout
    except (OSError, subprocess.TimeoutExpired):
        return []
    addresses = parse_addresses(output)
    public_host = os.environ.get("EDUTICTAC_PUBLIC_HOST", "").strip().strip("[]")
    if public_host:
        try:
            addresses.append(ipaddress.ip_address(public_host))
        except ValueError:
            pass
    unique = {str(address): address for address in addresses}
    return [unique[key] for key in sorted(unique, key=lambda value: (unique[value].version, value))]


def replace_setting(text, value):
    lines = text.splitlines()
    found = False
    for index, line in enumerate(lines):
        if line.startswith(KEY + "="):
            lines[index] = f"{KEY}={value}"
            found = True
    if not found:
        lines.append(f"{KEY}={value}")
    return "\n".join(lines) + "\n"


def atomic_write(path, text, metadata):
    descriptor, temporary = tempfile.mkstemp(prefix=f".{path.name}-", dir=path.parent)
    try:
        os.fchmod(descriptor, stat.S_IMODE(metadata.st_mode))
        if os.geteuid() == 0:
            os.fchown(descriptor, metadata.st_uid, metadata.st_gid)
        with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
            stream.write(text)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def update(root, addresses):
    env_path = Path(root) / ".env"
    metadata = env_path.stat()
    value = ",".join(str(address) for address in addresses)
    original = env_path.read_text(encoding="utf-8")
    updated = replace_setting(original, value)
    if updated == original:
        return False
    atomic_write(env_path, updated, metadata)
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=None)
    args = parser.parse_args()
    root = args.root or Path(os.environ.get("REPO_DIR", Path(__file__).resolve().parents[1]))
    try:
        addresses = collect_addresses()
        if addresses:
            update(root, addresses)
    except OSError as error:
        print(f"host_ips: {error}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
