#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."
. ./scripts/operation-lock.sh

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"
previous_image_tag="$(grep -E '^IMAGE_TAG=' "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
previous_eduhoot_tag="$(grep -E '^EDUHOOT_TAG=' "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
previous_recursos_tag="$(grep -E '^RECURSOS_TAG=' "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
tags_changed=0

restore_tags() {
  if [ "$tags_changed" = "1" ]; then
    python3 ./scripts/apply-update-tags.py \
      --image-tag "$previous_image_tag" \
      --eduhoot-tag "$previous_eduhoot_tag" \
      --recursos-tag "$previous_recursos_tag"
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

update_backup="$(python3 - <<'PY'
from pathlib import Path

backups = sorted((path for path in Path("backups").glob("commons-*") if path.is_dir()), reverse=True)
print(backups[0].name if backups else "")
PY
)"
if [ -z "$update_backup" ]; then
  echo "No s'ha pogut identificar el backup creat per a l'actualització."
  exit 1
fi
previous_image_tag="${previous_image_tag:-$(cat VERSION)}"
previous_eduhoot_tag="${previous_eduhoot_tag:-1.0.2}"
previous_recursos_tag="${previous_recursos_tag:-local}"
python3 - "$update_backup" "$previous_image_tag" "$previous_eduhoot_tag" "$previous_recursos_tag" <<'PY'
import json
import sys
from pathlib import Path

backup = Path("backups") / sys.argv[1]
(backup / "update.json").write_text(json.dumps({
    "previous_image_tag": sys.argv[2],
    "previous_eduhoot_tag": sys.argv[3],
    "previous_recursos_tag": sys.argv[4],
}, indent=2) + "\n")
PY
echo "Tags anteriors guardats en $update_backup/update.json"

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
next_recursos_tag="$(python3 - /tmp/edutictac-commons-updates.$$.json <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
recursos = data.get("recursos") or {}
print(recursos.get("candidate") if recursos.get("update_available") else "")
PY
)"
rm -f /tmp/edutictac-commons-updates.$$.json

if [ -n "$next_image_tag" ] || [ -n "$next_eduhoot_tag" ] || [ -n "$next_recursos_tag" ]; then
  echo "Aplicant tags nous en .env..."
  python3 ./scripts/apply-update-tags.py \
    --image-tag "$next_image_tag" \
    --eduhoot-tag "$next_eduhoot_tag" \
    --recursos-tag "$next_recursos_tag"
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
