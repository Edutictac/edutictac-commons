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

### 1. Definir format de backup

Proposta inicial:

```text
backups/commons-YYYYmmddTHHMMSSZ/
  manifest.json
  id-api/id.db
  eduhoot/mongo.archive
  eduhoot/uploads/
  eduhoot/logs/
```

El `manifest.json` hauria d'incloure:

- data de creació;
- versió del stack;
- serveis inclosos;
- rutes copiades;
- checksums;
- resultat de cada pas;
- avisos de serveis no coberts.

### 2. Ampliar `make backup`

Objectiu: deixar de copiar només `data/id.db`.

Ha de cobrir:

- SQLite de `id-api`;
- EduHoot/Mongo si `COMPOSE_PROFILES=eduhoot`;
- `data/eduhoot-uploads/`;
- logs o informes d'EduHoot que decidim conservar;
- manifest amb cobertura i avisos.

### 3. Afegir `make backup-check`

Comprovació no destructiva:

- existeix un backup recent;
- el manifest és vàlid;
- els checksums quadren;
- tots els serveis actius tenen cobertura declarada.

### 4. Ampliar `make restore`

Primer objectiu: restauració documentada i segura.

Flux previst:

- parar serveis;
- restaurar dades;
- arrancar serveis;
- executar healthchecks;
- executar `make test-flow`.

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

Començar per crear el format de `manifest.json` i modificar `scripts/backup.sh`
per generar una carpeta de backup amb manifest, encara que inicialment només
incloga `id-api`.
