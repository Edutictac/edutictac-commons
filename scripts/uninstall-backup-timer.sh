#!/usr/bin/env sh
set -eu

unit_dir="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"

systemctl --user disable --now edutictac-commons-backup.timer 2>/dev/null || true
rm -f "${unit_dir}/edutictac-commons-backup.service" "${unit_dir}/edutictac-commons-backup.timer"
systemctl --user daemon-reload

echo "Timer desinstal·lat"
