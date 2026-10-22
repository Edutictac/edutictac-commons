#!/usr/bin/env python3
"""Stage the language-only fix for the older public Play, without migrating it to Vue."""
import argparse
import json
from pathlib import Path


def prepare(source, destination, repository):
    html = (source/'index.html').read_text()
    app = (source/'app.js').read_text()
    assert html.count('<option value="ca">CA</option>') == 1
    assert html.count('src="./app.js"') == 1
    html = html.replace('<option value="ca">CA</option>', '<option value="ca">CA</option><option value="va">VA</option>')
    html = html.replace('<script src="./app.js"', '<script src="./language-preference.js"></script>\n<script src="./app.js?v=language-20261022"')
    old = "lang: localStorage.getItem('edutictac-play-lang') || 'es'"
    assert app.count(old) == 1
    app = app.replace(old, "lang: window.commonsLanguage.read() || 'es'")
    old = "localStorage.setItem('edutictac-play-lang', event.target.value);"
    assert app.count(old) == 1
    app = app.replace(old, 'window.commonsLanguage.remember(event.target.value);')
    # Add-on dictionaries have ES/CA/EN; Valencian shares their Catalan base.
    assert app.count('[state.lang]') >= 1
    app = app.replace('[state.lang]', "[state.lang === 'va' ? 'ca' : state.lang]")
    app = app.replace("state.lang === 'ca'", "(state.lang === 'ca' || state.lang === 'va')")
    marker = "document.querySelectorAll('[data-i18n]')"
    assert marker in app
    app = app.replace(marker, "document.documentElement.lang = state.lang === 'va' ? 'ca' : state.lang; window.commonsLanguage.remember(state.lang); " + marker, 1)
    # The older H5P generator uses the CA base for the Valencian variant.
    app = app.replace('language: state.lang,', "language: state.lang === 'va' ? 'ca' : state.lang,")
    app = app.replace('language: state.lang }', "language: state.lang === 'va' ? 'ca' : state.lang }")
    ca = json.loads((source/'i18n/ca.json').read_text())
    overrides = json.loads((repository/'services/play/public/i18n/va.json').read_text())
    destination.mkdir(parents=True, exist_ok=False)
    (destination/'i18n').mkdir()
    (destination/'index.html').write_text(html)
    (destination/'app.js').write_text(app)
    (destination/'i18n/va.json').write_text(json.dumps({**ca, **overrides}, ensure_ascii=False, indent=2)+'\n')
    (destination/'language-preference.js').write_bytes((repository/'services/portal/public/assets/language-preference.js').read_bytes())


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('destination', type=Path)
    parser.add_argument('--repository', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    prepare(args.source, args.destination, args.repository)
