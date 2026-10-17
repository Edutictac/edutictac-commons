from copy import deepcopy
import importlib.util
from pathlib import Path

import pytest

ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location("module_docker_isolation", ROOT / "scripts/test-modules-docker.py")
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)


def example():
    return {"name": "existing-project", "services": {"database": {
        "volumes": [{"type": "volume", "source": "database", "target": "/data"}]}},
        "networks": {"default": {"name": "existing-project_default"}},
        "volumes": {"database": {"name": "existing-project_database"}}}


def test_normalized_resource_names_are_all_replaced(tmp_path):
    work = tmp_path / "commons-modules-check-synthetic"
    model = module.isolate_resources(example(), work.name)
    assert model["volumes"]["database"]["name"] == work.name + "_database"
    assert model["networks"]["default"]["name"] == work.name + "_default"
    module.assert_isolated_model(model, work)


@pytest.mark.parametrize("kind", ["networks", "volumes"])
def test_existing_names_cannot_survive_resolution(tmp_path, kind):
    work = tmp_path / "commons-modules-check-synthetic"
    model = module.isolate_resources(example(), work.name)
    next(iter(model[kind].values()))["name"] = "existing-production-resource"
    with pytest.raises(ValueError):
        module.assert_isolated_model(model, work)


def test_external_volumes_and_host_binds_are_rejected(tmp_path):
    model = example()
    model["volumes"]["database"]["external"] = True
    with pytest.raises(ValueError):
        module.isolate_resources(model, "commons-modules-check-synthetic")
    work = tmp_path / "commons-modules-check-synthetic"
    model = module.isolate_resources(example(), work.name)
    model["services"]["database"]["volumes"] = [{"type": "bind", "source": "/opt/existing/data", "target": "/data"}]
    with pytest.raises(ValueError):
        module.assert_isolated_model(model, work)


def test_preexisting_resources_abort_before_start(monkeypatch):
    class Exists:
        returncode = 0
    monkeypatch.setattr(module.subprocess, "run", lambda *args, **kwargs: Exists())
    model = module.isolate_resources(example(), "commons-modules-check-synthetic")
    with pytest.raises(ValueError, match="reuse"):
        module.assert_new_resources(model)
