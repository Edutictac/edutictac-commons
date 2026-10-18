# Commons alpha31 / instal·lador alpha35 — Play i marca d'Authentik

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
Imatges desplegades el 2026-10-18 amb `make update-images` (backup
`commons-20261018T093450Z`, flux funcional correcte).

## Instal·lador alpha35 — marca EduTicTac en Authentik

Paquet construït des de `a41bf93` (sense els canvis locals previs). Selecciona
alpha31 en instal·lacions noves; les existents conserven els seus tags.
[Hash i procedència](installer.json).

- L'accés d'Authentik usa la marca d'`id.edutictac.es`: títol, logo, favicon,
  fons, CSS, fonts Inter i Poppins, tema clar, títols dels fluxos en valencià i
  peu amb enllaços a EduTicTac Commons i edutictac.es. Tot ho servix el mateix
  Authentik, també sense Internet. [Detalls i manteniment](../../authentik-branding/README.md).
- Traducció valenciana de la interfície sobre el locale `es` (authentik-va,
  construïda per a Authentik 2026.8.3).

Validació: 185 proves Python (2 Docker optatives de Quiosc omeses) i prova
aïllada d'Authentik amb `docker run` (PostgreSQL en tmpfs, sense volums ni
Compose) en cinc execucions seguides. Publicació APT verificada: signatura
InRelease amb la clau de confiança, hash de Packages.gz i SHA-256 i mida del
`.deb` descarregat.

Desplegament del 2026-10-18 en el servidor de producció: backup previ verificat
`commons-20261018T111149Z`, servei aturat abans d'`apt`, `.env` sense canvis,
recomptes SQLite idèntics, blueprints de marca i Commons en `successful`,
3 comptes i l'aplicació OIDC conservats, flux funcional correcte, redirecció
OIDC 302 i accés per la tailnet comprovat des d'un altre dispositiu.
