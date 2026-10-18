# Validació dels backups complets — 2026-10-18

## Versió publicada i instal·lada

Paquet `0.1.1~alpha30` en APT signat i imatges Commons `0.1.1-alpha27`.
[Metadades del paquet](../releases/0.1.1-alpha27/installer.json) i
[imatges per digest](../releases/0.1.1-alpha27/images.json).
Firma InRelease, índex i SHA-256 del paquet descarregat comprovats.

La instal·lació existent conserva claus, dades SQLite i selecció de mòduls.
EduHoot 1.0.5 i Recursos alpha18 es mantenen; Quiosc continua desactivat.
Portada, docent, alumnat, Administració, API i estat de mòduls responen HTTP 200
des d'un altre dispositiu de la tailnet; EduHoot també. Comprovació local
addicional de Play i Recursos HTTP 200 després d'acabar el backup.

## Còpies reals i programació

- Còpia completa prèvia a l'actualització: `commons-20261018T060233Z`.
- Primera còpia automàtica completa: `commons-20261018T060610Z`.
- Cicle automàtic complet verificat: `commons-20261018T060809Z`, manifest v2,
  `complete=true`, verificació correcta i retenció aplicada.
- Timer d'usuari habilitat i actiu: cada dia a les 03:15, zona Europe/Madrid,
  amb fins a deu minuts de retard aleatori; `Persistent=true` i `Linger=yes`.
- Servei automàtic: `Result=success`, `ExecMainStatus=0`.
- Fitxers 0600 i carpetes 0700, també en les còpies antigues conservades.

La primera execució va crear i verificar la còpia, però la retenció va fallar
perquè hi havia còpies antigues propietat de root. Es van ajustar el propietari
i els permisos de l'arbre de backups al compte del servei i es va repetir el
cicle complet correctament. No es van canviar permisos de les dades dels serveis.

## Restauració i proves

Restauració completa provada en un projecte Docker aïllat amb noms de recursos
únics i directoris temporals. Després de modificar les dades, es recuperaren
PostgreSQL d'Authentik, Mongo, tres bases SQLite, activitats, documents,
configuració i fitxers. Salut dels serveis correcta després de restaurar.
Recursos de prova eliminats; cap restauració sobre la instal·lació real.

Validació del codi: 145 proves Python correctes, 2 Docker optatives de Quiosc
omeses i 68 de navegador correctes. [CI del codi publicat](https://github.com/Edutictac/edutictac-commons/actions/runs/39102420888).

Les còpies són locals i privades. Facilitar una segona còpia en un altre
dispositiu del centre (NAS o disc USB) és una millora opcional segons
l'equipament disponible; encara no està automatitzada. La instal·lació LliureX
nova, el pilot Quiosc/Epoptes i el SSO complet entre serveis continuen pendents. [Cobertura i instruccions de recuperació](BACKUPS.md).
