#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

registry="$(grep '^IMAGE_REGISTRY=' "$env_file" | tail -n 1 | cut -d= -f2)"
tag="$(grep '^IMAGE_TAG=' "$env_file" | tail -n 1 | cut -d= -f2)"
registry="${registry:-edutictac}"
tag="${tag:-$(cat VERSION)}"

portal_image="${registry}/commons-portal:${tag}"
id_image="${registry}/commons-id-api:${tag}"

${DOCKER:-docker} compose --env-file "$env_file" -f compose.yml build
${DOCKER:-docker} push "$id_image"
${DOCKER:-docker} push "$portal_image"

echo "Imatges publicades:"
echo "- $id_image"
echo "- $portal_image"
