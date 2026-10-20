# EduTicTac Blocs artwork in Rebost

This directory is **artwork data, not MIT-licensed Commons application code**.
The selected original Blocs template SVGs and their PNG derivatives retain **GPL-3.0-only**,
as declared by Blocs (`LICENSE`, `package.json`, `Dockerfile`, `README.md`). The full licence
is included in `licenses/GPL-3.0-only.txt`. The original SVGs are provided in `sources/`.
Attribution: contributors to EduTicTac Blocs; original repository and revision are recorded
per item in `manifest.json`. No individual authorship is invented from commit usernames.

Only twelve reviewed original files are included: the seven characters and five backdrops
of the local AI catalogue. Scratch CDN assets, Twemoji and other template artwork are excluded.
The catalogue is separate from the Commons code and private libraries. Choosing/copying an
item does not relicense it. Private copies preserve licence, credits and original source.

Regenerate from the Commons repository:

```sh
python scripts/build-rebost-catalog.py --blocs ../edutictac-blocs
python scripts/build-rebost-catalog.py --blocs ../edutictac-blocs --check
```

The builder rejects active SVG and external references, renders with JavaScript and networking
disabled, and records SHA-256 checksums. Only build tooling uses Chromium/Playwright. The API
uses verified inert PNGs and serves the original SVG only as an attachment. No SVG upload or
SVG execution is enabled by this collection. See `docs/rebost-catalog.md` for the review scope.
