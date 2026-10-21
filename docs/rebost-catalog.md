# Catálogo común del Rebost

20-10-2026. Catálogo ampliado a 51 imágenes propias; validación local antes de publicar.
El catálogo ya se puede elegir en los botones de personaje/fondo de Blocs en pruebas locales;
la conexión con un segundo editor sigue pendiente.

## Inventario real

Inventario reproducible de Blocs `49d6ef51d` (revisión completa en el manifiesto):

| Grupo | Cantidad | Tratamiento |
|---|---:|---|
| Entradas de personajes del catálogo habitual | 333 | Agrupaciones de disfraces/sonidos; no confundir con archivos de imagen. |
| Entradas de disfraces | 859 | Metadatos; los bytes vienen del catálogo externo a través del proxy. |
| Entradas de fondos | 85 | Metadatos del catálogo externo. |
| Imágenes externas únicas referenciadas | 949 | Inventariadas, no descargadas ni empaquetadas en esta entrega. |
| Entradas de sonidos / audio único referenciado | 353 / 355 | Fuera del alcance inicial de imágenes. |
| SVG locales de plantillas de Blocs | 110 | Hash, ruta, estado y motivo registrados. |
| Selección ampliada | 51 | 17 personajes/expresiones, 16 fondos y 18 objetos, con fuentes y licencia. |
| Controles y miniaturas excluidos | 59 | Botones específicos de plantillas y vistas de galería; no son ilustraciones reutilizables. |

El inventario completo está en [rebost-catalog-inventory.json](rebost-catalog-inventory.json).
Las carpetas públicas `static/templates/icons` y `static/templates/backdrops` son copias
producidas por el generador de plantillas, no otro catálogo independiente. Sus fuentes son
`templates/assets`, que se han usado para evitar importar dos veces el mismo recurso.

La ampliación solo incorpora arte local propio de las plantillas. No descarga imágenes del
catálogo externo ni cambia su acceso habitual mediante el proxy de Blocs.

### Revisión del catálogo externo de Scratch (20-10-2026)

Fuentes oficiales consultadas:

- [Condiciones de Scratch, actualizadas el 22-01-2026, apartados 7.1–7.3](https://mitscratch.freshdesk.com/en/support/solutions/articles/4000219182-scratch-terms-of-service).
  Distinguen código, materiales de apoyo y marcas. La licencia del código no concede por sí
  sola derechos sobre los gráficos. El apartado 7.2 remite a la licencia aplicable al material.
- [Ayuda oficial sobre reutilización de imágenes y sprites, 18-07-2024](https://mitscratch.freshdesk.com/en/support/solutions/articles/4000156892-may-i-use-remix-scratch-support-materials-sprites-images-sounds-or-sample-projects-i-ve-found-on).
  Indica Creative Commons Attribution-ShareAlike para la mayoría de materiales, con excepciones
  de marcas; no identifica por hash la licencia y versión de cada archivo.

La auditoría inicial dejó los 949 archivos externos sin incorporar. Una revisión posterior
ha permitido añadir una selección histórica explícita en una colección separada:
[Catàleg Scratch: 31 imágenes y sus evidencias](rebost-scratch.md). La revisión restante sigue abierta. La revisión no acredita una licencia concreta para cada hash; no concluye
que esté prohibido reutilizar todos los recursos de Scratch. Para incorporar una selección
harán falta procedencia verificable, licencia y versión, atribución y comprobación de marcas
por recurso. No se asigna GPL ni CC genérica a ese conjunto por pertenecer a una biblioteca.
El inventario conserva los hashes externos para continuar esa revisión sin descargarlos.

## Selección y licencia

Se han seleccionado recursos descritos por Blocs como gráficos propios de sus plantillas,
comprobando que sus bytes coinciden con el árbol de la revisión registrada. No hay una licencia
particular por SVG; se conserva la licencia del proyecto: `package.json` declara GPL-3.0,
`Dockerfile` precisa GPL-3.0-only, y se adjunta su `LICENSE` íntegro. No se aplica la licencia MIT
del código de Commons a estas imágenes ni se asignan licencias nuevas.

| ID antiguo de Blocs | Fuente SVG | Nombre |
|---|---|---|
| `bloc` | `bloc.svg` | Bloc |
| `lua` | `lua.svg` | Lua |
| `robot` | `robot.svg` | Robot |
| `microbot` | `microbot.svg` | Microbot |
| `mascota` | `mascota-content.svg` | Pip |
| `estrella` | `estrella.svg` | Estrella |
| `pilota` | `pilota.svg` | Pilota / Pelota |
| `blank` | `fons-paper.svg` | Fons clar / Fondo claro |
| `forest` | `fons-bosc.svg` | Bosc / Bosque |
| `beach` | `fons-platja.svg` | Platja / Playa |
| `sky` | `fons-cel.svg` | Cel / Cielo |
| `classroom` | `fons-pissarra.svg` | Aula |

La tabla anterior conserva las doce correspondencias iniciales. La selección ampliada añade
expresiones de Bloc, Lua, Robot y Pip; un detective; escenarios de casa, correo, laberinto,
música, pistas y modelos; y objetos como manzana, piano, pincel, pelota, sobres y semáforos.
Las dos versiones del fondo de modelos contienen texto distinto y mantienen IDs separadas.
El manifiesto contiene la lista completa y los nombres en ambos idiomas. No se cambian los
IDs del catálogo original de Blocs ni se crea otra biblioteca dentro del editor.

Los doce registros iniciales permanecen idénticos, incluidos hashes y revisiones. Cada fuente
conserva su revisión de origen si sus bytes no cambian. `--check` verifica esa revisión, los
archivos del árbol de trabajo y la selección; nuevos commits de código ajenos al arte no
obligan a alterar la procedencia de las imágenes. La regeneración es idempotente.

Cada entrada tiene una ID central opaca estable `img-<sha256(namespace + ID lógico antiguo)>`, además
de `source_id` y `aliases` con el ID antiguo. Se conserva el identificador antiguo sin cambiar
catálogos, plantillas, esquemas JSON o proyectos de Blocs. La revisión de cada entrada cambia
cuando cambian sus bytes o metadatos; no cambia su ID por una actualización.

[Manifiesto y hashes](../services/id-api/assets/catalog/manifest.json),
[fuentes SVG](../services/id-api/assets/catalog/sources),
[licencia completa](../services/id-api/assets/catalog/licenses/GPL-3.0-only.txt).

Las imágenes de consumo son PNG; se conservan dimensiones y transparencia. Las miniaturas
se renderizan por separado desde el vector para que los personajes pequeños se vean nítidos.
El catálogo conserva el SVG original para descargar y editar con herramientas apropiadas;
la API no lo renderiza ni acepta SVG arbitrario subido por usuarios.

## Catálogo y bibliotecas privadas

La página `/assets/` distingue **Catàleg EduTicTac / Catálogo EduTicTac** de **Les meues
imatges / Mis imágenes**. El catálogo se distribuye una sola vez con la imagen de API, como
archivos locales inmutables; no crea un usuario de sistema ni duplica entradas por usuario.
No necesita red, Chromium, otra base de datos o un servicio nuevo en ejecución.

El catálogo se puede consultar sin iniciar sesión; nadie puede renombrar o eliminar sus
originales. **Guardar en mis imágenes** crea una copia privada explícita y conserva procedencia,
atribución, licencia íntegra y SVG de origen. Esos datos son protegidos: el PATCH de nombre/tipo
no permite reemplazarlos ni eliminarlos. Las fuentes y licencia de una copia siguen disponibles
aunque una versión futura retire el original del catálogo. Las copias duplicadas conservan
esa información. Un usuario distinto no accede a las copias privadas ni a sus fuentes.

El catálogo no consume cuota personal por aparecer en el selector; sus bytes se cuentan en
el límite global. Una copia privada consume las cuotas normales y el espacio de su procedencia
(fuente/licencia incluidas). Los PNG privados idénticos siguen deduplicándose por propietario.
Borrar la última copia limpia sus BLOBs y procedencia; no borra el catálogo ni proyectos externos.

Los créditos, la descarga de fuente y la licencia se muestran tanto en el original como en
la copia privada. Antes de integrar un editor, su adaptador debe conservar esta procedencia
y las condiciones aplicables al guardar/exportar proyectos; trasladar solo el PNG no basta
para implementar la conservación prevista. El adaptador local de Blocs incorpora esos datos
como texto inerte en comentarios del proyecto y conserva el guardado nativo `.sb3`.

## Contrato y seguridad

- `GET /api/assets/v1/items?collection=catalog` lista el catálogo; `mine` sigue siendo el valor
  predeterminado. Se mantienen búsqueda, tipo, cursor y límite. Se busca en ambos idiomas y aliases.
- Metadatos de catálogo: `collection:"catalog"`, `readonly:true`, `names`, `license`, `attribution`,
  `source_id`, `source_path`, `source_revision`, `source_repository`, `aliases`, `changes` y revisión.
- `/items/{id}/content` y `/thumbnail` devuelven PNG; `/source` y `/license` descargan adjuntos.
  Las consultas del catálogo son públicas. Las bibliotecas personales exigen una identidad
  individual válida. Se conservan cabeceras de no almacenamiento y protección de contenido.
- `POST /items/{id}/copies`, con Origin e If-Match, crea una copia privada; PATCH/DELETE del
  original común devuelven 404. Los antiguos endpoints privados siguen funcionando.
- La tabla aditiva `asset_provenance` guarda snapshots de fuentes/licencias de copias privadas
  en la misma SQLite; forma parte de su backup. El catálogo original viaja con la imagen de API.
- El cargador comprueba formato, IDs, aliases, revisiones, hashes, tamaños, dimensiones y rutas;
  rechaza rutas fuera del paquete y enlaces simbólicos. Verifica PNG con Pillow antes de servir.
- El generador acepta solo elementos/atributos SVG revisados, sin scripts, HTML, imágenes
  enlazadas, declaraciones XML ni referencias externas. Renderiza con JavaScript y red desactivados.
  Los SVG descargables son `application/octet-stream` y `attachment`, con CSP sandbox y nosniff.

El paquete es parte del código distribuido, no un formato de importación para el alumnado.
Cambiarlo requiere regenerar/revisar el manifiesto y actualizar la imagen. No existe subida
web para publicar en el catálogo del sistema ni para saltarse esta revisión.

## Generación y comprobación local

Desde Commons:

```sh
python scripts/build-rebost-catalog.py --blocs ../edutictac-blocs
python scripts/build-rebost-catalog.py --blocs ../edutictac-blocs --check
python -m pytest -q tests/test_rebost.py tests/test_rebost_catalog.py
docker build -t commons-rebost-check:local services/id-api
python3 scripts/verify-rebost-docker.py
```

La generación necesita Python Playwright, Pillow y Chromium local; no descarga arte ni usa
APIs comerciales. Playwright (Apache-2.0) y Chromium se usan solo como herramientas locales de generación/prueba,
no se añaden a la imagen de ejecución. Pillow conserva su licencia MIT-CMU.
El código generador valida que los SVG coincidan con la revisión de origen.
El `--check` verifica hashes y vigencia del inventario sin renderizar ni escribir el paquete.
La ejecución de Commons solo requiere Pillow, ya incorporado al núcleo privado.

Las pruebas cubren separación de colecciones/usuarios, originales inmutables, copias con
fuentes/licencias, cuotas y revisión concurrente, reinicio de servicio, snapshot del backup
Commons, hashes/rutas/enlaces falsificados y SVG activo rechazado antes de renderizar.
En navegador se comprueban es/va, ratón/táctil, búsqueda traducida, descarga de fuente y copia
privada. La prueba Docker usa red desactivada y volúmenes temporales; no toca servicios reales.

La nueva demo local del catálogo usa el puerto **18616**, con cuenta y datos de demostración
separados. La demo privada anterior de 18615 se conserva; las cookies de ambas tienen nombres
distintos para evitar sobrescribir sesiones compartidas por host. No se ha publicado el código.

Resultados de la primera selección: **34 pruebas específicas de Rebost/catálogo aprobadas**, incluidas las
pruebas de navegador en castellano y valenciano. Regresiones de itinerarios, Quiosc y backup
comprobadas (solo dos integraciones Docker de Quiosc omitidas por ser opt-in). La comprobación
Docker del catálogo con red desactivada recupera la imagen privada, catálogo, fuente y licencia
de una copia después de reiniciar. Compilación de imagen y validación de JS/manifest correctas.


## Validación de la ampliación a 51 imágenes

- 39 pruebas de Rebost/catálogo aprobadas, incluidas es/va en navegador, paginación
  40→51, filtros, búsqueda bilingüe, privacidad, cuotas y copia con fuentes/licencia.
- Regeneración completa repetida: todos los archivos idénticos; `--check` correcto.
- Los doce registros iniciales conservan IDs, revisiones y hashes de PNG y SVG.
- Imagen Docker compilada y probada sin red con volumen temporal: catálogo, copia
  privada, fuente/licencia y persistencia después del reinicio.
- Aceptación Blocs es/ca con ratón y contexto táctil: selección de personajes, objeto
  Manzana/Poma y fondo Casa, movimiento, editor nativo y guardado/reapertura anónima
  de `.sb3` con fuentes y créditos. Regresión de selectores de disfraces y revisión IA.

Activado únicamente en el entorno local de Commons, sin push ni publicación de imágenes.
Se ha conservado una instantánea SQLite privada y la imagen previa antes de recrear
solo `id-api`; portal, Blocs y Authentik permanecen en sus contenedores actuales.
La comprobación local confirma 51 entradas instaladas y HTTP 200 en salud, gestor y Blocs.
La prueba táctil automatizada no sustituye la comprobación manual desde un iPad.


El gestor y el selector incorporan también la colección separada [Catàleg Scratch](rebost-scratch.md). No se suman sus 31 imágenes a las 51 propias ni se cambia la licencia de unas por otras.
