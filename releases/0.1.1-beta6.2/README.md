# Commons 0.1.1-beta6.2 — paquet i imatge del portal

Correcció de publicació sobre beta6.1. Conserva les dades, els fitxers d’aula,
els mòduls i la configuració. No sobreescriu els tags publicats de beta6 ni
beta6.1.

## Canvis

- El paquet beta6.2 incorpora el manifest amb la imatge del portal beta6.2
  (footer `v0.1.1-beta6.2`) i la correcció del nom d’aula.
- Les imatges es publiquen amb el tag `0.1.1-beta6.2`; id-api manté la
  correcció del lot i portal mostra el footer definitiu.

## Imatges

Els digests finals consten en [images.json](images.json) i
[compose.images.json](compose.images.json). Només canvia el tag; no hi ha canvis
de codi respecte de beta6.1.

## Instal·lació

Paquet `0.1.1~beta6.2` publicat a APT. Beta6.1 queda com a versió anterior.
La descàrrega i el candidat APT estan verificats; el SHA-256 consta en
[installer.json](installer.json). La validació en LliureX i el desplegament es
documenten en [docs/VALIDACIO-BETA6.2.md](../../docs/VALIDACIO-BETA6.2.md).
