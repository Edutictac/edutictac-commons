#!/usr/bin/env bash
# Start the verified local candidate without replacing published image tags.
# OIDC configuration remains owned by the existing secure lab wrapper.
set -euo pipefail
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"
export IMAGE_TAG="${REBOST_LOCAL_TAG:-rebost-local}"
export BLOCS_TAG="${REBOST_LOCAL_TAG:-rebost-local}"
export LLIBRES_PUBLIC_BASE_URL="${LLIBRES_PUBLIC_BASE_URL:-http://100.74.151.108:8086}"
# Dedicated local references keep credentials for other Authentik instances intact.
if [[ -z "${EDUTICTAC_ID_OIDC_CLIENT_ID:-}" ]]; then
    EDUTICTAC_ID_OIDC_CLIENT_ID="$(pass show "${REBOST_OIDC_CLIENT_ID_PASS:-edutictac/commons-local/oidc-client-id}")"
    export EDUTICTAC_ID_OIDC_CLIENT_ID="${EDUTICTAC_ID_OIDC_CLIENT_ID%%$'\n'*}"
fi
if [[ -z "${EDUTICTAC_ID_OIDC_CLIENT_SECRET:-}" ]]; then
    EDUTICTAC_ID_OIDC_CLIENT_SECRET="$(pass show "${REBOST_OIDC_CLIENT_SECRET_PASS:-edutictac/commons-local/oidc-client-secret}")"
    export EDUTICTAC_ID_OIDC_CLIENT_SECRET="${EDUTICTAC_ID_OIDC_CLIENT_SECRET%%$'\n'*}"
fi
if (($# == 0)); then
    set -- up -d --no-build --pull never authentik-postgresql authentik-server authentik-worker id-api blocs portal
fi
exec ./scripts/up-authentik-pass.sh -f compose.yml -f compose.rebost-blocs.yml "$@"
