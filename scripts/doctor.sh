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
