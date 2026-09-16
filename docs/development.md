# Desarrollo

## Estructura actual

```text
services/play/
  server.py                 API, almacenamiento y exportador H5P
  public/                   interfaz, estilos, i18n y PWA
  h5p-libraries/            librerías runtime versionadas
tests/test_play_export.py   prueba estructural del paquete H5P
docs/                       decisiones y operación
```

La PWA incluye `manifest.json`, iconos SVG y `sw.js`. El service worker solo
cachea la carcasa estática; deja pasar `/api/` y `/h5p-libraries/` para no
servir actividades o librerías desactualizadas. La edición y la
previsualización offline completa quedan pendientes de sincronización segura.

El prototipo usa Python estándar y JavaScript del navegador para reducir
dependencias. No contiene dependencias de IA ni llamadas a servicios externos.

## Ejecutar Play sin contenedores

```bash
cd services/play
PORT=8083 PLAY_DATA_DIR=./data python3 server.py
```

Abre `http://localhost:8083`.

## Pruebas

```bash
python3 -m pytest -q tests/test_play_export.py
make test-play
MOODLE_USER=... MOODLE_PASSWORD=... MOODLE_COURSE_ID=... make test-moodle
docker compose --env-file .env.example -f compose.yml config --quiet
docker compose --env-file .env.example -f compose.yml build play
```

El test de exportación comprueba que el archivo es un ZIP legible, contiene
`h5p.json`, `content/content.json` y `H5P.MultiChoice`, y conserva la respuesta
correcta tras la transformación.

## Prueba de importación en Moodle

La prueba Playwright `test:moodle` crea una actividad de prueba en Play,
descarga el `.h5p`, inicia sesión en Moodle y lo sube al banco de contenido del
curso indicado. Requiere una cuenta de pruebas con permiso para subir H5P y un
curso dedicado:

```bash
MOODLE_USER='usuario-de-pruebas' \
MOODLE_PASSWORD='secreto-introducido-en-el-entorno' \
MOODLE_COURSE_ID='2' \
npm run test:moodle
```

No pongas estas variables en `.env`, Git ni scripts. Si no están definidas, la
prueba se marca como omitida y no falla la suite general.

El procedimiento validado en el Moodle local está documentado en
[`moodle-h5p-test.md`](moodle-h5p-test.md).

## Añadir un tipo de actividad

El siguiente tipo debe tener un adaptador propio con modelo de entrada,
validación, transformación a `content.json`, dependencias runtime, defaults
educativos y pruebas de exportación y reproducción.
