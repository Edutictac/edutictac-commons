# Integración futura con Authentik

La autenticación no está implementada en el prototipo. La arquitectura
prevista usa Authentik como proveedor OpenID Connect, sin base propia de
contraseñas.

Variables futuras:

```dotenv
PLAY_OIDC_ISSUER_URL=https://auth.example/.well-known/openid-configuration
PLAY_OIDC_CLIENT_ID=
PLAY_OIDC_CLIENT_SECRET=
PLAY_OIDC_REDIRECT_URL=https://play.example/auth/callback
PLAY_OIDC_SCOPES=openid profile
```

Los roles funcionales serán `alumno`, `profesor` y `administrador`. El servidor
debe validar firma, issuer, audience, expiración y nonce del flujo OIDC, y
mapear los claims a una identidad pseudónima mínima.

La autorización se aplicará server-side. Ocultar botones en el navegador no es
una medida de seguridad.

```text
Play -> Authentik -> callback OIDC -> sesión segura -> permisos Commons
```

La implementación se hará cuando exista el modelo de actividades, clases y
entregas de Commons.
