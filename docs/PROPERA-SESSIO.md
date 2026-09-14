# Propera sessió de treball

> Estat: punt de represa després de tancar la Fita 2 i prioritzar la Fita 3.  
> Data: 2026-09-14

## Objectiu immediat

Començar la **Fita 3 — Administració operativa: backups i actualitzacions**.

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
```

El `manifest.json` inclou: `manifest_version`, `created_at`, `stack_version`
(de `VERSION`), `services[]` (nom, estat, rutes i checksum `sha256` per
servei) i `warnings[]`. `scripts/restore.sh` ja llig aquest format (valida
manifest + `id-api/id.db`, avisa si la versió no coincideix).

Pendent per a properes carpetes de backup, quan s'afegisquen més serveis:

```text
  eduhoot/mongo.archive
  eduhoot/uploads/
  eduhoot/logs/
```

### 2. Ampliar `make backup`

Estat: **`id-api` cobert**. Si `COMPOSE_PROFILES=eduhoot` està actiu, el
manifest ja inclou un avís explícit que EduHoot no té cobertura encara.

Queda per cobrir:

- EduHoot/Mongo si `COMPOSE_PROFILES=eduhoot`;
- `data/eduhoot-uploads/`;
- logs o informes d'EduHoot que decidim conservar.

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
resultat `OK`/`FAIL` esperat.

### 4. Ampliar `make restore` — ✅ fet (2026-09-14)

Flux implementat en `scripts/restore.sh`:

- parar serveis (`docker compose down`);
- restaurar dades (amb còpia de seguretat prèvia de `data/id.db` si ja
  n'existia una);
- arrancar serveis (`docker compose up -d --wait`, que ja espera l'estat
  `healthy` de `id-api` abans de continuar);
- comprovar salut del portal (`curl .../api/health`);
- executar `./scripts/test-flow.sh` com a verificació funcional final.

Si qualsevol pas falla, el script s'atura (`set -eu`) i la còpia de
seguretat prèvia queda disponible per a una restauració manual.

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
- `POST /api/backup-timer/install` -> `scripts/install-backup-timer.sh`
  ("Activar backups automàtics");
- `POST /api/backup-timer/uninstall` -> `scripts/uninstall-backup-timer.sh`
  ("Desactivar backups automàtics").

Frontend propi a `admin/public/` (mateix patró UX que
`services/portal/public/teacher.html`: token + `Bearer`, guardat en
`localStorage`).

El timer encara no s'ha instal·lat en cap màquina real: queda pendent de
prémer el botó la primera vegada que es faça servir el stack fora d'aquesta
sessió de desenvolupament.

### 7. Actualitzacions Docker/OCI

Quan backups estiguen sòlids:

- detectar versió remota en `IMAGE_REGISTRY`;
- comparar instal·lada vs disponible;
- mostrar canal `stable`, `testing` o `dev`;
- exigir backup recent i verificable;
- descarregar imatges;
- reiniciar;
- executar healthchecks;
- documentar rollback.

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
lectura de l'estat operatiu i tres accions d'escriptura per allowlist (crear
backup, activar/desactivar el timer automàtic) — cap pas de terminal
addicional a `make up`.

Següent pas: ampliar cobertura a EduHoot dins del punt 2, o punt 7
(actualitzacions Docker/OCI).
