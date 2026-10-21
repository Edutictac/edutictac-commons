# Interfície Vue del Rebost central

La biblioteca i el selector compartixen una única interfície Vue. Blocs i Llibres continuen obrint `/assets/` en un iframe del seu mateix origen. No hi ha una biblioteca paral·lela en cada editor.

## Components i contractes

- `services/portal/src/rebost/RebostApp.vue`: sessió, col·leccions, cerca, paginació, pujada i previsualització.
- `AssetCard.vue`: imatge, edició de metadades, còpies, crèdits i disfresses agrupades.
- `messages.js`: castellà i valencià; usa la preferència i l'esdeveniment `edutictac:langchange` del portal.
- `public/assets/client.js`: client HTTP independent del framework, sense canvis en la migració.
- `public/assets/library.js`: entrada estable; carrega `rebost-ui.js` compilat.

Es mantenen l'API `/api/assets/v1`, els identificadors, les revisions `If-Match`, els permisos del servidor i el protocol `rebost-selection` versió 1. Les famílies només s'envien quan l'editor anuncia `supports_families=1&selection=sprite`. No s'accepten destinataris externs: `postMessage` usa `location.origin`.

Els catàlegs són públics. Les imatges personals exigixen la sessió individual de Commons: codi/PIN per a alumnat i Authentik per a docents. Tornar a la finestra comprova la sessió i actualitza la biblioteca; perdre la sessió lleva de la pantalla les imatges privades i la previsualització.

Les plantilles es compilen abans de servir-les. Els noms són text, mai HTML o plantilles executables. Es conserva la CSP sense `unsafe-eval`, CDN ni scripts en línia. Les miniatures i previsualitzacions alliberen els URL de blobs quan es canvien o desmunten.

## Compilació i Docker

Des de l'arrel del repositori:

```sh
npm ci --ignore-scripts
npm run build:rebost
```

Es versiona `services/portal/public/assets/rebost-ui.js` perquè el Dockerfile existent continue copiant fitxers estàtics. Després de canviar un component cal recompilar i incloure el bundle en el mateix commit. Node només intervé en la compilació; no s'afigen serveis, volums ni migracions de dades. Versions fixades en `package-lock.json`.

Dependències: Vue 3.5.44, Vite 8.3.5 i `@vitejs/plugin-vue` 6.0.10, totes MIT. Vite i el connector només són eines de desenvolupament. La llicència de Vue distribuïda amb el bundle està en `/assets/licenses/vue-MIT.txt`.

## Verificació

```sh
npm run build:rebost
npx playwright test tests/browser/rebost.spec.js
/tmp/edutictac-assets-venv/bin/python -m pytest tests/test_rebost.py tests/test_rebost_access.py tests/test_rebost_catalog.py tests/test_rebost_scratch.py tests/test_rebost_families.py -q
```

Les proves Python usen API, SQLite i catàlegs reals temporals; comproven pujada, renombrat, còpies, eliminació, fitxers invàlids, paginació, fonts/llicències i famílies en castellà i valencià. Les proves Playwright addicionals comproven la recuperació/pèrdua de sessió i el contracte de selecció en iframe, amb i sense suport de famílies, en escriptori i mòbil.

Per a comprovar Blocs amb la seua VM i els blocs reals, sense tocar dades de la instal·lació:

```sh
REBOST_TEST_IMAGE=registry.edutictac.es/edutictac/commons-id-api:rebost-local \
  /tmp/edutictac-assets-venv/bin/python scripts/verify-rebost-editors.py
```

Este verificador reutilitza el muntatge Docker aïllat existent: xarxes, volum i alumnat sintètic codi/PIN temporals; neteja els contenidors en acabar. Comprova quatre disfresses del Ratpenat, moviment, canvi de disfressa i fons en castellà/valencià amb ratolí/tàctil. No usa comptes personals.

## Resultat de la migració (21-10-2026)

- API, permisos i catàlegs: 64 proves aprovades; les dos proves de navegador amb API real també aprovades després de compilar la versió final.
- Portal: suite de 76 proves aprovada; s'han afegit després dos comprovacions de revisió de famílies. El fitxer final `rebost.spec.js` passa les seues huit proves, inclosa l'alliberació de blobs en perdre sessió.
- Blocs: integració Docker aïllada aprovada en castellà i valencià; motor i codi de Blocs sense canvis.
- Llibres: 16 proves de Rebost/proxy aprovades contra la interfície central local, incloent lectura pública, crèdits i exportació/reobertura portable.
- Captura de famílies valenciana revisada; no s'ha fet una prova manual en un iPad físic.
- Activat només el portal local en 8082. API, volums, Authentik i editors sense recrear. Imatge anterior conservada amb l'etiqueta `before-rebost-vue-20261021`.

La migració d'altres pantalles del portal continua sent una fase posterior. Esta entrega no incorpora Vue als motors de Scratch/eXe ni canvia EduHoot.
