# Commons alpha33 / instal·lador alpha37 — Aula LliureX

ID API i Administració reconstruïts des de `720abe3`. Portal i Play conserven
els digests d'alpha32. [Digests i procedència](images.json);
[override Compose](compose.images.json); [hash del paquet](installer.json).
No s'inclouen els canvis locals previs de Makefile ni admin/server.py.

Correccions trobades en una aula virtual LliureX 23 (professor + alumne), totes
en Commons i sense modificar LliureX:

- **Epoptes de LliureX:** no publica `/run/epoptes/epoptes.socket` (usa TCP
  10000 protegit per n4d). Commons oferix un socket equivalent de root amb la
  mateixa política de grups i un pont efímer. [Detalls](../../docs/quiosc-local.md).
- **ID API no arrancava** després de reiniciar si Quiosc estava preparat però
  desactivat (regressió d'alpha36).
- **Port 80 ocupat** per Apache en LliureX: l'instal·lador ja anunciava el port
  real (8082) en el missatge, la notificació i el menú.
- **Tasques del panell:** l'usuari de servei no tenia accés a Docker ni
  *linger*; ara l'instal·lador els dona (només a qui instal·la amb sudo o a un
  administrador) i demana reiniciar.

Validació: 200 proves Python (2 Docker de Quiosc optatives omeses; les 40 de
Quiosc també amb Docker real), 70 de navegador, prova en LliureX real del pont
(docent connecta, usuari sense permís denegat, port tancat a la xarxa) i de la
preparació automàtica. Publicació APT verificada; manifests linux/amd64 i pull
anònim comprovats. Pendent: instal·lació des de zero en un professor LliureX net.
