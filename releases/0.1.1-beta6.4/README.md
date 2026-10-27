# Commons 0.1.1-beta6.4 — control administratiu del trasllat d'aules

Versió publicada en APT, registre d'imatges i pàgina d'instal·lació. La
producció pública d'API i portal continua en beta6.3 fins a un desplegament
posterior.

## Canvis

- En una instal·lació nova, el trasllat xifrat d'aules comença activat per al
  professorat. Una persona administradora pot apagar-lo o tornar-lo a activar
  en el panell de grups del tauler docent.
- L'ajust es guarda en SQLite amb la migració 5 i té efecte immediat. Una
  instal·lació que ja tinga el valor guardat el conserva en actualitzar-se.
  `EDUTICTAC_CLASSROOM_TRANSFER_ENABLED=0` fixa el valor inicial apagat quan
  encara no hi ha cap ajust guardat.
- `GET/PUT /api/admin/transfer/settings` exigix una sessió OIDC
  administradora; l'escriptura també exigix el mateix origen i registra data
  i actor. El panell docent s'actualitza en el mateix navegador després del
  canvi.

El trasllat continua sent experimental: no inclou fitxers d'aula ni fusió
automàtica de canvis divergents. Les dades pseudònimes continuen sent dades
personals; abans d'usar-lo amb alumnat real cal validació institucional.

## Validació

- Suite Python completa abans de fixar el valor inicial: 656 aprovades i
  2 omeses. Després
  del canvi de valor inicial, 157 proves centrades aprovades.
- Suite de navegador completa: 378 aprovades en escriptori i mòbil.
- Migració d'una base beta6.3: grup existent conservat i ajust inicial actiu.
- Instal·lació Docker aïllada amb el valor inicial actiu: salut i fluxos
  Commons/EduHoot correctes; còpia i restauració de SQLite, MongoDB, càrregues
  i informes verificades. Els contenidors temporals s'han retirat.
- Paquet amd64: auditoria de rutes locals i credencials superada. La firma
  InRelease, el hash de l'índex APT i el hash del paquet públic s'han verificat.
  El bundle docent del paquet coincidix amb el de la imatge del portal.
- Les huit etiquetes d'imatges pròpies s'han verificat per digest. API i
  portal són imatges noves; les altres sis conserven els digests validats de
  beta6.3.

Artefactes: [images.json](images.json), [compose.images.json](compose.images.json),
[installer.json](installer.json) i [apt-verification.json](apt-verification.json).
