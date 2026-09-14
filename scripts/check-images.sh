#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

env_value() {
  name="$1"
  fallback="$2"
  current="$(eval "printf '%s' \"\${${name}:-}\"")"
  if [ -n "$current" ]; then
    printf '%s\n' "$current"
    return
  fi
  value="$(grep -E "^${name}=" "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
  printf '%s\n' "${value:-$fallback}"
}

docker_cmd="${DOCKER:-docker}"
registry="$(env_value IMAGE_REGISTRY edutictac)"
image_tag="$(env_value IMAGE_TAG "$(cat VERSION 2>/dev/null || echo 0.1.0-alpha)")"
eduhoot_tag="$(env_value EDUHOOT_TAG 0.1.0)"
profiles="$(env_value COMPOSE_PROFILES "")"

images="
${registry}/commons-id-api:${image_tag}
${registry}/commons-portal:${image_tag}
${registry}/commons-admin:${image_tag}
"

case ",${profiles}," in
  *,eduhoot,*) images="${images}
${registry}/eduhoot:${eduhoot_tag}" ;;
esac

echo "Registre: ${registry}"
echo "Tag Commons: ${image_tag}"
echo "Perfils actius: ${profiles:-cap}"
echo

ok=0
fail=0
for image in $images; do
  echo "== ${image} =="
  if $docker_cmd image inspect "$image" >/dev/null 2>&1; then
    local_id="$($docker_cmd image inspect --format '{{.Id}}' "$image" 2>/dev/null || true)"
    echo "Local: ${local_id:-present}"
  else
    echo "Local: no instal·lada"
  fi

  if $docker_cmd manifest inspect "$image" >/dev/null 2>&1; then
    echo "Remot: disponible"
    ok=$((ok + 1))
  else
    echo "Remot: no disponible o sense permisos"
    fail=$((fail + 1))
  fi
  echo
done

if [ "$fail" -gt 0 ]; then
  echo "FAIL: ${fail} imatge(s) no s'han pogut consultar al registre."
  echo "Revisa IMAGE_REGISTRY/IMAGE_TAG/EDUHOOT_TAG o inicia sessio amb docker login si el registre es privat."
  exit 1
fi

echo "OK: ${ok} imatge(s) disponibles al registre."
