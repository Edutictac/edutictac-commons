# Instal·lació en centres educatius

Per a instal·lar el paquet sense preparar un entorn de desenvolupament,
comença per la [guia bàsica d’instal·lació](docs/INSTALACION-RAPIDA.md).

Entrega: [Commons 0.1.1-beta6.3](releases/0.1.1-beta6.3/README.md), publicada
en el repositori APT i el registre d'imatges. La versió anterior és la
beta6.2.1. El paquet amd64 descarrega les
imatges; el trasllat xifrat d'aules continua desactivat per defecte.
Per a actualitzar: primer el paquet, després les imatges des d’Administració.
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

## Secrets de producció

El paquet genera secrets aleatoris i posa `EDUTICTAC_ENV=production`. Si
instal·les manualment amb `make up`, canvia abans
`EDUTICTAC_ID_SECRET`, `EDUTICTAC_ID_TEACHER_TOKEN`, `EDUTICTAC_ID_APP_TOKEN`
i els tokens `PLAY_ID_APP_TOKEN`, `RECURSOS_ID_APP_TOKEN` i
`EDUHOOT_ID_APP_TOKEN`. En producció, l'API refusa arrancar si detecta els
valors de demo.

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

## Xifratge de les còpies

Abans d'usar el centre amb dades reals, configura una clau age pròpia:

```bash
# En el teu equip, no en el servidor
age-keygen -o ~/edutictac-backup-key.txt
age-keygen -y ~/edutictac-backup-key.txt
```

Posa la clau pública en `BACKUP_AGE_RECIPIENT` i la ruta de la privada en
`BACKUP_AGE_IDENTITY_FILE` (només per restaurar). Amb
`BACKUP_ENCRYPTION_REQUIRED=1`, si no hi ha recipient el backup falla en lloc
de crear-se en clar. La clau privada no s'ha de copiar al servidor.

En una instal·lació nova, el selector **Eines del centre** mostra un camp per
a la clau pública si encara no n'hi ha. Enganxa només la línia `age1...`; el
formulari desa la pública en `.env` i no guarda la privada al servidor.

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
imatges, **fixa els digests resolts** i reinicia serveis; després executa
`make test-flow`. Actualitza totes les imatges pròpies (`commons-id-api`,
`commons-portal`, `commons-admin` i `commons-play`) en un sol pas, incloent el
panell `/admin`: no cal cap acció manual addicional perquè el panell quede al
dia. Si qualsevol comprovació falla després d'haver canviat els tags, es fa un
**rollback automàtic** als tags i digests anteriors.

Si una actualització falla alguna comprovació, es pot desfer amb:

```bash
make rollback-images BACKUP=commons-<stamp>
```

on `<stamp>` és el backup creat automàticament abans de l'actualització (es
mostra en la seua eixida, o es pot vore amb `ls backups/`).

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

## Activar Authentik SSO

Authentik és opcional i permet que professorat i administració entren amb un compte SSO en lloc
del token/PIN local. Per activar-lo:

1. En `.env`, activa el perfil i genera les credencials pròpies d'Authentik:

   ```env
   COMPOSE_PROFILES=authentik
   AUTHENTIK_PG_PASS=<genera amb: openssl rand -base64 48>
   AUTHENTIK_SECRET_KEY=<genera amb: openssl rand -base64 48>
   ```

2. Genera tu mateix un parell client_id/client_secret (no cal crear l'aplicació OAuth2 des de la
   interfície web d'Authentik: el blueprint `authentik-blueprints/edutictac-commons.yaml` la crea
   automàticament amb els valors que li passes per variable d'entorn):

   ```bash
   openssl rand -hex 16    # -> EDUTICTAC_ID_OIDC_CLIENT_ID
   openssl rand -base64 48 # -> EDUTICTAC_ID_OIDC_CLIENT_SECRET
   ```

3. Omple en `.env` (substituïx `edutictac.local` pel domini/IP real si cal):

   ```env
   EDUTICTAC_ID_OIDC_ISSUER_URL=http://edutictac.local:9000/application/o/edutictac-commons/
   EDUTICTAC_ID_OIDC_DISCOVERY_URL=http://authentik-server:9000/application/o/edutictac-commons/.well-known/openid-configuration
   EDUTICTAC_ID_OIDC_AUTHORIZATION_URL=http://edutictac.local:9000/application/o/authorize/
   EDUTICTAC_ID_OIDC_CLIENT_ID=<el valor generat en el pas 2>
   EDUTICTAC_ID_OIDC_CLIENT_SECRET=<el valor generat en el pas 2>
   EDUTICTAC_ID_OIDC_REDIRECT_URL=http://edutictac.local:8082/api/auth/oidc/callback
   EDUTICTAC_ID_OIDC_ROLE_CLAIM=groups

   EDUHOOT_AUTHENTIK_CLIENT_ID=<el mateix valor generat en el pas 2>
   EDUHOOT_AUTHENTIK_CLIENT_SECRET=<el mateix valor generat en el pas 2>
   ```

   `RECURSOS_OIDC_REDIRECT_URI` i `EDUHOOT_AUTHENTIK_REDIRECT_URI` ja venen omplits per defecte en
   `.env.example`; no cal tocar-los llevat que canvies l'host. Nota important:
   `EDUTICTAC_ID_OIDC_ROLE_CLAIM` ha de ser `groups`, no `roles` — és la claim que el blueprint
   assigna als grups `administrador`/`profesor` d'Authentik.

4. Arranca (o reinicia) els serveis d'Authentik perquè apliquen el blueprint amb estos valors:

   ```bash
   make up-authentik
   ```

5. Verifica:

   ```bash
   make test-authentik-config
   ```

   Hauria de mostrar `Authentik OIDC activo`. Si no, revisa `make doctor`.

Amb `EDUTICTAC_ID_OIDC_*` buit (per defecte), el professorat continua entrant amb el token local /
codi + PIN Commons sense cap canvi.

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
(`http://<host-del-centre>:8082/admin/`, amb el rol `administrador` o
l'usuari `ADMIN_OIDC_USERNAME`; només des del servidor, la Tailnet o un
túnel SSH) — vegeu
`README.md#panell-dadministracio` i la guia pas a pas
[docs/GUIA-ADMIN.md](docs/GUIA-ADMIN.md).

## TLS, HSTS i ingress

Producció publica Commons darrere nginx amb TLS, HSTS, `Permissions-Policy` i
una CSP conservadora (`frame-ancestors`, `base-uri`, `object-src`,
`form-action`). Els ports interns (`8084`, `8086`, `8090`, `8098`, `9000`,
`9443`) estan lligats a `127.0.0.1` i no s'exposen directament.

En una instal·lació de centre el portal continua en HTTP. Per exposar-lo fora
de la LAN, posa un proxy invers amb TLS davant del portal i no òbrigs els
ports directes de les apps a Internet. L'ingress únic amb TLS automàtic per a
centres queda pendent; el paquet no genera certificats.

### Ingress TLS opcional amb Caddy

Per publicar el portal amb HTTPS sense instal·lar nginx al host:

```bash
make up-ingress
```

Això recrea el portal en `127.0.0.1:8082` i arranca Caddy en els ports 80/443.
Per defecte usa `edutictac.local` i una **CA interna**; els dispositius han de
confiar-hi:

```bash
make ingress-ca
# distribueix dist/caddy-root.crt i instal·la'l com a autoritat de confiança
```

Per a un domini públic amb DNS i ports 80/443 accessibles, posa a `.env`:

```env
COMMONS_INGRESS_HOST=commons.example.org
INGRESS_CADDYFILE=./services/ingress/Caddyfile.acme
```

i torna a executar `make up-ingress`. Caddy obtindrà el certificat per ACME.
Per tornar enrere: `make down-ingress` i `make up`.

L'ingress cobreix el portal; les apps (`recursos`, `blocs`, `eduhoot`, etc.)
continuen publicant els seus ports directes. No els exposos a Internet sense
un proxy propi.

## Accés directe després d'instal·lar

L'instal·lador mostra sempre l'adreça del portal i, si la pot detectar, també
la IP:

```text
Accés al portal: http://edutictac.local:8082/
Accés per IP:   http://192.168.1.50:8082/
```

Crea una entrada al menú d'aplicacions i, per a l'usuari que ha instal·lat,
una icona a l'escriptori. La icona usa `edutictac-commons-open`, que prova
primer el nom mDNS i després la IP, de manera que no queda trencada si
`edutictac.local` no resol en eixe equip.

## LAN sense Internet i accés per IP

El portal i les apps no depenen de CDN ni de serveis externs per funcionar. Si
`edutictac.local` no resol en algun dispositiu, useu `http://<IP-del-servidor>:8082/`.
Per al login docent per IP, configureu `EDUTICTAC_PUBLIC_HOST=<IP>` i
reapliqueu la configuració. Diagnòstic: `make lan-doctor`.
Detall i compatibilitat mDNS: [docs/LAN-SENSE-INTERNET.md](docs/LAN-SENSE-INTERNET.md).

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
- El professorat pot entrar amb token local o, si s'activa, amb SSO via Authentik (veure "Activar Authentik SSO").
- EduHoot ja es pot activar com a mòdul opcional (`COMPOSE_PROFILES=eduhoot`, veure README); Banc de recursos i Robotics encara no estan integrats.
- No s'han de carregar dades reals d'alumnat.
