#!/bin/sh
set -eu

mkdir -p /data
chown app:app /data

exec su -s /bin/sh app -c "$*"
