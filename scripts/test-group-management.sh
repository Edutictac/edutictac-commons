#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."
env_file=".env"
[ -f "$env_file" ] || env_file=".env.example"
portal_port="$(grep '^PORTAL_PORT=' "$env_file" | tail -n 1 | cut -d= -f2)"
portal_port="${portal_port:-8082}"
base="http://127.0.0.1:$portal_port"
teacher_token="$(grep '^EDUTICTAC_ID_TEACHER_TOKEN=' "$env_file" | tail -n 1 | cut -d= -f2)"
teacher_token="${teacher_token:-dev-teacher}"
cookie="$(mktemp /tmp/commons-group-management.XXXXXX)"
group_id=""
cleanup() {
  if [ -n "$group_id" ]; then
    curl -fsS -o /dev/null 2>/dev/null -c "$cookie" -b "$cookie" -X DELETE "$base/api/teacher/groups/$group_id" || true
  fi
  rm -f "$cookie"
}
trap cleanup EXIT

printf '{"token":"%s"}' "$teacher_token" | curl -fsS -c "$cookie" -b "$cookie" \
  -H 'Content-Type: application/json' --data-binary @- "$base/api/teacher/login" >/dev/null
batch="$(curl -fsS -c "$cookie" -b "$cookie" -H 'Content-Type: application/json' \
  -d '{"tenant_id":"group-management-test","count":1,"pin_length":4}' \
  "$base/api/identities/batch")"
group_id="$(printf '%s' "$batch" | jq -r '.group.id')"

added="$(curl -fsS -c "$cookie" -b "$cookie" -H 'Content-Type: application/json' \
  -d '{"count":2,"pin_length":4}' "$base/api/teacher/groups/$group_id/identities")"
[ "$(printf '%s' "$added" | jq '.identities | length')" = "2" ]

assignment="$(curl -fsS -c "$cookie" -b "$cookie" -H 'Content-Type: application/json' \
  -d "{\"group_id\":\"$group_id\",\"app_id\":\"commons-demo\",\"activity_id\":\"group-test\",\"title\":\"Group test\"}" \
  "$base/api/teacher/activity-assignments")"
assignment_id="$(printf '%s' "$assignment" | jq -r '.assignment.id')"
[ -n "$assignment_id" ]

deleted="$(curl -fsS -c "$cookie" -b "$cookie" -X DELETE "$base/api/teacher/groups/$group_id")"
[ "$(printf '%s' "$deleted" | jq -r '.deleted')" = "$group_id" ]

echo "Gestión de grupos correcta: añadir identidades -> asignar -> eliminar en cascada"
