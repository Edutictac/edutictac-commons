#!/usr/bin/env python3
"""Apply IMAGE_TAG/ADMIN_TAG/EDUHOOT_TAG/RECURSOS_TAG values to .env without printing secrets."""

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
    parser.add_argument("--recursos-tag", default="")
    args = parser.parse_args()
    values = {}
    if args.image_tag:
        # commons-admin es publica sempre junt amb id-api/portal/play (mateix
        # tag, veure push-images.sh), aixi que ADMIN_TAG seguix IMAGE_TAG en
        # el flux normal d'actualitzacio/rollback. Qui vullga fixar l'admin
        # a una versio propia pot editar ADMIN_TAG a ma en .env despres.
        values["IMAGE_TAG"] = args.image_tag
        values["ADMIN_TAG"] = args.image_tag
    if args.eduhoot_tag:
        values["EDUHOOT_TAG"] = args.eduhoot_tag
    if args.recursos_tag:
        # recursos i recursos-api es publiquen sempre junts amb el mateix
        # tag (veure push-images.sh), per aixo comparteixen RECURSOS_TAG.
        values["RECURSOS_TAG"] = args.recursos_tag
    if values:
        update_env(values)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
