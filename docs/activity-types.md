# Tipos de actividad

| Tipo | Fase | Estado |
|---|---:|---|
| Multiple Choice | 1 | Implementado |
| True/False | 2 | Implementado |
| Memory | 2 | Implementado |
| Matching / Relacionar | 2 | Implementado |
| Clasificar | 2 | Implementado |
| Fill in the Blanks | 2 | Pendiente |
| Ordenar | 2 | Pendiente de evaluar |

## Contrato conceptual

Cada adaptador ofrecerá operaciones equivalentes a:

```text
create()       -> modelo inicial con defaults
edit(model)    -> formulario simplificado
validate(data) -> datos normalizados o errores legibles
preview(model) -> actividad reproducible
render(model)  -> representación H5P
exportH5P()    -> paquete H5P con dependencias fijadas
```

## Multiple Choice actual

El formulario solicita título, pregunta, respuestas y respuesta correcta. El
adaptador fija automáticamente reintento, comprobación, solución, mezcla de
respuestas y mensajes básicos de accesibilidad.

El texto del usuario se escapa antes de insertarlo en `content.json`. El MVP no
acepta HTML arbitrario, multimedia ni configuraciones avanzadas.

## True/False actual

El formulario solicita únicamente título, afirmación y respuesta correcta. El
adaptador genera `H5P.TrueFalse` 1.8 con la librería oficial MIT y sus
dependencias locales. La interfaz fija las etiquetas en el idioma activo y
mantiene las opciones de comprobación y reintento adecuadas para alumnado.

## Memory actual

El formulario solicita una descripción breve y entre 2 y 12 conceptos. Play
genera una imagen SVG accesible por concepto y deja que `H5P.MemoryGame` cree
automáticamente las dos cartas de cada pareja. Así se mantiene una interfaz
textual sencilla sin exigir que el alumnado prepare imágenes. La librería
Memory Game 1.3 y `H5P.Components` son MIT; `H5P.Timer` se incluye con su
metadato de dominio público.

## Matching / Relacionar

El repositorio oficial `h5p/h5p-matching` está archivado y no se incorporará
como dependencia nueva. La alternativa preferida es `H5P.DragQuestion`, cuyo
tipo oficial se denomina Drag and Drop y mantiene licencia MIT. Su modelo
requiere zonas de destino, elementos arrastrables y librerías adicionales como
`jQuery.ui`, `H5P.Components`, `H5P.AdvancedText` y `H5P.JoubelUI`.

El adaptador se añadirá después de fijar y probar esas dependencias localmente.
La interfaz EduTicTac Play seguirá mostrando únicamente parejas origen-destino;
las coordenadas y parámetros de accesibilidad serán valores internos del
adaptador.

## Clasificar actual

El formulario reducido solicita entre 2 y 4 categorías y entre 3 y 12
elementos, indicando la categoría correcta de cada uno. Play transforma esos
datos en `H5P.DragQuestion` con una zona de destino por categoría y elementos
arrastrables. Las coordenadas, penalizaciones, reintento y mensajes de
accesibilidad son valores internos; el alumnado solo ve la actividad de
clasificación.

## Criterio para nuevos tipos

El objetivo de Play **no** es alcanzar paridad con los ~50 tipos de H5P ni
convertirse en un editor genérico para diseñadores instruccionales (para eso ya
está Lumi). Pero **sí seguirá incorporando nuevos tipos**, guiados por un
principio rector muy claro:

> **El criterio rector: tipos de actividad que sean sencillos y que pueda
> crear el propio alumnado.**

Condiciones para incorporar un tipo nuevo:
1. **Creable por el alumnado en 2–5 minutos:** formulario puramente textual o
   intuitivo, sin necesidad de preparar o subir archivos multimedia pesados,
   sin parámetros técnicos confusos y sin fricción cognitiva.
2. **Pedagógicamente activo:** actividades donde crear el juego forme parte del
   aprendizaje (repasar conceptos, clasificar, ordenar ideas, formular preguntas).
3. **Soporte técnico H5P limpio:** librería oficial con licencia libre (MIT o
   equivalente), empaquetable y reproducible con dependencias locales, y
   compatible con Aules/Moodle.

Bajo este criterio:
- **Tienen cabida en Play:** `Fill in the Blanks` (rellenar huecos), `Ordenar`
  (secuencias lógicas o temporales), sopa de letras o variantes de arrastre
  textual (`Clasificar`, ya incorporado).
- **Quedan fuera de Play y delegados a Lumi:** tipos complejos pensados para el
  docente o creador de cursos (vídeo interactivo, escenarios ramificados,
  presentaciones de diapositivas complejas, tours virtuales 360…).

## Alcance frente a editores H5P completos (Lumi)

[Lumi](https://lumi.education) (`Lumieducation/H5P-Nodejs-library`, GPL-3.0)
ofrece un editor H5P **oficial y completo** (los ~50 tipos de contenido,
formularios semánticos con decenas de opciones técnicas, exportación
H5P/HTML/SCORM), tanto en aplicación de escritorio como en `Lumi Cloud` (versión
online con cuenta).

El valor diferencial de Play frente a Lumi es radicalmente distinto:
- **Enfocado al alumnado y al aula rápida:** formularios reducidos para que un
  estudiante pueda crear su propia actividad en pocos minutos y compartirla.
- **Sin cuenta y sin barreras:** acceso inmediato, sin registro previo.
- **Soberanía y ligereza:** Python estándar sin dependencias externas pesadas,
  fácil de autoalojar en centros con hardware modesto.
- **Integración con Commons:** identidad pseudónima, envío de calificaciones a
  `/api/commons/score` y publicación directa en el catálogo de `recursos`.

Para contenidos complejos donde el docente requiera todo el potencial técnico de
H5P, la recomendación de Commons es enlazar o complementar con Lumi, mientras
que Play se consolida como el taller ágil de creación para el alumnado y el aula.
