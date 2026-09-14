#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

repo_dir="${REPO_DIR:-$(pwd)}"
unit_dir="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
mkdir -p "$unit_dir"

sed "s#__REPO_DIR__#${repo_dir}#g" systemd/edutictac-commons-backup.service.template \
  > "${unit_dir}/edutictac-commons-backup.service"
cp systemd/edutictac-commons-backup.timer "${unit_dir}/edutictac-commons-backup.timer"

systemctl --user daemon-reload
systemctl --user enable --now edutictac-commons-backup.timer

echo "Timer instal·lat: edutictac-commons-backup.timer (diari a les 03:15, +/-10min)"
echo "Comprova amb: make backup-timer-status"
echo
echo "Si aquest usuari no manté sessió oberta habitualment, cal habilitar"
echo "linger perque el timer s'execute igualment:"
echo "  sudo loginctl enable-linger \$USER"
