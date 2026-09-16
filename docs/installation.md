# Instalación de EduTicTac Commons y Play

## Requisitos

- Git.
- Docker Engine con Compose o Podman compatible con Compose.
- 2 GB de RAM libres para una instalación local.
- Puertos `8082` y `8084` libres.

## Instalación rápida

```bash
git clone <URL-DEL-REPOSITORIO> edutictac-commons
cd edutictac-commons
cp .env.example .env
make doctor
make up
```

Servicios principales:

- Commons: `http://localhost:8082`
- EduTicTac Play: `http://localhost:8084`
- Administración local: `http://127.0.0.1:8091`

Antes de usar el sistema fuera de una demo, cambia los secretos de `.env`,
especialmente `EDUTICTAC_ID_SECRET` y `EDUTICTAC_ADMIN_TOKEN`.

## Podman

```bash
make DOCKER=podman up
```

Si el sistema usa un proveedor externo para Compose, configura ese proveedor
según la distribución.

## Datos persistentes

Play guarda actualmente las actividades en `data/play/`. Commons mantiene sus
datos en `data/`. Estas carpetas no deben versionarse ni exponerse como
descargas públicas.

```bash
make down
make logs
make ps
```

Para una instalación accesible desde otros dispositivos, usa un proxy HTTPS
del centro. No expongas el panel de administración directamente a Internet.
