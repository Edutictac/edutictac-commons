#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"
previous_image_tag="$(grep -E '^IMAGE_TAG=' "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
previous_eduhoot_tag="$(grep -E '^EDUHOOT_TAG=' "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
tags_changed=0

restore_tags() {
  if [ "$tags_changed" = "1" ]; then
    python3 ./scripts/apply-update-tags.py \
      --image-tag "$previous_image_tag" \
      --eduhoot-tag "$previous_eduhoot_tag"
    echo "Tags restaurats en .env per error durant l'actualitzacio."
  fi
}

cleanup_update() {
  status="$?"
  rm -f /tmp/edutictac-commons-updates.$$.json
  if [ "$status" -ne 0 ]; then
    restore_tags
  fi
  exit "$status"
}
trap cleanup_update EXIT
trap 'exit 130' INT TERM

echo "== Backup previ obligatori =="
./scripts/backup.sh

echo
echo "== Verificacio del backup =="
./scripts/backup-check.sh

echo
echo "== Deteccio de versions disponibles =="
updates_json="$(python3 ./scripts/check-updates.py --json)"
printf '%s\n' "$updates_json" > /tmp/edutictac-commons-updates.$$.json
python3 ./scripts/check-updates.py

next_image_tag="$(python3 - /tmp/edutictac-commons-updates.$$.json <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
commons = data.get("commons") or {}
print(commons.get("candidate") if commons.get("update_available") else "")
PY
)"
next_eduhoot_tag="$(python3 - /tmp/edutictac-commons-updates.$$.json <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
eduhoot = data.get("eduhoot") or {}
print(eduhoot.get("candidate") if eduhoot.get("update_available") else "")
PY
)"
rm -f /tmp/edutictac-commons-updates.$$.json

if [ -n "$next_image_tag" ] || [ -n "$next_eduhoot_tag" ]; then
  echo "Aplicant tags nous en .env..."
  python3 ./scripts/apply-update-tags.py \
    --image-tag "$next_image_tag" \
    --eduhoot-tag "$next_eduhoot_tag"
  tags_changed=1
else
  echo "No hi ha tags mes recents en el canal configurat; es refresquen les imatges actuals."
fi

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

tags_changed=0
trap - EXIT INT TERM
echo
echo "Actualitzacio d'imatges completa i verificada."
