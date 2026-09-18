# Guía docente de EduTicTac Commons

Esta guía explica el flujo habitual para preparar actividades y documentos
para un grupo de alumnos.

## 1. Acceder como docente

1. Abre la dirección de EduTicTac Commons del centro.
2. Pulsa **Acceso docente**.
3. Inicia sesión con Authentik.
4. Comprueba que aparece el panel docente y tu identidad.

El acceso docente utiliza Authentik. No es necesario crear una cuenta de
Google. El alumnado utiliza sus credenciales pseudónimas de Commons.

## 2. Preparar un grupo

Desde el panel docente:

1. Crea un grupo para la clase o selecciona uno existente.
2. Genera las credenciales del alumnado.
3. Descarga o imprime las tarjetas con el código y el PIN.
4. Entrega cada tarjeta al alumno correspondiente.

El código identifica al alumno dentro de Commons sin mostrar su nombre. El PIN
solo se muestra al generarlo o regenerarlo; si se pierde, genera uno nuevo.

## 3. Buscar actividades en Recursos

En la sección **Recursos** puedes consultar actividades procedentes de los
catálogos disponibles, incluyendo EduHoot y Play cuando estén activados.

Utiliza los filtros de proveedor, formato, materia, etapa o idioma. Una
actividad de EduHoot o Play aparece como recurso normal y no requiere copiar
manualmente su identificador.

## 4. Usar la cesta

La cesta reúne los recursos que quieres preparar para un grupo.

1. Pulsa **Añadir a la cesta** en cada actividad.
2. Revisa la cesta desde el panel docente.
3. Selecciona el grupo de destino.
4. Pulsa **Asignar recursos de la cesta**.

Commons crea las asignaciones conservando el identificador original de cada
actividad. Desde ese momento aparecen en el panel del alumnado y pueden
incorporarse a un itinerario.

## 5. Subir un documento propio

El docente puede añadir documentos para que estén disponibles junto a las
actividades del grupo.

1. Entra con Authentik.
2. Abre **Recursos**.
3. Pulsa **Subir documento**.
4. Selecciona un PDF, Word, OpenDocument, presentación, hoja de cálculo o
   archivo de texto.
5. Completa el título y, opcionalmente, materia e idioma.
6. Confirma la subida.
7. Añade el documento a la cesta y asígnalo al grupo.

Los documentos subidos por un docente son privados: solo aparecen en su
catálogo autenticado. Otros docentes no los ven, y el alumnado no puede
encontrarlos mediante el catálogo público.

El límite de tamaño configurado por defecto es de 25 MiB. Conviene subir
documentos optimizados, especialmente si contienen imágenes escaneadas.

## 6. Crear un itinerario

Un itinerario permite ordenar actividades y documentos para que el alumnado
los siga como una secuencia.

1. Selecciona un grupo.
2. Crea un itinerario con un título descriptivo.
3. Añade las asignaciones del grupo.
4. Ajusta el orden de los elementos.

El itinerario no duplica los recursos. Si cambias una actividad o su posición,
se mantiene el mismo seguimiento y las mismas puntuaciones.

Las asignaciones que todavía no estén en un itinerario siguen apareciendo al
alumnado después de los pasos ordenados.

## 7. Qué hace el alumnado

El alumno entra con su código y PIN y ve las actividades asignadas a su grupo.
Puede abrir EduHoot, Play y los recursos compatibles desde su panel.

Para los documentos privados:

- debe tener una sesión de alumno activa;
- debe pertenecer al grupo al que se asignó el documento;
- debe abrirlo desde la asignación del panel;
- el acceso usa un token temporal y de un solo uso.

Copiar la URL del documento no permite descargarlo sin autenticación. El
docente propietario sí puede abrir su propio documento desde Recursos con su
sesión de Authentik.

## 8. Crear actividades sin iniciar sesión

Play permite crear actividades sin sesión para pruebas rápidas. Esas
actividades son efímeras y se eliminan después del plazo configurado, por
defecto 24 horas.

Para conservar una actividad, asignarla a un grupo o reutilizarla más adelante,
el docente debe iniciar sesión con Authentik antes de crearla o guardarla.

## 9. Resultados y privacidad

El panel docente muestra los resultados asociados a las asignaciones del grupo.
El alumnado se identifica mediante código pseudónimo, no mediante su nombre o
correo electrónico.

Buenas prácticas:

- entrega cada PIN individualmente;
- no publiques listados que relacionen códigos con nombres;
- regenera un PIN si se pierde;
- retira las asignaciones que ya no deban estar disponibles;
- evita subir documentos con datos personales innecesarios.

Para más información consulta:

- [Authentik y OpenID Connect](authentik.md)
- [Privacidad](PRIVACITAT.md)
- [Fitxa docent sobre codis i PIN](FITXA-DOCENT.md)
- [Itinerarios](itineraries.md)

