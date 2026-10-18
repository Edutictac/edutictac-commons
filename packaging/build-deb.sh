#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
output_dir="${OUTPUT_DIR:-$repo_dir/dist}"
package_version="${DEB_VERSION:-0.1.1~alpha36}"
package_name="edutictac-commons"
docker_cmd="${DOCKER:-docker}"

# BUNDLE_IMAGES controla si el .deb inclou les imatges Docker ja empaquetades
# perque la instal·lacio no haja de descarregar-les per xarxa:
#   none (per defecte) -> .deb tal com sempre, cap imatge inclosa.
#   own                -> nomes les 4 imatges propies d'EduTicTac (~450MB).
#   full                -> own + les imatges de tercers dels perfils actius
#                          a COMPOSE_PROFILES (poden ser diversos GB).
bundle_images="${BUNDLE_IMAGES:-none}"
case "$bundle_images" in
  none|own|full) ;;
  *)
    echo "BUNDLE_IMAGES ha de ser 'none', 'own' o 'full' (rebut: $bundle_images)" >&2
    exit 1
    ;;
esac

env_file="$repo_dir/.env"
if [ ! -f "$env_file" ]; then
  env_file="$repo_dir/.env.example"
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

registry="$(env_value IMAGE_REGISTRY edutictac)"
image_tag="$(env_value IMAGE_TAG "$(cat "$repo_dir/VERSION" 2>/dev/null || echo 0.1.1-alpha)")"
eduhoot_tag="$(env_value EDUHOOT_TAG 1.0.2)"
recursos_tag="$(env_value RECURSOS_TAG local)"
authentik_tag="$(env_value AUTHENTIK_TAG 2026.8.3)"
profiles="$(env_value COMPOSE_PROFILES "")"

own_images="${registry}/commons-id-api:${image_tag} ${registry}/commons-portal:${image_tag} ${registry}/commons-admin:${image_tag} ${registry}/commons-play:${image_tag}"

full_extra_images=""
case ",${profiles}," in
  *,recursos,*) full_extra_images="$full_extra_images ${registry}/recursos-api:${recursos_tag} ${registry}/recursos:${recursos_tag}" ;;
esac
case ",${profiles}," in
  *,eduhoot,*) full_extra_images="$full_extra_images ${registry}/eduhoot:${eduhoot_tag} mongo:7" ;;
esac
case ",${profiles}," in
  *,authentik,*) full_extra_images="$full_extra_images ghcr.io/goauthentik/server:${authentik_tag} postgres:16-alpine" ;;
esac

stage_dir="$(mktemp -d)"
trap 'rm -rf "$stage_dir"' EXIT

root_dir="$stage_dir/$package_name"
mkdir -p "$root_dir/DEBIAN" "$root_dir/opt/edutictac-commons" "$root_dir/lib/systemd/system" \
  "$root_dir/usr/share/applications" "$root_dir/usr/share/icons/hicolor/scalable/apps"

tar -C "$repo_dir" \
  --exclude='./.git' \
  --exclude='./.env' \
  --exclude='./data/*' \
  --exclude='./backups/*' \
  --exclude='./dist/*' \
  --exclude='./node_modules' \
  --exclude='./.pytest_cache' \
  --exclude='./test-results' \
  --exclude='./playwright-report' \
  --exclude='./packaging' \
  -cf - . | tar -C "$root_dir/opt/edutictac-commons" -xf -

install -m 0644 "$repo_dir/packaging/debian/control" "$root_dir/DEBIAN/control"
install -m 0755 "$repo_dir/packaging/debian/postinst" "$root_dir/DEBIAN/postinst"
install -m 0755 "$repo_dir/packaging/debian/prerm" "$root_dir/DEBIAN/prerm"
install -m 0755 "$repo_dir/packaging/debian/postrm" "$root_dir/DEBIAN/postrm"
install -m 0644 "$repo_dir/packaging/edutictac-commons.service" \
  "$root_dir/lib/systemd/system/edutictac-commons.service"
for unit in edutictac-quiosc-prepare.path edutictac-quiosc-prepare.service; do
  install -m 0644 "$repo_dir/packaging/$unit" "$root_dir/lib/systemd/system/$unit"
done
install -m 0644 "$repo_dir/packaging/debian/edutictac-commons.desktop" \
  "$root_dir/usr/share/applications/edutictac-commons.desktop"
install -m 0644 "$repo_dir/packaging/edutictac-commons.svg" \
  "$root_dir/usr/share/icons/hicolor/scalable/apps/edutictac-commons.svg"

sed -i "s/^Version: .*/Version: $package_version/" "$root_dir/DEBIAN/control"

suffix=""
manifest_lines=""
if [ "$bundle_images" != "none" ]; then
  images="$own_images"
  for image in $own_images; do
    if ! $docker_cmd image inspect "$image" >/dev/null 2>&1; then
      echo "Falta la imatge propia '$image' en local. Genera-la abans amb ./scripts/push-images.sh o 'docker compose build'." >&2
      exit 1
    fi
  done

  if [ "$bundle_images" = "full" ]; then
    for image in $full_extra_images; do
      if $docker_cmd image inspect "$image" >/dev/null 2>&1; then
        images="$images $image"
      else
        echo "Avis: '$image' no es troba en la cache local de Docker; s'exclou del paquet full (caldra descarregar-la en la instal·lacio)." >&2
      fi
    done
  fi

  mkdir -p "$root_dir/opt/edutictac-commons/dist"
  archive="$root_dir/opt/edutictac-commons/dist/edutictac-commons-images-${image_tag}.tar.gz"
  echo "Exportant $(printf '%s\n' $images | wc -l) imatges a $(basename "$archive")..."
  $docker_cmd save $images | gzip > "$archive"

  sed -i "s/\"IMAGE_TAG\": \"[^\"]*\"/\"IMAGE_TAG\": \"${image_tag}\"/" "$root_dir/DEBIAN/postinst"

  suffix="-offline-${bundle_images}"
  manifest_lines="Variant: ${bundle_images}
Tag: ${image_tag}
Arxiu d'imatges: $(basename "$archive") ($(du -h "$archive" | cut -f1))

Imatges incloses:"
  for image in $images; do
    size="$($docker_cmd image inspect --format '{{.Size}}' "$image" 2>/dev/null || echo 0)"
    size_h="$(numfmt --to=iec --suffix=B "$size" 2>/dev/null || echo "${size}B")"
    manifest_lines="$manifest_lines
  - $image ($size_h)"
  done
fi

deb_basename="${package_name}${suffix}_${package_version}_amd64.deb"
mkdir -p "$output_dir"
dpkg-deb --build --root-owner-group "$root_dir" "$output_dir/${deb_basename}"
echo "Paquet creat en $output_dir/${deb_basename}"

if [ -n "$manifest_lines" ]; then
  manifest_file="$output_dir/${deb_basename}.manifest.txt"
  {
    echo "Paquet: ${deb_basename}"
    echo "Mida total del .deb: $(du -h "$output_dir/${deb_basename}" | cut -f1)"
    echo ""
    echo "$manifest_lines"
  } > "$manifest_file"
  echo ""
  cat "$manifest_file"
  echo ""
  echo "Manifest guardat en $manifest_file"
fi
