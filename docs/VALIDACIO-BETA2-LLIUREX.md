# Validación de Commons beta2 en LliureX

Fecha: 23 de octubre de 2026. Validación local, sin cambios en producción.

## Entorno

Dos máquinas virtuales reales de LliureX: profesor (4 CPU, 5 GB de RAM) y
alumnado (2 CPU, 1,5 GB de RAM). Las pruebas de navegador se ejecutan dentro de
cada máquina como usuario `lliurex`. Se utilizan herramientas de prueba
temporales, sin actualizar paquetes ni adaptar los servicios de LliureX.

El profesor arranca antes que el alumnado. Se comprueban las direcciones del
servidor del aula desde el equipo del alumnado, además de las pruebas locales.

## Actualización desde beta1: superada

1. Copia del servidor y comprobación con `backup.sh` y `backup-check.sh`, como
   usuario del profesor, antes de actualizar.
2. Instalación del paquete y actualización de imágenes mediante los mecanismos
   del producto. Las filas de las doce tablas anteriores se conservan y los
   módulos nuevos permanecen desactivados hasta seleccionarlos.
3. Acceso docente por la pantalla de identificación y activación de módulos
   desde Administración.
4. Blocs, tanto en profesor como en alumnado anónimo: imagen de Rebost,
   familia de cuatro disfraces, movimiento y cambio de disfraz, descarga y
   reapertura del proyecto.
5. Llibres, en ambos equipos: imagen de Rebost, dibujo, guardado en el
   navegador, reapertura y lectura.
6. El docente crea un grupo ficticio y una identidad. El alumno entra con
   código y PIN, crea un libro y lo envía para aprobación. El docente revisa
   la vista previa y lo aprueba. El alumno recibe el enlace del Banc y un
   visitante sin sesión abre el libro publicado con su imagen.
7. Reinicio ordenado de ambos equipos. El alumnado vuelve a acceder a las
   aplicaciones y al libro publicado.

La actualización se validó con candidate4, cuyas ocho imágenes propias son
idénticas a candidate5.

## Instalación limpia de candidate5: superada

Se parte de la base inmutable de LliureX, sin paquete ni configuración previa
de Commons. PostgreSQL y Mongo conservan los digests de beta1.

1. Instalación del paquete, reinicio y activación inicial desde el navegador.
2. Identificación docente y selección de los seis módulos desde Administración.
3. Comprobación de las trece imágenes en ejecución frente al manifiesto:
   todas coinciden, también después del reinicio final.
4. Repetición de las pruebas de Blocs y Llibres en profesor y alumnado,
   incluyendo catálogo público de Rebost, disfraces, movimiento, dibujo,
   guardado y reapertura.
5. Nueva clase ficticia: envío del libro por el alumno, revisión y aprobación
   por el tutor y lectura del enlace público con imágenes sin sesión.
6. `backup.sh` y `backup-check.sh` ejecutados como `lliurex`: ambos superados.
7. Reinicio de profesor y alumnado, respetando el orden. El alumno vuelve a
   identificarse, abre el libro guardado en su navegador y recupera el enlace
   aprobado. Un visitante sin cookies vuelve a leerlo con sus imágenes.

La selección del Quiosc se comprueba como configuración del módulo. Estas
pruebas no incluyen imponer el modo Quiosc a una pantalla física del aula.

## Copias grandes y espacio

La base inmutable y el disco de la máquina actualizada se han copiado cifrados
al NAS, comprimiendo y transmitiendo directamente, sin crear un archivo grande
intermedio en el equipo local. Se han comprobado los SHA-256 de las copias
cifradas. El disco actualizado se ha leído del NAS, descifrado y descomprimido:
su SHA-256 y tamaño coinciden con el original. Los metadatos de recuperación
también se conservan cifrados.

Tras comprobar la copia recuperable del NAS y que la máquina nueva depende
solo de la base, se ha retirado el disco local de la máquina actualizada. Se
han liberado unos 8,7 GiB; al terminar las pruebas quedan aproximadamente 19 GB
libres en el disco raíz. La base local necesaria para arrancar las máquinas se
conserva.

Esta comprobación valida los bytes recuperables del disco; no equivale a haber
arrancado otra máquina restaurada desde el NAS.

## Pruebas automatizadas complementarias

- Portal: 284 pruebas de navegador superadas.
- Python: 479 casos en la ejecución general; 474 superados, 2 omitidos y 3
  fallos. Los tres casos se verificaron después de forma focalizada: dos
  aserciones de versión antiguas se corrigieron y una espera de paginación
  pasó al repetirla. No se presenta como una segunda ejecución completa.
- Blocs: 274 pruebas unitarias superadas.
- Llibres: 20 pruebas de idioma y ejemplos, 19 de taller/cómic y 4 regresiones
  de disponibilidad de publicación superadas.
- Instalación aislada con los editores y manifiesto de imágenes: superada,
  incluyendo copia y restauración de SQLite, Mongo, archivos e informes.
- Instalador candidate5: comprobación de ausencia de archivos locales privados
  superada.

## Límites y publicación

La prueba de aula usa identidades ficticias y no publica contenido en el Banc
federado. No sustituye una prueba presencial con hardware y navegadores de un
centro. Los proyectos de Blocs y Llibres guardados en el navegador necesitan su
propia descarga: la copia del servidor no incluye IndexedDB de cada usuario.

No se ha publicado todavía una versión final beta2 en el repositorio APT ni se
ha cambiado la producción federada. Los manifiestos de las candidatas permiten
repetir las comprobaciones con las mismas imágenes.
