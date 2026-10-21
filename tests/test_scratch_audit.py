"""Bulk triage must not confuse a historical reference with approval."""
import importlib.util
from pathlib import Path

import pytest

ROOT = Path(__file__).parents[1]
spec = importlib.util.spec_from_file_location('scratch_audit', ROOT / 'scripts/audit-scratch-catalog.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def libraries(*sprites, costumes=(), backdrops=()):
    return {'sprites': list(sprites), 'costumes': list(costumes), 'backdrops': list(backdrops)}


def sprite(name, *images):
    return {'name': name, 'tags': ['drawing'], 'costumes': [{'name': name, 'md5ext': image} for image in images]}


def test_shared_images_are_counted_once_and_grouped_with_known_sprites():
    current = libraries(sprite('Bat', 'first.svg', 'second.svg'),
                        costumes=[{'name': 'Bat-a', 'md5ext': 'first.svg'}, {'name': 'Bat-b', 'md5ext': 'second.svg'}])
    result = module.audit(current, current, {'first.svg'})
    assert result['counts']['unique_images'] == 2
    assert result['counts']['pending'] == result['counts']['pending_in_known_families'] == 1
    assert result['counts']['review_families'] == 1
    pending = next(item for item in result['items'] if item['md5ext'] == 'second.svg')
    assert pending['family'] == 'sprite:Bat' and pending['family_already_in_rebost']
    assert pending['state'] == 'historical_svg_needs_review'
    assert all(item['approved_by_this_audit'] is False for item in result['items'])


def test_equal_names_do_not_substitute_for_a_historical_hash_reference():
    current = libraries(sprite('Apple', 'new.svg'))
    historical = libraries(sprite('Apple', 'old.svg'))
    result = module.audit(current, historical, set())
    assert result['items'][0]['state'] == 'historical_evidence_missing'
    assert not result['items'][0]['approved_by_this_audit']


@pytest.mark.parametrize('name,expected', [('Cat 2', 'possible_mark_needs_review'),
                                         ('Dango Cat', 'possible_mark_needs_review'),
                                         ('Pico-a', 'possible_mark_needs_review'),
                                         ('Catcher', 'historical_svg_needs_review')])
def test_name_flags_are_conservative_review_hints_not_license_decisions(name, expected):
    data = libraries(sprite(name, 'image.svg'))
    item = module.audit(data, data, set())['items'][0]
    assert item['state'] == expected and not item['approved_by_this_audit']


def test_bitmaps_and_unmatched_images_stay_out_of_svg_batch():
    current = libraries(backdrops=[{'name': 'Winter', 'md5ext': 'winter.png'},
                                  {'name': 'Unknown', 'md5ext': 'unknown.svg'}])
    historical = libraries(backdrops=[{'name': 'Winter', 'md5ext': 'winter.png'}])
    result = module.audit(current, historical, set())
    assert result['counts']['pending_by_state'] == {
        'historical_bitmap_needs_review': 1, 'historical_evidence_missing': 1}
