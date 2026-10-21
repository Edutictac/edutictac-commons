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
del portal continúa inicializándose. La adopción de Vue no obliga a cargarlo
en la portada o en el panel del alumnado.

## Compilación

```sh
npm ci --ignore-scripts
npm run build:portal
```

`vite.portal.shared.mjs` define una configuración común; las entradas actuales
son `vite.rebost.config.mjs` y `vite.teacher.config.mjs`. También pueden
compilarse por separado con `build:rebost` y `build:teacher`.

Los bundles `public/assets/rebost-ui.js` y `teacher-itineraries.js` se versionan.
CI recompila ambos y comprueba que coincidan con los archivos comprometidos.
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

Quedan para fases posteriores la creación de aulas, las credenciales, las
asignaciones y los resultados del panel docente. El selector y la colaboración
se han extraído en la fase descrita a continuación. El alumnado mantiene su acceso
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
en localStorage. La creación de alumnado y sus PIN continúan en el controlador
anterior hasta la siguiente fase.

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
