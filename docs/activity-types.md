# Tipos de actividad

| Tipo | Fase | Estado | Librería H5P |
|---|---:|---|---|
| Multiple Choice | 1 | Implementado | `H5P.MultiChoice 1.16` |
| True/False | 2 | Implementado | `H5P.TrueFalse 1.8` |
| Memory | 2 | Implementado | `H5P.MemoryGame 1.3` |
| Matching / Relacionar | 2 | Implementado | `H5P.DragQuestion 1.15` |
| Clasificar | 2 | Implementado | `H5P.DragQuestion 1.15` |
| Ordenar | 2 | Implementado | `H5P.DragQuestion 1.15` |
| Rellenar huecos (`Fill in the Blanks`) | 2 | Implementado | `H5P.Blanks 1.14` |
| Sopa de letras (`Find the Words`) | 3 | Implementado | `H5P.FindTheWords 1.4` |
| Arrastrar al texto (`Drag Text`) | 3 | Implementado | `H5P.DragText 1.10` |
| Marcar palabras (`Mark the Words`) | 3 | Planificado | `H5P.MarkTheWords 1.11` |
| Tarjetas de estudio (`Dialog Cards`) | 3 | Planificado | `H5P.Dialogcards 1.9` |
| Crucigrama (`Crossword`) | 3 | Planificado | `H5P.Crossword 1.1` |

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

## Ordenar actual

El mismo editor se presenta como una secuencia sencilla: el alumnado escribe
los elementos y los coloca en posiciones numeradas. Internamente se genera un
`H5P.DragQuestion` con una zona de destino por posición. Se limita a entre 3 y
12 elementos para mantener una actividad breve y manejable en móvil.

## Rellenar huecos (Fill in the Blanks) — Implementado

El formulario solicita título, instrucciones breves y un bloque de texto donde el
alumnado rodea con asteriscos las palabras a completar (p. ej. `El agua hierve a
*100* grados`). El adaptador genera un paquete `H5P.Blanks` 1.14 estándar con
validación de mayúsculas/minúsculas tolerante, reintento y visualización de solución.
La previsualización utiliza el mismo runtime H5P que el archivo exportado. Se
incluyen localmente `H5P.Blanks` y su dependencia `H5P.TextUtilities`; el texto
está limitado a 5.000 caracteres y no admite HTML proporcionado por usuarios.
Es una actividad de creación ultrarrápida (2 minutos) óptima para definiciones,
lenguas y vocabulario.

## Sopa de letras (Find the Words) — Implementado

El formulario solicita título, descripción y una lista de entre 4 y 12 palabras.
El motor `H5P.FindTheWords` 1.4 calcula dinámicamente la cuadrícula, distribuye
las palabras en varias direcciones y rellena las casillas vacías con letras
aleatorias. Play fija estas opciones con defaults sencillos, muestra siempre la
lista de palabras y limita cada palabra a 15 letras. El alumnado crea un juego
completo en apenas 1 minuto sin configurar coordenadas ni tableros.

La librería declara MIT en su `library.json`, pero el repositorio de origen
incluye GPL-3.0 para el conjunto. Por prudencia Play conserva el fichero de
licencia y documenta esta dependencia como GPL-3.0; antes de una release se debe
confirmar la licencia global del producto.

## Arrastrar palabras al texto (Drag Text) — Implementado

Comparte con *Rellenar huecos* la misma sintaxis de autoría basada en asteriscos
(`*palabra*`), pero el adaptador produce `H5P.DragText` 1.10. Durante el juego, las
palabras correctas se presentan como fichas arrastrables hacia las lagunas del
texto. Play fija reintento, solución y comprobación con defaults educativos; no
expone distractores ni configuraciones avanzadas. Es la alternativa táctil
preferente para dispositivos móviles o alumnado que aún escribe con lentitud en
teclado.

## Marcar las palabras (Mark the Words) — Planificado

El formulario solicita una consigna y un texto con palabras objetivo señaladas entre
asteriscos (p. ej. `Señala los adjetivos: El *rápido* guepardo corrió por la
*seca* llanura`). El adaptador genera `H5P.MarkTheWords` 1.11, permitiendo al
jugador hacer clic directamente sobre cualquier palabra del texto para
seleccionarla. Es un formato nativo para aprendizaje gramatical, ortográfico y de
comprensión lectora.

## Tarjetas de estudio / Flashcards (Dialog Cards) — Planificado

El formulario solicita un título y entre 3 y 15 fichas de doble cara: *Anverso*
(pregunta, concepto o palabra) y *Reverso* (respuesta, definición o traducción).
El adaptador genera `H5P.Dialogcards` 1.9 configurado en modo repaso y
autoevaluación con volteo animado. No exige imágenes ni audio, convirtiéndose en
el método más directo para estudiar fórmulas, vocabulario de idiomas o fechas.

## Crucigrama (Crossword) — Planificado

El formulario solicita una lista de entre 4 y 10 palabras con su pista correspondiente.
El generador `H5P.Crossword` 1.1 calcula automáticamente los cruces e intersecciones,
generando la cuadrícula con numeración y pistas horizontales/verticales. Permite
al alumnado crear juegos de repaso completos de una unidad didáctica en menos de
5 minutos sin requerir conocimientos de maquetación.

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

## Actividades compuestas: Modo Reto (QuestionSet)

Para permitir que el alumnado agrupe varias actividades sencillas en un único
paquete exportable y evaluable, Play incorpora en su planificación el soporte de
**actividades compuestas mediante `H5P.QuestionSet`**.

El diseño técnico completo de este contenedor, su integración con xAPI para
calificaciones globales y el flujo de autoría por pasos están documentados en
[`composite-activities.md`](composite-activities.md).
