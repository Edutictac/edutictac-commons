# Plan de la 0.1.1-beta2 (instalación local)

Estado: **plan redactado 22-10-2026, nada construido ni publicado.** Sigue el
procedimiento de la beta1 (`releases/0.1.1-beta1/`).

## Alcance

Regenerar las imágenes propias e **incorporar Blocs y Llibres a la instalación
local** como módulos opcionales del selector de Administración, igual que Play,
Recursos o EduHoot.

| Imagen | Origen | Motivo |
|---|---|---|
| `commons-id-api` | Commons | routers, migraciones, Rebost, permisos admin/traspaso |
| `commons-portal` | Commons | paneles Vue, panel «Grups del centre», enlaces federados |
| `commons-play` | Commons | `playcore`, cambios de interfaz |
| `commons-admin` | Commons | aislamiento de la administración del host |
| `recursos-api`, `recursos` | repos Recursos | tipos Play, filtro por aplicación, Llibres |
| `commons-blocs` | `edutictac-blocs` (rama `blocs`) | **nuevo módulo** |
| `commons-llibres` | `edutictac-llibres` | **nuevo módulo** (imagen propia, ver abajo) |

Sin cambios: Authentik, PostgreSQL, EduHoot y Mongo (mismos digests de beta1).

## Paso 0 — Código publicado y limpio

Cada imagen debe salir de un commit público:

- Commons: publicar los commits pendientes en `origin` (Forgejo + GitHub).
- `recursos-api` y `recursos`: un commit pendiente cada uno.
- `edutictac-llibres`: 3 ficheros de documentación sin commit; revisar,
  commit y push.
- `edutictac-blocs`: limpio en `blocs`; confirmar que el commit desplegado en
  `blocs.edutictac.es` y el que se empaqueta coinciden o anotar la diferencia.

## Paso 1 — Blocs como módulo

Hoy Blocs se añade a mano con `compose.rebost-blocs.yml`. Llevarlo a
`compose.yml`:

- servicio `blocs` con `profiles: ["blocs"]`, imagen
  `commons-blocs:${IMAGE_TAG}`, la misma configuración anónima
  (`EDUTICTAC_API_ENABLED=false`, `BLOCS_IDENTITY_MODE=anonymous`) y el volumen
  de caché `blocs_catalog_cache`;
- el portal **no debe depender** de Blocs (`depends_on` actual): si el módulo
  está desactivado, `/blocs/` responde la página de «no disponible» y
  `blocs.locations.conf` se carga siempre, con el `proxy_pass` resuelto en
  tiempo de petición (`resolver 127.0.0.11` + variable) para que nginx arranque
  sin el contenedor;
- mantener `compose.rebost-blocs.yml` solo como alias de desarrollo o
  eliminarlo, documentándolo.

## Paso 2 — Llibres como módulo

Hoy Llibres es un nginx que monta `public/`, `vendor/exelearning/static` y la
configuración desde el repo. Para la instalación local hace falta:

- **imagen propia `commons-llibres`** (Dockerfile en `edutictac-llibres`):
  nginx-unprivileged con `public/`, el motor eXeLearning 4.0.5 verificado por
  SHA-256 (`scripts/bootstrap.py`, `upstream.json`) y las configuraciones de
  Rebost y publicación ya incluidas; `read_only` + `tmpfs` como ahora;
- servicio `llibres` con `profiles: ["llibres"]` en `compose.yml`, servido bajo
  `/llibres/` por el portal (mismo patrón que Blocs) para que comparta origen y
  sesión con el Rebost;
- la publicación al Banc solo se activa si el módulo `recursos` también lo
  está; si no, el botón Publicar no aparece;
- revisar licencias en el paquete: wrapper AGPL-3.0, slide CC BY-SA 4.0, Fabric
  MIT, DOMPurify, fflate; añadirlas a `NOTICES`/licencias del portal.

## Paso 3 — Selector de módulos y estado

- `admin/modules.py`: `MODULES = ("play", "eduhoot", "recursos", "blocs",
  "llibres", "quiosc")`; `SERVICES` con `blocs` y `llibres`.
- `scripts/manage-modules.py`: añadir `--profile blocs --profile llibres` en
  las llamadas a compose y su comprobación de salud (puertos/rutas internas).
- Panel de Administración e i18n (es/ca/va/en) con las dos tarjetas nuevas.
- Portal: mostrar los accesos de Blocs y Llibres solo si el módulo está activo
  (`/api/modules/status`).
- Actualizar `tests/test_modules.py`, `test_admin_modules.py` y
  `admin-modules.spec.js`.

## Paso 4 — Copias de seguridad

- Blocs y Llibres **no guardan datos en el servidor**: los proyectos y libros
  viven en el navegador (IndexedDB) o se descargan (`.sb3`, `.elpx`), y las
  imágenes están en el Rebost, que ya va en `id.db`. La caché de catálogo de
  Blocs es regenerable y queda fuera de la copia.
- Dejarlo explícito en `docs/BACKUPS.md` y en la guía docente: «guarda tus
  proyectos y libros descargándolos».
- Comprobar que `backup-stack.py` no falla con los módulos nuevos activos.

## Paso 5 — Imágenes y manifiesto

1. `VERSION` → `0.1.1-beta2`; `packaging/debian/control` → `0.1.1~beta2`.
2. Construir las siete imágenes propias para `linux/amd64` con tag
   `0.1.1-beta2`.
3. `releases/0.1.1-beta2/`: `images.json` (digests y commits de origen de
   Commons, Recursos, Blocs y Llibres), `compose.images.json`,
   `installer.json`, `README.md` con novedades y límites.
4. Publicar en `registry.edutictac.es` con la credencial
   `pass edutictac/registry-publisher` (nunca mostrarla). Para retags, conservar
   el digest (pull + tag + push).

## Paso 6 — Validación

- `make release-check` (incluye `npm run test:i18n`) y suite Python completa.
- Pruebas de navegador del portal, Play y las nuevas de Blocs/Llibres como
  módulos (activar, abrir, Rebost, desactivar).
- `make test-installation` con `--pull --lock releases/0.1.1-beta2/images.json`:
  instalación sin build, módulos, backup y restauración.
- **Actualización desde beta1**: id.db de beta1 → migración `id-api` v1,
  identidades y aulas intactas.
- Aula virtual LliureX: `reset-profesor`, instalar el `.deb` desde cero,
  activar todos los módulos, reinicio, alumno en la otra VM.

## Paso 7 — Paquete

- `make package-deb`, firma APT, publicación en `packages.edutictac.es`,
  comprobación de firma y SHA-256 del paquete descargado (como en beta1).
- Tag `v0.1.1-beta2` en Forgejo y GitHub.

## Riesgos a vigilar

- Tamaño: Llibres lleva el motor eXe completo (miles de ficheros); medir la
  imagen y el tiempo de descarga en aula.
- El portal no debe dejar de arrancar si Blocs/Llibres están desactivados.
- Origen único: Blocs y Llibres bajo `/blocs/` y `/llibres/` del portal para que
  el selector del Rebost (comprobación de `origin`/`source`/`nonce`) funcione
  igual que en producción.
- No cambiar el comportamiento de los centros con beta1: módulos nuevos
  desactivados por defecto al actualizar.
