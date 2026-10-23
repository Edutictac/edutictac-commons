"""Fitxers comuns que Play ha de portar copiats perquè el seu context Docker no veu el portal."""

from pathlib import Path

ROOT = Path(__file__).parents[1]


def test_play_theme_preference_matches_portal():
    portal = ROOT / 'services/portal/public/assets/theme-preference.js'
    play = ROOT / 'services/play/public/theme-preference.js'
    assert play.read_bytes() == portal.read_bytes(), 'copia services/portal/public/assets/theme-preference.js a Play'
