# Despliegue federado de Commons en producción (edutictac.es)

Estado: **fase 1 desplegada y validada el 22-10-2026: identidad funciona en
Docker, con copias automáticas, recuperación NAS y avisos activos.** Banco,
Play y EduHoot no se han reiniciado. Fase 2: portal candidato preparado en
loopback; OIDC y publicación del dominio todavía pendientes.
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

Preparación del portal completada en el apartado final. El dominio no se ha
publicado todavía ni se ha creado el proveedor OIDC central.

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
