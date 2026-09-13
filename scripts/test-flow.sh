#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

portal_port="$(grep '^PORTAL_PORT=' "$env_file" | tail -n 1 | cut -d= -f2)"
portal_port="${portal_port:-8082}"
teacher_token="$(grep '^EDUTICTAC_ID_TEACHER_TOKEN=' "$env_file" | tail -n 1 | cut -d= -f2)"
teacher_token="${teacher_token:-dev-teacher}"
base="http://127.0.0.1:${portal_port}"

teacher_cookie="$(mktemp /tmp/commons-teacher.XXXXXX)"
student_cookie="$(mktemp /tmp/commons-student.XXXXXX)"
cleanup() {
  rm -f "$teacher_cookie" "$student_cookie"
}
trap cleanup EXIT

curl -fsS "$base/api/health" >/dev/null

curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"token\":\"${teacher_token}\"}" \
  "$base/api/teacher/login" >/dev/null

batch="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d '{"tenant_id":"demo-test","count":2,"pin_length":4}' \
  "$base/api/identities/batch")"

group_id="$(printf '%s' "$batch" | jq -r '.group.id')"
code="$(printf '%s' "$batch" | jq -r '.identities[0].public_code')"
pin="$(printf '%s' "$batch" | jq -r '.identities[0].pin')"

assignment="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"group_id\":\"${group_id}\",\"app_id\":\"commons-demo\",\"activity_id\":\"primera-activitat\",\"title\":\"Activitat demo Commons\"}" \
  "$base/api/teacher/activity-assignments")"

assignment_id="$(printf '%s' "$assignment" | jq -r '.assignment.id')"

curl -fsS -c "$student_cookie" -b "$student_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"public_code\":\"${code}\",\"pin\":\"${pin}\"}" \
  "$base/api/auth/student" >/dev/null

curl -fsS -c "$student_cookie" -b "$student_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"app_id\":\"commons-demo\",\"activity_id\":\"primera-activitat\",\"assignment_id\":\"${assignment_id}\",\"score\":88,\"metadata\":{\"demo\":true}}" \
  "$base/api/scores" >/dev/null

results="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  "$base/api/teacher/activity-assignments/${assignment_id}/results")"

attempts="$(printf '%s' "$results" | jq -r '.results[0].attempts')"
best_score="$(printf '%s' "$results" | jq -r '.results[0].best_score')"

if [ "$attempts" != "1" ] || [ "$best_score" != "88" ]; then
  echo "Flux demo incorrecte"
  printf '%s\n' "$results"
  exit 1
fi

echo "Flux demo correcte: docent -> credencials -> alumne -> puntuacio -> resultats"
