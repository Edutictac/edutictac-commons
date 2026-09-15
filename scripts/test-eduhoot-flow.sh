#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

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

profile_enabled() {
  profiles="$(value_from_env COMPOSE_PROFILES "")"
  printf '%s' "$profiles" | tr ',' ' ' | grep -Eq '(^|[[:space:]])eduhoot($|[[:space:]])'
}

portal_port="$(value_from_env PORTAL_PORT 8082)"
eduhoot_port="$(value_from_env EDUHOOT_PORT 8090)"
teacher_token="$(value_from_env EDUTICTAC_ID_TEACHER_TOKEN dev-teacher)"
app_token="$(value_from_env EDUTICTAC_ID_APP_TOKEN "")"
docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"
base="http://127.0.0.1:${portal_port}"
eduhoot_base="http://127.0.0.1:${eduhoot_port}"

if ! profile_enabled; then
  echo "EduHoot no esta actiu. Activa COMPOSE_PROFILES=eduhoot per executar aquesta prova."
  exit 0
fi

if [ -z "$app_token" ]; then
  echo "Falta EDUTICTAC_ID_APP_TOKEN en $env_file"
  exit 1
fi

teacher_cookie="$(mktemp /tmp/commons-eduhoot-teacher.XXXXXX)"
student_cookie="$(mktemp /tmp/commons-eduhoot-student.XXXXXX)"
app_curl_config="$(mktemp /tmp/commons-eduhoot-app-curl.XXXXXX)"
group_id=""
chmod 600 "$app_curl_config"
printf 'header = "Authorization: Bearer %s"\n' "$app_token" > "$app_curl_config"

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
  rm -f "$teacher_cookie" "$student_cookie" "$app_curl_config"
}
trap cleanup EXIT

curl -fsS "$base/api/health" >/dev/null

auth_config="$(curl -fsS "$eduhoot_base/api/player-auth/config")"
auth_enabled="$(printf '%s' "$auth_config" | jq -r '.enabled')"
if [ "$auth_enabled" != "true" ]; then
  echo "EduHoot no te activada la identitat Commons"
  printf '%s\n' "$auth_config"
  exit 1
fi

printf '{"token":"%s"}' "$teacher_token" | curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  --data-binary @- \
  "$base/api/teacher/login" >/dev/null

batch="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d '{"tenant_id":"eduhoot-flow-test","count":1,"pin_length":4}' \
  "$base/api/identities/batch")"

group_id="$(printf '%s' "$batch" | jq -r '.group.id')"
identity_id="$(printf '%s' "$batch" | jq -r '.identities[0].id')"
code="$(printf '%s' "$batch" | jq -r '.identities[0].public_code')"
pin="$(printf '%s' "$batch" | jq -r '.identities[0].pin')"
activity_id="eduhoot-flow-test"

assignment="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"group_id\":\"${group_id}\",\"app_id\":\"eduhoot\",\"activity_id\":\"${activity_id}\",\"title\":\"EduHoot prova funcional\"}" \
  "$base/api/teacher/activity-assignments")"

assignment_id="$(printf '%s' "$assignment" | jq -r '.assignment.id')"

curl -fsS -c "$student_cookie" -b "$student_cookie" \
  -H 'Content-Type: application/json' \
  -d "{\"public_code\":\"${code}\",\"pin\":\"${pin}\"}" \
  "$base/api/auth/student" >/dev/null

score="$(curl -fsS --config "$app_curl_config" \
  -H 'Content-Type: application/json' \
  -d "{\"identity_id\":\"${identity_id}\",\"activity_id\":\"${activity_id}\",\"score\":91,\"metadata\":{\"source\":\"test-eduhoot-flow\",\"pin\":\"test-pin\",\"quiz_name\":\"Prova EduHoot\",\"correct\":3,\"wrong\":1,\"total_questions\":4}}" \
  "$base/api/apps/eduhoot/scores")"

score_assignment_id="$(printf '%s' "$score" | jq -r '.assignment_id')"
if [ "$score_assignment_id" != "$assignment_id" ]; then
  echo "La puntuacio EduHoot no s'ha associat a l'assignacio esperada"
  printf '%s\n' "$score"
  exit 1
fi

explicit_score="$(curl -fsS --config "$app_curl_config" \
  -H 'Content-Type: application/json' \
  -d "{\"identity_id\":\"${identity_id}\",\"activity_id\":\"${activity_id}\",\"assignment_id\":\"${assignment_id}\",\"score\":97,\"metadata\":{\"source\":\"test-eduhoot-flow\",\"mode\":\"explicit-assignment\"}}" \
  "$base/api/apps/eduhoot/scores")"

explicit_assignment_id="$(printf '%s' "$explicit_score" | jq -r '.assignment_id')"
if [ "$explicit_assignment_id" != "$assignment_id" ]; then
  echo "La puntuacio EduHoot amb assignment_id explicit no s'ha associat correctament"
  printf '%s\n' "$explicit_score"
  exit 1
fi

bad_status="$(curl -sS -o /dev/null -w '%{http_code}' \
  -H 'Content-Type: application/json' \
  -d "{\"identity_id\":\"${identity_id}\",\"activity_id\":\"${activity_id}\",\"score\":13}" \
  "$base/api/apps/eduhoot/scores")"
if [ "$bad_status" != "401" ]; then
  echo "L'endpoint intern de puntuacions EduHoot ha acceptat una peticio sense token"
  echo "HTTP $bad_status"
  exit 1
fi

results="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  "$base/api/teacher/activity-assignments/${assignment_id}/results")"

attempts="$(printf '%s' "$results" | jq -r '.results[0].attempts')"
best_score="$(printf '%s' "$results" | jq -r '.results[0].best_score')"
result_code="$(printf '%s' "$results" | jq -r '.results[0].public_code')"

if [ "$attempts" != "2" ] || [ "$best_score" != "97" ] || [ "$result_code" != "$code" ]; then
  echo "Flux EduHoot incorrecte"
  printf '%s\n' "$results"
  exit 1
fi

ranking="$(curl -fsS -c "$teacher_cookie" -b "$teacher_cookie" \
  "$base/api/rankings?app_id=eduhoot&activity_id=${activity_id}&limit=5")"
ranking_score="$(printf '%s' "$ranking" | jq -r 'map(select(.public_code == "'"$code"'"))[0].score')"
if [ "$ranking_score" != "97" ]; then
  echo "El ranking no inclou la puntuacio EduHoot esperada"
  printf '%s\n' "$ranking"
  exit 1
fi

echo "Flux EduHoot correcte: identitat Commons -> assignacio -> puntuacio interna -> resultats"
