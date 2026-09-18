#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi
docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"
portal_port="$(grep '^PORTAL_PORT=' "$env_file" | tail -n 1 | cut -d= -f2)"
portal_port="${portal_port:-8082}"
play_port="$(grep '^PLAY_PORT=' "$env_file" | tail -n 1 | cut -d= -f2)"
play_port="${play_port:-8084}"
teacher_token="$(grep '^EDUTICTAC_ID_TEACHER_TOKEN=' "$env_file" | tail -n 1 | cut -d= -f2)"
teacher_token="${teacher_token:-dev-teacher}"
base="http://127.0.0.1:${portal_port}"
play_base="http://127.0.0.1:${play_port}"

teacher_cookie="$(mktemp /tmp/commons-play-teacher.XXXXXX)"
student_cookie="$(mktemp /tmp/commons-play-student.XXXXXX)"
group_id=""
activity_id=""

cleanup() {
  if [ -n "$group_id" ]; then
    $compose exec -T -e TEST_GROUP_ID="$group_id" id-api python - <<'PY' >/dev/null 2>&1 || true
import os
import sqlite3

db_path = os.environ.get("EDUTICTAC_ID_DB", "/data/id.db")
group_id = os.environ.get("TEST_GROUP_ID", "")
if group_id:
    conn = sqlite3.connect(db_path)
    conn.execute("DELETE FROM activity_assignments WHERE group_id = ?", (group_id,))
    conn.execute("DELETE FROM groups WHERE id = ?", (group_id,))
    conn.commit()
    conn.close()
PY
  fi
  case "$activity_id" in
    ''|*[!A-Za-z0-9]*) ;;
    *) rm -rf "data/play/activities/$activity_id" ;;
  esac
  rm -f "$teacher_cookie" "$student_cookie"
}
trap cleanup EXIT

curl -fsS "$base/api/health" >/dev/null
curl -fsS "$play_base/api/health" >/dev/null

printf '{"token":"%s"}' "$teacher_token" | curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' --data-binary @- "$base/api/teacher/login" >/dev/null

activity_id="$(curl -fsS -X POST "$play_base/api/activities" \
  -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Prueba Play Commons","question":"¿Cuál es correcta?","answers":[{"text":"Sí","correct":true},{"text":"No","correct":false}]}' | jq -r '.id')"
case "$activity_id" in
  ????????|??????????) ;;
  *) echo "Play no ha devuelto un identificador válido" >&2; exit 1 ;;
esac

batch="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d '{"tenant_id":"play-test","count":1,"pin_length":4}' "$base/api/identities/batch")"
group_id="$(printf '%s' "$batch" | jq -r '.group.id')"
code="$(printf '%s' "$batch" | jq -r '.identities[0].public_code')"
pin="$(printf '%s' "$batch" | jq -r '.identities[0].pin')"

assignment="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"group_id\":\"${group_id}\",\"app_id\":\"edutictac-play\",\"activity_id\":\"${activity_id}\",\"title\":\"Prueba actividad Play\"}" \
  "$base/api/teacher/activity-assignments")"
assignment_id="$(printf '%s' "$assignment" | jq -r '.assignment.id')"

curl -fsS -c "$student_cookie" -b "$student_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"public_code\":\"${code}\",\"pin\":\"${pin}\"}" \
  "$base/api/auth/student" >/dev/null

launch_token="$(curl -fsS -c "$student_cookie" -b "$student_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"assignment_id\":\"${assignment_id}\"}" "$base/api/student/launch-token" | jq -r '.token')"
launch_context="$(curl -fsS -X POST "$play_base/api/commons/launch" \
  -H 'Content-Type: application/json' \
  -d "{\"token\":\"${launch_token}\"}" | jq -r '.context_id')"

curl -fsS \
  -H 'Content-Type: application/json' \
  -d "{\"activity_id\":\"${activity_id}\",\"assignment_id\":\"${assignment_id}\",\"launch_context\":\"${launch_context}\",\"result_id\":\"https://example.test/results/play-flow-1\",\"score\":80,\"metadata\":{\"source\":\"play-commons-flow\"}}" \
  "$play_base/api/commons/score" >/dev/null

curl -fsS \
  -H 'Content-Type: application/json' \
  -d "{\"activity_id\":\"${activity_id}\",\"assignment_id\":\"${assignment_id}\",\"launch_context\":\"${launch_context}\",\"result_id\":\"https://example.test/results/play-flow-1\",\"score\":80,\"metadata\":{\"source\":\"play-commons-flow\"}}" \
  "$play_base/api/commons/score" >/dev/null

results="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  "$base/api/teacher/activity-assignments/${assignment_id}/results")"
attempts="$(printf '%s' "$results" | jq -r '.results[0].attempts')"
best_score="$(printf '%s' "$results" | jq -r '.results[0].best_score')"
if [ "$attempts" != "1" ] || [ "$best_score" != "80" ]; then
  echo "El flujo Play → Commons no ha guardado el resultado" >&2
  printf '%s\n' "$results" >&2
  exit 1
fi

echo "Flujo Play → Commons correcto: actividad → asignación → identidad → puntuación → tablero"
