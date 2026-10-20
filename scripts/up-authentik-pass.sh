#!/usr/bin/env bash
set -euo pipefail

# Local helper for the Debian desktop demo. Secrets are read from pass and
# passed directly to Compose; they are never written to the repository.
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

client_id_value="${EDUTICTAC_ID_OIDC_CLIENT_ID:-}"
client_secret_value="${EDUTICTAC_ID_OIDC_CLIENT_SECRET:-}"
if [[ -z "$client_id_value" ]]; then
  client_id_value="$(pass show edutictac/authentik-users/commons-client-id)"
fi
if [[ -z "$client_secret_value" ]]; then
  client_secret_value="$(pass show edutictac/authentik-users/commons-client-secret)"
fi
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
export RECURSOS_OIDC_REDIRECT_URI="${RECURSOS_OIDC_REDIRECT_URI:-http://100.74.151.108:8086/api/auth/callback}"
export RECURSOS_OIDC_SCOPE="${RECURSOS_OIDC_SCOPE:-openid profile email}"
export RECURSOS_OIDC_ADMIN_EMAILS="${RECURSOS_OIDC_ADMIN_EMAILS:-info@sasogu.es}"
export EDUHOOT_AUTHENTIK_ISSUER="${EDUHOOT_AUTHENTIK_ISSUER:-$EDUTICTAC_ID_OIDC_ISSUER_URL}"
export EDUHOOT_AUTHENTIK_DISCOVERY_URL="${EDUHOOT_AUTHENTIK_DISCOVERY_URL:-$EDUTICTAC_ID_OIDC_DISCOVERY_URL}"
export EDUHOOT_AUTHENTIK_AUTHORIZATION_URL="${EDUHOOT_AUTHENTIK_AUTHORIZATION_URL:-$EDUTICTAC_ID_OIDC_AUTHORIZATION_URL}"
export EDUHOOT_AUTHENTIK_TOKEN_URL="${EDUHOOT_AUTHENTIK_TOKEN_URL:-http://authentik-server:9000/application/o/token/}"
export EDUHOOT_AUTHENTIK_USERINFO_URL="${EDUHOOT_AUTHENTIK_USERINFO_URL:-http://authentik-server:9000/application/o/userinfo/}"
export EDUHOOT_AUTHENTIK_CLIENT_ID="${EDUHOOT_AUTHENTIK_CLIENT_ID:-$client_id_value}"
export EDUHOOT_AUTHENTIK_CLIENT_SECRET="${EDUHOOT_AUTHENTIK_CLIENT_SECRET:-$client_secret_value}"
export EDUHOOT_AUTHENTIK_REDIRECT_URI="${EDUHOOT_AUTHENTIK_REDIRECT_URI:-http://100.74.151.108:8090/api/auth/authentik/callback}"

if (($# == 0)); then
  set -- up -d
fi
exec docker compose "$@"
