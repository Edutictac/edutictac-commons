# Candidata local 0.1.1-beta2-candidate5

Fecha de validación: 23 de octubre de 2026. No es una publicación del canal APT.
Esta candidata incorpora Blocs y Llibres como módulos opcionales de Commons.
No cambia el despliegue federado de producción.

## Artefactos

- Ocho imágenes propias para `linux/amd64`, etiquetadas
  `0.1.1-beta2-candidate5` en `registry.edutictac.es/edutictac`.
- [images.json](images.json): digests y revisiones del código de origen.
- [compose.images.json](compose.images.json): las trece referencias de servicios,
  incluyendo los componentes de terceros conservados de beta1.
- Instalador de pruebas: `edutictac-commons_0.1.1~beta2~candidate5_amd64.deb`.
  SHA-256: `3a294fb0ef262264fdb275888184181e63338da9e7d418a4ae5191766727cc20`.

Las ocho imágenes son las mismas que en candidate4. El instalador fija ahora
PostgreSQL y Mongo por digest: una instalación limpia ya no depende de que las
etiquetas de esos proyectos sigan apuntando a la misma imagen.

## Cambios comprobados durante la validación

- Blocs permite abrir el catálogo público de Rebost sin iniciar sesión. El
  acceso a las imágenes privadas sigue requiriendo identificación.
- Llibres reconoce correctamente el módulo Recursos y permite el envío de
  libros del alumnado para revisión por su tutor.
- Los enlaces de lectura publicados utilizan el nombre del servidor del aula.
- La instalación y las imágenes excluyen carpetas locales de trabajo. La
  construcción del instalador y la publicación de imágenes incluyen una
  comprobación de nombres de archivos que falla si detecta esas carpetas.

## Validación

El informe de aula se mantiene en
[docs/VALIDACIO-BETA2-LLIUREX.md](../../docs/VALIDACIO-BETA2-LLIUREX.md).
Los registros operativos privados y las credenciales ficticias de las pruebas
quedan fuera del repositorio.

Los libros y proyectos de los editores se guardan en el navegador o mediante
descarga. La copia del servidor no sustituye la descarga de esos trabajos.
