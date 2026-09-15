#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

if [ "${CONFIRM_RESET_TEST:-}" != "1" ]; then
  echo "Prova destructiva protegida."
  echo "Executa: CONFIRM_RESET_TEST=1 make test-reset-flow"
  echo "El test crea un backup previ, fa reset de Commons, comprova que queda buit i restaura el backup."
  exit 1
fi

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

value_from_env() {
  key="$1"
  fallback="$2"
  value="$(grep "^${key}=" "$env_file" | tail -n 1 | cut -d= -f2- || true)"
  printf '%s' "${value:-$fallback}"
}

portal_port="$(value_from_env PORTAL_PORT 8082)"
teacher_token="$(value_from_env EDUTICTAC_ID_TEACHER_TOKEN dev-teacher)"
docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"
base="http://127.0.0.1:${portal_port}"
teacher_cookie="$(mktemp /tmp/commons-reset-teacher.XXXXXX)"
backup_dir=""
restored=0

cleanup() {
  rm -f "$teacher_cookie"
  if [ "$restored" != "1" ] && [ -n "$backup_dir" ]; then
    echo "AVIS: el backup previ queda disponible en $backup_dir"
  fi
}
trap cleanup EXIT

latest_backup() {
  find backups -maxdepth 1 -type d -name 'commons-*' 2>/dev/null | sort | tail -n 1
}

login_teacher() {
  rm -f "$teacher_cookie"
  teacher_cookie="$(mktemp /tmp/commons-reset-teacher.XXXXXX)"
  printf '{"token":"%s"}' "$teacher_token" | curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
    -H 'Content-Type: application/json' \
    --data-binary @- \
    "$base/api/teacher/login" >/dev/null
}

summary_total() {
  curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" "$base/api/teacher/summary" | jq -r '.total'
}

curl -fsS "$base/api/health" >/dev/null
before_backup="$(latest_backup || true)"
./scripts/backup.sh >/dev/null
after_backup="$(latest_backup || true)"

if [ -z "$after_backup" ] || [ "$after_backup" = "$before_backup" ]; then
  echo "No s'ha pogut crear un backup previ nou"
  exit 1
fi
backup_dir="$after_backup"

login_teacher
curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d '{"tenant_id":"reset-flow-test","count":2,"pin_length":4}' \
  "$base/api/identities/batch" >/dev/null

created_total="$(summary_total)"
if [ "$created_total" -lt 2 ]; then
  echo "No s'han creat les credencials temporals esperades abans del reset"
  exit 1
fi

./scripts/reset.sh >/dev/null
$compose up -d --wait >/dev/null
curl -fsS "$base/api/health" >/dev/null

login_teacher
reset_total="$(summary_total)"
if [ "$reset_total" != "0" ]; then
  echo "El reset no ha deixat Commons buit"
  echo "total=$reset_total"
  exit 1
fi

./scripts/restore.sh "$backup_dir" >/dev/null
curl -fsS "$base/api/health" >/dev/null
restored=1

echo "Flux reset correcte: backup previ -> dades temporals -> reset buit -> restore"
