# EduTicTac Commons Stack 0.1.0-alpha

Primera versió tancada del stack Docker local d'EduTicTac Commons.

## Alcance

- Portal demo local para professorat i alumnat.
- API d'identitat pseudònima reutilitzada del treball previ d'EduTicTac.
- Generació de grups i credencials codi + PIN.
- Activitat demo de privacitat digital amb puntuació real.
- Resultats i rànquing bàsic per al professorat.
- Persistència en SQLite dins de `stack/data/`.
- Scripts de diagnòstic, bootstrap, backup, restore, exportació i càrrega d'imatges.
- Guia d'instal·lació per a centres i checklist d'entrega.

## Artefactes

- Imatges locals:
  - `edutictac/commons-portal:0.1.0-alpha`
  - `edutictac/commons-id-api:0.1.0-alpha`
- Arxiu exportable local:
  - `dist/edutictac-commons-images-0.1.0-alpha.tar`

L'arxiu `dist/*.tar` no es versiona en Git.

## Validació executada

```bash
make DOCKER="sudo docker" up-example
make DOCKER="sudo docker" release-check
make DOCKER="sudo docker" export-images
```

Resultat del `release-check`: correcte.

## Limitacions conegudes

- El professorat entra amb token local; encara no hi ha SSO ni Authentik.
- És una demo alpha, no una instal·lació de producció.
- No s'han d'importar dades reals d'alumnat sense revisió prèvia.
- Els PINs només es mostren en generar credencials; el CSV no els inclou.
- EduHoot, banc de recursos, Robotics i altres mòduls queden per a fases posteriors.

## Com provar

```bash
cp .env.example .env
make up
make bootstrap-demo
```

Obri `http://localhost:8082`.

Abans de compartir amb un centre, revisa `CHECKLIST-ENTREGA.md`.
