#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

max_age_hours="${BACKUP_MAX_AGE_HOURS:-24}"

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi
profiles="$(grep -E '^COMPOSE_PROFILES=' "$env_file" 2>/dev/null | cut -d= -f2- || true)"

latest_dir="$(find backups -maxdepth 1 -type d -name 'commons-*' 2>/dev/null | sort | tail -n1)"

if [ -z "$latest_dir" ]; then
  echo "FAIL: no hi ha cap backup en backups/commons-*"
  exit 1
fi

echo "Backup mes recent: $latest_dir"

manifest="${latest_dir}/manifest.json"
if [ ! -f "$manifest" ]; then
  echo "FAIL: no existeix $manifest"
  exit 1
fi

python3 - "$latest_dir" "$manifest" "$max_age_hours" "$profiles" <<'PY'
import hashlib
import json
import os
import sys
from datetime import datetime, timezone

backup_dir, manifest_path, max_age_hours, profiles = sys.argv[1:5]
max_age_hours = float(max_age_hours)
active_profiles = {p for p in profiles.split(",") if p}

ok = True

try:
    with open(manifest_path) as f:
        manifest = json.load(f)
except (OSError, json.JSONDecodeError) as exc:
    print(f"FAIL: manifest il·legible o JSON invalid: {exc}")
    sys.exit(1)

required_keys = ["manifest_version", "created_at", "stack_version", "services", "warnings"]
missing_keys = [k for k in required_keys if k not in manifest]
if missing_keys:
    print(f"FAIL: manifest sense camps obligatoris: {', '.join(missing_keys)}")
    sys.exit(1)
print("OK manifest valid amb tots els camps obligatoris")

try:
    created_at = datetime.strptime(manifest["created_at"], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
except ValueError as exc:
    print(f"FAIL: created_at amb format invalid: {exc}")
    sys.exit(1)

age_hours = (datetime.now(timezone.utc) - created_at).total_seconds() / 3600
if age_hours > max_age_hours:
    print(f"FAIL: backup de fa {age_hours:.1f}h, supera el maxim de {max_age_hours}h")
    ok = False
else:
    print(f"OK backup recent (fa {age_hours:.1f}h, maxim {max_age_hours}h)")

covered_services = set()
for service in manifest["services"]:
    name = service.get("name", "?")
    covered_services.add(name)
    for rel_path, expected in service.get("checksums", {}).items():
        full_path = os.path.join(backup_dir, rel_path)
        if not os.path.isfile(full_path):
            print(f"FAIL: falta el fitxer declarat en el manifest: {rel_path}")
            ok = False
            continue
        algo, _, expected_hex = expected.partition(":")
        if algo != "sha256":
            print(f"FAIL: algorisme de checksum no suportat per a {rel_path}: {algo}")
            ok = False
            continue
        digest = hashlib.sha256()
        with open(full_path, "rb") as fh:
            for chunk in iter(lambda: fh.read(65536), b""):
                digest.update(chunk)
        if digest.hexdigest() != expected_hex:
            print(f"FAIL: checksum no coincideix per a {rel_path}")
            ok = False
        else:
            print(f"OK checksum verificat: {rel_path}")

warnings_text = " ".join(manifest.get("warnings", []))

if "id-api" not in covered_services:
    print("FAIL: id-api no esta cobert pel backup")
    ok = False

if "eduhoot" in active_profiles:
    if "eduhoot" in covered_services:
        pass
    elif "eduhoot" in warnings_text.lower():
        print("OK eduhoot actiu sense cobertura, pero declarat com a avis en el manifest")
    else:
        print("FAIL: eduhoot actiu (COMPOSE_PROFILES) pero ni cobert ni avisat en el manifest")
        ok = False

if not ok:
    sys.exit(1)
PY

echo "Comprovacio de backup correcta"
