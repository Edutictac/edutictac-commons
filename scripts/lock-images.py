#!/usr/bin/env python3
"""Registra els digests publicats i els commits font d'una entrega."""

import argparse
import json
from pathlib import Path
import subprocess


def output(command, cwd=None):
    return subprocess.check_output(command, cwd=cwd, text=True).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", default="registry.edutictac.es/edutictac")
    parser.add_argument("--eduhoot-source", type=Path, required=True)
    parser.add_argument("--eduhoot-tag", default="1.0.2")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    version = (root / "VERSION").read_text().strip()
    images = {}
    platforms = {}
    refs = {
        "id-api": f"{args.registry}/commons-id-api:{version}",
        "portal": f"{args.registry}/commons-portal:{version}",
        "admin": f"{args.registry}/commons-admin:{version}",
        "eduhoot": f"{args.registry}/eduhoot:{args.eduhoot_tag}",
        "eduhoot-mongo": "mongo:7",
    }
    for name, ref in refs.items():
        info = json.loads(output(["docker", "image", "inspect", ref]))[0]
        repository = ref.rsplit(":", 1)[0]
        digest = next((item for item in info["RepoDigests"] if item.startswith(repository + "@")), None)
        if not digest:
            raise SystemExit(f"Falta digest publicat per a {ref}")
        images[name] = digest
        platforms[name] = f"{info['Os']}/{info['Architecture']}"
    manifest = {
        "version": version,
        "eduhoot_version": args.eduhoot_tag,
        "source_revisions": {
            "commons": output(["git", "rev-parse", "HEAD"], root),
            "eduhoot": output(["git", "rev-parse", "HEAD"], args.eduhoot_source),
        },
        "images": images,
        "platforms": platforms,
    }
    destination = root / "releases" / version
    destination.mkdir(parents=True, exist_ok=True)
    (destination / "images.json").write_text(json.dumps(manifest, indent=2) + "\n")
    override = {"services": {name: {"image": image} for name, image in images.items()}}
    (destination / "compose.images.json").write_text(json.dumps(override, indent=2) + "\n")
    print(f"Manifest i override generats en releases/{version}")


if __name__ == "__main__":
    main()
