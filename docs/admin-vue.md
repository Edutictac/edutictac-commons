# Administració operativa en Vue

## Arquitectura i abast

`admin/` és un servei propi de Commons: Python `ThreadingHTTPServer` servix
`admin/public` i la API operativa. No és el panell d’aules del portal docent,
que ja usa Vue. La API comprova la identitat d’Authentik amb ID API i exigix el rol
`administrador` o l’usuari configurat; els mòduls i les còpies mantenen les
capçaleres anti-CSRF i les operacions fixes del servidor.

La interfície anterior era un controlador de 569 línies amb formularis,
construcció de DOM i seguiment de treballs systemd. Ara `admin/src/AdminApp.vue`
controla les plantilles; `useAdmin.js` concentra sessió, càrregues, formularis,
bloqueig d’operacions i seguiment. `format.js` reutilitza els formatadors de
l’estat del servidor. `admin/public/app.js` només carrega el bundle i mostra
un error llegible si no està disponible. No queden manejadors antics duplicats.

Es conserven les rutes, payloads, selecció amb revisió, confirmacions de
restauració/actualització/rollback, estat de la segona còpia i els quatre
idiomes. El selector inicial usa Teleport per a mostrar un únic formulari
en l’assistent o en el panell, sense duplicar seleccions.

Totes les operacions exigixen haver rebut estat administratiu autoritzat;
una operació pendent o un treball actiu bloqueja les altres escriptures. Un
401/403 retira dades i contrasenyes temporals. Les respostes d’una sessió o
navegació anterior no poden tornar a mostrar dades. Les contrasenyes de nous
docents només estan en memòria, amb neteja explícita, en eixir i en pagehide.
El retorn des de la caché d’historial torna a validar la sessió.

## Treballs llargs

El seguiment conserva `commons-modules-job` i `commons-backup-job` en
sessionStorage i incorpora `commons-images-job` per a actualització/rollback.
Només es desen identificadors systemd amb patrons estrictes, mai credencials.
Recuperar o reprendre consulta el treball existent; no torna a executar-lo.
Es toleren interrupcions temporals del servidor durant les còpies. Quan
s’esgota el temps, el treball continua bloquejant noves operacions i es pot
reprendre la consulta. Eixir del panell no cancel·la un treball del servidor.

No s’introduïx idempotència en la API. Si es perd la resposta inicial d’un POST,
no hi ha un identificador que el frontend puga reconstruir amb seguretat:
l’error demana comprovar l’estat abans de tornar a enviar. No es reintenten
escriptures automàticament ni es dona un error de xarxa com a prova de fallada
del treball en el servidor.

## Compilació i llicències

```sh
npm ci
npm run build:admin
npx playwright test tests/browser/admin-modules.spec.js tests/browser/admin-vue.spec.js
```

`npm run build:portal` compila també administració. El bundle versionat és
`admin/public/assets/admin-ui.js`; CI el recompila i comprova que coincidix.
Es reutilitza `vite.portal.shared.mjs`, Vue 3.5.44 i les dependències existents,
sense CDN o Node en execució. La imatge Docker ja copia `admin/public`, per
la qual cosa no necessita un servici nou. La llicència MIT de Vue s’inclou
en `admin/public/assets/licenses/vue-MIT.txt`; no canvien les llicències del
projecte ni de les altres dependències. La API, les dades, els volums i els
scripts del host no es modifiquen en esta migració.

## Verificació inicial

Les 14 proves existents de mòduls/còpies i 22 proves noves, en escriptori i
mòbil, passen. Cobrixen accés denegat, alta docent sintètica, contrasenya només
en memòria, peticions duplicades, respostes tardanes, neteja en navegar,
esborranys i idiomes, confirmacions, recuperació de restauració/actualització/
rollback, timers, sincronització i fallback del bundle. La prova de polling
consulta l’estat visible del seguiment, sense llegir variables globals del
controlador que s’ha retirat.

Les proves d’operacions usen API simulada; no creen docents ni executen
còpies, restauracions, actualitzacions o sincronitzacions en la instal·lació.
La validació local anònima amb el servei complet queda documentada a
continuació. L’acceptació amb una sessió personal real no forma part d’estes
proves sintètiques.

## Recuperació i regressió final

Es pot eixir de sessió fins i tot amb una alta pendent: neteja immediata i cap
resposta tardana torna a mostrar la contrasenya. Una resposta antiga de logout,
estat o seguiment no revoca una sessió posterior validada. Els missatges del
seguiment i de consulta d’actualitzacions es traduïxen sense perdre el registre.
El temps esgotat significa resultat desconegut, no fallada ni èxit del servidor:
es conserva el bloqueig i el botó reprén només la consulta.

Verificació: **42 proves administratives** de regressió i **dos proves noves**
de logout tardà aprovades en escriptori/mòbil; **248 proves del portal complet**
aprovades abans d’afegir estes dos últimes. Les **64 proves Python** de permisos,
mòduls, importació de catàlegs i còpies/segona còpia també passen. Les dades i
execucions d’operacions de les proves són sintètiques i en directoris temporals.
La compilació conjunta conserva els bundles de Rebost i alumnat; el bundle
docent només normalitza dos comentaris amb rutes de dependències per a fer-lo
reproduïble en CI. No hi ha canvis funcionals en eixe panell.

## Activació local — 22-10-2026

URL: **http://100.74.151.108:8082/admin/**. Abans, el servei admin no estava
arrancat i el proxy retornava 502. Ara el servei existent es desplega amb
`registry.edutictac.es/edutictac/commons-admin:admin-vue-candidate`, reutilitzant
el compose instal·lat i els seus volums. L’override local sense secrets és
`/opt/edutictac-commons/compose.admin-vue-local.yml`; fixa la imatge i
`REPO_DIR=/opt/edutictac-commons` perquè les operacions apunten a la instal·lació
correcta. Els scripts del host i els punts de muntatge ja existien; no es copien
ni es modifiquen scripts, bases de dades o configuracions de credencials.

```sh
docker compose --project-directory /opt/edutictac-commons \
  -f /opt/edutictac-commons/compose.yml \
  -f /opt/edutictac-commons/compose.admin-vue-local.yml \
  up -d --no-build --pull never --no-deps admin
```

No executar este compose per a tot el stack: les API i els altres frontends
conserven els seus overrides i imatges locals. No usar `--remove-orphans`;
Blocs és un servei vàlid absent del compose instal·lat antic. La primera
imatge Vue queda preservada com a `before-admin-vue-hardening-20261022`,
abans de l’últim reforç de seguiment. Abans de la migració no hi havia un
contenidor admin actiu; detindre només admin retorna a aquell estat.

Smoke anònim de lectura aprovat: HTML i bundle 200, bundle idèntic al compilat,
`/admin/api/status` i `/admin/api/modules` responen 401, tots els controls
d’escriptura estan bloquejats. Sense errors JavaScript ni desbordament en
393 i 1024 píxels; captura valenciana revisada. Els altres serveis actius
conserven identificador i hora d’arrancada; no s’han recreat API, Authentik,
portal, banc, Blocs o Llibres.

No s’han creat docents, iniciat còpies, restauracions, actualitzacions,
canvis de mòduls o sincronitzacions reals en esta comprovació. L’accés
administratiu personal i les operacions de camp requerixen acceptació
manual abans de producció. No s’ha fet push, publicació d’imatges al registre
ni desplegament al VPS. Quiosc i Play continuen pendents.
