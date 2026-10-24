#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

env_file=".env"
[ -f "$env_file" ] || env_file=".env.example"

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
portal_port="$(value PORTAL_PORT 8082)"
play_port="$(value PLAY_PORT 8084)"
recursos_port="$(value RECURSOS_PORT 8086)"
eduhoot_port="$(value EDUHOOT_PORT 8090)"
llibres_port="$(value LLIBRES_PORT 8098)"
ip="$(hostname -I 2>/dev/null | awk '{print $1}')"
ip="${ip:-127.0.0.1}"

echo "== Accés previst =="
if [ -n "$public_host" ]; then
  echo "Host públic configurat: $public_host"
else
  echo "Host mDNS: $mdns_name"
fi
echo "IP detectada: $ip"
echo

echo "== mDNS =="
resolved=""
bad_mdns=0
if command -v avahi-resolve >/dev/null 2>&1; then
  resolved="$(avahi-resolve -4 -n "$mdns_name" 2>/dev/null | awk '{print $2}' | head -n 1 || true)"
  if [ -z "$resolved" ] || [ "$bad_mdns" = "1" ]; then
    echo "AVIS: $mdns_name no resol per mDNS en este equip."
  else
    echo "$mdns_name -> $resolved"
    case "$resolved" in
      172.1[6-9].*|172.2[0-9].*|172.3[01].*|127.*|169.254.*|fe80:*)
        bad_mdns=1
        echo "AVIS: mDNS apunta a una adreça interna/Docker; altres equips de la LAN no hi podran arribar."
        echo "      Revisa 'allow-interfaces' a /etc/avahi/avahi-daemon.conf."
        ;;
    esac
  fi
else
  echo "AVIS: falta avahi-resolve; no es pot comprovar mDNS."
fi
grep -nE '^\[server\]|allow-interfaces|deny-interfaces|host-name' /etc/avahi/avahi-daemon.conf 2>/dev/null | head -10 || true
echo

echo "== Ports del portal i les apps =="
for entry in "portal:$portal_port" "play:$play_port" "recursos:$recursos_port" "eduhoot:$eduhoot_port" "llibres:$llibres_port"; do
  name="${entry%%:*}"
  port="${entry##*:}"
  printf '%-10s IP ' "$name"
  curl -s -o /dev/null -w '%{http_code}' --max-time 3 "http://${ip}:${port}/" 2>/dev/null || printf 'FAIL'
  printf '  mDNS '
  curl -s -o /dev/null -w '%{http_code}' --max-time 3 "http://${mdns_name}:${port}/" 2>/dev/null || printf 'FAIL'
  echo
done
echo

echo "== Internet (només informatiu) =="
if curl -s -o /dev/null --max-time 3 https://example.com 2>/dev/null; then
  echo "Hi ha Internet. Els serveis locals no l'haurien de necessitar."
else
  echo "Sense Internet. Si el portal i les apps responen per IP, la LAN és operativa."
fi
echo

if [ -z "$resolved" ] || [ "$bad_mdns" = "1" ]; then
  echo "Recomanació: entra pel navegador amb http://${ip}:${portal_port}/"
  echo "Per al login docent per IP, posa EDUTICTAC_PUBLIC_HOST=${ip} i reaplica la configuració."
fi
