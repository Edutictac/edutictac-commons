# Instal·lació en centres educatius

Aquest document descriu la prova tècnica mínima del stack Docker d'EduTicTac Commons en un centre educatiu o en un ordinador local.

## Requisits

- Linux amb Docker Engine.
- Docker Compose v2.
- 2 GB de RAM lliures per a aquesta demo inicial.
- Un port lliure per al portal, per defecte `8082`.

## Instal·lació ràpida

```bash
cp .env.example .env
make doctor
make up
```

Si Docker requereix `sudo`:

```bash
make DOCKER="sudo docker" doctor
make DOCKER="sudo docker" up
```

Obri:

```text
http://localhost:8082
```

Per deixar una demo preparada sense crear l'aula manualment:

```bash
make bootstrap-demo
```

El comandament crea un grup, assigna l'activitat demo i escriu un fitxer TSV de credencials en `dist/`.

## Primer recorregut recomanat

1. Obri el portal.
2. Entra com a docent amb el token configurat en `.env`.
3. Genera un grup de prova.
4. Clica una targeta de credencial, no el CSV, per omplir el formulari d'alumnat.
5. Entra com a alumne.
6. Completa el repte de privacitat digital.
7. Torna a resultats i consulta l'activitat.

Els PINs només es mostren just després de generar credencials. El CSV està pensat per exportar codis, però no inclou PINs.

## Configuració mínima

Edita `.env` abans d'usar la demo amb professorat real:

```env
PORTAL_PORT=8082
EDUTICTAC_ID_SECRET=canvia-aquest-secret
EDUTICTAC_ID_TEACHER_TOKEN=canvia-aquest-token-docent
```

No uses els valors `change-this-local-secret` ni `dev-teacher` fora d'una demo local.

Abans d'usar el prototip amb professorat o alumnat real, revisa `../FITXA-PRIVACITAT-PROTOTIP.md`.

## Operació habitual

```bash
make ps          # estat dels serveis
make logs        # logs del stack
make test-flow   # prova automàtica del flux principal
make backup      # còpia de la base SQLite
make down        # atura contenidors sense esborrar dades
make up          # arranca o actualitza contenidors
```

Si Docker requereix `sudo`, afegeix `DOCKER="sudo docker"` al comandament.

## Actualització local

Abans d'actualitzar:

```bash
make backup
make release-check
```

Després d'actualitzar els fitxers del stack:

```bash
make up
make test-flow
```

## Ús d'imatges ja publicades (registre propi)

EduTicTac publica les imatges a un registre OCI propi,
`registry.edutictac.es`, de lectura pública. Un centre no necessita
credencials ni construir res des del codi font: només cal apuntar el `.env`
al registre i descarregar les imatges ja construïdes.

Al `.env` del centre:

```bash
IMAGE_REGISTRY=registry.edutictac.es/edutictac
IMAGE_TAG=0.1.0-alpha
```

I després:

```bash
docker compose --env-file .env -f compose.yml pull
make up-pulled
```

`make up-pulled` alça els contenidors sense reconstruir res des del codi
font (a diferència de `make up`, pensat per a desenvolupament local, que
sempre reconstrueix la imatge).

## Funcionament sense accés al registre

En una màquina amb internet:

```bash
make export-images
```

Això genera:

```text
dist/edutictac-commons-images-0.1.0-alpha.tar
```

En la màquina del centre:

```bash
make load-images ARCHIVE=dist/edutictac-commons-images-0.1.0-alpha.tar
make up
```

## Publicació en el registre propi

Quan hi haja una versió estable, des de l'equip d'EduTicTac (cal login previ
amb `docker login registry.edutictac.es` amb l'usuari de publicació):

```bash
IMAGE_REGISTRY=registry.edutictac.es/edutictac
IMAGE_TAG=0.1.0-alpha
make push-images
```

Abans de publicar:

- comprova que no hi ha `.env` dins de cap imatge;
- comprova que no hi ha bases SQLite ni backups dins de cap imatge;
- revisa `CHECKLIST-ENTREGA.md`;
- passa `make release-check`;
- passa `make test-flow`;
- actualitza `VERSION` i `.env.example`.

## Dades i còpies

La base de dades SQLite queda en:

```text
data/id.db
```

Crear una còpia:

```bash
make backup
```

Restaurar:

```bash
make restore BACKUP=backups/id-YYYYmmddTHHMMSSZ.db
```

## Solució de problemes

### El portal no obri

Comprova que els contenidors estan alçats:

```bash
make ps
```

Comprova el port configurat en `.env`. Per defecte és:

```env
PORTAL_PORT=8082
```

### L'API apareix com no disponible

```bash
curl http://localhost:8082/api/health
make logs
```

Si `curl` no retorna `{"status":"ok"}`, revisa els logs d'`id-api`.

### Puc generar credencials sense haver escrit el token

Probablement el navegador conserva una cookie docent d'una sessió anterior. Usa el botó `Eixir` del portal o prova amb una finestra privada. Sense cookie docent, l'API ha de retornar `401 teacher authentication required`.

### L'alumne no pot entrar

Usa una targeta acabada de generar. El CSV no conté PINs. Si has tancat o reiniciat la pàgina després de generar credencials, genera un grup nou per a la demo o prepara-la amb:

```bash
make bootstrap-demo
```

### Vull començar de zero

Fes una còpia si vols conservar l'estat actual:

```bash
make backup
```

Després reinicia les dades locals:

```bash
make reset
make up
```

## Limitacions actuals

- És una demo tècnica inicial.
- El professorat entra amb token local, no amb SSO.
- No hi ha Authentik encara.
- EduHoot ja es pot activar com a mòdul opcional (`COMPOSE_PROFILES=eduhoot`, veure README); Banc de recursos i Robotics encara no estan integrats.
- No s'han de carregar dades reals d'alumnat.
