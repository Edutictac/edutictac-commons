# Integración futura de EduTicTac Play con `recursos`

## Objetivo

Las actividades H5P creadas en Play deberán poder incorporarse posteriormente
al módulo `recursos`, que ya dispone de su propio visor H5P. Esta integración no
forma parte del MVP inmediato: primero se estabilizan los tipos de actividad,
la exportación y la importación en Moodle.

## Flujo previsto

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

Play conservará el borrador y el modelo simplificado. Cuando una actividad se
publique en `recursos`, el repositorio de recursos será la referencia pública y
el visor de `recursos` podrá ser el destino principal del enlace. Mientras esa
integración no exista, `/play/{id}` seguirá siendo el enlace autónomo.

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

## API de integración pendiente

Se preparará un contrato específico, preferiblemente versionado, sobre la API
de Play/Commons. Como mínimo deberá contemplar:

```http
POST /api/integrations/recursos/activities/{id}/publish
GET  /api/integrations/recursos/activities/{id}
POST /api/integrations/recursos/activities/{id}/unpublish
```

La URL base de `recursos` será configurable y no se incorporará como requisito
duro del contenedor Play. La autenticación futura utilizará una credencial de
servicio u OIDC, nunca contraseñas almacenadas por Play.

## Prioridad

Prioridad posterior al MVP de Play y a la integración con Authentik/Commons.
Antes de activarla en un centro se probarán publicación, actualización,
retirada, permisos, enlaces canónicos y restauración desde backup.
