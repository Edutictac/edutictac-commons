import pytest

from services.play.recursos import RecursosContractError, activity_version, build_publish_payload


def test_publish_payload_is_deterministic_and_contains_play_links():
    activity = {
        "id": "Ab12Cd34",
        "type": "multiple-choice",
        "title": "Animales",
        "question": "¿Cuál vuela?",
        "language": "es",
        "visibility": "public",
        "tags": ["ciencias", "ciencias"],
        "license": "CC BY-SA",
    }
    payload = build_publish_payload(activity, public_base_url="https://edutictac.es")

    assert payload["contract_version"] == "1"
    assert payload["external_id"] == "edutictac-play:Ab12Cd34"
    assert payload["idempotency_key"].endswith(activity_version(activity))
    assert payload["canonical_url"] == "https://edutictac.es/play/Ab12Cd34"
    assert payload["download_url"].endswith("/Ab12Cd34/download")
    assert payload["metadata"]["tags"] == ["ciencias"]
    assert payload["package"] == {"format": "h5p", "delivery": "download_url"}


def test_private_activity_cannot_be_published():
    with pytest.raises(RecursosContractError, match="only public"):
        build_publish_payload(
            {"id": "Ab12Cd34", "type": "memory", "title": "Privada", "visibility": "private"},
            public_base_url="https://example.test",
        )


def test_fill_blanks_activity_can_be_published():
    payload = build_publish_payload(
        {
            "id": "Fill1234",
            "type": "fill-blanks",
            "title": "Ciencia",
            "visibility": "public",
        },
        public_base_url="https://example.test",
    )

    assert payload["metadata"]["type"] == "fill-blanks"
    assert payload["canonical_url"].endswith("/play/Fill1234")


def test_unknown_type_cannot_be_published():
    with pytest.raises(RecursosContractError, match="unsupported"):
        build_publish_payload(
            {"id": "Ab12Cd34", "type": "unknown", "title": "Actividad", "visibility": "public"},
            public_base_url="https://example.test",
        )
