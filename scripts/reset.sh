#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
if [ ! -f "$env_file" ]; then
  env_file=".env.example"
fi

${DOCKER:-docker} compose --env-file "$env_file" -f compose.yml down
rm -f data/id.db data/id.db-wal data/id.db-shm

echo "Demo reiniciada. Arranca amb: make up"
