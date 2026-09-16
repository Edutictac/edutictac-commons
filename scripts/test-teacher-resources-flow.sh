#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${COMMONS_TEST_URL:-http://127.0.0.1:${PORTAL_PORT:-8082}}"
COOKIE_FILE=$(mktemp)
trap 'rm -f "$COOKIE_FILE"' EXIT

curl --fail --silent --show-error -c "$COOKIE_FILE" \
  -H 'Content-Type: application/json' \
  -d '{"token":"dev-teacher"}' \
  "$BASE_URL/api/teacher/login" >/dev/null

group=$(curl --fail --silent --show-error -b "$COOKIE_FILE" \
  -H 'Content-Type: application/json' \
  -d '{"tenant_id":"resources-flow-test","count":1,"pin_length":4}' \
  "$BASE_URL/api/identities/batch")
group_id=$(python3 -c 'import json,sys; print(json.load(sys.stdin)["group"]["id"])' <<<"$group")

resource=$(curl --fail --silent --show-error \
  "$BASE_URL/resources-api/resources?provider=edutictac-play&limit=1")
activity_id=$(python3 -c 'import json,sys; value=json.load(sys.stdin)["items"][0]["external_id"]; print(value.split(":", 1)[-1])' <<<"$resource")

curl --fail --silent --show-error -b "$COOKIE_FILE" \
  -H 'Content-Type: application/json' \
  -d "{\"group_id\":\"$group_id\",\"app_id\":\"edutictac-play\",\"activity_id\":\"$activity_id\",\"title\":\"Recurso del catálogo\"}" \
  "$BASE_URL/api/teacher/activity-assignments" >/dev/null

printf '%s\n' 'Teacher Recursos assignment flow: OK'
