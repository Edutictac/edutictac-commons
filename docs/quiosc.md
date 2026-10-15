# EduTicTac Quiosc: prototipo supervisado

Implementación integrada en `commons-id-api` y `commons-portal`. No requiere
paquetes, configuración permanente ni agentes nuevos en los clientes. Envía
código Python temporal por la conexión de sesión de Epoptes existente. **No es
un modo examen seguro**: inicia Firefox en quiosco básico; no aísla KDE ni limita
la navegación. La primera entrega conserva lo funcional sin declarar bloqueos
que no se han implementado ni comprobado.

## Auditoría y decisión técnica

Commons usa FastAPI, SQLite, cookies firmadas docentes y Authentik/OIDC en
`services/id-api/main.py`. El portal es HTML/JS/CSS servido por nginx; `/api/`
se dirige a id-api. Quiosc reutiliza `require_teacher` y
`require_group_access`, tanto para consultar como para ejecutar y recuperar.
No se ha usado `admin/server.py`, cuyo acceso y privilegios operativos son
más amplios de lo que este módulo necesita.

Fuentes inspeccionadas y versiones fijadas para reproducir el análisis:

- [Fork LliureX, commit 2c16370](https://github.com/lliurex/epoptes/tree/2c16370bae80de8e79c50190f5ff7286693aad4d).
- [Upstream, commit 03d0ec2](https://github.com/epoptes/epoptes/tree/03d0ec2ceab2c5bafab79fb686f912c88b477183).
- En ambos, `epoptes/daemon/commands.py`, `guiplex.py`, `uiconnection.py`,
  `bashplex.py`, `exchange.py`; `data/client-functions`; `bin/epoptes`;
  `twisted/plugins/epoptesd.py`.
- [Documentación de Epoptes](https://epoptes.org/).
- [Mozilla: alcance del modo quiosco](https://support.mozilla.org/en-US/kb/firefox-enterprise-kiosk-mode)
  y [parámetros de Firefox](https://firefox-source-docs.mozilla.org/browser/CommandLineParameters.html).
- [KAuthorized](https://api.kde.org/kauthorized.html) y
  [claves KDE Kiosk](https://develop.kde.org/docs/administration/kiosk/keys/).

El socket GUI por defecto es `/run/epoptes/epoptes.socket`. Habla **Twisted AMP**,
no HTTP/REST: `EnumerateClients` devuelve una lista de handles de conexiones;
`ClientCommand(handle, command)` devuelve `result` y `filename`. Las conexiones
reciben avisos `ClientConnected`/`ClientDisconnected`. Las respuestas grandes
se escriben en ficheros del servidor: Quiosc las rechaza y nunca abre rutas
indicadas por el interlocutor. Los handles son IP:puerto efímeros, no IDs de PC.
`info` permite asociarlos con MAC y UID y distingue la conexión de sistema
(uid=0) de las de usuario. Quiosc excluye las de sistema y rechaza asociaciones
ambiguas. Una respuesta vacía no se considera ejecución correcta.

Epoptes entrega órdenes a un intérprete del cliente, y su función `execute`
las lanza en segundo plano sin confirmar el resultado final. Quiosc usa
`ClientCommand` con una invocación fija de `python3 -c`, argumentos JSON y
`shlex.join`; recoge una respuesta con marcador `QUIOSC:`. No expone una API
para comandos libres. El encuadre AMP se implementa con biblioteca estándar,
sin añadir Twisted al contenedor; las pruebas usan un servidor Twisted real
como contraparte independiente.

**El fork revisado no demuestra qué paquete lleva cada instalación LliureX
23**. No hay un aula LliureX ni socket Epoptes real en este entorno. Hay que
registrar las versiones instaladas y comparar sus declaraciones AMP antes del
piloto. El protocolo coincide en los dos commits estudiados. No se presupone
compatibilidad con forks futuros o paquetes modificados.

Upstream contempla SSH y reenvío de socket Unix en `bin/epoptes`; el fork
LliureX revisado conecta localmente. Esto no garantiza acceso SSH en un centro.
Quiosc consume un socket local o ya reenviado; no abre conexiones SSH ni
administra claves desde el navegador.

## Capacidad implementada y límites

| Nivel | Qué significa | Esta versión |
|---|---|---|
| Pantalla completa | Ocultar parte de la interfaz del navegador | No se usa como prueba de aislamiento |
| Quiosco básico | `firefox --kiosk` con perfil separado | Implementado; efecto visual pendiente de aula |
| Escritorio parcialmente restringido | Restringir KDE o atajos | No implementado |
| Examen aislado | Prohibir otras aplicaciones, navegación y escapes con pruebas | No disponible |

Firefox se ejecuta con `--no-remote --new-instance --profile … --kiosk URL`.
El perfil temporal está separado del perfil habitual, conserva formularios y
multimedia normales y permite identificarse en Aules desde cero. No se cambia
la configuración global, no se mata Firefox por nombre, no se cierra la sesión
KDE y no se detienen aplicaciones ajenas. Chromium también ofrece modos
`--kiosk`/`--app`, pero no aporta aislamiento de escritorio por sí solo; no se
ha añadido un segundo backend de navegador sin validar su recuperación.

KDE Kiosk/KAuthorized limita acciones de aplicaciones que lo consultan. Las
restricciones URL de KDE no filtran las peticiones de Firefox. Un
`XDG_CONFIG_HOME` nuevo en Firefox no reconfigura los servicios Plasma/KWin ya
iniciados. Cambiar `kdeglobals`, detener Plasma o bloquear atajos globalmente
sin una restauración demostrada no cumple los requisitos de esta entrega.
No se aplican esas modificaciones.

En X11, otras aplicaciones del usuario comparten sesión gráfica; Firefox no
impide Alt+Tab, terminal, menú, otras aplicaciones ni cambio de escritorio.
En Wayland, un cliente tampoco controla por sí solo los atajos del compositor;
las herramientas X11 no controlan toda la sesión. La primera versión **rechaza
Wayland**, escritorios distintos de KDE/Plasma y sesiones sin DISPLAY. Una
sesión X11 compatible significa solo que se puede intentar el quiosco básico.

No hay lista blanca efectiva de navegación, prohibición de nuevas pestañas,
ventanas, Ctrl+L, Alt+F4, terminal o aplicaciones. Algunos controles visuales
pueden desaparecer por `--kiosk`, pero no se declara ningún atajo bloqueado.
Políticas empresariales Firefox instaladas globalmente afectarían otras
sesiones y requieren preparación del cliente: no se despliegan. La alternativa
mínima es usar este modo supervisado, Epoptes y las restricciones ya administradas
por el centro. Para aislamiento suficiente se necesita una sesión dedicada
preparada por la administración y controles del sistema/red previamente
validados; eso queda fuera del requisito de cero configuración del alumnado.

## Arquitectura y archivos

- `services/id-api/quiosc/epoptes.py`: transporte AMP acotado, descubrimiento,
  exclusión de root, tratamiento de avisos, errores y tiempos de espera.
- `remote.py`: validación HTTP(S), duración y acciones cerradas; construcción
  de comandos escapados sin shell proporcionada por el frontend.
- `student.py`: código enviado al cliente, comprobación KDE/X11/Firefox,
  perfil temporal, supervisor local con duración máxima y cierre de su grupo
  de procesos. No se instala en disco ni se añade a autostart.
- `service.py`: inventario autorizado, sesiones SQLite y registro de acciones;
  se guarda la intención antes de enviar una orden y se conservan los estados
  inciertos para recuperación después de un reinicio del contenedor.
- `api.py`: rutas protegidas por sesión docente, membresía del grupo y cabecera
  CSRF; `recover.py`: recuperación administrativa sin interfaz web.
- `services/portal/public/quiosc.{html,js}`: panel integrado, selección,
  preparación, duración, sesiones anteriores y restauración por equipo.
- `services/id-api/{Dockerfile,.dockerignore,main.py}`, `services/portal/{nginx/default.conf,public/teacher.html}`:
  empaquetado y enlaces de integración.
- `compose.quiosc.yml`, `config/quiosc/rooms.example.json`: despliegue optativo.
- `tests/test_quiosc.py`, `tests/requirements-quiosc.txt`,
  `tests/browser/quiosc.spec.js`, `scripts/test-quiosc-docker.py`: pruebas.

Las aulas de equipos se configuran por administración; se vinculan a grupos
Commons existentes. La gestión docente de miembros del grupo se reutiliza.
No hay edición web de MAC/UID ni descubrimiento indiscriminado accesible al
docente. Cada MAC/UID solo puede pertenecer a un aula del inventario y solo
puede tener una sesión pendiente, incluso ante peticiones concurrentes.
Un PC desconectado sigue figurando en el inventario con estado desconocido.

## Configuración Docker: mismo servidor

No se modifica el stack activo automáticamente. Primero probar simulación.
Desde la raíz del repositorio:

1. Crea un grupo Commons y apunta su ID (no el código público del alumnado).
   Configura las personas docentes autorizadas con la gestión existente.
2. Copia `config/quiosc/rooms.example.json` a un fichero administrativo fuera
   del árbol público. Sustituye `group_id`, MAC y UID del usuario del alumnado.
   La MAC debe coincidir con `info` de Epoptes. Si cambia el usuario/UID, actualiza
   el inventario una vez finalizadas las sesiones. No uses UID 0.
3. Consulta, sin alterar permisos del host:

   ```bash
   stat -c '%a %u %g %n' /run/epoptes /run/epoptes/epoptes.socket
   dpkg-query -W epoptes epoptes-client
   ```

4. Configura variables del servidor (ejemplo sin credenciales):

   ```bash
   export QUIOSC_MODE=simulation
   export QUIOSC_SOCKET_DIR=/run/epoptes
   export QUIOSC_SOCKET_GID="$(stat -c '%g' /run/epoptes/epoptes.socket)"
   export QUIOSC_ROOMS_FILE=/ruta/administrativa/rooms.json
   docker compose -f compose.yml -f compose.quiosc.yml config --quiet
   docker compose -f compose.yml -f compose.quiosc.yml build id-api portal
   docker compose -f compose.yml -f compose.quiosc.yml up -d --no-deps id-api portal
   ```

El override exige que los directorios/ficheros existan: Docker no los crea
silenciosamente. Monta el directorio del socket en lectura sola para tolerar
que Epoptes recree su socket. La API corre con el UID/GID habitual de Commons
más el GID numérico del socket. El usuario necesita atravesar el directorio y
conectar al socket; si sus permisos no lo permiten, la administración del
servidor debe resolverlo. No se usa `chmod 777`, root, contenedor privilegiado,
red del host en ejecución ni socket Docker en este módulo.

**Lectura sola del volumen no limita las órdenes Epoptes**: el socket concede
potencial ejecución de sistema a quien pueda conectarse. El adaptador usa solo
sesiones de usuario, pero un compromiso de id-api con acceso al socket sería
un riesgo elevado. No conectes aulas a una demo expuesta públicamente con token
docente de desarrollo. Usa la autenticación de producción ya configurada,
HTTPS y acceso de red administrado. El modo real rechaza claves de firma Commons de menos de 32 caracteres y el
acceso por token docente de menos de 24 caracteres. Configura valores aleatorios
de producción en su almacenamiento seguro; no los muestres ni los incluyas en
Git. Con OIDC, el token compartido no es necesario para entrar a Quiosc.
El token compartido de demo no distingue
profesores; todos sus usuarios comparten las autorizaciones de esa identidad.

Para simulación sin servidor Epoptes basta crear un directorio privado vacío
en el **servidor Docker** y usarlo como `QUIOSC_SOCKET_DIR`, con el GID del
proceso de id-api. No se espera ni crea un socket y no se envían órdenes.
La API normal incluye Quiosc desactivado si no hay override.

Después de revisar el inventario y la versión Epoptes, cambia
`QUIOSC_MODE=real` y recrea solo id-api con el mismo override. Comprueba desde
el panel `/quiosc.html` la conexión y los requisitos de cada PC. No se instala
Python, Firefox ni ninguna dependencia si faltan en el cliente: se marca
incompatible o desconocido. Las imágenes construidas aquí son pruebas locales;
para distribución se deben publicar `commons-id-api` y `commons-portal` con un
nuevo tag mediante el flujo existente de imágenes del proyecto. El `.deb` no
actualiza su código en ejecución. Mantén el override en futuras actualizaciones;
puedes persistir su selección mediante `COMPOSE_FILE=compose.yml:compose.quiosc.yml`
en la configuración administrada del despliegue. Verifica que los scripts del
centro preservan esa selección antes de actualizar.

Variables: `QUIOSC_MODE=disabled|simulation|real` (por defecto disabled, simulation
en el override), `QUIOSC_SOCKET` (ruta interna), `QUIOSC_ROOMS_FILE` (ruta JSON),
`QUIOSC_DB=/data/quiosc.db`; el override utiliza además `QUIOSC_SOCKET_DIR` y
`QUIOSC_SOCKET_GID`. Usa una única instancia de id-api y un único worker uvicorn
como en el despliegue existente. El índice SQLite impide inicios simultáneos
sobre un equipo, pero esta versión no coordina operaciones entre varias réplicas.

## Servidores distintos: socket reenviado por SSH

Requiere conectividad SSH, host key verificada, una cuenta autorizada para
conectar al socket remoto y permiso de reenvío Unix en sshd. No se presupone
que estén disponibles. Si hay firewall, ausencia de SSH o política
`AllowStreamLocalForwarding no`, no funciona con solo actualizar Docker.
La configuración mínima se hace en los servidores, nunca en los PC del alumnado.

Ejemplo que ejecuta manualmente la administración en el host Docker (sustituir
cuenta/host por los verificados en el centro; no contiene contraseñas):

```bash
install -d -m 700 "$HOME/.local/run/quiosc-epoptes"
ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o ExitOnForwardFailure=yes \
    -o ServerAliveInterval=15 -o ServerAliveCountMax=3 \
    -o StreamLocalBindMask=0177 \
    -N -L "$HOME/.local/run/quiosc-epoptes/epoptes.socket:/run/epoptes/epoptes.socket" \
    cuenta-autorizada@servidor-epoptes
```

Ejecuta el túnel con el mismo UID que id-api/PUID para que el socket 0600 sea
accesible al contenedor. Usa su GID en el override y el directorio anterior como
`QUIOSC_SOCKET_DIR`. Con otros UID se requiere una política de permisos/ACL
administrada explícitamente. No se montan claves SSH en el contenedor. Un
socket local creado no demuestra acceso al remoto: «Comprobar equipos» hace
`EnumerateClients` y confirma el protocolo a través del túnel. Si SSH termina,
el panel debe mostrar desconocido; la duración local sigue cerrando Firefox.
No borres sockets usados por otros servicios. La persistencia del túnel mediante
un servicio del host queda a criterio de la administración; no se instala aquí.

## Estados, evidencias y recuperación

`available` solo confirma requisitos; `starting` no confirma navegador;
`basic_kiosk` confirma supervisor y proceso Firefox observados por el cliente;
`restoring` indica cierre en curso;
`unknown` cubre desconexión, permiso denegado, respuesta vacía o no verificable;
`finished` se emite tras terminar los procesos propios y retirar su perfil;
`error` requiere revisión. Todos los estados simulados llevan prefijo
`simulation_`. Ningún estado representa «equipo bloqueado». Las observaciones
persistidas tienen fecha; pulsa «Consultar estado real» para actualizarlas.
No hay polling automático ni captura de pantalla.

El supervisor temporal dura exclusivamente la actividad y usa reloj monotónico,
una exclusión local `flock`, perfil privado y un grupo de procesos separado.
Recibe la petición de cierre mediante un marcador en su directorio privado;
termina únicamente su grupo de procesos con TERM y después KILL, retira el
perfil y registra el resultado. No se confía en un PID antiguo para matar
procesos desde otra invocación. El líder del grupo se mantiene sin recoger
hasta terminar el cierre, evitando reutilización de su PID. Los reintentos con
el mismo ID son idempotentes; una cancelación previa deja un marcador que
impide un inicio retrasado con ese mismo ID.

Un corte de red o reinicio de Docker no detiene la duración local. El panel
retiene intenciones/resultados en `/data/quiosc.db`; descubre de nuevo el
handle mediante MAC/UID al recuperar. No presupone que el equipo se restauró
porque venció un temporizador del servidor. La auditoría SQLite contiene actor,
acción, ID de sesión/equipo, fecha y estado; no URL ni salida de comandos.

Desde el servidor, sin depender del navegador del alumno ni del profesor:

```bash
docker compose -f compose.yml -f compose.quiosc.yml exec -T id-api \
    python -m quiosc.recover ID_SESION --device pc01
```

Omitir `--device` intenta recuperar todos los equipos. La operación queda
registrada como `local-administrator`; devuelve código distinto de cero si no
se confirma el cierre. Se exige mantener `QUIOSC_MODE=real` para recuperar
sesiones reales. No borres la base de datos para liberar un equipo incierto.

Si muere el supervisor, un corte eléctrico elimina `/tmp`, o hay manipulación
por el usuario local, no se puede certificar la restauración: se informa
`unknown`. El administrador conserva el Epoptes original y puede acceder al
escritorio, cerrar la ventana de esta actividad e inspeccionar el proceso cuyo
argumento `--profile` apunta exactamente a
`/tmp/edutictac-quiosc-UID/ID_SESION/profile`. Verifica usuario, PID y argumentos
antes de terminarlo; nunca uses `killall firefox`, `pkill -f firefox` ni borres
perfiles ajenos. Tras verificar el cierre, solo el directorio temporal de esa
sesión puede eliminarse. No se han bloqueado KDE ni los atajos, por lo que este
fallo no deja un escritorio bloqueado por Quiosc. El borrado administrativo de
registros inciertos y la limpieza de metadatos antiguos están pendientes: no
se libera un equipo automáticamente sin confirmación.

Los ficheros de estado pertenecen al mismo usuario del alumnado: su contenido
y los procesos pueden manipularse. Esta evidencia sirve para operación, no
para probar aislamiento ante un alumno adversarial. Epoptes puede registrar las
órdenes completas, incluida la URL: no introduzcas tokens, contraseñas, tickets
SSO ni enlaces secretos. Se rechazan credenciales URL y nombres evidentes de
parámetros sensibles, pero esa validación no detecta secretos arbitrarios.
La biblioteca estándar Python 3, Firefox, `/proc` y `flock` vía `fcntl` deben
existir ya en los clientes. Los perfiles temporales no guardan el login de la
sesión habitual, y al cerrar se descartan: guarda las respuestas primero.

## Procedimiento exacto de validación en LliureX 23

Usa dos equipos de prueba, con documentos abiertos guardados y sin alumnado
en un examen real. No basta una prueba desde el host Docker.

1. En servidor y clientes, registra `dpkg-query -W epoptes epoptes-client` donde
   estén instalados. En una terminal de la sesión del alumno registra
   `printf '%s\n' "$XDG_SESSION_TYPE" "$XDG_CURRENT_DESKTOP"`, `id -u`,
   `python3 --version`, `firefox --version` y `plasmashell --version`.
   No muestres variables de entorno completas. Compara los archivos instalados
   `commands.py` y `client-functions` con los commits de la auditoría. Anota
   versión LliureX, Firefox y Plasma; no des por supuesto X11.
2. Comprueba desde la consola Epoptes existente que ambos usuarios aparecen y
   se puede ejecutar una orden inocua como `id -u`. No uses la conexión root.
   Obtén MAC/UID desde su información e incorpora esos valores al inventario.
3. Activa primero `simulation`. Entra como docente con acceso al grupo y
   verifica selección individual/todos, duración y cierre. Otro docente sin
   membresía y una sesión de alumno deben tener acceso denegado. El panel debe
   indicar SIMULACIÓN y no debe abrirse ninguna ventana en los clientes.
4. Activa `real`, recrea id-api y pulsa «Comprobar equipos». Ambos deben tener
   sesión de usuario única, KDE/X11 y Firefox >=71 ya instalado. Quita Epoptes
   o corta el túnel solo en la prueba: la consulta debe fallar o mostrar
   desconocido, nunca «bloqueado». Restablece la conexión.
5. Selecciona un PC, URL Aules de prueba y duración de 1 minuto. Debe abrirse
   un Firefox separado sin cerrar el existente. Comprueba visualmente quiosco,
   login, certificado institucional, cuestionarios, audio/vídeo, formularios,
   autoguardado y envío. Registra cualquier fallo. «Proceso observado» por sí
   solo no valida estos aspectos.
6. Ejecuta y registra **cada escape**, tanto en X11 como, si está disponible,
   en Wayland (donde Quiosc debe rechazar el inicio):

   | Prueba manual | Qué comprobar | Estado de validación real |
   |---|---|---|
   | Alt+Tab / Alt+Esc / Meta+Tab | Cambio a otra aplicación/escritorio | Pendiente; no se implementa bloqueo |
   | Ctrl+Alt+T / Alt+F2 | Terminal y KRunner | Pendiente; no se implementa bloqueo |
   | Meta / menú de aplicaciones | Lanzar Dolphin y otra aplicación | Pendiente; no se implementa bloqueo |
   | Ctrl+T / Ctrl+N / Ctrl+L | Pestañas, ventanas y dirección | Pendiente; no se garantiza bloqueo |
   | Alt+F4 / Ctrl+Q / F11 / Escape | Cierre/salida/pantalla completa | Pendiente; sin garantías de bloqueo |
   | Enlace externo / popup / redirección / descarga | Navegar fuera de la actividad | Pendiente; no hay filtro de destinos |
   | Ctrl+Alt+Fn / reinicio / cierre de sesión | Salida de la sesión gráfica | Pendiente; sin restricción del sistema |

   Abrir una URL autorizada no restringe sus enlaces ni sus recursos. Registra
   origen, redirecciones y proveedores multimedia de Aules para cualquier
   futura lista blanca; esta entrega no la aplica. No consideres superado un
   bloqueo porque no aparezca un botón en pantalla.
7. Finaliza desde el panel y luego repite desde
   `python -m quiosc.recover`. Solo debe cerrarse la instancia de Quiosc;
   documentos, terminal y Firefox previos deben conservarse. Verifica que
   desaparece exclusivamente `…/ID_SESION/profile`. Repite cierre dos veces.
8. Ejecuta en ambos PC, desconecta uno, finaliza la sesión: el conectado debe
   cerrarse y el otro quedar desconocido. Recupera conexión y pulsa restaurar
   ese equipo; una respuesta vacía nunca debe finalizarlo. Prueba también el
   caso de dos sesiones de usuario con igual MAC/UID: debe quedar ambiguo.
9. Con duración de 1 minuto, interrumpe la conexión del módulo/túnel después
   del inicio. Firefox debe cerrarse localmente al vencer el tiempo. Reinicia
   únicamente el contenedor de prueba de id-api: las sesiones deben seguir
   consultables y recuperar estado mediante Epoptes. No reinicies el stack
   de producción para esta prueba.
10. En un PC de laboratorio, termina el supervisor temporal de la sesión de
    prueba (identifica el proceso Python y el ID antes de hacerlo). La consulta
    debe indicar desconocido, nunca restaurado. Sigue la recuperación
    administrativa descrita arriba. Esta prueba documenta el límite del
    watchdog temporal; no constituye una garantía ante manipulación local.

Todos estos resultados de aula están **pendientes**. La ausencia de paquetes
nuevos está implementada en el diseño: ante una dependencia ausente no se
intenta instalarla. Debe confirmarse igualmente en el piloto.

## Pruebas reproducibles y resultados del entorno de desarrollo

```bash
python3 -m venv /tmp/commons-quiosc-test
/tmp/commons-quiosc-test/bin/pip install -r tests/requirements-quiosc.txt
/tmp/commons-quiosc-test/bin/pytest -q tests/test_quiosc.py
npx playwright install chromium
npx playwright test tests/browser/quiosc.spec.js
docker build --network=host -t commons-quiosc-id-api:test services/id-api
docker build -t commons-quiosc-portal:test services/portal
python3 scripts/test-quiosc-docker.py
```

Las pruebas de cliente usan un Firefox ficticio que no dibuja ventanas. Validan
lanzamiento y cierre del proceso, idempotencia, temporización local independiente
del servidor, preservación de un proceso ajeno y eliminación del perfil. No
comprueban atajos, renderizado, restricciones web ni Aules. Las pruebas AMP usan
un servidor Twisted real con declaraciones del protocolo oficial, sin ejecutar
órdenes sobre clientes reales. Las pruebas del panel interceptan las respuestas
API; la prueba Docker comprueba además API y autenticación Commons reales.

La prueba Docker crea una red, contenedores e identidad de prueba efímeros, con
puerto localhost asignado automáticamente; los elimina al terminar. No monta
volúmenes existentes, no lee `.env`, no usa datos del centro ni modifica
servicios activos. Usa valores sintéticos de autenticación exclusivamente en
esos contenedores.

Resultados ejecutados el 2026-10-15:

- 23 pruebas específicas Python aprobadas (incluyen servidor Twisted AMP real,
  autorización, CSRF, errores parciales, ambigüedad, tiempos de espera,
  recuperación tras fallo, pérdida de supervisor y navegador ficticio).
- 1 prueba adicional optativa de Docker/AMP aprobada: id-api sin red y como
  usuario no root conecta al servidor Twisted por un volumen Unix en lectura
  sola. Se ejecuta tras construir la imagen con
  `QUIOSC_DOCKER_TEST=1 /tmp/commons-quiosc-test/bin/pytest -q tests/test_quiosc.py -k docker_image`.
- 4 pruebas Playwright de Quiosc aprobadas: escritorio y móvil.
- Ambas imágenes construidas; prueba Docker aislada aprobada con login
  Commons, autorización de grupo, origen HTTP con puerto, simulación, recuperación
  por CLI y API, página servida y `nginx -t`.
- Override Compose validado usando valores sintéticos y `--env-file /dev/null`;
  comprobaciones de sintaxis Python/JS y `git diff --check` aprobadas.
- Regresión ampliada del portal (`language.spec.js` y
  `teacher-play-launch.spec.js`): 10 aprobadas y 10 fallidas. Dos causas previas:
  `#teacherLogout` ya no existe y falta el enlace esperado «Abrir recurso».
  Ambas se reprodujeron en una extracción limpia de HEAD, sin Quiosc. No se han
  modificado esas pruebas ni funciones ajenas para ocultar los fallos.
- La biblioteca de pruebas emite una advertencia de deprecación de
  Starlette/TestClient/httpx; no afecta a los resultados.

 No hay validación de socket/paquete Epoptes de un centro,
reenvío SSH real, efectos gráficos KDE/Firefox ni exámenes Aules. No hay captura
de pantalla, cámara ni micrófono del alumnado. La interfaz inicial está en
español; traducción al resto de idiomas del portal pendiente.


## API docente

Todas las rutas usan la identidad docente Commons. Las aulas visibles y las
sesiones requieren acceso al grupo asociado. Las peticiones POST exigen
`X-Quiosc-Request: 1` y rechazan un `Origin` distinto del host de la petición.
No se habilita CORS.

| Ruta `/api/quiosc` | Acción |
|---|---|
| `GET /rooms` | Modo y aulas autorizadas |
| `GET /rooms/{id}/devices` | Comprobar conexión y requisitos de equipos configurados |
| `GET /rooms/{id}/sessions` | Últimas 100 sesiones del aula y grupo |
| `POST /sessions` | `{room_id, devices: [id], url, seconds}`; 60–14400 s |
| `GET /sessions/{id}` | Últimas observaciones persistidas, sin ejecutar órdenes |
| `POST /sessions/{id}/refresh` | Consultar evidencia remota actual; cuerpo `{}` |
| `POST /sessions/{id}/stop` | Restaurar todos (`{}`) o uno (`{device_id}`) |

Los errores HTTP distinguen falta de sesión (401), CSRF/origen (403), aula o
sesión no autorizada (404), equipo con sesión pendiente (409), validación (400
/422) y Epoptes/configuración no disponible (503). Los errores individuales
aparecen en cada equipo; HTTP 200 no significa que todos hayan iniciado o
terminado correctamente. Inspecciona siempre los estados.
