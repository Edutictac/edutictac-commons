#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${RECURSOS_TEST_URL:-http://127.0.0.1:${RECURSOS_PORT:-8086}}"
TOKEN="${PLAY_INGEST_TOKEN:-local-play-ingest-token}"
ACTIVITY_ID="Recursos1"
PAYLOAD=$(mktemp)
trap 'rm -f "$PAYLOAD"' EXIT

cat >"$PAYLOAD" <<'JSON'
{
  "contract_version": "1",
  "external_id": "edutictac-play:Recursos1",
  "version": "flow-test-v1",
  "idempotency_key": "edutictac-play:Recursos1:flow-test-v1",
  "metadata": {
    "title": "Prueba de integración Recursos",
    "description": "Actividad temporal de comprobación.",
    "type": "multiple-choice",
    "language": "es",
    "subject": "Prueba",
    "educational_stage": "Primaria",
    "tags": ["test", "local"],
    "license": "CC0",
    "author_pseudonym": "test"
  },
  "visibility": "public",
  "canonical_url": "https://play.local.test/play/Recursos1",
  "download_url": "https://play.local.test/play/api/activities/Recursos1/download",
  "package": {"format": "h5p", "delivery": "download_url"}
}
JSON

curl --fail --silent --show-error "$BASE_URL/api/health" >/dev/null
publish() {
  curl --fail --silent --show-error -X POST \
    "$BASE_URL/api/integrations/recursos/activities/$ACTIVITY_ID/publish" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    --data-binary "@$PAYLOAD"
}

first=$(publish)
second=$(publish)
python3 - "$first" "$second" "$BASE_URL" <<'PY'
import json
import sys
import urllib.request

first = json.loads(sys.argv[1])
second = json.loads(sys.argv[2])
base = sys.argv[3]
assert first["status"] == "published", first
assert second["status"] == "published", second
request = urllib.request.Request(base + "/api/resources?provider=edutictac-play&q=Prueba")
with urllib.request.urlopen(request, timeout=8) as response:
    data = json.load(response)
assert any(item["external_id"] == "edutictac-play:Recursos1" for item in data["items"]), data
print("Recursos local flow: OK")
PY
