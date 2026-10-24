#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

mkdir -p dist
docker_cmd="${DOCKER:-docker}"
$docker_cmd compose --env-file "$env_file" -f compose.yml -f compose.ingress.yml \
  exec -T ingress cat /data/caddy/pki/authorities/local/root.crt > dist/caddy-root.crt
chmod 644 dist/caddy-root.crt
echo "Certificat arrel de Caddy: dist/caddy-root.crt"
echo "Instal·la'l com a autoritat de confiança en els dispositius del centre."
