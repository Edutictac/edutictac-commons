# Shared host-operation lock. Source after changing to the installation directory.
if [ "${COMMONS_OPERATION_LOCK_HELD:-0}" != "1" ]; then
  mkdir -p data
  exec 9<>data/.stack-operation.lock
  if ! flock -n 9; then
    echo "Una altra operació de manteniment està en marxa. Torna-ho a provar quan acabe." >&2
    exit 1
  fi
  COMMONS_OPERATION_LOCK_HELD=1
  export COMMONS_OPERATION_LOCK_HELD
fi
