# Instal·lació en centres educatius

Entrega actual: [Commons 0.1.1-alpha + EduHoot 1.0.2](RELEASE-0.1.1-alpha.md).
Inclou un manifest de digests i una prova d'instal·lació/restauració aïllada.

Aquest document descriu la prova tècnica mínima del stack Docker d'EduTicTac Commons en un centre educatiu o en un ordinador local.

## Requisits

- Linux amb Docker Engine.
- Docker Compose v2.
- 2 GB de RAM lliures per a aquesta demo inicial.
- Un port lliure per al portal, per defecte `8082`.

## Instal·lació ràpida

```bash
cp .env.example .env
make doctor
make up
```

Si Docker requereix `sudo`:

```bash
make DOCKER="sudo docker" doctor
make DOCKER="sudo docker" up
```

Obri:

```text
http://localhost:8082
```

Per deixar una demo preparada sense crear l'aula manualment:

```bash
make bootstrap-demo
```

El comandament crea un grup, assigna l'activitat demo i escriu un fitxer TSV de credencials en `dist/`.

## Primer recorregut recomanat

1. Obri el portal.
2. Entra com a docent amb el token configurat en `.env`.
3. Genera un grup de prova.
4. Clica una targeta de credencial, no el CSV, per omplir el formulari d'alumnat.
5. Entra com a alumne.
6. Completa el repte de privacitat digital.
7. Torna a resultats i consulta l'activitat.

Els PINs només es mostren just després de generar credencials. El CSV està pensat per exportar codis, però no inclou PINs.

## Configuració mínima

Edita `.env` abans d'usar la demo amb professorat real:

```env
PORTAL_PORT=8082
EDUTICTAC_ID_SECRET=canvia-aquest-secret
EDUTICTAC_ID_TEACHER_TOKEN=canvia-aquest-token-docent
EDUTICTAC_ID_APP_TOKEN=canvia-aquest-token-intern
ADMIN_OIDC_USERNAME=akadmin
```

No uses els valors `change-this-local-secret`, `dev-teacher`,
`dev-app-token` ni `change-this-admin-token` fora d'una demo local.

Abans d'usar el prototip amb professorat o alumnat real, revisa
`docs/PRIVACITAT.md` i completa `docs/DIRECCIO-DPD.md`.

## Operació habitual

```bash
make ps          # estat dels serveis
make logs        # logs del stack
make test-flow   # prova automàtica del flux principal
make test-eduhoot-flow # prova EduHoot si COMPOSE_PROFILES=eduhoot
CONFIRM_RESET_TEST=1 make test-reset-flow # prova backup -> reset -> restore
make backup      # crea backups/commons-<stamp>/ amb manifest.json i dades persistents
make down        # atura contenidors sense esborrar dades
make up          # arranca o actualitza contenidors
```

Si Docker requereix `sudo`, afegeix `DOCKER="sudo docker"` al comandament.

## Actualització local

Abans d'actualitzar:

```bash
make backup
make release-check
```

Després d'actualitzar els fitxers del stack:

```bash
make up
make test-flow
```

Per a imatges publicades al registre, el flux recomanat és:

```bash
make check-updates
make update-images
```

`make update-images` crea i verifica un backup abans de canviar tags, descarrega
imatges, reinicia serveis i executa `make test-flow`.

## Activar EduHoot

EduHoot és opcional. Per activar-lo:

```env
COMPOSE_PROFILES=eduhoot
EDUHOOT_PORT=8090
EDUHOOT_ID_AUTH_REQUIRED=0
```

Amb `EDUHOOT_ID_AUTH_REQUIRED=0`, l'alumnat pot entrar amb un nom curt o amb
codi + PIN Commons. Si usa codi + PIN, EduHoot no demana nom addicional i la
puntuació final queda registrada en Commons. Si el centre vol obligar sempre
identitat pseudònima, posa `EDUHOOT_ID_AUTH_REQUIRED=1`.

EduHoot guarda dades en `data/eduhoot-mongo/`, `data/eduhoot-uploads/` i
`data/eduhoot-logs/`. `make backup` i `make restore` les cobreixen quan el
perfil està actiu.

## Ús d'imatges ja publicades (registre propi)

EduTicTac publica les imatges a un registre OCI propi,
`registry.edutictac.es`. Les imatges oficials publicades es poden descarregar
sense credencials; només cal autenticació per publicar-ne de noves.

Al `.env` del centre:

```bash
IMAGE_REGISTRY=registry.edutictac.es/edutictac
IMAGE_TAG=0.1.1-alpha
EDUHOOT_TAG=1.0.2
```

I després:

```bash
docker compose --env-file .env -f compose.yml pull
make up-pulled
```

`make up-pulled` alça els contenidors sense reconstruir res des del codi
font (a diferència de `make up`, pensat per a desenvolupament local, que
sempre reconstrueix la imatge).

## Funcionament sense accés al registre

En una màquina amb internet:

```bash
make export-images
```

Això genera:

```text
dist/edutictac-commons-images-0.1.0-alpha.tar
```

L'arxiu inclou les imatges pròpies versionades del stack:
`commons-id-api`, `commons-portal` i `commons-admin`.

En la màquina del centre:

```bash
make load-images ARCHIVE=dist/edutictac-commons-images-0.1.0-alpha.tar
make up
```

## Publicació en el registre propi

Quan hi haja una versió estable, des de l'equip d'EduTicTac (cal login previ
amb `docker login registry.edutictac.es` amb l'usuari de publicació):

```bash
export IMAGE_REGISTRY=registry.edutictac.es/edutictac
export IMAGE_TAG=0.1.1-alpha
export EDUHOOT_TAG=1.0.2
# Construïx primer EduHoot des del seu repo amb este mateix nom d'imatge.
INCLUDE_EDUHOOT=1 make push-images
```

Abans de publicar:

- comprova que no hi ha `.env` dins de cap imatge;
- comprova que no hi ha bases SQLite ni backups dins de cap imatge;
- revisa `CHECKLIST-ENTREGA.md`;
- passa `make release-check`;
- passa `make test-flow`;
- actualitza `VERSION` i `.env.example`.

## Dades i còpies

La base de dades SQLite queda en:

```text
data/id.db
```

Si EduHoot està actiu, també hi ha dades persistents en:

```text
data/eduhoot-mongo/
data/eduhoot-uploads/
data/eduhoot-logs/
```

Crear una còpia:

```bash
make backup
```

Restaurar:

```bash
make restore BACKUP=backups/commons-YYYYmmddTHHMMSSZ/
```

Totes aquestes accions, i activar/desactivar el backup automàtic diari, es
poden fer també sense terminal des del panell `/admin`
(`http://127.0.0.1:8091/`, amb la sessió Authentik d'`akadmin`) — vegeu
`README.md#panell-dadministracio`.

## Solució de problemes

### El portal no obri

Comprova que els contenidors estan alçats:

```bash
make ps
```

Comprova el port configurat en `.env`. Per defecte és:

```env
PORTAL_PORT=8082
```

### L'API apareix com no disponible

```bash
curl http://localhost:8082/api/health
make logs
```

Si `curl` no retorna `{"status":"ok"}`, revisa els logs d'`id-api`.

### Puc generar credencials sense haver escrit el token

Probablement el navegador conserva una cookie docent d'una sessió anterior. Usa el botó `Eixir` del portal o prova amb una finestra privada. Sense cookie docent, l'API ha de retornar `401 teacher authentication required`.

### L'alumne no pot entrar

Usa una targeta acabada de generar. El CSV no conté PINs. Si has tancat o reiniciat la pàgina després de generar credencials, genera un grup nou per a la demo o prepara-la amb:

```bash
make bootstrap-demo
```

### Vull començar de zero

Fes una còpia si vols conservar l'estat actual:

```bash
make backup
```

Després reinicia les dades locals:

```bash
make reset
make up
```

## Limitacions actuals

- És una demo tècnica inicial.
- El professorat entra amb token local, no amb SSO.
- No hi ha Authentik encara.
- EduHoot ja es pot activar com a mòdul opcional (`COMPOSE_PROFILES=eduhoot`, veure README); Banc de recursos i Robotics encara no estan integrats.
- No s'han de carregar dades reals d'alumnat.
