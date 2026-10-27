"""Configuració de l'ID API llegida una sola vegada de l'entorn."""

from __future__ import annotations

import os
from collections.abc import Mapping
from dataclasses import dataclass, field

from .origins import parse_origins


@dataclass
class Settings:
    environment: str = "development"
    db_path: str = "/var/lib/edutictac-id-api/id.db"
    session_secret: str = ""
    teacher_token: str = ""
    app_token: str = ""
    app_tokens: dict[str, str] = field(default_factory=dict)
    cookie_domain: str = ""
    cookie_secure: bool = True
    pin_hash_iterations: int = 210000
    oidc_issuer_url: str = ""
    oidc_discovery_url: str = ""
    oidc_authorization_url: str = ""
    oidc_client_id: str = ""
    oidc_client_secret: str = ""
    oidc_redirect_url: str = ""
    oidc_scopes: str = "openid profile"
    oidc_role_claim: str = "roles"
    setup_token: str = ""
    authentik_bootstrap_password: str = ""
    resources_api_url: str = "http://recursos-api:8004"
    # Llocs propis que poden mostrar la sessió central i rebre el retorn `next`.
    allowed_origins: tuple[str, ...] = field(default_factory=tuple)
    # Pàgina del compte en Authentik («canviar contrasenya», perfil).
    account_url: str = ""
    classroom_transfer_enabled: bool = True

    files_dir: str = ""
    files_disk_reserve_bytes: int = 256 * 1024**2
    file_defaults: dict = field(default_factory=dict)

    @classmethod
    def from_env(cls, env: Mapping[str, str] | None = None) -> Settings:
        env = os.environ if env is None else env
        return cls(
            files_dir=env.get("EDUTICTAC_ID_FILES_DIR", ""),
            files_disk_reserve_bytes=int(env.get("EDUTICTAC_ID_FILES_DISK_RESERVE_BYTES", str(cls.files_disk_reserve_bytes))),
            file_defaults={key: int(env[name]) for key,name in [("max_file_bytes","EDUTICTAC_ID_FILES_MAX_BYTES"),("group_quota_bytes","EDUTICTAC_ID_FILES_GROUP_QUOTA_BYTES"),("student_quota_bytes","EDUTICTAC_ID_FILES_STUDENT_QUOTA_BYTES")] if name in env} | ({"students_can_upload": env["EDUTICTAC_ID_FILES_STUDENTS_CAN_UPLOAD"] != "0"} if "EDUTICTAC_ID_FILES_STUDENTS_CAN_UPLOAD" in env else {}),
            environment=env.get("EDUTICTAC_ENV", "development").strip().lower() or "development",
            db_path=env.get("EDUTICTAC_ID_DB", cls.db_path),
            session_secret=env.get("EDUTICTAC_ID_SECRET", ""),
            teacher_token=env.get("EDUTICTAC_ID_TEACHER_TOKEN", ""),
            app_token=env.get("EDUTICTAC_ID_APP_TOKEN", ""),
            app_tokens={
                "edutictac-play": env.get("PLAY_ID_APP_TOKEN", "").strip(),
                "eduhoot": env.get("EDUHOOT_ID_APP_TOKEN", "").strip(),
                "recursos": env.get("RECURSOS_ID_APP_TOKEN", "").strip(),
            },
            cookie_domain=env.get("EDUTICTAC_ID_COOKIE_DOMAIN", ""),
            cookie_secure=env.get("EDUTICTAC_ID_COOKIE_SECURE", "1") != "0",
            pin_hash_iterations=int(env.get("EDUTICTAC_ID_PIN_HASH_ITERATIONS", "210000")),
            oidc_issuer_url=env.get("EDUTICTAC_ID_OIDC_ISSUER_URL", "").strip().rstrip("/"),
            oidc_discovery_url=env.get("EDUTICTAC_ID_OIDC_DISCOVERY_URL", "").strip(),
            oidc_authorization_url=env.get("EDUTICTAC_ID_OIDC_AUTHORIZATION_URL", "").strip(),
            oidc_client_id=env.get("EDUTICTAC_ID_OIDC_CLIENT_ID", "").strip(),
            oidc_client_secret=env.get("EDUTICTAC_ID_OIDC_CLIENT_SECRET", ""),
            oidc_redirect_url=env.get("EDUTICTAC_ID_OIDC_REDIRECT_URL", "").strip(),
            oidc_scopes=env.get("EDUTICTAC_ID_OIDC_SCOPES", "openid profile").strip(),
            oidc_role_claim=env.get("EDUTICTAC_ID_OIDC_ROLE_CLAIM", "roles").strip() or "roles",
            setup_token=env.get("EDUTICTAC_SETUP_TOKEN", "").strip(),
            authentik_bootstrap_password=env.get("EDUTICTAC_AUTHENTIK_BOOTSTRAP_PASSWORD", ""),
            resources_api_url=env.get("EDUTICTAC_RESOURCES_API_URL", cls.resources_api_url).rstrip("/"),
            allowed_origins=parse_origins(env.get("EDUTICTAC_ID_ALLOWED_ORIGINS", "")),
            account_url=env.get("EDUTICTAC_ID_ACCOUNT_URL", "").strip(),
            classroom_transfer_enabled=env.get("EDUTICTAC_CLASSROOM_TRANSFER_ENABLED", "1") == "1",
        )

    def validate_production_secrets(self) -> None:
        """Fail closed when a production deployment keeps known demo secrets."""
        if self.environment != "production":
            return
        problems: list[str] = []
        if len(self.session_secret) < 32 or self.session_secret in {"change-this-local-secret"}:
            problems.append("EDUTICTAC_ID_SECRET")
        if len(self.teacher_token) < 24 or self.teacher_token in {"dev-teacher"}:
            problems.append("EDUTICTAC_ID_TEACHER_TOKEN")
        if len(self.app_token) < 24 or self.app_token in {"dev-app-token"}:
            problems.append("EDUTICTAC_ID_APP_TOKEN")
        if self.oidc_configured and (
            len(self.oidc_client_secret) < 16 or self.oidc_client_secret in {"change-this-oidc-client-secret"}
        ):
            problems.append("EDUTICTAC_ID_OIDC_CLIENT_SECRET")
        if problems:
            raise RuntimeError("unsafe production secrets: " + ", ".join(problems))

    def token_for_app(self, app_id: str) -> str:
        return self.app_tokens.get(app_id, "") or self.app_token

    @property
    def oidc_configured(self) -> bool:
        """Hi ha prou dades per a registrar el client OIDC."""
        return bool(self.oidc_issuer_url and self.oidc_client_id and self.oidc_client_secret)

    @property
    def oidc_enabled(self) -> bool:
        return self.oidc_configured and bool(self.oidc_redirect_url)

    def oidc_metadata_url(self) -> str:
        if self.oidc_discovery_url:
            return self.oidc_discovery_url
        if not self.oidc_issuer_url:
            return ""
        if self.oidc_issuer_url.endswith("/.well-known/openid-configuration"):
            return self.oidc_issuer_url
        return f"{self.oidc_issuer_url}/.well-known/openid-configuration"

    def oidc_accepted_issuers(self) -> list[str]:
        accepted = {self.oidc_issuer_url, f"{self.oidc_issuer_url}/"}
        if self.oidc_discovery_url:
            accepted.add(f"{self.oidc_discovery_url.split('/.well-known/', 1)[0].rstrip('/')}/")
        return sorted(value for value in accepted if value)
