#!/usr/bin/env bash
set -euo pipefail

# Local helper for the Debian desktop demo. Secrets are read from pass and
# passed directly to Compose; they are never written to the repository.
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

client_id_value="$(pass show edutictac/authentik-users/commons-client-id)"
client_secret_value="$(pass show edutictac/authentik-users/commons-client-secret)"
client_id_value="${client_id_value%%$'\n'*}"
client_secret_value="${client_secret_value%%$'\n'*}"

export COMPOSE_PROFILES="${COMPOSE_PROFILES:-authentik}"
export EDUTICTAC_ID_OIDC_ISSUER_URL="${EDUTICTAC_ID_OIDC_ISSUER_URL:-http://100.74.151.108:9000/application/o/edutictac-commons}"
export EDUTICTAC_ID_OIDC_DISCOVERY_URL="${EDUTICTAC_ID_OIDC_DISCOVERY_URL:-http://authentik-server:9000/application/o/edutictac-commons/.well-known/openid-configuration}"
export EDUTICTAC_ID_OIDC_AUTHORIZATION_URL="${EDUTICTAC_ID_OIDC_AUTHORIZATION_URL:-http://100.74.151.108:9000/application/o/authorize/}"
export EDUTICTAC_ID_OIDC_CLIENT_ID="$client_id_value"
export EDUTICTAC_ID_OIDC_CLIENT_SECRET="$client_secret_value"
export EDUTICTAC_ID_OIDC_REDIRECT_URL="${EDUTICTAC_ID_OIDC_REDIRECT_URL:-http://100.74.151.108:8082/api/auth/oidc/callback}"
export EDUTICTAC_ID_OIDC_ROLE_CLAIM="${EDUTICTAC_ID_OIDC_ROLE_CLAIM:-roles}"

if (($# == 0)); then
  set -- up -d
fi
exec docker compose "$@"
