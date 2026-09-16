# Integración de EduTicTac Play con Commons

## Objetivo

EduTicTac Play debe funcionar de forma autónoma para crear y jugar actividades
sin identidad, pero cuando se utilice desde EduTicTac Commons debe integrarse
con sus identidades pseudónimas, grupos, itinerarios, asignaciones, resultados
y tablero docente.

La integración no debe crear un sistema paralelo de usuarios, grupos ni
calificaciones.

## Dos modos de funcionamiento

### Modo local sin identidad

El alumnado puede crear, editar, previsualizar, jugar y exportar actividades
sin registrarse.

- El borrador se conserva en el navegador, preferiblemente mediante IndexedDB.
- La actividad puede exportarse como `.h5p` para evitar pérdida de trabajo.
- No se envían resultados al servidor porque no existe una identidad ni una
  asignación de Commons.
- Una actividad pública puede jugarse mediante URL sin iniciar sesión.

Este modo no promete sincronización ni recuperación tras borrar los datos del
navegador.

### Modo integrado con Commons

Cuando la actividad forma parte de un itinerario o asignación de Commons:

- Commons proporciona la identidad pseudónima del alumnado.
- Commons proporciona el `assignment_id` y el grupo autorizado.
- Play sirve la actividad H5P.
- El reproductor comunica el resultado de la actividad.
- Commons guarda el progreso y lo muestra en el tablero docente.

La identidad pseudónima actual de Commons es código público + PIN. En el
futuro podrá complementarse con Authentik/OIDC para profesorado y
administración, sin introducir contraseñas propias en Play.

## Flujo de resultados

```text
Profesor crea un itinerario
        |
        v
Commons crea una asignación
        |
        v
Alumno abre la actividad con assignment_id
        |
        v
Play ejecuta H5P
        |
        v
H5P emite resultado xAPI
        |
        v
Commons recibe POST /api/scores
        |
        v
Tablero docente muestra intentos y mejor puntuación
```

Una actividad pública jugada fuera de una asignación no genera resultados en
el tablero docente.

## Identificadores y contrato

Play utilizará los identificadores de Commons sin reinterpretarlos:

| Campo | Uso |
| --- | --- |
| `app_id` | `edutictac-play` |
| `activity_id` | Identificador estable de la actividad Play |
| `assignment_id` | Asignación creada por Commons |
| `group_id` | Grupo de Commons al que pertenece la asignación |
| identidad | Identidad pseudónima de la sesión de alumnado |
| `score` | Puntuación normalizada de 0 a 100 |

La petición de resultado seguirá el contrato existente de Commons:

```http
POST /api/scores
Content-Type: application/json
```

```json
{
  "app_id": "edutictac-play",
  "activity_id": "a8F3kP",
  "assignment_id": "asignacion-commons",
  "score": 80,
  "metadata": {
    "source": "h5p-xapi",
    "raw_score": 4,
    "max_score": 5,
    "verb": "completed",
    "attempt": 1
  }
}
```

Commons debe validar que la asignación existe, que corresponde a Play y que
pertenece al grupo de la identidad autenticada.

## URL de lanzamiento

Durante la integración, Commons podrá abrir una actividad con:

```text
/play/{activity_id}?assignment_id={assignment_id}
```

El `assignment_id` no concede permisos por sí mismo. La autorización se hace
en Commons al registrar el resultado y, cuando sea necesario, mediante un
token de lanzamiento de corta duración.

El modo público seguirá utilizando únicamente:

```text
/play/{activity_id}
```

## Captura H5P

Play debe escuchar los eventos xAPI del reproductor H5P y registrar como
máximo un resultado por finalización válida. Debe conservar en `metadata` la
puntuación original y el máximo para permitir auditoría y futuras mejoras.

No se enviará contenido textual innecesario ni datos personales. Si la red no
está disponible, el cliente podrá guardar temporalmente el resultado pendiente
cuando exista una sesión válida, pero nunca debe inventar una identidad local.

## Relación con `recursos`

`recursos` será catálogo y visor, no sistema de identidad ni de calificaciones:

```text
Play crea la actividad
        |
        v
recursos indexa metadatos y H5P
        |
        v
Commons añade el recurso a un itinerario
        |
        v
Play o el visor de recursos comunica resultados a Commons
```

Una actividad podrá asociarse posteriormente a un `resource_id` de `recursos`.
El enlace canónico podrá apuntar a Play o a `recursos`, pero el progreso y los
resultados continuarán perteneciendo a Commons.

Las actividades privadas o de clase no se publicarán automáticamente en el
catálogo público.

## Plan de implementación

1. Definir el adaptador `CommonsActivityProvider` en Play.
2. [x] Añadir `assignment_id` a la URL y al estado de reproducción.
3. [x] Capturar eventos xAPI de Multiple Choice, True/False, Memory y Matching.
4. [x] Enviar resultados al contrato `POST /api/scores`.
5. [x] Añadir una prueba automática de extremo a extremo:
   identidad → asignación → juego → resultado → tablero docente.
6. [x] Añadir idempotencia mediante `result_id`, incluido el reenvío repetido
   del mismo resultado sin contar un intento adicional.
7. [x] Utilizar tokens de lanzamiento de Commons para validar la actividad y
   la identidad sin depender de una cookie del navegador.
8. [x] Añadir reintento local de resultados pendientes cuando se pierda la
   conexión, limitado a contextos autenticados de Commons.
9. [x] Integrar el catálogo y visor de `recursos` en el perfil Docker local,
   con publicación autenticada desde Play.
10. [x] Añadir asociación, actualización y retirada mediante `resource_id`;
    el estado queda guardado en la actividad Play y Recursos conserva el índice.
    El despliegue de producción y el visor H5P canónico siguen pendientes.

La prueba del punto 5 se ejecuta con `make test-play-commons`. Crea una
actividad y una asignación temporales, autentica una identidad pseudónima,
envía una puntuación a través de Play y comprueba el resultado desde Commons;
al terminar elimina los datos de prueba. Además, `npm run test:play` contiene
una prueba de navegador que responde realmente al Quiz H5P en escritorio y
móvil y verifica la petición xAPI a Commons.

## Criterios de aceptación

- Una actividad sin identidad sigue funcionando y exportándose offline.
- Una actividad pública no crea resultados asociados a ningún alumno.
- Una actividad asignada aparece en el itinerario del alumno.
- Al completar H5P, el resultado aparece en Commons con el código pseudónimo.
- El profesor ve intentos, mejor puntuación y última fecha desde su tablero.
- Una asignación de otro grupo no puede aceptar resultados.
- Reenviar el mismo `result_id` no crea un segundo intento.
- Un token de lanzamiento caducado o de otra aplicación no permite jugar ni
  registrar resultados.
- Una caída temporal de red conserva y reintenta el resultado autenticado;
  las actividades públicas no crean cola de resultados.
- La integración con `recursos` no duplica identidades ni calificaciones.
