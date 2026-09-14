#!/bin/sh
set -eu

mkdir -p /data

if [ "$(id -u)" = "0" ]; then
  chown app:app /data
  exec su -s /bin/sh app -c "$*"
fi

exec "$@"
