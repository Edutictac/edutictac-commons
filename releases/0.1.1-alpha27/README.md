# Commons alpha27 / instal·lador alpha30 — Backups complets

Administració reconstruïda des de `4346b7f`. API, portal i Play conserven els
digests d'alpha26 i es publiquen també amb tag alpha27 per mantindre el conjunt.
[Digests i procedència](images.json); [override Compose](compose.images.json).
No s'inclouen els canvis locals previs de Makefile ni export-catalog.

- Manifest v2 amb cobertura de Commons, Authentik/PostgreSQL, Play, Recursos,
  EduHoot/Mongo, Quiosc i configuració privada, segons les dades presents.
- Exportacions lògiques de PostgreSQL i de totes les bases de Mongo; instantànies
  SQLite i arxius de documents, activitats, plantilles i catàlegs locals.
- Breu parada coherent dels serveis amb escriptura; represa dels que estaven
  actius i reinici del frontal de Recursos després de recuperar la seua API.
- Còpies privades: fitxers 0600 i carpetes 0700, hashes, integritat SQLite,
  validació de rutes d'arxiu i publicació atòmica de la carpeta completada.
- «Crear backup» s'executa en el host. Treball persistent i seguiment després
  de recarregar o durant la reconnexió. Timer amb la mateixa implementació.
- Restauració precedida de validació i una còpia de seguretat de l'estat actual.
  Es conserven la identitat del projecte, ports i accés a PostgreSQL del destí.
  Quiosc queda desactivat fins a revisar la preparació local.
- Compatibilitat amb v1: restauració parcial dels serveis declarats i avís
  explícit en el panell. Si falla una restauració, es conserva la còpia prèvia
  i els serveis amb escriptura queden aturats.

Validació de codi: 145 proves Python correctes, 2 Docker optatives de Quiosc
omeses i 68 de navegador correctes. Prova Docker aïllada: recuperar PostgreSQL,
Mongo, tres bases SQLite, documents, activitats, fitxers d'Authentik i salut de
tots els serveis després de modificar les dades originals.

[Guia de cobertura, programació i recuperació](../../docs/BACKUPS.md).
L'instal·lador alpha30 incorpora els scripts del host i selecciona alpha27 en
instal·lacions noves. Les existents conserven tags: cal actualitzar també les
imatges per disposar del nou botó de backup i del seguiment al panell.

Publicació i desplegament completats el 2026-10-18: paquet alpha30 disponible en
APT signat, amb [hash i procedència](installer.json). Primera còpia completa real
i cicle automàtic verificats; timer diari actiu a les 03:15 Europe/Madrid, amb
fins a deu minuts de retard aleatori. [Comprovacions i límits](../../docs/BACKUPS-VALIDACIO.md).
