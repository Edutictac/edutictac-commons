# Tipos de actividad

| Tipo | Fase | Estado |
|---|---:|---|
| Multiple Choice | 1 | Implementado |
| True/False | 2 | Implementado |
| Memory | 2 | Implementado |
| Matching / Relacionar | 2 | En evaluación técnica |
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

## Criterio para nuevos tipos

Antes de implementar un tipo se comprobará que existe un tipo H5P mantenido y
con licencia compatible, que sus dependencias pueden servirse localmente, que
Moodle/AULES puede reconocerlas y que el formulario reducido aporta una
experiencia claramente más sencilla.
