# Validació beta6.2.1

Hotfix de paquet sobre beta6.2. Les imatges Docker no canvien.

## Artefacte

- `edutictac-commons_0.1.1~beta6.2.1_amd64.deb`.
- La mida i el SHA-256 es publiquen en l’`installer.json` de la release.
- Imatges: beta6.2, excepte `commons-admin:0.1.1-beta6.2.1`.

## Actualització

- VM LliureX amb beta6.2 instal·lada; `apt-get install -y` del paquet candidat.
- Versió instal·lada: `0.1.1~beta6.2.1`.
- Reinici ordenat amb l’alumne apagat i arrancat després.
- Resultat: 13 contenidors saludables; portal amb `core`, `recursos` i `editors`;
  `llibres` resol `portal`.
- Des de l’alumne, per IP i mDNS, Portal, Identitat, Play, EduHoot, Recursos,
  Blocs, Llibres i Rebost retornen 200.

## Instal·lació neta

- `reset-profesor --yes` sobre la base LliureX 50 GB; sense paquet ni
  `/opt/edutictac-commons`.
- Instal·lació del .deb candidat des de fitxer local, amb el repositori APT
  oficial per a les dependències.
- Nucli: 6 contenidors saludables; `/api/health` 200.
- El portal naix amb `core`, `recursos` i `editors`.
- Reinici: 6 contenidors saludables i la xarxa `editors` es conserva.
- Abast: no es va canviar la resolució de LliureX ni es van activar mòduls
  opcionals en la instal·lació neta. Els mòduls es validaren en l’actualització.

## INC-02: primera selecció i clau de copias

- El portal i l'administració nous mostren el camp de clau pública age quan
  `BACKUP_ENCRYPTION_REQUIRED=1` i no hi ha recipient.
- `scripts/set-backup-recipient.py` desa només la pública en `.env` i un
  marcador públic en `data/backup-recipient`; la privada no es copia al
  servidor.
- Primera selecció real de Play, EduHoot, Recursos, Blocs i Llibres: backup
  age creat, estat `idle`, 13 contenidors saludables i accessos 200 per IP i
  mDNS. La clau privada de laboratori es va guardar només en `pass`.
- Les proves de navegador/API cobrixen el camp, el bloqueig
  `backup_key_required` i el guardat mitjançant unitat transitoria.

## INC-01: Administració des del propi servidor

- `scripts/update-host-ips.py` calcula les IP globals exactes del host i les
  desa en `EDUTICTAC_HOST_IPS`; el servei l'executa abans de Compose.
- El portal les afegix a la llista blanca de `/admin/` en arrancar. No
  s'autoritza cap subxarxa de la LAN.
- Professor: `127.0.0.1`, `192.168.122.15` i `edutictac.local` retornen 200.
- Alumne: les mateixes rutes per IP i mDNS retornen 403.
- Comprovat també després d'un reinici ordenat.

## INC-04, INC-05 i INC-06

- Play: helper actualitzat per usar una cookie jar OIDC real
  (`COMMONS_OIDC_COOKIE_FILE`); prova completa creada, assignada, puntuada i
  llegida al tauler.
- EduHoot: helper usa `EDUHOOT_ID_APP_TOKEN`; `make test-eduhoot-flow` passa.
- Timer: el paquet repara la propietat de `.config/systemd/user` i fixa
  `EDUTICTAC_USER_CONFIG_HOME`. `make backup-timer-install` com a `lliurex`
  deixa el timer **actiu**; `make backup-timer-uninstall` el deixa **inactiu**.

## Publicació

Pendent. Cal commit, publicació a APT i verificació del candidat des del
repositori abans d’anunciar-lo. No substituir beta6.2 a la web fins que el
paquet estiga publicat.
