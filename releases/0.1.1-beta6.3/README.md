# Commons 0.1.1-beta6.3 — trasllat manual d'aules

Versió publicada sobre beta6.2.1. El nucli i els mòduls existents continuen
disponibles; `id-api` i el portal incorporen un primer tall de trasllat xifrat
d'un grup entre instal·lacions separades.

## Canvis

- Exportació i importació manual d'un paquet AES-256-GCM. La clau aleatòria es
  mostra per separat del fitxer. Importació inicial i retorn sobre un grup
  existent només si la revisió de partida coincidix.
- Dades pedagògiques del nucli, identitats pseudònimes, itineraris i resultats;
  l'etiqueta de l'aula de beta6 també es conserva. Fitxers d'aula, sessions i
  bases pròpies d'altres mòduls queden exclosos.
- Migració additiva 4 per a `group_transfer_state`. La funció queda apagada
  per defecte (`EDUTICTAC_CLASSROOM_TRANSFER_ENABLED=0`).
- Controls inicials al panell docent en valencià, català, castellà i anglés.

La funció encara és experimental: falten previsualització, recuperació guiada,
vinculació docent entre instal·lacions i validació institucional. El fitxer
xifrat pot guardar-se en OneDrive mitjançant el navegador si el centre ho
autoritza; Commons no usa Microsoft Graph. No és una sincronització automàtica.

## Validació

- Suite Python: 642 aprovades, 14 omeses.
- Portal: 376 proves de navegador aprovades en escriptori i mòbil.
- Instal·lació aïllada amb imatges del candidat i mòduls d'EduHoot, Blocs i
  Llibres: salut, fluxos, còpia i restauració de SQLite, MongoDB, càrregues i
  informes correctes.
- Paquet amd64 construït i comprovat contra rutes locals i credencials.

Les huit imatges pròpies consten en [images.json](images.json) i
[compose.images.json](compose.images.json). `id-api` i `portal` són nous; les
altres sis conserven els digests validats de la versió anterior. El paquet
`0.1.1~beta6.3.1` està publicat en APT; firma, índex i descàrrega s'han
verificat. La VM docent LliureX ha actualitzat paquet i imatges: 13 contenidors
saludables, SQLite amb migració 4 i trasllat desactivat.

En la producció pública només s'han recreat `id-api` i `portal`. La base de
dades conserva les files existents; cap altre contenidor ha canviat. Portada,
tauler docent i salut responen correctament, les rutes privades mantenen el
control d'accés i la funció de trasllat continua oculta. Detalls verificables
en [installer.json](installer.json), [apt-verification.json](apt-verification.json)
i [deployment.json](deployment.json).

## Correcció de publicació

El primer bundle beta6.3 incloïa dos comentaris amb una ruta local de compilació.
S’ha reconstruït sense eixa ruta, s’ha publicat un nou digest del portal i
s’ha verificat el SHA-256 del bundle servit. El paquet APT
`0.1.1~beta6.3.1` substituïx el primer paquet per a incloure el fitxer net.
La funció de trasllat continua desactivada en producció.
