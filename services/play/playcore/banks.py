"""Anonymous, read-only access to the shared external image banks.

The provider engines live in the shared MIT package `edutictac_banks` (synced
with `scripts/sync-banks.sh`); this module only exposes the image providers and
applies Play's own availability flag and rate limiting.
"""

from __future__ import annotations

from .config import PLAY_BANKS_ENABLED, URL_PREFIX

try:
    from .edutictac_banks import Banks, BankError
except ImportError:  # httpx not installed: the rest of Play still works.
    Banks = None

    class BankError(Exception):
        def __init__(self, status: int, code: str):
            self.status, self.code = status, code

IMAGE_PROVIDERS = ("arasaac", "openverse", "wikimedia", "met")

_banks = Banks(image_prefix=f"{URL_PREFIX}/api/banks") if PLAY_BANKS_ENABLED and Banks else None


def available() -> bool:
    return _banks is not None


def providers() -> list[dict]:
    if _banks is None:
        return []
    return [provider for provider in _banks.providers() if provider["id"] in IMAGE_PROVIDERS]


def search(provider: str, query: str, language: str, owner: str) -> dict:
    if _banks is None:
        raise BankError(503, "banks_unavailable")
    if provider not in IMAGE_PROVIDERS:
        raise BankError(422, "bank_provider")
    _banks.rate(owner)
    return _banks.search(provider, query, language)


def image(provider: str, identifier: str, size: int, owner: str) -> tuple[bytes, str]:
    if _banks is None:
        raise BankError(503, "banks_unavailable")
    if provider not in IMAGE_PROVIDERS:
        raise BankError(422, "bank_provider")
    _banks.rate(owner)
    return _banks.image(provider, identifier, size)
