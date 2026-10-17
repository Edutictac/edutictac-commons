# Commons 0.1.1-alpha25 — Itineraris estabilitzats

Publicació d'imatges per a `linux/amd64`, amb codi font `02db352`.

- Editor docent per a ordenar, afegir i llevar passos sense perdre resultats.
- Selecció d'un únic itinerari per grup i títol visible al tauler d'alumnat.
- Migració de dades existents, permisos després de revocar col·laboradors,
  detecció de canvis simultanis i recuperació després de fallades de connexió.
- CA/VA/ES/EN, escriptori i mòbil.

Es reconstruïxen `commons-id-api` i `commons-portal`. Administració i Play
conserven exactament els digests d'alpha24, publicats també amb tag alpha25.
No s'inclouen els canvis locals previs de `Makefile` ni `admin/server.py`.
Digests immutables i procedència: [`images.json`](images.json).

Esta API inclou també l'automatització local d'Epoptes de `889b36b`, que encara
no s'havia distribuït en imatges. Quiosc continua desactivat per defecte;
la preparació local i la prova en una aula LliureX són passos independents.

Validació prèvia: 89 proves Python correctes (2 Docker optatives omeses) i 54
de navegador correctes. La prova Docker aïllada amb les imatges construïdes
valida migració des d'alpha24, flux HTTP docent/alumnat, selecció, ordre,
rebuig sense sessió, reinici i restauració SQLite amb les puntuacions intactes.

```bash
python3 scripts/test-itineraries-docker.py \
  --id-image registry.edutictac.es/edutictac/commons-id-api:0.1.1-alpha25 \
  --portal-image registry.edutictac.es/edutictac/commons-portal:0.1.1-alpha25 \
  --previous-id-image registry.edutictac.es/edutictac/commons-id-api:0.1.1-alpha24
```

El paquet d'instal·lació `0.1.1~alpha28` incorpora els fitxers actuals i usa
alpha25 per defecte en instal·lacions noves. No incorpora selector visual de
mòduls i no canvia automàticament els tags de les instal·lacions existents.
Està publicat en el repositori APT signat. La firma de l'índex i el SHA-256
del paquet descarregat s'han verificat; metadades en [`installer.json`](installer.json).
Dues proves de configuració del paquet confirmen els defaults i la conservació
de la configuració existent, sense executar serveis del host.

La publicació no implica desplegament en el stack actiu. Queden pendents el
pilot LliureX de Quiosc i la validació completa d'Authentik en instal·lació neta.
