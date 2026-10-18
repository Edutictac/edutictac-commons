# Commons alpha31 — Play

Play reconstruït des de `5ba2338`. API, portal i Administració conserven els
digests d'alpha30 i es publiquen també amb tag alpha31 per mantindre el conjunt.
[Digests i procedència](images.json); [override Compose](compose.images.json).
No s'inclouen els canvis locals previs de Makefile ni admin/server.py.

- Neteja automàtica: les activitats anònimes caducades s'esborren del disc cada
  `PLAY_PURGE_INTERVAL_SECONDS` (3600 per defecte; 0 la desactiva).
- `GET /api/config` i avís opcional de demo pública amb `PLAY_DEMO_COMMONS_URL`.
  Les instal·lacions de Commons no l'han de definir.
- Editors en mòbil: Relacionar, Classificar, Targetes i Encreuat ja no
  desborden la pantalla. Els mòduls de la interfície s'inicien després de
  carregar les traduccions; `sw.js` passa a `edutictac-play-shell-v14`.

Validació: 25 proves Python de Play i 36 de navegador (cinc execucions seguides
i 144 casos amb la CPU saturada, tots correctes). Imatge comprovada en local
(salut, configuració sense demo). Manifests linux/amd64 i pull anònim verificats.
Publicació d'imatges sense desplegar: producció continua en alpha30.
