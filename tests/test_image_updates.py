"""Release tags left in the registry must not mask a newer Commons delivery."""
import importlib.util
from pathlib import Path

import pytest

spec=importlib.util.spec_from_file_location('image_update_versions',Path(__file__).parents[1]/'scripts/check-updates.py')
updates=importlib.util.module_from_spec(spec);spec.loader.exec_module(updates)


@pytest.mark.parametrize('older,newer',[
    ('0.1.1-alpha9','0.1.1-alpha10'),('0.1.1-alpha37','0.1.1-beta1'),
    ('0.1.1-beta2-candidate5','0.1.1-beta2'),('0.1.1-beta3-candidate1','0.1.1-beta3-candidate2'),
    ('0.1.1-beta3-candidate9','0.1.1-beta3-candidate10'),('0.1.1-beta3-candidate10','0.1.1-beta3'),
    ('0.1.1-beta4','0.1.1-beta5-candidate1'),('0.1.1-beta5-candidate1','0.1.1-beta5'),('0.1.1-beta5','0.1.1-beta6'),('0.1.1-beta6','0.1.1-beta6.1'),
    ('0.1.1-beta3','0.1.1-beta4-candidate1'),('0.1.1-beta3','0.1.1-rc1'),
    ('0.1.1-rc1','0.1.1'),('0.1.1','0.1.2-alpha1'),('0.1.1-beta3','v0.1.1'),
])
def test_numbered_releases_and_their_candidates(older,newer):
    assert updates.semver_key(older)<updates.semver_key(newer)


def test_completed_beta3_is_detected_from_the_tested_candidate(monkeypatch):
    names=updates.COMMON_IMAGES
    monkeypatch.setattr(updates,'fetch_tags',lambda *args,**kwargs:['0.1.1-alpha9','0.1.1-alpha37','0.1.1-beta2','0.1.1-beta3-candidate1','0.1.1-beta3'])
    result=updates.choose_intersection_update('registry.example',names,'0.1.1-beta3-candidate1','testing')
    assert result['candidate']=='0.1.1-beta3' and result['update_available']


def test_release_is_not_offered_until_all_images_are_available(monkeypatch):
    def tags(registry,image,*args,**kwargs):
        return ['0.1.1-beta3-candidate1']+([] if image=='commons-llibres' else ['0.1.1-beta3'])
    monkeypatch.setattr(updates,'fetch_tags',tags)
    result=updates.choose_intersection_update('registry.example',updates.COMMON_IMAGES,'0.1.1-beta2','testing')
    assert result['candidate']=='0.1.1-beta3-candidate1'


def test_stable_channel_still_excludes_beta_deliveries(monkeypatch):
    monkeypatch.setattr(updates,'fetch_tags',lambda *args,**kwargs:['0.1.0','0.1.1-beta3'])
    result=updates.choose_intersection_update('registry.example',updates.COMMON_IMAGES,'0.1.0','stable')
    assert result['candidate']=='0.1.0' and not result['update_available']
