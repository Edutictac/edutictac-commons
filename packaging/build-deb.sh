#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
output_dir="${OUTPUT_DIR:-$repo_dir/dist}"
package_version="${DEB_VERSION:-0.1.1~alpha17}"
package_name="edutictac-commons"
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
install -m 0644 "$repo_dir/packaging/debian/edutictac-commons.desktop" \
  "$root_dir/usr/share/applications/edutictac-commons.desktop"
install -m 0644 "$repo_dir/packaging/edutictac-commons.svg" \
  "$root_dir/usr/share/icons/hicolor/scalable/apps/edutictac-commons.svg"

sed -i "s/^Version: .*/Version: $package_version/" "$root_dir/DEBIAN/control"
dpkg-deb --build --root-owner-group "$root_dir" "$output_dir/${package_name}_${package_version}_amd64.deb"
echo "Paquet creat en $output_dir/${package_name}_${package_version}_amd64.deb"
