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
| `admin` | `${IMAGE_REGISTRY}/commons-admin:${IMAGE_TAG}` | `ADMIN_PORT` -> `8091`, només `127.0.0.1` | Panell `/admin`: estat operatiu i accions de backup (vegeu secció pròpia més avall) |

`eduhoot` i `eduhoot-mongo` només s'activen si `COMPOSE_PROFILES=eduhoot`.
`admin` arranca sempre amb `make up`/`make up-pulled`, sense pas de terminal
addicional.

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
serveis no coberts. Bloquejar actualitzacions si no hi ha un backup recent i
verificable queda pendent del punt 7 (actualitzacions Docker/OCI).

## Configuració

| Fitxer | Estat | Ús |
|---|---|---|
| `.env.example` | versionat | plantilla segura per crear `.env` |
| `.env` | local, ignorat | configuració real del stack local o del centre |
| `compose.yml` | versionat | definició dels serveis i volums |
| `VERSION` | versionat | versió del paquet propi |

Variables principals:

- `IMAGE_REGISTRY`: registre o prefix d'imatges.
- `IMAGE_TAG`: versió de `commons-portal` i `commons-id-api`.
- `UPDATE_CHANNEL`: canal d'actualització (`stable`, `testing` o `dev`).
- `PORTAL_PORT`: port públic del portal.
- `EDUTICTAC_ID_SECRET`: secret de signatura de sessions.
- `EDUTICTAC_ID_TEACHER_TOKEN`: token docent inicial.
- `EDUTICTAC_ID_APP_TOKEN`: token intern perquè apps integrades (ara EduHoot)
  registren puntuacions en Commons.
- `COMPOSE_PROFILES`: activa mòduls opcionals, ara `eduhoot`.
- `EDUHOOT_PUBLIC_IMPORT_SOURCE`: font d'importació d'activitats públiques
  d'EduHoot; buit desactiva la funció.
- `EDUTICTAC_ADMIN_TOKEN`: token d'accés al panell `/admin`.
- `ADMIN_PORT`: port del panell `/admin` al host (només `127.0.0.1`).

En qualsevol entorn que no siga demo local cal canviar
`EDUTICTAC_ID_SECRET`, `EDUTICTAC_ID_TEACHER_TOKEN` i
`EDUTICTAC_ID_APP_TOKEN` i `EDUTICTAC_ADMIN_TOKEN`.

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

El panell `/admin` (`http://127.0.0.1:8091/`) mostra l'estat agregat: versió
instal·lada, serveis actius, últim backup, cobertura i estat del timer de
backup automàtic. També permet crear backups, restaurar una còpia seleccionada
i activar/desactivar el timer.

## Actualitzacions d'imatges

El stack usa imatges Docker/OCI fixades per variables:

- `IMAGE_REGISTRY`
- `IMAGE_TAG`
- `EDUHOOT_TAG`
- `UPDATE_CHANNEL`: `stable`, `testing` o `dev`.

Les imatges pròpies versionades són `commons-id-api`, `commons-portal` i
`commons-admin`. La política objectiu és no usar `latest` en centres. El
panell `/admin` mostra el registre i les versions d'imatge configurades
(`IMAGE_REGISTRY`, `IMAGE_TAG`, `EDUHOOT_TAG`) i pot iniciar una actualització
guiada des del host amb `systemd-run --user`.

`make check-images` consulta les imatges configurades al registre amb
`docker manifest inspect`. No canvia dades ni contenidors; serveix per detectar
tags inexistents o falta de permisos. Si `COMPOSE_PROFILES=eduhoot`, també
inclou `${IMAGE_REGISTRY}/eduhoot:${EDUHOOT_TAG}`.

`make check-updates` consulta tags remots i selecciona el candidat més recent
del canal:

- `stable`: només tags `X.Y.Z`;
- `testing`: tags semver amb preversions (`0.1.0-alpha`, `0.1.0-rc1`, etc.);
- `dev`: qualsevol tag no `latest`.

`make update-images` és el flux segur actual:

1. backup nou i verificable (`backup.sh` + `backup-check.sh`);
2. detecció del candidat del canal i actualització local de `IMAGE_TAG` /
   `EDUHOOT_TAG` en `.env`;
3. descàrrega de noves imatges;
4. reinici controlat amb `docker compose up -d --wait --no-build`;
5. healthchecks;
6. `test-flow` final.

Rollback manual si alguna comprovació falla: restaurar el backup acabat de
crear amb `make restore BACKUP=backups/commons-<stamp>/`. Si l'error passa
abans de completar la verificació, `update-images.sh` restaura els tags
anteriors en `.env`; si falla després d'un reinici parcial, revisa `.env` i
executa `make up-pulled`.

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
  El panell escolta només a `127.0.0.1` del host per defecte i requereix
  `EDUTICTAC_ADMIN_TOKEN`: cal canviar el valor per defecte i, per a accés
  remot, usar un túnel SSH o Tailscale, mai exposar-lo directament a
  internet.

## Fitxers que no s'han de versionar

- `.env`
- `data/*` excepte `data/.gitkeep`
- `backups/*` excepte `backups/.gitkeep`
- `dist/*` excepte `dist/.gitkeep`
- bases SQLite, backups, arxius `.tar`, TSV de credencials demo i logs locals

`make release-check` comprova part d'aquesta política abans de compartir una
versió.
