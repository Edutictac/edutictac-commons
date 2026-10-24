# Paquete `.deb` para Ubuntu

El paquete `edutictac-commons` instala el stack Commons en Ubuntu amd64 y
prepara un servicio systemd. Las imágenes Docker no se incluyen dentro del
`.deb`: se descargan del registro OCI configurado, lo que mantiene el paquete
pequeño y permite actualizar las imágenes sin reinstalar el instalador.

## Construir el paquete

Desde el repositorio:

```bash
./packaging/build-deb.sh
```

El artefacto aparece en `dist/`. La versión actual es `0.1.1~alpha30`, con
imágenes Commons `0.1.1-alpha27` y selector de módulos. Incluye los scripts
de preparación local de Epoptes; Quiosc sigue desactivado por defecto.

## Instalar desde el repositorio APT

El repositorio oficial publica siempre las versiones disponibles del
instalador para Ubuntu/Debian `amd64`. La clave se instala separadamente y
APT verifica la firma de los índices antes de descargar el paquete:

```bash
curl -fsSL https://packages.edutictac.es/edutictac-archive-keyring.gpg \
  | sudo tee /usr/share/keyrings/edutictac.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/edutictac.gpg] https://packages.edutictac.es stable main" \
  | sudo tee /etc/apt/sources.list.d/edutictac.list

sudo apt update
sudo apt install edutictac-commons
```

Para actualizar una instalación existente:

```bash
sudo apt update
sudo apt install --only-upgrade edutictac-commons
```

El repositorio conserva las versiones anteriores, pero APT selecciona la más
reciente. La publicación y la infraestructura del repositorio están
documentadas en [`edutictac-packages`](https://git.edutictac.es/Edutictac/edutictac-packages).

## Instalar un paquete local

```bash
sudo apt install ./dist/edutictac-commons_0.1.1~alpha30_amd64.deb
```

El paquete declara Docker Engine, Docker Compose v2, Avahi/mDNS, `curl`, `jq`,
Python, certificados y OpenSSL como dependencias. Durante la instalación:

- crea `/opt/edutictac-commons/.env` con secretos aleatorios;
- configura el registro `registry.edutictac.es/edutictac` y el tag de la
  versión;
- publica el nombre local `edutictac.local` mediante mDNS/Avahi;
- activa el núcleo con Authentik y genera los secretos de los módulos;
- conserva la configuración en modo privado (`0600`);
- habilita `edutictac-commons.service`;
- arranca el stack y descarga automáticamente las imágenes publicadas;
- muestra en la terminal un código de activación de un solo uso en una
  instalación nueva; no se vuelve a mostrar durante las actualizaciones.

El servicio usa la configuración de `/opt/edutictac-commons/.env`.
En una instalación nueva, después de activar el portal e iniciar sesión como
administrador, `/admin/` muestra el selector de **Play, EduHoot, Recursos y
Quiosc**. Se puede posponer y volver a **Herramientas del centro** más tarde.
Portal, identidad, Administración y Authentik permanecen activos.

Desde la misma sección se pueden activar y desactivar módulos posteriormente.
Se crea y comprueba una copia previa; desactivar conserva los datos. El portal
oculta los accesos de los módulos desactivados y conserva las asignaciones y
resultados. El cambio puede interrumpir el acceso brevemente. Si falla el
arranque, se intenta recuperar la configuración anterior y se muestra el error.

Las actualizaciones conservan los módulos y tags existentes. La primera
migración incorpora el perfil `play` para mantener el Play que antes arrancaba
siempre. Para usar el selector hay que actualizar tanto el paquete como las
imágenes de API, portal y Administración. Véase [operación de módulos](modules.md).

Quiosc requiere Epoptes ya instalado y una preparación administrativa única
en el servidor LliureX. La instalación de Commons no lo activa ni instala
componentes en los equipos del alumnado. Véase
[preparación local de Quiosc](quiosc-local.md).

Una actualización del `.deb` incorpora los scripts nuevos y conserva los
tags configurados de las imágenes en instalaciones existentes. Para pasar una
instalación existente a alpha27 hace falta actualizar también sus imágenes;
instalar este paquete no garantiza por sí solo que ejecute la nueva API.

La entrada principal queda disponible en `http://edutictac.local/` (o con la
IP del equipo si el cliente no soporta mDNS). El instalador muestra la URL
mDNS y la IP; la entrada de menú/escritorio usa `edutictac-commons-open`, que
incluye el puerto configurado y cae a la IP si `.local` no responde. En la primera visita aparece un
asistente: introduce el código que mostró el instalador y el navegador muestra
una sola vez las credenciales iniciales de Authentik. El asistente enlaza con Authentik para cambiar la contraseña y con
`/admin/` para elegir las herramientas del centro. El panel solo admite
acceso desde el propio servidor, la Tailnet o un túnel SSH; la LAN directa
recibe 403.
El código queda invalidado al canjearlo y la contraseña no se guarda en el
portal.

En una instalación nueva, el worker de Authentik aplica además el blueprint
`authentik-blueprints/edutictac-commons.yaml`. Este crea el grupo
`administrador`, la aplicación y el proveedor OIDC de Commons, con el cliente,
secreto y URL de retorno generados por el instalador. El API de identidad usa
el descubrimiento interno de Docker y el emisor público `edutictac.local`.

Cuando están activados, EduHoot queda disponible en `http://edutictac.local:8090/` y Recursos en
`http://edutictac.local:8086/`.

## Comprobación

```bash
sudo systemctl status edutictac-commons.service
curl http://127.0.0.1:8082/api/health
cd /opt/edutictac-commons && make test-flow
```

Los datos persistentes quedan en `/opt/edutictac-commons/data/` y los backups
en `/opt/edutictac-commons/backups/`. No se eliminan al desinstalar el paquete.

## Limitaciones de esta primera versión

- Solo se publica para `amd64`.
- Requiere acceso de red al registro para descargar las imágenes; las imágenes
  oficiales se descargan sin credenciales.
- La imagen `commons-play` debe estar publicada antes de usar el instalador.
- El instalador no configura todavía HTTPS ni un proxy inverso.
- Las instalaciones existentes conservan su configuración de Authentik; el
  blueprint crea o actualiza el proveedor de Commons al arrancar el worker,
  pero no modifica proveedores ajenos.
- El paquete offline con las imágenes OCI se añadirá después.
