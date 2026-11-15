"""Fail-closed production secrets and per-application app tokens."""

import sys
from pathlib import Path
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

ROOT = Path(__file__).parents[1] / 'services/id-api'
sys.path.insert(0, str(ROOT / 'vendor'))
sys.path.insert(0, str(ROOT))

from idapi.auth import Auth  # noqa: E402
from idapi.settings import Settings  # noqa: E402


def production(**values):
    data = dict(
        environment='production',
        session_secret='s' * 48,
        teacher_token='t' * 32,
        app_token='a' * 32,
        oidc_client_secret='',
    )
    data.update(values)
    return Settings(**data)


def test_production_accepts_strong_secrets():
    production().validate_production_secrets()


@pytest.mark.parametrize('values,field', [
    ({'session_secret': 'change-this-local-secret'}, 'EDUTICTAC_ID_SECRET'),
    ({'session_secret': 'short'}, 'EDUTICTAC_ID_SECRET'),
    ({'teacher_token': 'dev-teacher'}, 'EDUTICTAC_ID_TEACHER_TOKEN'),
    ({'app_token': 'dev-app-token'}, 'EDUTICTAC_ID_APP_TOKEN'),
    ({'oidc_client_secret': 'short', 'oidc_issuer_url': 'https://id.example', 'oidc_client_id': 'x'}, 'EDUTICTAC_ID_OIDC_CLIENT_SECRET'),
])
def test_production_rejects_weak_or_demo_secrets(values, field):
    with pytest.raises(RuntimeError, match=field):
        production(**values).validate_production_secrets()


def test_development_allows_demo_secrets():
    Settings(environment='development', session_secret='change-this-local-secret',
             teacher_token='dev-teacher', app_token='dev-app-token').validate_production_secrets()


def test_app_token_is_scoped_per_application():
    settings = Settings(
        environment='development',
        session_secret='s' * 48,
        app_token='global-token',
        app_tokens={'edutictac-play': 'play-token', 'eduhoot': 'eduhoot-token'},
    )
    auth = Auth(settings, None, None)

    def request(token):
        return SimpleNamespace(headers={'authorization': f'Bearer {token}'})

    auth.require_app_token(request('play-token'), 'edutictac-play')
    auth.require_app_token(request('eduhoot-token'), 'eduhoot')
    auth.require_app_token(request('global-token'), 'edutictac-otra')
    auth.require_app_token(request('play-token'))  # ruta interna sense app_id
    with pytest.raises(HTTPException):
        auth.require_app_token(request('global-token'), 'edutictac-play')
    with pytest.raises(HTTPException):
        auth.require_app_token(request('play-token'), 'eduhoot')


def test_one_origin_list_serves_sessions_and_rebost():
    """EDUTICTAC_ID_ALLOWED_ORIGINS is the single list; REBOST_ALLOWED_ORIGINS only overrides it on purpose."""
    base = {'EDUTICTAC_ID_ALLOWED_ORIGINS': 'https://crea.example.test, https://llibres.example.test/'}
    shared = Settings.from_env(base)
    assert shared.allowed_origins == ('https://crea.example.test', 'https://llibres.example.test')
    assert shared.rebost_allowed_origins == shared.allowed_origins
    narrowed = Settings.from_env({**base, 'REBOST_ALLOWED_ORIGINS': 'https://crea.example.test'})
    assert narrowed.rebost_allowed_origins == ('https://crea.example.test',)
    assert narrowed.allowed_origins == shared.allowed_origins
    assert Settings.from_env({}).rebost_allowed_origins == ()
    with pytest.raises(ValueError):
        Settings.from_env({'EDUTICTAC_ID_ALLOWED_ORIGINS': 'https://*.example.test'})
