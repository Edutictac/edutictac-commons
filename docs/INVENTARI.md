# Inventari tècnic — EduTicTac Commons Stack

> Repo: `edutictac-commons`  
> Versió base: `0.1.0-alpha`  
> Data inicial: 2026-09-14

Aquest inventari descriu què arranca el stack local, on guarda les dades i
quins comandaments s'usen per operar-lo. No inclou secrets ni valors locals de
`.env`.

## Serveis

| Servei Compose | Imatge | Exposició | Funció |
|---|---|---|---|
| `portal` | `${IMAGE_REGISTRY}/commons-portal:${IMAGE_TAG}` | `PORTAL_PORT` -> `80` (`8082` per defecte) | Portal web demo i proxy `/api/` cap a `id-api` |
| `id-api` | `${IMAGE_REGISTRY}/commons-id-api:${IMAGE_TAG}` | intern `8005` | API de credencial pseudònima, grups, sessions, assignacions i puntuacions |
| `eduhoot` | `${IMAGE_REGISTRY}/eduhoot:${EDUHOOT_TAG}` | `EDUHOOT_PORT` -> `3000` (`8090` per defecte) | Activitat de qüestionari opcional |
| `eduhoot-mongo` | `mongo:7` | intern `27017` | Base de dades MongoDB d'EduHoot |
| `admin` | `${IMAGE_REGISTRY}/commons-admin:${ADMIN_TAG:-${IMAGE_TAG}}` | `ADMIN_PORT` -> `8091`, només `127.0.0.1` | Panell `/admin`: estat operatiu i accions de backup (vegeu secció pròpia més avall) |

`eduhoot` i `eduhoot-mongo` només s'activen si `COMPOSE_PROFILES=eduhoot`.
`admin` arranca sempre amb `make up`/`make up-pulled`, sense pas de terminal
addicional. `ADMIN_TAG` és una variable independent per a fixar l'admin a una
versió pròpia; si no es defineix cau a `IMAGE_TAG` (vegeu «Actualitzacions
d'imatges» més avall).

## Ports

| Port host | Variable | Servei | Notes |
|---:|---|---|---|
| `8082` | `PORTAL_PORT` | `portal` | Entrada principal del stack |
| `8090` | `EDUHOOT_PORT` | `eduhoot` | Només amb perfil `eduhoot` |
| `8091` | `ADMIN_PORT` | `admin` | Panell `/admin`; publicat només a `127.0.0.1` del host |

`id-api` no publica port al host; el portal el consumeix per la xarxa interna
de Compose.

## Dades persistents

| Ruta local | Propietari habitual | Contingut | Versionat |
|---|---|---|---|
| `data/id.db` | contenidor `id-api` | SQLite de grups, identitats, sessions, assignacions i puntuacions | No |
| `data/id.db-wal`, `data/id.db-shm` | contenidor `id-api` | fitxers auxiliars SQLite | No |
| `data/eduhoot-mongo/` | contenidor MongoDB | base Mongo d'EduHoot | No |
| `data/eduhoot-uploads/` | contenidor `eduhoot` | imatges pujades a EduHoot | No |
| `data/eduhoot-logs/` | contenidor `eduhoot` | informes i logs locals d'EduHoot | No |
| `backups/` | host | carpetes `commons-<stamp>/` amb `manifest.json` i dades per servei, generades per `make backup` (manual) o `make backup-auto` (timer diari), amb retenció via `make backup-prune` | No, excepte `.gitkeep` |
| `dist/` | host | paquets exportats i credencials demo | No, excepte `.gitkeep` |

Cap d'aquestes dades ha d'entrar al repositori. Només es versionen els
`.gitkeep` de carpetes buides.

## Política de backup

Regla del projecte: **tot servei amb dades persistents ha de tindre backup,
restauració documentada i verificació**. No s'accepta afegir un servei nou al
stack si no declara explícitament:

- quines dades guarda;
- on les guarda;
- com es fa backup;
- com es restaura;
- com es comprova que la restauració funciona.

Estat actual:

| Dades | Cobertura actual | Objectiu |
|---|---|---|
| `data/id.db` | `make backup` / `make restore` / `make backup-check`, amb `manifest.json` i checksum | mantindre |
| `data/eduhoot-mongo/` (base `kahootDB`) | `make backup` / `make restore` / `make backup-check` via `mongodump`/`mongorestore` (`eduhoot/mongo.archive`) | mantindre |
| `data/eduhoot-uploads/` | `make backup` / `make restore` via tar (`eduhoot/uploads.tar`) | mantindre |
| `data/eduhoot-logs/` | `make backup` / `make restore` via tar (`eduhoot/logs.tar`) — són informes de sessió amb resultats reals de l'alumnat, no logs tècnics descartables | mantindre |
| `.env` local | pendent | còpia segura fora del repo, mai impresa ni versionada |

Cobertura d'EduHoot condicionada a que `eduhoot-mongo` estiga en marxa en el
moment del backup (si no ho està, el `manifest.json` ho declara en
`warnings[]` i `make backup-check` ho detecta). La restauració exigeix que
`COMPOSE_PROFILES=eduhoot` estiga actiu en el `.env` de destí. Els directoris
`eduhoot-uploads`/`eduhoot-logs` són propietat de l'uid intern del contenidor
`eduhoot` (no té `PUID`/`PGID` com `id-api`); `make restore` fa servir la
imatge `mongo:7` (ja necessària per `eduhoot-mongo`) com a root per
llegir/sobreescriure eixos directoris sense dependre de permisos de l'host.

El panell `/admin` (servei `admin`, vegeu secció pròpia) ja mostra l'estat de
l'últim backup, permet crear-ne un manualment, llista còpies disponibles,
permet restaurar una còpia seleccionada (amb confirmació forta) i avisa de
serveis no coberts. El flux d'actualització d'imatges ja exigeix un backup
recent i verificable abans de descarregar i reiniciar serveis.

## Configuració

| Fitxer | Estat | Ús |
|---|---|---|
| `.env.example` | versionat | plantilla segura per crear `.env` |
| `.env` | local, ignorat | configuració real del stack local o del centre |
| `compose.yml` | versionat | definició dels serveis i volums |
| `VERSION` | versionat | versió del paquet propi |

Variables principals:

- `IMAGE_REGISTRY`: registre o prefix d'imatges.
- `IMAGE_TAG`: versió de `commons-portal`, `commons-id-api` i `commons-play`.
- `ADMIN_TAG`: versió de `commons-admin`. Si no es defineix en `.env`, cau a
  `IMAGE_TAG` (`compose.yml`: `${ADMIN_TAG:-${IMAGE_TAG:-...}}`). `make
  update-images`/`make rollback-images` mantenen `ADMIN_TAG` sincronitzada amb
  `IMAGE_TAG` automàticament (vegeu «Actualitzacions d'imatges»); només cal
  editar-la a mà si es vol fixar l'admin a una versió pròpia, diferent de la
  resta del bundle.
- `UPDATE_CHANNEL`: canal d'actualització (`stable`, `testing` o `dev`).
- `PORTAL_PORT`: port públic del portal.
- `EDUTICTAC_ID_SECRET`: secret de signatura de sessions.
- `EDUTICTAC_ID_TEACHER_TOKEN`: token docent inicial.
- `EDUTICTAC_ID_APP_TOKEN`: token intern perquè apps integrades (ara EduHoot)
  registren puntuacions en Commons.
- `EDUTICTAC_ID_OIDC_ISSUER_URL`, `EDUTICTAC_ID_OIDC_CLIENT_ID`,
  `EDUTICTAC_ID_OIDC_CLIENT_SECRET` i `EDUTICTAC_ID_OIDC_REDIRECT_URL`:
  integració opcional amb Authentik; si estan buides es manté codi + PIN.
- `EDUTICTAC_ID_OIDC_SCOPES` i `EDUTICTAC_ID_OIDC_ROLE_CLAIM`: scopes OIDC i
  claim de rols (`alumno`, `profesor`, `administrador`).
- `COMPOSE_PROFILES`: activa mòduls opcionals, ara `eduhoot`.
- `EDUHOOT_PORT`: port públic d'EduHoot (`8090` per defecte).
- `EDUHOOT_TAG`: versió de la imatge `eduhoot`.
- `EDUHOOT_ID_AUTH_REQUIRED`: si val `0`, EduHoot accepta nom curt o codi +
  PIN Commons; si val `1`, exigeix codi + PIN Commons.
- `EDUHOOT_PUBLIC_IMPORT_SOURCE`: font d'importació d'activitats públiques
  d'EduHoot; buit desactiva la funció.
- `ADMIN_OIDC_USERNAME`: identitat Authentik autoritzada per al panell `/admin`;
  per defecte `akadmin`.
- `ADMIN_PORT`: port del panell `/admin` al host (només `127.0.0.1`).

En qualsevol entorn que no siga demo local cal canviar
`EDUTICTAC_ID_SECRET`, `EDUTICTAC_ID_TEACHER_TOKEN` i
`EDUTICTAC_ID_APP_TOKEN`.

## Comandaments d'operació

| Comandament | Funció |
|---|---|
| `make doctor` | comprova requisits locals: Docker, Compose, `curl`, `jq`, `python3` |
| `make up` | construeix i arranca el stack |
| `make up-pulled` | arranca imatges ja descarregades, sense reconstruir |
| `make down` | para contenidors sense esborrar dades |
| `make ps` | mostra l'estat dels serveis |
| `make logs` | mostra logs del stack |
| `make test-flow` | prova docent -> credencials -> alumne -> puntuació -> resultats |
| `make test-eduhoot-flow` | amb `COMPOSE_PROFILES=eduhoot`, prova identitat Commons -> assignació EduHoot -> puntuació interna -> resultats/rànquing |
| `CONFIRM_RESET_TEST=1 make test-reset-flow` | prova destructiva i restaurada: backup previ -> dades temporals -> reset -> Commons buit -> restore |
| `make bootstrap-demo` | crea grup, activitat i TSV de credencials demo |
| `make backup` | crea `backups/commons-<stamp>/` amb `manifest.json` i `id-api/id.db` |
| `make backup-check` | comprova sense tocar dades que hi ha un backup recent, amb manifest i checksums vàlids i cobertura de tots els serveis actius |
| `make backup-auto` | encadena `backup` + `backup-check` + `backup-prune`; és el que executa el timer automàtic |
| `make backup-prune` | aplica retenció (per defecte 7 diaris / 4 setmanals / 6 mensuals) sobre `backups/commons-*` |
| `make backup-timer-install` | instal·la un timer d'usuari de systemd que executa `backup-auto` cada dia a les 03:15 |
| `make backup-timer-status` | mostra la pròxima execució i l'últim resultat del timer |
| `make backup-timer-uninstall` | desinstal·la el timer d'usuari de systemd |
| `make restore BACKUP=backups/commons-<stamp>/` | restaura una carpeta de backup, arranca els serveis, comprova la salut del portal i executa `test-flow` |
| `make reset` | reinicia les dades locals de la demo |
| `make check-images` | comprova que les imatges configurades existeixen al registre Docker/OCI |
| `make check-updates` | consulta tags remots i compara la versió instal·lada amb el candidat del canal configurat |
| `make update-images` | crea i verifica backup, aplica el candidat del canal en `.env`, descarrega imatges, reinicia amb `--no-build`, comprova salut i executa `test-flow` |
| `make rollback-images BACKUP=commons-<stamp>` | crea un backup de seguretat i torna als tags d'imatge guardats en el backup d'una actualització; no restaura dades |
| `make export-images` | genera un arxiu `.tar` amb imatges pròpies |
| `make load-images ARCHIVE=...` | carrega imatges des d'un `.tar` |
| `make push-images` | publica imatges al registre configurat |
| `make release-check` | comprovació pre-entrega: requisits, sintaxi, artefactes i flux funcional |

Si Docker requereix privilegis:

```bash
make DOCKER="sudo docker" release-check
```

## Comprovacions de salut

Comprovació ràpida del portal i l'API:

```bash
curl http://127.0.0.1:8082/api/health
make test-flow
```

El contenidor `id-api` també té un healthcheck intern contra:

```text
http://127.0.0.1:8005/api/health
```

Amb EduHoot actiu, la seua configuració d'identitat es pot comprovar amb:

```bash
curl http://127.0.0.1:8090/api/player-auth/config
```

El mode mixt esperat torna `{"enabled":true,"required":false}`. Això significa
que l'alumnat pot entrar amb nom curt o amb codi + PIN Commons. Si usa codi +
PIN, EduHoot valida contra `id-api`, no demana cap nom addicional i envia la
puntuació final a Commons per `/api/apps/eduhoot/scores` amb
`EDUTICTAC_ID_APP_TOKEN`.

El panell `/admin` (`http://127.0.0.1:8091/`) mostra l'estat agregat: versió
instal·lada, serveis actius, últim backup, cobertura i estat del timer de
backup automàtic. També permet crear backups, restaurar una còpia seleccionada
i activar/desactivar el timer.

## Actualitzacions d'imatges

El stack usa imatges Docker/OCI fixades per variables:

- `IMAGE_REGISTRY`
- `IMAGE_TAG`
- `ADMIN_TAG` (opcional; cau a `IMAGE_TAG` si no es defineix)
- `EDUHOOT_TAG`
- `UPDATE_CHANNEL`: `stable`, `testing` o `dev`.

Les imatges pròpies versionades són `commons-id-api`, `commons-portal`,
`commons-admin` i `commons-play`. `scripts/push-images.sh` les construeix i
publica totes juntes sota el mateix `IMAGE_TAG` — és a dir, el disseny és que
formen un únic bundle versionat, encara que `commons-admin` es resol amb la
variable independent `ADMIN_TAG` en `compose.yml`
(`${ADMIN_TAG:-${IMAGE_TAG:-0.1.1-alpha}}`). La política objectiu és no usar
`latest` en centres. El panell `/admin` mostra el registre i les versions
d'imatge configurades (`IMAGE_REGISTRY`, `IMAGE_TAG`, `EDUHOOT_TAG`) i pot
iniciar una actualització guiada des del host amb `systemd-run --user`.

`scripts/apply-update-tags.py` és l'únic punt on `update-images.sh` i
`rollback-images.sh` escriuen tags en `.env`: quan actualitza `IMAGE_TAG`
també escriu `ADMIN_TAG` amb el mateix valor, per a que `commons-admin`
avance sempre junt amb la resta del bundle en el flux normal (botó
«Actualitzar imatges» del panell o `make update-images`/`make
rollback-images`). Un centre que vullga fixar l'admin a una versió pròpia pot
editar `ADMIN_TAG` a mà en `.env` després d'una actualització; el pròxim
`update-images`/`rollback-images` la tornarà a igualar a `IMAGE_TAG`.

`make check-images` consulta les imatges configurades al registre amb
`docker manifest inspect`. No canvia dades ni contenidors; serveix per detectar
tags inexistents o falta de permisos. Comprova `commons-admin` contra
`ADMIN_TAG` (no contra `IMAGE_TAG` directament), amb el mateix fallback que
`compose.yml`. Si `COMPOSE_PROFILES=eduhoot`, també inclou
`${IMAGE_REGISTRY}/eduhoot:${EDUHOOT_TAG}`.

`make check-updates` consulta tags remots i selecciona el candidat més recent
del canal:

- `stable`: només tags `X.Y.Z`;
- `testing`: tags semver amb preversions (`0.1.0-alpha`, `0.1.0-rc1`, etc.);
- `dev`: qualsevol tag no `latest`.

`make update-images` és el flux segur actual:

1. backup nou i verificable (`backup.sh` + `backup-check.sh`);
2. detecció del candidat del canal i actualització local de `IMAGE_TAG` /
   `ADMIN_TAG` / `EDUHOOT_TAG` en `.env` (`apply-update-tags.py`);
3. verificació amb `check-images.sh` que totes les imatges (incloent-hi
   `commons-admin`) existeixen al registre abans de tocar res més;
4. descàrrega de noves imatges;
5. reinici controlat amb `docker compose up -d --wait --no-build`;
6. healthchecks;
7. `test-flow` final.

`make rollback-images BACKUP=commons-<stamp>` segueix el mateix patró amb els
tags guardats en `update.json` del backup indicat, i també passa per
`apply-update-tags.py` (per tant sincronitza `ADMIN_TAG` igual que
`update-images`). Bug corregit: abans, `check-images.sh` comprovava
`commons-admin` contra `IMAGE_TAG` en lloc de `ADMIN_TAG`; com que
`ADMIN_TAG` sol anar per davant o per darrere de `IMAGE_TAG`, la comprovació
fallava quasi sempre i el rollback s'avortava sense arribar a canviar res
(vegeu «Riscos operatius» sobre l'abort segur).

Rollback manual si alguna comprovació falla: restaurar el backup acabat de
crear amb `make restore BACKUP=backups/commons-<stamp>/`. Si l'error passa
abans de completar la verificació, `update-images.sh`/`rollback-images.sh`
restauren els tags anteriors en `.env` (mateix mecanisme, via
`apply-update-tags.py`); si falla després d'un reinici parcial, revisa `.env` i
executa `make up-pulled`.

### Publicar un bundle nou d'imatges

Flux normal (recomanat) per a publicar una versió nova de
`commons-id-api`/`commons-portal`/`commons-admin`/`commons-play` juntes:

```bash
IMAGE_TAG=0.1.1-alphaNN sh scripts/push-images.sh
```

Construeix (`docker compose build`, sense `SKIP_BUILD=1`) i publica les 4
imatges sota el mateix tag. Després, en el host desplegat:

```bash
sudo python3 scripts/apply-update-tags.py --image-tag 0.1.1-alphaNN
sudo sh scripts/check-images.sh
sudo env PWD=/opt/edutictac-commons docker compose --env-file .env -f compose.yml pull
sudo env PWD=/opt/edutictac-commons docker compose --env-file .env -f compose.yml up -d --wait --no-build
```

Este és el mateix camí que segueix `make update-images`, fet a mà per a
publicar sense esperar que `check-updates.py` detecte el candidat.

### Reconstruir només `commons-admin`

Per a un canvi que només afecta l'admin (per exemple una funcionalitat nova
del panell) sense voler bumpejar `IMAGE_TAG` de tot el bundle:

```bash
ADMIN_TAG=0.1.1-alphaNN docker compose --env-file .env -f compose.yml build admin
docker push registry.edutictac.es/edutictac/commons-admin:0.1.1-alphaNN
sudo sed -i 's/^ADMIN_TAG=.*/ADMIN_TAG=0.1.1-alphaNN/' /opt/edutictac-commons/.env
cd /opt/edutictac-commons
sudo env PWD=/opt/edutictac-commons docker compose --env-file .env -f compose.yml up -d admin
```

**Important:**

- `docker build`/`docker push` s'han d'executar **sense `sudo`**, amb l'usuari
  normal (membre del grup `docker`, ja autenticat contra el registre). `sudo
  docker push` sol fallar amb `denied: requested access to the resource is
  denied` perquè el context Docker de `root` no té l'autenticació del
  registre — i si s'insisteix amb `sudo -E docker ... build`, es poden deixar
  fitxers propietat de `root` sota `~/.docker/buildx/` que després bloquegen
  `docker buildx` per a l'usuari normal (`open
  ~/.docker/buildx/current: permission denied`); si passa,
  `sudo chown -R <usuari>:<usuari> ~/.docker` ho arregla.
- El servei `admin` de `compose.yml` fa `pid: host` i usa `REPO_DIR: ${PWD}`
  perquè `systemctl --user` dins del contenidor resolga el manager
  d'usuari del **host** (via `SO_PEERCRED` sobre el socket compartit); les
  accions d'actualització/restauració del panell criden `systemd-run --user`
  amb eixe `REPO_DIR` com a `WorkingDirectory`, i s'executen al host, no dins
  del contenidor. `sudo` esborra variables d'entorn (incloent `PWD`) per
  defecte, així que un `sudo docker compose ... up -d admin` sol deixa
  `REPO_DIR` buit dins del contenidor sense avisar-ho clarament (compose
  només mostra un avís ambigu, `"PWD" variable is not set`) — i
  `os.environ.get("REPO_DIR", ...)` en `admin/server.py` només aplica el
  valor per defecte quan la variable no existeix, no quan existeix buida, així
  que l'error passa desapercebut fins que falla una actualització real. Cal
  fer sempre `sudo env PWD=/opt/edutictac-commons docker compose ... up -d
  admin` (o equivalent) quan es recrea el contenidor `admin` a mà. Es pot
  comprovar amb `docker exec edutictac-commons-admin-1 sh -c 'echo
  $REPO_DIR'`.

## Riscos operatius

- `.env` conté secrets locals: no s'ha de mostrar ni versionar.
- Els PINs només es retornen en el moment de generar o regenerar credencials.
- El CSV exporta codis públics, no PINs.
- Si `COMPOSE_PROFILES=eduhoot`, `make backup` cobreix `data/eduhoot-*` sempre
  que `eduhoot-mongo` estiga en marxa en fer el backup; si no ho està, el
  manifest ho avisa i `make backup-check` ho marca com a `FAIL`.
- `make reset` esborra dades locals de demo; cal fer `make backup` abans si es
  vol conservar l'estat.
- En un centre no s'han d'usar els valors demo `change-this-local-secret` ni
  `dev-teacher`.
- `id-api` arranca amb l'UID/GID de `PUID`/`PGID` (per defecte `1000:1000`)
  perque `data/id.db` quede a nom de l'usuari del sistema, no d'un UID intern
  fix; si el host on s'instal·la té un usuari amb un altre UID, cal ajustar
  `PUID`/`PGID` a `.env` abans de `make up` per evitar errors de permisos en
  `make restore`.
- El timer automàtic de backup (`make backup-timer-install`, o el botó
  equivalent del panell `/admin`) és un timer **d'usuari** de systemd: si
  eixe usuari no manté sessió oberta habitualment, cal
  `sudo loginctl enable-linger <usuari>` perque s'execute igualment a les
  03:15.
- El contenidor `admin` és l'únic del stack amb accés al `systemd --user`
  del host, amb el mateix UID que `PUID`/`PGID` (mai root). Aquest accés es
  limita per allowlist de codi a
  `install-backup-timer.sh`/`uninstall-backup-timer.sh` (cap dada de la
  petició HTTP arriba a un shell); no es munta `docker.sock`. Muntatges i
  configuració necessaris, verificats en marxa real (no només documentats
  com a disseny):
  - `/run/user/${PUID}/bus` **i** el directori sencer
    `/run/user/${PUID}/systemd` (no només `bus`): `systemctl --user` parla
    amb el manager per un socket local directe
    (`XDG_RUNTIME_DIR/systemd/private`), no només pel bus de sessió.
  - `/run/systemd/system:ro`: marcador que `sd_booted()` comprova abans de
    permetre `enable --now`; sense muntar-lo, `--now` es nega encara que la
    resta de la connexió funcione.
  - `pid: host` al servei `admin`: `systemctl --user` resol el PID del
    procés manager del host via `SO_PEERCRED` sobre el socket privat; si el
    contenidor té un espai de noms de PID propi, eixe procés és invisible i
    el kernel torna `pid=0`, que systemd tracta com a credencial invàlida
    ("Failed to connect... No data available"). Aquest és l'únic mecanisme
    conegut per resoldre-ho; dona visibilitat de la llista de processos del
    host (no control ni ptrace) — una exposició més enllà del disseny
    original (només sockets/bus), acceptada conscientment.
  - `build: network: host` a la imatge `admin`: alguns hosts (p.ex.
    NetworkManager amb resolver local en `127.0.0.1`) fan que `apt-get
    update` falle per DNS durant `docker compose build` si el build no usa
    la xarxa del host.
  - El paquet `systemd` s'instal·la amb `SYSTEMD_OFFLINE=1` només com a
    prefix inline de les comandes `apt-get` del `RUN`, mai com `ENV` de la
    imatge: com `ENV` persistiria en temps d'execució i faria que
    `systemctl` tractara el contenidor com un chroot, ignorant totes les
    ordres.
  El panell escolta només a `127.0.0.1` del host per defecte i requereix la
  sessió Authentik de `ADMIN_OIDC_USERNAME` (per defecte, `akadmin`); per a
  accés remot, cal usar un túnel SSH o Tailscale, mai exposar-lo directament
  a internet.

## Fitxers que no s'han de versionar

- `.env`
- `data/*` excepte `data/.gitkeep`
- `backups/*` excepte `backups/.gitkeep`
- `dist/*` excepte `dist/.gitkeep`
- bases SQLite, backups, arxius `.tar`, TSV de credencials demo i logs locals

`make release-check` comprova part d'aquesta política abans de compartir una
versió.
