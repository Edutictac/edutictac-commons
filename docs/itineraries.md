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

## Alumnado

`GET /api/student/dashboard` mantiene el campo `assignments` para no romper
las aplicaciones existentes. Los pasos incluidos en un itinerario aparecen
primero, ordenados por `position`; las asignaciones del grupo que todavía no
están en un itinerario continúan visibles después, ordenadas por fecha.

El progreso y las puntuaciones siguen asociados a `assignment_id`, por lo que
el tablero docente puede consultar resultados sin cambios y una actividad no
se copia al moverla de posición.

## Estado de la interfaz

El panel docente ya permite reunir recursos en la cesta y asignarlos al grupo
con una sola acción. Las asignaciones de Recursos, EduHoot y Play conservan su
identificador original y pueden añadirse al itinerario.

## Próximos pasos

- editor visual más completo de itinerarios en el panel docente;
- permitir varios itinerarios por grupo y selección del itinerario activo;
- mostrar el título del itinerario en el dashboard del alumnado.
