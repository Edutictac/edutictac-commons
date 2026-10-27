# EduTicTac Commons Stack Local

Versió publicada d'imatges: [0.1.1-beta6.3](releases/0.1.1-beta6.3/README.md).
Instal·lador amd64 per a LliureX, Ubuntu i Debian: `0.1.1~beta6.3`.
Incorpora el primer tall del trasllat xifrat d'aules, desactivat per defecte.
La beta6.2.1 és la versió anterior: el portal passa a la xarxa
`editors` i el selector demana la clau pública age si falta abans de la còpia.
La beta6.1 inclou l’estabilització de la pila, les xarxes Docker separades,
l’accés per LAN amb mDNS/IP, el nom humà d’aula i el límit visible.
La beta6 continua disponible com a versió anterior validada.
Proves d'idiomes: `npm ci`, `npx playwright install --with-deps chromium` i
`make test-i18n`. Instal·lació i restauració aïllades: `make test-installation`.

Proves completes del portal (inclou itineraris i Quiosc): `npm test`.
Play i Moodle usen configuracions separades. Resultats, dependències Python i
límits de la validació actual: [estabilització v2](docs/ESTABILITZACIO-V2.md).

Stack Docker per a instal·lar les ferramentes d’EduTicTac al servidor del centre.
El nucli incorpora aules, accés de l’alumnat amb codi i PIN, Rebost i fitxers
d’aula. Administració permet triar Play, EduHoot, Banc, Blocs, Llibres i Quiosc.

## Instal·lació en un centre

Comença per la [guia bàsica d’instal·lació](docs/INSTALACION-RAPIDA.md).
La documentació tècnica és [INSTALL-CENTRES.md](INSTALL-CENTRES.md). El paquet configura els
serveis i genera els secrets de la instància. Reinicia l’equip després de la
primera instal·lació, activa Commons amb el codi d’un sol ús i tria les eines
des d’Administració. La descàrrega d’imatges necessita connexió a Internet.

En equips existents, actualitza primer el paquet i després les imatges des del
panell. El paquet conserva els tags i la selecció ja configurats; actualitzar
només el paquet no substituïx les imatges dels serveis.

## Desenvolupament local amb Docker

```bash
cp .env.example .env
make doctor
make up
```

Si Docker en la màquina requereix `sudo`, usa:

```bash
make DOCKER="sudo docker" up
```

Obri:

```text
http://localhost:8082
```

El token docent de demo és el valor de `EDUTICTAC_ID_TEACHER_TOKEN` en `.env` (`dev-teacher` per defecte).

## Serveis

| Servei | Port intern | Funció |
|---|---:|---|
| `portal` | 80 | Portal del centre i proxy `/api/` |
| `id-api` | 8005 | Aules, identitat, Rebost i fitxers privats |
| `eduhoot` | 3000 | Activitat quiz amb SSO Authentik (opcional, `COMPOSE_PROFILES=eduhoot`) |
| `eduhoot-mongo` | 27017 | Base de dades d'EduHoot (opcional) |
| `recursos-api` | 8004 | API del banc de recursos (opcional, `COMPOSE_PROFILES=recursos`) |
| `recursos` | 80 | Interfície del banc de recursos (opcional) |
| `admin` | 8091 | Panell `/admin`: estat operatiu i backups (sempre actiu) |
| `play` | 8084 | Editor d’activitats H5P (opcional) |
| `blocs` | 8080 | Programació visual amb Scratch i Rebost (opcional) |
| `llibres` | 8080 | Contes i còmics; accés pel port 8098 (opcional) |

EduTicTac Play permet crear, previsualitzar i exportar activitats H5P. Les
llicències i la compatibilitat amb Moodle/AULES estan documentades en
[`docs/h5p-feasibility.md`](docs/h5p-feasibility.md).

Documentación complementaria de Play: [arquitectura](docs/architecture.md),
[instalación](docs/installation.md), [desarrollo](docs/development.md),
[tipos de actividad](docs/activity-types.md), [API](docs/api.md),
[seguridad](docs/security.md), [privacidad](docs/privacy.md) e
[integración con Authentik](docs/authentik.md) y [prueba de importación
H5P en Moodle](docs/moodle-h5p-test.md).
La integración con el módulo `recursos` está descrita en
[resources-integration.md](docs/resources-integration.md).
La guía práctica para el profesorado está en
[docs/GUIA-DOCENTE.md](docs/GUIA-DOCENTE.md), i la guia per a qui administra
el panell tècnic en [docs/GUIA-ADMIN.md](docs/GUIA-ADMIN.md).

## Panell d'administració

`http://<host-del-centre>:8082/admin/` — el panell s'usa a través del portal
per completar el login OIDC al mateix origen. L'accés es fa amb Authentik:
pot entrar l'usuari de `ADMIN_OIDC_USERNAME` (per defecte `akadmin`) o
qualsevol compte amb rol `administrador`. El portal només admet `/admin/`
des del mateix servidor (per qualsevol IP local), la Tailnet o un túnel SSH;
els altres equips de la LAN reben 403. No s’autoritza tota la subxarxa.

Mostra la versió instal·lada, l'estat dels serveis, l'últim backup i la
llista de còpies disponibles, els avisos de cobertura i l'estat del timer de
backup automàtic. Permet crear un backup, activar/desactivar backups
automàtics i restaurar una còpia seleccionada amb confirmació forta — cap
requereix terminal: tot es fa des del navegador amb la sessió Authentik.

Guia pas a pas per a qui administra el panell:
[docs/GUIA-ADMIN.md](docs/GUIA-ADMIN.md).

## Reutilització del treball existent

Aquest stack no comença de zero: reutilitza l'API d'identitat pseudònima desenvolupada per a EduTicTac i la porta a un contenidor net dins de `services/id-api/`. La part nova d'aquest paquet és el muntatge local Docker, el portal demostratiu, els scripts d'operació/exportació i la documentació perquè altres centres puguen provar el producte sense tocar `edutictac.es`.

## Flux demo

1. Entra com a docent amb el token de demo.
2. Genera un grup amb 5-10 credencials.
3. Assigna l'activitat demo al grup.
4. Copia un codi + PIN generat.
5. Entra com a alumne amb eixe codi + PIN.
6. Registra una puntuació.
7. Torna al tauler docent i consulta resultats.

## Funcionalitat en desenvolupament: trasllat d'aules entre instal·lacions

Commons prepara un trasllat manual per a centres amb servidors d'aula en VLAN
separades. El docent podrà continuar treballant amb el mateix grup en una
altra instal·lació sense connexió directa entre els servidors:

1. En Commons A, obri l'aula i selecciona **Exportar aula**. Descarrega el
   paquet xifrat i guarda la clau de recuperació per separat.
2. Puja el paquet al seu OneDrive institucional amb el navegador, si el centre
   ha autoritzat este ús. Commons no accedix a Microsoft Graph.
3. En Commons B, descarrega el paquet, selecciona **Importar aula** i introduïx
   la clau. Comprova que el grup, les activitats i els resultats estiguen
   disponibles abans de continuar la classe.
4. Per tornar a A amb els canvis nous, exporta des de B i importa en A. Si
   les dos instal·lacions han modificat l'aula des de l'últim trasllat,
   Commons deté la importació i cal resoldre el conflicte abans de continuar.

El primer tall de l'API i dels controls docents està **desactivat per defecte**
(`EDUTICTAC_CLASSROOM_TRANSFER_ENABLED=0`). S'ha provat amb dades fictícies
entre un host de proves i una VM LliureX docent; encara falten la
previsualització, la recuperació guiada, els fitxers de l'aula i la validació
institucional. Les dades pseudònimes continuen sent dades personals; la clau
no s'ha de pujar juntament amb el paquet. Vegeu el
[pla de trasllat](docs/PLA-SINCRONITZACIO-AULES.md) per a l'abast i les
condicions del pilot.

## Mòdul opcional: EduHoot

EduHoot (`~/github/web/EduHoot`, imatge pròpia publicada a `registry.edutictac.es`) és la primera activitat integrada de la Fase 4. Per activar-lo:

```bash
echo "COMPOSE_PROFILES=eduhoot" >> .env
make up
```

Obri `http://localhost:8090`. El professorat pot crear i allotjar una partida sense compte. Per defecte, `EDUHOOT_ID_AUTH_REQUIRED=0`: l'alumnat pot entrar amb un nom curt o amb codi + PIN Commons. Si el centre vol forçar identitat pseudònima en totes les partides, posa `EDUHOOT_ID_AUTH_REQUIRED=1`. En tots dos casos no es necessita cap compte de Google.

Quan l'alumnat entra amb codi + PIN Commons, EduHoot no demana nom addicional: usa el codi públic com a àlies curt i envia la puntuació final a Commons amb el token intern `EDUTICTAC_ID_APP_TOKEN`. El tauler docent pot crear assignacions EduHoot per ID de quiz i veure resultats associats al grup; si no hi ha assignació explícita però el grup està actiu, Commons pot associar la puntuació a l'activitat corresponent. Les dades (base Mongo, imatges pujades, informes de sessió) persisteixen en `./data/eduhoot-*`.

Si aquesta instància no té encara cap activitat de prova, un usuari `admin` (crea'l amb `/api/auth/bootstrap` si no n'hi ha cap) pot fer servir el botó "Importar activitats públiques" del panell d'admin per descarregar totes les activitats públiques de `eduhoot.edutictac.es` (configurable amb `EDUHOOT_PUBLIC_IMPORT_SOURCE`, buit per desactivar-lo).

## Dades locals

La base SQLite viu en:

```text
data/id.db
```

No es versiona. Per reiniciar la demo des de zero:

```bash
make reset
make up
```

Abans d'esborrar dades locals, fes una còpia si vols conservar la demo:

```bash
make backup
```

## Privacitat

Documentació de privacitat del stack: `docs/PRIVACITAT.md` (explicació de
codi + PIN i límits), `docs/FITXA-DOCENT.md` (fitxa docent imprimible),
`docs/FAMILIES.md` (informació per a famílies) i `docs/DIRECCIO-DPD.md`
(fitxa tècnica per a direcció/DPD). Revisa-les abans d'usar el stack amb
professorat o alumnat real.

## Operació local

```bash
make doctor      # comprova requisits locals
make up          # arranca o reconstrueix el stack
make down        # para els contenidors
make logs        # mostra logs
make ps          # estat dels serveis
make test-flow   # prova docent -> alumne -> resultats
make test-eduhoot-flow # prova Commons -> EduHoot -> resultats (si COMPOSE_PROFILES=eduhoot)
CONFIRM_RESET_TEST=1 make test-reset-flow # prova destructiva: backup -> reset -> restore
make bootstrap-demo # crea grup, activitat i TSV de credencials en dist/
make release-check # comprovacio abans d'entrega/exportacio
make backup      # crea backups/commons-<stamp>/ amb manifest.json, id-api/id.db i, si eduhoot esta actiu, eduhoot/
make restore BACKUP=backups/commons-YYYYmmddTHHMMSSZ/
make check-images # comprova que les imatges configurades existeixen al registre
make check-updates # detecta si hi ha tags mes recents al canal configurat
make update-images # backup verificat, aplica tag candidat, pull, reinici i test-flow
make export-images
make load-images ARCHIVE=dist/edutictac-commons-images-0.1.0-alpha.tar
```

L'arxiu d'imatges inclou les imatges pròpies versionades del stack:
`commons-id-api`, `commons-portal`, `commons-admin` i `commons-play`. Si el
perfil `recursos` està actiu, també inclou `recursos-api` i `recursos`.
Per generar-la amb Recursos, usa `COMPOSE_PROFILES=recursos make export-images`.

Els objectius `up`, `down`, `build`, `logs`, `ps`, `reset`, `restore`,
`check-images`, `check-updates` i `update-images` accepten també
`DOCKER="sudo docker"` quan cal.

## Diagnòstic ràpid

```bash
make ps
curl http://localhost:8082/api/health
make test-flow
```

Si has entrat com a docent abans, el navegador pot conservar una cookie de sessió durant unes hores. Usa el botó `Eixir` del portal o una finestra privada per comprovar el comportament sense sessió docent.

Si no pots entrar com a alumne, usa una targeta acabada de generar en el portal: els PINs només es mostren en eixe moment i no apareixen en el CSV.

## Notes

- Les entregues beta estan pensades per a pilots amb còpies i seguiment.
- El laboratorio ya incluye Authentik/OIDC para el acceso docente; el token
  local se conserva solo como compatibilidad técnica para pruebas y servicios
  internos.
- El repositori no inclou dades del centre ni credencials; l’instal·lador genera les de cada instància.
- El paquet `edutictac-community` està vendorizat dins de `services/id-api/vendor/` per evitar dependències Git durant el build.
- `make bootstrap-demo` accepta variables com `DEMO_COUNT=12`, `DEMO_TENANT_ID=centre-prova` o `DEMO_TITLE="Repte inicial"`.

## Distribució

Consulta `INSTALL-CENTRES.md` per provar el stack en un centre educatiu, exportar imatges sense Docker Hub o preparar una publicació. Per a Ubuntu amd64 es pot instal·lar des del repositori APT oficial `packages.edutictac.es`; també es pot construir el paquet `.deb` amb `make package-deb`. Consulta [`docs/ubuntu-package.md`](docs/ubuntu-package.md), revisa `CHECKLIST-ENTREGA.md` i executa `make release-check` abans de publicar una nova versió.

La primera versió tancada queda documentada en `RELEASE-0.1.0-alpha.md`.

## Desenvolupament

El roadmap operatiu d'aquest repo viu en `docs/ROADMAP.md` i l'inventari tècnic en `docs/INVENTARI.md`. El dossier 4D complet continua en el repositori `edutictac-4d-solicitud`; aquest repo se centra en la Pista B: stack Docker replicable, credencial pseudònima, portal/taulers i instal·lador v1.


## EduTicTac Quiosc (opcional)

Prototipo de actividad supervisada integrado en el panel docente, disponible
tras actualizar las imágenes `commons-id-api` y `commons-portal`. Usa Epoptes
existente para iniciar Firefox con perfil temporal y recuperarlo sin instalar
componentes en los PC del alumnado. **Quiosco básico, sin aislamiento del
escritorio ni filtro de navegación.** Desactivado por defecto.

Configuración local/SSH, permisos, pruebas y recuperación:
[docs/quiosc.md](docs/quiosc.md). El despliegue usa el override optativo
`compose.quiosc.yml`; empieza con simulación antes de conectar equipos reales.

Mode automàtic per al mateix ordinador Epoptes, amb permisos de la sessió
LliureX i sense inventari docent: [preparació i validació](docs/quiosc-local.md).
Implementat en proves; pendent de validar en una aula real.

## EduTicTac Rebost i Blocs

Rebost és la biblioteca central d’imatges, accessible des de `/assets/` i des
dels selectors de Blocs i Llibres. El catàleg es pot consultar sense sessió;
guardar recursos privats requerix identificar-se amb compte docent o codi i PIN.

Arquitectura i permisos: [Rebost central](docs/rebost.md). Catàlegs amb origen i
llicència: [recursos propis](docs/rebost-catalog.md) i [Scratch](docs/rebost-scratch.md).

Accés compartit amb el login habitual de Commons, complement Compose opcional i proves
locals sense comptes reals: [Commons, Rebost i Blocs](docs/rebost-commons-access.md).

## Editors opcionals: Blocs i Llibres

Els perfils `blocs` i `llibres` s’integren en el selector d’Administració.
Blocs s’obri des de `/blocs-access.html`; Llibres utilitza el mateix nom de
servidor i el port 8098 (`LLIBRES_PORT` configurable). No substituïxen el portal
ni requerixen que estiguen actius per a arrancar Commons. En actualitzar beta1
queden desactivats fins que l’administrador els tria. Llibres permet crear i
conservar llibres sense Banc; publicar requerix el mòdul Recursos i els permisos
existents de docent o aprovació del seu docent per a l’alumnat.

Els treballs es guarden en el navegador o es descarreguen. Consulta
[les llicències dels editors](docs/LICENCIES-EDITORS.md) i el
[pla i validació de beta2](docs/PLA-BETA2.md).


## Fitxers de l’aula

El professorat compartix carpetes i fitxers amb el grup. L’alumnat entrega
els treballs en privat; només els veu l’autor i el professorat actual de l’aula.
Límits configurables sense reiniciar, quotes i confirmació abans de substituir.
[Guia, permisos i API](docs/FITXERS-AULA.md).
