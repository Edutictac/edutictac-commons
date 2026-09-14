#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

mkdir -p backups
lock_dir="${BACKUP_LOCK_DIR:-backups/.backup.lock}"
if ! mkdir "$lock_dir" 2>/dev/null; then
  echo "Un altre backup o neteja de backups esta en marxa: $lock_dir"
  exit 1
fi
trap 'rmdir "$lock_dir" 2>/dev/null || true' EXIT
trap 'rmdir "$lock_dir" 2>/dev/null || true; exit 130' INT TERM
BACKUP_LOCK_HELD=1
export BACKUP_LOCK_HELD

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
