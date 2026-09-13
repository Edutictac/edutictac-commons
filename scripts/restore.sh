#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

if [ "$#" -ne 1 ]; then
  echo "Usa: scripts/restore.sh backups/id-YYYYmmddTHHMMSSZ.db"
  exit 1
fi

backup="$1"
if [ ! -f "$backup" ]; then
  echo "No existeix la copia: $backup"
  exit 1
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

cp "$backup" data/id.db
rm -f data/id.db-wal data/id.db-shm

echo "Base restaurada des de: $backup"
echo "Arranca amb: make up"
