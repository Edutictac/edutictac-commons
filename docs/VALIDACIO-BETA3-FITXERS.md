# Validació de Fitxers de l’aula mitjançant actualització d’imatges

Data: 23 d’octubre de 2026. Rama `feature/aula-fitxers`.
Candidata: `0.1.1-beta3-candidate1`.

## Resultat

Actualització real superada en el professor LliureX instal·lat amb el paquet
`0.1.1~beta2~candidate5`, amb comprovacions des de la màquina de l’alumnat.
No s’ha instal·lat cap paquet nou de Commons: s’ha executat el mateix
`scripts/update-images.sh` que ja tenia el professor, com a usuari `lliurex`.

Abans i després de l’actualització coincideixen les empremtes de `compose.yml`,
`VERSION`, `update-images.sh`, `backup-stack.py`, `backup.sh` i `backup-check.sh`.
El paquet continua en beta2 i les imatges passen a la candidata nova. Els
registres previs de les disset taules de dades existents es conserven. La
migració additiva de l’API passa de versió 1 a 2.

Només canvien els binaris d’ID API, portal i Administració. Les altres imatges
conserven els digests verificats. Les tretze referències dels serveis en
execució coincideixen amb el manifest, també després de restaurar i reiniciar.

## Recorreguts reals de navegador

Les proves s’executen dins de les dues màquines, com a usuari `lliurex`, amb
eines temporals de navegador. No es canvien paquets, n4d, Epoptes ni polítiques
de LliureX. Les identitats i els documents són ficticis.

1. El docent puja una carpeta amb dos documents i una subcarpeta: es conserva
   la ruta relativa i apareixen els dos fitxers.
2. L’alumne A descarrega el compartit i es comproven els bytes. No disposa del
   botó d’eliminació dels compartits. Puja una entrega privada.
3. Es crea un segon alumne des de la interfície docent. L’alumne B veu els
   compartits i no veu l’entrega d’A; llegir-la o eliminar-la directament per
   API torna 404.
4. El docent obri les entregues i descarrega el treball d’A amb el contingut
   correcte.
5. Administració reduïx el màxim a 1 MiB. L’alumne rep el nou límit i el
   servidor rebutja una petició de 2 MiB amb 413. Es restablixen els 50 MiB.
   Els temps d’arrancada dels contenidors no canvien durant estos ajustos.

## Còpia i recuperació reals

Amb el helper antic instal·lat en beta2 s’executen `backup.sh` i
`backup-check.sh`. El manifest inclou l’arrel addicional `id-api`: els fitxers
estan dins de `local-data/files.tar.gz`, junt amb la SQLite corresponent.

Des de la interfície s’esborra un compartit fictici. S’executa `restore.sh`
amb la còpia completa anterior, incloent la còpia de seguretat prèvia que crea
el restaurador. El compartit reapareix i coincideixen els bytes tant d’este
document com de l’entrega privada. No s’ha modificat el restaurador instal·lat.

La restauració manté el comportament de beta2 pel que fa a Quiosc: no reprén
sessions de control de pantalles; requerix revisió abans de reactivar-les.

## Persistència i compatibilitat

Es reinicien les dues màquines: primer s’atura l’alumnat; després arranca el
professor i, quan els serveis estan disponibles, arranca l’alumnat.

- Professorat i alumnat tornen a descarregar els fitxers amb els mateixos bytes.
- L’alumne B continua sense accés a l’entrega d’A.
- Un llibre publicat durant la validació de beta2 continua llegint-se amb
  imatges des d’un navegador sense sessió.
- Portal, Play, Banc, EduHoot, Llibres i les entrades de Blocs responen des de
  l’alumnat.
- El paquet, les empremtes dels sis fitxers del servidor i els tretze digests
  es tornen a comprovar després del reinici.

Es retiren les eines temporals de prova de l’alumnat. Es conserven els perfils,
els llibres i els documents de demostració. Les dues màquines queden arrancades.

## Automatització complementària

- Suite Python completa: **522 superades, 2 omeses**.
- Suite de navegador: **294 superades**, amb ordinador i mòbil emulat.
- Idiomes després d’afegir ajuda i privacitat: **18 superades**.
- API de fitxers: **32 casos**, incloent quotes, contingut camuflat, rutes,
  permisos, baixa, eliminació, neteja d’orfes i pujada simultània.
- Copiat i restauració amb el codi exacte del helper beta2: superats.
- Còpies federades xifrades: **18 casos** superats amb claus efímeres de prova.
- Instal·lació aïllada amb manifest i editors: superada, incloent fluxos
  d’identitat/EduHoot i restauració de SQLite, Mongo, fitxers i configuració.
- Les tres imatges noves superen l’auditoria de noms de fitxers privats.

## Abast de l’entrega

La candidata i el codi estan publicats per a proves. No s’ha publicat un
instal·lador beta3 ni s’ha desplegat la funció en la producció federada.
La branca `main` conserva la beta2 validada.

Abans d’activar la funció en producció federada cal desplegar i verificar el
script de còpia ampliat i els límits del proxy exterior. Esta prova valida
l’actualització local amb la infraestructura existent.

No inclou sincronització de carpetes, historial de versions, antivirus,
previsualització ni qualificació de les entregues. Vegeu
[la guia de funcionament](FITXERS-AULA.md) i [les còpies](BACKUPS.md).
