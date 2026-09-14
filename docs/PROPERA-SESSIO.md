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

### 5. Backups automàtics

Opció preferida: **systemd timer**.

Alternativa documentada: cron.

El panell `/admin` no hauria de gestionar systemd en la primera versió; primer
ha de detectar i mostrar:

- si els backups automàtics estan activats;
- freqüència;
- pròxima execució;
- última execució;
- últim resultat.

Configuració objectiu futura:

```text
Freqüència: diària / setmanal
Hora: 03:15
Retenció: 7 diaris, 4 setmanals, 6 mensuals
```

### 6. Primer `/admin`

Primera versió només lectura:

- versió instal·lada;
- serveis actius;
- estat de l'API;
- últim backup;
- serveis sense cobertura de backup;
- canal d'actualització configurat.

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

Següent pas: ampliar cobertura a EduHoot dins del punt 2, o punt 5 (backups
automàtics amb systemd timer).
