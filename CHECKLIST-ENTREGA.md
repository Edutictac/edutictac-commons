# Checklist d'entrega del stack

Usa aquesta llista abans de publicar una etiqueta, exportar imatges o compartir el paquet amb un centre.

## Comprovació automàtica

Amb el stack alçat:

```bash
make release-check
```

Si Docker necessita `sudo`:

```bash
make DOCKER="sudo docker" release-check
```

La comprovació revisa requisits locals, sintaxi bàsica del portal, artefactes ignorats i el flux docent -> alumne -> resultats.

## Fitxers que sí han d'estar versionats

- `compose.yml`
- `.env.example`
- `README.md`
- `INSTALL-CENTRES.md`
- `CHECKLIST-ENTREGA.md`
- `VERSION`
- `scripts/*.sh`
- `services/*/Dockerfile`
- codi del portal i de l'API
- `.gitkeep` en `data/`, `backups/` i `dist/`

## Fitxers que no s'han de versionar

- `.env`
- `data/*.db`, `data/*.db-wal`, `data/*.db-shm`
- `backups/*.db`
- `dist/*.tar`
- `dist/demo-credentials*.tsv`
- logs, captures locals amb dades de prova o qualsevol secret real

## Revisió manual

- Canvia `EDUTICTAC_ID_SECRET` i `EDUTICTAC_ID_TEACHER_TOKEN` fora d'una demo local.
- No uses dades reals d'alumnat en captures o vídeos.
- Revisa `FITXA-PRIVACITAT-PROTOTIP.md` abans d'una prova amb professorat real.
- Si publiques imatges, comprova que has actualitzat `VERSION`, `IMAGE_TAG` i la documentació.
