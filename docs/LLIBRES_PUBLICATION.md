# Conexión opcional de Llibres con el banco

El prototipo hermano `../edutictac-llibres` añade publicación voluntaria de libros
y una vista pública de las mismas publicaciones del banco de recursos.

- `services/id-api/books.py`: proxy fijo al recursos-api existente. Publicar,
  actualizar y retirar requiere sesión OIDC individual docente/administrador
  vigente y control de origen; nunca tokens compartidos de compatibilidad.
- El servicio del banco valida las páginas, genera HTML sin scripts y almacena
  archivos y ficha en su SQLite persistente. No hay nueva base de datos ni servicio.
- `LLIBRES_PUBLIC_BASE_URL` debe apuntar al origen del banco accesible por lectores;
  en el laboratorio es `http://100.74.151.108:8086`.
- El perfil `recursos` y la red Commons existentes deben estar activos. El override
  opcional de Llibres conserva su puerto 8098 y la estantería del navegador.
- Los catálogos e imágenes personales de Rebost mantienen sus permisos actuales.

Contrato, límites, copias de seguridad, licencias y comandos en
`../edutictac-llibres/docs/RESOURCE_PUBLICATION.md`. Pruebas de identidad y origen:
`pytest -q tests/test_books_access.py`.

## Acceso docente

El enlace de Llibres pasa `next=/llibres-login.html?lang=es|va` al login existente.
La confirmación usa `/api/llibres/me`, sin exponer identidades, y permite cerrar la
pestaña de acceso para regresar al libro. Llibres comprueba permisos al recuperar
el foco. Si Authentik ya tiene sesión, puede omitir el formulario de contraseña.

El wrapper local usa `EDUTICTAC_ID_OIDC_ROLE_CLAIM=groups` por defecto, igual que el
blueprint y `.env.example`, conservando una claim explícita distinta cuando se
configure. Una sesión anterior con rol incorrecto requiere volver a entrar; no
se alteran cuentas, contraseñas ni grupos para corregir la configuración.

## Revisión de libros del alumnado

El alumnado de código/PIN puede enviar copias privadas. Solo los responsables de
su aula (`created_by_teacher_id` o `group_memberships`) pueden consultar y decidir
las solicitudes; se reutiliza `require_group_access`. Administradores pueden
gestionar también solicitudes huérfanas. Aprobar comprueba que la identidad y su
vínculo con el aula sigan activos. Se aplican origen e `If-Match` a las decisiones.
Las cuentas OIDC de alumno aún no tienen aula enlazada: deben usar código/PIN.
El banco guarda y valida las revisiones en su misma SQLite; la copia se hace
pública únicamente con aprobación. El proxy no admite datos de identidad o aula
proporcionados por el cliente.
