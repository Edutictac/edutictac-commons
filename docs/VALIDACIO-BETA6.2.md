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

## Pendent

- Instal·lació neta en LliureX (la validada ací és una actualització).
- Desplegament en producció.
