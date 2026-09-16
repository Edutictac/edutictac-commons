# API inicial de EduTicTac Play

La API actual es pequeña y no requiere autenticación.

## Salud

```http
GET /api/health
```

## Crear actividad

```http
POST /api/activities
Content-Type: application/json
```

```json
{
  "title": "Animales",
  "question": "¿Cuál vuela?",
  "answers": [
    {"text": "Águila", "correct": true},
    {"text": "Gato", "correct": false}
  ]
}
```

## Consultar y descargar

```http
GET /api/activities/{id}
GET /api/activities/{id}/download
```

La segunda ruta devuelve un paquete `application/zip` con extensión `.h5p`.

Las actividades públicas guardadas también se sirven mediante la URL humana:

```text
/play/{id}
```

La URL anterior `/?activity={id}` se mantiene como compatibilidad, pero los
nuevos enlaces para compartir usarán `/play/{id}`.

## Rutas internas del reproductor

```http
GET /api/activities/{id}/h5p/h5p.json
GET /api/activities/{id}/h5p/content/content.json
GET /h5p-libraries/{library}/{file}
```

## API futura de Commons

Se mantendrán, como mínimo, `GET /api/activities`,
`GET /api/activities/{id}` y `GET /api/activities/{id}/download`, con filtros
por tipo, materia, etapa, idioma, etiquetas y licencia. Deberá añadirse
autorización antes de exponer actividades privadas o de clase.

## Integración futura con `recursos`

Play queda preparado para publicar actividades públicas en el módulo
`recursos`, que podrá convertirse en el propietario del enlace canónico y usar
su visor H5P. El contrato previsto y las decisiones de almacenamiento están
documentados en [`resources-integration.md`](resources-integration.md). No se
activa ninguna llamada remota ni dependencia de `recursos` en el MVP.

## Resultados integrados con Commons

Cuando Play se abre desde una asignación, la URL puede incluir
`assignment_id`. El cliente escucha los eventos de puntuación de H5P y envía
el resultado al proxy local:

```http
POST /api/commons/score
```

El servicio reenvía la sesión del navegador a `POST /api/scores` de Commons
con `app_id=edutictac-play`. Sin `assignment_id`, las actividades públicas y
las previsualizaciones no envían resultados. `result_id` identifica la
declaración xAPI o el intento local de la sesión; Commons lo utiliza para que
un reenvío no cuente como un segundo intento.

Para actividades asignadas, el portal del alumnado solicita un token de corta
duración a Commons. Play lo consume mediante su credencial interna y crea un
contexto temporal de lanzamiento. Los resultados de ese contexto se envían a
`/api/apps/edutictac-play/scores`, sin exponer el token interno al navegador.

## Integración con Commons: itinerarios y resultados

El contrato para ejecutar actividades dentro de asignaciones de Commons está
documentado en [`play-commons-integration.md`](play-commons-integration.md).
Play utilizará el contrato existente de Commons para `assignment_id` y
`POST /api/scores`; no creará una tabla paralela de identidades, grupos ni
calificaciones.
