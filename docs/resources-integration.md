# Integración futura de EduTicTac Play con `recursos`

## Objetivo

Las actividades H5P creadas en Play deberán poder incorporarse posteriormente
al módulo `recursos`, que ya dispone de su propio visor H5P. Esta integración no
forma parte del MVP inmediato: primero se estabilizan los tipos de actividad,
la exportación y la importación en Moodle.

## Estado comprobado

Recursos existe actualmente y ya puede desplegarse dentro del entorno Docker
local de Commons mediante el perfil opcional `recursos`. La instalación
pública sigue separada en:

- `Edutictac/recursos`: frontend estático/PWA y catálogo;
- `Edutictac/recursos-api`: API FastAPI + SQLite, publicada bajo
  `https://recursos.edutictac.es/api/`.

En el stack local se levantan los contenedores `recursos` y `recursos-api` con
`make up-recursos`; no se activan por defecto para que Play siga funcionando
sin Recursos. La instalación de producción continúa usando el servicio
`recursos-api.service` separado. Por tanto, Play no depende de Recursos para
funcionar en una instalación local o de intranet.

La API actual de Recursos expone el índice federado (`GET /api/resources`),
favoritos, valoraciones, propuestas y autenticación. El repositorio
`recursos-api` ya incorpora el endpoint de ingesta autenticada para Play y está
probado en el perfil Docker local; todavía no se ha activado en producción.

## Flujo implementado en local

```text
Play crea y guarda la actividad
        |
        | publicación o exportación autorizada
        v
recursos almacena/indexa el recurso público
        |
        +--> visor H5P propio de recursos
        |
        +--> enlace canónico para compartir
```

Play conserva el borrador y el modelo simplificado. La publicación desde Play
envía los metadatos al API de Recursos, guarda la respuesta —incluido
`resource_id` y `status`— en la actividad y permite retirarla posteriormente.
Mientras no se configure un visor canónico de Recursos, `/play/{id}` sigue
siendo el enlace autónomo.

El caso EduHoot funciona al revés: `recursos-api` ejecuta una sincronización
pull del endpoint público `GET /api/public-quizzes` de EduHoot, normaliza los
quizzes y los indexa como proveedor `eduhoot`. No es un contrato reutilizable
para publicar Play, porque no permite enviar un H5P ni registrar su
`resource_id`.

## Decisiones preparadas

- El identificador de actividad será estable y podrá asociarse a un
  `resource_id` externo.
- La exportación `.h5p` seguirá disponible aunque `recursos` no esté instalado.
- La API futura debe poder enviar el paquete H5P y sus metadatos: título,
  descripción, tipo, idioma, etapa, materia, etiquetas, licencia, autor
  pseudónimo y estado de publicación.
- El enlace público deberá admitir una política configurable: visor local de
  Play, visor de `recursos` o redirección a la URL canónica de `recursos`.
- Las actividades privadas o de clase nunca se enviarán a `recursos` como
  públicas; se comprobarán permisos antes de la sincronización.
- La integración no duplicará innecesariamente el archivo: se estudiará si
  `recursos` recibe el `.h5p`, una URL de descarga firmada temporalmente o una
  referencia a almacenamiento compartido.

## Contrato v1 implementado (producción pendiente)

El adaptador local `services/play/recursos.py` construye y valida el payload
que consume el endpoint implementado en `Edutictac/recursos-api`. El endpoint
está versionado y probado, pero no se habilitará hasta desplegar el servicio y
configurar su token de servicio.

Play ya conserva estos campos opcionales en cada actividad guardada:
`description`, `subject`, `educational_stage`, `tags`, `license` y
`author_pseudonym`. Se validan en el servidor, se limitan en tamaño y no se
interpretan como HTML.

La publicación se solicitará sobre la API de Recursos y será idempotente:

```http
POST /api/integrations/recursos/activities/{id}/publish
GET  /api/integrations/recursos/activities/{id}
POST /api/integrations/recursos/activities/{id}/unpublish
```

El cuerpo de publicación tendrá esta forma estable:

```json
{
  "contract_version": "1",
  "external_id": "edutictac-play:Ab12Cd34",
  "version": "sha256-corto",
  "idempotency_key": "edutictac-play:Ab12Cd34:sha256-corto",
  "metadata": {
    "title": "Animales",
    "description": "",
    "type": "multiple-choice",
    "language": "es",
    "subject": "",
    "educational_stage": "",
    "tags": [],
    "license": "CC BY-SA",
    "author_pseudonym": ""
  },
  "visibility": "public",
  "canonical_url": "https://play.example/play/Ab12Cd34",
  "download_url": "https://play.example/play/api/activities/Ab12Cd34/download",
  "package": {"format": "h5p", "delivery": "download_url"}
}
```

Recursos responde con `resource_id`, `canonical_url`,
`status` (`published`, `updated`, `unpublished` o `error`) y la versión
aceptada. Las publicaciones repetidas con la misma `idempotency_key` no deben
crear recursos duplicados.

Play solo permitirá publicar actividades `public`; las actividades `private`
o `class` seguirán bajo el control de Commons. Recursos será catálogo y visor,
no autoridad de identidad, asignaciones ni resultados.

La URL base de `recursos` será configurable y no se incorporará como requisito
duro del contenedor Play. La autenticación usa una credencial Bearer de
servicio (`PLAY_INGEST_TOKEN`), nunca contraseñas almacenadas por Play. El
endpoint valida HTTPS, lista de hosts permitidos y rechaza actividades no
públicas.

## Prioridad

Prioridad posterior al MVP de Play y a la integración con Authentik/Commons.
Antes de activarla en un centro se probarán publicación, actualización,
retirada, permisos, enlaces canónicos y restauración desde backup.
