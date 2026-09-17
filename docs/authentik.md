# Authentik y OpenID Connect

El Commons mantiene dos formas de acceso:

* sin identidad externa: código público + PIN para el alumnado;
* Authentik como proveedor OIDC para el acceso docente y el ecosistema Commons.

La integración está implementada en `services/id-api`. No crea una base de
contraseñas propia ni copia nombres, correos o grupos del proveedor. Tras el
callback solo conserva una cookie de sesión firmada con el `sub` opaco del
proveedor y un pseudónimo derivado mediante HMAC. El resto de datos permanece
en Authentik.

## Configuración

El repositorio incluye un perfil Compose opcional (`authentik`) para el
laboratorio local. No se inicia por defecto y no incluye Redis: la composición
actual de Authentik utiliza PostgreSQL, `server` y `worker`.

```bash
cp .env.example .env
# Cambiar AUTHENTIK_PG_PASS y AUTHENTIK_SECRET_KEY en .env
COMPOSE_PROFILES=authentik docker compose up -d authentik-postgresql authentik-server authentik-worker
```

La primera pantalla queda disponible en `http://localhost:9000/`. En el
paquete Debian, Authentik recibe la contraseña bootstrap y el worker aplica
`authentik-blueprints/edutictac-commons.yaml`: crea el grupo
`administrador`, la aplicación `EduTicTac Commons` y su proveedor OIDC. Los
puertos
se cambian con `AUTHENTIK_PORT` y `AUTHENTIK_HTTPS_PORT`. Los datos de
Authentik se guardan en el volumen Docker `authentik_database` y en
`data/authentik/`; ambos deben incluirse en la estrategia de backup del centro.

En `.env`:

```dotenv
EDUTICTAC_ID_OIDC_ISSUER_URL=https://auth.example/application/o/commons/
EDUTICTAC_ID_OIDC_DISCOVERY_URL=
EDUTICTAC_ID_OIDC_AUTHORIZATION_URL=
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

En una instalación con contenedores, el descubrimiento puede apuntar al nombre
interno `http://authentik-server:9000/.../.well-known/openid-configuration`.
La URL de autorización debe seguir siendo accesible desde el navegador; por
eso se puede indicar por separado con `EDUTICTAC_ID_OIDC_AUTHORIZATION_URL`.
En Authentik moderno es `/application/o/authorize/` (sin el slug); el slug se
usa para el issuer y para el descubrimiento.

Para una instalación manual, se recomienda crear una aplicación con proveedor
`OAuth2/OpenID Connect`, cliente confidencial y flujo Authorization Code. Se
debe configurar una property mapping propia que devuelva, por ejemplo:

En la demo local de Debian Desktop ya existe la aplicación `EduTicTac Commons`
con slug `edutictac-commons`. Sus valores sensibles se guardan en `pass`, no
en Git. Para reiniciar el conjunto conservando OIDC se puede usar:

```bash
./scripts/up-authentik-pass.sh
```

El script está pensado para la demo local; en otro centro se deben sustituir
las URLs por las del despliegue correspondiente.

En la demo local, el proveedor incluye el mapping `EduTicTac Commons roles`:
`akadmin` recibe `administrador` y `profesor`, y el resto de usuarios recibe
`alumno` por defecto. En un centro real se recomienda reemplazar esta regla
por grupos gestionados desde Authentik.

## Arranque del entorno local

Cuando el perfil Authentik está configurado mediante `pass`, hay que arrancar
Commons con el wrapper para que `id-api` reciba las variables OIDC:

```sh
./scripts/up-authentik-pass.sh up -d
```

Un `docker compose up -d` directo puede recrear `id-api` usando los valores
vacíos de `.env` y dejar temporalmente `GET /api/auth/oidc/status` con
`enabled: false`. La comprobación rápida es:

```sh
curl http://127.0.0.1:8082/api/auth/oidc/status
```

Debe devolver `enabled: true` en el entorno de laboratorio.

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
