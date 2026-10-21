# EduTicTac Rebost: núcleo central privado

Blocs también permite completar imágenes pendientes después de abrir un proyecto mediante
**Archivo → Imágenes del proyecto…**, reutilizando este selector y el gestor central para
subidas. Las copias incorporadas al `.sb3` siguen disponibles sin sesión o sin el original
central. La implementación y las pruebas están en Blocs, `docs/rebost-opened-project.md`.
No añade endpoints, permisos, almacenamiento ni dependencias a Commons.

Estado, 20-10-2026: implementado, probado y activado en el stack local de Commons; sin publicación
externa. La integración local ya permite elegir personajes y fondos desde Blocs,
con el selector central bajo el mismo origen y el [primer catálogo común](rebost-catalog.md). El gestor provisional de
Blocs se ha retirado de la interfaz; sus datos se conservan para migrarlos. [Plan completo y siguientes fases](assets-central-plan.md).

El acceso desde la portada y el login habitual de Commons ya está preparado mediante
un complemento Compose opcional, verificado con nginx y la API reales en contenedores
aislados. [Configuración, pruebas y límites del acceso compartido](rebost-commons-access.md).

## Qué incorpora esta primera entrega

- Página `/assets/` accesible desde la portada de Commons, en castellano y valenciano.
- Subida desde dispositivo o arrastrando imágenes, miniaturas, vista ampliada, búsqueda,
  tipos, renombrado, duplicación y eliminación. Botones táctiles y uso por teclado.
- PNG, JPEG y WebP estáticos; verificación y normalización a PNG sin metadatos. No SVG ni
  imágenes animadas. No hay editor gráfico, importador de proyectos ni servicios externos.
- API común `/api/assets/v1` en el `id-api` existente; cliente JS independiente de React,
  Redux, Scratch y Blocs, en `services/portal/public/assets/client.js`.
- Almacenamiento de metadatos y bytes en la SQLite existente `EDUTICTAC_ID_DB` (`/data/id.db`
  en Compose). No se añade contenedor, puerto ni base de datos al stack.

El tipo `background` clasifica una imagen, sin reducirla a 480 × 360: su tamaño conserva
la utilidad en otras aplicaciones. Cada consumidor hará su ajuste visual. Editar en Blocs
seguirá siendo responsabilidad de Disfraces/Fondos.

## Identidad y privacidad

El backend resuelve al propietario; no admite un `owner_id` del cliente. Los principales
son internos, opacos y estables, con espacios de nombres separados:

- Alumnado: identidad interna de Commons, comprobando sesión activa y estado del alumno.
  Cerrar sesión, revocarla, desactivar la identidad o eliminar su grupo corta nuevas lecturas.
  Volver a iniciar sesión con la misma identidad recupera su biblioteca.
- OIDC: pareja de issuer/sub verificados por Commons. El acceso a Rebost requiere una sesión
  registrada en servidor al iniciar sesión por OIDC, con ocho horas de vigencia y revocación
  en los dos endpoints existentes de cierre de sesión. Una cookie anterior sin esa sesión
  requiere volver a entrar; no se cambia a otro propietario ni a modo anónimo.
- Tokens técnicos, acceso docente de compatibilidad y la cookie compartida `teacher-token`
  no crean una biblioteca humana. Ser docente no da acceso a las imágenes del alumnado.

No se almacenan nombres ni correos en los principales de Rebost. Las imágenes y miniaturas
no son públicas. Una ID ajena devuelve 404; estar en la misma instalación o grupo no concede
permiso. Se usan `private, no-store`, `nosniff`, CSP restrictiva y CORP `same-origin`.
Los textos de los nombres se muestran mediante nodos de texto, sin interpretar HTML.

**Límite de la entrega:** la revocación OIDC es local a Commons/Rebost. Desactivar una cuenta
solo en el proveedor OIDC no notifica todavía al Rebost; no se promete revocación inmediata
remota. Antes de un piloto real hay que resolver notificaciones/introspección o el mecanismo
central de revocación elegido, y comprobar autenticación con el Authentik real. El estado
`active` del principal permite retirar el acceso local sin borrar sus recursos. Las cuentas
eliminadas no borran imágenes en cascada: la custodia/retención del centro sigue pendiente.

## Contrato inicial

Se mantiene el prefijo técnico `assets` aunque el nombre de producto sea Rebost.
El contrato generado está en `/openapi.json`; este documento detalla las cabeceras de escritura.

| Operación | Ruta |
|---|---|
| Capacidades y límites | `GET /api/assets/v1/me` |
| Lista paginada | `GET /api/assets/v1/items?q=…&type=…&cursor=…&limit=40` |
| Crear una entrada | `POST /api/assets/v1/items` |
| Metadatos y ETag | `GET /api/assets/v1/items/{id}` |
| PNG normalizado / miniatura | `GET /api/assets/v1/items/{id}/content` y `/thumbnail` |
| Cambiar nombre/tipo | `PATCH /api/assets/v1/items/{id}` |
| Duplicar entrada | `POST /api/assets/v1/items/{id}/copies` |
| Eliminar entrada | `DELETE /api/assets/v1/items/{id}` |

Subida: cuerpo binario, `Content-Type: image/png`, `image/jpeg` o `image/webp`;
`X-Rebost-Name` con nombre codificado mediante `encodeURIComponent` y `X-Rebost-Type` con
`sprite`, `background`, `object` o `illustration`. Nombre de 1–200 caracteres, sin controles.
No se pone el nombre del archivo en una URL ni se admite una URL externa como contenido.

PATCH: JSON exactamente `{name,type}`. PATCH, duplicación y borrado requieren `If-Match`
con la revisión entre comillas, por ejemplo `"2"`; ante conflicto, 412 `revision_conflict`.
Todas las escrituras requieren `Origin` igual al origen público autorizado. El cliente
compartido obtiene el `Origin` del navegador; no hay claves ni tokens técnicos en JavaScript.

Metadatos: `{id,name,type,width,height,bytes,revision,created_at,updated_at}`. ID opaca
`img-` y 64 hexadecimales, compatible con las referencias de imagen de Blocs; nunca es prueba
de propiedad ni una URL privada permanente. El listado no devuelve BLOBs ni hashes de contenido.
La paginación usa ID estable y devuelve `next_cursor` o `null`. El filtro de nombre trata
`%` y `_` como texto, no patrones. El catálogo común se consulta con `collection=catalog`; `mine` sigue siendo la colección
privada predeterminada. Véase el contrato adicional en [rebost-catalog.md](rebost-catalog.md).

Uso desde otro cliente del mismo origen:

```js
import {RebostClient} from '/assets/client.js';
const library = new RebostClient();
const {items} = await library.list({type: 'illustration'});
const image = await library.read(items[0].id); // Blob privado, incorporable al proyecto
```

El adaptador de una aplicación resolverá qué hacer con ese Blob. Este ejemplo no constituye
una segunda integración real. El cliente rechaza endpoints de otros orígenes; la delegación
entre dominios sigue pendiente. No hay federación ni compartición automática.

## Límites y consistencia

- Entrada y PNG normalizado: 5 MiB por imagen; 4096 × 4096 píxeles; miniaturas hasta 256 px.
- Por propietario: 200 entradas y 100 MiB de imágenes normalizadas únicas. Las copias cuentan
  como entradas; el contenido idéntico se deduplica solo dentro de ese propietario.
- Límite global inicial: 2 GiB, incluyendo miniaturas. Reserva de disco: 256 MiB.
- `BEGIN IMMEDIATE` protege cuotas, revisiones y eliminación de huérfanos. El último borrado
  elimina el BLOB sin referencias; no garantiza borrar páginas SQLite ni backups antiguos.
- Lectura del cuerpo limitada incluso sin `Content-Length`. Firmas/formatos, dimensiones y
  decodificación real con Pillow. Procesado fuera del bucle asíncrono, con dos decodificadores
  como máximo. La carga bajo concurrencia de un centro real queda pendiente de medición.

Configuración en Compose:

| Variable | Uso |
|---|---|
| `REBOST_PUBLIC_ORIGIN` | Opcional en acceso directo; origen público completo, sin ruta. Tras terminación TLS/proxy, configurarlo explícitamente para validar Origin sin confiar en cabeceras arbitrarias del cliente. |
| `REBOST_MAX_BYTES` | Límite físico lógico global en bytes; predeterminado 2147483648. |
| `REBOST_DISK_RESERVE` | Espacio libre reservado, predeterminado 268435456. |

Sin origen explícito se usa el origen de la petición tal como lo ve el servidor.
El proxy del portal preserva host/puerto para las rutas Rebost y limita el cuerpo a 5 MiB.
Las cuotas no sustituyen monitorizar el tamaño real de SQLite/WAL y el disco del centro.

## Persistencia, copias y actualización

El volumen existente `./data:/data` conserva `id.db`. Las tablas nuevas son aditivas:
`asset_principals`, `asset_sessions`, `assets`, `asset_contents` y `asset_provenance`. No hay archivos de usuario
fuera de SQLite. Los PNG, fuentes y licencia del catálogo común viajan versionados con la imagen
de API; las copias privadas conservan sus fuentes/licencias dentro de SQLite.
El mecanismo de backup existente toma una copia SQLite consistente e incluye estas tablas;
las correspondencias de usuario, metadatos y bytes viajan juntos.

Actualizar las imágenes de API y portal conjuntamente cuando se apruebe el despliegue.
Esta entrega no las ha aplicado al stack instalado. Conservar una copia antes de actualizar;
volver a una imagen anterior no requiere borrar las tablas aditivas ni las imágenes.
La migración de datos del prototipo Blocs no está ejecutada y debe ser explícita e idempotente.

La prueba Docker usa una imagen de comprobación, volumen y contenedor nuevos, red desactivada,
sin puertos publicados. Guarda una imagen, reinicia ese contenedor y vuelve a recuperar sus
bytes desde la misma identidad; después elimina únicamente sus recursos temporales.

## Pruebas reproducibles

Desde el repositorio Commons, en un entorno Python de pruebas:

```sh
python -m pip install -r services/id-api/requirements.txt pytest playwright Twisted
python -m pytest -q tests/test_rebost.py
python -m pytest -q tests/test_itineraries.py tests/test_quiosc.py tests/test_quiosc_local.py tests/test_backups.py
node --input-type=module --check < services/portal/public/assets/client.js
node --input-type=module --check < services/portal/public/assets/library.js
docker build -t commons-rebost-check:local services/id-api
python3 scripts/verify-rebost-docker.py
```

Las pruebas de navegador usan Chromium en `/usr/bin/chromium`, perfiles sintéticos es/va,
ratón/táctil y un servidor local con SQLite temporal; no un navegador conectado a datos reales.
Si Playwright no está instalado, pytest omite esas dos pruebas; la validación completa requiere
instalarlo. Twisted es una dependencia de prueba de Quiosc, no de ejecución del Rebost.

Resultado local del núcleo inicial: **21 pruebas específicas de Rebost**, **93 pruebas Python
aprobadas en conjunto** y 2 pruebas Docker de Quiosc omitidas porque son opt-in, 14 pruebas
existentes de idioma del portal y la comprobación aislada de persistencia Docker. Las dos
pruebas de navegador del Rebost se ejecutaron, no se omitieron.

Se comprueban permisos, cierre/revocación/expiración, entradas falsificadas, SVG/ejecutables,
PNG truncado, animación, dimensiones/tamaño, formatos válidos, cuotas, revisión concurrente,
normalización y transparencia, miniaturas, deduplicación privada, limpieza y snapshot SQLite.
En navegador: subida, edición de nombre con HTML tratado como texto, recarga, duplicación,
eliminación, vista previa y cuenta anónima sin acceso. No equivale a una tableta física.

## Licencias y siguientes pasos

Código nuevo escrito para Commons, separado del prototipo GPL de Blocs. No se han copiado
componentes React ni el editor gráfico a Commons. El cliente no añade dependencias JS.
Pillow **13.0.0**, MIT-CMU, es la nueva dependencia de ejecución; FastAPI (MIT) y Authlib
(BSD-3-Clause) ya existían. Se conservan los avisos y condiciones de los proyectos originales.
Se ha incorporado una selección de 51 gráficos propios de Blocs, manteniendo GPL-3.0-only
y sus fuentes; [inventario y límites de la revisión](rebost-catalog.md). El catálogo externo de
Scratch queda separado del paquete propio; [su primera selección revisada](rebost-scratch.md) tiene colección y licencia propias.

Adaptador local de Blocs: **Tria del Rebost** ya está en los botones de añadir personaje y fondo.
**Guarda al Rebost** ya permite guardar dibujos desde Disfraces/Fondos en local.
La selección central de disfraces/fondos y la vinculación de recursos en la revisión IA
también están implementadas en local. Quedan migración y segundo editor.
Después, conectar un segundo editor real. Solo ese hito demostrará la reutilización entre
aplicaciones; la página gestora y el cliente HTTP por sí solos no la demuestran.


## Selector compartido para aplicaciones

`/assets/?mode=pick&type=sprite&collection=catalog&lang=es&request=...` ofrece la misma biblioteca
en modo selección cuando la incrusta un editor. `type=background` restringe a fondos; personajes
admite sprite, object e illustration. El gestor normal sigue disponible fuera del iframe.
El selector oculta subidas, renombrado, borrado y duplicación; conserva búsqueda, vista previa,
colecciones y créditos. No añade otro editor ni exige una copia privada de los originales comunes.

Envía al padre del mismo origen `{format:"rebost-selection",version:1,request,id}`; Escape usa
`cancel:true` en lugar de ID. No hay `targetOrigin:*`, tokens ni URL de contenido en el mensaje.
El consumidor comprueba origen, ventana emisora y petición activa; obtiene los metadatos y bytes
con su sesión individual, valida el tipo y vuelve a comprobar la revisión. Una integración en
otro origen necesita resolver previamente la delegación verificada: este selector no la implementa.

Blocs consume esta interfaz desde `/blocs/editor.html`, conserva imágenes en el `.sb3` nativo y,
para el catálogo y sus copias, incorpora SVG original, licencia íntegra y atribución como texto
inerte en comentarios del proyecto. No interpreta SVG ni JavaScript. La API de Commons y sus
permisos no cambian. El contrato HTTP sigue siendo independiente de React, Scratch y Books.

Demo local combinada: entrar en `http://localhost:18617/demo/` y abrir después
`http://localhost:18617/blocs/editor.html`. El gateway temporal usa las vistas de pruebas 18613
(Blocs) y 18616 (Rebost); no modifica el proxy ni las cuentas del stack instalado. Los detalles
y el script de navegador están en el repositorio Blocs, `docs/rebost-integration.md` y
`scripts/verify-rebost.py`. El pintor ya permite guardar una copia privada de dibujos en Commons. La prueba bidireccional
verifica dibujar en Blocs, ver en el gestor central y volver a elegir la imagen desde Blocs.

Validación de esta integración: 34 pruebas específicas de Commons aprobadas; en Blocs,
217 pruebas Jest/14 suites, build de producción y pruebas Chromium es/ca con ratón/táctil.
La prueba completa vuelve a abrir el `.sb3` sin cookies después de eliminar la imagen privada
de la biblioteca y comprueba imágenes, movimiento, SVG original y licencia íntegra. La
regresión del asistente IA y datos antiguos también pasó. Pendientes sesión Authentik real
y tableta física; el gateway redirige a Blocs después del botón de entrada de demostración.


## Guardar imágenes desde editores

El pintor existente de Blocs incorpora Guardar en el Rebost con previsualización, nombre y
confirmación de una copia privada. Convierte dibujos vectoriales y bitmap en PNG sin perder
transparencia, espera la codificación nativa y conserva el encuadre de los fondos. No captura
personajes ni efectos de ejecución sobre el escenario. Guardar no publica ni sincroniza.

El contrato de subida admite opcionalmente `X-Rebost-Source` y `If-Match` para derivadas.
La capacidad `derived_upload` de `/me` identifica servidores que conservan esta procedencia;
un cliente no debe enviar una derivada a versiones antiguas que ignorarían estos encabezados.
El backend obtiene la fuente/licencia desde el catálogo o una copia privada autorizada y verifica
su revisión dentro de la misma transacción de escritura. Conserva atribución, fuente, licencia,
marca de derivación y cuotas; no acepta SVG subido ni metadatos de licencia inventados por el cliente.
La API sigue siendo común a otros editores y no depende de Scratch o de una ruta de Blocs.

La primera adaptación de Blocs compara las fuentes/licencias del proyecto con las autorizadas
por el servidor. Si la instalación no conserva ese origen exacto, mantiene el proyecto y comunica
el error; no borra la atribución para completar la subida. No reconstruye procedencia perdida
por editores ajenos ni incorpora automáticamente el catálogo externo de Scratch. Los detalles
y las pruebas están en Blocs `docs/rebost-save.md` y `scripts/verify-rebost-save.py`.

Validación del guardado desde editores: **37 pruebas API/catálogo Commons** y **225 pruebas
Jest de Blocs en 15 suites** aprobadas. La build de producción y el lint pasan. La prueba Docker
sin red conserva una derivada, fuente y licencia tras reiniciar un contenedor con volumen nuevo;
se limpia después de verificarlo. Las regresiones del selector central, JSON IA pendiente,
datos antiguos y `.sb3` en es/ca también han pasado con la nueva build local.

El recorrido completo de dibujo/guardado/reutilización y derivadas del catálogo ha pasado
en castellano y valenciano con entrada de ratón y contexto táctil. Se comprobaron cancelación,
transparencia, visibilidad en el gestor Commons, edición bitmap y fondos de 480 × 360. La última
suite Blocs incluye **225 pruebas** tras añadir el caso de distintas versiones de una fuente:
no se mezclan sus créditos ni se suben perdiendo metadatos.


## Disfraces y revisión de recursos IA

Los menús del pintor permiten elegir una imagen central como disfraz del personaje o fondo
del escenario actual. El destino se captura al abrir el selector; se conserva el orden de
los disfraces anteriores, programas y posición. No crea otro personaje ni copia privada por
seleccionar un original común.

Cada recurso declarado en la revisión de JSON v3 permite Elegir del Rebost. Cambia únicamente
su referencia `file`, con vista previa y estados disponible/pendiente/no encontrado. Conserva
ID lógico, nombre, descripción, coordenadas y bloques, incluso si varios personajes comparten
la declaración. La compilación y apertura incluyen imágenes, SVG original y licencia como
texto inerte dentro del `.sb3`, verificadas después en un perfil sin sesión central.

Las pruebas están en Blocs: `test/unit/blocs/rebost-bindings.test.js`,
`test/unit/blocs/rebost-picker.test.js` y `scripts/verify-rebost-bindings.py`. La suite habitual
`npm run test:unit` ahora incluye Blocs además de addons: **272 pruebas en 18 suites** aprobadas.
`npm run test:rebost` ejecuta Blocs y `npm run test:rebost:browser` el recorrido sintético con
servidores locales preparados. Se comprobó es/ca, entrada de ratón/contexto táctil, cancelación,
filtro de tipo, respuesta tardía, target obsoleto, preservación de lógica/créditos y ausencia
de duplicados en la biblioteca privada. La API y permisos de Commons no necesitan cambios.
La guía de ejecución está en Blocs `docs/rebost-bindings.md`. Todo continúa sin publicar.


## Catàleg Scratch

Colección separada `collection=scratch`, con 31 imágenes históricas revisadas bajo CC BY-SA 2.0.
Visible en el gestor y en el selector compartido de Blocs; conserva fuentes, atribución y licencia
en originales, copias privadas y proyectos `.sb3`. [Procedencia, alcance y generación](rebost-scratch.md).


Ampliació del 21-10-2026: el Catàleg Scratch passa de 31 a **61 imatges** amb un lot
de 30 disfresses de famílies ja revisades. Els 31 recursos inicials es mantenen
intactes; [evidències i proves](rebost-scratch.md).

## Interfície compartida

La interfície central usa Vue i continua servint el selector de Blocs i Llibres. Consulta [components, compilació i contractes](rebost-vue.md).
