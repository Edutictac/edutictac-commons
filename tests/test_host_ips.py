import importlib.util
import stat
from pathlib import Path

ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location("update_host_ips", ROOT / "scripts/update-host-ips.py")
host_ips = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(host_ips)


def test_keeps_only_exact_global_addresses():
    output = """1: lo    inet 127.0.0.1/8 scope host lo
2: eth0    inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0
3: eth1    inet6 fe80::1/64 scope link
4: tailscale0    inet 100.74.151.108/32 scope global tailscale0
5: eth0    inet6 2001:db8::50/64 scope global
"""
    assert [str(address) for address in host_ips.parse_addresses(output)] == [
        "192.168.1.50", "100.74.151.108", "2001:db8::50"
    ]


def test_updates_env_without_touching_other_settings(tmp_path):
    env = tmp_path / ".env"
    env.write_text("BACKUP_AGE_RECIPIENT=age1synthetic\nEDUTICTAC_HOST_IPS=old\n")
    env.chmod(0o600)
    changed = host_ips.update(tmp_path, [host_ips.ipaddress.ip_address("192.168.1.50")])
    assert changed is True
    assert env.read_text() == "BACKUP_AGE_RECIPIENT=age1synthetic\nEDUTICTAC_HOST_IPS=192.168.1.50\n"
    assert stat.S_IMODE(env.stat().st_mode) == 0o600
    assert host_ips.update(tmp_path, [host_ips.ipaddress.ip_address("192.168.1.50")]) is False


def test_service_refreshes_host_ips_before_compose():
    service = (ROOT / "packaging/edutictac-commons.service").read_text()
    assert "ExecStartPre=/usr/bin/python3 /opt/edutictac-commons/scripts/update-host-ips.py" in service
    script = (ROOT / "services/portal/nginx/25-admin-local-access.sh").read_text()
    assert "EDUTICTAC_HOST_IPS" in script
    compose = (ROOT / "compose.yml").read_text()
    assert "EDUTICTAC_HOST_IPS: ${EDUTICTAC_HOST_IPS:-}" in compose
    assert "25-admin-local-access.sh:/docker-entrypoint.d/25-admin-local-access.sh:ro" in compose
