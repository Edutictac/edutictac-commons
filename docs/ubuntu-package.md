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

El artefacto aparece en `dist/`. La versión de Debian actual es
`0.1.1~alpha4`, correspondiente a Commons `0.1.1-alpha`. Esta versión añade
el asistente de activación inicial de Authentik.

## Instalar

```bash
sudo apt install ./dist/edutictac-commons_0.1.1~alpha2_amd64.deb
```

El paquete declara Docker Engine, Docker Compose v2, Avahi/mDNS, `curl`, `jq`,
Python, certificados y OpenSSL como dependencias. Durante la instalación:

- crea `/opt/edutictac-commons/.env` con secretos aleatorios;
- configura el registro `registry.edutictac.es/edutictac` y el tag de la
  versión;
- publica el nombre local `edutictac.local` mediante mDNS/Avahi;
- activa los perfiles de Authentik, EduHoot y Recursos, y genera sus secretos;
- conserva la configuración en modo privado (`0600`);
- habilita `edutictac-commons.service`;
- arranca el stack y descarga automáticamente las imágenes publicadas;
- muestra en la terminal un código de activación de un solo uso en una
  instalación nueva; no se vuelve a mostrar durante las actualizaciones.

El servicio usa la configuración de `/opt/edutictac-commons/.env`. Los tres
módulos se activan automáticamente. Para reiniciar el stack tras cambiar la
configuración, ejecuta:

```bash
sudo systemctl restart edutictac-commons.service
```

La entrada principal queda disponible en `http://edutictac.local/` (o con la
IP del equipo si el cliente no soporta mDNS). En la primera visita aparece un
asistente: introduce el código que mostró el instalador y el navegador muestra
una sola vez las credenciales iniciales de Authentik. El asistente enlaza con
`http://edutictac.local:9000/` para que el administrador cambie la contraseña.
El código queda invalidado al canjearlo y la contraseña no se guarda en el
portal.

En una instalación nueva, el worker de Authentik aplica además el blueprint
`authentik-blueprints/edutictac-commons.yaml`. Este crea el grupo
`administrador`, la aplicación y el proveedor OIDC de Commons, con el cliente,
secreto y URL de retorno generados por el instalador. El API de identidad usa
el descubrimiento interno de Docker y el emisor público `edutictac.local`.

EduHoot queda disponible en `http://edutictac.local:8090/` y Recursos en
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
