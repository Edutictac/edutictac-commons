# Itinerarios Commons

Commons utiliza las asignaciones existentes como pasos de un itinerario. No se
duplica la actividad de Play, EduHoot o Recursos: el itinerario solo guarda la
relación y la posición.

## API inicial

Con sesión docente OIDC o token local:

```http
POST /api/teacher/itineraries
GET  /api/teacher/itineraries?group_id={group_id}
POST /api/teacher/itineraries/{itinerary_id}/items
PUT  /api/teacher/itineraries/{itinerary_id}/items
PUT  /api/teacher/groups/{group_id}/itinerary
```

Crear un itinerario:

```json
{
  "title": "Repaso de ciencias",
  "group_id": "..."
}
```

Añadir o reordenar una asignación:

```json
{
  "assignment_id": "...",
  "position": 10
}
```

La misma asignación puede actualizar su posición con otra petición. Solo se
aceptan asignaciones activas del mismo grupo que el itinerario. El servidor
comprueba que el docente es propietario o miembro del grupo.

## Edición del orden y retirada de pasos

El panel docente permite subir, bajar y quitar pasos del itinerario con botones
accesibles, también en móvil y en CA/VA/ES/EN. Los cambios se guardan al pulsar.
Quitar un paso **no elimina la asignación ni sus resultados**: el alumnado
continúa viendo esa actividad después de los pasos ordenados del itinerario.
Para volver a incorporarla, selecciona la actividad asignada y añádela de nuevo.

La sustitución del orden se realiza en una sola transacción:

```http
PUT /api/teacher/itineraries/{itinerary_id}/items
Content-Type: application/json

{
  "assignment_ids": ["asignacion-c", "asignacion-a"],
  "expected_assignment_ids": ["asignacion-a", "asignacion-b", "asignacion-c"]
}
```

`expected_assignment_ids` es la lista ordenada que el docente estaba viendo.
Si otro docente ha cambiado los pasos, devuelve `409` sin modificar nada; el
panel recarga la lista y avisa. Solo se admiten asignaciones activas del mismo
grupo, sin duplicados. Una lista vacía permite vaciar el itinerario conservando
las asignaciones. La autorización se comprueba en cada petición, incluidos los
docentes colaboradores; una retirada de permisos impide nuevas ediciones.
Esto también se aplica al docente que creó el itinerario si pierde acceso al
grupo. Desde el panel, añadir una asignación usa igualmente esta sustitución
atómica para detectar cambios simultáneos; el endpoint `POST` inicial se
conserva como compatibilidad.

Las respuestas tardías de otro grupo se descartan. Si no se puede recargar
después de un error, los controles quedan bloqueados hasta pulsar
**Actualizar itinerarios** y recuperar datos actuales.

## Alumnado

`GET /api/student/dashboard` mantiene el campo `assignments` para no romper
las aplicaciones existentes y añade `selected_itinerary` (`{id, title}` o
`null`). El panel muestra su título en CA/VA/ES/EN. Los pasos del itinerario
seleccionado aparecen primero, ordenados por `position`; las demás asignaciones
del grupo siguen visibles después, ordenadas por fecha. Los recorridos que no
están seleccionados no intervienen en ese orden.

El progreso y las puntuaciones siguen asociados a `assignment_id`, por lo que
el tablero docente puede consultar resultados sin cambios y una actividad no
se copia al moverla de posición.

## Itinerario activo del grupo

El docente puede preparar varios itinerarios y pulsar **Usar con el alumnado**
en uno de ellos. Solo uno por grupo puede estar seleccionado. La marca
**Activo para el alumnado** indica el actual; **Dejar sin itinerario activo**
retira la selección conservando todas las actividades y sus resultados.
El progreso mostrado continúa contando todas las asignaciones del grupo.

```http
PUT /api/teacher/groups/{group_id}/itinerary
Content-Type: application/json

{
  "itinerary_id": "recorrido-nuevo",
  "expected_itinerary_id": "recorrido-anterior"
}
```

Ambos campos son obligatorios y admiten `null`. Para retirar la selección,
`itinerary_id` debe ser `null`; `expected_itinerary_id` refleja la selección
que el docente estaba viendo. Una selección modificada por otro docente
devuelve `409` sin sobrescribirla. La API comprueba acceso al grupo y que el
recorrido elegido esté activo y pertenezca a ese grupo. El listado docente
incluye `is_selected` en cada itinerario.

La selección se guarda en SQLite, en `group_itinerary_selection`, cubierta por
los backups existentes. La primera creación en un grupo nuevo se selecciona
automáticamente. Crear otro recorrido no cambia la selección, tampoco cuando
el docente ha elegido expresamente dejarla vacía.

Al actualizar una base anterior, se selecciona por grupo el itinerario activo
con `updated_at` más reciente (desempate por `created_at` e ID). No se eliminan
recorridos ni asignaciones. Esta migración es idempotente: los reinicios
posteriores respetan la selección guardada, incluido `null`. El indicador
`active` de un itinerario sigue significando que está disponible; no debe
confundirse con `is_selected`, que indica su uso actual con el alumnado.

## Estado de la interfaz

El panel docente ya permite consultar los favoritos de Recursos en la cesta y asignarlos al grupo
con una sola acción. Las asignaciones de Recursos, EduHoot y Play conservan su
identificador original y pueden añadirse al itinerario.

## Comprobación aislada

Con las dependencias de `services/id-api/requirements.txt` y `pytest`:

```bash
python -m pytest tests/test_itineraries.py -q
npx playwright test tests/browser/teacher-itineraries.spec.js
```

Las pruebas de API usan una base SQLite temporal; las de navegador simulan las
respuestas de la API y cubren escritorio y móvil. No modifican el stack activo.
