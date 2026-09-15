# EduTicTac Commons Stack Local

Primer stack Docker per desenvolupar i ensenyar el producte EduTicTac Commons en `debiandesktop`, sense tocar producció.

## Ús ràpid

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
| `portal` | 80 | Portal demo i proxy `/api/` |
| `id-api` | 8005 | Credencial pseudònima d'alumnat |
| `eduhoot` | 3000 | Activitat quiz (opcional, `COMPOSE_PROFILES=eduhoot`) |
| `eduhoot-mongo` | 27017 | Base de dades d'EduHoot (opcional) |
| `admin` | 8091 | Panell `/admin`: estat operatiu i backups (sempre actiu) |

## Panell d'administració

`http://127.0.0.1:8091/` — nomes accessible en local per defecte. Cal el
token d'`EDUTICTAC_ADMIN_TOKEN` (`.env`) per entrar-hi.

Mostra la versió instal·lada, l'estat dels serveis, l'últim backup i la
llista de còpies disponibles, els avisos de cobertura i l'estat del timer de
backup automàtic. Permet crear un backup, activar/desactivar backups
automàtics i restaurar una còpia seleccionada amb confirmació forta — cap
requereix terminal, tot es fa des del navegador. Canvia el token per defecte
abans de fer servir el stack fora d'una demo local.

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
`commons-id-api`, `commons-portal` i `commons-admin`.

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

- Aquest stack és per desenvolupament i demostració.
- No conté Authentik encara; el docent usa token local.
- No inclou dades reals ni s'ha de connectar a producció.
- El paquet `edutictac-community` està vendorizat dins de `services/id-api/vendor/` per evitar dependències Git durant el build.
- `make bootstrap-demo` accepta variables com `DEMO_COUNT=12`, `DEMO_TENANT_ID=centre-prova` o `DEMO_TITLE="Repte inicial"`.

## Distribució

Consulta `INSTALL-CENTRES.md` per provar el stack en un centre educatiu, exportar imatges sense Docker Hub o preparar una publicació futura. Abans de compartir el paquet, revisa `CHECKLIST-ENTREGA.md` i executa `make release-check`.

La primera versió tancada queda documentada en `RELEASE-0.1.0-alpha.md`.

## Desenvolupament

El roadmap operatiu d'aquest repo viu en `docs/ROADMAP.md` i l'inventari tècnic en `docs/INVENTARI.md`. El dossier 4D complet continua en el repositori `edutictac-4d-solicitud`; aquest repo se centra en la Pista B: stack Docker replicable, credencial pseudònima, portal/taulers i instal·lador v1.
