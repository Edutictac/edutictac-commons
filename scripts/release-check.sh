#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

repo_root="$(git rev-parse --show-toplevel)"
version="$(cat VERSION)"
image_archive="stack/dist/edutictac-commons-images-${version}.tar"

ignored_required="
stack/.env
stack/data/id.db
stack/data/id.db-wal
stack/data/id.db-shm
stack/backups/demo.db
stack/dist/demo-credentials.tsv
$image_archive
"

tracked_forbidden="
stack/.env
stack/data/id.db
stack/data/id.db-wal
stack/data/id.db-shm
stack/backups/demo.db
stack/dist/demo-credentials.tsv
$image_archive
"

echo "== Requisits locals =="
./scripts/doctor.sh

echo
echo "== Sintaxi del portal =="
if command -v node >/dev/null 2>&1; then
  node --check services/portal/public/app.js
  echo "OK JavaScript"
else
  echo "AVIS: node no disponible; s'omet la comprovacio de JavaScript"
fi

echo
echo "== Artefactes locals ignorats =="
for path in $ignored_required; do
  if git -C "$repo_root" check-ignore -q "$path"; then
    echo "OK ignorat: $path"
  else
    echo "No està ignorat: $path"
    exit 1
  fi
done

echo
echo "== Artefactes locals no versionats =="
for path in $tracked_forbidden; do
  if git -C "$repo_root" ls-files --error-unmatch "$path" >/dev/null 2>&1; then
    echo "No hauria d'estar versionat: $path"
    exit 1
  fi
done
echo "OK cap artefacte local prohibit està versionat"

echo
echo "== Flux funcional =="
./scripts/test-flow.sh

echo
echo "Release check correcte"
echo "Si alguna prova falla en un altre entorn, revisa INSTALL-CENTRES.md#solucio-de-problemes."
