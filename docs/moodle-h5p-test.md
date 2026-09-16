# Prueba automática de importación H5P en Moodle

## Objetivo

La prueba verifica la compatibilidad básica entre EduTicTac Play y el Moodle
instalado en `debiandesktop`:

1. crea un Quiz de prueba mediante la API de Play;
2. descarga el paquete `.h5p` generado;
3. inicia sesión en Moodle con una cuenta técnica;
4. entra en el banco de contenido de un curso de pruebas;
5. sube el archivo H5P;
6. comprueba que Moodle lo importa y reproduce la pregunta y las respuestas.

El test está en [`tests/browser/moodle-h5p.spec.js`](../tests/browser/moodle-h5p.spec.js)
y usa [`playwright.moodle.config.js`](../playwright.moodle.config.js).

## Moodle de pruebas

La instancia se publica en:

```text
http://debiandesktop.taildc0f74.ts.net/moodle/
```

En `debiandesktop` la prueba resuelve ese nombre canónico hacia la IP Tailnet
`100.74.151.108` mediante la opción de Chromium
`--host-resolver-rules`. No se cambia el DNS del sistema ni la configuración de
Moodle.

En la instancia local se creó una cuenta técnica con nombre:

```text
edutictac_play_test_20260916211257
```

y un curso aislado de pruebas con ID `24`. La cuenta tiene rol de profesor en
ese curso. Si se recrea la instalación, deben volver a crearse una cuenta y un
curso equivalentes; no se deben usar cuentas personales en automatizaciones.

## Ejecutar la prueba

Las variables se deben proporcionar desde el entorno. No se guardan en Git ni
en `.env` del proyecto:

```bash
export MOODLE_USER='edutictac_play_test_20260916211257'
read -r -s MOODLE_PASSWORD
export MOODLE_PASSWORD
export MOODLE_COURSE_ID='24'

npm run test:moodle
```

También se puede usar un fichero local protegido, como el creado para esta
instancia:

```bash
set -a
. /tmp/edutictac-play-moodle-test.env
set +a
export MOODLE_USER="$user"
export MOODLE_PASSWORD="$password"
export MOODLE_COURSE_ID="$course"
npm run test:moodle
```

El fichero de credenciales debe tener permisos `600`, no debe entrar en Git y
se puede eliminar al terminar las pruebas.

## Resultado validado

La prueba se ha ejecutado correctamente en la instancia local:

```text
1 passed
EduTicTac Play exporta e importa un H5P en Moodle
```

La comprobación final no depende del nombre que Moodle asigne al fichero. Se
verifica que la vista del banco de contenido se abre y que el reproductor H5P
embebido muestra la pregunta de prueba y sus respuestas.

## Limitaciones

- La prueba utiliza la interfaz web y depende de los textos localizados de
  Moodle; si cambia la versión o el idioma, pueden cambiar los selectores.
- Comprueba importación y reproducción, no calificación, xAPI ni integración
  con el libro de calificaciones.
- El curso y la cuenta son datos de una instalación de pruebas, no fixtures
  portables de producción.
- No se deben ejecutar pruebas destructivas contra cursos reales.
