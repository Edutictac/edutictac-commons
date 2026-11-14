# Rebost: sons

El Rebost admet un tipus de recurs nou, `sound`, a més de les imatges.

## Biblioteca personal

- Formats: OGG, MP3 i WAV (`audio/ogg`, `audio/mpeg`, `audio/wav`). Es valida la capçalera i el `Content-Type` ha de coincidir.
- Màxim 2 MiB per so. Es guarden tal qual, sense transcodificar; no tenen miniatura (`/thumbnail` respon 404) i `width`/`height` valen 0.
- `X-Rebost-Type: sound` exigix un contingut d'àudio, i un tipus d'imatge exigix una imatge. Un recurs no pot passar d'un a l'altre amb `PATCH`.
- El llistat per defecte (`collection=mine`) **no inclou sons**, perquè els clients d'imatges existents no els rebisquen. Per veure'ls: `?type=sound`.
- `/api/assets/v1/me` anuncia la capacitat `sounds` i el límit `sound_bytes`.
- Els identificadors continuen sent `img-<64 hex>` per compatibilitat.

## Col·lecció `effects`

297 efectes CC0 de Kenney, de només lectura, inclosos a `services/id-api/assets/catalog-effects/` amb manifest verificat per SHA-256. Es llisten amb `?collection=effects&type=sound`, es poden buscar en castellà i valencià i es poden copiar a la biblioteca personal (`POST /items/{id}/copies`), conservant la llicència.
