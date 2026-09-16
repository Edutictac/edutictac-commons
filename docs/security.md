# Seguridad

## Estado del prototipo

Play aplica validación server-side, límite de cuerpo JSON, escape de texto,
protección contra traversal en rutas estáticas y cabeceras CSP,
`X-Content-Type-Options` y `Referrer-Policy`.

Las librerías H5P se sirven desde el propio contenedor. No se cargan scripts
desde CDN ni se utiliza telemetría.

## Pendiente para producción

- autenticación OIDC con Authentik;
- autorización por propietario, clase y publicación;
- rate limiting;
- cookies seguras y protección CSRF con sesiones mutables;
- límites de almacenamiento;
- auditoría de dependencias y SBOM por release;
- proxy HTTPS y rotación de secretos;
- pruebas automatizadas de XSS, traversal y permisos.

El contenido H5P contiene JavaScript de librerías. Solo se deben incluir
librerías upstream fijadas y revisadas; nunca se debe permitir que el usuario
suba una librería ejecutable al servidor.
