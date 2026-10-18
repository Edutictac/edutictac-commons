import re
from pathlib import Path

import yaml

ROOT = Path(__file__).parents[1]
BRANDING = ROOT / "authentik-branding"
BLUEPRINT = ROOT / "authentik-blueprints" / "edutictac-branding.yaml"


def compose_authentik_mounts():
    compose = yaml.safe_load((ROOT / "compose.yml").read_text(encoding="utf-8"))
    services = compose["services"]
    return {name: services[name]["volumes"] for name in ("authentik-server", "authentik-worker")}


def test_branding_mounts_point_to_existing_files():
    for mounts in compose_authentik_mounts().values():
        for mount in mounts:
            source = mount.split(":", 1)[0]
            if "authentik-branding" in source or "edutictac-branding" in source:
                assert (ROOT / source).exists(), source


def test_translation_chunk_matches_pinned_authentik_version():
    compose = (ROOT / "compose.yml").read_text(encoding="utf-8")
    tag = re.search(r"AUTHENTIK_TAG:-([0-9.]+)", compose).group(1)
    assert (BRANDING / "i18n" / tag / "es-ES.js").is_file()
    assert (BRANDING / "i18n" / tag / "django.mo").is_file()
    assert (BRANDING / "default-blueprints" / tag).is_dir()
    assert f"./authentik-branding/i18n/{tag}/es-ES.js:/web/dist/src/locales/chunks/" in compose


def test_brand_assets_are_local_and_exist():
    css = (BRANDING / "custom.css").read_text(encoding="utf-8")
    assert not re.search(r"https?://", css), "el CSS de marca no ha de dependre d'Internet"
    for path in re.findall(r"/static/dist/assets/edutictac/([\w/-]+\.[a-z0-9]+)", css + BLUEPRINT.read_text(encoding="utf-8")):
        assert (BRANDING / "assets" / path).is_file(), path


def test_default_flow_titles_are_translated():
    titles = {}
    for path in (BRANDING / "default-blueprints").glob("*/flow-*.yaml"):
        match = re.search(r"^\s+title: (.+)$", path.read_text(encoding="utf-8"), re.M)
        titles[path.name] = match.group(1)
    assert titles["flow-default-authentication-flow.yaml"] == '"Entra amb EduTicTac"'
    english = {name: title for name, title in titles.items()
               if "authentik" in title.lower() and name != "flow-oobe.yaml"}
    assert not english, english
