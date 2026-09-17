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
  multiple-choice/   # Fase 1 (implementado)
  true-false/        # Fase 2 (implementado)
  memory/            # Fase 2 (implementado)
  matching/          # Fase 2 (implementado)
  classify/          # Fase 2 (implementado)
  ordering/          # Fase 2 (implementado)
  fill-blanks/       # Fase 2 (implementado)
  find-words/        # Fase 3 (implementado)
  compound/          # Actividad compuesta H5P.QuestionSet (Modo Reto)
```

Cada módulo define formulario, validación, transformación a `content.json`,
preview y metadatos. El exportador común solo recibe el documento validado y
las dependencias runtime fijadas por el adaptador. Para agrupar varias
actividades en un único paquete H5P evaluable, ver [`composite-activities.md`](composite-activities.md).
El editor del Modo Reto también puede buscar actividades guardadas compatibles
en el banco y añadirlas como copias independientes, conservando `sourceActivityId`
para futuras relaciones con Commons y sus resultados.

## Integración futura

- OIDC/Authentik se añadirá delante de la API sin introducir contraseñas
  propias.
- `private`, `class` y `public` serán estados de visibilidad del documento.
- Las URLs públicas y `/api/activities` se mantendrán como contrato para
  `recursos.edutictac.es`.
- Los borradores anónimos permanecerán en localStorage hasta que el usuario
  decida guardarlos en el servidor.
