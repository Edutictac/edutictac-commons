# Commons 0.1.1-alpha23 — EduTicTac Quiosc

Añade un módulo supervisado de Firefox mediante Epoptes, integrado en la API y
el portal. Incluye inventario autorizado, sesiones persistentes, duración local,
recuperación y simulación explícita. No implementa aislamiento de KDE ni filtro
de navegación y no se presenta como examen seguro.

Se reconstruyen `commons-id-api` y `commons-portal`. `commons-admin` y
`commons-play` se publican con el mismo contenido que alpha22 y alpha20,
respectivamente, para mantener un conjunto de imágenes completo sin incorporar
cambios ajenos a Quiosc. Los digests están en `images.json`; el override de
imágenes es `compose.images.json`.

El módulo queda desactivado por defecto. La conexión con el Epoptes existente
requiere inventario de MAC/UID/grupo y el override `compose.quiosc.yml`; no se
instala ningún componente adicional en los PC del alumnado. La validación real
en LliureX 23 está pendiente. Instrucciones y límites: [guía de Quiosc](../../docs/quiosc.md).

Validación: 24 pruebas Python/AMP/Docker, cuatro pruebas de interfaz, construcción
de ambas imágenes y prueba Docker aislada aprobadas. La regresión ampliada del
portal conserva dos causas de fallo previas reproducidas sobre HEAD, descritas
en la guía.
