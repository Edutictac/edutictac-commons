(function () {
  "use strict";

  document.documentElement.classList.add("i18n-pending");

  var SUPPORTED_LANGS = ["ca", "va", "es", "en"];
  var FALLBACK_LANG = "es";
  var STORAGE_KEY = "edutictac-admin-lang";

  var translations = {
    es: {
      "common.lang.label": "Idioma",
      "common.errorLabel": "Error:",
      "common.executing": "Ejecutando...",
      "common.actions": "Acciones",
      "common.actionPlaceholder": "Los resultados de las acciones aparecerán aquí.",
      "errors.unauthorized": "no autorizado",
      "admin.title": "Panel de administración",
      "admin.pageTitle": "Panel de administración — EduTicTac Commons",
      "login.access": "Acceso",
      "login.title": "Token de administración",
      "login.token": "Token",
      "login.enter": "Entrar",
      "login.logout": "Salir",
      "login.refresh": "Actualizar",
      "status.checking": "Comprobando token...",
      "status.label": "Estado",
      "status.title": "Estado operativo del stack",
      "status.connected": "Conectado",
      "status.disconnected": "Desconectado",
      "status.invalidToken": "Token inválido",
      "status.enterToken": "Entra con el token para ver el estado.",
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
      "backup.createConfirm": "¿Crear un backup ahora?",
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
    },
    ca: {
      "common.lang.label": "Idioma",
      "common.errorLabel": "Error:",
      "common.executing": "Executant...",
      "common.actions": "Accions",
      "common.actionPlaceholder": "Els resultats de les accions apareixeran aquí.",
      "errors.unauthorized": "no autoritzat",
      "admin.title": "Panell d'administració",
      "admin.pageTitle": "Panell d'administració — EduTicTac Commons",
      "login.access": "Accés",
      "login.title": "Token d'administració",
      "login.token": "Token",
      "login.enter": "Entrar",
      "login.logout": "Sortir",
      "login.refresh": "Actualitzar",
      "status.checking": "Comprovant token...",
      "status.label": "Estat",
      "status.title": "Estat operatiu del stack",
      "status.connected": "Connectat",
      "status.disconnected": "Desconnectat",
      "status.invalidToken": "Token invàlid",
      "status.enterToken": "Entra amb el token per veure l'estat.",
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
      "backup.createConfirm": "Crear un backup ara?",
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
    },
    va: {
      "common.actionPlaceholder": "Els resultats de les accions apareixeran ací.",
      "login.logout": "Eixir",
      "status.checking": "Comprovant el token...",
      "backup.installTimerConfirm": "Activar el timer diari de backups automàtics en este host?",
      "backup.uninstallTimerConfirm": "Desactivar el timer de backups automàtics en este host?",
      "backup.restorePrompt": "Esta acció pararà el stack i restaurarà {backup}. Escriu RESTAURAR per continuar.",
    },
    en: {
      "common.lang.label": "Language",
      "common.errorLabel": "Error:",
      "common.executing": "Running...",
      "common.actions": "Actions",
      "common.actionPlaceholder": "The results of the actions will appear here.",
      "errors.unauthorized": "unauthorized",
      "admin.title": "Admin panel",
      "admin.pageTitle": "Admin panel — EduTicTac Commons",
      "login.access": "Access",
      "login.title": "Admin token",
      "login.token": "Token",
      "login.enter": "Log in",
      "login.logout": "Log out",
      "login.refresh": "Refresh",
      "status.checking": "Checking token...",
      "status.label": "Status",
      "status.title": "Operational status of the stack",
      "status.connected": "Connected",
      "status.disconnected": "Disconnected",
      "status.invalidToken": "Invalid token",
      "status.enterToken": "Log in with the token to see the status.",
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
      "backup.createConfirm": "Create a backup now?",
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
