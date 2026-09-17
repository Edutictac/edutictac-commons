# EduTicTac Commons 0.1.1-alpha

Versió de proves del stack amb EduHoot 1.0.2. No és encara una versió estable
per a ús general en centres.

## Canvis

- Idiomes CA, VA, ES i EN separats, amb persistència en entrar a EduHoot.
- El canvi d'idioma conserva els controls del perfil de l'alumnat.
- 14 comprovacions de navegador en Commons i 26 en EduHoot, entre escriptori
  i mòbil: taulers, editor, joc, recàrrega i detecció de variants.
- Prova aïllada d'instal·lació i restauració de SQLite, MongoDB, uploads i
  informes. Usa dades sintètiques, ports locals i un projecte Docker temporal.
- Publicació conjunta de les tres imatges Commons i la imatge EduHoot.

## Versions

| Component | Tag |
|---|---|
| Commons (portal, id-api, admin) | `0.1.1-alpha` |
| EduHoot | `1.0.2` |

EduHoot passa del tag Docker inicial `0.1.0` a la numeració del seu paquet
Node (`1.0.2`). No s'ha d'interpretar com una migració de dades.

Les imatges publicades i els seus digests consten en
`releases/0.1.1-alpha/images.json`. El digest identifica exactament el
contingut descarregat; no s'han de sobreescriure els tags d'esta versió.
La plataforma construïda i comprovada és `linux/amd64`.

## Validació

Les proves de navegador requerixen Node 24 i Python 3. GitHub Actions les
executa en cada push a `main` i pull request.

```bash
npm ci
npx playwright install --with-deps chromium
make test-i18n
make release-check
make test-installation INSTALL_TEST_ARGS="--pull --lock releases/0.1.1-alpha/images.json"
```

En el repo EduHoot, des de `src/`:

```bash
npm ci
npx playwright install --with-deps chromium
npm run lint
npm test
npm run test:i18n
```

Les proves de navegador simulen les respostes API i els esdeveniments de
joc per comprovar la interfície sense usar comptes ni dades reals. Els
scripts de flux i instal·lació comproven la integració amb serveis reals.
La prova aïllada no valida els timers systemd del host ni l'accés tailnet.

## Publicació

Construïx EduHoot des del seu repo amb el tag de la taula i les tres imatges
Commons amb `IMAGE_REGISTRY=registry.edutictac.es/edutictac` i
`IMAGE_TAG=0.1.1-alpha`. Després del login de publicació:

```bash
IMAGE_REGISTRY=registry.edutictac.es/edutictac IMAGE_TAG=0.1.1-alpha EDUHOOT_TAG=1.0.2 INCLUDE_EDUHOOT=1 SKIP_BUILD=1 make push-images
python3 scripts/lock-images.py --eduhoot-source /ruta/al/repo/EduHoot
```

Genera el manifest amb els commits font ja guardats. Incorpora el manifest
al repo després de comprovar `test-installation --pull --lock ...` i etiqueta
la revisió final. No publiques una imatge nova sobre un tag ja entregat.

## Instal·lació

En una còpia del tag `v0.1.1-alpha`, prepara `.env` a partir de `.env.example`,
configura els secrets propis del centre i fixa:

```env
IMAGE_REGISTRY=registry.edutictac.es/edutictac
IMAGE_TAG=0.1.1-alpha
EDUHOOT_TAG=1.0.2
COMPOSE_PROFILES=eduhoot
```

```bash
docker compose --env-file .env -f compose.yml pull
make up-pulled
make test-flow
make test-eduhoot-flow
```

Per fixar també els digests en l'arrancada, afegeix l'override publicat:

```bash
docker compose --env-file .env -f compose.yml -f releases/0.1.1-alpha/compose.images.json up -d --no-build --wait
```

Els scripts `make up-pulled` i `make restore` usen els tags de `.env`;
la prova `test-installation --lock` fixa els digests durant tot el cicle.

En una instal·lació existent, fes `make backup` i `make backup-check` abans
de canviar les versions. Conserva els tags anteriors i la còpia de dades
per a poder tornar a l'estat anterior.
