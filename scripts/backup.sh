#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

lock_acquired=0
tmp_dir=""
cleanup() {
  if [ -n "$tmp_dir" ] && [ -d "$tmp_dir" ]; then
    rm -rf "$tmp_dir"
  fi
  if [ "$lock_acquired" = "1" ]; then
    rmdir "$lock_dir" 2>/dev/null || true
  fi
}

if [ "${BACKUP_LOCK_HELD:-0}" != "1" ]; then
  mkdir -p backups
  lock_dir="${BACKUP_LOCK_DIR:-backups/.backup.lock}"
  if ! mkdir "$lock_dir" 2>/dev/null; then
    echo "Un altre backup o neteja de backups esta en marxa: $lock_dir"
    exit 1
  fi
  lock_acquired=1
  trap cleanup EXIT
  trap 'cleanup; exit 130' INT TERM
  BACKUP_LOCK_HELD=1
  export BACKUP_LOCK_HELD
fi

src="data/id.db"
if [ ! -f "$src" ]; then
  echo "No hi ha base de dades en $src"
  exit 1
fi

if [ -n "${COMPOSE_PROFILES+x}" ]; then
  profiles="$COMPOSE_PROFILES"
else
  env_file=".env"
  if [ ! -f "$env_file" ]; then
    env_file=".env.example"
  fi
  profiles="$(grep -E '^COMPOSE_PROFILES=' "$env_file" 2>/dev/null | cut -d= -f2- || true)"
fi

eduhoot_active=0
case ",${profiles}," in
  *,eduhoot,*) eduhoot_active=1 ;;
esac

warning=""
eduhoot_covered=0
docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose -f compose.yml"

if [ "$eduhoot_active" = "1" ]; then
  mongo_state="$($compose ps --status running --format '{{.Service}}' 2>/dev/null | grep -x eduhoot-mongo || true)"
  if [ -z "$mongo_state" ]; then
    warning="eduhoot actiu (COMPOSE_PROFILES=eduhoot) pero eduhoot-mongo no esta en marxa: no s'ha pogut fer backup de data/eduhoot-mongo, data/eduhoot-uploads, data/eduhoot-logs"
  else
    eduhoot_covered=1
  fi
fi

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
dest_dir="backups/commons-${stamp}"
while [ -e "$dest_dir" ]; do
  sleep 1
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  dest_dir="backups/commons-${stamp}"
done
tmp_dir="${dest_dir}.tmp.$$"
mkdir -p "${tmp_dir}/id-api"
dest_db="${tmp_dir}/id-api/id.db"

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

if [ "$eduhoot_covered" = "1" ]; then
  mkdir -p "${tmp_dir}/eduhoot"
  $compose exec -T eduhoot-mongo mongodump --quiet --archive --db=kahootDB > "${tmp_dir}/eduhoot/mongo.archive"
  tar -C data -cf "${tmp_dir}/eduhoot/uploads.tar" eduhoot-uploads
  tar -C data -cf "${tmp_dir}/eduhoot/logs.tar" eduhoot-logs
fi

stack_version="$(cat VERSION 2>/dev/null || echo unknown)"

python3 - "$tmp_dir" "$stack_version" "$warning" "$eduhoot_covered" <<'PY'
import hashlib
import json
import os
import sys
from datetime import datetime, timezone

dest_dir, stack_version, warning, eduhoot_covered = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4] == "1"


def checksum(rel_path):
    full_path = os.path.join(dest_dir, rel_path)
    sha256 = hashlib.sha256()
    with open(full_path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            sha256.update(chunk)
    return f"sha256:{sha256.hexdigest()}"


id_api_db = "id-api/id.db"
services = [
    {
        "name": "id-api",
        "status": "ok",
        "paths": [id_api_db],
        "checksums": {id_api_db: checksum(id_api_db)},
    }
]

if eduhoot_covered:
    eduhoot_paths = ["eduhoot/mongo.archive", "eduhoot/uploads.tar", "eduhoot/logs.tar"]
    services.append(
        {
            "name": "eduhoot",
            "status": "ok",
            "paths": eduhoot_paths,
            "checksums": {p: checksum(p) for p in eduhoot_paths},
        }
    )

manifest = {
    "manifest_version": 1,
    "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "stack_version": stack_version,
    "services": services,
    "warnings": [warning] if warning else [],
}

with open(os.path.join(dest_dir, "manifest.json"), "w") as f:
    json.dump(manifest, f, indent=2)
    f.write("\n")
PY

mv "$tmp_dir" "$dest_dir"

echo "Copia creada: $dest_dir"
if [ -n "$warning" ]; then
  echo "Avís: $warning"
fi
