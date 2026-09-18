import importlib.util
import json
from pathlib import Path

import pytest


ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location("content_sync", ROOT / "admin/content_sync.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def make_catalogue(tmp_path):
    source = tmp_path / "source"
    source.mkdir()
    artifact = source / "resources" / "example.txt"
    artifact.parent.mkdir()
    artifact.write_text("contingut de prova\n", encoding="utf-8")
    import hashlib

    digest = hashlib.sha256(artifact.read_bytes()).hexdigest()
    (source / "manifest.json").write_text(
        json.dumps(
            {
                "schema_version": 1,
                "catalog_version": "test.1",
                "published_at": "2026-09-18T00:00:00Z",
                "source": "test",
                "items": [
                    {
                        "id": "resources:example",
                        "channel": "resources",
                        "title": "Example",
                        "language": "va",
                        "license": "CC BY-SA 4.0",
                        "revision": 1,
                        "artifact": {
                            "path": "resources/example.txt",
                            "sha256": digest,
                            "media_type": "text/plain",
                        },
                    }
                ],
            }
        ),
        encoding="utf-8",
    )
    return source


def test_sync_channel_stages_selected_channel_atomically(tmp_path, monkeypatch):
    source = make_catalogue(tmp_path)

    def download(url, destination, timeout):
        relative = url.removeprefix("http://catalogue/")
        destination.write_bytes((source / relative).read_bytes())

    monkeypatch.setattr(MODULE, "_download", download)
    result = MODULE.sync_channel("resources", "http://catalogue", tmp_path / "sync")

    assert result["version"] == "test.1"
    assert (tmp_path / "sync/resources/current/resources/example.txt").read_text() == "contingut de prova\n"


def test_sync_channel_rejects_hash_mismatch_without_activation(tmp_path, monkeypatch):
    source = make_catalogue(tmp_path)
    payload = json.loads((source / "manifest.json").read_text())
    payload["items"][0]["artifact"]["sha256"] = "0" * 64
    (source / "manifest.json").write_text(json.dumps(payload), encoding="utf-8")

    def download(url, destination, timeout):
        relative = url.removeprefix("http://catalogue/")
        destination.write_bytes((source / relative).read_bytes())

    monkeypatch.setattr(MODULE, "_download", download)
    with pytest.raises(ValueError, match="hash mismatch"):
        MODULE.sync_channel("resources", "http://catalogue", tmp_path / "sync")
    assert not (tmp_path / "sync/resources/current").exists()

