#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file="${ENV_FILE:-.env}"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

registry="${IMAGE_REGISTRY:-$(grep '^IMAGE_REGISTRY=' "$env_file" | tail -n 1 | cut -d= -f2)}"
tag="${IMAGE_TAG:-$(grep '^IMAGE_TAG=' "$env_file" | tail -n 1 | cut -d= -f2)}"
registry="${registry:-edutictac}"
tag="${tag:-$(cat VERSION)}"
eduhoot_tag="${EDUHOOT_TAG:-$(grep '^EDUHOOT_TAG=' "$env_file" | tail -n 1 | cut -d= -f2)}"
eduhoot_tag="${eduhoot_tag:-1.0.2}"
recursos_tag="${RECURSOS_TAG:-$(grep '^RECURSOS_TAG=' "$env_file" | tail -n 1 | cut -d= -f2)}"
recursos_tag="${recursos_tag:-local}"
profiles="${COMPOSE_PROFILES:-$(grep '^COMPOSE_PROFILES=' "$env_file" | tail -n 1 | cut -d= -f2)}"
export IMAGE_REGISTRY="$registry" IMAGE_TAG="$tag" EDUHOOT_TAG="$eduhoot_tag"
export COMPOSE_PROFILES="${profiles},blocs,llibres"

portal_image="${registry}/commons-portal:${tag}"
id_image="${registry}/commons-id-api:${tag}"
admin_image="${registry}/commons-admin:${tag}"
play_image="${registry}/commons-play:${tag}"
eduhoot_image="${registry}/eduhoot:${eduhoot_tag}"
recursos_api_image="${registry}/recursos-api:${recursos_tag}"
recursos_image="${registry}/recursos:${recursos_tag}"

if [ "${INCLUDE_EDUHOOT:-0}" = "1" ]; then
  ${DOCKER:-docker} image inspect "$eduhoot_image" >/dev/null
fi
if printf '%s' ",${profiles}," | grep -q ',recursos,'; then
  ${DOCKER:-docker} image inspect "$recursos_api_image" >/dev/null
  ${DOCKER:-docker} image inspect "$recursos_image" >/dev/null
fi
if [ "${SKIP_BUILD:-0}" != "1" ]; then
  ${DOCKER:-docker} compose --env-file "$env_file" -f compose.yml build id-api portal admin play blocs llibres
fi
${DOCKER:-docker} push "$id_image"
${DOCKER:-docker} push "$portal_image"
${DOCKER:-docker} push "$admin_image"
${DOCKER:-docker} push "$play_image"
${DOCKER:-docker} push "${registry}/commons-blocs:${tag}"
${DOCKER:-docker} push "${registry}/commons-llibres:${tag}"
if [ "${INCLUDE_EDUHOOT:-0}" = "1" ]; then
  ${DOCKER:-docker} push "$eduhoot_image"
fi
if printf '%s' ",${profiles}," | grep -q ',recursos,'; then
  ${DOCKER:-docker} push "$recursos_api_image"
  ${DOCKER:-docker} push "$recursos_image"
fi

echo "Imatges publicades:"
echo "- $id_image"
echo "- $portal_image"
echo "- $admin_image"
echo "- $play_image"
if [ "${INCLUDE_EDUHOOT:-0}" = "1" ]; then
  echo "- $eduhoot_image"
fi
if printf '%s' ",${profiles}," | grep -q ',recursos,'; then
  echo "- $recursos_api_image"
  echo "- $recursos_image"
fi
