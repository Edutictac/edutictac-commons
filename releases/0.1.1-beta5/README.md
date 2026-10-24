# Commons 0.1.1-beta5 — entrega de seguretat

Entrega de seguretat sobre beta4. Conserva els fitxers d’aula, els mòduls,
el xip compartit i la configuració federada.

Inclou backups amb age, sessions docents de 12 hores revocables, tokens
per aplicació, validació de secrets de producció, protecció d’origen en
mutacions, administració restringida, actualitzacions amb digests i rollback,
cabeceres de seguretat i ingress TLS opcional del portal.

El xifratge requerix configurar `BACKUP_AGE_RECIPIENT` abans del primer backup.
La clau privada ha de quedar fora del servidor; sense ella no es pot restaurar.
La política de 2FA, la reducció de privilegis systemd i l’ingress de totes les
apps continuen pendents; el perfil TLS cobrix el portal.

Actualització des de beta4, instal·lació neta i restauració xifrada validades en LliureX. Les imatges es fixen en els manifestos adjunts. Consulteu la web oficial per a la descàrrega i l’estat de distribució del paquet. Els artefactes beta4 es conserven.

## Dependència de xifratge en LliureX 23

El repositori APT EduTicTac proporcionarà també el paquet `age` actualitzat
de Jammy, sense modificar-lo. La procedència, SHA-256 i verificació de les
firmes originals d’Ubuntu es documenten en [age-provenance.json](age-provenance.json).
Això cobrix els espills LliureX que no inclouen esta dependència.
