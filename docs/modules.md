# Selector de módulos

Implementado en desarrollo; publicación prevista: paquete `0.1.1~alpha29`
e imágenes Commons `0.1.1-alpha26`. No distribuir el paquete antes de publicar
las imágenes. Alpha28/alpha25 siguen siendo la última distribución publicada.

## Uso

Tras canjear el código de activación, iniciar sesión como administrador y abrir
`/admin/`, una instalación nueva muestra el asistente. La sección Herramientas
del centro permite cambiar la selección después. Play, EduHoot y Recursos son
opcionales. Quiosc requiere preparación previa de Epoptes; no instala clientes
ni habilita acceso remoto como efecto de una casilla. El núcleo permanece activo.

Desactivar detiene los servicios, sin borrar volúmenes ni archivos. Los accesos
se ocultan; las asignaciones y resultados se conservan. Antes de cambiar se
crea y comprueba un backup. Se valida el arranque y la salud del núcleo y de
los módulos elegidos. Ante un fallo se restaura la configuración anterior y
se intenta recuperar el estado operativo; un fallo de recuperación se informa.

## Contrato de operación

- `GET /admin/api/modules`: estado para el administrador autenticado.
- `POST /admin/api/modules`: JSON `{enabled, revision}`, cabecera
  `X-Commons-Modules: 1`, mismo origen y lista cerrada de módulos.
- `scripts/manage-modules.py` ejecuta la operación en el host mediante un job
  systemd de usuario. La revisión impide aplicar cambios sobre una selección
  desactualizada. El job permanece consultable tras reiniciar Administración.
- `data/modules.json` contiene únicamente selección, disponibilidad, revisión
  y progreso públicos. Nunca contiene el `.env` ni credenciales.
- `GET /api/modules/status` publica únicamente los módulos habilitados.
- `COMPOSE_PROFILES` mantiene `authentik` y los perfiles opcionales;
  `QUIOSC_MODE` controla Quiosc. `MODULES_CONFIGURED=0` abre el asistente.
- La actualización de una instalación anterior preserva los perfiles y añade
  `play`, que antes no tenía perfil propio. Las selecciones ya explícitas se
  conservan. Una instalación nueva arranca solo el núcleo.
- Actualizar, restaurar y deshacer comparten un bloqueo con el selector. Quiosc
  impide iniciar sesiones durante el cambio y bloquea cambios si quedan
  dispositivos pendientes. Se requiere `util-linux` para `flock`.

## Verificación

```bash
python3 -m pytest tests -q
npm test
```

La prueba opcional `python3 scripts/test-modules-docker.py` requiere Docker,
las imágenes locales `commons-selector-{id,portal,admin}:test` y las imágenes
opcionales indicadas en el script. Comprueba activación, desactivación,
conservación de datos y recuperación ante una imagen inexistente.

Antes de arrancar, reemplaza TODOS los nombres normalizados de redes y
volúmenes, rechaza recursos existentes o externos y valida que los bind mounts
estén dentro del directorio temporal. Un nombre de proyecto distinto por sí
solo no aísla recursos con `name:` explícito. Las pruebas de aislamiento de
`tests/test_docker_isolation.py` cubren esa condición. No ejecutar una variante
que omita estas comprobaciones ni montar un volumen PostgreSQL activo en un
segundo servidor.

## Estado de validación local (2026-10-17)

- Python: 123 pruebas correctas; 2 pruebas Docker optativas de Quiosc omitidas.
- Navegador: 64 pruebas completas y 2 casos nuevos adicionales (escritorio y
  móvil) para conservar asignaciones y resultados con Play desactivado.
- Docker real aislado: activación, desactivación, reactivación conservando datos
  y recuperación ante imagen inexistente correctas. Recursos temporales eliminados.
- Paquete alpha29 construido y contenido revisado: incluye controlador y
  selector, excluye `.env` y copias de seguridad locales. No instalado ni publicado.
- Pendiente de distribución: publicar imágenes alpha26 y el nuevo paquete;
  actualizar conjuntamente los scripts del host y las imágenes.
