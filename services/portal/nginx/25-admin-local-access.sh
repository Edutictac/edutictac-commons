#!/bin/sh
set -eu

# Docker may allocate 10.x or 192.168.x bridges instead of 172.x. Only infer
# connected routes on a veth interface, never a host's physical LAN routes.
# The TLS ingress checks its original client before forwarding to this bridge.
target=/etc/nginx/admin-local-access.conf
temporary="$(mktemp /etc/nginx/.admin-local-access.XXXXXX)"
trap 'rm -f "$temporary"' EXIT
{
    printf '%s\n' 'allow 127.0.0.1;' 'allow ::1;' 'allow 100.64.0.0/10;' 'allow fd7a:115c:a1e0::/48;'
    for address in $(printf '%s' "${EDUTICTAC_HOST_IPS:-}" | tr ',' ' '); do
        case "$address" in
            ''|*[!0-9A-Fa-f:.]*) continue ;;
        esac
        printf 'allow %s;\n' "$address"
    done
    if ip -o link show dev eth0 2>/dev/null | grep -q 'eth0@if'; then
        ip -4 route show scope link | while read -r network rest; do
            case "$rest" in
                "dev eth0 "*) printf 'allow %s;\n' "$network" ;;
            esac
        done
    fi
    printf '%s\n' 'deny all;'
} > "$temporary"
mv "$temporary" "$target"
