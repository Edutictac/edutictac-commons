"""LAN/mDNS and IP fallback configuration."""

from pathlib import Path

ROOT = Path(__file__).parents[1]


def test_installer_limits_avahi_to_physical_interfaces_and_supports_ip():
    text = (ROOT / 'packaging/debian/postinst').read_text()
    assert 'EDUTICTAC_PUBLIC_HOST' in text
    assert 'allow-interfaces=' in text
    assert 'docker' in text and 'br-' in text and 'veth' in text


def test_lan_doctor_and_docs_exist():
    assert (ROOT / 'scripts/lan-doctor.sh').is_file()
    docs = (ROOT / 'docs/LAN-SENSE-INTERNET.md').read_text()
    assert 'EDUTICTAC_PUBLIC_HOST' in docs
    assert 'mDNS' in docs
    assert 'IP' in docs
