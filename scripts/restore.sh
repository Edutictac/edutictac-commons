#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

mkdir -p backups
lock_dir="${BACKUP_LOCK_DIR:-backups/.backup.lock}"
if ! mkdir "$lock_dir" 2>/dev/null; then
  echo "Un altre backup, restauracio o neteja de backups esta en marxa: $lock_dir"
  exit 1
fi
trap 'rmdir "$lock_dir" 2>/dev/null || true' EXIT
trap 'rmdir "$lock_dir" 2>/dev/null || true; exit 130' INT TERM

if [ "$#" -ne 1 ]; then
  echo "Usa: scripts/restore.sh backups/commons-YYYYmmddTHHMMSSZ/"
  exit 1
fi

backup_dir="${1%/}"
manifest="${backup_dir}/manifest.json"
backup_db="${backup_dir}/id-api/id.db"

if [ ! -f "$manifest" ]; then
  echo "No existeix el manifest: $manifest"
  exit 1
fi
if [ ! -f "$backup_db" ]; then
  echo "No existeix la base de dades del backup: $backup_db"
  exit 1
fi

stack_version="$(cat VERSION 2>/dev/null || echo unknown)"
backup_version="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("stack_version", "unknown"))' "$manifest")"
if [ "$backup_version" != "$stack_version" ]; then
  echo "Avís: el backup és de la versió ${backup_version}, l'stack actual és ${stack_version}"
fi

eduhoot_in_backup="$(python3 -c 'import json,sys; m=json.load(open(sys.argv[1])); print("1" if any(s.get("name")=="eduhoot" for s in m.get("services", [])) else "0")' "$manifest")"

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

if [ "$eduhoot_in_backup" = "1" ]; then
  profiles="$(grep -E '^COMPOSE_PROFILES=' "$env_file" 2>/dev/null | cut -d= -f2- || true)"
  case ",${profiles}," in
    *,eduhoot,*) ;;
    *)
      echo "El backup inclou dades d'eduhoot pero COMPOSE_PROFILES no te 'eduhoot' actiu en ${env_file}."
      exit 1
      ;;
  esac
  for f in mongo.archive uploads.tar logs.tar; do
    if [ ! -f "${backup_dir}/eduhoot/${f}" ]; then
      echo "El manifest declara eduhoot pero falta ${backup_dir}/eduhoot/${f}"
      exit 1
    fi
  done
fi

docker_cmd="${DOCKER:-docker}"
compose="$docker_cmd compose --env-file $env_file -f compose.yml"

$compose down

mkdir -p data backups
if [ -f data/id.db ]; then
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  cp data/id.db "backups/id-before-restore-${stamp}.db"
  echo "Copia de seguretat previa: backups/id-before-restore-${stamp}.db"
fi

cp "$backup_db" data/id.db
rm -f data/id.db-wal data/id.db-shm

echo "Base restaurada des de: $backup_dir"

if [ "$eduhoot_in_backup" = "1" ]; then
  # Els directoris d'eduhoot son propietat de l'uid intern del contenidor node
  # (eduhoot no te PUID/PGID com id-api), aixi que rm/tar com a usuari de
  # l'host pot no tindre permisos d'escriptura. S'executen amb la imatge
  # mongo:7 (ja necessaria per eduhoot-mongo, sense pull addicional) com a
  # root dins del contenidor, que si que pot llegir i sobreescriure els
  # fitxers independentment del seu propietari.
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  abs_backup_eduhoot="$(cd "${backup_dir}/eduhoot" && pwd)"
  for entry in "eduhoot-uploads:uploads.tar" "eduhoot-logs:logs.tar"; do
    d="${entry%%:*}"
    tar_name="${entry#*:}"
    $docker_cmd run --rm \
      -v "$(pwd)/data:/data" \
      -v "$(pwd)/backups:/backups" \
      -v "${abs_backup_eduhoot}:/restore:ro" \
      mongo:7 sh -c "
        set -e
        if [ -d \"/data/${d}\" ] && [ -n \"\$(find \"/data/${d}\" -mindepth 1 -print -quit)\" ]; then
          tar -C /data -cf \"/backups/${d}-before-restore-${stamp}.tar\" \"${d}\"
        fi
        rm -rf \"/data/${d}\"
        tar -C /data -xf \"/restore/${tar_name}\"
      "
    if [ -f "backups/${d}-before-restore-${stamp}.tar" ]; then
      echo "Copia de seguretat previa: backups/${d}-before-restore-${stamp}.tar"
    fi
  done
  echo "Uploads i informes de sessio d'eduhoot restaurats des de: $backup_dir"
fi

echo
echo "Arrancant serveis..."
$compose up -d --wait

if [ "$eduhoot_in_backup" = "1" ]; then
  echo
  echo "Restaurant base de dades d'eduhoot (kahootDB)..."
  $compose exec -T eduhoot-mongo mongorestore --quiet --archive --drop < "${backup_dir}/eduhoot/mongo.archive"
  echo "OK base de dades d'eduhoot restaurada"
fi

echo
echo "Comprovant salut dels serveis..."
portal_port="$(grep -E '^PORTAL_PORT=' "$env_file" 2>/dev/null | tail -n1 | cut -d= -f2)"
portal_port="${portal_port:-8082}"
curl -fsS "http://127.0.0.1:${portal_port}/api/health" >/dev/null
echo "OK portal saludable"

echo
echo "Executant make test-flow..."
./scripts/test-flow.sh

echo
echo "Restauracio completa i verificada."
