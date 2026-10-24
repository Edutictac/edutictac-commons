const STORAGE_KEY = "edutictac-commons-state";

const state = {
  teacher: false,
  group: null,
  groups: [],
  groupsTotal: 0,
  identities: [],
  assignment: null,
  assignments: [],
  summary: null,
  dataReady: false,
  enabledModules: null,
  llibresPort: 8098,
};

const $ = (id) => document.getElementById(id);
const has = (id) => Boolean($(id));
const t = window.i18nPortal.t;
const deployment = window.commonsDeployment || {};
const federated = deployment.mode === 'federated';
function configuredUrl(value) {
  if (typeof value !== 'string' || !value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
let itinerariesPanel = null, groupsPanel = null, membersPanel = null, credentialsPanel = null, assignmentsPanel = null, resultsPanel = null, resourcesPanel = null, classroomFilesPanel = null, adminGroupsPanel = null;
let teacherDataSequence = 0, identityStatusSequence = 0;
let studentPanel = null;

function syncTeacherPanels() {
  const context = {teacher: state.teacher, group: state.group, groups: state.groups, groupsTotal: state.groupsTotal,
    assignments: state.assignments, assignment: state.assignment, identities: state.identities, summary: state.summary, dataReady: state.dataReady, resourcesEnabled: !state.enabledModules || state.enabledModules.has("recursos"), favoritesEnabled: !federated || deployment.bankFavorites === true};
  itinerariesPanel?.setContext(context);
  groupsPanel?.setContext(context);
  membersPanel?.setContext(context);
  credentialsPanel?.setContext(context);
  assignmentsPanel?.setContext(context);
  resultsPanel?.setContext(context);
  resourcesPanel?.setContext(context);
  classroomFilesPanel?.setContext(context);
  adminGroupsPanel?.setContext(context);
}

async function selectTeacherGroup(id) {
  const group = state.groups.find(item => item.id === id);
  if (!group || !state.teacher) return;
  state.group = {id: group.id, group_code: group.name, label: group.label || '', tenant_id: group.tenant_id};
  state.assignment = null;
  saveState();
  await refreshDashboard();
}

async function selectTeacherAssignment(id) {
  if (!state.teacher || !state.dataReady) return;
  const assignment = state.assignments.find(item => item.id === id);
  if (!assignment) return;
  const group = state.groups.find(item => item.id === assignment.group_id);
  state.assignment = assignment;
  if (group) state.group = {id: group.id, group_code: group.name, label: group.label || '', tenant_id: group.tenant_id};
  saveState();
  if (has("itinerariesOutput")) await loadItineraries();
}

async function loadItineraries() {
  syncTeacherPanels();
  await itinerariesPanel?.load();
}

function setAuthentikLinks() {
  const url = configuredUrl(deployment.authentikUrl) || `${window.location.protocol}//${window.location.hostname}:9000/`;
  ["authentikHomeLink", "authentikNavLink", "oidcSetupLink", "firstRunSetupLink"].forEach((id) => {
    const link = $(id);
    if (link) link.href = url;
  });
  const account = $("accountWidget");
  if (account) {
    account.dataset.accountUrl = `${url}if/flow/default-password-change/?next=%2Fif%2Fuser%2F%23%2Fsettings%3B%7B%22page%22%3A%22page-details%22%7D`;
    const publicHome = configuredUrl(deployment.publicHomeUrl) || (federated ? "https://edutictac.es/" : "");
    if (publicHome) account.dataset.publicHome = publicHome;
  }
}

function showOidcSetupNotice() {
  const dialog = $("oidcSetupDialog");
  if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
    dialog.showModal();
  }
}

function ensureFirstRunDialog() {
  if ($("firstRunSetupDialog")) return $("firstRunSetupDialog");
  document.body.insertAdjacentHTML("beforeend", `
    <dialog id="firstRunSetupDialog" class="setup-dialog">
      <form id="firstRunSetupForm">
        <p class="eyebrow" data-i18n="setup.firstRunEyebrow">Primera configuración</p>
        <h2 data-i18n="setup.firstRunTitle">Activa EduTicTac Commons</h2>
        <p data-i18n="setup.activationHint">Introduce el código que ha mostrado el instalador. Solo funciona una vez.</p>
        <label for="firstRunSetupCode" data-i18n="setup.activationCode">Código de activación</label>
        <input id="firstRunSetupCode" name="code" autocomplete="one-time-code" required minlength="8" maxlength="64" spellcheck="false">
        <p id="firstRunSetupError" class="profile-status hidden"></p>
        <div id="firstRunSetupResult" class="hidden">
          <p data-i18n="setup.initialCredentials">Credenciales iniciales:</p>
          <p><strong data-i18n="setup.username">Usuario:</strong> <code id="firstRunSetupUser"></code><br><strong data-i18n="setup.password">Contraseña:</strong> <code id="firstRunSetupPassword"></code></p>
          <p data-i18n="setup.changePasswordHint">Guárdalas temporalmente, entra en el panel de acceso y cambia la contraseña inmediatamente.</p>
          <p><a id="firstRunSetupLink" href="#" target="_blank" rel="noopener" data-i18n="setup.openAuthentik">Abrir panel de acceso</a></p>
          <p><a href="/admin/" data-i18n="setup.chooseModules">Continuar: elegir las herramientas del centro</a></p>
        </div>
        <div class="actions">
          <button id="firstRunSetupSubmit" type="submit" data-i18n="setup.activate">Activar instalación</button>
          <button id="firstRunSetupClose" type="button" class="secondary" data-i18n="setup.close">Cerrar</button>
        </div>
      </form>
    </dialog>
  `);
  if (window.i18nPortal) window.i18nPortal.applyStaticTranslations();
  setAuthentikLinks();
  const dialog = $("firstRunSetupDialog");
  $("firstRunSetupClose").addEventListener("click", () => dialog.close());
  $("firstRunSetupForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = $("firstRunSetupError");
    const submit = $("firstRunSetupSubmit");
    error.classList.add("hidden");
    submit.disabled = true;
    try {
      const result = await api("/api/setup/activate", {
        method: "POST",
        body: JSON.stringify({ code: $("firstRunSetupCode").value }),
      });
      $("firstRunSetupUser").textContent = result.username;
      $("firstRunSetupPassword").textContent = result.password;
      $("firstRunSetupResult").classList.remove("hidden");
      $("firstRunSetupCode").disabled = true;
      submit.classList.add("hidden");
      $("firstRunSetupClose").textContent = t("setup.close");
    } catch (activationError) {
      error.textContent = activationError.message || t("setup.activationError");
      error.classList.remove("hidden");
      submit.disabled = false;
    }
  });
  return dialog;
}

async function checkFirstRunSetup() {
  if (federated) return;
  try {
    const status = await api("/api/setup/status", { method: "GET" });
    if (!status.pending) return;
    const dialog = ensureFirstRunDialog();
    if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
  } catch (error) {
    // The wizard is optional for source/development installations.
  }
}

function setApplicationLinks() {
  const directPorts = {
    "80": { play: "8084", recursos: "8086", eduhoot: "8090", admin: "8091" },
    "8082": { play: "8084", recursos: "8086", eduhoot: "8090", admin: "8091" },
    "18082": { play: "18084", recursos: "18086", eduhoot: "18090", admin: "18091" },
  };
  const localPackageHost = window.location.hostname === "edutictac.local"
    || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(window.location.hostname);
  const ports = directPorts[window.location.port] || (localPackageHost ? directPorts["80"] : null);
  const links = ports
    ? {
        playHomeLink: `${window.location.protocol}//${window.location.hostname}:${ports.play}/`,
        resourcesHomeLink: `${window.location.protocol}//${window.location.hostname}:${ports.recursos}/`,
        eduhootHomeLink: `${window.location.protocol}//${window.location.hostname}:${ports.eduhoot}/`,
        adminHomeLink: `${window.location.origin}/admin/`,
      }
    : {
        playHomeLink: `${window.location.origin}/play/`,
        resourcesHomeLink: `${window.location.origin}/recursos/`,
        eduhootHomeLink: `${window.location.origin}/eduhoot/`,
        adminHomeLink: `${window.location.origin}/admin/`,
      };
  if (federated) {
    for (const [id, app] of Object.entries({playHomeLink:'play',resourcesHomeLink:'recursos',eduhootHomeLink:'eduhoot'})) {
      const url = configuredUrl(deployment.applications?.[app]);
      if (url) links[id] = url;
    }
    document.querySelectorAll('a[href="/admin/"], a[href="/quiosc.html"]').forEach(link => { link.hidden = true; });
  }
  Object.entries(links).forEach(([id, url]) => {
    const link = $(id);
    if (link) {
      const destination = new URL(url, window.location.origin);
      if (['playHomeLink', 'resourcesHomeLink'].includes(id)) destination.searchParams.set(id === 'resourcesHomeLink' ? 'ui_lang' : 'lang', window.i18nPortal.getLang());
      link.href = destination.href;
    }
  });
  const llibresLink = $("llibresHomeLink");
  if (llibresLink) {
    const url = configuredUrl(deployment.applications?.llibres) || (!federated ? `${window.location.protocol}//${window.location.hostname}:${state.llibresPort}/` : null);
    llibresLink.hidden = !url || (!federated && !state.enabledModules?.has("llibres"));
    if (url) {
      const destination = new URL(url);
      destination.searchParams.set('lang', window.i18nPortal.getLang());
      llibresLink.href = destination.href;
    } else llibresLink.removeAttribute('href');
  }
  const teacherResourcesLink = $("teacherResourcesLink");
  if (teacherResourcesLink) teacherResourcesLink.href = links.resourcesHomeLink;
}

async function loadEnabledModules() {
  try {
    const data = await api("/api/modules/status", { method: "GET" });
    if (!Array.isArray(data.enabled)) return;
    state.enabledModules = new Set(data.enabled);
    if (Number.isInteger(data.ports?.llibres) && data.ports.llibres >= 1 && data.ports.llibres <= 65535) state.llibresPort = data.ports.llibres;
    syncTeacherPanels();
    setApplicationLinks();
    document.querySelectorAll("[data-module]").forEach((node) => {
      const publicApp = federated && configuredUrl(deployment.applications?.[node.dataset.module]);
      node.hidden = (federated && node.dataset.module === 'quiosc') || (!state.enabledModules.has(node.dataset.module) && !publicApp);
    });
  } catch {
    // Older API images and source-only development retain the existing links.
  }
}

async function loadBlocsLink() {
  if (!has("blocsHomeLink")) return;
  const publicUrl = federated && configuredUrl(deployment.applications?.blocs);
  if (publicUrl) {
    $("blocsHomeLink").href = publicUrl;
    $("blocsHomeLink").hidden = false;
    return;
  }
  try {
    const data = await api("/blocs/status", { method: "GET" });
    $("blocsHomeLink").hidden = data.enabled !== true && !(Array.isArray(data.enabled) && data.enabled.includes("blocs"));
  } catch { /* Blocs is an optional editor. */ }
}

function saveState() {
  syncTeacherPanels();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      group: state.group,
      assignment: state.assignment,
    }),
  );
}

function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.group = saved.group || null;
    state.assignment = saved.assignment || null;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function setEmpty(node, content) {
  node.classList.add("empty");
  node.removeAttribute("data-i18n");
  node.textContent = content;
}

function setTeacherSession(active) {
  if (state.teacher !== active) teacherDataSequence++;
  state.teacher = active;
  if (!active) state.dataReady = false;
  const loginButton = $("teacherOidcLogin");
  const logoutButton = $("teacherLogout");
  if (loginButton) {
    loginButton.classList.toggle("hidden", active);
    loginButton.setAttribute("aria-hidden", active ? "true" : "false");
  }
  if (logoutButton) {
    logoutButton.classList.toggle("hidden", !active);
    logoutButton.setAttribute("aria-hidden", active ? "false" : "true");
  }
  ["teacherSummary", "refreshDashboard", "teacherLogout"].forEach((id) => {
    const node = $(id);
    if (node) {
      node.disabled = !active;
    }
  });
  syncTeacherPanels();
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const detail = body && body.detail ? body.detail : response.statusText;
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }
  return body;
}

// El xip compartit (`<edutictac-account>`) mostra la sessió i la tanca; el
// portal només li demana que torne a consultar-la després d'entrar o eixir.
function checkIdentityStatus() {
  window.dispatchEvent(new CustomEvent("edutictac:sessionrefresh"));
}

async function checkOidc() {
  const button = $("teacherOidcLogin");
  if (!button) return;
  try {
    if (!federated) {
      const setup = await api("/api/setup/status", { method: "GET" });
      if (setup.pending) {
        button.disabled = true;
        return;
      }
    }
    const status = await api("/api/auth/oidc/status", { method: "GET" });
    button.disabled = !status.enabled;
    button.title = status.enabled ? status.issuer : (federated ? t('common.session.unavailable') : "OIDC no configurado en este entorno");
    if (!status.enabled && !federated) showOidcSetupNotice();
  } catch (error) {
    button.disabled = true;
  }
}

async function refreshTeacherSession() {
  try {
    await api("/api/teacher/summary", { method: "GET" });
    setTeacherSession(true);
    await refreshDashboard();
  } catch (error) {
    if (error.status === 401) setTeacherSession(false);
    assignmentsPanel?.report(error);
  }
}

function teacherOidcLogin() {
  window.location.href = "/api/auth/oidc/login";
}

async function teacherLogout() {
  await api("/api/teacher/logout", { method: "POST" });
  setTeacherSession(false);
  state.group = null;
  state.groups = [];
  state.identities = [];
  state.assignment = null;
  state.assignments = [];
  saveState();
  state.summary = null;
  syncTeacherPanels();
}

async function teacherSummary() {
  const summary = await api("/api/teacher/summary", {method: "GET"});
  if (!state.teacher) return;
  state.groups = summary.groups || [];
  state.groupsTotal = summary.groups_total ?? state.groups.length;
  state.summary = summary;
  syncTeacherPanels();
}

async function loadTeacherData() {
  const sequence = ++teacherDataSequence;
  state.dataReady = false; syncTeacherPanels();
  let data;
  try { data = await Promise.all([
    api("/api/teacher/summary", { method: "GET" }),
    api("/api/teacher/activity-assignments", { method: "GET" }),
    api("/api/teacher/identities", { method: "GET" }),
  ]); } catch (error) {
    if (!state.teacher || sequence !== teacherDataSequence) return null;
    assignmentsPanel?.report(error); throw error;
  }
  if (!state.teacher || sequence !== teacherDataSequence) return null;
  const [summary, assignmentData, identityData] = data;
  state.summary = summary; state.dataReady = true;
  state.groups = summary.groups || [];
  state.groupsTotal = summary.groups_total ?? state.groups.length;
  state.assignments = assignmentData.assignments || [];
  state.identities = identityData.identities || [];
  if (state.group) {
    const freshGroup = state.groups.find((group) => group.id === state.group.id);
    if (freshGroup) {
      state.group = { id: freshGroup.id, group_code: freshGroup.name, label: freshGroup.label || '', tenant_id: freshGroup.tenant_id };
    }
  }
  if (state.assignment) {
    state.assignment = state.assignments.find((assignment) => assignment.id === state.assignment.id) || state.assignment;
  }
  saveState();
  return [summary, assignmentData, identityData];
}

async function refreshDashboard() {
  if (!state.teacher) {
    throw new Error(t("teacher.errors.loginFirst"));
  }
  if (!await loadTeacherData()) return;
  if (state.group && has("itinerariesOutput")) {
    await loadItineraries();
  }
}

function afterClassCreated({group, count}) {
  state.group = group;
  state.groups = [{id: group.id, name: group.group_code, label: group.label || '', tenant_id: group.tenant_id, active: count},
    ...state.groups.filter(item => item.id !== group.id)];
  state.groupsTotal = Math.max(state.groupsTotal, state.groups.length);
  state.identities = []; state.assignment = null; state.assignments = [];
  saveState();
}

async function afterResourcesAssigned({groupId, assignment, selectedId}) {
  if (!state.teacher || state.group?.id !== groupId) return;
  if (state.assignment?.id === selectedId) { state.assignment = assignment; saveState(); }
  await refreshDashboard();
}

async function afterGroupDeleted(groupId) {
  state.groups = state.groups.filter(group => group.id !== groupId);
  if (state.group?.id === groupId) {
    state.group = null; state.assignment = null;
    state.identities = []; state.assignments = [];

  }
  saveState();
  if (state.teacher) await refreshDashboard();
}

function bind(id, fn, outputId = "resultsOutput") {
  const node = $(id);
  if (!node) return;
  node.addEventListener("click", async () => {
    try {
      await fn();
    } catch (error) {
      const output = $(outputId);
      if (outputId === "teacherOutput" && assignmentsPanel) assignmentsPanel.report(error);
      else if (output) {
        setEmpty(output, t("common.errorLabel"));
      }
    }
  });
}

bind("teacherOidcLogin", teacherOidcLogin);
bind("teacherLogout", teacherLogout, "teacherOutput");
bind("teacherSummary", teacherSummary, "teacherOutput");
bind("refreshDashboard", refreshDashboard, "teacherOutput");

async function initializePortal() {
  if (has("itinerariesPanel")) {
    try {
      const {mountItineraries, mountGroups, mountMembers, mountCredentials, mountAssignments, mountResults, mountResources, mountAdminGroups, mountClassroomFiles} = await import('/assets/teacher-itineraries.js');
      const options = {api, onSessionExpired: () => setTeacherSession(false)};
      itinerariesPanel = mountItineraries($("itinerariesPanel"), options);
      groupsPanel = mountGroups($("groupsPanel"), {...options, onSelect: selectTeacherGroup, onDeleted: afterGroupDeleted});
      membersPanel = mountMembers($("membersPanel"), options);
      credentialsPanel = mountCredentials($("credentialsPanel"), {...options, onCreated: afterClassCreated, onRefresh: refreshDashboard});
      assignmentsPanel = mountAssignments($("assignmentsPanel"), {...options, onSelect: selectTeacherAssignment});
      resultsPanel = mountResults($("resultsPanel"), options);
      classroomFilesPanel = mountClassroomFiles($("classroomFilesPanel"),options);
      resourcesPanel = mountResources($("resourcesPanel"), {...options, onAssigned: afterResourcesAssigned});
      if (has("adminGroupsPanel")) adminGroupsPanel = mountAdminGroups($("adminGroupsPanel"), {...options, onDeleted: afterGroupDeleted});
    } catch {
      for (const id of ["itinerariesPanel", "groupsPanel", "membersPanel", "credentialsPanel", "credentialsDetails", "assignmentsPanel", "resultsPanel", "resourcesPanel", "classroomFilesPanel"]) {
        setEmpty($(id), t("teacher.panelUnavailable"));
        $(id).setAttribute("data-i18n", "teacher.panelUnavailable");
      }
    }
  }

  if (has("studentPanel")) {
    try {
      const {mountStudent} = await import('/assets/student-ui.js');
      studentPanel = mountStudent($("studentPanel"), {api, onSessionChanged: checkIdentityStatus});
    } catch {
      setEmpty($("studentPanel"), t("teacher.panelUnavailable"));
      $("studentPanel").setAttribute("data-i18n", "teacher.panelUnavailable");
    }
  }
  restoreState();
  setAuthentikLinks();
  setApplicationLinks();
  if (!has("studentPanel")) loadEnabledModules();
  loadBlocsLink();
  if (has("teacherOidcLogin")) {
    setTeacherSession(false);
  }
  checkIdentityStatus();
  checkOidc();
  checkFirstRunSetup();
  if (has("teacherOidcLogin")) {
    refreshTeacherSession();
  }
}

initializePortal();


window.addEventListener('edutictac:langchange', setApplicationLinks);
