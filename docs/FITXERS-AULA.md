# Fitxers de l’aula

Funció del nucli Commons: no depén del Banc ni d’un mòdul opcional.

## Ús

El docent selecciona una aula i obri **Fitxers de l’aula**. La pestanya
**Compartits** permet pujar fitxers i carpetes, amb les subcarpetes originals,
per a tot el grup. **Entregues de l’alumnat** mostra els treballs privats i el
codi de qui els ha enviat.

L’alumnat entra amb codi i PIN: pot descarregar els compartits i gestionar
**Les meues entregues**. Només l’autor i el professorat actual de l’aula veuen
cada entrega. Administració pot gestionar límits, però no té accés als
fitxers d’una aula si no en forma part.

Pujar no sincronitza la carpeta del dispositiu. Reemplaçar una ruta requerix
confirmació i elimina la versió anterior. Si una pujada de carpeta s’interromp,
la interfície indica quants fitxers s’han guardat; estos es conserven.

## Límits

Per defecte: 50 MiB per fitxer, 500 MiB per aula i 50 MiB per alumne. Topalls de
1.000 fitxers per aula i 200 entregues per alumne. Reserva mínima de disc:
256 MiB. Les pujades simultànies esperen torn sense bloquejar el bucle de
peticions; si l’espera supera un minut es demana reintentar.

En `/admin/`, la targeta **Fitxers de l’aula** permet canviar grandària màxima
(fins a 100 MiB), quotes i autorització de les pujades de l’alumnat. S’aplica
sense reiniciar. Reduir una quota no esborra fitxers: impedix augmentar l’ús
fins que s’allibere espai o s’amplie la quota.

En un desplegament sense panell tècnic es poden donar valors inicials a:

- `EDUTICTAC_ID_FILES_MAX_BYTES`
- `EDUTICTAC_ID_FILES_GROUP_QUOTA_BYTES`
- `EDUTICTAC_ID_FILES_STUDENT_QUOTA_BYTES`
- `EDUTICTAC_ID_FILES_STUDENTS_CAN_UPLOAD` (`0` per a desactivar)
- `EDUTICTAC_ID_FILES_DISK_RESERVE_BYTES`

Els ajustos guardats per administració tenen prioritat sobre els valors inicials.

## Format i seguretat

S’accepten PDF, Office/ODF, TXT/MD/CSV UTF-8, PNG/JPEG/WebP/GIF, àudio habitual,
MP4/WebM, EPUB i ZIP. Es filtren extensions i signatures bàsiques; no és un
antivirus ni una validació completa dels formats. No es descomprimix ni s’executa
cap contingut. HTML, SVG, scripts, executables, rutes ocultes, absolutes o amb
`..` estan bloquejats. La descàrrega és sempre adjunta, privada i amb `nosniff`.

El professorat que deixa de col·laborar perd l’accés, també als fitxers que va
pujar. Donar de baixa una identitat conserva les entregues per al professorat;
esborrar l’aula elimina files i blobs. Els fitxers d’una pujada interrompuda o
sense referència es netegen en arrancar l’API.

## Dades i API

Migració additiva 2 de `id-api`, sense modificar la migració 1. Taules
`classroom_files` i `classroom_file_settings`. Els fitxers estan en
`data/id-api/files/<hash-aula>/<id-intern>.<ext>`; la ruta triada per l’usuari
només és una metadada, mai un camí del sistema. Directoris privats i blobs 0600.

| Perfil | Ruta | Operacions |
|---|---|---|
| Professorat | `/api/teacher/groups/{group_id}/files` | GET, POST |
| Professorat | `/api/teacher/groups/{group_id}/files/{file_id}` | DELETE |
| Professorat | `/api/teacher/groups/{group_id}/files/{file_id}/download` | GET |
| Alumnat | `/api/student/group-files` | GET, POST |
| Alumnat | `/api/student/group-files/{file_id}` | DELETE propi |
| Alumnat | `/api/student/group-files/{file_id}/download` | GET autoritzat |
| Administració OIDC | `/api/admin/files/settings` | GET, PUT |

POST usa cos binari i `X-File-Path` codificat amb `encodeURIComponent`;
`X-File-Replace: 1` confirma la substitució. Les escriptures comproven origen i
sessió. Els límits de bytes, quota i disc es comproven en el servidor, també
sense `Content-Length`. No s’envien fitxers a serveis externs.

## Actualització sobre beta2

Es construïxen imatges noves d’ID API, portal i Administració. La resta d’imatges
conserva els digests verificats. No cal canviar Compose, ports, volums, serveis
systemd ni scripts del servidor instal·lat. L’instal·lador i el fitxer `VERSION`
de la màquina continuen en beta2; `IMAGE_TAG` identifica la candidata nova.

La còpia prèvia de l’actualitzador conserva les dades anteriors. La migració
s’aplica en arrancar la nova API. Les còpies posteriors també inclouen els nous
fitxers amb el helper antic: vegeu [BACKUPS.md](BACKUPS.md).

No hi ha sincronització, historial de versions, vista prèvia, qualificació ni
intercanvi de treballs entre alumnes. No s’han afegit dependències ni servicis.
