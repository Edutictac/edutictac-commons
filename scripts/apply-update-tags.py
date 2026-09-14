#!/usr/bin/env python3
"""Apply IMAGE_TAG/EDUHOOT_TAG values to .env without printing secrets."""

from __future__ import annotations

import argparse
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT / ".env"


def update_env(values: dict[str, str]) -> None:
    lines = ENV_FILE.read_text().splitlines() if ENV_FILE.is_file() else []
    seen: set[str] = set()
    out: list[str] = []
    for line in lines:
        if "=" not in line or line.lstrip().startswith("#"):
            out.append(line)
            continue
        key, _ = line.split("=", 1)
        if key in values:
            out.append(f"{key}={values[key]}")
            seen.add(key)
        else:
            out.append(line)
    for key, value in values.items():
        if key not in seen:
            out.append(f"{key}={value}")
    ENV_FILE.write_text("\n".join(out) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--image-tag", default="")
    parser.add_argument("--eduhoot-tag", default="")
    args = parser.parse_args()
    values = {}
    if args.image_tag:
        values["IMAGE_TAG"] = args.image_tag
    if args.eduhoot_tag:
        values["EDUHOOT_TAG"] = args.eduhoot_tag
    if values:
        update_env(values)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
