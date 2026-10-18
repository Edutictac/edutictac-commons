import configparser
import importlib.util
import os
from pathlib import Path

ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location("quiosc_bridge", ROOT / "scripts/quiosc-epoptes-bridge.py")
bridge = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(bridge)

# Extracte real de LliureX 23 (n4d EpoptesFilter i EpoptesServer).
FILTER_PLUGIN = """
class EpoptesFilter:
\tdef __init__(self):
\t\tself.allowed_groups=[0,1000,10001,10003]
"""
OUTPUT_RULES = """-P OUTPUT ACCEPT
-A OUTPUT -p tcp -m owner --gid-owner 10003 --suppl-groups -m tcp --dport 10000 -j ACCEPT
-A OUTPUT -p tcp -m owner --gid-owner 10001 --suppl-groups -m tcp --dport 10000 -j ACCEPT
-A OUTPUT -p tcp -m owner --gid-owner 1000 --suppl-groups -m tcp --dport 10000 -j ACCEPT
-A OUTPUT -p tcp -m owner --gid-owner 0 --suppl-groups -m tcp --dport 10000 -j ACCEPT
-A OUTPUT -p tcp -m tcp --dport 10000 -j DROP
"""


def test_allowed_groups_follow_lliurex_policy_without_root(tmp_path):
    plugin = tmp_path / "EpoptesFilter.py"
    plugin.write_text(FILTER_PLUGIN)
    assert bridge.allowed_gids(plugin, OUTPUT_RULES) == [1000, 10001, 10003]


def test_allowed_groups_include_runtime_rules(tmp_path):
    plugin = tmp_path / "EpoptesFilter.py"
    plugin.write_text("allowed_groups=[0,10003]")
    extra = OUTPUT_RULES + "-A OUTPUT -p tcp -m owner --gid-owner 2000 --suppl-groups -m tcp --dport 10000 -j ACCEPT\n"
    assert bridge.allowed_gids(plugin, extra) == [1000, 2000, 10001, 10003]


def test_loopback_registration_detected_only_for_accept_rule():
    closed = "-A INPUT -p tcp -m tcp --dport 10000 -j DROP\n"
    opened = "-A INPUT -s 127.0.0.1/32 -p tcp -m tcp --dport 10000 -j ACCEPT\n" + closed
    other = "-A INPUT -s 192.168.122.20/32 -p tcp -m tcp --dport 10000 -j ACCEPT\n" + closed
    assert not bridge.loopback_registered(closed)
    assert bridge.loopback_registered(opened)
    assert not bridge.loopback_registered(other)


def fake_proc(tmp_path, owner_uid, cmdline, inode="4242", address="00000000"):
    proc = tmp_path / "proc"
    (proc / "net").mkdir(parents=True)
    (proc / "net/tcp").write_text(
        "  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode\n"
        "   0: %s:2710 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 %s 1\n"
        % (address, inode))
    pid = proc / "772"
    (pid / "fd").mkdir(parents=True)
    os.symlink("socket:[%s]" % inode, pid / "fd/7")
    (pid / "status").write_text("Name:\ttwistd3\nUid:\t%d\t%d\t%d\t%d\n" % ((owner_uid,) * 4))
    (pid / "cmdline").write_bytes(b"\0".join(cmdline) + b"\0")
    return proc


def test_listener_must_be_root_epoptes_daemon(tmp_path):
    daemon = [b"/usr/bin/python3", b"/usr/bin/twistd3", b"--nodaemon", b"--pidfile=", b"epoptes"]
    assert bridge.listener_is_root_epoptes(10000, fake_proc(tmp_path / "a", 0, daemon))
    assert not bridge.listener_is_root_epoptes(10000, fake_proc(tmp_path / "b", 1000, daemon))
    assert not bridge.listener_is_root_epoptes(10000, fake_proc(tmp_path / "c", 0, [b"/usr/bin/python3", b"fake.py"]))


def test_no_listener_means_no_bridge(tmp_path):
    proc = fake_proc(tmp_path, 0, [b"twistd3", b"epoptes"], address="0F02000A")
    assert not bridge.listener_is_root_epoptes(10000, proc)


def test_socket_unit_is_lliurex_only_and_per_connection():
    unit = configparser.ConfigParser(strict=False, interpolation=None)
    unit.optionxform = str
    unit.read(ROOT / "packaging/edutictac-quiosc-epoptes.socket")
    assert unit["Socket"]["Accept"] == "yes"
    assert unit["Socket"]["SocketMode"] == "0600"
    text = (ROOT / "packaging/edutictac-quiosc-epoptes.socket").read_text()
    assert "ConditionPathExists=/usr/share/n4d/python-plugins/EpoptesServer.py" in text
    service = (ROOT / "packaging/edutictac-quiosc-epoptes@.service").read_text()
    assert "StandardInput=socket" in service and "quiosc-epoptes-bridge.py relay" in service


def test_setup_prefers_standard_socket_then_bridge():
    source = (ROOT / "scripts/setup-quiosc-local.py").read_text()
    assert "SOCKET_CANDIDATES = (Path('/run/epoptes/epoptes.socket'), Path('/run/edutictac-quiosc-epoptes/epoptes.socket'))" in source
    path_unit = (ROOT / "packaging/edutictac-quiosc-prepare.path").read_text()
    assert "PathExists=/run/edutictac-quiosc-epoptes/epoptes.socket" in path_unit
