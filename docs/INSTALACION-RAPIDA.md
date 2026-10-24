# Instalar EduTicTac Commons: guía básica

Guía para la persona que prepara el ordenador del centro. El alumnado no
necesita instalar Commons: accede desde su navegador.

**Beta 4 en preparación:** el instalador definitivo todavía no está publicado.
Esta guía corresponde a `0.1.1~beta5`; la página pública de descarga se
actualizará cuando termine su validación.

## Antes de empezar

- Utiliza un ordenador o servidor Linux de 64 bits (amd64), con permisos
  de administración y conexión a Internet. Las pruebas se realizan en LliureX 23.
- El ordenador del profesorado se ha probado con 5 GB de RAM y 4 CPU asignadas.
  El consumo depende de las aplicaciones que actives.
- Reserva espacio para las imágenes Docker, los trabajos y las copias de
  seguridad. La descarga inicial puede tardar varios minutos.
- Si ya tienes Commons instalado, sigue el apartado «Actualizar» de esta guía.

## Primera instalación

1. **Descarga el instalador** desde la [página oficial de Commons](https://edutictac.es/instala-commons.html)
   cuando anuncie la beta 3. Guárdalo en el ordenador que funcionará como servidor.
2. **Instala el paquete.** Abre una terminal en la carpeta donde lo has
   descargado y ejecuta:

   ```bash
   sudo apt install ./edutictac-commons_0.1.1~beta5_amd64.deb
   ```

   Introduce la contraseña de administración del ordenador y espera a que
   termine. El instalador prepara la configuración y descarga los servicios.
   **Guarda el código de activación que aparece al final**; no lo compartas.
3. **Reinicia el ordenador.** Hazlo antes de activar aplicaciones o crear
   copias desde el panel, para aplicar los permisos de Docker.
4. **Abre EduTicTac Commons** desde el menú de aplicaciones. En LliureX,
   la dirección habitual es `http://edutictac.local:8082/`.
   Si el instalador indica otra dirección, utiliza esa.
5. **Activa la instalación.** Introduce el código que guardaste. La pantalla
   muestra las credenciales iniciales de administración. Guárdalas de forma
   segura y cambia la contraseña desde el enlace al panel de acceso.
   La activación solo se hace una vez.
6. **Elige las aplicaciones.** Entra en Administración con la cuenta inicial
   y selecciona las herramientas que necesita el centro: Play, EduHoot,
   Banc de recursos, Blocs, Llibres o Quiosc. Espera a que termine la operación.
   El núcleo de Commons incluye las aulas, Rebost y los archivos del aula.

Quiosc requiere un servidor Epoptes compatible; no hace falta activarlo para
utilizar el resto de las aplicaciones.

## Comprobar que funciona

1. Abre Commons y entra como docente.
2. Crea un aula de prueba y genera una credencial de alumnado.
3. Desde otro navegador u ordenador de la misma red, abre la dirección
   del portal y entra con el código y el PIN de esa credencial.
4. Comprueba que puedes abrir una de las aplicaciones activadas y compartir
   un archivo con el aula.

El ordenador servidor debe permanecer encendido mientras se utiliza Commons.
El acceso al alumnado es mediante código y PIN; no necesita una cuenta docente.

## Actualizar una instalación existente

1. Crea y verifica una copia de seguridad desde Administración. Conserva
   también una copia fuera del ordenador servidor.
2. Instala el nuevo paquete con el mismo comando de instalación.
3. En Administración, comprueba y actualiza las imágenes de las aplicaciones.
4. Abre el portal y comprueba un aula y sus trabajos anteriores.

**Actualizar el instalador y actualizar las aplicaciones son dos pasos.**
El paquete conserva la configuración, las credenciales y las aplicaciones
seleccionadas; después hay que actualizar sus imágenes desde el panel.

## Si algo no responde

- **La instalación sigue descargando:** espera a que termine y comprueba la
  conexión a Internet.
- **El primer acceso todavía no aparece:** el servicio de acceso puede tardar
  más que el portal en arrancar. Espera un poco y vuelve a intentarlo.
- **No abre desde el menú:** prueba la dirección indicada por el instalador.
  En LliureX, Commons suele usar el puerto 8082 porque el 80 ya está ocupado.
- **No se reconoce el nombre desde otro equipo:** comprueba que ambos están
  en la misma red y pide al responsable del centro que revise la dirección.
- **Falta el código o la contraseña inicial:** pide ayuda a quien instaló el
  servidor; no reinstales ni borres datos para recuperar el acceso.

Las copias del servidor no incluyen los proyectos guardados únicamente en el
navegador. Descarga también los libros y proyectos que quieras conservar.

Para administración avanzada, consulta [la guía técnica del panel](GUIA-ADMIN.md)
y [la documentación de instalación y desarrollo](../INSTALL-CENTRES.md).
