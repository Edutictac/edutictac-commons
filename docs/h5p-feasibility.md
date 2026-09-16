# EduTicTac Play — viabilidad técnica de H5P

Estado: Fase 0, recomendación para el primer prototipo.

## Recomendación

EduTicTac Play debe ser una capa de autoría simplificada sobre H5P, no un
nuevo motor de juegos ni una copia del editor H5P.

Para la primera vertical se recomienda:

1. formularios propios de EduTicTac Play, con un modelo interno pequeño y
   validado;
2. un adaptador por tipo de actividad (`multiple-choice` en esta fase);
3. `h5p-standalone` para reproducir en navegador el contenido H5P extraído;
4. un exportador propio que genere el ZIP `.h5p` desde librerías H5P
   versionadas y `content.json`;
5. una API de almacenamiento independiente del reproductor, preparada para
   sustituir ficheros locales por PostgreSQL y almacenamiento de objetos.

La primera versión no utilizará el editor H5P convencional. El editor H5P es
útil para plataformas que necesitan autoría genérica, pero introduce
demasiadas opciones para el objetivo de crear una actividad en pocos minutos.

## Qué es realmente un paquete `.h5p`

Un `.h5p` es un ZIP con extensión propia. No basta con renombrar cualquier ZIP:
debe incluir la definición del paquete `h5p.json`, un `content/content.json`
con la estructura que espera la librería principal y las librerías runtime,
cada una en su directorio con `library.json` y sus recursos.

La especificación oficial define como piezas principales el ZIP, el árbol de
ficheros, `h5p.json`, el contenido opcional y las librerías necesarias:

- [Especificación del formato `.h5p`](https://h5p.org/node/2463)
- [Estructura de ficheros](https://h5p.org/specification)
- [Definición de `h5p.json`](https://h5p.org/comment/31754)
- [Definición de `library.json`](https://h5p.org/library-definition)

Para Multiple Choice la librería principal es `H5P.MultiChoice`. El contenido
simplificado de EduTicTac Play se transformará, por ejemplo, a una estructura
similar a:

```json
{
  "question": "<p>¿Cuál es correcta?</p>",
  "answers": [
    {"text": "<div>Respuesta A</div>", "correct": true},
    {"text": "<div>Respuesta B</div>", "correct": false}
  ],
  "behaviour": {
    "enableRetry": true,
    "enableSolutionsButton": true,
    "enableCheckButton": true,
    "randomAnswers": true
  }
}
```

Los valores avanzados se fijarán en defaults educativos razonables y no se
expondrán al alumnado.

## Ejecución en navegador

El reproductor elegido es [`h5p-standalone`](https://github.com/tunapanda/h5p-standalone),
que permite reproducir un H5P sin instalar un LMS. Su licencia es MIT. Recibe
una carpeta extraída con `h5p.json`, `content/content.json` y las librerías;
EduTicTac Play servirá esas rutas localmente, sin CDN ni dependencia de red.

Esto resuelve la ejecución del MVP, pero no sustituye toda una integración de
plataforma H5P: seguimiento xAPI, edición genérica, gestión de librerías,
actualizaciones y permisos seguirán siendo responsabilidad de Play/Commons.

## Librerías y licencias

La Fase 1 incluirá únicamente las librerías runtime necesarias para Multiple
Choice, fijadas por versión y acompañadas de sus avisos:

| Librería | Función | Licencia declarada | Uso |
|---|---|---|---|
| `H5P.MultiChoice` | actividad principal | MIT | incluida en paquetes |
| `H5P.Question` | comportamiento común de preguntas | MIT | incluida |
| `H5P.JoubelUI` | interfaz común H5P | MIT | incluida |
| `H5P.Transition` | transiciones | MIT | incluida |
| `H5P.FontIcons` | iconos H5P | declarada por la librería | incluida |
| `FontAwesome` 4.5 | fuente/iconos | declarada como MIT en `library.json` del paquete usado; revisar avisos upstream antes de cada release | incluida |
| `h5p-standalone` | reproductor | MIT | dependencia de la aplicación |

Fuentes upstream consultadas:

- [H5P Multi Choice](https://github.com/h5p/h5p-multi-choice) declara MIT.
- [H5P Core PHP](https://github.com/h5p/h5p-php-library) declara GPL-3.0.
- [H5P technical overview](https://h5p.org/technical-overview) explica la
  separación entre Core, librerías, editor e integración de plataforma.

El core PHP de H5P no se usará en el servicio inicial: está orientado a una
integración de plataforma mediante interfaces PHP y su licencia GPL-3.0 exige
una revisión jurídica y arquitectónica distinta. Se mantiene como opción para
una futura integración profunda si Commons adopta un servicio PHP separado.

## Exportación e importación en Moodle/AULES

El exportador de Play podrá generar paquetes técnicamente importables: Moodle
permite subir archivos `.h5p`, pero el servidor debe tener instalada la
librería de contenido correspondiente. La documentación de Moodle lo advierte
explícitamente: [Moodle H5P](https://docs.moodle.org/400/en/H5P).

Por tanto, la promesa del MVP será:

- el archivo cumple la estructura H5P y contiene las librerías runtime;
- se puede reproducir en Play y en un reproductor H5P compatible;
- Moodle/AULES podrá importarlo cuando tenga habilitado `H5P.MultiChoice` y
  sus dependencias, o cuando su administrador las instale;
- la compatibilidad se verificará con una instancia de prueba de Moodle antes
  de marcar una release como compatible.

No se debe afirmar compatibilidad universal sin probar la versión concreta de
Moodle/AULES, las políticas de subida y la versión instalada de las
librerías.

## Validación prevista

No se ha encontrado un validador universal e independiente que garantice
compatibilidad con todos los LMS. Se combinarán tres comprobaciones:

1. validación propia de JSON, nombres, dependencias y rutas seguras;
2. inspección del ZIP y ausencia de rutas peligrosas/duplicadas;
3. reproducción real con `h5p-standalone` y prueba de importación en Moodle.

El [H5P CLI](https://github.com/h5p/h5p-cli) se estudiará como herramienta de
desarrollo para empaquetar/verificar librerías, pero el exportador de la
aplicación no dependerá de ejecutar una herramienta externa en cada descarga.

## Riesgos y límites

`H5P.Matching` se ha descartado provisionalmente porque su repositorio oficial
está archivado. Para la actividad Relacionar se evaluará `H5P.DragQuestion`,
que mantiene licencia MIT, pero requiere validar localmente `jQuery.ui`,
`H5P.AdvancedText`, `H5P.Components` y `H5P.JoubelUI`, además de probar la
importación del paquete resultante en Moodle. No se incorporará una librería
archivada solo para adelantar la interfaz.

- Las librerías H5P evolucionan y pueden requerir una versión de Core concreta.
  Las versiones se fijarán y actualizarán conscientemente.
- Un `.h5p` puede ser válido estructuralmente y aun así no funcionar si el LMS
  carece de una dependencia o bloquea una versión.
- El contenido del alumnado debe tratarse como texto no confiable. El
  adaptador solo permitirá un subconjunto seguro de HTML o escapará texto; no
  se aceptará HTML arbitrario del usuario.
- El reproductor ejecuta JavaScript de las librerías H5P. Las librerías se
  servirán localmente con CSP y procedencia controlada.
- El MVP guardará borradores sin cuenta en `localStorage` y, opcionalmente,
  ficheros temporales del servicio. La persistencia multiusuario y la
  publicación requerirán el modelo Commons/PostgreSQL de la siguiente fase.

## Decisión de arquitectura mínima

```text
Formulario propio
    -> modelo ActivityDocument
    -> adaptador MultipleChoice
    -> content.json + h5p.json + librerías fijadas
    -> h5p-standalone para preview/juego
    -> ZIP .h5p para descargar/importar
```

Los próximos tipos de actividad solo añadirán otro adaptador y sus librerías;
no deberán modificar el almacenamiento, las rutas públicas, la autenticación
ni el exportador común.
