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

`eduhoot` i `eduhoot-mongo` només s'activen si `COMPOSE_PROFILES=eduhoot`.

## Ports

| Port host | Variable | Servei | Notes |
|---:|---|---|---|
| `8082` | `PORTAL_PORT` | `portal` | Entrada principal del stack |
| `8090` | `EDUHOOT_PORT` | `eduhoot` | Només amb perfil `eduhoot` |

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
| `backups/` | host | còpies SQLite generades per `make backup` | No, excepte `.gitkeep` |
| `dist/` | host | paquets exportats i credencials demo | No, excepte `.gitkeep` |

Cap d'aquestes dades ha d'entrar al repositori. Només es versionen els
`.gitkeep` de carpetes buides.

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
- `PORTAL_PORT`: port públic del portal.
- `EDUTICTAC_ID_SECRET`: secret de signatura de sessions.
- `EDUTICTAC_ID_TEACHER_TOKEN`: token docent inicial.
- `COMPOSE_PROFILES`: activa mòduls opcionals, ara `eduhoot`.
- `EDUHOOT_PUBLIC_IMPORT_SOURCE`: font d'importació d'activitats públiques
  d'EduHoot; buit desactiva la funció.

En qualsevol entorn que no siga demo local cal canviar
`EDUTICTAC_ID_SECRET` i `EDUTICTAC_ID_TEACHER_TOKEN`.

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
| `make backup` | copia `data/id.db` a `backups/` |
| `make restore BACKUP=...` | restaura una còpia SQLite |
| `make reset` | reinicia les dades locals de la demo |
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

## Riscos operatius

- `.env` conté secrets locals: no s'ha de mostrar ni versionar.
- Els PINs només es retornen en el moment de generar o regenerar credencials.
- El CSV exporta codis públics, no PINs.
- Si `COMPOSE_PROFILES=eduhoot`, hi ha dades addicionals en
  `data/eduhoot-*` que encara no entren en `make backup`.
- `make reset` esborra dades locals de demo; cal fer `make backup` abans si es
  vol conservar l'estat.
- En un centre no s'han d'usar els valors demo `change-this-local-secret` ni
  `dev-teacher`.

## Fitxers que no s'han de versionar

- `.env`
- `data/*` excepte `data/.gitkeep`
- `backups/*` excepte `backups/.gitkeep`
- `dist/*` excepte `dist/.gitkeep`
- bases SQLite, backups, arxius `.tar`, TSV de credencials demo i logs locals

`make release-check` comprova part d'aquesta política abans de compartir una
versió.
