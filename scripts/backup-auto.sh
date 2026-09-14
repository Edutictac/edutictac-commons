#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

log() {
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"
}

log "Iniciant backup automatic"
./scripts/backup.sh
log "Backup creat"

./scripts/backup-check.sh
log "Backup verificat"

./scripts/backup-prune.sh
log "Retencio aplicada"

log "Backup automatic complet"
