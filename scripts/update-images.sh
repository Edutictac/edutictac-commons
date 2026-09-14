#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"

echo "== Backup previ obligatori =="
./scripts/backup.sh

echo
echo "== Verificacio del backup =="
./scripts/backup-check.sh

echo
echo "== Comprovacio d'imatges remotes =="
./scripts/check-images.sh

echo
echo "== Descarregant imatges =="
$compose pull

echo
echo "== Reiniciant stack amb imatges descarregades =="
$compose up -d --wait --no-build

echo
echo "== Comprovant salut del portal =="
if [ -n "${PORTAL_PORT+x}" ]; then
  portal_port="$PORTAL_PORT"
else
  portal_port="$(grep -E '^PORTAL_PORT=' "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
fi
portal_port="${portal_port:-8082}"
curl -fsS "http://127.0.0.1:${portal_port}/api/health" >/dev/null
echo "OK portal saludable"

echo
echo "== Flux funcional =="
./scripts/test-flow.sh

echo
echo "Actualitzacio d'imatges completa i verificada."
