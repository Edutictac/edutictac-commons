#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

docker_cmd="${DOCKER:-docker}"

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Falta: $1"
    exit 1
  fi
}

need curl
need jq
need python3

if ! $docker_cmd info >/dev/null 2>&1; then
  echo "Docker no respon amb '$docker_cmd'. Prova: make DOCKER=\"sudo docker\" doctor"
  exit 1
fi

if ! $docker_cmd compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 no està disponible."
  exit 1
fi

portal_port="$(grep '^PORTAL_PORT=' "$env_file" | tail -n 1 | cut -d= -f2)"
portal_port="${portal_port:-8082}"

echo "OK Docker: $($docker_cmd --version)"
echo "OK Compose: $($docker_cmd compose version --short)"
echo "OK port portal configurat: $portal_port"
echo "OK entorn: $env_file"

profiles="$(grep '^COMPOSE_PROFILES=' "$env_file" | tail -n 1 | cut -d= -f2-)"
case ",$profiles," in
  *,authentik,*)
    issuer="$(grep '^EDUTICTAC_ID_OIDC_ISSUER_URL=' "$env_file" | tail -n 1 | cut -d= -f2-)"
    client_id="$(grep '^EDUTICTAC_ID_OIDC_CLIENT_ID=' "$env_file" | tail -n 1 | cut -d= -f2-)"
    client_secret="$(grep '^EDUTICTAC_ID_OIDC_CLIENT_SECRET=' "$env_file" | tail -n 1 | cut -d= -f2-)"
    redirect="$(grep '^EDUTICTAC_ID_OIDC_REDIRECT_URL=' "$env_file" | tail -n 1 | cut -d= -f2-)"
    role_claim="$(grep '^EDUTICTAC_ID_OIDC_ROLE_CLAIM=' "$env_file" | tail -n 1 | cut -d= -f2-)"
    if [ -z "$issuer" ] || [ -z "$client_id" ] || [ -z "$client_secret" ] || [ -z "$redirect" ]; then
      echo "AVIS: COMPOSE_PROFILES inclou 'authentik' pero falten variables EDUTICTAC_ID_OIDC_* a $env_file."
      echo "      Veure 'Activar Authentik SSO' en INSTALL-CENTRES.md."
    else
      echo "OK Authentik OIDC: variables EDUTICTAC_ID_OIDC_* presents"
    fi
    if [ "$role_claim" != "groups" ]; then
      echo "AVIS: EDUTICTAC_ID_OIDC_ROLE_CLAIM hauria de ser 'groups' (actual: '${role_claim:-buit}')."
    fi
    ;;
esac
