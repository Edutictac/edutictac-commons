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
profiles="${COMPOSE_PROFILES:-$(grep '^COMPOSE_PROFILES=' "$env_file" | tail -n 1 | cut -d= -f2 || true)}"
recursos_tag="${RECURSOS_TAG:-$(grep '^RECURSOS_TAG=' "$env_file" | tail -n 1 | cut -d= -f2 || true)}"
recursos_tag="${recursos_tag:-local}"

portal_image="${registry}/commons-portal:${tag}"
id_image="${registry}/commons-id-api:${tag}"
admin_image="${registry}/commons-admin:${tag}"
play_image="${registry}/commons-play:${tag}"
recursos_api_image="${registry}/recursos-api:${recursos_tag}"
recursos_image="${registry}/recursos:${recursos_tag}"
archive="dist/edutictac-commons-images-${tag}.tar"

mkdir -p dist
compose_args="--env-file $env_file -f compose.yml"
for editor in blocs llibres; do
  case ",$profiles," in *,$editor,*) compose_args="$compose_args --profile $editor";; esac
done
images="$portal_image $id_image $admin_image $play_image"
for editor in blocs llibres; do
  case ",$profiles," in *,$editor,*) images="$images ${registry}/commons-${editor}:${tag}";; esac
done
if printf '%s' ",$profiles," | grep -q ',recursos,'; then
  compose_args="$compose_args --profile recursos"
  images="$images $recursos_api_image $recursos_image"
fi

${DOCKER:-docker} compose $compose_args build
${DOCKER:-docker} save $images > "$archive"

echo "Imatges exportades: $archive"
