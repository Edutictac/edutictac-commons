# Actividades compuestas: Modo Reto y Batería de actividades

## 1. Justificación y objetivos

Actualmente, EduTicTac Play genera actividades atómicas independientes (un único
Quiz, un Verdadero/Falso, un Clasificar, etc.). Aunque esto resulta idóneo para
ejercicios de 1–2 minutos, en el aula real surge con frecuencia la necesidad de
**agrupar varias actividades bajo un mismo tema**:

1. **Un solo paquete descargable para Aules/Moodle:** El profesorado o el
   alumnado descarga un único archivo `.h5p` (p. ej. `Reto-Revolucion-Industrial.h5p`)
   en lugar de tener que importar y configurar 5 actividades sueltas en el aula virtual.
2. **Evaluación integrada en Commons:** El alumnado recorre una secuencia de 3 a
   5 actividades y al finalizar se emite **una única calificación ponderada**
   (0–100%) enviada a `/api/commons/score`.
3. **Gamificación en el aula:** Permite que los alumnos creen "Retos" o "Gincanas"
   para desafiar a sus compañeros de equipo.

---

## 2. Contenedores oficiales de H5P

H5P dispone de dos librerías oficiales de agregación con licencias libres (MIT):

| Contenedor | Modelo visual | Casos de uso ideales | Actividades compatibles |
|---|---|---|---|
| **`H5P.QuestionSet 1.20`** *(Prioritario)* | **Paso a paso (Paginado)** con barra de progreso superior, navegación anterior/siguiente y pantalla final de resultados con desglose de aciertos. | Retos, gincanas de aula, cuestionarios combinados, autoevaluación guiada. | Multiple Choice, True/False, Fill in the Blanks, Drag & Drop (Matching, Clasificar, Ordenar), Mark the Words. |
| **`H5P.Column 1.16`** | **Scroll vertical (Muro)** en una única página. | Cuadernos interactivos, fichas de trabajo continuas, mezcla de texto/imagen con juegos. | Todas las anteriores más Memory y Sopa de letras. |

Para mantener el principio rector de sencillez e inmediatez en Play, el contenedor
principal seleccionado es **`H5P.QuestionSet` (Modo Reto)**.

---

## 3. Experiencia de autoría para el alumnado (UX)

Para no romper el principio de *"creable en 2–5 minutos sin curva de aprendizaje"*,
no se introducirán árboles complejos ni configuraciones técnicas avanzadas:

1. **Selector de pasos superior:**
   ```text
   ┌────────────────────────────────────────────────────────┐
   │ [1. Quiz]  [2. Verdadero/Falso]  [3. Huecos]  [+ Añadir]│
   └────────────────────────────────────────────────────────┘
   ```
2. **Formularios reutilizados:** Cada paso muestra exactamente el mismo formulario
   breve ya existente para ese tipo de actividad (sin campos nuevos).
3. **Metadatos globales del Reto:**
   - Título del Reto (ej. *«Descubrimiento de América»*).
   - Porcentaje mínimo de superación (por defecto 50% o 60%).
   - Orden aleatorio de las preguntas (opcional, desactivado por defecto).
4. **Acciones por paso:** Reordenar (mover antes/después) y eliminar paso.

---

## 4. Estructura de datos en Play

El modelo JSON interno de una actividad compuesta en Play mantiene la misma
coherencia que los tipos individuales:

```json
{
  "type": "compound",
  "format": "question-set",
  "title": "Reto del Clima y la Atmósfera",
  "language": "ca",
  "passPercentage": 60,
  "activities": [
    {
      "type": "multiple-choice",
      "question": "¿En qué capa ocurre el clima?",
      "answers": [
        {"text": "Troposfera", "correct": true},
        {"text": "Estratosfera", "correct": false}
      ]
    },
    {
      "type": "true-false",
      "question": "El ozono nos protege de la radiación ultravioleta.",
      "correct": true
    },
    {
      "type": "blanks",
      "text": "La atmósfera está compuesta mayoritariamente por *nitrógeno* y *oxígeno*."
    }
  ]
}
```

Cada elemento dentro de `activities` pasa exactamente por el mismo validador y
transformador `activity_content()` que ya existe en `server.py`, garantizando
cero duplicación de código.

---

## 5. Empaquetado H5P (`package_files`)

Cuando la actividad es de tipo `compound`:

1. **`h5p.json`:**
   ```json
   {
     "title": "Reto del Clima y la Atmósfera",
     "language": "ca",
     "mainLibrary": "H5P.QuestionSet",
     "embedTypes": ["div"],
     "preloadedDependencies": [
       {"machineName": "H5P.QuestionSet", "majorVersion": 1, "minorVersion": 20},
       {"machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 16},
       {"machineName": "H5P.TrueFalse", "majorVersion": 1, "minorVersion": 8},
       {"machineName": "H5P.Blanks", "majorVersion": 1, "minorVersion": 14},
       {"machineName": "H5P.JoubelUI", "majorVersion": 1, "minorVersion": 3},
       {"machineName": "H5P.Question", "majorVersion": 1, "minorVersion": 5},
       {"machineName": "FontAwesome", "majorVersion": 4, "minorVersion": 5}
     ]
   }
   ```
   *Nota: La lista de dependencias se calcula dinámicamente mediante la unión
   deduplicada de las dependencias de todas las actividades hijas incluidas.*

2. **`content/content.json`:**
   ```json
   {
     "introPage": {
       "showIntroPage": false
     },
     "progressType": "dots",
     "passPercentage": 60,
     "questions": [
       {
         "library": "H5P.MultiChoice 1.16",
         "params": { ... resultado de activity_content(act1) ... },
         "subContentId": "6a8d3e21-..."
       },
       {
         "library": "H5P.TrueFalse 1.8",
         "params": { ... resultado de activity_content(act2) ... },
         "subContentId": "9b1c7f42-..."
       }
     ],
     "endScreen": {
       "showResultPage": true,
       "showSolutionButton": true,
       "showRetryButton": true
     },
     "texts": {
       "prevButton": "Anterior",
       "nextButton": "Siguiente",
       "finishButton": "Finalizar",
       "textualProgress": "Pregunta @current de @total",
       "resultPageHeader": "Resultados del reto",
       "scoreBarLabel": "Has conseguido @score de @total puntos"
     }
   }
   ```

---

## 6. Integración con Commons y calificaciones (xAPI)

`H5P.QuestionSet` emite eventos xAPI agregados (`completed`, `passed` o `failed`)
al llegar a la pantalla final, conteniendo la suma de puntos conseguidos y el total
posible (`result.score.raw` y `result.score.max`).

Dado que la función `reportResult()` en `services/play/public/app.js` ya está
escuchando los eventos globales del dispatcher:
```javascript
window.H5P.externalDispatcher.on('xAPI', (event) => {
  reportResult(event.data?.statement);
});
```
El envío de la nota agregada a `/api/commons/score` y al libro de calificaciones de
Commons o Moodle funciona **de forma 100% nativa y transparente**, sin necesidad de
modificar el bus de eventos del cliente.

---

## 7. Fases de implementación técnica

1. **Fase 1 — Dependencias locales:** Incorporar la librería `H5P.QuestionSet-1.20`
   y sus ficheros de idioma en `services/play/h5p-libraries/`.
2. **Fase 2 — Backend (`server.py`):**
   - Adaptador `type == "compound"` en `validate_activity()` (mínimo 2, máximo 10
     actividades hijas válidas).
   - Ensamblador de `questions` en `activity_content()`.
   - Generación de `subContentId` (UUIDv4) para cada subcontenido.
   - Cálculo de la unión de `preloadedDependencies` en `package_files()`.
3. **Fase 3 — Frontend (`app.js` e `index.html`):**
   - Tarjeta *"Reto / Cuestionario"* en la pantalla inicial de Play.
   - Barra de navegación entre actividades (`[Paso 1] [Paso 2] [+]`).
   - Sincronización del borrador en `localStorage`.
4. **Fase 4 — Pruebas y despliegue:**
   - Pruebas unitarias de exportación `.h5p` compuesto en `tests/test_play_export.py`.
   - Pruebas end-to-end con Playwright simulando la resolución completa de un reto.
   - Despliegue al VPS en `edutictac.es/play/`.
