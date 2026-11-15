#!/usr/bin/env bash
# Copia @edutictac-banks (paquete compartido) a services/id-api/assets/edutictac_banks/. Uso: scripts/sync-banks.sh [ruta-al-paquete]
set -euo pipefail
SRC="${1:-$(dirname "$0")/../../edutictac-banks}"
"$SRC/scripts/sync-banks.sh" "$(dirname "$0")/../services/id-api/assets" "$SRC"
