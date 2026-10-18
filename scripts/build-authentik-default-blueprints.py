#!/usr/bin/env python3
"""Genera els blueprints per defecte d'Authentik amb els títols en valencià.

Copia /blueprints/default de la imatge fixada i canvia només el títol dels
fluxos per defecte. Es munta en lloc de l'original: així els blueprints
d'Authentik ja posen els títols d'EduTicTac i no competixen amb la marca.
Cal regenerar-ho abans de canviar AUTHENTIK_TAG.
"""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# fitxer: (títol original d'Authentik, títol d'EduTicTac)
FLOW_TITLES = {
    "flow-default-authentication-flow.yaml": ("Welcome to authentik!", "Entra amb EduTicTac"),
    "flow-default-authenticator-static-setup.yaml": ("Setup Static OTP Tokens", "Configura els codis de recuperació"),
    "flow-default-authenticator-totp-setup.yaml": ("Set up Two-Factor authentication", "Configura l'autenticació en dos passos"),
    "flow-default-authenticator-webauthn-setup.yaml": ("Setup WebAuthn", "Configura una clau de seguretat (WebAuthn)"),
    "flow-default-invalidation-flow.yaml": ("Default Invalidation Flow", "Has eixit d'EduTicTac"),
    "flow-default-provider-authorization-explicit-consent.yaml": ("Redirecting to %(app)s", "Redirigint a %(app)s"),
    "flow-default-provider-authorization-implicit-consent.yaml": ("Redirecting to %(app)s", "Redirigint a %(app)s"),
    "flow-default-provider-invalidation.yaml": ("You've logged out of %(app)s.", "Has eixit de %(app)s."),
    "flow-default-request-flow.yaml": ("Request access", "Sol·licita accés"),
    "flow-default-source-authentication.yaml": ("Welcome to authentik!", "Entra amb EduTicTac"),
    "flow-default-source-enrollment.yaml": (
        "Welcome to authentik! Please select a username.",
        "Benvinguda a EduTicTac! Tria un nom d'usuari.",
    ),
    "flow-default-user-settings-flow.yaml": ("Update your info", "Actualitza les teues dades"),
    "flow-password-change.yaml": ("Change password", "Canvia la contrasenya"),
}


def yaml_string(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tag", default="2026.8.3")
    args = parser.parse_args()
    image = f"ghcr.io/goauthentik/server:{args.tag}"
    target = ROOT / "authentik-branding" / "default-blueprints" / args.tag

    with tempfile.TemporaryDirectory() as tmp:
        container = subprocess.run(["docker", "create", image], check=True, capture_output=True,
                                   text=True).stdout.strip()
        try:
            subprocess.run(["docker", "cp", f"{container}:/blueprints/default", tmp], check=True)
        finally:
            subprocess.run(["docker", "rm", container], check=True, capture_output=True)
        source = Path(tmp) / "default"
        for name, (original, title) in FLOW_TITLES.items():
            path = source / name
            text = path.read_text(encoding="utf-8")
            pattern = re.compile(rf"^(\s+title: ){re.escape(original)}$", re.M)
            text, count = pattern.subn(lambda match: match.group(1) + yaml_string(title), text)
            if count != 1:
                raise SystemExit(f"{name}: s'esperava un títol «{original}» i n'hi ha {count}")
            path.write_text(text, encoding="utf-8")
        if target.exists():
            shutil.rmtree(target)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(source, target)
    print(f"Blueprints per defecte generats en {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
