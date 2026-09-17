# Authentik y OpenID Connect

El Commons mantiene dos formas de acceso:

* sin identidad externa: código público + PIN para el alumnado;
* opcionalmente, Authentik como proveedor OIDC para el ecosistema Commons.

La integración está implementada en `services/id-api`. No crea una base de
contraseñas propia ni copia nombres, correos o grupos del proveedor. Tras el
callback solo conserva una cookie de sesión firmada con el `sub` opaco del
proveedor y un pseudónimo derivado mediante HMAC. El resto de datos permanece
en Authentik.

## Configuración

En `.env`:

```dotenv
EDUTICTAC_ID_OIDC_ISSUER_URL=https://auth.example/application/o/commons/
EDUTICTAC_ID_OIDC_CLIENT_ID=
EDUTICTAC_ID_OIDC_CLIENT_SECRET=
EDUTICTAC_ID_OIDC_REDIRECT_URL=https://commons.example/api/auth/oidc/callback
EDUTICTAC_ID_OIDC_SCOPES=openid profile
EDUTICTAC_ID_OIDC_ROLE_CLAIM=roles
```

El issuer debe ser el de la aplicación/proveedor OIDC concreto de Authentik,
no necesariamente la raíz de Authentik. La aplicación utiliza su discovery en
`<issuer>/.well-known/openid-configuration`. La URL de callback debe coincidir
exactamente con una URI permitida en Authentik.

En Authentik se recomienda crear una aplicación con proveedor
`OAuth2/OpenID Connect`, cliente confidencial y flujo Authorization Code. Se
debe configurar una property mapping propia que devuelva, por ejemplo:

```json
{"roles": ["profesor"]}
```

Los valores admitidos son `alumno`, `profesor` y `administrador` (también se
aceptan sus equivalentes ingleses). Si llegan varios, se aplica la prioridad
`administrador > profesor > alumno`. El claim se puede cambiar con
`EDUTICTAC_ID_OIDC_ROLE_CLAIM`; así puede usarse `groups` si el centro ya tiene
ese mapping.

## Endpoints

* `GET /api/auth/oidc/status`: indica si OIDC está configurado, sin revelar
  secretos.
* `GET /api/auth/oidc/login`: inicia el login.
* `GET /api/auth/oidc/callback`: valida state, nonce, firma, issuer, audiencia
  y expiración mediante Authlib y crea la sesión Commons.
* `POST /api/auth/oidc/logout`: elimina la sesión local.

El modo actual de código + PIN sigue funcionando aunque OIDC esté vacío. Los
roles `profesor` y `administrador` se aceptan server-side en `require_teacher`;
no se confía en botones ocultos ni en cabeceras enviadas por el navegador.

## Licencias

La aplicación propia continúa bajo MIT. La integración usa Authlib, publicada
bajo BSD-3-Clause; se instala desde PyPI y no se incorpora código cerrado.
Authentik es el proveedor externo autoalojado del centro y sus componentes
tienen sus propias licencias, que no se redistribuyen dentro de esta imagen.

## Siguiente fase

Esta primera integración resuelve login, sesión y rol. La siguiente fase debe
mapear el `sub` pseudónimo a las entidades Commons compartidas por Portal,
Play, Recursos y EduHoot, y añadir sincronización de clases desde Authentik sin
copiar más atributos personales de los necesarios.
