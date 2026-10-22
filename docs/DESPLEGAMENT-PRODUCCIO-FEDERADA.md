# Despliegue federado de Commons en producción (edutictac.es)

Estado: **preparación de la fase 1 revisada el 22-10-2026; ningún cambio aplicado
en producción.** EduTicTac está en uso: avanzar paso a paso. Cada fase se
ejecuta solo tras confirmación explícita.

## Objetivo

Las aplicaciones conservan sus URL y siguen funcionando solas. Commons añade la
capa común (aulas, alumnado código/PIN, itinerarios, Rebost) en
`commons.edutictac.es`, sin duplicar servicios.

| Servicio | URL | Solo | Con Commons |
|---|---|---|---|
| Blocs | blocs.edutictac.es | igual que hoy | Rebost, cuenta EduTicTac |
| Banc de recursos | recursos.edutictac.es | igual | asignar a aulas, favoritos docentes |
| Play | edutictac.es/play/ | igual | resultados en el aula |
| EduHoot | eduhoot.edutictac.es | igual | ya usa Authentik |
| Llibres | llibres.edutictac.es (propuesta) | editor suelto | Rebost, publicar en el Banc |
| Commons | commons.edutictac.es | — | portal docente/alumnado, aulas, itinerarios, gestor Rebost |

Identidad única: docentes con Authentik `id.edutictac.es`; alumnado con código/PIN
del id-api. Fuera de producción compartida: panel `admin` (gestiona Docker y
backups del host) y Quiosc (solo aula local).

## Situación verificada (solo lectura, 22-10-2026)

- VPS `vmi3333727`, acceso `samgua@100.69.168.122 -p 2222` (tailnet). 6 CPU,
  11 GiB RAM (7,1 disponibles), disco 62 % (36 GB libres).
- id-api actual: `/opt/edutictac-id-api`, systemd `edutictac-id-api.service`,
  venv, `uvicorn main:app` en `127.0.0.1:8005`, usuario samgua (uid 1000), sin git.
  Código de septiembre (1014 líneas). Env `/etc/edutictac-id-api.env` con
  `EDUTICTAC_ID_DB`, `EDUTICTAC_ID_SECRET`, `EDUTICTAC_ID_TEACHER_TOKEN`,
  `EDUTICTAC_ID_COOKIE_SECURE`.
- Base `/opt/edutictac-id-api/data/id.db` (modo WAL): 1 grupo, 50 identidades
  (10-09-2026), 0 sesiones/puntuaciones/asignaciones. Esquema antiguo: sin
  `avatar_icon`, `launch_url`, `result_id`, membresías ni itinerarios.
- **Sin copias de seguridad** del id-api.
- Único consumidor: `recursos-api` vía `EDUTICTAC_ID_API_URL` en
  `/etc/recursos-api.env`. nginx no expone el puerto 8005.
- `recursos-api` usa solo `POST /api/auth/student` y `POST /api/identities/batch`
  (Bearer `EDUTICTAC_ID_TEACHER_TOKEN`, `tenant_id: "recursos"`).

## Ensayo hecho en local

Base con el **esquema exacto de producción** (solo el SQL, sin datos reales) y
datos sintéticos, migrada con la id-api actual (`main`):

- migración `id-api` v1 aplicada; propietario reconstruido en `group_memberships`;
- `/api/auth/student` 200 con identidad antigua y 401 con PIN erróneo;
- `/api/identities/batch` 201 con token y 401 sin él;
- `/api/health` 200 y catálogo Rebost 200.

Script reproducible: guardado fuera del repo (`scratchpad/dryrun/dryrun.py`);
rehacerlo si hace falta, el esquema se obtiene en solo lectura de `sqlite_master`.

## Decisión técnica de la fase 1

Ejecutar la **imagen Docker `commons-id-api`** (la misma que instalan los
centros) en lugar de copiar código al venv:

- la versión nueva espera `/data` (`quiosc.db`, `modules.json`) y Pillow;
- artefacto probado y con digest; vuelta atrás = restaurar la base previa y
  volver a arrancar systemd (no usar el código antiguo con la base migrada);
- contenedor `127.0.0.1:8005`, volumen `/opt/edutictac-id-api/data:/data`
  (uid 1000 coincide con samgua), `--memory=384m`, `restart unless-stopped`.

## Fases

### Fase 1 — Actualizar id-api sin cambios visibles (riesgo mayor)

Preparación (sin tocar producción):
1. Construir y publicar `commons-id-api` desde `main` con tag propio
   (p. ej. `0.1.1-beta2-prod`); anotar digest.
2. Preparar `/opt/edutictac-id-api/docker/compose.yml` y un env nuevo
   (`chmod 600`) con las mismas variables más `EDUTICTAC_ID_DB=/data/id.db`.
   Los secretos se copian de fichero a fichero en el VPS, nunca por pantalla.

Ventana de cambio (minutos):
3. Copia consistente: `sqlite3 id.db ".backup id.db.bak-<fecha>"` + `chmod 600`;
   copia del env y de `main.py`.
4. Ensayo en el VPS: contenedor temporal en `127.0.0.1:18005` sobre **una copia**
   de la base; probar `auth/student` con una identidad sintética creada por
   batch, `identities/batch` y `health`.
5. `systemctl stop edutictac-id-api` → arrancar contenedor en 8005.
6. Verificar desde `recursos-api`: generar alumnado en el tablero de Recursos
   y login de alumnado; `journalctl -u recursos-api` sin 502.
7. Si todo bien: `systemctl disable edutictac-id-api` (sin borrar nada).

Vuelta atrás: con ambos servicios detenidos y sin conexiones a SQLite,
preservar aparte la base migrada y sus ficheros WAL/SHM, restaurar la copia
consistente previa con sus permisos y arrancar `edutictac-id-api`.
No mezclar la base restaurada con WAL/SHM de la migrada. Ensayar la
restauración y el arranque del código antiguo sobre copias antes del cambio.
Durante la ventana deben impedirse escrituras de consumidores: una restauración
posterior perdería las escrituras nuevas. El ensayo previo no autoriza el corte.

Además en esta fase: copia diaria cifrada o al NAS de `id.db` (patrón
`backup pass→NAS`) y alerta en n8n si `/api/health` falla.

### Fase 2 — commons.edutictac.es

- Contenedor `commons-portal` (puerto libre 8180-8189), nginx + certbot
  (**listar `server_name` antes de `--expand`**, ver memoria certbot).
- Proveedor OIDC nuevo en Authentik `id.edutictac.es` (`commons`), grupo de
  profesorado; `EDUTICTAC_ID_OIDC_*` en el env del id-api.
- `EDUTICTAC_ID_COOKIE_DOMAIN=.edutictac.es` y `COOKIE_SECURE=1`; probar sesión
  compartida commons ↔ recursos ↔ blocs (pendiente histórico del roadmap).
- Página de privacidad y uso desde `docs/PRIVACITAT.md` / `DIRECCIO-DPD.md`.

### Fase 3 — Rebost en Blocs

- Commit/push pendientes de Blocs (rama `blocs`), imagen nueva, despliegue en
  `blocs.edutictac.es` apuntando al Rebost de `commons.edutictac.es`
  (`REBOST_PUBLIC_ORIGIN`, CORS/origen comprobados).

### Fase 4 — Llibres

- Repositorio `edutictac-llibres` con commits y remotos; `llibres.edutictac.es`;
  selector Rebost; publicación al Banc real (confirmar antes).

## Decisiones tomadas (22-10-2026)

- Llibres en `llibres.edutictac.es`.
- Commons abierto a todo el profesorado con cuenta en `id.edutictac.es`
  (sin grupo de pilotos).
- Copias del id-api al NAS por la tailnet (patrón `backup pass→NAS`).
- Resto de recomendaciones del plan aceptadas.

## Primer paso: comprobación sin cambios (22-10-2026)

Petición expresa: avanzar sin prisa porque `edutictac.es` está en producción.
Revisión por SSH en solo lectura, sin reinicios, cambios de configuración,
cuentas de prueba ni escrituras de aplicación:

- ID API, Recursos API y Play activos. Health interno de identidad, portada
  pública del banco y Play responden HTTP 200.
- SQLite abierta con `mode=ro`: `quick_check=ok`, modo WAL, 1 grupo,
  50 identidades, 0 sesiones, 0 resultados y 0 asignaciones.
- Puerto 8005 ocupado por el servicio actual; 18005 libre para el ensayo futuro.
- UID de la base 1000; 36 GiB disponibles. El fichero tiene permisos 0644:
  revisar acceso al directorio y permisos de copia/base en la preparación,
  sin modificarlos durante esta auditoría.
- Acceso SSH comprobado por el puerto predeterminado; el 2222 del inventario
  anterior no se ha vuelto a comprobar. Verificar el acceso vigente antes de
  cada operación, sin modificar SSH.

Ensayo local repetido con **solo el esquema SQL** leído de producción y
50 identidades ficticias: migración conserva todos los campos anteriores,
reconstruye la pertenencia del propietario y mantiene integridad. Health,
login correcto, rechazo de PIN incorrecto y creación batch con/sin autorización
comprobados. Ninguna credencial ni fila real se ha copiado al entorno local.
Dos pruebas automatizadas de migración también aprobadas.

Siguiente paso acotado: preparar la copia consistente y ensayar en aislamiento
la imagen exacta candidata y la restauración con el código antiguo. Esto aún
no se ha realizado: no hay contenedor candidato desplegado en el VPS, no se
ha cambiado el servicio ni se da por completada la fase 1.
