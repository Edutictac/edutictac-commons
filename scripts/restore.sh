#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

mkdir -p backups
lock_dir="${BACKUP_LOCK_DIR:-backups/.backup.lock}"
if ! mkdir "$lock_dir" 2>/dev/null; then
  echo "Un altre backup, restauracio o neteja de backups esta en marxa: $lock_dir"
  exit 1
fi
trap 'rmdir "$lock_dir" 2>/dev/null || true' EXIT
trap 'rmdir "$lock_dir" 2>/dev/null || true; exit 130' INT TERM

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

docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"

$compose down

mkdir -p data backups
if [ -f data/id.db ]; then
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  cp data/id.db "backups/id-before-restore-${stamp}.db"
  echo "Copia de seguretat previa: backups/id-before-restore-${stamp}.db"
fi

cp "$backup_db" data/id.db
rm -f data/id.db-wal data/id.db-shm

echo "Base restaurada des de: $backup_dir"

echo
echo "Arrancant serveis..."
$compose up -d --wait

echo
echo "Comprovant salut dels serveis..."
portal_port="$(grep -E '^PORTAL_PORT=' "$env_file" 2>/dev/null | tail -n1 | cut -d= -f2)"
portal_port="${portal_port:-8082}"
curl -fsS "http://127.0.0.1:${portal_port}/api/health" >/dev/null
echo "OK portal saludable"

echo
echo "Executant make test-flow..."
./scripts/test-flow.sh

echo
echo "Restauracio completa i verificada."
