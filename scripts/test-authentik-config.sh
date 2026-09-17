#!/usr/bin/env sh
set -eu

base="${COMMONS_BASE_URL:-http://127.0.0.1:8082}"
status="$(curl -fsS "$base/api/auth/oidc/status")"
enabled="$(printf '%s' "$status" | jq -r '.enabled')"
if [ "$enabled" != "true" ]; then
  echo "Authentik OIDC no está activo: $status" >&2
  exit 1
fi
echo "Authentik OIDC activo"
