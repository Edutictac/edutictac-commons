# Propera sessió de treball

> Estat: Fites 4 i 5 tancades en documentació i proves: EduHoot té test
> funcional reproduïble i el kit mínim de privacitat per a centres està creat.
> Pendent principal: Fita 6, distribució en entorn net i publicació de paquet.
> Data: 2026-09-15

## Objectiu immediat actual

Començar la **Fita 6 — Distribució**.

Treball recomanat:

1. Revisar `VERSION`, `IMAGE_TAG`, `EDUHOOT_TAG` i `UPDATE_CHANNEL`.
2. Executar `make release-check` amb el perfil EduHoot actiu.
3. Generar paquet amb `make export-images`.
4. Provar `make load-images` en un entorn net o simulat.
5. Documentar el flux final de `docker compose pull` contra
   `registry.edutictac.es`.

## Històric immediat: Fita 4 i Fita 5

Fita 4 — EduHoot com a primera activitat integrada:

El flux manual ja funciona:

1. `COMPOSE_PROFILES=eduhoot`.
2. Portal a `PORTAL_PORT` i EduHoot a `EDUHOOT_PORT`.
3. Professorat crea grup i assignació EduHoot per ID de quiz.
4. Alumnat entra a EduHoot amb codi + PIN Commons, sense posar nom.
5. EduHoot envia la puntuació final a Commons via
   `/api/apps/eduhoot/scores`.
6. El tauler docent consulta resultats/rànquing des de Commons.

Comprovació reproduïble implementada amb `make test-eduhoot-flow`: valida
l'endpoint de configuració d'EduHoot, autenticació d'alumnat, assignació
EduHoot, token intern obligatori, registre de puntuació via token intern
(associació automàtica i `assignment_id` explícit) i lectura de
resultats/rànquing.

També queda implementat `CONFIRM_RESET_TEST=1 make test-reset-flow`, una prova
destructiva protegida que crea backup previ, genera dades temporals, executa
reset, comprova que Commons queda buit i restaura el backup.

Fita 5 — Privacitat per a centres:

- `docs/PRIVACITAT.md`: dades guardades/no guardades, pseudonimització,
  cookies, conservació, drets i eliminació.
- `docs/FITXA-DOCENT.md`: fitxa imprimible per al professorat.
- `docs/FAMILIES.md`: informació breu per a famílies.
- `docs/DIRECCIO-DPD.md`: fitxa tècnica per a direcció, coordinació TIC o DPD.
- `CHECKLIST-ENTREGA.md`: recordatoris de privacitat abans de compartir o
  provar amb professorat real.

## Històric de Fita 3

La Fita 3 va començar amb aquest objectiu:

La idea central és que EduTicTac Commons no pot considerar-se instal·lable en
centres si no pot copiar, restaurar i actualitzar el stack de manera segura.

Principis acordats:

- cap dada persistent sense backup;
- cap actualització sense backup recent i verificable;
- el futur panell `/admin` ha de mostrar l'estat operatiu del stack;
- primer es construeix la base de backup/restauració, després el panell.

## Ordre recomanat

### 1. Definir format de backup — ✅ fet (2026-09-14)

Format implementat en `scripts/backup.sh`:

```text
backups/commons-YYYYmmddTHHMMSSZ/
  manifest.json
  id-api/id.db
  eduhoot/mongo.archive   (si eduhoot-mongo esta en marxa)
  eduhoot/uploads.tar
  eduhoot/logs.tar
```

El `manifest.json` inclou: `manifest_version`, `created_at`, `stack_version`
(de `VERSION`), `services[]` (nom, estat, rutes i checksum `sha256` per
servei) i `warnings[]`. `scripts/restore.sh` ja llig aquest format (valida
manifest + `id-api/id.db`, avisa si la versió no coincideix).

### 2. Ampliar `make backup` — ✅ fet (2026-09-14)

Estat: **`id-api` i EduHoot coberts**. Quan `COMPOSE_PROFILES=eduhoot` esta
actiu i el contenidor `eduhoot-mongo` esta en marxa, `scripts/backup.sh` fa:

- `docker compose exec eduhoot-mongo mongodump --archive --db=kahootDB` ->
  `eduhoot/mongo.archive` (el nom real de la base es `kahootDB`, no
  `eduhoot`, herencia del fork Llixhoot);
- `tar` de `data/eduhoot-uploads/` -> `eduhoot/uploads.tar`;
- `tar` de `data/eduhoot-logs/` -> `eduhoot/logs.tar` (son informes de
  sessio amb resultats reals de l'alumnat, no logs tecnics descartables —
  decisio presa en revisar el contingut real del directori).

Si `eduhoot-mongo` no esta en marxa, el manifest declara l'avis
corresponent en `warnings[]` (detectat per `make backup-check`) en lloc de
fallar tot el backup.

### 3. Afegir `make backup-check` — ✅ fet (2026-09-14)

Comprovació no destructiva implementada en `scripts/backup-check.sh`:

- existeix un backup recent en `backups/commons-*` (per defecte, menys de 24h,
  configurable amb `BACKUP_MAX_AGE_HOURS`);
- el manifest és JSON vàlid amb tots els camps obligatoris;
- els checksums `sha256` declarats coincideixen amb els fitxers reals;
- `id-api` sempre ha d'estar cobert;
- si `COMPOSE_PROFILES=eduhoot` està actiu, cal que estiga cobert com a servei
  o, com a mínim, esmentat en `warnings[]`.

Provat manualment: sense backup, backup vàlid, backup caducat, checksum
manipulat i EduHoot actiu sense cobertura ni avís — els cinc casos donen el
resultat `OK`/`FAIL` esperat. La lògica ja era genèrica per servei, així que
la cobertura d'EduHoot (punt 2) no ha requerit cap canvi en aquest script.

### 4. Ampliar `make restore` — ✅ fet (2026-09-14)

Flux implementat en `scripts/restore.sh`:

- parar serveis (`docker compose down`);
- restaurar dades (amb còpia de seguretat prèvia de `data/id.db` si ja
  n'existia una);
- si el manifest declara `eduhoot`: comprovar que `.env` te
  `COMPOSE_PROFILES=eduhoot` actiu (si no, avortar amb missatge clar); fer
  còpia de seguretat prèvia i restaurar `eduhoot-uploads`/`eduhoot-logs` amb
  tar;
- arrancar serveis (`docker compose up -d --wait`, que ara espera l'estat
  `healthy` d'`id-api` i, si esta actiu, d'`eduhoot-mongo` — se li va afegir
  un healthcheck al `compose.yml` que abans no tenia);
- si el manifest declara `eduhoot`: `mongorestore --archive --drop` contra
  `eduhoot-mongo` (necessita el contenidor ja en marxa);
- comprovar salut del portal (`curl .../api/health`);
- executar `./scripts/test-flow.sh` com a verificació funcional final.

Detall de disseny: els directoris `data/eduhoot-uploads`/`data/eduhoot-logs`
son propietat de l'uid intern del contenidor `eduhoot` (no te `PUID`/`PGID`
com `id-api`), aixi que l'usuari de l'host no sempre te permisos
d'escriptura per netejar-los. Resolt executant `rm`+`tar` dins d'un
contenidor `mongo:7` (ja necessari per `eduhoot-mongo`, sense pull
addicional) com a root, que preserva l'uid/gid original en restaurar.

Si qualsevol pas falla, el script s'atura (`set -eu`) i la còpia de
seguretat prèvia queda disponible per a una restauració manual.

Provat en real (2026-09-14): cicle complet backup -> backup-check -> restore
-> backup-check amb el stack local (`COMPOSE_PROFILES=eduhoot`) incloent
dades reals de Mongo (`kahootDB`), un informe de sessió CSV existent i
directoris `quiz-images` buits. Ownership dels fitxers restaurats verificat
identic a l'original.

### 5. Backups automàtics — ✅ fet (2026-09-14)

Implementat amb **systemd timer** (opció preferida del pla):

- `scripts/backup-auto.sh`: encadena `backup.sh` -> `backup-check.sh` ->
  `backup-prune.sh`, amb línies de log amb marca de temps UTC. Si algun pas
  falla, s'atura (`set -eu`) sense fer neteja, per no perdre backups en cas
  de dubte.
- `scripts/backup-prune.sh` (`make backup-prune`): aplica retenció tipus
  "avi-pare-fill" sobre `backups/commons-*`: manté els N backups més
  recents com a diaris, després 1 per setmana ISO distinta com a setmanals,
  després 1 per mes distint com a mensuals. Per defecte `7`/`4`/`6`
  (configurable amb `BACKUP_KEEP_DAILY`/`BACKUP_KEEP_WEEKLY`/
  `BACKUP_KEEP_MONTHLY`), tal com demanava l'objectiu de configuració.
- `systemd/edutictac-commons-backup.service.template` +
  `systemd/edutictac-commons-backup.timer`: unitat `oneshot` que executa
  `scripts/backup-auto.sh` i timer amb `OnCalendar=*-*-* 03:15:00` (+/- 10
  min de jitter) i `Persistent=true` (recupera l'execució si la màquina
  estava apagada a l'hora prevista).
- `scripts/install-backup-timer.sh` (`make backup-timer-install`): genera la
  unitat amb la ruta absoluta del repo i l'instal·la com a timer **d'usuari**
  (`systemctl --user`), sense sudo. Avisa que cal `loginctl enable-linger`
  si l'usuari no manté sessió oberta habitualment.
- `scripts/uninstall-backup-timer.sh` (`make backup-timer-uninstall`) i
  `make backup-timer-status` (`systemctl --user list-timers` + `status`) per
  gestionar-lo.

Alternativa documentada (cron), per a hosts sense systemd d'usuari
disponible:

```text
15 3 * * * cd /ruta/al/repo && ./scripts/backup-auto.sh >> /var/log/edutictac-commons-backup.log 2>&1
```

Provat: `make backup-auto` fa les tres passes seguides correctament; la
retenció s'ha provat amb 200 backups sintètics (un per dia) i deixa
exactament 17 (7+4+6) distribuïts com s'esperava, del més recent cap arrere.

El panell `/admin` (punt 6) podrà llegir l'estat del timer amb
`systemctl --user list-timers`/`status` per mostrar si està activat,
freqüència, pròxima/última execució i últim resultat — no cal que
`/admin` gestione systemd directament, només que el llija.

### 6. Primer `/admin` — ✅ fet (2026-09-14)

Decisió (2026-09-14): l'usuari vol activar el timer de backup automàtic des
d'un botó del panell, no manualment per CLI (`make backup-timer-install`).
A més, va aclarir un requisit més fort: **cap acció, ni tan sols la posada en
marxa del propi panell, no pot requerir terminal.** Tot el que necessite
privilegis del host ha de poder activar-se/desactivar-se des del panell, com
a funcionalitat opcional per defecte apagada, però sense cap pas de CLI
intermedi.

Això va descartar dues alternatives considerades abans de la decisió final:

- Servei natiu del host instal·lat a mà (`make admin-install`): requeria un
  pas de terminal, encara que fóra puntual.
- Donar accés al bus de systemd directament a `id-api`: barrejaria un
  privilegi nou de host amb el servei més exposat (tràfic docent/alumnat).

Disseny final implementat: un **contenidor nou i separat, `admin`** (servei
Compose), que arranca sempre amb `make up`/`make up-pulled` sense cap pas
addicional, amb accés acotat (mateix UID que `id-api` via `PUID`/`PGID`,
mai root) al `systemd --user` del host només per a gestionar la unitat
`edutictac-commons-backup.*` (bus de sessió + directori d'unitats muntats,
sense `docker.sock`). Detalls tècnics i el risc que això implica són a
`docs/INVENTARI.md` (seccions "Serveis", "Comprovacions de salut" i
"Riscos operatius").

Lectura (`GET /api/status`, `admin/server.py`):

- versió instal·lada (`VERSION`);
- serveis actius (sondeig de xarxa directe a `id-api`/`portal`/`eduhoot`/
  `eduhoot-mongo`, sense `docker compose ps`);
- estat de l'API;
- últim backup i llista de backups disponibles;
- serveis sense cobertura de backup (avisos del manifest);
- canal/versió d'imatge configurada (`IMAGE_REGISTRY`, `IMAGE_TAG`,
  `EDUHOOT_TAG`);
- estat del timer de backup automàtic (`systemctl --user show` amb
  propietats estructurades, no screen-scraping de `list-timers`).

Escriptura (allowlist tancada, cap dada de la petició arriba a un shell):

- `POST /api/backup/create` -> `scripts/backup.sh` + `scripts/backup-check.sh`
  ("Crear backup ara" al panell);
- `POST /api/backup/restore` -> `scripts/restore.sh backups/<nom>` executat
  en el host via `systemd-run --user`, amb nom de backup validat i confirmació
  forta al frontend ("Restaurar backup seleccionat");
- `POST /api/backup-timer/install` -> `scripts/install-backup-timer.sh`
  ("Activar backups automàtics");
- `POST /api/backup-timer/uninstall` -> `scripts/uninstall-backup-timer.sh`
  ("Desactivar backups automàtics").

Frontend propi a `admin/public/` (mateix patró UX que
`services/portal/public/teacher.html`: token + `Bearer`, guardat només en
`sessionStorage` i eliminat en tancar la sessió del navegador).

El timer encara no s'ha instal·lat en cap màquina real: queda pendent de
prémer el botó la primera vegada que es faça servir el stack fora d'aquesta
sessió de desenvolupament.

### 7. Actualitzacions Docker/OCI — en marxa (2026-09-14)

Base implementada:

- `scripts/check-images.sh` (`make check-images`): consulta amb
  `docker manifest inspect` les imatges configurades (`commons-id-api`,
  `commons-portal`, `commons-admin` i, si el perfil està actiu, `eduhoot`).
- `scripts/check-updates.py` (`make check-updates`): consulta tags remots i
  compara `IMAGE_TAG`/`EDUHOOT_TAG` amb el candidat del canal (`stable`,
  `testing`, `dev`).
- `scripts/update-images.sh` (`make update-images`): crea backup nou,
  executa `backup-check`, aplica el candidat del canal en `.env`, comprova
  imatges remotes, fa `docker compose pull`, reinicia amb `up -d --wait
  --no-build`, comprova salut del portal i executa `test-flow`.
- Panell `/admin`: botó "Actualitzar imatges", amb confirmació forta, que
  llança `scripts/update-images.sh` en el host via `systemd-run --user`, i
  botó "Comprovar actualitzacions" via `/api/updates`.
- Rollback manual documentat en `docs/INVENTARI.md`: restaurar el backup acabat
  de crear i tornar a fixar `IMAGE_TAG`/`EDUHOOT_TAG` al tag anterior.

Queda pendent:

- rollback assistit des del panell.

## Primer canvi concret

Fet (2026-09-14): `scripts/backup.sh` genera `backups/commons-<stamp>/` amb
`manifest.json` i `id-api/id.db`, i `scripts/restore.sh` restaura des
d'aquest format. `README.md`, `INSTALL-CENTRES.md` i `docs/INVENTARI.md`
actualitzats al nou format.

Fet (2026-09-14): `make backup-check` (punt 3) verifica de forma no
destructiva que hi ha un backup recent, amb manifest vàlid, checksums
correctes i cobertura declarada de tots els serveis actius.

Fet (2026-09-14): `make restore` (punt 4) ara para els serveis, restaura les
dades, els torna a arrancar, comprova la salut del portal i executa
`test-flow` automàticament, sense passos manuals addicionals.

Fet (2026-09-14): backups automàtics (punt 5) amb `scripts/backup-auto.sh`
(backup + comprovació + retenció) i un timer d'usuari de systemd instal·lable
amb `make backup-timer-install`, alternativa cron documentada.

Fet (2026-09-14): primer panell `/admin` (punt 6), com a contenidor Compose
nou `admin` (`admin/Dockerfile`, `admin/server.py`, `admin/public/`), amb
lectura de l'estat operatiu i quatre accions d'escriptura per allowlist (crear
backup, restaurar backup seleccionat, activar/desactivar el timer automàtic)
— cap pas de terminal addicional a `make up`.

Fet (2026-09-14): restauració real provada des del panell `/admin` contra un
backup local (`commons-20260914T142231Z`). El primer disseny síncron tallava la
connexió perquè `restore.sh` para també el contenidor `admin`; queda corregit
amb llançament asíncron via `systemd-run --user` i verificat amb serveis de nou
amunt, salut del portal i `test-flow` correcte.

Fet (2026-09-14): imatge pròpia `commons-admin:${IMAGE_TAG}` versionada i
inclosa en `make export-images` i `make push-images` junt amb `commons-id-api`
i `commons-portal`.

Fet (2026-09-14): cobertura completa d'EduHoot en `make backup`/`make
restore`/`make backup-check` (mongo `kahootDB`, uploads, informes de sessió),
amb healthcheck nou per `eduhoot-mongo` en `compose.yml`. Provat en real amb
un cicle complet backup -> restore contra el stack local amb dades reals.
Fita 3 queda tancada en codi excepte el rollback assistit des del panell:
actualment el rollback és manual i està documentat en `docs/INVENTARI.md`.
