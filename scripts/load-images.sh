#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

if [ "$#" -ne 1 ]; then
  echo "Usa: scripts/load-images.sh dist/edutictac-commons-images-0.1.0-alpha.tar"
  exit 1
fi

archive="$1"
if [ ! -f "$archive" ]; then
  echo "No existeix l'arxiu: $archive"
  exit 1
fi

${DOCKER:-docker} load -i "$archive"
echo "Imatges carregades des de: $archive"
