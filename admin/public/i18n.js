(function () {
  "use strict";

  document.documentElement.classList.add("i18n-pending");

  var SUPPORTED_LANGS = ["ca", "va", "es", "en"];
  var FALLBACK_LANG = "es";
  var STORAGE_KEY = "edutictac-admin-lang";

  var translations = {
    es: {
      "modules.label": "Módulos",
      "modules.title": "Herramientas del centro",
      "modules.core": "El portal, la identidad, Administración y Authentik permanecen activos para conservar el acceso.",
      "modules.choose": "Elige las herramientas que quieres utilizar",
      "modules.play": "Crear actividades H5P.",
      "modules.eduhoot": "Cuestionarios y partidas de aula.",
      "modules.resourcesName": "Banco de recursos",
      "modules.recursos": "Explorar y guardar recursos docentes.",
      "modules.quiosc": "Actividades supervisadas con Epoptes.",
      "modules.quioscPreparation": "Quiosc requiere preparar Epoptes una vez en el servidor.",
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
      "modules.error.quiosc_not_prepared": "Prepara Epoptes en el servidor antes de activar Quiosc.",
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
      "modules.label": "Mòduls",
      "modules.title": "Eines del centre",
      "modules.core": "El portal, la identitat, Administració i Authentik es mantenen actius per conservar l’accés.",
      "modules.choose": "Tria les eines que vols utilitzar",
      "modules.play": "Crear activitats H5P.",
      "modules.eduhoot": "Qüestionaris i partides d’aula.",
      "modules.resourcesName": "Banc de recursos",
      "modules.recursos": "Explorar i desar recursos docents.",
      "modules.quiosc": "Activitats supervisades amb Epoptes.",
      "modules.quioscPreparation": "Quiosc requereix preparar Epoptes una vegada al servidor.",
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
      "modules.error.quiosc_not_prepared": "Prepara Epoptes al servidor abans d’activar Quiosc.",
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
      "modules.quioscPreparation": "Quiosc requerix preparar Epoptes una vegada en el servidor.",
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
      "modules.error.quiosc_not_prepared": "Prepara Epoptes en el servidor abans d’activar Quiosc.",
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
      "modules.label": "Modules",
      "modules.title": "School tools",
      "modules.core": "The portal, identity, Administration and Authentik stay active to preserve access.",
      "modules.choose": "Choose the tools you want to use",
      "modules.play": "Create H5P activities.",
      "modules.eduhoot": "Classroom quizzes and games.",
      "modules.resourcesName": "Resource bank",
      "modules.recursos": "Explore and save teaching resources.",
      "modules.quiosc": "Supervised activities with Epoptes.",
      "modules.quioscPreparation": "Quiosc requires one-time Epoptes preparation on the server.",
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
      "modules.error.quiosc_not_prepared": "Prepare Epoptes on the server before enabling Quiosc.",
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
