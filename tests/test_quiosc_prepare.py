import ast
import configparser
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parents[1]
SETUP = ROOT / "scripts/setup-quiosc-local.py"


def unit(name):
    parser = configparser.ConfigParser(strict=False, interpolation=None)
    parser.optionxform = str
    parser.read(ROOT / "packaging" / name)
    return parser


def test_auto_without_epoptes_is_a_quiet_no_op(tmp_path):
    env = tmp_path / ".env"
    env.write_text("QUIOSC_MODE=disabled\n")
    result = subprocess.run([sys.executable, str(SETUP), "--auto", "--project", str(tmp_path),
                             "--socket", str(tmp_path / "missing.socket")],
                            capture_output=True, text=True)
    assert result.returncode == 0
    assert "Sense servidor Epoptes" in result.stdout
    assert env.read_text() == "QUIOSC_MODE=disabled\n"


def test_manual_preparation_still_explains_missing_epoptes(tmp_path):
    result = subprocess.run([sys.executable, str(SETUP), "--check", "--project", str(tmp_path),
                             "--socket", str(tmp_path / "missing.socket")],
                            capture_output=True, text=True)
    assert result.returncode == 1
    assert "Epoptes" in result.stderr


def test_preparation_never_enables_quiosc():
    # Les claus que escriu la preparació es definixen en un únic diccionari.
    tree = ast.parse(SETUP.read_text(encoding="utf-8"))
    prepared = [node for node in ast.walk(tree) if isinstance(node, ast.Dict)
                and any(isinstance(key, ast.Constant) and key.value == "QUIOSC_DISCOVERY" for key in node.keys)]
    assert prepared
    keys = {key.value for node in prepared for key in node.keys if isinstance(key, ast.Constant)}
    assert "QUIOSC_MODE" not in keys


def test_prepare_units_cannot_loop_and_only_prepare():
    path = unit("edutictac-quiosc-prepare.path")
    service = unit("edutictac-quiosc-prepare.service")
    assert path["Path"]["PathExists"] == "/run/epoptes/epoptes.socket"
    assert path["Path"]["Unit"] == "edutictac-quiosc-prepare.service"
    assert service["Service"]["Type"] == "oneshot"
    assert service["Service"]["RemainAfterExit"] == "yes"
    assert service["Service"]["ExecStart"].endswith("setup-quiosc-local.py --auto")
    assert "--deploy" not in service["Service"]["ExecStart"]


def test_package_installs_and_enables_prepare_units():
    build = (ROOT / "packaging/build-deb.sh").read_text(encoding="utf-8")
    postinst = (ROOT / "packaging/debian/postinst").read_text(encoding="utf-8")
    prerm = (ROOT / "packaging/debian/prerm").read_text(encoding="utf-8")
    assert "edutictac-quiosc-prepare.path edutictac-quiosc-prepare.service" in build
    assert "systemctl enable --now edutictac-quiosc-prepare.path" in postinst
    assert "systemctl restart --no-block edutictac-quiosc-prepare.service" in postinst
    assert "systemctl disable edutictac-quiosc-prepare.path" in prerm
