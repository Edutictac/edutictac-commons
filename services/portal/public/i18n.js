(function () {
  "use strict";

  document.documentElement.classList.add("i18n-pending");

  var SUPPORTED_LANGS = ["ca", "va", "es", "en"];
  var FALLBACK_LANG = "es";
  var STORAGE_KEY = "edutictac-portal-lang";
  var SHARED_STORAGE_KEY = "edutictac-lang";

  var translations = {
    es: {
      "common.lang.label": "Idioma",
      "common.nav.label": "Navegación principal",
      "common.apiStatus.checking": "Comprobando API...",
      "common.apiStatus.ok": "API activa",
      "common.apiStatus.error": "API no disponible",
      "common.teachers": "Profesorado",
      "common.students": "Alumnado",
      "common.home": "Inicio",
      "common.login": "Entrar",
      "common.logout": "Salir",
      "common.select": "Seleccionar",
      "common.code": "Código",
      "common.group": "Grupo",
      "common.title": "Título",
      "common.activity": "Actividad",
      "common.status": "Estado",
      "common.bestScore": "Mejor puntuación",
      "common.lastScoreAt": "Última vez",
      "common.attempts": "Intentos",
      "common.score": "Puntuación",
      "common.date": "Fecha",
      "common.tableEmpty": "Sin datos todavía.",
      "common.errorLabel": "Error:",
      "common.useAsStudent": "Usar como alumno",
      "common.credentialLoaded": "Credencial cargada. Ya puedes entrar como alumno.",
      "home.title": "Demo local",
      "home.teacherCard.description": "Generar grupos, credenciales, asignaciones y resultados.",
      "home.studentCard.description": "Entrar con código + PIN, ver recorrido y completar actividades.",
      "teacher.title": "Panel docente",
      "teacher.pageTitle": "Panel docente — EduTicTac Commons",
      "teacher.subtitle": "Credenciales, asignaciones y resultados",
      "teacher.accessGroups": "Acceso y grupos",
      "teacher.generatePseudoClass": "Generar aula pseudónima",
      "teacher.tokenLabel": "Token docente",
      "teacher.oidcLogin": "Entrar con Authentik",
      "teacher.summary": "Resumen",
      "teacher.refreshDashboard": "Actualizar panel",
      "teacher.tenantLabel": "Nombre interno del centro",
      "teacher.generateCredentials": "Generar credenciales",
      "teacher.eduhootActivityId": "ID actividad EduHoot",
      "teacher.eduhootIdPlaceholder": "local-... o id del quiz",
      "teacher.eduhootTitle": "Título EduHoot",
      "teacher.eduhootTitlePlaceholder": "Repaso inicial",
      "teacher.assignEduhoot": "Asignar EduHoot",
      "teacher.emptyCredentials": "Todavía no hay credenciales generadas.",
      "teacher.results": "Resultados",
      "teacher.selectedActivity": "Actividad seleccionada",
      "teacher.viewResults": "Ver resultados",
      "teacher.viewRanking": "Ver ranking",
      "teacher.resultsPlaceholder": "Los resultados aparecerán aquí.",
      "teacher.exports": "Exportaciones docentes",
      "teacher.cards": "Tarjetas",
      "teacher.csvCodes": "CSV códigos",
      "teacher.csvStats": "Estadísticas CSV",
      "teacher.groupSelected": "Grupo seleccionado:",
      "teacher.noGroupSelected": "Ningún grupo seleccionado.",
      "teacher.activitySelected": "Actividad seleccionada:",
      "teacher.noActivitySelected": "Ninguna actividad seleccionada.",
      "teacher.activeOfTotal": "identidades activas de {total} totales.",
      "teacher.groups": "Grupos",
      "teacher.groupOpaque": "Grupo opaco",
      "teacher.tenant": "Tenant",
      "teacher.active": "Activas",
      "teacher.activeCredentials": "Credenciales activas",
      "teacher.recentCredentials": "Credenciales activas recientes",
      "teacher.regeneratePin": "Regenerar PIN",
      "teacher.revoke": "Revocar",
      "teacher.pinUpdated": "PIN actualizado",
      "teacher.assignments": "Asignaciones",
      "teacher.resourcesBank": "Banco de recursos",
      "teacher.resourcesTitle": "Buscar y asignar actividades",
      "teacher.resourcesSearch": "Búsqueda",
      "teacher.resourcesPlaceholder": "Título, materia o etiqueta",
      "teacher.resourcesButton": "Buscar recursos",
      "teacher.resourcesHint": "Activa el perfil Recursos para consultar el catálogo.",
      "teacher.resourcesLoading": "Cargando recursos…",
      "teacher.resourcesEmpty": "No se han encontrado recursos.",
      "teacher.resourcesUnavailable": "El Banco de recursos no está disponible en este entorno.",
      "teacher.assignResource": "Asignar al grupo seleccionado",
      "teacher.logoutMessage": "Sesión docente cerrada. Entra de nuevo para generar credenciales.",
      "teacher.groupCreated": "Grupo generado:",
      "teacher.pickCardHint": "Elige una tarjeta de aquí abajo para rellenar el acceso del alumno. Los PIN solo se muestran en este momento; el CSV no los incluye.",
      "teacher.eduhootAssigned": "EduHoot asignado al grupo",
      "teacher.pinRegenerated": "PIN regenerado para el código",
      "teacher.newPin": "Nuevo PIN:",
      "teacher.pinStoreHint": "Guárdalo ahora; no se volverá a mostrar.",
      "teacher.confirmRevoke": "¿Quieres revocar la credencial {label}? Las sesiones abiertas quedarán cerradas.",
      "teacher.revoked": "Credencial {label} revocada.",
      "teacher.groupRestored": "Grupo recuperado:",
      "teacher.groupRestoredHint": "Entra como docente para abrir tarjetas, CSV o consultar resultados.",
      "teacher.activityRestored": "Actividad recuperada:",
      "teacher.errors.loginFirst": "Entra primero como docente.",
      "teacher.errors.selectGroupFirst": "Selecciona o genera primero un grupo.",
      "teacher.errors.enterEduhootId": "Indica el ID de la actividad EduHoot.",
      "teacher.errors.selectActivityFirst": "Selecciona o asigna primero una actividad.",
      "student.title": "Panel de alumnado",
      "student.pageTitle": "Panel de alumnado — EduTicTac Commons",
      "student.subtitle": "Recorrido y actividad",
      "student.access": "Acceso",
      "student.loginTitle": "Entrar con código + PIN",
      "student.codeLabel": "Código público",
      "student.pinLabel": "PIN",
      "student.login": "Entrar como alumno",
      "student.logout": "Salir",
      "student.done": "Hecha",
      "student.pending": "Pendiente",
      "student.openEduhoot": "Abrir EduHoot",
      "student.openPlay": "Abrir actividad",
      "student.progressLabel": "Recorrido:",
      "student.progressCompleted": "actividades completadas.",
      "student.profileAria": "Perfil pseudónimo",
      "student.hello": "Hola,",
      "student.iconHint": "Elige un icono para reconocerte mejor en las actividades.",
      "student.iconPickerAria": "Icono del alumno",
      "student.chooseIcon": "Elegir",
      "student.iconSaved": "Icono guardado.",
      "student.logoutMessage": "Sesión cerrada. Entra de nuevo con tu código + PIN cuando quieras continuar.",
      "student.loginPrompt": "Entra con tu código + PIN para ver tu itinerario individual.",
      "student.errors.loginFirst": "Entra primero como alumno.",
    },
    ca: {
      "common.lang.label": "Idioma",
      "common.nav.label": "Navegació principal",
      "common.apiStatus.checking": "Comprovant API...",
      "common.apiStatus.ok": "API activa",
      "common.apiStatus.error": "API no disponible",
      "common.teachers": "Professorat",
      "common.students": "Alumnat",
      "common.home": "Inici",
      "common.login": "Entrar",
      "common.logout": "Sortir",
      "common.select": "Seleccionar",
      "common.code": "Codi",
      "common.group": "Grup",
      "common.title": "Títol",
      "common.activity": "Activitat",
      "common.status": "Estat",
      "common.bestScore": "Millor puntuació",
      "common.lastScoreAt": "Última vegada",
      "common.attempts": "Intents",
      "common.score": "Puntuació",
      "common.date": "Data",
      "common.tableEmpty": "Sense dades encara.",
      "common.errorLabel": "Error:",
      "common.useAsStudent": "Usar com a alumne",
      "common.credentialLoaded": "Credencial carregada. Ja pots entrar com a alumne.",
      "home.title": "Demo local",
      "home.teacherCard.description": "Generar grups, credencials, assignacions i resultats.",
      "home.studentCard.description": "Entrar amb codi + PIN, veure recorregut i completar activitats.",
      "teacher.title": "Tauler docent",
      "teacher.pageTitle": "Tauler docent — EduTicTac Commons",
      "teacher.subtitle": "Credencials, assignacions i resultats",
      "teacher.accessGroups": "Accés i grups",
      "teacher.generatePseudoClass": "Generar aula pseudònima",
      "teacher.tokenLabel": "Token docent",
      "teacher.oidcLogin": "Entrar amb Authentik",
      "teacher.summary": "Resum",
      "teacher.refreshDashboard": "Actualitzar tauler",
      "teacher.tenantLabel": "Nom intern del centre",
      "teacher.generateCredentials": "Generar credencials",
      "teacher.eduhootActivityId": "ID activitat EduHoot",
      "teacher.eduhootIdPlaceholder": "local-... o id del quiz",
      "teacher.eduhootTitle": "Títol EduHoot",
      "teacher.eduhootTitlePlaceholder": "Repàs inicial",
      "teacher.assignEduhoot": "Assignar EduHoot",
      "teacher.emptyCredentials": "Encara no hi ha credencials generades.",
      "teacher.results": "Resultats",
      "teacher.selectedActivity": "Activitat seleccionada",
      "teacher.viewResults": "Veure resultats",
      "teacher.viewRanking": "Veure rànquing",
      "teacher.resultsPlaceholder": "Els resultats apareixeran aquí.",
      "teacher.exports": "Exportacions docents",
      "teacher.cards": "Targetes",
      "teacher.csvCodes": "CSV codis",
      "teacher.csvStats": "Estadístiques CSV",
      "teacher.groupSelected": "Grup seleccionat:",
      "teacher.noGroupSelected": "Cap grup seleccionat.",
      "teacher.activitySelected": "Activitat seleccionada:",
      "teacher.noActivitySelected": "Cap activitat seleccionada.",
      "teacher.activeOfTotal": "identitats actives de {total} totals.",
      "teacher.groups": "Grups",
      "teacher.groupOpaque": "Grup opac",
      "teacher.tenant": "Tenant",
      "teacher.active": "Actives",
      "teacher.activeCredentials": "Credencials actives",
      "teacher.recentCredentials": "Credencials actives recents",
      "teacher.regeneratePin": "Regenerar PIN",
      "teacher.revoke": "Revocar",
      "teacher.pinUpdated": "PIN actualitzat",
      "teacher.assignments": "Assignacions",
      "teacher.resourcesBank": "Banc de recursos",
      "teacher.resourcesTitle": "Buscar i assignar activitats",
      "teacher.resourcesSearch": "Cerca",
      "teacher.resourcesPlaceholder": "Títol, matèria o etiqueta",
      "teacher.resourcesButton": "Buscar recursos",
      "teacher.resourcesHint": "Activa el perfil Recursos per consultar el catàleg.",
      "teacher.resourcesLoading": "Carregant recursos…",
      "teacher.resourcesEmpty": "No s'han trobat recursos.",
      "teacher.resourcesUnavailable": "El Banc de recursos no està disponible en aquest entorn.",
      "teacher.assignResource": "Assignar al grup seleccionat",
      "teacher.logoutMessage": "Sessió docent tancada. Entra de nou per generar credencials.",
      "teacher.groupCreated": "Grup generat:",
      "teacher.pickCardHint": "Tria una targeta d'aquí baix per omplir l'accés de l'alumne. Els PINs només es mostren en aquest moment; el CSV no els inclou.",
      "teacher.eduhootAssigned": "EduHoot assignat al grup",
      "teacher.pinRegenerated": "PIN regenerat per al codi",
      "teacher.newPin": "Nou PIN:",
      "teacher.pinStoreHint": "Desa'l ara; no es tornarà a mostrar.",
      "teacher.confirmRevoke": "Vols revocar la credencial {label}? Les sessions obertes quedaran tancades.",
      "teacher.revoked": "Credencial {label} revocada.",
      "teacher.groupRestored": "Grup recuperat:",
      "teacher.groupRestoredHint": "Entra com a docent per obrir targetes, CSV o consultar resultats.",
      "teacher.activityRestored": "Activitat recuperada:",
      "teacher.errors.loginFirst": "Entra primer com a docent.",
      "teacher.errors.selectGroupFirst": "Selecciona o genera primer un grup.",
      "teacher.errors.enterEduhootId": "Indica l'ID de l'activitat EduHoot.",
      "teacher.errors.selectActivityFirst": "Selecciona o assigna primer una activitat.",
      "student.title": "Tauler d'alumnat",
      "student.pageTitle": "Tauler d'alumnat — EduTicTac Commons",
      "student.subtitle": "Recorregut i activitat",
      "student.access": "Accés",
      "student.loginTitle": "Entrar amb codi + PIN",
      "student.codeLabel": "Codi públic",
      "student.pinLabel": "PIN",
      "student.login": "Entrar com a alumne",
      "student.logout": "Sortir",
      "student.done": "Feta",
      "student.pending": "Pendent",
      "student.openEduhoot": "Obrir EduHoot",
      "student.openPlay": "Obrir activitat",
      "student.progressLabel": "Recorregut:",
      "student.progressCompleted": "activitats completades.",
      "student.profileAria": "Perfil pseudònim",
      "student.hello": "Hola,",
      "student.iconHint": "Tria una icona per reconèixer-te millor en les activitats.",
      "student.iconPickerAria": "Icona de l'alumne",
      "student.chooseIcon": "Triar",
      "student.iconSaved": "Icona guardada.",
      "student.logoutMessage": "Sessió tancada. Entra de nou amb el teu codi + PIN quan vulguis continuar.",
      "student.loginPrompt": "Entra amb el teu codi + PIN per veure el teu itinerari individual.",
      "student.errors.loginFirst": "Entra primer com a alumne.",
    },
    va: {
      "common.apiStatus.checking": "Comprovant l'API...",
      "common.logout": "Eixir",
      "teacher.resultsPlaceholder": "Els resultats apareixeran ací.",
      "teacher.resourcesBank": "Banc de recursos",
      "teacher.resourcesTitle": "Buscar i assignar activitats",
      "teacher.resourcesSearch": "Cerca",
      "teacher.resourcesPlaceholder": "Títol, matèria o etiqueta",
      "teacher.resourcesButton": "Buscar recursos",
      "teacher.resourcesHint": "Activa el perfil Recursos per consultar el catàleg.",
      "teacher.resourcesLoading": "Carregant recursos…",
      "teacher.resourcesEmpty": "No s'han trobat recursos.",
      "teacher.resourcesUnavailable": "El Banc de recursos no està disponible en aquest entorn.",
      "teacher.assignResource": "Assignar al grup seleccionat",
      "teacher.pickCardHint": "Tria una targeta d'ací baix per omplir l'accés de l'alumne. Els PINs només es mostren en este moment; el CSV no els inclou.",
      "teacher.pinStoreHint": "Guarda'l ara; no es tornarà a mostrar.",
      "student.logout": "Eixir",
      "student.logoutMessage": "Sessió tancada. Entra de nou amb el teu codi + PIN quan vulgues continuar.",
      "student.loginPrompt": "Entra amb el teu codi + PIN per vore el teu itinerari individual.",
    },
    en: {
      "common.lang.label": "Language",
      "common.nav.label": "Main navigation",
      "common.apiStatus.checking": "Checking API...",
      "common.apiStatus.ok": "API online",
      "common.apiStatus.error": "API unavailable",
      "common.teachers": "Teachers",
      "common.students": "Students",
      "common.home": "Home",
      "common.login": "Log in",
      "common.logout": "Log out",
      "common.select": "Select",
      "common.code": "Code",
      "common.group": "Group",
      "common.title": "Title",
      "common.activity": "Activity",
      "common.status": "Status",
      "common.bestScore": "Best score",
      "common.lastScoreAt": "Last time",
      "common.attempts": "Attempts",
      "common.score": "Score",
      "common.date": "Date",
      "common.tableEmpty": "No data yet.",
      "common.errorLabel": "Error:",
      "common.useAsStudent": "Use as student",
      "common.credentialLoaded": "Credential loaded. You can now log in as a student.",
      "home.title": "Local demo",
      "home.teacherCard.description": "Create groups, credentials, assignments and results.",
      "home.studentCard.description": "Enter with code + PIN, view your journey and complete activities.",
      "teacher.title": "Teacher dashboard",
      "teacher.pageTitle": "Teacher dashboard — EduTicTac Commons",
      "teacher.subtitle": "Credentials, assignments and results",
      "teacher.accessGroups": "Access and groups",
      "teacher.generatePseudoClass": "Generate pseudonymous classroom",
      "teacher.tokenLabel": "Teacher token",
      "teacher.oidcLogin": "Log in with Authentik",
      "teacher.summary": "Summary",
      "teacher.refreshDashboard": "Refresh dashboard",
      "teacher.tenantLabel": "Internal centre name",
      "teacher.generateCredentials": "Generate credentials",
      "teacher.eduhootActivityId": "EduHoot activity ID",
      "teacher.eduhootIdPlaceholder": "local-... or quiz id",
      "teacher.eduhootTitle": "EduHoot title",
      "teacher.eduhootTitlePlaceholder": "Initial review",
      "teacher.assignEduhoot": "Assign EduHoot",
      "teacher.emptyCredentials": "No credentials generated yet.",
      "teacher.results": "Results",
      "teacher.selectedActivity": "Selected activity",
      "teacher.viewResults": "View results",
      "teacher.viewRanking": "View ranking",
      "teacher.resultsPlaceholder": "Results will appear here.",
      "teacher.exports": "Teacher exports",
      "teacher.cards": "Cards",
      "teacher.csvCodes": "CSV codes",
      "teacher.csvStats": "CSV statistics",
      "teacher.groupSelected": "Selected group:",
      "teacher.noGroupSelected": "No group selected.",
      "teacher.activitySelected": "Selected activity:",
      "teacher.noActivitySelected": "No activity selected.",
      "teacher.activeOfTotal": "active identities out of {total} total.",
      "teacher.groups": "Groups",
      "teacher.groupOpaque": "Opaque group",
      "teacher.tenant": "Tenant",
      "teacher.active": "Active",
      "teacher.activeCredentials": "Active credentials",
      "teacher.recentCredentials": "Recent active credentials",
      "teacher.regeneratePin": "Regenerate PIN",
      "teacher.revoke": "Revoke",
      "teacher.pinUpdated": "PIN updated",
      "teacher.assignments": "Assignments",
      "teacher.resourcesBank": "Resource bank",
      "teacher.resourcesTitle": "Find and assign activities",
      "teacher.resourcesSearch": "Search",
      "teacher.resourcesPlaceholder": "Title, subject or tag",
      "teacher.resourcesButton": "Search resources",
      "teacher.resourcesHint": "Enable the Resources profile to browse the catalogue.",
      "teacher.resourcesLoading": "Loading resources…",
      "teacher.resourcesEmpty": "No resources found.",
      "teacher.resourcesUnavailable": "The Resources catalogue is not available in this environment.",
      "teacher.assignResource": "Assign to selected group",
      "teacher.logoutMessage": "Teacher session closed. Log in again to generate credentials.",
      "teacher.groupCreated": "Group created:",
      "teacher.pickCardHint": "Pick a card below to fill the student's access. PINs are only shown now; the CSV does not include them.",
      "teacher.eduhootAssigned": "EduHoot assigned to group",
      "teacher.pinRegenerated": "PIN regenerated for code",
      "teacher.newPin": "New PIN:",
      "teacher.pinStoreHint": "Save it now; it will not be shown again.",
      "teacher.confirmRevoke": "Revoke credential {label}? Open sessions will be closed.",
      "teacher.revoked": "Credential {label} revoked.",
      "teacher.groupRestored": "Group restored:",
      "teacher.groupRestoredHint": "Log in as teacher to open cards, CSV or check results.",
      "teacher.activityRestored": "Activity restored:",
      "teacher.errors.loginFirst": "Log in as teacher first.",
      "teacher.errors.selectGroupFirst": "Select or create a group first.",
      "teacher.errors.enterEduhootId": "Enter the EduHoot activity ID.",
      "teacher.errors.selectActivityFirst": "Select or assign an activity first.",
      "student.title": "Student dashboard",
      "student.pageTitle": "Student dashboard — EduTicTac Commons",
      "student.subtitle": "Journey and activity",
      "student.access": "Access",
      "student.loginTitle": "Enter with code + PIN",
      "student.codeLabel": "Public code",
      "student.pinLabel": "PIN",
      "student.login": "Log in as student",
      "student.logout": "Log out",
      "student.done": "Done",
      "student.pending": "Pending",
      "student.openEduhoot": "Open EduHoot",
      "student.openPlay": "Open activity",
      "student.progressLabel": "Journey:",
      "student.progressCompleted": "activities completed.",
      "student.profileAria": "Pseudonymous profile",
      "student.hello": "Hello,",
      "student.iconHint": "Pick an icon to recognise yourself in the activities.",
      "student.iconPickerAria": "Student icon",
      "student.chooseIcon": "Choose",
      "student.iconSaved": "Icon saved.",
      "student.logoutMessage": "Session closed. Log in again with your code + PIN whenever you want to continue.",
      "student.loginPrompt": "Log in with your code + PIN to see your individual itinerary.",
      "student.errors.loginFirst": "Log in as student first.",
    },
  };

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function storedLang() {
    try {
      var keys = [STORAGE_KEY, SHARED_STORAGE_KEY];
      for (var i = 0; i < keys.length; i++) {
        var stored = localStorage.getItem(keys[i]);
        if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) {
          return stored;
        }
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
      localStorage.setItem(SHARED_STORAGE_KEY, lang);
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

  window.i18nPortal = {
    t: t,
    getLang: function () {
      return lang;
    },
    setLang: setLang,
    applyStaticTranslations: applyStaticTranslations,
  };
})();
