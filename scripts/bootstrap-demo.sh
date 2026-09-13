#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

env_value() {
  key="$1"
  fallback="$2"
  value="$(grep "^${key}=" "$env_file" | tail -n 1 | cut -d= -f2- || true)"
  printf '%s' "${value:-$fallback}"
}

portal_port="$(env_value PORTAL_PORT 8082)"
teacher_token="$(env_value EDUTICTAC_ID_TEACHER_TOKEN dev-teacher)"
base="http://127.0.0.1:${portal_port}"

tenant_id="${DEMO_TENANT_ID:-demo-centre}"
identity_count="${DEMO_COUNT:-8}"
pin_length="${DEMO_PIN_LENGTH:-4}"
title="${DEMO_TITLE:-Activitat demo Commons}"

teacher_cookie="$(mktemp /tmp/commons-bootstrap-teacher.XXXXXX)"
cleanup() {
  rm -f "$teacher_cookie"
}
trap cleanup EXIT

mkdir -p dist

curl -fsS "$base/api/health" >/dev/null

curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"token\":\"${teacher_token}\"}" \
  "$base/api/teacher/login" >/dev/null

batch="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"tenant_id\":\"${tenant_id}\",\"count\":${identity_count},\"pin_length\":${pin_length}}" \
  "$base/api/identities/batch")"

group_id="$(printf '%s' "$batch" | jq -r '.group.id')"
group_code="$(printf '%s' "$batch" | jq -r '.group.group_code')"

assignment="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"group_id\":\"${group_id}\",\"app_id\":\"commons-demo\",\"activity_id\":\"primera-activitat\",\"title\":\"${title}\"}" \
  "$base/api/teacher/activity-assignments")"

assignment_id="$(printf '%s' "$assignment" | jq -r '.assignment.id')"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
credentials_file="dist/demo-credentials-${stamp}.tsv"

{
  printf 'group_code\tpublic_code\tpin\n'
  printf '%s' "$batch" | jq -r --arg group_code "$group_code" '.identities[] | [$group_code, .public_code, .pin] | @tsv'
} > "$credentials_file"

printf 'Demo preparada.\n'
printf 'Portal: %s\n' "$base"
printf 'Grup: %s\n' "$group_code"
printf 'Activitat: %s\n' "$assignment_id"
printf 'Credencials: %s\n' "$credentials_file"
