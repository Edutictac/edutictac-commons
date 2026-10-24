# Validació beta6.2

Paquet de publicació sobre beta6.1. El contingut funcional és el de beta6.1:
correcció del nom d’aula en la creació per lot. Cap canvi de codi respecte de
beta6.1.

## Paquet i APT

- `edutictac-commons_0.1.1~beta6.2_amd64.deb`, 5.910.212 bytes, SHA-256
  `9b3f33b24073ed0fe34ee8c0b3d6b61f86be362a7e7cceba9fe00b4dbba72cc4`.
- Firma `InRelease`, índex, descàrrega, `age` i candidat aïllat verificats.

## LliureX (VM professor + alumne)

- Actualització real des de beta5: paquet beta6, després beta6.1 i finalment
  beta6.2; dades i configuració conservades.
- Etiqueta d’aula: `POST /api/identities/batch` la retorna i el resum docent la
  mostra.
- `test-flow.sh`: docent → credencials → alumne → puntuació → resultats, correcte.
- Portal `v0.1.1-beta6.2` per `127.0.0.1`, `edutictac.local` i IP des de l’alumne.
- `edutictac-commons-open`, entrada de menú i xarxes B3 activos.

## Instal·lació neta en LliureX

- VM del professor resetejada a la base neta (`reset-profesor --yes`).
- Repositori APT oficial afegit; `apt-get install edutictac-commons` va triar
  `0.1.1~beta6.2` i va instal·lar les dependències.
- Activació inicial correcta; el codi d'un sol ús va quedar consumit.
- Nucli net: portal, id-api, administració i Authentik amb imatges beta6.2.
- `test-flow.sh`, etiqueta d'aula, mDNS/IP, llançador, menú i accés des de la
  VM de l'alumne: correctes.
- No s'activaren mòduls opcionals en esta prova neta.

## Producció

- API i portal desplegats amb els digests de beta6.2; només canviaren eixos dos
  contenidors. Base de dades amb integritat correcta i columna `label`.
- Portal `v0.1.1-beta6.2`, API 200, rutes privades 403/404 i CORS aliè sense
  capçalera. Altres contenidors conservaren ID.
- Rollback: imatges `before-beta6.2`, còpies de configuració i SQLite al VPS.

## Pendent

- Aceptació humana amb login OIDC personal.
- Rollout a centres reals.
