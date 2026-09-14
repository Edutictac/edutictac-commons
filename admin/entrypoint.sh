#!/bin/sh
set -eu

if [ "$(id -u)" = "0" ]; then
  chown app:app /app
  exec su -s /bin/sh app -c "$*"
fi

exec "$@"
