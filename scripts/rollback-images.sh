#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."
. ./scripts/operation-lock.sh

if [ "$#" -ne 1 ]; then
  echo "Usa: scripts/rollback-images.sh backups/commons-YYYYmmddTHHMMSSZ"
  exit 1
fi

backup_name="$1"
case "$backup_name" in
  commons-[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]T[0-9][0-9][0-9][0-9][0-9][0-9]Z) ;;
  *) echo "Backup invalid."; exit 1 ;;
esac

backup_dir="backups/$backup_name"
metadata="$backup_dir/update.json"
if [ ! -f "$metadata" ]; then
  echo "El backup no contiene tags anteriores de actualización: $backup_name"
  exit 1
fi

previous_image_tag="$(python3 - "$metadata" <<'PY'
import json, sys
print(json.load(open(sys.argv[1], encoding="utf-8"))["previous_image_tag"])
PY
)"
previous_eduhoot_tag="$(python3 - "$metadata" <<'PY'
import json, sys
print(json.load(open(sys.argv[1], encoding="utf-8"))["previous_eduhoot_tag"])
PY
)"

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi
current_image_tag="$(grep -E '^IMAGE_TAG=' "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
current_eduhoot_tag="$(grep -E '^EDUHOOT_TAG=' "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
tags_changed=0
restore_current_tags() {
  if [ "$tags_changed" = "1" ]; then
    python3 ./scripts/apply-update-tags.py --image-tag "$current_image_tag" --eduhoot-tag "$current_eduhoot_tag"
    echo "Tags actuals restaurats després de l'error."
  fi
}
cleanup() {
  status="$?"
  if [ "$status" -ne 0 ]; then restore_current_tags; fi
  exit "$status"
}
trap cleanup EXIT
trap 'exit 130' INT TERM

echo "== Backup de seguretat abans del rollback =="
./scripts/backup.sh
./scripts/backup-check.sh

echo "== Aplicant tags anteriors =="
python3 ./scripts/apply-update-tags.py --image-tag "$previous_image_tag" --eduhoot-tag "$previous_eduhoot_tag"
tags_changed=1

echo "== Comprovant imatges anteriors =="
./scripts/check-images.sh

docker_cmd="${DOCKER:-docker}"
env_file=".env"
[ -f "$env_file" ] || env_file=".env.example"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"
echo "== Descarregant imatges anteriors =="
$compose pull
echo "== Reiniciant stack amb imatges anteriors =="
$compose up -d --wait --no-build

portal_port="${PORTAL_PORT:-}"
if [ -z "$portal_port" ]; then portal_port="$(grep -E '^PORTAL_PORT=' "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"; fi
portal_port="${portal_port:-8082}"
curl -fsS "http://127.0.0.1:${portal_port}/api/health" >/dev/null
./scripts/test-flow.sh
tags_changed=0
trap - EXIT INT TERM
echo "Rollback completat a IMAGE_TAG=$previous_image_tag EDUHOOT_TAG=$previous_eduhoot_tag"
