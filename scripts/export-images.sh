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
admin_image="${registry}/commons-admin:${tag}"
play_image="${registry}/commons-play:${tag}"
archive="dist/edutictac-commons-images-${tag}.tar"

mkdir -p dist
${DOCKER:-docker} compose --env-file "$env_file" -f compose.yml build
${DOCKER:-docker} save "$portal_image" "$id_image" "$admin_image" "$play_image" > "$archive"

echo "Imatges exportades: $archive"
