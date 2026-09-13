#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

src="data/id.db"
if [ ! -f "$src" ]; then
  echo "No hi ha base de dades en $src"
  exit 1
fi

mkdir -p backups
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
dest="backups/id-${stamp}.db"

python3 - "$src" "$dest" <<'PY'
import sqlite3
import sys

source_path, dest_path = sys.argv[1], sys.argv[2]
source = sqlite3.connect(source_path)
dest = sqlite3.connect(dest_path)
try:
    source.backup(dest)
finally:
    dest.close()
    source.close()
PY

echo "Copia creada: $dest"
