# Commons 0.1.1-beta5 — candidata en validació

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

Estat: preparació d’imatges i instal·lador; encara no publicat en APT ni validat
en instal·lació neta/actualització LliureX. No sobreescriure els artefactes beta4.
