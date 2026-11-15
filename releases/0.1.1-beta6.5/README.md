# Commons 0.1.1-beta6.5 — Rebost obert a EduCrea, sons i bancs externs

Lliurament preparat i validat localment. **Encara no publicat al registre ni a l'APT.** La rama
(`release/beta6.5`) és la mateixa que corre en producció des del 2026-11-15 en forma d'imatges
etiquetades (`educrea-rebost-sounds-20261115` per a l'API i `educrea-rebost-banks-20261115` per al
portal); la beta6.5 les empaqueta amb versió i documentació finals.

Base: `v0.1.1-beta6.4`. Pot actualitzar-se des de beta6.4 i des de la producció actual.

## Canvis respecte de beta6.4

### Rebost obert a altres orígens propis (commit `2fecb63`)

- `REBOST_ALLOWED_ORIGINS` (buit = usa `EDUTICTAC_ID_ALLOWED_ORIGINS`) llista els orígens que poden
  llegir i escriure la biblioteca privada amb la galeta central. Només `/api/assets/v1` rep eixes
  capçaleres CORS; la resta de l'API continua sent del mateix origen.
- `X-Rebost-Credit` i `X-Rebost-License` (UTF-8, `encodeURIComponent`, 300 i 100 caràcters) es
  guarden amb cada recurs. Les columnes `credit` i `license` s'afigen a l'arrancada
  (`ALTER TABLE` idempotent); no hi ha migració numerada nova.

### Sons al Rebost

- Tipus nou `sound`: OGG, MP3 i WAV validats per capçalera, màxim 2 MiB, guardats sense
  transcodificar i servits amb el seu tipus real. Sense miniatura. Un recurs no pot passar d'imatge a
  so ni al contrari. El llistat per defecte no inclou sons (`?type=sound`), de manera que Blocs i
  altres clients d'imatges no canvien.
- Col·lecció de només lectura `effects`: 297 efectes CC0 de Kenney amb manifest verificat per
  SHA-256, cercables en castellà i valencià i copiables a la biblioteca personal.
- `/api/assets/v1/me` anuncia la capacitat `sounds` i el límit `sound_bytes`.
- Documentació: `docs/rebost-sounds.md`.

### Bancs externs en el Rebost (pestanya opcional)

- Pestanya «Bancs externs» que cerca alhora als bancs d'imatges lliures (ARASAAC, Wikimedia Commons,
  The Met, icones i Openverse) a través de l'API d'EduCrea, i guarda la imatge triada al Rebost amb
  crèdit i llicència. ARASAAC apareix sempre amb l'etiqueta NC; el filtre (actiu per defecte) lleva
  les altres imatges amb llicència NC.
- **Només apareix si l'instal·lació declara la URL d'EduCrea**: variable `REBOST_BANK_SEARCH_URL`
  (només `https` i host; l'API la valida en arrancar i l'anuncia en `/api/assets/v1/me` i
  `/catalogs` amb la capacitat `external_banks`) o, com a alternativa antiga, `bankSearchUrl` de
  `deployment.js`. Per defecte no hi és, de manera que les instal·lacions de centres no la veuen.
- **Dins del selector incrustat** (Llibres, Blocs: `/assets/?mode=pick`) la pestanya també hi és i el
  botó és «Guardar i triar»: guarda la imatge al Rebost (tipus `background` si el selector és de
  fons, `illustration` si no) i en lliura l'identificador a l'aplicació amb `postMessage`.
- La metaetiqueta CSP de `assets/index.html` permet `connect-src 'self' https://crea.edutictac.es`.
- Requisit a EduCrea: `EDUCREA_BANK_CORS_ORIGINS` amb l'origen de Commons (CORS de només lectura per
  a `GET /api/image-banks`).

### Fora del paquet `.deb` (configuració de producció d'EduTicTac)

Els proxies d'altres aplicacions no viatgen amb Commons i s'han configurat a part:

- **Llibres** (`nginx.production.conf` dins de la seua imatge) i **Blocs** (vhost del host) només
  deixaven `GET` en `/api/assets/v1/`. Ara permeten també `POST /api/assets/v1/items` (`location =`,
  cos màxim 6 MiB); copiar, canviar i esborrar continuen només en Commons. El CSP de `/assets/` en
  Llibres permet connectar amb `https://crea.edutictac.es`.
- `REBOST_ALLOWED_ORIGINS` ha d'incloure els orígens de Llibres i Blocs perquè puguen crear recursos.
- EduCrea: `EDUCREA_BANK_CORS_ORIGINS` amb els orígens de Commons, Llibres i Blocs.

### Traslat d'aules

El valor per defecte de `EDUTICTAC_CLASSROOM_TRANSFER_ENABLED` continua sent el de beta6.4
(**activat** si la variable no existix en una instal·lació nova). **Una instal·lació que venia de
beta6.3 amb el traslat apagat ha de fixar `EDUTICTAC_CLASSROOM_TRANSFER_ENABLED=0` abans d'actualitzar**:
la migració 5 pren eixe valor inicial. A la producció d'EduTicTac ja està fixat.

## Validació completada

- Suite Python completa sobre esta rama: **652 aprovades, 14 omeses** (abans de la pestanya de
  bancs; després, les proves de Rebost, seguretat de capçaleres, manifest de contingut, ingress i
  sessió central: 67 aprovades, 2 omeses).
- Proves de navegador: **386 en escriptori i mòbil**, incloent 4 proves noves de bancs externs
  (repetides 8 vegades sense falsos negatius).
- Prova d'actualització amb còpia privada de la base de producció real (sense xarxa i sense ports):
  migració 4 → 5, dades originals idèntiques byte a byte, pujada de so amb origen d'EduCrea,
  còpia d'efecte amb llicència CC0, i retrocés amb la imatge anterior sobre la base ja migrada.
- Desplegada en producció (API i portal) el 2026-11-15 amb còpia prèvia i retrocés automàtic;
  portada, `/api/health`, CORS d'EduCrea i CSP verificats des de fora.

## Pendent abans de publicar

1. Reconstruir imatges amb l'etiqueta final `0.1.1-beta6.5`, fixar-ne els digests en `images.json`,
   `compose.images.json` i `installer.json`, i construir el `.deb`.
2. Prova d'instal·lació completa amb Compose (`scripts/test-installation.py --upgrade-from`
   amb el manifest de beta6.4) i, si és possible, amb el paquet `.deb` en una màquina neta.
3. Publicar imatges i paquet APT, etiquetar `v0.1.1-beta6.5` i enviar la rama.
