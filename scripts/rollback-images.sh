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

if [ "${ROLLBACK_SKIP_BACKUP:-0}" != "1" ]; then
  echo "== Backup de seguretat abans del rollback =="
  ./scripts/backup.sh
  ./scripts/backup-check.sh
else
  echo "== Rollback automatic: s'omet el backup de l'estat trencat =="
fi

echo "== Aplicant tags anteriors =="
python3 ./scripts/apply-update-tags.py --image-tag "$previous_image_tag" --eduhoot-tag "$previous_eduhoot_tag"
tags_changed=1

if [ "${ROLLBACK_SKIP_BACKUP:-0}" != "1" ]; then
  echo "== Comprovant imatges anteriors =="
  ./scripts/check-images.sh
fi

docker_cmd="${DOCKER:-docker}"
env_file=".env"
[ -f "$env_file" ] || env_file=".env.example"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"

previous_images_file="/tmp/edutictac-commons-rollback-images.$$.json"
previous_count="$(python3 - "$metadata" "$previous_images_file" <<'PYJSON'
import json
import sys
from pathlib import Path
data = json.loads(Path(sys.argv[1]).read_text())
images = data.get("previous_images") or {}
Path(sys.argv[2]).write_text(json.dumps(images, indent=2) + "\n")
print(len(images))
PYJSON
)"
previous_count="${previous_count:-0}"
pinned=0
if [ "$previous_count" -gt 0 ] && python3 ./scripts/image-digests.py pin --digests "$previous_images_file"; then
  pinned=1
  echo "S'han fixat $previous_count imatges als digests anteriors."
fi
rm -f "$previous_images_file"

if [ "$pinned" -eq 1 ]; then
  missing=0
  for image in $($compose config --images | sort -u); do
    $docker_cmd image inspect "$image" >/dev/null 2>&1 || missing=1
  done
  if [ "$missing" -ne 0 ]; then
    echo "Falten imatges dels digests anteriors; es farà servir el tag." >&2
    pinned=0
  fi
fi

if [ "$pinned" -eq 0 ]; then
  echo "== Descarregant imatges anteriors =="
  $compose pull
else
  echo "== Usant els digests anteriors (sense tornar a descarregar tags) =="
fi
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
