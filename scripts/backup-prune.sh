#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

if [ "${BACKUP_LOCK_HELD:-0}" != "1" ]; then
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
fi

keep_daily="${BACKUP_KEEP_DAILY:-7}"
keep_weekly="${BACKUP_KEEP_WEEKLY:-4}"
keep_monthly="${BACKUP_KEEP_MONTHLY:-6}"

mkdir -p backups

python3 - "$keep_daily" "$keep_weekly" "$keep_monthly" <<'PY'
import os
import re
import shutil
import sys
from datetime import datetime, timezone

keep_daily, keep_weekly, keep_monthly = (int(x) for x in sys.argv[1:4])

backups_root = "backups"
pattern = re.compile(r'^commons-(\d{8}T\d{6}Z)$')

entries = []
for name in sorted(os.listdir(backups_root)):
    m = pattern.match(name)
    if not m:
        continue
    dt = datetime.strptime(m.group(1), "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
    entries.append((dt, name))

entries.sort(key=lambda item: item[0], reverse=True)

keep = set()
for dt, name in entries[:keep_daily]:
    keep.add(name)

remaining = entries[keep_daily:]

seen_weeks = {}
for dt, name in remaining:
    key = dt.isocalendar()[:2]
    if key not in seen_weeks and len(seen_weeks) < keep_weekly:
        seen_weeks[key] = name
        keep.add(name)

seen_months = {}
for dt, name in remaining:
    if name in keep:
        continue
    key = (dt.year, dt.month)
    if key not in seen_months and len(seen_months) < keep_monthly:
        seen_months[key] = name
        keep.add(name)

deleted = 0
for dt, name in entries:
    path = os.path.join(backups_root, name)
    if name in keep:
        print(f"OK conservat: {name}")
    else:
        shutil.rmtree(path)
        deleted += 1
        print(f"OK esborrat: {name}")

print(
    f"Retencio aplicada: {len(keep)} conservats, {deleted} esborrats "
    f"(diaris={keep_daily}, setmanals={keep_weekly}, mensuals={keep_monthly})"
)
PY
