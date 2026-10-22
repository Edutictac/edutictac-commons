(function () {
  "use strict";

  document.documentElement.classList.add("i18n-pending");

  var SUPPORTED_LANGS = ["ca", "va", "es", "en"];
  var FALLBACK_LANG = "es";
  var STORAGE_KEY = "edutictac-admin-lang";

  var translations = {
    es: {
      "admin.loadError": "No se pudo cargar el panel. Recarga la página.",
      "admin.operationError": "No se pudo completar la operación. Actualiza el estado antes de volver a intentarlo.",
      "admin.teacherError": "No se pudo crear el docente. Comprueba el estado antes de volver a intentarlo.",
      "admin.clearCredential": "Ocultar contraseña temporal",
      "admin.tracking": "Seguimiento de la operación del servidor.",
      "admin.resumeTracking": "Reanudar seguimiento",
      "secondary.title": "Segunda copia del centro (opcional)",
      "secondary.help": "Utiliza un NAS o un disco USB montado en el servidor, en otro dispositivo. No hace falta nube.",
      "secondary.mount": "Punto de montaje del NAS o USB",
      "secondary.mounted": "El dispositivo debe estar montado y permitir archivos privados. Si falta, se conserva el backup local y se avisa aquí.",
      "secondary.save": "Activar en este dispositivo",
      "secondary.copy": "Copiar el último backup ahora",
      "secondary.disable": "Desactivar segunda copia",
      "secondary.state.disabled": "Segunda copia desactivada. Las copias locales siguen disponibles.",
      "secondary.state.ready": "Destino comprobado. Se copiarán los próximos backups; también puedes copiar el último ahora.",
      "secondary.state.success": "Última segunda copia verificada",
      "secondary.state.failed": "La última segunda copia falló. El backup local se conserva; conecta el dispositivo y reintenta.",
      "secondary.error.device_unavailable": "El dispositivo no está montado o no está disponible.",
      "secondary.error.device_changed": "El dispositivo ha cambiado. Revisa el destino y actívalo de nuevo.",
      "secondary.error.same_device": "El destino debe estar en otro dispositivo, distinto del disco de los backups locales.",
      "secondary.error.private_permissions_required": "El destino debe permitir carpetas privadas (0700) y archivos privados (0600).",
      "secondary.error.destination_full": "No hay espacio suficiente en el destino.",
      "secondary.error.destination_conflict": "Ya existe una copia distinta con ese nombre. Se ha conservado sin sobrescribir.",
      "secondary.error.copy_failed": "No se ha podido escribir o verificar la copia. Revisa conexión, permisos y espacio.",
      "secondary.error.copy_verification_failed": "La copia no ha superado la verificación.",
      "secondary.error.invalid_configuration": "Revisa y guarda de nuevo el destino.",

      "modules.label": "Módulos",
      "modules.title": "Herramientas del centro",
      "modules.core": "El portal, la identidad, Administración y Authentik permanecen activos para conservar el acceso.",
      "modules.choose": "Elige las herramientas que quieres utilizar",
      "modules.play": "Crear actividades H5P.",
      "modules.eduhoot": "Cuestionarios y partidas de aula.",
      "modules.resourcesName": "Banco de recursos",
      "modules.recursos": "Explorar y guardar recursos docentes.",
      "modules.quiosc": "Actividades supervisadas con Epoptes.",
      "modules.quioscPreparation": "Este servidor no tiene Epoptes. Quiosc solo funciona en el ordenador del aula con Epoptes, donde se prepara automáticamente.",
      "modules.retention": "Desactivar una herramienta conserva sus datos. Aplicar cambios puede interrumpir el acceso unos instantes.",
      "modules.signIn": "Inicia sesión como administrador para gestionar las herramientas.",
      "modules.apply": "Aplicar selección",
      "modules.later": "Configurar más tarde",
      "modules.firstTitle": "Prepara las herramientas del centro",
      "modules.updateInstaller": "Actualiza el instalador y las imágenes de Commons para gestionar los módulos.",
      "modules.applying": "Aplicando cambios. Puedes consultar el progreso debajo.",
      "modules.failed": "No se ha podido aplicar la selección. Revisa el progreso y actualiza el estado antes de reintentarlo.",
      "modules.error.configuration_changed": "La configuración se ha actualizado en otra sesión. Revisa la selección actual.",
      "modules.error.operation_busy": "Hay otra operación de mantenimiento en curso.",
      "modules.error.quiosc_not_prepared": "Quiosc solo se puede activar en el ordenador del aula con Epoptes.",
      "modules.error.host_runner_unavailable": "No se ha podido iniciar la operación en el servidor. Revisa la instalación.",
      "modules.ready": "Herramientas activas actualizadas. Puedes cambiar esta selección cuando lo necesites.",
      "modules.firstHint": "Elige las herramientas del centro. Podrás cambiarlas después.",
      "modules.unavailable": "No se puede consultar la configuración. Inicia sesión o vuelve a actualizar.",
      "common.lang.label": "Idioma",
      "common.errorLabel": "Error:",
      "common.executing": "Ejecutando...",
      "common.actions": "Acciones",
      "common.actionPlaceholder": "Los resultados de las acciones aparecerán aquí.",
      "errors.unauthorized": "no autorizado",
      "admin.title": "Panel de administración",
      "admin.pageTitle": "Panel de administración — EduTicTac Commons",
      "login.access": "Acceso",
      "login.title": "Acceso de administración",
      "login.token": "Identidad",
      "login.enter": "Entrar",
      "login.logout": "Salir",
      "login.refresh": "Actualizar",
      "teachers.label": "Profesorado",
      "teachers.title": "Dar de alta un docente",
      "teachers.username": "Usuario",
      "teachers.name": "Nombre completo",
      "teachers.email": "Correo electrónico",
      "teachers.create": "Crear docente",
      "teachers.creating": "Creando docente...",
      "teachers.help": "La contraseña temporal aparecerá una sola vez.",
      "teachers.created": "Docente creado. Usuario: {username}. Contraseña temporal: {password}",
      "status.checking": "Comprobando sesión...",
      "status.label": "Estado",
      "status.title": "Estado operativo del stack",
      "status.connected": "Conectado",
      "status.disconnected": "Desconectado",
      "status.invalidToken": "Sesión no autorizada",
      "status.authRequired": "Necesitas iniciar sesión",
      "status.signInToView": "Inicia sesión para ver el estado.",
      "status.notResponding": "NO responde",
      "status.stackVersion": "Versión del stack: {version}",
      "status.imagesLine": "Imágenes: registro={registry} tag={tag} eduhoot={eduhoot}",
      "status.updateChannel": "Canal de actualizaciones: {channel}",
      "status.activeProfiles": "Perfiles activos: {profiles}",
      "status.none": "ninguno",
      "status.services": "Servicios:",
      "status.lastBackup": "Último backup: {name} ({date})",
      "status.lastBackupNone": "Último backup: ninguno",
      "status.coverageWarnings": "Avisos de cobertura: {warnings}",
      "status.backupsAvailable": "Backups disponibles ({count}):",
      "status.backupTimer": "Timer de backup automático:",
      "status.unitFileState": "UnitFileState:",
      "status.activeStateTimer": "ActiveState (timer):",
      "status.activeStateService": "ActiveState (servicio):",
      "status.lastRun": "Última ejecución:",
      "status.nextRun": "Próxima ejecución:",
      "status.lastRunResult": "Resultado última ejecución:",
      "status.checkedAt": "Comprobado: {date}",
      "status.registryLine": "Registro:",
      "status.channelLine": "Canal:",
      "status.installed": "Instalada:",
      "status.available": "Disponible:",
      "status.updateAvailable": "Actualización:",
      "status.yes": "sí",
      "status.no": "no",
      "status.loadError": "Error cargando estado: HTTP {status}",
      "backup.title": "Backups",
      "backup.create": "Crear backup ahora",
      "backup.installTimer": "Activar backups automáticos",
      "backup.uninstallTimer": "Desactivar backups automáticos",
      "backup.restoreLabel": "Backup para restaurar",
      "backup.restore": "Restaurar backup seleccionado",
      "backup.noneAvailable": "Ningún backup disponible",
      "backup.noDate": "sin fecha",
      "backup.warnings": "avisos",
      "backup.noneSelected": "No hay ningún backup seleccionado.",
      "backup.createConfirm": "¿Crear una copia completa ahora? Los servicios tendrán una breve pausa.",
      "backup.installTimerConfirm": "¿Activar el timer diario de backups automáticos en este host?",
      "backup.uninstallTimerConfirm": "¿Desactivar el timer de backups automáticos en este host?",
      "backup.restorePrompt": "Esta acción parará el stack y restaurará {backup}. Escribe RESTAURAR para continuar.",
      "backup.restoreCancelled": "Restauración cancelada.",
      "backup.restoreConfirmWord": "RESTAURAR",
      "images.label": "Imágenes",
      "images.title": "Actualizaciones",
      "images.check": "Comprobar actualizaciones",
      "images.update": "Actualizar imágenes",
      "images.checking": "Comprobando actualizaciones...",
      "images.updatePrompt": "Esta acción buscará el tag más reciente del canal, creará un backup, descargará imágenes y reiniciará el stack. Escribe ACTUALIZAR para continuar.",
      "images.updateConfirmWord": "ACTUALIZAR",
      "images.updateCancelled": "Actualización cancelada.",
      "images.rollbackLabel": "Versión anterior para rollback",
      "images.rollback": "Volver a la versión anterior",
      "images.rollbackNone": "No hay ninguna actualización reversible",
      "images.rollbackPrompt": "Esta acción creará un backup y volverá a la versión anterior {backup}. Escribe VOLVER para continuar.",
      "images.rollbackConfirmWord": "VOLVER",
      "images.rollbackCancelled": "Rollback cancelado.",
      "content.label": "Contenidos",
      "content.title": "Catálogo compartido",
      "content.help": "Descarga y valida la última versión publicada del catálogo de la red de centros.",
      "content.resources": "Sincronizar Recursos",
      "content.eduhoot": "Sincronizar EduHoot",
      "job.running": "⏳ En marcha... espera, puede tardar varios minutos.",
      "job.success": "✅ Completado con éxito.",
      "job.failed": "❌ Ha fallado. Revisa el registro de arriba.",
      "job.timeout": "⚠️ Sigue en marcha pero ha dejado de comprobarse aquí. Revisa el registro más tarde.",
      "job.reconnecting": "⏳ Reconectando... el propio panel puede estar reiniciándose durante la operación.",
    },
    ca: {
      "admin.loadError": "No s’ha pogut carregar el panell. Recarrega la pàgina.",
      "admin.operationError": "No s’ha pogut completar l’operació. Actualitza l’estat abans de tornar-ho a intentar.",
      "admin.teacherError": "No s’ha pogut crear el docent. Comprova l’estat abans de tornar-ho a intentar.",
      "admin.clearCredential": "Ocultar contrasenya temporal",
      "admin.tracking": "Seguiment de l’operació del servidor.",
      "admin.resumeTracking": "Reprendre seguiment",
      "secondary.title": "Segona còpia del centre (opcional)",
      "secondary.help": "Utilitza un NAS o un disc USB muntat en el servidor, en un altre dispositiu. No cal núvol.",
      "secondary.mount": "Punt de muntatge del NAS o USB",
      "secondary.mounted": "El dispositiu ha d’estar muntat i permetre fitxers privats. Si falta, es conserva el backup local i s’avisa ací.",
      "secondary.save": "Activar en aquest dispositiu",
      "secondary.copy": "Copiar l’últim backup ara",
      "secondary.disable": "Desactivar segona còpia",
      "secondary.state.disabled": "Segona còpia desactivada. Les còpies locals continuen disponibles.",
      "secondary.state.ready": "Destí comprovat. Es copiaran els pròxims backups; també pots copiar l’últim ara.",
      "secondary.state.success": "Última segona còpia verificada",
      "secondary.state.failed": "L’última segona còpia ha fallat. El backup local es conserva; connecta el dispositiu i torna-ho a provar.",
      "secondary.error.device_unavailable": "El dispositiu no està muntat o no està disponible.",
      "secondary.error.device_changed": "El dispositiu ha canviat. Revisa el destí i activa’l de nou.",
      "secondary.error.same_device": "El destí ha d’estar en un altre dispositiu, diferent del disc dels backups locals.",
      "secondary.error.private_permissions_required": "El destí ha de permetre carpetes privades (0700) i fitxers privats (0600).",
      "secondary.error.destination_full": "No hi ha espai suficient en el destí.",
      "secondary.error.destination_conflict": "Ja existeix una còpia diferent amb eixe nom. S’ha conservat sense sobreescriure.",
      "secondary.error.copy_failed": "No s’ha pogut escriure o verificar la còpia. Revisa connexió, permisos i espai.",
      "secondary.error.copy_verification_failed": "La còpia no ha superat la verificació.",
      "secondary.error.invalid_configuration": "Revisa i guarda de nou el destí.",

      "modules.label": "Mòduls",
      "modules.title": "Eines del centre",
      "modules.core": "El portal, la identitat, Administració i Authentik es mantenen actius per conservar l’accés.",
      "modules.choose": "Tria les eines que vols utilitzar",
      "modules.play": "Crear activitats H5P.",
      "modules.eduhoot": "Qüestionaris i partides d’aula.",
      "modules.resourcesName": "Banc de recursos",
      "modules.recursos": "Explorar i desar recursos docents.",
      "modules.quiosc": "Activitats supervisades amb Epoptes.",
      "modules.quioscPreparation": "Aquest servidor no té Epoptes. Quiosc només funciona a l’ordinador de l’aula amb Epoptes, on es prepara automàticament.",
      "modules.retention": "Desactivar una eina conserva les seves dades. Aplicar canvis pot interrompre l’accés uns instants.",
      "modules.signIn": "Entra com a administrador per gestionar les eines.",
      "modules.apply": "Aplicar selecció",
      "modules.later": "Configurar més tard",
      "modules.firstTitle": "Prepara les eines del centre",
      "modules.updateInstaller": "Actualitza l’instal·lador i les imatges de Commons per gestionar els mòduls.",
      "modules.applying": "Aplicant canvis. Pots consultar el progrés a sota.",
      "modules.failed": "No s’ha pogut aplicar la selecció. Revisa el progrés i actualitza l’estat abans de tornar-ho a provar.",
      "modules.error.configuration_changed": "La configuració s’ha actualitzat en una altra sessió. Revisa la selecció actual.",
      "modules.error.operation_busy": "Hi ha una altra operació de manteniment en curs.",
      "modules.error.quiosc_not_prepared": "Quiosc només es pot activar a l’ordinador de l’aula amb Epoptes.",
      "modules.error.host_runner_unavailable": "No s’ha pogut iniciar l’operació al servidor. Revisa la instal·lació.",
      "modules.ready": "Eines actives actualitzades. Pots canviar aquesta selecció quan ho necessitis.",
      "modules.firstHint": "Tria les eines del centre. Les podràs canviar després.",
      "modules.unavailable": "No es pot consultar la configuració. Inicia sessió o torna a actualitzar.",
      "common.lang.label": "Idioma",
      "common.errorLabel": "Error:",
      "common.executing": "Executant...",
      "common.actions": "Accions",
      "common.actionPlaceholder": "Els resultats de les accions apareixeran aquí.",
      "errors.unauthorized": "no autoritzat",
      "admin.title": "Panell d'administració",
      "admin.pageTitle": "Panell d'administració — EduTicTac Commons",
      "login.access": "Accés",
      "login.title": "Accés d'administració",
      "login.token": "Identitat",
      "login.enter": "Entrar",
      "login.logout": "Sortir",
      "login.refresh": "Actualitzar",
      "teachers.label": "Professorat",
      "teachers.title": "Donar d'alta un docent",
      "teachers.username": "Usuari",
      "teachers.name": "Nom complet",
      "teachers.email": "Correu electrònic",
      "teachers.create": "Crear docent",
      "teachers.creating": "Creant docent...",
      "teachers.help": "La contrasenya temporal apareixerà una sola vegada.",
      "teachers.created": "Docent creat. Usuari: {username}. Contrasenya temporal: {password}",
      "status.checking": "Comprovant la sessió...",
      "status.label": "Estat",
      "status.title": "Estat operatiu del stack",
      "status.connected": "Connectat",
      "status.disconnected": "Desconnectat",
      "status.invalidToken": "Sessió no autoritzada",
      "status.authRequired": "Cal iniciar sessió",
      "status.signInToView": "Inicia sessió per veure l'estat.",
      "status.notResponding": "NO respon",
      "status.stackVersion": "Versió del stack: {version}",
      "status.imagesLine": "Imatges: registre={registry} tag={tag} eduhoot={eduhoot}",
      "status.updateChannel": "Canal d'actualitzacions: {channel}",
      "status.activeProfiles": "Perfils actius: {profiles}",
      "status.none": "cap",
      "status.services": "Serveis:",
      "status.lastBackup": "Últim backup: {name} ({date})",
      "status.lastBackupNone": "Últim backup: cap",
      "status.coverageWarnings": "Avisos de cobertura: {warnings}",
      "status.backupsAvailable": "Backups disponibles ({count}):",
      "status.backupTimer": "Timer de backup automàtic:",
      "status.unitFileState": "UnitFileState:",
      "status.activeStateTimer": "ActiveState (timer):",
      "status.activeStateService": "ActiveState (servei):",
      "status.lastRun": "Última execució:",
      "status.nextRun": "Pròxima execució:",
      "status.lastRunResult": "Resultat última execució:",
      "status.checkedAt": "Comprovat: {date}",
      "status.registryLine": "Registre:",
      "status.channelLine": "Canal:",
      "status.installed": "Instal·lada:",
      "status.available": "Disponible:",
      "status.updateAvailable": "Actualització:",
      "status.yes": "sí",
      "status.no": "no",
      "status.loadError": "Error carregant estat: HTTP {status}",
      "backup.title": "Backups",
      "backup.create": "Crear backup ara",
      "backup.installTimer": "Activar backups automàtics",
      "backup.uninstallTimer": "Desactivar backups automàtics",
      "backup.restoreLabel": "Backup per restaurar",
      "backup.restore": "Restaurar backup seleccionat",
      "backup.noneAvailable": "Cap backup disponible",
      "backup.noDate": "sense data",
      "backup.warnings": "avisos",
      "backup.noneSelected": "No hi ha cap backup seleccionat.",
      "backup.createConfirm": "Crear una còpia completa ara? Els serveis tindran una breu pausa.",
      "backup.installTimerConfirm": "Activar el timer diari de backups automàtics en aquest host?",
      "backup.uninstallTimerConfirm": "Desactivar el timer de backups automàtics en aquest host?",
      "backup.restorePrompt": "Aquesta acció pararà el stack i restaurarà {backup}. Escriu RESTAURAR per continuar.",
      "backup.restoreCancelled": "Restauració cancel·lada.",
      "backup.restoreConfirmWord": "RESTAURAR",
      "images.label": "Imatges",
      "images.title": "Actualitzacions",
      "images.check": "Comprovar actualitzacions",
      "images.update": "Actualitzar imatges",
      "images.checking": "Comprovant actualitzacions...",
      "images.updatePrompt": "Aquesta acció buscarà el tag més recent del canal, crearà un backup, descarregarà imatges i reiniciarà el stack. Escriu ACTUALITZAR per continuar.",
      "images.updateConfirmWord": "ACTUALITZAR",
      "images.updateCancelled": "Actualització cancel·lada.",
      "images.rollbackLabel": "Versió anterior per a rollback",
      "images.rollback": "Tornar a la versió anterior",
      "images.rollbackNone": "No hi ha cap actualització reversible",
      "images.rollbackPrompt": "Aquesta acció crearà un backup i tornarà a la versió anterior {backup}. Escriu TORNAR per continuar.",
      "images.rollbackConfirmWord": "TORNAR",
      "images.rollbackCancelled": "Rollback cancel·lat.",
      "content.label": "Continguts",
      "content.title": "Catàleg compartit",
      "content.help": "Descarrega i valida l'última versió publicada del catàleg de la xarxa de centres.",
      "content.resources": "Sincronitzar Recursos",
      "content.eduhoot": "Sincronitzar EduHoot",
      "job.running": "⏳ En marxa... espera, pot trigar uns minuts.",
      "job.success": "✅ Completat amb èxit.",
      "job.failed": "❌ Ha fallat. Revisa el registre de dalt.",
      "job.timeout": "⚠️ Encara va en marxa pero s'ha deixat de comprovar ací. Revisa el registre mes tard.",
      "job.reconnecting": "⏳ Reconnectant... el mateix panell pot estar reiniciant-se durant l'operació.",
    },
    va: {
      "modules.label": "Mòduls",
      "modules.title": "Ferramentes del centre",
      "modules.core": "El portal, la identitat, Administració i Authentik es mantenen actius per conservar l’accés.",
      "modules.choose": "Tria les ferramentes que vols utilitzar",
      "modules.play": "Crear activitats H5P.",
      "modules.eduhoot": "Qüestionaris i partides d’aula.",
      "modules.resourcesName": "Banc de recursos",
      "modules.recursos": "Explorar i guardar recursos docents.",
      "modules.quiosc": "Activitats supervisades amb Epoptes.",
      "modules.quioscPreparation": "Este servidor no té Epoptes. Quiosc només funciona en l’ordinador de l’aula amb Epoptes, on es prepara automàticament.",
      "modules.retention": "Desactivar una ferramenta conserva les seues dades. Aplicar canvis pot interrompre l’accés uns instants.",
      "modules.signIn": "Entra com a administrador per gestionar les ferramentes.",
      "modules.apply": "Aplicar selecció",
      "modules.later": "Configurar més tard",
      "modules.firstTitle": "Prepara les ferramentes del centre",
      "modules.updateInstaller": "Actualitza l’instal·lador i les imatges de Commons per gestionar els mòduls.",
      "modules.applying": "Aplicant canvis. Pots consultar el progrés davall.",
      "modules.failed": "No s’ha pogut aplicar la selecció. Revisa el progrés i actualitza l’estat abans de reintentar-ho.",
      "modules.error.configuration_changed": "La configuració s’ha actualitzat en una altra sessió. Revisa la selecció actual.",
      "modules.error.operation_busy": "Hi ha una altra operació de manteniment en marxa.",
      "modules.error.quiosc_not_prepared": "Quiosc només es pot activar en l’ordinador de l’aula amb Epoptes.",
      "modules.error.host_runner_unavailable": "No s’ha pogut iniciar l’operació en el servidor. Revisa la instal·lació.",
      "modules.ready": "Ferramentes actives actualitzades. Pots canviar esta selecció quan ho necessites.",
      "modules.firstHint": "Tria les ferramentes del centre. Les podràs canviar després.",
      "modules.unavailable": "No es pot consultar la configuració. Inicia sessió o torna a actualitzar.",
      "common.actionPlaceholder": "Els resultats de les accions apareixeran ací.",
      "login.logout": "Eixir",
      "status.checking": "Comprovant el token...",
      "backup.installTimerConfirm": "Activar el timer diari de backups automàtics en este host?",
      "backup.uninstallTimerConfirm": "Desactivar el timer de backups automàtics en este host?",
      "backup.restorePrompt": "Esta acció pararà el stack i restaurarà {backup}. Escriu RESTAURAR per continuar.",
      "images.rollbackLabel": "Versió anterior per a rollback",
      "images.rollback": "Tornar a la versió anterior",
      "images.rollbackNone": "No hi ha cap actualització reversible",
      "images.rollbackPrompt": "Aquesta acció crearà un backup i tornarà a la versió anterior {backup}. Escriu TORNAR per continuar.",
      "images.rollbackConfirmWord": "TORNAR",
      "images.rollbackCancelled": "Rollback cancel·lat.",
    },
    en: {
      "admin.loadError": "Could not load the panel. Reload the page.",
      "admin.operationError": "Could not complete the operation. Refresh status before trying again.",
      "admin.teacherError": "Could not create the teacher. Check status before trying again.",
      "admin.clearCredential": "Hide temporary password",
      "admin.tracking": "Tracking the server operation.",
      "admin.resumeTracking": "Resume tracking",
      "secondary.title": "Second school backup (optional)",
      "secondary.help": "Use a NAS or USB drive mounted on the server, on another device. Cloud storage is not required.",
      "secondary.mount": "NAS or USB mount point",
      "secondary.mounted": "The device must be mounted and support private files. If it is missing, the local backup is kept and a warning appears here.",
      "secondary.save": "Enable on this device",
      "secondary.copy": "Copy the latest backup now",
      "secondary.disable": "Disable second copy",
      "secondary.state.disabled": "Second copy disabled. Local backups remain available.",
      "secondary.state.ready": "Destination checked. Future backups will be copied; you can also copy the latest one now.",
      "secondary.state.success": "Latest second copy verified",
      "secondary.state.failed": "The last second copy failed. The local backup is safe; connect the device and retry.",
      "secondary.error.device_unavailable": "The device is not mounted or is unavailable.",
      "secondary.error.device_changed": "The device has changed. Check the destination and enable it again.",
      "secondary.error.same_device": "Choose a different device from the disk holding local backups.",
      "secondary.error.private_permissions_required": "The destination must support private directories (0700) and files (0600).",
      "secondary.error.destination_full": "There is not enough free space at the destination.",
      "secondary.error.destination_conflict": "A different backup already exists with that name. It was kept without overwriting.",
      "secondary.error.copy_failed": "The copy could not be written or verified. Check connection, permissions and free space.",
      "secondary.error.copy_verification_failed": "The copy failed verification.",
      "secondary.error.invalid_configuration": "Check and save the destination again.",

      "modules.label": "Modules",
      "modules.title": "School tools",
      "modules.core": "The portal, identity, Administration and Authentik stay active to preserve access.",
      "modules.choose": "Choose the tools you want to use",
      "modules.play": "Create H5P activities.",
      "modules.eduhoot": "Classroom quizzes and games.",
      "modules.resourcesName": "Resource bank",
      "modules.recursos": "Explore and save teaching resources.",
      "modules.quiosc": "Supervised activities with Epoptes.",
      "modules.quioscPreparation": "This server has no Epoptes. Quiosc only works on the classroom computer with Epoptes, where it is prepared automatically.",
      "modules.retention": "Disabling a tool keeps its data. Applying changes may briefly interrupt access.",
      "modules.signIn": "Sign in as administrator to manage tools.",
      "modules.apply": "Apply selection",
      "modules.later": "Configure later",
      "modules.firstTitle": "Set up the school’s tools",
      "modules.updateInstaller": "Update the Commons installer and images to manage modules.",
      "modules.applying": "Applying changes. Follow progress below.",
      "modules.failed": "The selection could not be applied. Review progress and refresh the status before retrying.",
      "modules.error.configuration_changed": "Another session changed the configuration. Review the current selection.",
      "modules.error.operation_busy": "Another maintenance operation is running.",
      "modules.error.quiosc_not_prepared": "Quiosc can only be enabled on the classroom computer with Epoptes.",
      "modules.error.host_runner_unavailable": "The server operation could not be started. Check the installation.",
      "modules.ready": "Active tools updated. You can change this selection whenever you need.",
      "modules.firstHint": "Choose the school’s tools. You can change them later.",
      "modules.unavailable": "Configuration is unavailable. Sign in or refresh again.",
      "common.lang.label": "Language",
      "common.errorLabel": "Error:",
      "common.executing": "Running...",
      "common.actions": "Actions",
      "common.actionPlaceholder": "The results of the actions will appear here.",
      "errors.unauthorized": "unauthorized",
      "admin.title": "Admin panel",
      "admin.pageTitle": "Admin panel — EduTicTac Commons",
      "login.access": "Access",
      "login.title": "Administrator access",
      "login.token": "Identity",
      "login.enter": "Sign in",
      "login.logout": "Log out",
      "login.refresh": "Refresh",
      "teachers.label": "Teachers",
      "teachers.title": "Create teacher account",
      "teachers.username": "Username",
      "teachers.name": "Full name",
      "teachers.email": "Email",
      "teachers.create": "Create teacher",
      "teachers.creating": "Creating teacher...",
      "teachers.help": "The temporary password will be shown only once.",
      "teachers.created": "Teacher created. Username: {username}. Temporary password: {password}",
      "status.checking": "Checking session...",
      "status.label": "Status",
      "status.title": "Operational status of the stack",
      "status.connected": "Connected",
      "status.disconnected": "Disconnected",
      "status.invalidToken": "Session not authorized",
      "status.authRequired": "Sign in to continue",
      "status.signInToView": "Sign in to view the status.",
      "status.notResponding": "not responding",
      "status.stackVersion": "Stack version: {version}",
      "status.imagesLine": "Images: registry={registry} tag={tag} eduhoot={eduhoot}",
      "status.updateChannel": "Update channel: {channel}",
      "status.activeProfiles": "Active profiles: {profiles}",
      "status.none": "none",
      "status.services": "Services:",
      "status.lastBackup": "Last backup: {name} ({date})",
      "status.lastBackupNone": "Last backup: none",
      "status.coverageWarnings": "Coverage warnings: {warnings}",
      "status.backupsAvailable": "Available backups ({count}):",
      "status.backupTimer": "Automatic backup timer:",
      "status.unitFileState": "UnitFileState:",
      "status.activeStateTimer": "ActiveState (timer):",
      "status.activeStateService": "ActiveState (service):",
      "status.lastRun": "Last run:",
      "status.nextRun": "Next run:",
      "status.lastRunResult": "Last run result:",
      "status.checkedAt": "Checked: {date}",
      "status.registryLine": "Registry:",
      "status.channelLine": "Channel:",
      "status.installed": "Installed:",
      "status.available": "Available:",
      "status.updateAvailable": "Update:",
      "status.yes": "yes",
      "status.no": "no",
      "status.loadError": "Error loading status: HTTP {status}",
      "backup.title": "Backups",
      "backup.create": "Create backup now",
      "backup.installTimer": "Enable automatic backups",
      "backup.uninstallTimer": "Disable automatic backups",
      "backup.restoreLabel": "Backup to restore",
      "backup.restore": "Restore selected backup",
      "backup.noneAvailable": "No backup available",
      "backup.noDate": "no date",
      "backup.warnings": "warnings",
      "backup.noneSelected": "No backup selected.",
      "backup.createConfirm": "Create a complete backup now? Services will pause briefly.",
      "backup.installTimerConfirm": "Enable the daily automatic backup timer on this host?",
      "backup.uninstallTimerConfirm": "Disable the automatic backup timer on this host?",
      "backup.restorePrompt": "This action will stop the stack and restore {backup}. Type RESTORE to continue.",
      "backup.restoreCancelled": "Restore cancelled.",
      "backup.restoreConfirmWord": "RESTORE",
      "images.label": "Images",
      "images.title": "Updates",
      "images.check": "Check for updates",
      "images.update": "Update images",
      "images.checking": "Checking for updates...",
      "images.updatePrompt": "This action will find the latest tag in the channel, create a backup, download images and restart the stack. Type UPDATE to continue.",
      "images.updateCancelled": "Update cancelled.",
      "images.updateConfirmWord": "UPDATE",
      "images.rollbackLabel": "Previous version for rollback",
      "images.rollback": "Return to previous version",
      "images.rollbackNone": "No reversible update available",
      "images.rollbackPrompt": "This will create a backup and return to the previous version {backup}. Type RETURN to continue.",
      "images.rollbackConfirmWord": "RETURN",
      "images.rollbackCancelled": "Rollback cancelled.",
      "content.label": "Content",
      "content.title": "Shared catalogue",
      "content.help": "Download and validate the latest published version of the centre network catalogue.",
      "content.resources": "Sync Resources",
      "content.eduhoot": "Sync EduHoot",
      "job.running": "⏳ Running... please wait, this can take a few minutes.",
      "job.success": "✅ Completed successfully.",
      "job.failed": "❌ Failed. Check the log above.",
      "job.timeout": "⚠️ Still running but no longer being checked here. Check the log later.",
      "job.reconnecting": "⏳ Reconnecting... the panel itself may be restarting during the operation.",
    },
  };

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function storedLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) {
        return stored;
      }
    } catch (error) {
      /* localStorage pot estar desactivat */
    }
    return null;
  }

  function detectLang() {
    var stored = storedLang();
    if (stored) {
      return stored;
    }
    var candidates = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || FALLBACK_LANG];
    for (var i = 0; i < candidates.length; i++) {
      var tag = String(candidates[i] || "").toLowerCase();
      if (tag.indexOf("valencia") !== -1) {
        return "va";
      }
      var primary = tag.split("-")[0];
      if (primary === "ca") {
        return "va";
      }
      if (SUPPORTED_LANGS.indexOf(primary) !== -1) {
        return primary;
      }
    }
    return FALLBACK_LANG;
  }

  var lang = detectLang();

  function t(key, vars) {
    var chain = lang === "va" ? ["va", "ca", "es"] : [lang, "es"];
    var value = key;
    for (var i = 0; i < chain.length; i++) {
      var dict = translations[chain[i]];
      if (dict && hasOwn(dict, key)) {
        value = dict[key];
        break;
      }
    }
    if (vars) {
      value = value.replace(/\{(\w+)\}/g, function (match, name) {
        return vars[name] !== undefined ? vars[name] : match;
      });
    }
    return value;
  }

  function applyStaticTranslations() {
    document.title = t("admin.pageTitle");
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      node.placeholder = t(node.getAttribute("data-i18n-placeholder"));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (node) {
      var value = t(node.getAttribute("data-i18n-title"));
      node.setAttribute("title", value);
      if (node.hasAttribute("aria-label")) {
        node.setAttribute("aria-label", value);
      }
    });
  }

  function updateSwitcher() {
    document.querySelectorAll(".lang-switcher [data-lang]").forEach(function (button) {
      var active = button.getAttribute("data-lang") === lang;
      button.classList.toggle("active", active);
      if (active) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  function setLang(newLang) {
    if (SUPPORTED_LANGS.indexOf(newLang) === -1) {
      return;
    }
    lang = newLang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      /* ignora si localStorage no està disponible */
    }
    document.documentElement.setAttribute("lang", lang === "va" ? "ca" : lang);
    applyStaticTranslations();
    updateSwitcher();
    window.dispatchEvent(new CustomEvent("edutictac:langchange", { detail: { lang: lang } }));
  }

  document.documentElement.setAttribute("lang", lang === "va" ? "ca" : lang);

  document.addEventListener("click", function (event) {
    var button = event.target && event.target.closest ? event.target.closest("[data-lang]") : null;
    if (button) {
      setLang(button.getAttribute("data-lang"));
    }
  });

  function ready() {
    applyStaticTranslations();
    updateSwitcher();
    document.documentElement.classList.remove("i18n-pending");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  window.i18nAdmin = {
    t: t,
    getLang: function () {
      return lang;
    },
    setLang: setLang,
    applyStaticTranslations: applyStaticTranslations,
  };
})();
