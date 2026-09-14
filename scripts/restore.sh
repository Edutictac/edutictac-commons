#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

if [ "$#" -ne 1 ]; then
  echo "Usa: scripts/restore.sh backups/commons-YYYYmmddTHHMMSSZ/"
  exit 1
fi

backup_dir="${1%/}"
manifest="${backup_dir}/manifest.json"
backup_db="${backup_dir}/id-api/id.db"

if [ ! -f "$manifest" ]; then
  echo "No existeix el manifest: $manifest"
  exit 1
fi
if [ ! -f "$backup_db" ]; then
  echo "No existeix la base de dades del backup: $backup_db"
  exit 1
fi

stack_version="$(cat VERSION 2>/dev/null || echo unknown)"
backup_version="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("stack_version", "unknown"))' "$manifest")"
if [ "$backup_version" != "$stack_version" ]; then
  echo "Avís: el backup és de la versió ${backup_version}, l'stack actual és ${stack_version}"
fi

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

${DOCKER:-docker} compose --env-file "$env_file" -f compose.yml down

mkdir -p data backups
if [ -f data/id.db ]; then
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  cp data/id.db "backups/id-before-restore-${stamp}.db"
fi

cp "$backup_db" data/id.db
rm -f data/id.db-wal data/id.db-shm

echo "Base restaurada des de: $backup_dir"
echo "Arranca amb: make up"
