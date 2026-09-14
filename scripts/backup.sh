#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

src="data/id.db"
if [ ! -f "$src" ]; then
  echo "No hi ha base de dades en $src"
  exit 1
fi

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi
profiles="$(grep -E '^COMPOSE_PROFILES=' "$env_file" 2>/dev/null | cut -d= -f2- || true)"

warning=""
case ",${profiles}," in
  *,eduhoot,*)
    warning="eduhoot actiu (COMPOSE_PROFILES=eduhoot) pero sense cobertura de backup: data/eduhoot-mongo, data/eduhoot-uploads, data/eduhoot-logs"
    ;;
esac

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
dest_dir="backups/commons-${stamp}"
mkdir -p "${dest_dir}/id-api"
dest_db="${dest_dir}/id-api/id.db"

python3 - "$src" "$dest_db" <<'PY'
import sqlite3
import sys

source_path, dest_path = sys.argv[1], sys.argv[2]
source = sqlite3.connect(source_path)
dest = sqlite3.connect(dest_path)
try:
    source.backup(dest)
finally:
    dest.close()
    source.close()
PY

stack_version="$(cat VERSION 2>/dev/null || echo unknown)"

python3 - "$dest_dir" "$stack_version" "$warning" <<'PY'
import hashlib
import json
import os
import sys
from datetime import datetime, timezone

dest_dir, stack_version, warning = sys.argv[1], sys.argv[2], sys.argv[3]

db_rel = "id-api/id.db"
db_path = os.path.join(dest_dir, db_rel)
sha256 = hashlib.sha256()
with open(db_path, "rb") as f:
    for chunk in iter(lambda: f.read(65536), b""):
        sha256.update(chunk)

manifest = {
    "manifest_version": 1,
    "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "stack_version": stack_version,
    "services": [
        {
            "name": "id-api",
            "status": "ok",
            "paths": [db_rel],
            "checksums": {db_rel: f"sha256:{sha256.hexdigest()}"},
        }
    ],
    "warnings": [warning] if warning else [],
}

with open(os.path.join(dest_dir, "manifest.json"), "w") as f:
    json.dump(manifest, f, indent=2)
    f.write("\n")
PY

echo "Copia creada: $dest_dir"
if [ -n "$warning" ]; then
  echo "Avís: $warning"
fi
