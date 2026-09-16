# EduTicTac Play — arquitectura inicial

## Alcance de Fase 1

`play` es un servicio independiente dentro del Compose de Commons. El
prototipo usa Python estándar para una API pequeña y una interfaz web sin
framework; así se mantiene fácil de instalar en centros y compatible con
Docker/Podman.

```text
Navegador
  ├─ formulario propio + localStorage temporal
  ├─ h5p-standalone (reproducción)
  └─ API Play
       ├─ actividad JSON local (prototipo)
       ├─ adaptador Multiple Choice
       └─ exportador ZIP .h5p
```

La persistencia local es deliberadamente sustituible: en la siguiente fase el
repositorio de actividades podrá pasar a PostgreSQL sin cambiar el contrato de
los adaptadores H5P.

## Módulos previstos

```text
activity-types/
  multiple-choice/   # Fase 1
  true-false/        # Fase 2
  memory/            # Fase 2
  matching/          # Fase 2
  fill-blanks/       # Fase 2
```

Cada módulo definirá formulario, validación, transformación a `content.json`,
preview y metadatos. El exportador común solo recibe el documento validado y
las dependencias runtime fijadas por el adaptador.

## Integración futura

- OIDC/Authentik se añadirá delante de la API sin introducir contraseñas
  propias.
- `private`, `class` y `public` serán estados de visibilidad del documento.
- Las URLs públicas y `/api/activities` se mantendrán como contrato para
  `recursos.edutictac.es`.
- Los borradores anónimos permanecerán en localStorage hasta que el usuario
  decida guardarlos en el servidor.
