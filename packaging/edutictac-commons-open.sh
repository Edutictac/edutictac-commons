#!/bin/sh
set -eu

env_file="${EDUTICTAC_ENV_FILE:-/opt/edutictac-commons/.env}"
[ -f "$env_file" ] || env_file="/opt/edutictac-commons/.env.example"

value() {
  key="$1"
  fallback="$2"
  line="$(grep -E "^${key}=" "$env_file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
  printf '%s\n' "${line:-$fallback}"
}

mdns_name="$(value EDUTICTAC_MDNS_NAME edutictac)"
case "$mdns_name" in
  *.local) ;;
  *) mdns_name="${mdns_name}.local" ;;
esac
public_host="$(value EDUTICTAC_PUBLIC_HOST '')"
primary="${public_host:-$mdns_name}"
port="$(value PORTAL_PORT 8082)"
suffix=""
[ "$port" = "80" ] || suffix=":${port}"
ip="${EDUTICTAC_OPEN_IP:-}"
if [ -z "$ip" ]; then
  ip="$(ip -4 route show default 2>/dev/null | awk '{for (i=1;i<=NF;i++) if ($i=="src") {print $(i+1); exit}}')"
fi
[ -n "$ip" ] || ip="$(hostname -I 2>/dev/null | awk '{print $1}')"
[ -n "$ip" ] || ip="127.0.0.1"

for host in "$primary" "$ip"; do
  [ -n "$host" ] || continue
  url="http://${host}${suffix}/"
  if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 2 -o /dev/null "$url" 2>/dev/null; then
    xdg-open "$url" >/dev/null 2>&1 &
    exit 0
  fi
done

xdg-open "http://${primary}${suffix}/" >/dev/null 2>&1 &
