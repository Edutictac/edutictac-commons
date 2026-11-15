#!/usr/bin/env bash
# Copia @edutictac/rebost-client a services/portal/public/assets/ (client.js y rebost-selection.js).
# Uso: scripts/sync-rebost-client.sh [ruta-al-paquete]
set -euo pipefail
SRC="${1:-$(dirname "$0")/../../edutictac-rebost-client}"
DST="$(dirname "$0")/../services/portal/public/assets"
REV="$(git -C "$SRC" rev-parse --short HEAD)"
HDR="/* Copiado de @edutictac/rebost-client $REV (MIT). No editar aquí: scripts/sync-rebost-client.sh */"
{ echo "$HDR"; cat "$SRC/src/index.js"; } > "$DST/client.js"
{ echo "$HDR"; sed "s|from './index.js'|from '/assets/client.js'|" "$SRC/src/selection.js"; } > "$DST/rebost-selection.js"
