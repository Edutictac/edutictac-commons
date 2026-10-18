# API inicial de EduTicTac Play

La API de lectura y creación no requiere autenticación. El borrado sí exige un
token de administración.

## Salud

```http
GET /api/health
```

## Configuración pública

```http
GET /api/config
```

Devuelve `{"demo": false, "commonsUrl": null}`. Si el servidor se arranca con
`PLAY_DEMO_COMMONS_URL`, devuelve `demo: true` y esa URL; la portada muestra
entonces un aviso de demo pública con un enlace a EduTicTac Commons. Las
instalaciones de Commons no deben definirla.

Las actividades anónimas caducadas (`expiresAt`, según
`PLAY_ANONYMOUS_TTL_SECONDS`) se borran del disco cada
`PLAY_PURGE_INTERVAL_SECONDS` (3600 por defecto; `0` lo desactiva).

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

## Listar actividades (paginado)

```http
GET /api/activities?limit=20&offset=0&type=&language=&subject=&educational_stage=&license=&tag=&q=
```

## Catálogo controlado

```http
GET /api/catalog
POST /api/catalog
Authorization: Bearer <EDUTICTAC_PLAY_ADMIN_TOKEN>
```

`GET /api/catalog` devuelve los valores cerrados disponibles para `subjects`,
`educational_stages`, `levels` y `tags`. El formulario de Play usa estos valores
para que el alumnado no introduzca metadatos libres. `POST /api/catalog` permite
actualizar el catálogo durante esta fase mediante el token de administración;
la futura integración con Authentik sustituirá este permiso por el rol de
profesorado/administración del espacio educativo. La respuesta incluye también
`labels`, un mapa de identificador a textos `es`, `ca` y `en`; los identificadores
se mantienen estables aunque cambie el texto mostrado.

La validación controlada se activa con `PLAY_CONTROLLED_CATALOG=1` (valor por
defecto). Los campos vacíos siguen siendo válidos para conservar compatibilidad
con actividades antiguas; los valores no incluidos en el catálogo se rechazan.

Devuelve las actividades guardadas de más reciente a más antigua:

```json
{
  "items": [
    {
      "id": "Ab12Cd34",
      "type": "multiple-choice",
      "title": "Animales",
      "question": "¿Cuál vuela?",
      "language": "es",
      "createdAt": "2026-09-16T20:50:56+00:00",
      "description": "",
      "subject": "",
      "educational_stage": "",
      "educational_level": "",
      "license": "CC BY-SA",
      "author_pseudonym": "",
      "tags": []
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0,
  "hasMore": false
}
```

- `limit` se acota a 1–100 (por defecto 20); `offset` por defecto 0.
- Filtros opcionales (coincidencia exacta, salvo `q`): `type`, `language`,
  `subject`, `educational_stage`, `license`, `tag`. `q` busca en título,
  pregunta y descripción.

## Borrar actividad

```http
DELETE /api/activities/{id}
X-Admin-Token: <EDUTICTAC_PLAY_ADMIN_TOKEN>
```

- Requiere el token de administración (`X-Admin-Token`, o `Authorization:
  Bearer`). Se compara en tiempo constante.
- Si `EDUTICTAC_PLAY_ADMIN_TOKEN` no está configurado, el borrado queda
  **deshabilitado** (responde `403`).
- Respuestas: `200 {"deleted": "<id>"}`, `403` sin autorización, `404` si no
  existe.

## Rutas internas del reproductor

```http
GET /api/activities/{id}/h5p/h5p.json
GET /api/activities/{id}/h5p/content/content.json
GET /h5p-libraries/{library}/{file}
```

## API de Commons

Están disponibles `GET /api/activities` (paginado y con filtros),
`GET /api/activities/{id}` y `GET /api/activities/{id}/download`. Deberá
añadirse el adaptador OIDC de Commons para producir la identidad confiable. Las
peticiones anónimas solo reciben actividades `public`; una identidad confiable
puede recibir además sus propias actividades `private`. El estado `class` queda
reservado para la futura autorización por grupos. El borrado continúa exigiendo
el token de administración.

La identidad no se acepta desde el JSON de creación. En despliegues integrados,
un proxy OIDC puede establecer la cabecera configurada en
`PLAY_TRUSTED_IDENTITY_HEADER`; ese proxy debe eliminar cualquier cabecera del
cliente antes de añadir la identidad validada. El propietario se guarda en
`owner_id` y no se incluye en los resúmenes públicos.

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
