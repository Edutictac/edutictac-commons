const EDUHOOT_APP = "eduhoot";
const PLAY_APP = "edutictac-play";
const STORAGE_KEY = "edutictac-commons-state";
function playBaseUrl() {
  const portMap = { "80": "8084", "8082": "8084", "18082": "18084" };
  const currentPort = window.location.port || (window.location.protocol === "http:" ? "80" : "443");
  const playPort = portMap[currentPort];
  return playPort
    ? `${window.location.protocol}//${window.location.hostname}:${playPort}`
    : window.location.origin;
}
const EDUHOOT_BASE_PROTOCOL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? window.location.protocol
  : "http:";
const EDUHOOT_BASE_URL = `${EDUHOOT_BASE_PROTOCOL}//${window.location.hostname}:8090`;
const STUDENT_ICONS = [
  "🦊", "🐱", "🐶", "🐼", "🐧", "🐸", "🦉", "🦄", "🐰", "🐢",
  "🐙", "🦁", "🐨", "🐝", "🐯", "🐻", "🦕", "🦖", "🐉", "🚀",
  "🌈", "⚽️", "🏀", "🏆", "🎮", "🎧", "📚", "🎨",
];

const state = {
  teacher: false,
  group: null,
  groups: [],
  identities: [],
  assignment: null,
  assignments: [],
  summary: null,
  dataReady: false,
  student: null,
  studentAssignments: [],
  studentItinerary: null,
  showStudentHistory: false,
  resources: [],
  basket: [],
  enabledModules: null,
};

const $ = (id) => document.getElementById(id);
const has = (id) => Boolean($(id));
const t = window.i18nPortal.t;
let itinerariesPanel = null, groupsPanel = null, membersPanel = null, credentialsPanel = null, assignmentsPanel = null, resultsPanel = null;
let teacherDataSequence = 0;

function syncTeacherPanels() {
  const context = {teacher: state.teacher, group: state.group, groups: state.groups,
    assignments: state.assignments, assignment: state.assignment, identities: state.identities, summary: state.summary, dataReady: state.dataReady};
  itinerariesPanel?.setContext(context);
  groupsPanel?.setContext(context);
  membersPanel?.setContext(context);
  credentialsPanel?.setContext(context);
  assignmentsPanel?.setContext(context);
  resultsPanel?.setContext(context);
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

function accessibleResourceUrl(rawUrl) {
  if (!rawUrl) return "";
  try {
    const url = new URL(rawUrl, window.location.origin);
    const localResourceHost = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    const remoteBrowser = !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    if (localResourceHost && remoteBrowser) {
      url.hostname = window.location.hostname;
      if (url.port === "8086" && window.location.port === "18082") url.port = "18086";
    }
    return url.toString();
  } catch {
    return "";
  }
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
    document.querySelectorAll("[data-module]").forEach((node) => {
      node.hidden = !state.enabledModules.has(node.dataset.module);
    });
    if (state.student && has("studentOutput")) {
      setOutput($("studentOutput"), `${studentProfileCard()}${studentDashboard(state.studentAssignments)}`);
    }
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

// Only these Commons pages may request a return after code/PIN access.
function returnAfterStudentLogin() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (!["/assets/", "/blocs-access.html", "/llibres-login.html?lang=es", "/llibres-login.html?lang=va"].includes(next)) return false;
  window.location.replace(next);
  return true;
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

function setOutput(node, content) {
  node.classList.remove("empty");
  node.removeAttribute("data-i18n");
  node.innerHTML = content;
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
  ["teacherSummary", "refreshDashboard", "teacherLogout", "assignFavoriteResources"].forEach((id) => {
    const node = $(id);
    if (node) {
      node.disabled = !active;
    }
  });
  syncTeacherPanels();
}

function setStudentSession(active) {
  const loginPanel = $("studentLoginPanel");
  const sessionActions = $("studentSessionActions");
  if (loginPanel) {
    loginPanel.classList.toggle("hidden", active);
  }
  if (sessionActions) {
    sessionActions.classList.toggle("hidden", !active);
  }
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function table(rows, columns) {
  if (!rows.length) {
    return `<p>${t("common.tableEmpty")}</p>`;
  }
  return `
    <table>
      <thead>
        <tr>${columns.map((col) => `<th>${escapeHtml(col.label)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                ${columns
                  .map((col) => `<td>${col.html ? row[col.key] || "" : escapeHtml(row[col.key] ?? "")}</td>`)
                  .join("")}
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function resourceActivityId(resource) {
  if (resource.provider === PLAY_APP && resource.external_id.startsWith(`${PLAY_APP}:`)) {
    return resource.external_id.slice(`${PLAY_APP}:`.length);
  }
  return resource.external_id;
}

function resourceAppId(resource) {
  if (resource.provider === PLAY_APP) return PLAY_APP;
  if (resource.provider === EDUHOOT_APP) return EDUHOOT_APP;
  return "resource";
}

function renderResources(data, { basket = false } = {}) {
  const output = $("resourcesOutput");
  if (!output) return;
  state.resources = data.items || [];
  if (!state.resources.length) {
    setEmpty(output, t("teacher.resourcesEmpty"));
    return;
  }
  const basketHint = basket ? `<p class="hint">${t("teacher.basketHint", { count: state.resources.length })}</p>` : "";
  setOutput(output, `${basketHint}<div class="cards">${state.resources.map((resource) => `
    <article class="card">
      <strong>${escapeHtml(resource.title || resource.external_id)}</strong>
      <small>${escapeHtml(resource.provider || resource.format || "recurs")} · ${escapeHtml(resource.subject || "")}</small>
      <button class="compact secondary" type="button" data-assign-resource="${escapeHtml(resource.external_id)}">${t("teacher.assignResource")}</button>
    </article>`).join("")}</div>`);
}

async function loadResources() {
  const output = $("resourcesOutput");
  if (!output) return;
  const query = new URLSearchParams({ limit: "24" });
  const search = $("resourceSearch")?.value.trim();
  if (search) query.set("q", search);
  output.textContent = t("teacher.resourcesLoading");
  try {
    state.basket = [];
    renderResources(await api(`/resources-api/resources?${query}`, { method: "GET" }));
  } catch (error) {
    setEmpty(output, t("teacher.resourcesUnavailable"));
  }
}

async function loadFavoriteResources() {
  const output = $("resourcesOutput");
  if (!output) return;
  output.textContent = t("teacher.resourcesLoading");
  try {
    const data = await api("/resources-api/teacher/favorites?limit=48", { method: "GET" });
    state.basket = data.items || [];
    renderResources(data, { basket: true });
  } catch (error) {
    setEmpty(output, t("teacher.favoritesUnavailable"));
  }
}

async function assignFavoriteResources() {
  if (!state.teacher) throw new Error(t("teacher.errors.loginFirst"));
  if (!state.group) throw new Error(t("teacher.errors.selectGroupFirst"));
  if (!state.basket.length) throw new Error(t("teacher.errors.emptyBasket"));
  const output = $("resourcesOutput");
  if (output) output.textContent = t("teacher.assigningBasket");
  let lastAssignment = null;
  for (const resource of state.basket) {
    const result = await api("/api/teacher/activity-assignments", {
      method: "POST",
      body: JSON.stringify({
        group_id: state.group.id,
        app_id: resourceAppId(resource),
        activity_id: resourceActivityId(resource),
        title: resource.title || resource.external_id,
        launch_url: accessibleResourceUrl(resource.play_url || resource.source_url || resource.reuse_url || resource.download_url || ""),
      }),
    });
    lastAssignment = result.assignment;
  }
  state.assignment = lastAssignment;
  await loadTeacherData();
  setOutput(output, `<p>${t("teacher.basketAssigned", { count: state.basket.length })}</p>`);
}

async function assignResource(resource) {
  if (!state.group) throw new Error("Selecciona primer un grup.");
  const assignment = await api("/api/teacher/activity-assignments", {
    method: "POST",
      body: JSON.stringify({
        group_id: state.group.id,
        app_id: resourceAppId(resource),
        activity_id: resourceActivityId(resource),
        title: resource.title || resource.external_id,
        launch_url: accessibleResourceUrl(resource.play_url || resource.source_url || resource.reuse_url || resource.download_url || ""),
      }),
  });
  state.assignment = assignment.assignment;
  await loadTeacherData();
  setOutput($("resourcesOutput"), `<p>Recurs assignat: <strong>${escapeHtml(assignment.assignment.title)}</strong>.</p>`);
}

function studentDashboard(assignments) {
  const completed = assignments.filter((assignment) => assignment.completed).length;
  const total = assignments.length;
  const visibleAssignments = state.showStudentHistory ? assignments : assignments.filter((assignment) => !assignment.completed);
  const rows = visibleAssignments.map((assignment) => ({
    ...assignment,
    title: assignment.title || assignment.activity_id,
    status: assignment.completed ? t("student.done") : assignment.started ? t("student.inProgress") : t("student.pending"),
    best_score: assignment.best_score ?? "",
    last_score_at: assignment.last_score_at || "",
    action:
      state.enabledModules && !state.enabledModules.has({ eduhoot: "eduhoot", resource: "recursos", play: "play", "edutictac-play": "play" }[assignment.app_id] || assignment.app_id)
        && [EDUHOOT_APP, "resource", "play", PLAY_APP].includes(assignment.app_id)
        ? `<small>${t("student.moduleDisabled")}</small>`
        : assignment.app_id === EDUHOOT_APP
        ? `<button class="compact secondary" type="button" data-launch-eduhoot-assignment="${escapeHtml(assignment.id)}">${t("student.openEduhoot")}</button>`
        : [PLAY_APP, "play"].includes(String(assignment.app_id || "").toLowerCase())
          ? `<button class="compact secondary" type="button" data-launch-play-assignment="${escapeHtml(assignment.id)}">${t("student.openPlay")}</button>`
          : assignment.app_id === "resource"
            ? String(assignment.activity_id || "").startsWith("teacher-upload:")
              ? `<button class="compact secondary" type="button" data-launch-document-assignment="${escapeHtml(assignment.id)}">${t("student.openResource")}</button>`
              : `<button class="compact secondary" type="button" data-launch-resource-assignment="${escapeHtml(assignment.id)}">${t("student.openResource")}</button>`
        : "",
  }));
  return `
    ${state.studentItinerary ? `<h3 data-student-itinerary>${escapeHtml(t("student.itineraryTitle", { title: state.studentItinerary.title }))}</h3>` : ""}
    <p>${t("student.progressLabel")} <strong>${completed}/${total}</strong> ${t("student.progressCompleted")}</p>
    ${completed ? `<button class="compact secondary history-toggle" type="button" data-toggle-student-history="true">${state.showStudentHistory ? t("student.hideHistory") : t("student.showHistory")}</button>` : ""}
    ${rows.length ? table(rows, [
      { key: "title", label: t("common.activity") },
      { key: "status", label: t("common.status") },
      { key: "best_score", label: t("common.bestScore") },
      { key: "last_score_at", label: t("common.lastScoreAt") },
      { key: "action", label: "", html: true },
    ]) : `<p class="empty">${t("student.noPending")}</p>`}
  `;
}

function studentProfileCard(message = "") {
  const selected = state.student && state.student.avatar_icon ? state.student.avatar_icon : "";
  return `
    <section class="student-profile" aria-label="${t("student.profileAria")}">
      <div class="student-profile__summary">
        <span class="student-profile__icon" aria-hidden="true">${escapeHtml(selected || "🙂")}</span>
        <div>
          <p>${t("student.hello")} <strong>${escapeHtml(state.student.public_code)}</strong>.</p>
          <p class="muted">${t("student.iconHint")}</p>
        </div>
      </div>
      <div class="student-icon-picker" role="group" aria-label="${t("student.iconPickerAria")}">
        ${STUDENT_ICONS.map((icon) => `
          <button
            class="student-icon${icon === selected ? " selected" : ""}"
            type="button"
            data-student-icon="${escapeHtml(icon)}"
            aria-pressed="${icon === selected ? "true" : "false"}"
            title="${t("student.chooseIcon")} ${escapeHtml(icon)}"
          >${escapeHtml(icon)}</button>
        `).join("")}
      </div>
      ${message ? `<p class="profile-status">${escapeHtml(message)}</p>` : ""}
    </section>
  `;
}

async function checkIdentityStatus() {
  const statusNode = $("apiStatus");
  if (!statusNode) return;
  const sessionMenu = $("sessionMenu");
  statusNode.textContent = t("common.session.checking");
  if (sessionMenu) sessionMenu.dataset.authenticated = "false";
  statusNode.classList.remove("error");
  try {
    const data = await api("/api/auth/me", { method: "GET" });
    const identity = data.identity || {};
    const name = identity.username || identity.public_code || identity.id || "—";
    statusNode.textContent = t("common.session.user", { name });
    if (sessionMenu) sessionMenu.dataset.authenticated = "true";
    statusNode.title = t("common.session.logoutHint");
  } catch (error) {
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

async function afterGroupDeleted(groupId) {
  state.groups = state.groups.filter(group => group.id !== groupId);
  if (state.group?.id === groupId) {
    state.group = null; state.assignment = null;
    state.identities = []; state.assignments = [];

  }
  saveState();
  if (state.teacher) await refreshDashboard();
}

async function studentLogin() {
  const publicCode = $("studentCode").value.trim().toUpperCase();
  const pin = $("studentPin").value.trim();
  const login = await api("/api/auth/student", {
    method: "POST",
    body: JSON.stringify({ public_code: publicCode, pin }),
  });
  state.student = login.identity;
  if (returnAfterStudentLogin()) return;
  setStudentSession(true);
  await checkIdentityStatus();
  await loadStudentDashboard();
}

async function studentLogout() {
  await api("/api/auth/logout", { method: "POST" });
  state.student = null;
  state.studentAssignments = [];
  state.studentItinerary = null;
  setStudentSession(false);
  await checkIdentityStatus();
  setOutput(
    $("studentOutput"),
    `<p>${t("student.logoutMessage")}</p>`,
  );
}

async function refreshStudentSession() {
  if (!has("studentOutput")) return;
  try {
    const data = await api("/api/auth/me", { method: "GET" });
    state.student = data.identity;
    if (state.student && state.student.group_id && returnAfterStudentLogin()) return;
    setStudentSession(true);
    await checkIdentityStatus();
    await loadStudentDashboard();
  } catch (error) {
    state.student = null;
    setStudentSession(false);
    await checkIdentityStatus();
    setOutput(
      $("studentOutput"),
      `<p>${t("student.loginPrompt")}</p>`,
    );
  }
}

async function loadStudentDashboard(message = "") {
  if (!state.student) {
    throw new Error(t("student.errors.loginFirst"));
  }
  const data = await api("/api/student/dashboard", { method: "GET" });
  state.student = data.identity;
  state.studentAssignments = data.assignments || [];
  state.studentItinerary = data.selected_itinerary || null;
  setOutput(
    $("studentOutput"),
    `
      ${studentProfileCard(message)}
      ${studentDashboard(state.studentAssignments)}
    `,
  );
}

async function updateStudentIcon(icon) {
  if (!state.student) {
    throw new Error(t("student.errors.loginFirst"));
  }
  const data = await api("/api/student/profile", {
    method: "PATCH",
    body: JSON.stringify({ avatar_icon: icon }),
  });
  state.student = data.identity;
  await loadStudentDashboard(t("student.iconSaved"));
}

async function launchEduhootAssignment(assignment) {
  if (!state.student) {
    throw new Error(t("student.errors.loginFirst"));
  }
  const launch = await api("/api/student/launch-token", {
    method: "POST",
    body: JSON.stringify({ assignment_id: assignment.id }),
  });
  const url = new URL("/solo/", EDUHOOT_BASE_URL);
  url.searchParams.set("id", assignment.activity_id);
  url.searchParams.set("commonsLaunchToken", launch.token);
  if (window.i18nPortal && typeof window.i18nPortal.getLang === "function") {
    url.searchParams.set("lang", window.i18nPortal.getLang());
  }
  window.location.href = url.toString();
}

async function launchPlayAssignment(assignment) {
  if (!state.student) {
    throw new Error(t("student.errors.loginFirst"));
  }
  const launch = await api("/api/student/launch-token", {
    method: "POST",
    body: JSON.stringify({ assignment_id: assignment.id }),
  });
  const playUrl = new URL(playBaseUrl());
  const activityId = encodeURIComponent(assignment.activity_id);
  // The standalone Play service serves activities at /<id>. The /play/<id>
  // prefix is only used when Commons is reached through its reverse proxy.
  const directPlay = playUrl.port === "8084" || playUrl.port === "18084";
  const path = directPlay ? `/${activityId}` : `/play/${activityId}`;
  const url = new URL(path, playUrl);
  url.searchParams.set("launch_token", launch.token);
  window.location.href = url.toString();
}

async function launchResourceAssignment(assignment) {
  try {
    await api("/api/student/launch-token", {
      method: "POST",
      body: JSON.stringify({ assignment_id: assignment.id }),
    });
  } catch (error) {
    console.warn("No s'ha pogut registrar l'inici de l'activitat", error);
  }
  let url = accessibleResourceUrl(assignment.launch_url);
  if (!url) {
    const query = new URLSearchParams({ q: assignment.activity_id, limit: "50" });
    const data = await api(`/resources-api/resources?${query}`, { method: "GET" });
    const resource = (data.items || []).find((item) => item.external_id === assignment.activity_id);
    url = accessibleResourceUrl(resource?.play_url || resource?.source_url || resource?.reuse_url || resource?.download_url);
  }
  if (!url) throw new Error("No se ha encontrado la URL de este recurso.");
  window.open(url, "_blank", "noopener,noreferrer");
}

async function launchDocumentAssignment(assignment) {
  if (!state.student) throw new Error(t("student.errors.loginFirst"));
  const launch = await api("/api/student/launch-token", {
    method: "POST",
    body: JSON.stringify({ assignment_id: assignment.id }),
  });
  const url = new URL(`/api/student/activity-assignments/${encodeURIComponent(assignment.id)}/resource`, window.location.origin);
  url.searchParams.set("launch_token", launch.token);
  window.open(url.toString(), "_blank", "noopener,noreferrer");
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
        setOutput(output, `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    }
  });
}

document.addEventListener("click", (event) => {
  const iconButton = event.target.closest("[data-student-icon]");
  if (iconButton) {
    updateStudentIcon(iconButton.dataset.studentIcon).catch((error) => {
      setOutput($("studentOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>${studentProfileCard()}${studentDashboard(state.studentAssignments)}`);
    });
  }

  const historyButton = event.target.closest("[data-toggle-student-history]");
  if (historyButton) {
    state.showStudentHistory = !state.showStudentHistory;
    setOutput($('studentOutput'), `${studentProfileCard()}${studentDashboard(state.studentAssignments)}`);
    return;
  }

  const eduhootLaunchButton = event.target.closest("[data-launch-eduhoot-assignment]");
  if (eduhootLaunchButton) {
    const assignment = state.studentAssignments.find((item) => item.id === eduhootLaunchButton.dataset.launchEduhootAssignment);
    if (!assignment) return;
    launchEduhootAssignment(assignment).catch((error) => {
      setOutput($("studentOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>${studentDashboard(state.studentAssignments)}`);
    });
  }

  const playLaunchButton = event.target.closest("[data-launch-play-assignment]");
  if (playLaunchButton) {
    const assignment = state.studentAssignments.find((item) => item.id === playLaunchButton.dataset.launchPlayAssignment);
    if (!assignment) return;
    launchPlayAssignment(assignment).catch((error) => {
      setOutput($("studentOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>${studentDashboard(state.studentAssignments)}`);
    });
  }

  const resourceLaunchButton = event.target.closest("[data-launch-resource-assignment]");
  if (resourceLaunchButton) {
    const assignment = state.studentAssignments.find((item) => item.id === resourceLaunchButton.dataset.launchResourceAssignment);
    if (!assignment) return;
    launchResourceAssignment(assignment).catch((error) => {
      setOutput($("studentOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>${studentDashboard(state.studentAssignments)}`);
    });
    return;
  }

  const documentLaunchButton = event.target.closest("[data-launch-document-assignment]");
  if (documentLaunchButton) {
    const assignment = state.studentAssignments.find((item) => item.id === documentLaunchButton.dataset.launchDocumentAssignment);
    if (!assignment) return;
    launchDocumentAssignment(assignment).catch((error) => {
      setOutput($("studentOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>${studentDashboard(state.studentAssignments)}`);
    });
    return;
  }

  const resourceButton = event.target.closest("[data-assign-resource]");
  if (resourceButton) {
    const resource = state.resources.find((item) => item.external_id === resourceButton.dataset.assignResource);
    if (!resource) return;
    assignResource(resource).catch((error) => {
      if (has("resourcesOutput")) {
        setOutput($("resourcesOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    });
  }
});

bind("teacherOidcLogin", teacherOidcLogin);
bind("logoutSessionButton", logoutSession);
bind("teacherLogout", teacherLogout, "teacherOutput");
bind("teacherSummary", teacherSummary, "teacherOutput");
bind("refreshDashboard", refreshDashboard, "teacherOutput");
bind("assignFavoriteResources", assignFavoriteResources, "resourcesOutput");
bind("studentLogin", studentLogin, "studentOutput");
bind("studentLogout", studentLogout, "studentOutput");

if (has("searchResources")) {
  $("searchResources").addEventListener("click", () => {
    loadResources();
  });
}
if (has("loadFavoriteResources")) {
  $("loadFavoriteResources").addEventListener("click", () => {
    loadFavoriteResources();
  });
}
if (has("resourceSearch")) {
  $("resourceSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loadResources();
    }
  });
}

window.addEventListener("edutictac:langchange", () => {
  if (!has("studentOutput")) {
    return;
  }
  if (state.student) {
    loadStudentDashboard().catch((error) => {
      setOutput($("studentOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
    });
  } else {
    setEmpty($("studentOutput"), t("student.loginPrompt"));
  }
});

async function initializePortal() {
  if (has("itinerariesPanel")) {
    try {
      const {mountItineraries, mountGroups, mountMembers, mountCredentials, mountAssignments, mountResults} = await import('/assets/teacher-itineraries.js');
      const options = {api, onSessionExpired: () => setTeacherSession(false)};
      itinerariesPanel = mountItineraries($("itinerariesPanel"), options);
      groupsPanel = mountGroups($("groupsPanel"), {...options, onSelect: selectTeacherGroup, onDeleted: afterGroupDeleted});
      membersPanel = mountMembers($("membersPanel"), options);
      credentialsPanel = mountCredentials($("credentialsPanel"), {...options, onCreated: afterClassCreated, onRefresh: refreshDashboard});
      assignmentsPanel = mountAssignments($("assignmentsPanel"), {...options, onSelect: selectTeacherAssignment});
      resultsPanel = mountResults($("resultsPanel"), options);
    } catch {
      for (const id of ["itinerariesPanel", "groupsPanel", "membersPanel", "credentialsPanel", "credentialsDetails", "assignmentsPanel", "resultsPanel"]) {
        setEmpty($(id), t("teacher.panelUnavailable"));
        $(id).setAttribute("data-i18n", "teacher.panelUnavailable");
      }
    }
  }

  restoreState();
  setAuthentikLinks();
  setApplicationLinks();
  loadEnabledModules();
  loadBlocsLink();
  if (has("teacherOidcLogin")) {
    setTeacherSession(false);
  }
  refreshStudentSession().catch(() => {});
  checkIdentityStatus();
  checkOidc();
  checkFirstRunSetup();
  if (has("teacherOidcLogin")) {
    refreshTeacherSession();
  }
}

initializePortal();
