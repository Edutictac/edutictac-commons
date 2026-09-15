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
docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"
base="http://127.0.0.1:${portal_port}"

teacher_cookie="$(mktemp /tmp/commons-teacher.XXXXXX)"
student_cookie="$(mktemp /tmp/commons-student.XXXXXX)"
group_id=""
cleanup_group() {
  if [ -n "$group_id" ]; then
    $compose exec -T -e TEST_GROUP_ID="$group_id" id-api python - <<'PY' >/dev/null 2>&1 || true
import os
import sqlite3

db_path = os.environ.get("EDUTICTAC_ID_DB", "/data/id.db")
group_id = os.environ.get("TEST_GROUP_ID", "")
if group_id:
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute("DELETE FROM groups WHERE id = ?", (group_id,))
    conn.commit()
    conn.close()
PY
  fi
}

cleanup() {
  cleanup_group
  rm -f "$teacher_cookie" "$student_cookie"
}
trap cleanup EXIT

curl -fsS "$base/api/health" >/dev/null

printf '{"token":"%s"}' "$teacher_token" | curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  --data-binary @- \
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

student_dashboard="$(curl -fsS -c "$student_cookie" -b "$student_cookie" \
  "$base/api/student/dashboard")"

student_assignment_id="$(printf '%s' "$student_dashboard" | jq -r '.assignments[0].id')"
if [ "$student_assignment_id" != "$assignment_id" ]; then
  echo "El recorregut de l'alumne no inclou l'assignacio esperada"
  printf '%s\n' "$student_dashboard"
  exit 1
fi

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
