# Desplegament alpha26 / alpha29 — 2026-10-18

Estat: completat en la instal·lació existent del laboratori. No equival a una
prova d'instal·lació nova ni a un pilot d'aula LliureX.

## Versió i dades

- Paquet instal·lat `0.1.1~alpha29`, procedent de la publicació APT verificada.
- API, portal, Administració i Play executen `0.1.1-alpha26`.
- EduHoot 1.0.5 i Recursos alpha18 es conserven.
- Perfils previs conservats, incorporant `play` explícitament. Selecció:
  Play, EduHoot i Recursos. Quiosc continua desactivat.
- Claus de PostgreSQL, Authentik, identitat, aplicacions i client OIDC
  comprovades sense mostrar-les i conservades durant la migració.
- Còpia habitual comprovada, exportacions lògiques PostgreSQL i Mongo, còpia
  de dades en fred, configuració i referències anteriors guardades en ubicació
  privada. El volum PostgreSQL es reutilitza pel servei original; no es munta
  en un segon servidor. Les còpies no es publiquen en Git.
- Recompte de files de les bases SQLite comprovades conservat.

El primer intent es va aturar per permisos del directori d'instal·lació abans
d'aplicar els tags; es va recuperar el servei anterior. L'escriptura
administrativa es va corregir i el segon intent va completar el desplegament.

## Comprovacions

- Salut local HTTP 200 de Commons, Authentik, Play, Recursos i EduHoot.
- Authentik server i worker saludables i connexió real a PostgreSQL amb les
  credencials configurades.
- Des d'un altre dispositiu de la tailnet: portada, taulers docent/alumnat,
  Administració, API i estat de mòduls HTTP 200; EduHoot HTTP 200.
- Administració rebutja amb 401 les consultes anònimes d'estat i mòduls.
- Treball real del controlador de mòduls via systemd d'usuari, aplicant la
  mateixa selecció: Result=success, ExecMainStatus=0, estat públic idle.
  La selecció de Play/EduHoot/Recursos es conserva.
- Entrada OIDC d'Administració redirigix a Authentik; descobriment del proveïdor
  HTTP 200 amb endpoints presents.

## Validació que continua pendent

- Sessió OIDC docent completa i compartida entre tots els serveis en el navegador.
- Assistent d'instal·lació nova i canvis de selecció en una màquina LliureX nova.
- Quiosc en una aula real amb Epoptes i restauració d'equips.
- Cobertura automàtica de backup/restauració d'Authentik, Play, Recursos i
  Quiosc. El backup habitual continua cobrint id-api i EduHoot; la còpia de
  desplegament addicional no canvia eixa cobertura.

El cicle d'activar, desactivar, reactivar, conservar dades i recuperar davant
una imatge inexistent ja s'ha provat en Docker aïllat amb les imatges finals.
[Notes i digests de publicació](../releases/0.1.1-alpha26/README.md).
