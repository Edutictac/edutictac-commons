# Despliegue federado de Commons en producción (edutictac.es)

Estado: **fase 1 desplegada y validada el 22-10-2026: identidad funciona en
Docker, con copias automáticas, recuperación NAS y avisos activos.** Play y
EduHoot no se han reiniciado. La API del Banc se actualiza en la fase Llibres descrita al final. **Fase 2 publicada con HTTPS y OIDC
el 22-10-2026; pendiente la aceptación humana del acceso docente y aula.**
EduTicTac está en uso: avanzar paso a paso. Cada fase se
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

## Situación inicial verificada (solo lectura, antes del cambio del 22-10-2026)

- VPS `vmi3333727`, acceso `samgua@100.69.168.122 -p 2222` (tailnet). 6 CPU,
  11 GiB RAM (7,1 disponibles), disco 62 % (36 GB libres).
- id-api anterior: `/opt/edutictac-id-api`, systemd `edutictac-id-api.service`,
  venv, `uvicorn main:app` en `127.0.0.1:8005`, usuario samgua (uid 1000), sin git.
  Código de septiembre (1014 líneas). Env `/etc/edutictac-id-api.env` con
  `EDUTICTAC_ID_DB`, `EDUTICTAC_ID_SECRET`, `EDUTICTAC_ID_TEACHER_TOKEN`,
  `EDUTICTAC_ID_COOKIE_SECURE`.
- Base `/opt/edutictac-id-api/data/id.db` (modo WAL): 1 grupo, 50 identidades
  (10-09-2026), 0 sesiones/puntuaciones/asignaciones. Esquema antiguo: sin
  `avatar_icon`, `launch_url`, `result_id`, membresías ni itinerarios.
- En la auditoría inicial, **sin copias de seguridad** del id-api. Ya existe
  la copia consistente local y la copia externa cifrada descritas al final.
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

**Desplegada.** Ejecución y validaciones en el apartado final. Los pasos
siguientes conservan el procedimiento previsto y sus precauciones.

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

Portal publicado y proveedor OIDC propio configurado. Detalles y pruebas en
el apartado final. La aceptación con una cuenta docente real sigue pendiente.

- Contenedor `commons-portal` (puerto libre 8180-8189), nginx + certbot
  (certificado independiente `commons.edutictac.es`, sin ampliar ni reemplazar
  certificados compartidos; ver memoria certbot).
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

### Copia y ensayo de migración/restauración completados

Tras autorización para este paso, se ha creado en el VPS una copia mediante
la API `sqlite3.Connection.backup`, incorporando los registros confirmados
del WAL. `integrity_check=ok`. Directorio privado:
`/opt/edutictac-id-api/backups/before-docker-20261022T113140Z/`.
Contiene base, código antiguo, requisitos, configuración y unidad systemd;
directorio 0700 y archivos sin permisos de grupo/otros. Los secretos no se
muestran ni se incorporan a Git. La copia externa al NAS ya se ha verificado
como se describe a continuación; su programación periódica sigue pendiente.

Imagen construida desde el código local de `a0af1a3`, transferida al Docker
del VPS sin publicar al registro:

- Tag: `commons-id-api:prod-rehearsal-20261022`.
- ID de imagen: `sha256:a719fc1aacfeea1c74052a1d5f31cdfb1c3d7d7a53e7de04b3c37f71f73cb510`.
  Es el ID local de Docker, no un digest de manifiesto del registro.
- Contenedor temporal con red `none`, sin puertos publicados, usuario 1000,
  límite de memoria 384 MiB, 1 CPU y sin capabilities; solo monta datos de ensayo.

Ensayo sobre copias privadas del servidor, sin extraer datos reales:

1. Arranque del código antiguo copiado en loopback 18005, con secretos
   ficticios y base de ensayo. Creación de una credencial ficticia y login.
2. Snapshot consistente previo a migración. Arranque de la imagen candidata
   exclusivamente sobre otra copia. Comparación de todos los campos y filas
   preexistentes e integridad SQLite correctas.
3. HTTP desde dentro del contenedor: health, login con la credencial creada
   por la versión antigua, rechazo de PIN incorrecto, batch sin autorización
   denegado y batch autorizado correcto.
4. Restauración del snapshot previo en un directorio nuevo, sin WAL/SHM
   migrados. Arranque del código antiguo: login y creación batch correctos.
5. Procesos y estado systemd de identidad, banco y Play idénticos antes/después;
   todas las filas de la base original idénticas durante el ensayo.
   Contenedor temporal retirado y fichero de secretos ficticios eliminado.

Resultado **PASS**, guardado sin credenciales en
`/opt/edutictac-id-api/rehearsals/20261022T113140Z/report.json`.
El script de ensayo permanece en `/home/samgua/commons-id-rehearsal.py`;
no repetirlo sobre el directorio existente (requiere una copia nueva).
Las bases de ensayo contienen datos privados y no deben compartirse.

No se ha sustituido el servicio ni se da por completada la fase 1.

### Configuración preparada y copia externa recuperada

Autorización posterior limitada a preparar la configuración y la copia externa.
Se ha preparado `/opt/edutictac-id-api/docker/compose.yml`, todavía sin arrancar:

- Imagen fijada por el ID exacto ensayado y `pull_policy: never`; no depende
  de la resolución futura de un tag del registro.
- Publicación exclusiva en `127.0.0.1:8005`, volumen existente con
  `create_host_path: false`, usuario 1000, memoria 384 MiB y 1 CPU.
- Sin capabilities, `no-new-privileges` y healthcheck HTTP interno.
- `service.env` privado, copiado de las variables efectivas del proceso
  actual. Solo cambia `EDUTICTAC_ID_DB` a `/data/id.db`.
- `docker compose config` validado y su resultado comparado en memoria con
  los valores esperados. Ni los valores ni el resultado con secretos se
  muestran o guardan en Git. Directorio 0700, fichero de entorno 0600.

No se ha creado ningún contenedor de este proyecto Compose ni cambiado la
unidad systemd. No ejecutar `up` hasta la ventana de cambio acordada.

Copia externa cifrada con GPG para los destinatarios actuales de `pass`,
utilizando la clave privada existente para comprobar su recuperación:

- NAS: `samgua@100.91.205.60`, archivo
  `/var/services/homes/samgua/05_Backups/edutictac/commons-id-api/commons-id-before-docker-20261022T113739Z.tar.gz.gpg`.
- Incluye el snapshot consistente previo, código, configuración antigua,
  unidad systemd y la configuración Docker preparada, incluidas sus variables.
- El flujo se cifra antes de guardarse o enviarse al NAS. Directorio NAS 0700,
  archivo 0600. También queda una copia **cifrada** en
  `~/.local/state/edutictac-production-backups/` de debiandesktop.
- Archivo recuperado del NAS y SHA-256 comparado; descifrado correcto;
  base y código coinciden con el manifiesto, SQLite íntegra y 50 identidades.
  La base descifrada solo se escribe en un temporal privado para comprobarla
  y se elimina al terminar. No se extraen archivos arbitrarios del TAR.
- Informe local sin credenciales: `last-recovery-report.json` en el mismo
  directorio. Script puntual conservado como `offsite-backup-before-docker.py`:
  usa este snapshot fijo y **no sirve como copia diaria de datos actualizados**.
- Transferencia por SSH/Python (el intento SFTP/SCP del NAS no funcionó).
  Sin cambios en claves SSH, permisos sudo ni servicios del NAS.

Después de preparar y copiar: identidad, banco y Play mantienen los PID
anteriores y responden HTTP 200. Sin push, despliegue o reinicio.

### Copias periódicas y monitorización activadas

Autorizado el siguiente paso: automatizar copias de datos actuales y comprobar
su recuperación, manteniendo el servicio público existente.

| Lugar | Timer | Frecuencia (Europe/Madrid) |
|---|---|---|
| VPS, root | `edutictac-id-backup.timer` | Diario 03:05, demora aleatoria hasta 5 min |
| debiandesktop, usuario | `edutictac-id-offsite.timer` | Diario 03:35 y cada 2 horas, demora hasta 5 min |
| debiandesktop, usuario | `edutictac-id-monitor.timer` | Cada 5 minutos |

Los timers diarios son persistentes: recuperan una ejecución perdida al volver
a arrancar. La generación en el VPS no depende de que debiandesktop esté encendido.
El traslado al NAS y la monitorización sí dependen de este ordenador y su
gestor systemd de usuario, siguiendo el patrón del backup de `pass`.

Implementación versionada:

- [production-id-backup.py](../scripts/production-id-backup.py): copia consistente
  de `data/id.db` con API SQLite, comprobación de integridad y snapshot autónomo
  sin dependencia de WAL/SHM. Incluye código antiguo, requisitos, configuración
  actual y Docker preparada. Cifra antes de crear el archivo final; manifiesto
  con hashes y metadatos atómicos. Temporales privados eliminados al terminar.
- En el VPS: `/usr/local/libexec/edutictac-id-backup`, clave GPG **solo pública**
  en `/opt/edutictac-id-api/backup-gnupg`, archivos cifrados en
  `/opt/edutictac-id-api/automatic-backups/`. El servicio root usa bloqueo,
  límites de CPU/memoria y no modifica servicios de aplicación.
- [production-id-offsite.py](../scripts/production-id-offsite.py): traslado
  idempotente por SSH, recuperación desde el NAS, hash, descifrado, manifiesto
  e integridad SQLite antes de registrar un éxito. Un fallo no actualiza la
  fecha de la última recuperación correcta. Conserva 30 archivos automáticos
  en origen y destino; no borra las copias manuales previas al despliegue.
- En debiandesktop: `~/.local/libexec/edutictac-id-offsite`, configuración privada
  `~/.config/edutictac-production-backups/config.json`, estado sin credenciales
  en `~/.local/state/edutictac-production-backups/`. No se copian claves privadas
  al VPS ni al archivo de backup.
- Monitor: health de identidad en 8005, estado fallido del servicio de backup,
  último intento de traslado, edad máxima de 36 horas en origen y recuperación,
  disponibilidad del NAS y hash del archivo recuperado. Los fallos dejan el
  servicio en error y quedan en el journal. Por autorización posterior del
  usuario, **Telegram ya está activado**, reutilizando el bot y destinatario
  del helper existente. No se ha modificado n8n.

Primera ejecución de los servicios realizada manualmente antes de habilitar
los timers: copia `id-api-20261022T114604Z.tar.gz.gpg`, recuperación completa
desde NAS y monitor correctos. Segunda ejecución del traslado correcta y sin
duplicados. Timers habilitados con próximas ejecuciones comprobadas.

Validación: 10 pruebas nuevas de backup/monitor más 2 de migración aprobadas;
cubren cambios confirmados en WAL, cifrado real con claves de prueba,
restauración, fallo de cifrado, retención, copia idempotente, corrupción en NAS,
copias caducadas o futuras y rechazo de rutas peligrosas, enlaces y duplicados
en el TAR. Sintaxis Python y unidades systemd validadas.

Comparación final: todas las filas de la base original y PID/estado/fecha de
arranque de identidad, banco y Play iguales al inicio. Health y portadas
públicas HTTP 200. La configuración Docker de identidad sigue sin arrancar.

Estas copias cubren **identidad y su configuración**, no los datos completos
del resto de Commons ni los futuros archivos binarios de Rebost. Ampliar su
cobertura antes de habilitar nuevos almacenes de contenido.

Comprobación operativa sin imprimir secretos:

```sh
# VPS: estado del backup y próxima ejecución
systemctl show edutictac-id-backup.service --property=Result,ExecMainStatus
systemctl list-timers edutictac-id-backup.timer
# debiandesktop: traslado y monitor
systemctl --user show edutictac-id-offsite.service edutictac-id-monitor.service \
  --property=Id,Result,ExecMainStatus
systemctl --user list-timers edutictac-id-offsite.timer edutictac-id-monitor.timer
```

Pendiente antes del corte: concretar el bloqueo de escrituras y acordar la
ventana de cambio. Crear una copia nueva inmediatamente
antes del corte; no usar el snapshot del ensayo como copia de ese futuro corte.

### Avisos Telegram activados y probados

Configuración local: `telegram_enabled: true` y referencia al helper existente
`~/.local/bin/telegram-notify`. Solo se leen sus referencias de almacenamiento
seguro: el token se obtiene de `pass` en memoria y el destinatario de la
configuración existente. No se ejecuta el helper, se copian credenciales ni
se muestran errores HTTP que pudieran contener el token en su URL.

El monitor notifica una vez al pasar a incidencia y una vez al recuperarse.
El estado persistente `alert-state.json`, protegido con bloqueo y escritura
atómica, evita repetir el mensaje cada cinco minutos y sobrevive a reinicios.
Solo confirma el cambio después de una respuesta correcta de Telegram; si
falla el envío, lo vuelve a intentar en la siguiente comprobación. Como en
cualquier entrega HTTP, si se pierde la respuesta tras la entrega podría
repetirse un aviso al reintentar.

Pruebas: 14 tests de backup/monitor aprobados, incluidos transiciones, ausencia
de duplicados en comprobaciones repetidas, reintento de fallo y recuperación,
desactivación y ocultación de errores con credenciales. Monitor real correcto;
mensaje de prueba identificado como tal aceptado por Telegram. No se simula
una caída de producción ni se envían alarmas falsas para probarlo.

Los avisos dependen del monitor en debiandesktop y de su conectividad, igual
que las comprobaciones y el traslado al NAS. El despliegue de identidad sigue
sin ejecutarse en este punto de la preparación; se ejecuta después como se
describe a continuación.

## Fase 1 ejecutada en producción (22-10-2026)

Autorización explícita para continuar después de comprobar que EduHoot no
mostraba partidas activas. Se actualiza únicamente identidad; no se empieza
el portal ni se cambia Authentik, Blocs, Llibres o Play.

- Contenedor: `edutictac-id-production-id-api-1`, imagen exacta ensayada
  `sha256:a719fc1aacfeea1c74052a1d5f31cdfb1c3d7d7a53e7de04b3c37f71f73cb510`.
- Configuración `/opt/edutictac-id-api/docker/compose.yml`, entorno privado,
  volumen existente `/opt/edutictac-id-api/data`, puerto solo loopback 8005.
  Entorno efectivo comparado con lo preparado y healthcheck Docker sano.
- Servicio anterior `edutictac-id-api.service` detenido y deshabilitado al
  completar la validación; código, entorno y unidad conservados para restaurar.
- Imagen transferida desde debiandesktop al VPS, todavía sin publicación en
  registro. No confundir este despliegue con una publicación de imágenes o Git.

Operación del 22-10, **12:48:57–12:49:41 UTC** (44 segundos):

1. Copia actual cifrada y recuperada desde NAS antes de comenzar. Candidato
   creado sin arrancar y configuración nginx preparada y validada sin activarla.
2. Cierre temporal de las únicas rutas públicas del banco que llaman a
   identidad: login de alumnado y gestión docente de credenciales/asignaciones.
   HTTP 503 con mensaje de mantenimiento y `Retry-After`. Catálogo HTTP 200.
   nginx solo se recarga; no se reinician banco, Play o EduHoot.
3. Pausa breve de timers de monitor/traslado para evitar avisos de mantenimiento
   y de generación para no solapar snapshots. Parada controlada de la ID API
   anterior y snapshot consistente nuevo con sus escritores detenidos.
4. Migración con la imagen exacta, sin red ni puertos publicados, sobre el
   volumen real. Comparación de todos los campos preexistentes de todas las
   filas de las cinco tablas originales con el snapshot anterior: idénticos.
5. Arranque del servicio Docker definitivo. Creación de una credencial
   **ficticia y temporal** con el token de servicio del banco. Login real a
   través de Recursos API: PIN incorrecto 401 y credencial correcta 200.
   Eliminación por la API del grupo temporal, credencial y sesión asociadas.
   Nueva comparación completa con el snapshot e integridad correctas.
6. Docker healthy, reapertura de las rutas del banco, retirada de la
   configuración temporal y deshabilitación del arranque del servicio antiguo.
   nginx termina idéntico al fichero previo; no quedan snippets de mantenimiento.
7. Reactivación de timers. Copia posterior al cambio trasladada al NAS,
   recuperada, descifrada y verificada. Monitor correcto y estado Telegram sano.

Al finalizar la migración se conservaron exactamente el grupo y las 50
credenciales previas; cero sesiones, resultados o asignaciones guardados.
No quedaba ninguna cuenta temporal de la comprobación. PID y fecha de arranque
de Recursos API y Play, e ID/fecha de arranque del contenedor EduHoot, idénticos
antes/después. Health de identidad y portadas de banco, Play y EduHoot HTTP 200.

Copias y evidencia privadas:

- Snapshot exacto anterior al corte:
  `/opt/edutictac-id-api/backups/cutover-20261022T124818Z/before-cutover.db`.
- En ese directorio: código/configuración anteriores, manifiesto y `result.json`
  de la operación (`success: true`, sin rollback). No contiene logs públicos.
- Copia manual cifrada del directorio, recuperada y verificada desde NAS:
  `05_Backups/edutictac/commons-id-api/commons-id-cutover-20261022T125158Z.tar.gz.gpg`.
  No está sometida a la retención de archivos automáticos.
- Copia automática posterior: `id-api-20261022T125015Z.tar.gz.gpg`, también
  recuperada desde NAS con integridad correcta.
- Script puntual `/home/samgua/commons-id-cutover.py` y estado privado
  `/opt/edutictac-id-api/backups/cutover-state.json`: **no volver a ejecutarlos**
  sobre este despliegue. Una operación futura necesita preparación nueva.

Una vuelta atrás futura requiere una ventana nueva y comprobar las escrituras
posteriores: no restaurar automáticamente el snapshot del corte si ya hay datos
nuevos. El contenedor debe detenerse antes de restaurar, preservar la base
actual y sus WAL/SHM aparte, y usar la base previa junto con el código antiguo.
Los archivos conservados no autorizan una reversión que descarte actividad nueva.

Siguiente fase, todavía pendiente: preparar `commons.edutictac.es` y el acceso
OIDC docente, conservando las URL de las aplicaciones.

### Limpieza posterior de credenciales de prueba (22-10-2026)

Después de la migración, el usuario confirma explícitamente que las 50
credenciales anteriores eran de prueba y ordena eliminarlas. Todas se habían
creado juntas el 10-09-2026 en el único grupo de `recursos`, con propietario
técnico y sin sesiones, resultados, asignaciones ni itinerarios guardados.

Se ha creado una copia nueva y verificado su recuperación desde el NAS antes
de borrar. La eliminación se realiza por la API existente de baja del grupo,
con autorización de servicio, y retira el grupo de prueba, sus 50 credenciales
y su pertenencia técnica. **No es una pérdida durante la migración**: se
preservaron primero y se eliminaron después por petición expresa.

Estado tras la limpieza: cero grupos, identidades de alumnado, sesiones,
resultados, asignaciones y pertenencias. SQLite íntegra; copia posterior y
monitorización verificadas. La identidad está preparada para dar de alta aulas
reales en la fase del portal. No se han reiniciado aplicaciones para esta baja.
Informe privado: `/opt/edutictac-id-api/backups/test-identity-cleanup-20261022.json`.

## Fase 2: portal candidato aislado preparado (22-10-2026)

La preparación no modifica identidad ni las aplicaciones públicas. DNS de
`commons.edutictac.es` ya apunta al VPS por IPv4/IPv6; no se ha cambiado DNS.
No existían vhost ni certificado propio del dominio; el puerto 8180 estaba libre.

### Perfil reutilizable del portal

- `public/deployment.js` contiene únicamente configuración pública. Por defecto
  mantiene el comportamiento local. El perfil federado configura los enlaces
  públicos de Play, Recursos, EduHoot y Blocs y el origen de Authentik.
- La portada federada se titula EduTicTac Commons en los cuatro idiomas, oculta
  administración y Quiosc y no intenta activar una instalación local. El login
  docente no depende del asistente del instalador. Mientras OIDC no esté activo,
  el botón queda deshabilitado sin presentar instrucciones de administración.
- El perfil nginx `services/portal/nginx/federated.conf` bloquea administración,
  Quiosc, setup y login docente por token. Proxy de identidad a loopback 8005 y
  lectura del catálogo a 8004. No monta sockets de Docker ni servicios del host.
- Las URL configuradas rechazan protocolos ejecutables y credenciales en el URL.
  Las instalaciones locales conservan enlaces, asistentes y favoritos anteriores.

El banco **de producción** devuelve 404 en `/api/teacher/favorites`: no tiene
todavía la ruta existente en desarrollo. Además, su sesión es independiente.
Los favoritos se ocultan por defecto en modo federado; `bankFavorites: true`
solo debe activarse después de desplegar y validar ruta y sesión compatibles.
La búsqueda pública del catálogo funciona. La guía docente aún describe la
cesta local: adaptar esa explicación y su enlace a Recursos antes de publicar.

### Candidato en el VPS

- Directorio `/opt/edutictac-commons-portal/`: Compose, nginx y configuración
  pública. Configuración propia, sin secretos, separada de ID API.
- Imagen `commons-portal:federated-candidate-20261022`, ID probado
  `sha256:46c7d7126cb8d1c64d14cd86e7ed56b02d05cf3477b98af62abe13e46b1c81a8`.
- Contenedor `edutictac-commons-portal-portal-1` sano, red host para alcanzar las
  API ligadas a loopback, **escucha exclusivamente en 127.0.0.1:8180**.
  Límite 128 MiB/0,5 CPU; sin socket Docker, sin montajes de administración.
- No hay proxy público hacia ese puerto, certificado emitido ni proveedor
  Commons creado en Authentik. Se ha verificado con un túnel SSH temporal,
  cerrado al terminar. No anunciar todavía una URL pública utilizable.

Validación: 46 pruebas de navegador aprobadas (perfil federado, idiomas y
recursos/favoritos locales, escritorio y móvil), build docente correcto.
En el candidato real: archivos servidos idénticos a los compilados, enlaces
correctos, bloqueo HTTP de rutas técnicas, salud de API y catálogo público;
interfaz a 393/1024 píxeles sin errores JavaScript ni desbordamiento.
Captura móvil revisada. Comprobaciones asíncronas esperan la inicialización
del panel antes de comprobar el botón de acceso.

Todas las filas de la base de identidad y PID/fecha de arranque de banco y
Play, así como ID/fecha de arranque de los contenedores de identidad y EduHoot,
permanecen iguales. Informes privados `preparation-baseline.json` y
`preparation-result.json` en el directorio del candidato. Monitor de identidad
correcto. Sin push de Git/registro y sin reiniciar las aplicaciones existentes.

### Siguiente paso antes de publicar

1. Crear proveedor y aplicación Commons propios en Authentik, sin cambiar los
   existentes. La organización usa el grupo **professorat**; ID API reconoce
   el rol **profesor**. Resolverlo mediante un mapping específico del nuevo
   proveedor, con autorización para el profesorado real; no importar sin
   adaptar el blueprint del Authentik local ni crear administradores locales.
2. Preparar y probar las variables OIDC de identidad, callback público exacto,
   cookies seguras y permisos de aulas. Conservar la integración actual del
   banco. La cookie común por sí sola no integra las sesiones independientes
   del banco o Blocs: verificar cada contrato antes de darlo por terminado.
3. Adaptar la ayuda al modo federado y el aviso de privacidad al servicio
   central. Publicar el vhost con un **certificado propio** del dominio, sin
   reemplazar el certificado compartido de las aplicaciones existentes.
4. Validar el acceso humano docente, creación de aula y acceso de alumnado
   con código/PIN. No crear cuentas personales o datos de alumnado para
   suplir la aceptación real. No retirar la demo de Play en esta fase.


## Fase 2: portal publicado y OIDC activado (22-10-2026)

El usuario autoriza continuar con este paso. URL pública:
**https://commons.edutictac.es/**; panel docente `/teacher.html`, alumnado
`/student.html`, aviso técnico sobre datos `/privacy.html`.

### Identidad docente

Se crean solamente una aplicación y un proveedor **EduTicTac Commons**, slug
`edutictac-commons`. Los ocho proveedores anteriores conservan su configuración
completa, comparada mediante hashes sin mostrar sus secretos. Cliente
confidencial, autorización por código, callback estricto
`https://commons.edutictac.es/api/auth/oidc/callback`, identificador de sujeto
opaco y clave de firma existente. No se modifica ningún grupo.

Las vinculaciones de acceso admiten `professorat` o administradores de
Authentik. Un mapping propio del scope `commons_roles` devuelve `profesor`
para el grupo docente y `administrador` para superusuarios; no se reutiliza
el blueprint local. Scopes solicitados: `openid profile commons_roles`, sin
solicitar email. Las credenciales nuevas están en almacenamiento seguro,
no en Git ni en archivos públicos.

La API conserva su imagen y puerto 8005. Se añaden variables OIDC, cookies
seguras con dominio `.edutictac.es` y perfiles `play,recursos,eduhoot`. Antes de
activar: copia cifrada nueva, recuperación verificada desde NAS y ensayo sobre
una copia de SQLite en un contenedor temporal 18005. Se verifica descubrimiento,
cliente, callback, scopes y cookie de estado segura; después se retira el ensayo.

Durante la activación se recrea únicamente el contenedor de identidad. Todas
las tablas de SQLite se comparan antes y después y permanecen idénticas;
banco, Play y EduHoot mantienen PID/contenedor y fecha de arranque. La
monitorización se pausa brevemente y se reactiva para evitar avisos de
mantenimiento. No se crean alumnos, grupos ni cuentas de prueba adicionales.

Ensayo y reversión de configuración:
`/opt/edutictac-id-api/oidc-20261022/`, privado. Para revertir este paso, restaurar
el `service.env` anterior y recrear **la misma imagen Docker**, conservando
la base actual y cualquier escritura nueva. No usar el rollback a venv/base
antigua de la fase 1 para deshacer solo OIDC.

### Publicación

Imagen del portal probada:
`sha256:0f0b4ae0c5ef24f3a6edf874f736ebcfbc6328e96e4c8ee8e1fe6c54e01102b7`.
El contenedor continúa escuchando solo en 127.0.0.1:8180. nginx del host añade
un vhost propio; plantilla en `services/portal/nginx/production-vhost.conf`.

Certificado independiente `commons.edutictac.es`, validado con webroot
`/var/www/commons-acme`; renovación por el temporizador existente de certbot
y hook de recarga de nginx. Hashes de los certificados anteriores idénticos.
No se cambia DNS ni se amplía el certificado compartido. Informes privados en
`/opt/edutictac-commons-portal/publication-20261022/`.

La primera sonda HTTP se adelantó a la activación de los nuevos workers de
nginx y recibió una conexión cerrada por el catchall existente. El vhost nuevo
se retiró automáticamente; se comprobó después el challenge desde localhost
y desde fuera, se emitió el certificado y se publicó. Las sondas posteriores
esperan a la disponibilidad efectiva: `nginx -t` y `systemctl reload` no
sustituyen una petición real al vhost. No hubo reinicios de aplicaciones.

### Interfaz y comprobaciones

- Guía docente federada: asignación individual desde el catálogo, sin prometer
  cesta ni documentos privados aún no desplegados en el banco central; enlace
  al dominio real del banco. Comportamiento local preservado.
- Aviso técnico de datos en cuatro idiomas: identificador docente, nombre de
  usuario posible en cookie, alumnado código/PIN, resultados, copias y sesiones.
  Describe los plazos implementados: cookie Commons hasta 180 días y sesión
  adicional de Rebost de ocho horas. No copia el aviso de una instalación de
  centro ni afirma que todas las aplicaciones compartan sesión.
- 50 pruebas de navegador aprobadas, incluyendo escritorio/móvil, guía,
  privacidad, idiomas y regresiones del catálogo y favoritos locales.
- Navegador real contra el dominio público a 393 y 1024 píxeles: sin errores
  JavaScript ni desbordamiento; acceso docente habilitado y redirección a
  Authentik. Sin introducir credenciales ni impersonar a usuarios reales.
- HTTPS validado y catálogo público 200; administración, setup y Quiosc 404.
  Portadas de Recursos, Blocs, Play y EduHoot 200.
- El endpoint de token acepta las credenciales del cliente y rechaza con
  `invalid_grant` un código inexistente: valida el secreto sin crear una sesión.
- Copia cifrada posterior con configuración nueva, recuperación NAS y monitor
  comprobados. No push de Git ni del registro.

### Aceptación pendiente y límites de esta fase

Probar con una cuenta real del grupo docente: iniciar sesión, crear un aula,
entregar un código/PIN y entrar como alumnado. Comprobar la separación entre
las aulas de dos docentes. Esta aceptación no se sustituye por una redirección
correcta ni se da por completada sin una sesión humana.

La cookie de dominio común no demuestra interoperabilidad con las sesiones
independientes de Recursos o Blocs. Favoritos del banco siguen desactivados.
La apertura de actividades Play/EduHoot y el intercambio de resultados todavía
requieren adaptar los contratos y URL del alumnado a sus dominios públicos;
el lanzador actual conserva las rutas/puertos locales. No dar ese recorrido
por validado ni activar Play fuera de demo por haber publicado el portal.
Integración de Rebost en Blocs, Llibres y salida de demo de Play conservan sus
fases posteriores. No continuar con ellas sin acordar el siguiente paso.

## Aviso beta y corrección de guardado en Rebost (22-10-2026)

A petición del usuario, el portal muestra una franja **BETA** en portada,
tauleres, Rebost, acceso a Blocs, ayuda y privacidad. La configuración pública
`releaseStage: "beta"` permite retirarla posteriormente sin cambiar el código;
las instalaciones locales mantienen su configuración anterior. El aviso está
traducido a castellano, valenciano, catalán e inglés. En Privacidad se utiliza
«cuenta de EduTicTac», sin trasladar nombres de componentes al usuario.

El fallo de guardado comunicado por el usuario se reproduce en producción:
una petición POST al Rebost con el origen público correcto devolvía
`403 origin_required` antes de validar la sesión. La API está detrás de un
proxy TLS y no tenía configurado su origen público. Se añade únicamente
`REBOST_PUBLIC_ORIGIN=https://commons.edutictac.es` al entorno privado de ID;
no se desactiva la comprobación de origen ni se amplía indiscriminadamente
la confianza en cabeceras de proxy. Esta configuración es para el portal
central; los futuros proxies desde otras aplicaciones necesitan estudiar su
propio contrato de origen antes de habilitarlos.

Tras copia nueva y recuperación externa verificada, se recrea solo ID con
la misma imagen. El origen público llega ahora a la validación de sesión
(401 sin identificar), mientras un origen ajeno sigue devolviendo 403. SQLite
íntegra y resto de variables preservadas. Estado y configuración previa en
`/opt/edutictac-id-api/rebost-origin-20261022/`, privado. Para revertir una
configuración, conservar siempre la base actual; no restaurar datos anteriores.

Rebost muestra siempre el estado de sesión y ofrece los accesos de cuenta
EduTicTac/código-PIN en los catálogos públicos. Guardar sin sesión explica que
hay que entrar y no simula una copia. Las subidas y copias confirmadas muestran
«Imagen guardada en Mis imágenes». Si la escritura termina pero falla la
recarga del listado, se informa de ambas cosas para evitar duplicados por
reintento; una pérdida de sesión actualiza también el indicador.

Validación: 44 pruebas de navegador de Rebost, beta, privacidad e idiomas,
en escritorio/móvil; dos pruebas de API sobre origen tras proxy TLS y guardas
de escritura/revisión. La prueba de API confirma una subida 201 con el origen
público y rechazo de otro origen sobre datos desechables. No se usan sesiones
personales ni se crean imágenes de prueba en la biblioteca de producción.

Portal publicado con imagen
`sha256:f9b3a2ab9a83d1035102cc5f82aa6c5d355705cd3c052d76dc622f0f6644416c`.
Configuración previa y resultado en
`/opt/edutictac-commons-portal/beta-rebost-20261022/`. No se reinician banco,
Play ni EduHoot. No push de Git ni del registro.


## Renovación visual del portal (22-10-2026)

La portada incorpora una presentación breve, ilustración vectorial propia,
accesos diferenciados para docentes y alumnado e iconos coherentes para las
aplicaciones. Colores verdes y cálidos, tarjetas con más espacio y una jerarquía
común en portada, paneles y Rebost. Se mantiene el aviso beta y el vocabulario
«cuenta de EduTicTac». Las ilustraciones son SVG estáticos del propio proyecto;
no hay fuentes remotas, servicios nuevos ni dependencias adicionales.

Se conservan identificadores, enlaces y contratos de los componentes existentes.
El diseño adapta sus columnas al ancho, mantiene los estilos oscuros del portal,
resalta el foco de teclado y respeta la preferencia de reducir movimiento.
La ilustración decorativa se oculta en pantallas estrechas para priorizar el
acceso a los paneles.

Validación previa: build de Rebost correcto y 134 pruebas de navegador de
portal federado, idiomas, Rebost, alumnado, credenciales y recursos docentes.
Además se revisan portada, panel docente, alumnado y Rebost a 393, 768 y 1440
píxeles y con preferencia oscura: sin desbordamiento ni errores JavaScript.
Capturas de portada móvil/escritorio, modo oscuro y panel docente inspeccionadas.
Despliegue limitado a la imagen del portal; sin cambios de API ni de datos.


Diseño publicado en `https://commons.edutictac.es/` con imagen
`sha256:0faef31c1721c14fe85276accf168307d82a585275b7d7e2c74a9d8831b5b3d7`.
Copia de configuración previa e informe en
`/opt/edutictac-commons-portal/visual-refresh-20261022/` (privado).
La configuración pública, incluido el indicador beta, permanece idéntica.
Identidad, banco, Play y EduHoot conservan sus procesos y fechas de arranque.
La comprobación de aceptación humana del aula y las integraciones posteriores
siguen pendientes como se describe en sus apartados; el cambio es visual.

## Rebost: estilos y traducciones compartidos (22-10-2026)

Rebost carga ahora la misma base visual `/styles.css` del portal mediante
`/assets/commons.css`, un enlace al archivo original. Así siguen funcionando
los selectores servidos por proxies que solo reenvían `/assets/`, sin copiar
la hoja ni exigir nuevas rutas en los editores. Su hoja
`assets/style.css` contiene solo la disposición específica de la biblioteca,
con selectores acotados a `.rebost-page` y variables comunes para colores,
tipografía, controles, foco, tarjetas y modo oscuro. Se unifican cabecera,
selector de idioma CA/VA/ES/EN y paneles. La sesión continúa visible en cabecera,
y las confirmaciones de guardado y accesos a la biblioteca privada se conservan.
Se mejora el contraste del texto sobre botones del tema oscuro común.

Se retira `src/rebost/messages.js`: los textos pasan al espacio `rebost.*` del
sistema común `i18n.js`, consumido con `usePortalTranslations`. Hay traducciones
completas de interfaz en castellano, valenciano, catalán e inglés. El valenciano
ya no se representa internamente como catalán, ni inglés cae automáticamente
en valenciano. Se comparte la preferencia persistida con el portal y se
traducen también avisos que ya estaban visibles. Los selectores incrustados
respetan los cuatro idiomas sin alterar el contrato `rebost-selection`.

Los nombres de imágenes del catálogo utilizan la traducción disponible y una
alternativa explícita si falta; no se traducen automáticamente títulos,
créditos o licencias de recursos de terceros. Los archivos privados mantienen
el nombre elegido por su propietario. No se duplican diccionarios ni se añaden
servicios, dependencias, llamadas de IA o cambios de API/datos.

Verificación: 44 pruebas de portal, idiomas y Rebost aprobadas, más cuatro
casos adicionales en escritorio/móvil para idiomas compartidos, persistencia,
errores reactivos y selección incrustada en inglés. Suite real de Rebost:
21 pruebas aprobadas, incluyendo CRUD desde navegador con backend y archivos
desechables en castellano y valenciano. Capturas revisadas en móvil, escritorio
y tema oscuro. El ensayo usa cuentas sintéticas locales; no modifica bibliotecas
personales de producción. Un test antiguo todavía esperaba ocultar el acceso
al navegar como invitado: se actualiza a la conducta ya publicada de ofrecer
entrada desde cualquier catálogo, preservando la navegación pública.

La comprobación adicional de portabilidad compara la hoja común con su alias
y carga la biblioteca bloqueando la ruta raíz `/styles.css`, como en un proxy
limitado. Los 20 casos finales de navegador de Rebost pasan, incluidos estos
casos en escritorio y móvil. El contraste del botón principal en ambos modos
oscuros, automático y explícito, es 5,11:1.

Actualización publicada con imagen
`sha256:0d109173399c7bf9543ab878bf0b575da159c96c4196eeef7bfe01cfc6781ea9`.
El enlace a la hoja común se verifica también dentro de la imagen Docker.
Copia de configuración previa e informe en
`/opt/edutictac-commons-portal/rebost-unified-20261022/` (privado).
Solo se recrea el portal: identidad, banco, Play y EduHoot conservan sus
procesos; configuración pública y beta idénticas. No push de Git ni del registro.

## Idioma entre Commons, Rebost y Play (22-10-2026)

La preferencia local del portal no cruzaba a `edutictac.es/play/`. Se añade
`assets/language-preference.js`, compartido por portal/Rebost y empaquetado
con el cliente Vue de Play. Solo admite ES/CA/VA/EN. Guarda una preferencia
funcional, sin identidad, en localStorage y en `edutictac_language`, con dominio
`edutictac.es`, Path=/, SameSite=Lax y Secure bajo HTTPS. En instalaciones
locales la cookie es del host. El parámetro `lang` explícito tiene prioridad;
el enlace de Commons a Play lo actualiza al cambiar de idioma. El portal
revisa la preferencia al recuperar el foco o volver desde otra aplicación.
No es autenticación y no cambia sesiones ni permisos. Las aplicaciones que
no consumen esta preferencia aún necesitan revisión: no afirmar persistencia
universal de todas las aplicaciones.

Valenciano comparte la base catalana de Play. `i18n/va.json` contiene solamente
las variantes necesarias (por ejemplo `Verdader`, `teua`, `esta`); no se duplica
el diccionario entero. El cliente de desarrollo combina base y variante y
conserva el formulario durante el cambio. La opción CA sigue disponible.

La versión pública de Play es anterior al cliente Vue. Su selector solo tenía
ES/CA/EN y su estado usaba un almacenamiento independiente. Para corregirla
sin migrar el servidor ni retirar la demo, `scripts/prepare-play-legacy-language.py`
genera un candidato a partir de una copia de sus archivos públicos: añade VA,
reutiliza CA en los diccionarios de los módulos antiguos, incluye el helper y
materializa el diccionario para ese cargador antiguo. Las exportaciones de ese
generador anterior usan la base CA para VA. No se despliega el Vue nuevo ni se
modifican actividades, backend o permisos. Ensayo local del candidato con todos
los POST bloqueados: VA→ES→VA y recarga correctas.

Pruebas: 52 casos de navegador del portal, Rebost e idiomas, incluidos dos casos
con navegación simulada entre los dos dominios en un contexto sin autenticación;
22 casos Vue de Play, incluida variante valenciana y conservación de formulario.

Publicado el arreglo estático en el Play existente y el portal con imagen
`sha256:6be75ab612104155ed52c967d8e939a7c57e2571a87a0fa17ff3a600713ebc5c`.
Copia previa de Compose y archivos públicos de Play, hashes y resultado en
`/opt/edutictac-commons-portal/shared-language-20261022/` (privado).
Se comparan los hashes de origen antes de sobrescribir los archivos públicos.
Solo se recrea el portal; Play, identidad, Recursos y EduHoot conservan PID o
contenedor y fecha de arranque. La configuración pública y el modo demo de Play
permanecen iguales. No se modifican actividades ni se reinicia su servidor.

Verificación pública real con navegador a 393 y 1280 píxeles: Commons en VA →
Play en VA, cambio a ES → vuelta a Commons y Rebost en ES. Sin crear actividades,
iniciar sesiones personales ni escribir resultados. La primera sonda intentó
leer la inicialización de Play antes de terminar la navegación; se corrigió la
espera, y el recorrido completo quedó verificado. Sin push de Git ni del registro.

### Preferencia de idioma: Banc y Llibres (22-10-2026)

El helper `services/portal/public/assets/language-preference.js` comparte la cookie
funcional `edutictac_language` entre subdominios de edutictac.es. No es una sesión.
Se distribuye una copia idéntica en `recursos/scripts/language-preference.js` y
`edutictac-llibres/public/language-preference.js`, para permitir despliegues
independientes sin peticiones a Commons ni dependencias entre servidores.
Actualizar y verificar las tres copias juntas si cambia este protocolo.

El Banc conserva `lang` para el filtro de idioma del contenido. Su interfaz usa
`ui_lang`; `read` y `remember` aceptan la opción `{parameter: 'ui_lang'}`. Los enlaces
del portal al Banc añaden ese parámetro. No convertir enlaces existentes con
`lang=Castellano` en selecciones de idioma de interfaz.

Llibres ofrece ES/CA/VA/EN; CA comparte la base VA con ajustes propios y EN tiene
un diccionario completo. Los textos de las nuevas plantillas, metadatos eXe,
fechas y créditos se adaptan al idioma. Volver desde otra aplicación actualiza la
estantería; durante la edición conserva el idioma del libro abierto hasta volver
a la estantería. Los libros existentes no se traducen ni se modifican por cambiar
la preferencia. No se modifica el núcleo eXe ni las sesiones del alumnado.

Validación local: navegador sobre Llibres con eXe real y libros sintéticos;
pruebas del Banc con filtros/recarga y UI de escritorio/móvil; cookie entre
subdominios HTTPS simulados. Estos cambios no implican despliegue en producción.

Dependencia de publicación detectada en las pruebas: `recursos-api/app/books.py`
solo admitía ES/VA. Se amplía su lista explícita a ES/CA/VA/EN conservando
`ca-valencia`, los validadores de seguridad y la normalización antigua de VA.
El HTML publicado y el índice conservan CA/EN y el lector EN traduce sus controles.
Esta actualización de API también es necesaria al desplegar la interfaz Llibres;
no basta con publicar los archivos estáticos. No requiere cambios de esquema.

Interfaces locales actualizadas en los contenedores existentes con archivos de
código (`docker cp`); Llibres ya monta `public` en lectura. Solo se reinicia la
API local del banco para cargar su compilador; sin cambios de configuración,
credenciales ni escrituras de prueba en sus datos. Las imágenes Docker existentes
conservan el código anterior: al recrear deben reconstruirse desde estos repositorios.
Prueba de navegador real local: Commons 8082 → Banc 8086 → Llibres 8098 → Commons,
correcta en VA/EN/CA/ES; solo GET/HEAD. Producción permanece sin cambios.

Verificación final de esta fase: 34 pruebas de portal/preferencia, 54 de Banc
(escritorio/móvil), 3 de caché de API, 22 de taller Llibres, 4 de portabilidad
Rebost en los cuatro idiomas, 33 de publicación/revisión API y 2 de integración
completa CA/EN (crear → publicar → actualizar → descargar editable → reabrir →
leer desde Banc → retirar conservando borrador), todas correctas.
La prueba de publicación usa SQLite temporal e identidades sintéticas; no publica
libros de prueba en el catálogo local ni en producción.

Commits de los módulos: Banc `b30d903`, API `813e261`. Los commits de esta fase
son locales, pendientes de push y despliegue de producción.


### Llibres: API del Banc conectada y copias ampliadas — 22-10-2026

Fase autorizada tras preparar el editor privado. El Banc pasa de su venv/systemd
al perfil Docker de recursos-api, conservando la misma base y dirección
`127.0.0.1:8004`. Imagen `sha256:4cb010c29a46b4e4dc8f4649d2c04eba813267c2d635806b1252fccb57d83854`.
Unidad antigua desactivada y código conservado para reversión. Perfil y protocolo
operativo: `recursos-api/docs/PRODUCTION_LLIBRES.md`.

Ensayo en copia consistente: todas las filas de las nueve tablas originales
conservadas; mismos contratos públicos, interfaz anterior con favoritos
persistentes, publicación y revisión por aula. Copia cifrada recuperada del NAS.
El primer arranque falló por una lista tmpfs mal expresada: reversión automática
con escrituras bloqueadas, perfil corregido probado completo y nuevo cambio
correcto. No restaurar esa copia antigua después de reabrir escrituras.

La ID API conserva imagen `a719fc…`, datos, cookies y configuración OIDC. Añade
`EDUTICTAC_RESOURCES_API_URL` y `EDUTICTAC_ID_APP_TOKEN`; se convierte a host
network con escucha explícita en `127.0.0.1:8005`. Su red bridge anterior no
alcanzaba el loopback del Banc: los primeros intentos de configuración se
revirtieron; la conexión corregida se ensayó sobre copia de identidad antes de
aplicarse. No se añade proxy ni se expone un puerto adicional. El token permanece
en archivos protegidos y nunca se entrega al navegador. `/api/internal/` se
bloquea en el nginx público del Banc. La pausa de mantenimiento está retirada.

Las copias automáticas existentes admiten opcionalmente `--resources-db` y
`--resources-config`: snapshot del Banc antes de identidad, archivos de Compose y
entorno protegidos dentro del mismo archivo cifrado. Réplica y recuperación NAS
comprueban ambas bases, con la misma retención. Activación mediante drop-in
`/etc/systemd/system/edutictac-id-backup.service.d/resources.conf`; helper anterior
guardado en la preparación privada del Banc. Recuperación combinada posterior
verificada: `id-api-20261022T182922Z.tar.gz.gpg`. Los libros y sus imágenes están en
la base del Banc; documentos generales requieren cobertura al activar su interfaz.

123 pruebas API/configuración, 16 de copias y 6 de permisos; 15 comprobaciones del
perfil Llibres del VPS correctas. Llibres conecta ahora sus rutas API con Commons,
pero mantiene `publication-status=false`, puerto interno 8182 y sin vhost público.
Imagen del editor `sha256:cf0563a8e48c31243daa091765abd96dded5d4b3c4f906720565e8e6a34bee53`.
Salud pública de ambas API, catálogo a través de Commons, permisos anónimos y
redirección docente al proveedor/callback originales comprobados. No se ha
utilizado una cuenta real ni publicado libros de prueba en producción.

El frontend público del Banc se actualizó después a Vue, con consulta y lector
de libros, como se detalla a continuación. Pendientes: HTTPS de Llibres, habilitar publicación y comprobar
el recorrido con cuentas reales. Play y EduHoot permanecen intactos; no retirar
el modo demo de Play. No afirmar validación humana de sesión/aula por comprobar
solamente una redirección.

### Banc público preparado para Llibres — 22-10-2026

`https://recursos.edutictac.es/` sirve ahora el frontend Vue. Se conservan los
JSON públicos y sus medios originales en `/var/www/recursos/`; la nueva raíz
`/var/www/recursos-current` apunta atómicamente a
`/var/www/recursos-releases/20261022-vue-llibres-cachefix`, con enlaces a datos,
informes, imágenes y motores existentes. No se modifica SQLite ni se reinician
contenedores o Play; nginx se recarga para cambiar la raíz.

Consulta pública de libros, filtro Llibres y lector con sandbox sin scripts
comprobados. Los hashes de catálogo e informe siguen iguales; portadas y salud
de API/Commons/Play/EduHoot correctas. 90 pruebas de interfaz, 4 de caché, 2 de
paquete, 2 de regresión y 7 comprobaciones finales sobre HTTPS público correctas.
El ensayo completo en el VPS confirma que un navegador con el worker anterior
actualiza al shell Vue y recibe HTML/JS de la versión actual en su caché.

Worker final `recursos-v1.24.4`: la precarga fuerza `cache: "reload"` para evitar
mezclar archivos antiguos de la caché HTTP durante la actualización. La versión
inicial `v1.24.3` queda superada por esta corrección. Configuración, línea base y
resultados privados en `/var/backups/edutictac/recursos-vue-20261022/`.
Procedimiento, pruebas y retirada segura en el repositorio de Recursos:
`docs/PRODUCTION-FRONTEND.md`.

Llibres conserva su perfil privado 8182 y publicación desactivada. El siguiente
paso sigue siendo dominio HTTPS independiente y aceptación con cuentas reales;
no se ha publicado ningún libro ni creado cuentas para estas comprobaciones.

### Llibres público con HTTPS — 22-10-2026

La fase anterior se ha completado: `https://llibres.edutictac.es/` está publicado
con vhost y certificado propios. IPv4 e IPv6 devuelven 200 con TLS válido. Los
14 certificados previos conservan sus hashes. La renovación por webroot y el
hook exclusivo de recarga de nginx se han ensayado correctamente.

El frontal HTTPS habilita los controles de publicación; el contenedor conserva
su perfil privado en 127.0.0.1:8182 con indicador desactivado. Los permisos siguen
en Commons: acceso docente individual, alumnado con código/PIN de aula y revisión
por su docente responsable. No hay cambios de cookies, secretos, API o datos.
Los contenedores y Play conservan identificador/arranque; solo se recarga nginx.

28 comprobaciones distintas correctas, incluidas 17 sobre el perfil HTTPS y
Rebost real, 2 de edición/descarga/reapertura sobre HTTPS, 1 de publicación con
editor público y API temporal, 2 de revisión con sesiones temporales y 6 de
permisos de Commons. Las pruebas no crean cuentas ni libros en producción.

Pendiente: aceptación humana con cuenta docente real, aula/código/PIN, envío,
aprobación y lectura pública en el Banc. Las redirecciones al proveedor y las
pruebas con identidades sintéticas no sustituyen esa aceptación.
Procedimiento y retirada en `edutictac-llibres/docs/PRODUCTION.md`; línea base y
resultados privados en `/opt/edutictac-llibres/https-activation/`.
