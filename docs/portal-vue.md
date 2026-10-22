# Migración gradual del portal a Vue

Rebost central fue la primera fase. La segunda extrae el editor de itinerarios
del panel docente; el resto del portal mantiene su implementación mientras se
migra por módulos. El [roadmap](ROADMAP.md) recoge el orden acordado.

## Itinerarios

`services/portal/src/teacher/ItinerariesPanel.vue` contiene el formulario y las
tarjetas. `useItineraries.js` controla la carga, los cambios de orden y la
selección activa. Los nombres y títulos se interpolan como texto; ninguna
respuesta de la API se convierte en HTML o en una plantilla ejecutable.

El portal carga el componente solo cuando existe `#itinerariesPanel`. Su puente
se limita a `setContext({teacher, group, assignments, assignment})` y `load()`.
`app.js` sigue resolviendo la sesión y la selección de grupo/actividad; el panel
posee su estado de itinerarios. Se han retirado del controlador general la
plantilla HTML, el estado de itinerarios, los manejadores delegados y los
cambios manuales del DOM que pertenecían al editor.

Un cambio de grupo o de sesión invalida las lecturas y guardados anteriores.
Una respuesta antigua, incluso `401`, no altera el panel del grupo nuevo ni
desbloquea un guardado posterior. El servidor sigue verificando los permisos.
Una respuesta `401` del contexto vigente retira los itinerarios y desactiva la
sesión docente en el portal. Un fallo de red al cargar itinerarios mantiene
la sesión docente y permite reintentar.

Se conservan los contratos `expected_assignment_ids` y
`expected_itinerary_id`. Tras un conflicto se recuperan los datos actuales;
si la recuperación falla, los controles de edición siguen desactivados hasta
una carga correcta. Quitar un paso conserva la asignación y sus resultados.

El formulario acepta Enter, conserva el borrador al cambiar de idioma y evita
guardados duplicados mientras espera una respuesta. Errores, controles y
etiquetas usan CA/VA/ES/EN mediante `src/shared/usePortalTranslations.js` y los
diccionarios existentes. No se añade otra preferencia de idioma.

Si el módulo no puede descargarse, aparece un mensaje de recarga y el resto
del portal continúa inicializándose. La portada no carga Vue; el panel del
alumnado dispone ahora de su propia entrada compilada.

## Compilación

```sh
npm ci --ignore-scripts
npm run build:portal
```

`vite.portal.shared.mjs` define una configuración común; las entradas actuales
son `vite.rebost.config.mjs`, `vite.teacher.config.mjs` y
`vite.student.config.mjs`. Pueden compilarse por separado con `build:rebost`,
`build:teacher` y `build:student`.

Los bundles `public/assets/rebost-ui.js`, `teacher-itineraries.js` y
`student-ui.js` se versionan. CI recompila los tres y comprueba que coincidan con los archivos comprometidos.
El Dockerfile del portal sigue copiando archivos estáticos: Node no forma parte
del servicio en ejecución. No hay cambios de volúmenes o de base de datos.

Se reutilizan las versiones fijadas de Vue/Vite y sus licencias MIT de la
[primera fase](rebost-vue.md). La licencia del runtime se distribuye en
`/assets/licenses/vue-MIT.txt`. Los motores Scratch, eXe y H5P conservan sus
propias tecnologías y licencias.

## Verificación

```sh
npm run build:portal
npm test
/tmp/edutictac-assets-venv/bin/python -m pytest tests/test_itineraries.py -q
```

Las pruebas de navegador cubren operaciones de edición, idiomas, creación con
Enter, nombres con apariencia de HTML, borradores, sesiones caducadas, fallos
de carga, conflictos y respuestas tardías de lectura/escritura. Se ejecutan en
escritorio y móvil. Las pruebas Python usan SQLite temporal para permisos y
persistencia; cuando Playwright está disponible, comprueban también el
componente compilado con la API real en castellano y valenciano/táctil.

Las asignaciones, los resultados, Recursos, la creación de aulas, las
credenciales, el selector y la colaboración se describen en las fases siguientes. El alumnado mantiene su acceso
por código y PIN; esta migración no introduce Authentik para estudiantes.

## Resultado de esta fase (21-10-2026)

- Suite completa del portal: 90 pruebas de navegador aprobadas. Tras ajustar
  el ancho de las tarjetas, las 30 pruebas de itinerarios vuelven a pasar.
- API de itinerarios: 15 pruebas aprobadas. Integración Vue/API/SQLite real:
  otros dos casos aprobados, castellano y valenciano con contexto táctil.
  La autorización de estos dos casos es sintética y solo existe en la base
  temporal; no acredita un acceso OIDC con una cuenta personal.
- Captura valenciana revisada: las tarjetas de itinerarios tienen columnas
  propias, separadas de las tarjetas compactas de credenciales.
- Activado únicamente el portal Docker local. Se conserva la imagen anterior
  con la etiqueta `before-itineraries-vue-20261021`. Comprobación posterior:
  componente cargado en el panel docente, creación desactivada para invitados,
  catálogo público de Rebost accesible y proxy de Llibres disponible.

Para probarlo: abrir `/teacher.html`, entrar como docente, seleccionar un grupo
con actividades y desplegar **Itinerarios**. Esta fase conserva los recorridos
existentes y no publica una nueva versión de Commons.


## Aulas y colaboración docente

`GroupSelector.vue` muestra una sola tabla de aulas, selecciona el grupo activo
con `aria-pressed` y permite eliminarlo con la confirmación existente.
`GroupMembersPanel.vue` consulta, añade y retira colaboradores. Ambos reutilizan
el mismo bundle y runtime Vue del panel docente; no se añaden servicios ni
endpoints. Se han retirado sus tablas y manejadores imperativos de `app.js`.

El puente del portal pasa el contexto actual a los tres componentes mediante
`syncTeacherPanels()`. La selección sigue guardándose en la preferencia anterior
de Commons. No se guardan los miembros o el identificador que se está escribiendo
en localStorage. La creación de alumnado y sus PIN se extraen en la fase de credenciales
que se describe a continuación.

Cambiar de grupo o de sesión vacía los miembros y descarta las operaciones
anteriores. Un alta pendiente no borra el borrador del grupo nuevo. Una
eliminación pendiente se aplica al identificador capturado al confirmar; su
respuesta no borra una selección posterior. Cancelar la confirmación no envía
la petición. Tras un error al consultar o cambiar colaboradores se retiran los
datos anteriores y se exige volver a consultarlos antes de continuar.

La API existente permite gestionar miembros y eliminar aulas al propietario
(o administrador autorizado). Conserva su respuesta 404 cuando el grupo no
existe o no está autorizado. La interfaz muestra un aviso traducido, no intenta
inferir la propiedad a partir del nombre y no ofrece retirar filas con rol
`owner`. El servidor conserva la decisión final en cada petición.

Comprobaciones de esta fase:

- 108 pruebas de navegador aprobadas, incluidas 18 de aulas/colaboración en
  escritorio y móvil: operaciones, permisos, cambios de idioma, respuestas
  tardías, confirmación/cancelación, nombres inertes y sesión caducada.
- Tres pruebas de propiedad con SQLite temporal aprobadas: colaboradores sin
  permiso de administración, propietario protegido, validación y eliminación
  limitada al aula capturada.
- Los dos flujos de navegador con API real en castellano y valenciano se
  amplían con alta/retirada de colaboradores y comprobación de la persistencia.
  Captura valenciana revisada.

El commit de la fase anterior es `4850b13`. A petición del usuario, cada fase
comprobada termina con su commit; la publicación mediante push sigue siendo
una acción separada.

Activación local de aulas/colaboración: solo se recrea el portal, con la imagen
anterior conservada como `before-groups-vue-20261021`. Comprobación posterior
anónima: los tres paneles Vue se montan, los botones de escritura permanecen
desactivados, el catálogo público de Rebost se abre y el proxy de Llibres sirve
su interfaz. Los casos con permisos y cambios de datos se prueban únicamente
con las bases temporales, sin crear aulas o miembros en la instalación real.


## Creación de aulas y credenciales

`CredentialsPanel.vue` y `useCredentials.js` controlan la creación de aulas,
el alta de identidades, la regeneración de PIN y la revocación. La entrada
Vue existente monta también este panel; `Teleport` mantiene el formulario de
creación antes del selector y el detalle de credenciales después. Se conservan
los identificadores de controles y los endpoints de la API. No cambia la base
de datos ni el acceso del alumnado por código/PIN.

El portal recibe de `afterClassCreated` solo metadatos de grupo y el número de
identidades. Los PIN no pasan al estado persistido ni a la lista de identidades
del controlador anterior. Se eliminan `pendingBatches`, las plantillas de
tarjetas y los manejadores de credenciales de `app.js`; no hay dos editores.

Los PIN del último lote, o los regenerados en esta vista, se mantienen en un
estado Vue temporal. Cambiar de grupo, cerrar/perder la sesión, desmontar o
navegar los descarta. `pagehide` oculta las tarjetas inmediatamente y borra su
estado incluso si el navegador conserva la página para volver atrás. Las
respuestas antiguas no vuelven a introducir PINs en otra aula. No se usa
localStorage, sessionStorage, IndexedDB ni un servicio externo para guardarlos.

`credentialExports.js` ofrece impresión y CSV únicamente al pulsar sus botones.
La impresión usa nodos de texto, una ventana sin `opener` y una CSP sin scripts;
el CSV escapa celdas y neutraliza prefijos de fórmulas. Estos archivos explícitos
contienen el lote que el docente ha pedido guardar. Las exportaciones habituales
del grupo siguen conteniendo solo códigos, sin recuperar PINs del servidor.

Crear/añadir/rotar/revocar desactiva nuevos envíos mientras espera respuesta. Si
la mutación termina pero falla el refresco de metadatos, se mantienen las tarjetas
recibidas para poder guardarlas y se indica que hay que actualizar el tablero;
no se repite automáticamente la creación. Al rotar o revocar se retira cualquier
PIN anterior del lote. Los permisos continúan comprobándose en el servidor.

Pruebas nuevas: creación con Enter, conservación del grupo al recargar, CSV e
impresión explícitos, altas, rotación, revocación, idioma, respuesta tardía,
fallo de refresco, doble envío y limpieza de la memoria de navegación. Los flujos
con API real y SQLite temporal comprueban también el login de alumnado, la
revocación de su sesión tras rotar el PIN y la imposibilidad de crear aulas
como estudiante. No se usan cuentas o aulas de la instalación real.

Validación de credenciales (21-10-2026): 124 pruebas de navegador aprobadas;
tras la revisión final de textos e impresión, las 16 de credenciales vuelven
a pasar. Cuatro flujos con API real y SQLite temporal aprobados: los dos de
itinerarios/miembros y los dos de credenciales, en castellano y valenciano.
Las capturas se toman solo después de retirar los PIN y se revisa la versión
valenciana. Compilación del portal, sintaxis de `app.js` y comprobación de
espacios correctas; el bundle de Rebost permanece idéntico.

Activado únicamente el portal local con rollback
`before-credentials-vue-20261021`. Comprobación anónima posterior: formulario
Vue cargado, generación/altas desactivadas y sin tarjetas temporales, catálogo
público de Rebost operativo y proxy de Llibres disponible. No se recrean la
API, Authentik o los volúmenes, ni se crean aulas o credenciales en la
instalación real durante estas comprobaciones.


## Asignaciones y resultados

`AssignmentsPanel.vue` presenta el resumen, los enlaces de exportación de
códigos y una única tabla de actividades. `ResultsPanel.vue` y `useResults.js`
consultan resultados, marcan o retiran la realización manual y muestran la
clasificación. Se conservan los endpoints y los permisos existentes; las
plantillas y los manejadores equivalentes se retiran de `app.js`.

El puente añade `summary` y `dataReady`. Solo se puede seleccionar una actividad
obtenida del listado autorizado. Un refresco de metadatos se aplica únicamente
si sigue siendo el vigente y la sesión permanece activa. Un fallo de red no
expulsa al docente; exige recargar antes de operar sobre resultados antiguos.
Cambiar de aula, actividad o sesión invalida las lecturas y escrituras del
contexto anterior, incluidos sus errores 401. Los identificadores se codifican
individualmente en las rutas; no se separan por dos puntos.

Las marcas se serializan y después se consultan los resultados del servidor.
Retirar una marca manual conserva las puntuaciones y la realización automática
por intentos. La clasificación sigue siendo la de la actividad, como define la
API; no se presenta como una clasificación exclusiva del aula.

Pruebas: 140 casos de navegador aprobados en escritorio y móvil, incluidos
16 de resultados: marcas, ceros, idiomas, nombres inertes, errores, selección
rápida y respuestas atrasadas. `tests/test_results_ui.py` añade autorización
con SQLite temporal y flujos Vue/API en castellano y valenciano táctil. Los
casos de integración comprueban persistencia de marcas y conservación de
puntuaciones, sin cuentas o datos de la instalación real.

Regresión conjunta de API/SQLite y navegador real: 25 pruebas aprobadas
(resultados, credenciales, itinerarios y permisos de aulas). No se modifica
el backend ni se añaden dependencias.


## Recursos y cesta del panel docente

`ResourcesPanel.vue` y `useResources.js` extraen búsqueda, favoritos y asignación
del controlador anterior. `resourceAssignment.js` conserva los identificadores
de Play, EduHoot y documentos, y adapta los enlaces localhost para el acceso
local/Tailnet. Rechaza protocolos distintos de HTTP/HTTPS y URL con credenciales.
Los títulos se interpolan como texto. Las tarjetas tienen un ancho propio,
independiente de las credenciales compactas.

El catálogo se consulta sin sesión docente; favoritos y escritura requieren
la sesión existente. Una respuesta 401 del servicio de favoritos muestra la
indicación de acceder a Recursos, sin cerrar la sesión docente de Commons.
Un 401 vigente al crear asignaciones sí desactiva esa sesión. El módulo
Recursos desactivado no permite enviar consultas ni asignaciones desde el panel.

Cada operación captura grupo e identificadores antes de su primer envío.
Los recursos se envían secuencialmente, con nuevos envíos bloqueados hasta
terminar. Cambiar de aula o sesión invalida la respuesta y detiene los envíos
restantes: la petición ya enviada puede guardarse en su aula original, pero
no cambia la selección nueva ni continúa la cesta en ella.

Los recursos confirmados se retiran de la cesta visible. Si falla un envío,
se indica cuántos se confirmaron, se bloquean nuevos envíos y se pide revisar
el tablero y volver a abrir la cesta. No se reintenta automáticamente. La API
existente no ofrece transacciones ni claves de idempotencia: si se pierde una
respuesta no puede garantizarse si ese último recurso llegó a guardarse.
Volver a cargar favoritos recupera la cesta del banco original; no elimina
favoritos ni deduplica asignaciones históricas. Un fallo de refresco posterior
al guardado tiene un aviso distinto para evitar volver a enviar la operación.

Validación: suite completa **164 pruebas de navegador aprobadas**, con 24
casos de Recursos en escritorio/móvil (idiomas, búsqueda con Enter, proveedores,
favoritos, permisos, errores parciales, contexto cambiado, respuestas atrasadas,
HTML inerte, URL peligrosas y guardado con refresco fallido). La regresión de
asignaciones/resultados, credenciales, itinerarios y permisos aportó 25 pruebas
Python aprobadas; Recursos añade otras tres, incluyendo dos flujos Vue/API/SQLite
real en castellano y valenciano táctil. Tras ajustar las tarjetas se repite el
flujo valenciano y se revisa su captura. No hay nuevas dependencias ni cambios
de esquema, autenticación o backend. Rebost se recompila sin diferencias.

Activación local: solo portal, rollback `before-resources-vue-20261021`, sin
recrear API, Authentik, editores ni volúmenes. El commit anterior de
asignaciones/resultados es `50735e8`; esta fase se compromete por separado.
El siguiente bloque del roadmap es el panel del alumnado, conservando código/PIN
sin Authentik. Recursos como aplicación completa sigue siendo una fase aparte.

Comprobación posterior de la instalación local: los siete paneles Vue se montan,
el bundle servido coincide byte a byte con el compilado y las escrituras están
bloqueadas para visitantes. El catálogo público de Rebost se muestra, las
imágenes privadas requieren sesión y el proxy de Llibres responde. Sin errores
JavaScript. Tras el ajuste final de tarjetas pasan de nuevo los 24 casos de
Recursos; no se han usado cuentas reales ni creado aulas en la instalación.


## Panel del alumnado — 22-10-2026

`src/student/StudentPanel.vue` contiene el formulario, perfil, itinerario y
actividades; `useStudent.js` controla sesión, cargas, avatar y lanzamientos;
`launch.js` conserva las rutas directas/proxy y la lista de retornos permitidos.
`app.js` retira su estado, plantillas HTML y manejadores anteriores. El puente
solo monta el panel y actualiza la cabecera de sesión. No hay dos implementaciones.
El bundle `student-ui.js` se carga solo en `/student.html`, mediante la misma
configuración y versiones MIT ya utilizadas. Node sigue fuera de Docker.

Se mantiene el acceso de alumnado por código y PIN, sin Authentik. La sesión se
restaura con `/api/student/dashboard`, que exige la cookie del estudiante; una
cuenta docente en `/api/auth/me` no acredita acceso al panel. El PIN se muestra
como contraseña, se descarta al enviar y no se guarda en localStorage,
sessionStorage, IndexedDB o preferencias. El formulario permite Enter y bloquea
envíos repetidos. Solo los destinos Commons enumerados anteriormente pueden
recibir una redirección tras el acceso; no se admiten retornos externos.

Cerrar sesión retira inmediatamente perfil, actividades, historial y PIN.
Respuestas anteriores, incluidas las de avatar y lanzamiento, no los recuperan.
Un fallo al cerrar sesión permite reintentar y bloquea un nuevo acceso hasta
confirmar el cierre. `pagehide` limpia el estado y oculta el contenido antes de
la instantánea de navegación; `pageshow` desde caché vuelve a consultar la sesión.
Los fallos de carga retiran resultados antiguos y ofrecen reintento; un 401
vigente exige entrar de nuevo. Los mensajes de error se traducen y no imprimen
el detalle interno del servidor.

El progreso mantiene ceros, orden del itinerario y actividades finalizadas en
el historial. Cambiar de idioma traduce la vista sin volver a consultar datos
ni perder el historial abierto. El avatar conserva las 28 opciones y su PATCH.
Hay actualización explícita y al volver al panel mediante foco/visibilidad.
La tabla se desplaza dentro de su contenedor en móvil, sin ensanchar la página.

Play y EduHoot conservan sus endpoints y parámetros de lanzamiento. Para
recursos/documentos se reserva la pestaña durante el clic, antes de esperar
la red, y se anula su `opener`. La página aplica `no-referrer` para
conservar la privacidad del enlace de origen. Una sesión caducada, una URL peligrosa o un error
cierran la pestaña provisional. Se exige obtener el token existente también
para enlaces de recursos: ya no se abre silenciosamente tras fallar esa petición.
Solo HTTP/HTTPS sin credenciales puede abrirse como recurso; se conservan los
enlaces locales/Tailnet. El documento subido continúa pasando por el proxy
protegido de Commons. Las herramientas desactivadas no ofrecen botón de inicio.

Las pruebas nuevas cubren credenciales temporales, doble submit, avatar,
historial, ceros, idiomas, permisos de módulo, errores de sesión/red, lecturas
y lanzamientos tardíos, pestañas bloqueadas, ausencia de `opener`, URL ejecutables,
retornos externos y caché de navegación. Los recorridos con API y SQLite real
usan identidades sintéticas: login con cookie, avatar persistente, orden del
itinerario, puntuación cero, token de lanzamiento, aislamiento entre aulas,
prohibición de gestión docente y revocación de la sesión al rotar el PIN.
No se usan cuentas de la instalación real ni se cambia el backend.


Validación final: **214 pruebas de navegador aprobadas**, incluidas 50 nuevas
del panel del alumnado, en escritorio y móvil. Regresión Python de alumnado,
itinerarios, credenciales, resultados, Recursos y permisos: **30 aprobadas**.
Al incorporarse el commit independiente `e234624` de routers/migraciones de la
API se repiten los dos flujos de alumnado con API real: ambos aprobados.
La captura valenciana con datos sintéticos se revisa tras vaciar el PIN.
Compilación de las tres entradas, sintaxis y comprobación de espacios correctas;
los bundles de Rebost y docente permanecen idénticos.

Activación local del portal con rollback `before-student-vue-20261022`.
Verificación anónima en `/student.html`: bundle y `app.js` servidos coinciden con
los archivos probados, formulario activo, PIN vacío y oculto, sin datos de
alumnado ni errores JavaScript. No se crean cuentas o actividades reales.

Incidencia de entorno detectada durante la verificación complementaria:
el contenedor local `id-api` usa `commons-id-api:0.1.1-alpha32`; sus rutas
`/api/assets/v1/items?collection=mine` y `/api/assets/v1/catalogs` devuelven 404.
El HTML de Rebost y el bundle del proxy de Llibres sí responden 200.
Esta fase solo recrea el portal; queda pendiente recuperar la configuración
local de API compatible con Rebost antes de validar otra vez ese recorrido.


La incidència local de la API antiga queda resolta el 22-10-2026 en connectar
Llibres amb el banc. Recursos API i ID API s'actualitzen preservant els volums
actius i les dades; catàlegs de Rebost i rutes de llibres tornen a respondre.
La [connexió local](LLIBRES_LOCAL_CONNECTION.md) recull còpies, imatges,
comparació de dades i lectura real des de les dos aplicacions.


## Banc de recursos completat — 22-10-2026

La migració del frontend independent `Edutictac/recursos` queda acabada:
catàleg, favorits/valoracions/moderació, accés amb Authentik per a docents i
codi/PIN per a alumnat, propostes i panell administratiu de fonts són Vue.
Es retiren els formularis i constructors DOM equivalents, sense substituir
Flash/JClic, el lector de llibres ni els motors dels editors.

78 proves de navegador en escriptori/mòbil i 3 del service worker aprovades.
El PIN es neteja en enviar/tancar/navegar; les escriptures es bloquegen durant
un canvi de sessió, i les respostes anteriors no afecten el context nou.
Les propostes tenen confirmació persistent i distingixen el guardat del refresc.
Les fonts només es consulten amb permisos administratius i admeten reintent.

Disponible en `http://100.74.151.108:8086/`, imatge frontend
`recursos:bank-vue-complete-candidate`, anterior preservada com a
`before-bank-vue-complete-20261022`. Bundle instal·lat idèntic al compilat;
catàleg, diàlegs i lector/ELPX existents verificats amb dades reals públiques.
Les proves autenticades de regressió usen contractes sintètics; queda
acceptació manual amb comptes autoritzats abans de publicar en producció.

Només s’ha recreat el frontend del banc. Les API, Authentik, portal, Blocs,
Llibres i volums continuen sense canvis. Procediment, proves i límits en
`recursos/docs/VUE_MIGRATION.md`. Punt de parada indicat per l’usuari: no
continuar amb Play/Administració/Quiosc; sense push ni desplegament al VPS.
