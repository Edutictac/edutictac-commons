import importlib.util
import json
from pathlib import Path

import pytest


ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location(
    "validate_content_manifest", ROOT / "scripts/validate-content-manifest.py"
)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def example_manifest():
    return json.loads((ROOT / "content/manifest.example.json").read_text())


def test_example_manifest_is_valid():
    payload = MODULE.validate(ROOT / "content/manifest.example.json")
    assert payload["schema_version"] == 1
    channels = {item["channel"] for item in payload["items"]}
    assert channels == {"resources", "eduhoot"}


def test_manifest_rejects_duplicate_channel_ids(tmp_path):
    payload = example_manifest()
    payload["items"].append(dict(payload["items"][0]))
    path = tmp_path / "manifest.json"
    path.write_text(json.dumps(payload))
    with pytest.raises(ValueError, match="duplicate item"):
        MODULE.validate(path)


def test_manifest_rejects_parent_artifact_path(tmp_path):
    payload = example_manifest()
    payload["items"][0]["artifact"]["path"] = "../outside.json"
    path = tmp_path / "manifest.json"
    path.write_text(json.dumps(payload))
    with pytest.raises(ValueError, match="cannot contain"):
        MODULE.validate(path)
