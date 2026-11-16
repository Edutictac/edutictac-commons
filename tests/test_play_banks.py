"""Shared external image banks: anonymous search and content with no real network."""

import sys
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).parents[1] / "services" / "play"))

from playcore.edutictac_banks import Banks, testing  # noqa: E402

PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32


def handler(request):
    url = str(request.url)
    if "/pictograms/es/search/casa" in url:
        return httpx.Response(200, json=[{
            "_id": 6964,
            "keywords": [{"keyword": "casa", "type": 2}, {"keyword": "hogar", "type": 2}],
            "categories": ["residential building"],
        }])
    if "static.arasaac.org" in url:
        return httpx.Response(200, content=PNG, headers={"content-type": "image/png"})
    return httpx.Response(404, json={"error": "missing"})


def test_arasaac_search_and_content_are_anonymous_and_credited(monkeypatch):
    testing.install(monkeypatch, handler)
    banks = Banks(image_prefix="/play/api/banks")
    result = banks.search("arasaac", "casa", "es")
    assert result["provider"] == "arasaac"
    assert result["commercial_use"] is False
    item = result["items"][0]
    assert item["id"] == 6964
    assert item["title"] == "casa"
    assert item["thumbnail_url"] == "/play/api/banks/arasaac/6964/thumbnail"
    assert item["content_url"] == "/play/api/banks/arasaac/6964/content"
    assert "ARASAAC" in item["credit"] and "CC BY-NC-SA 4.0" in item["credit"]
    data, media_type = banks.image("arasaac", "6964", 300)
    assert data == PNG and media_type == "image/png"


def test_only_the_four_image_providers_are_exposed_by_play():
    providers = {provider["id"] for provider in Banks().providers()}
    assert {"arasaac", "openverse", "wikimedia", "met"} <= providers
