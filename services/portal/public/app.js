const STORAGE_KEY = "edutictac-commons-state";

const state = {
  teacher: false,
  group: null,
  groups: [],
  identities: [],
  assignment: null,
  assignments: [],
  summary: null,
  dataReady: false,
  enabledModules: null,
};

const $ = (id) => document.getElementById(id);
const has = (id) => Boolean($(id));
const t = window.i18nPortal.t;
let itinerariesPanel = null, groupsPanel = null, membersPanel = null, credentialsPanel = null, assignmentsPanel = null, resultsPanel = null, resourcesPanel = null;
let teacherDataSequence = 0, identityStatusSequence = 0;
let studentPanel = null;

function syncTeacherPanels() {
  const context = {teacher: state.teacher, group: state.group, groups: state.groups,
    assignments: state.assignments, assignment: state.assignment, identities: state.identities, summary: state.summary, dataReady: state.dataReady, resourcesEnabled: !state.enabledModules || state.enabledModules.has("recursos")};
  itinerariesPanel?.setContext(context);
  groupsPanel?.setContext(context);
  membersPanel?.setContext(context);
  credentialsPanel?.setContext(context);
  assignmentsPanel?.setContext(context);
  resultsPanel?.setContext(context);
  resourcesPanel?.setContext(context);
}

async function selectTeacherGroup(id) {
  const group = state.groups.find(item => item.id === id);
  if (!group || !state.teacher) return;
  state.group = {id: group.id, group_code: group.name, tenant_id: group.tenant_id};
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
  if (group) state.group = {id: group.id, group_code: group.name, tenant_id: group.tenant_id};
  saveState();
  if (has("itinerariesOutput")) await loadItineraries();
}

async function loadItineraries() {
  syncTeacherPanels();
  await itinerariesPanel?.load();
}

function setAuthentikLinks() {
  const url = `${window.location.protocol}//${window.location.hostname}:9000/`;
  ["authentikHomeLink", "authentikNavLink", "oidcSetupLink", "firstRunSetupLink"].forEach((id) => {
    const link = $(id);
    if (link) link.href = url;
  });
  const changePasswordLink = $("changePasswordLink");
  if (changePasswordLink) {
    changePasswordLink.href = `${url}if/flow/default-password-change/?next=%2Fif%2Fuser%2F%23%2Fsettings%3B%7B%22page%22%3A%22page-details%22%7D`;
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
  Object.entries(links).forEach(([id, url]) => {
    const link = $(id);
    if (link) link.href = url;
  });
  const teacherResourcesLink = $("teacherResourcesLink");
  if (teacherResourcesLink) teacherResourcesLink.href = links.resourcesHomeLink;
}

async function loadEnabledModules() {
  try {
    const data = await api("/api/modules/status", { method: "GET" });
    if (!Array.isArray(data.enabled)) return;
    state.enabledModules = new Set(data.enabled);
    syncTeacherPanels();
    document.querySelectorAll("[data-module]").forEach((node) => {
      node.hidden = !state.enabledModules.has(node.dataset.module);
    });
  } catch {
    // Older API images and source-only development retain the existing links.
  }
}

async function loadBlocsLink() {
  if (!has("blocsHomeLink")) return;
  try {
    const data = await api("/blocs/status", { method: "GET" });
    $("blocsHomeLink").hidden = data.enabled !== true;
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

async function checkIdentityStatus() {
  const sequence = ++identityStatusSequence;
  const statusNode = $("apiStatus");
  if (!statusNode) return;
  const sessionMenu = $("sessionMenu");
  statusNode.textContent = t("common.session.checking");
  if (sessionMenu) sessionMenu.dataset.authenticated = "false";
  statusNode.classList.remove("error");
  try {
    const data = await api("/api/auth/me", { method: "GET" });
    if (sequence !== identityStatusSequence) return;
    const identity = data.identity || {};
    const name = identity.username || identity.public_code || identity.id || "—";
    statusNode.textContent = t("common.session.user", { name });
    if (sessionMenu) sessionMenu.dataset.authenticated = "true";
    statusNode.title = t("common.session.logoutHint");
  } catch (error) {
    if (sequence !== identityStatusSequence) return;
    statusNode.textContent = error.status === 401
      ? t("common.session.signedOut")
      : t("common.session.unavailable");
    statusNode.classList.toggle("error", error.status !== 401);
    statusNode.title = "";
  }
}

async function logoutSession() {
  const statusNode = $("apiStatus");
  const sessionMenu = $("sessionMenu");
  if (!statusNode || !sessionMenu || sessionMenu.dataset.authenticated !== "true") return;
  if (!window.confirm(t("common.session.logoutConfirm"))) return;
  if (studentPanel) { await studentPanel.logout(); return; }
  await Promise.allSettled([
    api("/api/auth/oidc/logout", { method: "POST" }),
    api("/api/teacher/logout", { method: "POST" }),
    api("/api/auth/logout", { method: "POST" }),
  ]);
  window.location.reload();
}

async function checkOidc() {
  const button = $("teacherOidcLogin");
  if (!button) return;
  try {
    const setup = await api("/api/setup/status", { method: "GET" });
    if (setup.pending) {
      button.disabled = true;
      return;
    }
    const status = await api("/api/auth/oidc/status", { method: "GET" });
    button.disabled = !status.enabled;
    button.title = status.enabled ? status.issuer : "OIDC no configurado en este entorno";
    if (!status.enabled) showOidcSetupNotice();
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
  state.assignments = assignmentData.assignments || [];
  state.identities = identityData.identities || [];
  if (state.group) {
    const freshGroup = state.groups.find((group) => group.id === state.group.id);
    if (freshGroup) {
      state.group = { id: freshGroup.id, group_code: freshGroup.name, tenant_id: freshGroup.tenant_id };
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
  state.groups = [{id: group.id, name: group.group_code, tenant_id: group.tenant_id, active: count},
    ...state.groups.filter(item => item.id !== group.id)];
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
bind("logoutSessionButton", logoutSession);
bind("teacherLogout", teacherLogout, "teacherOutput");
bind("teacherSummary", teacherSummary, "teacherOutput");
bind("refreshDashboard", refreshDashboard, "teacherOutput");

async function initializePortal() {
  if (has("itinerariesPanel")) {
    try {
      const {mountItineraries, mountGroups, mountMembers, mountCredentials, mountAssignments, mountResults, mountResources} = await import('/assets/teacher-itineraries.js');
      const options = {api, onSessionExpired: () => setTeacherSession(false)};
      itinerariesPanel = mountItineraries($("itinerariesPanel"), options);
      groupsPanel = mountGroups($("groupsPanel"), {...options, onSelect: selectTeacherGroup, onDeleted: afterGroupDeleted});
      membersPanel = mountMembers($("membersPanel"), options);
      credentialsPanel = mountCredentials($("credentialsPanel"), {...options, onCreated: afterClassCreated, onRefresh: refreshDashboard});
      assignmentsPanel = mountAssignments($("assignmentsPanel"), {...options, onSelect: selectTeacherAssignment});
      resultsPanel = mountResults($("resultsPanel"), options);
      resourcesPanel = mountResources($("resourcesPanel"), {...options, onAssigned: afterResourcesAssigned});
    } catch {
      for (const id of ["itinerariesPanel", "groupsPanel", "membersPanel", "credentialsPanel", "credentialsDetails", "assignmentsPanel", "resultsPanel", "resourcesPanel"]) {
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
