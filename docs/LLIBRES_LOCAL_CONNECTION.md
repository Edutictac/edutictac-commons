# Connexió local del banc amb Llibres — 22-10-2026

## Estat verificat

La ruta ja existia al codi, però els contenidors actius eren anteriors a la
integració. S'actualitzen només Recursos API i ID API. El frontend del banc
continua amb el seu catàleg Vue i no es recreen Authentik, editors o volums.

- Banc: `http://100.74.151.108:8086/`, filtre de format `llibres`.
- Llibres: `http://100.74.151.108:8098/`, «Històries compartides».
- `GET /api/llibres/books` retorna 200 des del banc, Commons i Llibres.
- El llibre publicat anteriorment apareix en les dos aplicacions i s'obri en
  el lector. El seu editable ELPX es conserva byte a byte.
- Rebost també recupera les seues rutes: catàlegs públics 200, imatges privades
  401 per a visitants. La publicació anònima de llibres continua bloquejada.

Les comprovacions de navegador són anònimes amb context tàctil i no generen
publicacions de prova en la instal·lació real. No acrediten un nou login OIDC
personal o una nova aprovació docent amb un compte real.

## Dades conservades

El servei actiu utilitza `/opt/edutictac-commons/data/recursos-api/recursos.db`,
amb 6.933 recursos. El llibre anterior estava en la base de desenvolupament
`data/recursos-api/recursos.db` del checkout Commons. No se substituïx la base
activa: es copia només la publicació activa, la seua fitxa i cinc fitxers.
L'origen no es modifica i no es traslladen revisions privades.

El trasllat es fa amb `recursos-api/scripts/migrate-public-books.py`, primer en
simulació i després en una transacció. Es conserven identificador i revisió;
els enllaços apunten al banc local. Una segona simulació confirma que ja està
present sense duplicar-lo. S'han comparat tots els camps dels 6.933 registres
anteriors amb el backup: són idèntics. La integritat SQLite és correcta.

ID API conserva la base activa `/opt/edutictac-commons/data/id.db`. S'han
comparat les files prèvies d'aules, identitats, sessions, puntuacions i
assignacions amb la seua còpia: també són idèntiques. El nou registre de
migracions es crea amb el mecanisme versionat ja implementat en Commons.
No es traslladen identitats des de la base de desenvolupament.

## Desplegament local

Imatges comprovades:

- `registry.edutictac.es/edutictac/recursos-api:books-connect-candidate`.
- `registry.edutictac.es/edutictac/commons-id-api:books-connect-candidate`.

L'override local `/opt/edutictac-commons/compose.books-local.yml` fixa estes
imatges i `LLIBRES_PUBLIC_BASE_URL=http://100.74.151.108:8086`. No conté secrets.
Es comprova que les altres variables resoltes del compose instal·lat siguen
les mateixes que usaven els contenidors abans d'actualitzar-los. Es conserva
el muntatge real de dades d'`/opt`, no el de la còpia de desenvolupament.

Per a reactivar **només les dos APIs** amb este estat:

```sh
docker compose --project-directory /opt/edutictac-commons \
  -f /opt/edutictac-commons/compose.yml \
  -f /opt/edutictac-commons/compose.books-local.yml \
  up -d --no-build --pull never --no-deps id-api recursos-api
```

No usar este comandament per a actualitzar indiscriminadament tots els serveis:
el frontend Vue i altres candidats locals tenen les seues referències pròpies.
Després de recrear Recursos API es valida i recarrega nginx del banc per a
renovar el seu upstream. També s'ha recarregat nginx del portal després de
recrear ID API. No s'han canviat nginx del host o Tailscale Serve.

## Còpies i retorn

Les còpies consistents de les dos bases de Recursos i la d'ID API estan en
`/opt/edutictac-commons/backups/before-books-connect-20261022T085149/`:
`active.db`, `previous-books.db` i `id-active.db`. Directori 0700 i fitxers 0600,
amb `PRAGMA integrity_check` verificat. No s'inclouen en Git.

Les imatges anteriors es conserven en `recursos-api:before-books-connect-20261022`
i `commons-id-api:before-books-connect-20261022`, dins del registre local
`registry.edutictac.es/edutictac/`. Restaurar dades requerix aturar els serveis
corresponents i revisar primer si hi ha activitat posterior a estes còpies;
no s'ha executat cap restauració en la instal·lació real.

## Proves

- Recursos API: 97 proves aprovades amb les dependències de la imatge real,
  incloses publicació, aprovació privada, permisos i quatre casos de trasllat.
- Commons: 132 proves de migracions, matriu d'accés a aules i Rebost aprovades;
  sis proves addicionals del límit d'identitat de Llibres aprovades.
- Lectura real anònima del llibre en el banc Vue i en «Històries compartides»
  de Llibres, amb sandbox sense scripts, fitxers accessibles i ELPX idèntic.
- Les APIs tenen estat healthy. No hi ha errors JavaScript en estos recorreguts.

No s'ha fet push ni desplegament a un VPS. L'accés s'ha comprovat des del host
local usant la seua adreça de tailnet; no és una prova física des de l'iPad.
