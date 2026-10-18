# Commons alpha32 / instal·lador alpha36 — Preparació automàtica de Quiosc

Administració reconstruïda des de `c69e75b`. API, portal i Play conserven els
digests d'alpha31 i es publiquen també amb tag alpha32 per mantindre el conjunt.
[Digests i procedència](images.json); [override Compose](compose.images.json);
[hash del paquet](installer.json). No s'inclouen els canvis locals previs de
Makefile ni admin/server.py.

- Ja no cal executar cap ordre en el servidor per a Quiosc. Si l'ordinador té
  servidor Epoptes, el paquet el prepara en instal·lar-se o actualitzar-se, i la
  unitat `edutictac-quiosc-prepare.path` ho fa quan Epoptes apareix més tard.
- La preparació no activa Quiosc: ho continua decidint una persona
  administradora en Administració → Eines del centre.
- En un servidor sense Epoptes, el panell explica que Quiosc només funciona en
  l'ordinador de l'aula amb Epoptes. [Detalls](../../docs/quiosc-local.md).

Validació: 190 proves Python, les 2 Docker de Quiosc amb dimoni root real (39
proves de Quiosc correctes), 70 de navegador i `systemd-analyze verify` de les
unitats. Publicació APT verificada (signatura InRelease, Packages.gz, SHA-256 i
mida del `.deb` descarregat); manifests linux/amd64 i pull anònim comprovats.

Desplegament del 2026-10-18 en el servidor de producció (sense Epoptes): backup
`commons-20261018T130645Z`, paquet alpha36 i després `make update-images`
(backup `commons-20261018T130840Z`, flux funcional correcte). `.env` igual
excepte els tags d'imatge, SQLite sense canvis, unitat `.path` activa i Quiosc
no disponible, com correspon. Accés per `edutictac.local` comprovat des d'un
portàtil de la LAN. Pendent: provar la preparació automàtica en una aula
LliureX amb Epoptes real.
