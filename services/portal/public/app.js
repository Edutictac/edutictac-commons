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
  itineraries: [],
  itinerariesGroupId: null,
  itinerariesReady: false,
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

// Guarda temporalment (només en memòria del navegador) els lots d'identitats
// acabats de generar, mentre el PIN encara és en clar, perquè es puguen
// imprimir o exportar. El backend mai torna a exposar el PIN després
// d'aquest moment (vore `services/id-api/main.py`, comentari a
// `export_codes_csv`), així que aquestes dades no es persisteixen enlloc.
const pendingBatches = new Map();

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
  state.teacher = active;
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
  ["teacherSummary", "refreshDashboard", "createBatch", "teacherLogout", "addGroupMember", "loadGroupMembers", "createItinerary", "loadItineraries", "addGroupIdentities", "deleteGroup", "assignFavoriteResources"].forEach((id) => {
    const node = $(id);
    if (node) {
      node.disabled = !active;
    }
  });
  updateItineraryControls();
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

function credentialCards(identities) {
  return `
    <div class="cards">
      ${identities
        .map(
          (item) => `
            <button class="credential" type="button" data-code="${escapeHtml(item.public_code)}" data-pin="${escapeHtml(item.pin)}">
              <strong>${escapeHtml(item.public_code)}</strong>
              <span>PIN ${escapeHtml(item.pin)}</span>
              <small>${t("common.useAsStudent")}</small>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function batchActions(identities, groupCode) {
  if (!identities.length) return "";
  const batchId = `batch-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  pendingBatches.set(batchId, { identities, groupCode });
  return `
    <div class="export-actions" aria-label="${t("teacher.exports")}">
      <button type="button" class="secondary" data-print-batch="${batchId}">${t("teacher.printBatch")}</button>
      <button type="button" class="secondary" data-download-batch-csv="${batchId}">${t("teacher.downloadBatchCsv")}</button>
    </div>
  `;
}

function printBatchCards(identities, groupCode) {
  const win = window.open("", "_blank");
  if (!win) return;
  const cards = identities
    .map(
      (item) => `
        <article>
          <h2>EduTicTac</h2>
          <p>Codi</p>
          <strong>${escapeHtml(item.public_code)}</strong>
          <p>PIN</p>
          <em>${escapeHtml(item.pin)}</em>
          <small>${t("common.useAsStudent")}</small>
        </article>
      `,
    )
    .join("");
  win.document.write(`<!doctype html>
<html lang="ca">
<meta charset="utf-8">
<title>Targetes EduTicTac ${escapeHtml(groupCode || "")}</title>
<style>
body{font-family:Arial,sans-serif;margin:16px;color:#111}
main{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
article{border:1px dashed #555;padding:10px;min-height:130px;break-inside:avoid}
h2{font-size:18px;margin:0 0 8px}p{margin:6px 0 2px}strong{font-size:28px}em{display:block;font-style:normal;font-size:22px;color:#555}small{display:block;margin-top:10px}
@media print{body{margin:8mm}}
</style>
<main>${cards}</main>
</html>`);
  win.document.close();
  win.focus();
  win.addEventListener("load", () => win.print());
}

function downloadBatchCsv(identities, groupCode) {
  const rows = [["codi", "pin"], ...identities.map((item) => [item.public_code, item.pin])];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `edutictac-${groupCode || "grup"}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function groupLinks(group) {
  const statsHref = group
    ? `/api/teacher/stats.csv?group_id=${encodeURIComponent(group.id)}`
    : "/api/teacher/stats.csv";
  return `
    <div class="export-actions" aria-label="${t("teacher.exports")}">
      ${
        group
          ? `
            <a class="button-link" href="/api/groups/${encodeURIComponent(group.id)}/cards" target="_blank" rel="noopener">${t("teacher.cards")}</a>
            <a class="button-link secondary" href="/api/groups/${encodeURIComponent(group.id)}/csv" target="_blank" rel="noopener">${t("teacher.csvCodes")}</a>
          `
          : ""
      }
      <a class="button-link secondary" href="${statsHref}" target="_blank" rel="noopener">${t("teacher.csvStats")}</a>
    </div>
  `;
}

function selectedTeacherContext() {
  const groupText = state.group
    ? `${t("teacher.groupSelected")} <strong>${escapeHtml(state.group.group_code || state.group.name)}</strong>`
    : t("teacher.noGroupSelected");
  const assignmentText = state.assignment
    ? `${t("teacher.activitySelected")} <strong>${escapeHtml(state.assignment.title || state.assignment.activity_id)}</strong>`
    : t("teacher.noActivitySelected");
  return `
    <div class="teacher-context">
      <p>${groupText}</p>
      <p>${assignmentText}</p>
      ${groupLinks(state.group)}
    </div>
  `;
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

function teacherDashboard(summary, assignments) {
  const groups = summary.groups || [];
  const groupNames = new Map(groups.map((group) => [group.id, group.name]));
  const selectedIdentities = state.group
    ? state.identities.filter((identity) => identity.group_id === state.group.id)
    : state.identities;
  return `
    <p><strong>${escapeHtml(summary.active)}</strong> ${t("teacher.activeOfTotal", { total: escapeHtml(summary.total) })}</p>
    ${selectedTeacherContext()}
    <h3>${t("teacher.groups")}</h3>
    ${table(
      groups.map((group) => ({
        ...group,
        action: `<button class="compact secondary" type="button" data-select-group="${escapeHtml(group.id)}">${t("common.select")}</button>`,
      })),
      [
        { key: "name", label: t("teacher.groupOpaque") },
        { key: "tenant_id", label: t("teacher.tenant") },
        { key: "active", label: t("teacher.active") },
        { key: "action", label: "", html: true },
      ],
    )}
    <h3>${state.group ? t("teacher.activeCredentials") : t("teacher.recentCredentials")}</h3>
    ${table(
      selectedIdentities.map((identity) => ({
        ...identity,
        group_name: groupNames.get(identity.group_id) || identity.group_name || identity.group_id,
        pin_rotated_at: identity.pin_rotated_at || "",
        action: `
          <div class="inline-actions">
            <button class="compact secondary" type="button" data-regenerate-pin="${escapeHtml(identity.id)}">${t("teacher.regeneratePin")}</button>
            <button class="compact danger" type="button" data-revoke-identity="${escapeHtml(identity.id)}">${t("teacher.revoke")}</button>
          </div>
        `,
      })),
      [
        { key: "public_code", label: t("common.code") },
        { key: "group_name", label: t("common.group") },
        { key: "pin_rotated_at", label: t("teacher.pinUpdated") },
        { key: "action", label: "", html: true },
      ],
    )}
    <h3>${t("teacher.assignments")}</h3>
    ${table(
      assignments.map((assignment) => ({
        ...assignment,
        group_name: groupNames.get(assignment.group_id) || assignment.group_id,
        action: `<button class="compact secondary" type="button" data-select-assignment="${escapeHtml(assignment.id)}">${t("common.select")}</button>`,
      })),
      [
        { key: "title", label: t("common.title") },
        { key: "group_name", label: t("common.group") },
        { key: "activity_id", label: t("common.activity") },
        { key: "action", label: "", html: true },
      ],
    )}
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

function renderItineraries(data) {
  const output = $("itinerariesOutput");
  if (!output) return;
  state.itineraries = data.itineraries || [];
  if (!state.itineraries.length) {
    setEmpty(output, t("teacher.itinerariesEmptyList"));
    updateItineraryControls();
    return;
  }
  const selected = state.itineraries.find((itinerary) => itinerary.is_selected);
  setOutput(output, `<p class="hint">${t("teacher.itinerary.selectionHint")}</p>
    ${selected ? `<button class="compact secondary" type="button" data-clear-group-itinerary>${t("teacher.itinerary.clearSelection")}</button>` : `<p>${t("teacher.itinerary.noSelection")}</p>`}
    <div class="cards">${state.itineraries.map((itinerary) => `
    <article class="card">
      <strong>${escapeHtml(itinerary.title)}</strong>
      ${itinerary.is_selected
        ? `<small role="status">${t("teacher.itinerary.selected")}</small>`
        : `<button class="compact secondary" type="button" data-select-group-itinerary="${escapeHtml(itinerary.id)}"
            aria-label="${escapeHtml(t("teacher.itinerary.selectLabel", { title: itinerary.title }))}">${t("teacher.itinerary.select")}</button>`}
      <small>${t("teacher.itinerarySteps", { count: itinerary.items.length })}</small>
      <ol>${itinerary.items.map((item, index) => {
        const title = state.assignments.find((a) => a.id === item.assignment_id)?.title || item.assignment_id;
        return `<li>
          <span>${escapeHtml(title)}</span>
          <div class="actions">
            ${["up", "down", "remove"].map((action) => `<button class="compact secondary" type="button"
              data-edit-itinerary="${escapeHtml(itinerary.id)}" data-itinerary-assignment="${escapeHtml(item.assignment_id)}" data-itinerary-action="${action}"
              aria-label="${escapeHtml(t(`teacher.itinerary.${action}Label`, { title }))}"
              ${(action === "up" && index === 0) || (action === "down" && index === itinerary.items.length - 1) ? "disabled" : ""}
            >${t(`teacher.itinerary.${action}`)}</button>`).join("")}
          </div>
        </li>`;
      }).join("")}</ol>
      <small>${t("teacher.itinerary.removeHint")}</small>
      ${state.assignment ? `<button class="compact secondary" type="button" data-add-itinerary-item="${escapeHtml(itinerary.id)}">${t("teacher.addSelectedActivity")}</button>` : `<small>${t("teacher.selectAssignmentHint")}</small>`}
    </article>`).join("")}</div>`);
  updateItineraryControls();
}

let itineraryLoadSequence = 0;

async function loadItineraries() {
  if (!state.teacher) throw new Error(t("teacher.errors.loginFirst"));
  if (!state.group) throw new Error(t("teacher.errors.selectGroupFirst"));
  const groupId = state.group.id;
  const sequence = ++itineraryLoadSequence;
  state.itinerariesReady = false;
  if (state.itinerariesGroupId !== groupId) {
    state.itineraries = [];
    $("itinerariesOutput").textContent = t("teacher.itinerary.loading");
  }
  updateItineraryControls();
  let data;
  try {
    data = await api(`/api/teacher/itineraries?group_id=${encodeURIComponent(groupId)}`, { method: "GET" });
  } catch (error) {
    if (!state.teacher || state.group?.id !== groupId || sequence !== itineraryLoadSequence) return;
    throw error;
  }
  if (!state.teacher || state.group?.id !== groupId || sequence !== itineraryLoadSequence) return;
  state.itinerariesGroupId = groupId;
  state.itinerariesReady = true;
  renderItineraries(data);
}

async function createItinerary() {
  if (!state.teacher) throw new Error(t("teacher.errors.loginFirst"));
  if (!state.group) throw new Error(t("teacher.errors.selectGroupFirst"));
  const title = $("itineraryTitle").value.trim();
  if (!title) throw new Error(t("teacher.errors.enterItineraryTitle"));
  await saveItineraryChange("/api/teacher/itineraries", {
    method: "POST",
    body: JSON.stringify({ title, group_id: state.group.id }),
  });
}

async function addSelectedActivityToItinerary(itineraryId) {
  if (!state.assignment) throw new Error(t("teacher.errors.selectActivityFirst"));
  const itinerary = state.itineraries.find((item) => item.id === itineraryId);
  if (!itinerary) return;
  if (itinerary?.items.some((item) => item.assignment_id === state.assignment.id)) return;
  const previous = itinerary.items.map((item) => item.assignment_id);
  await saveItineraryChange(`/api/teacher/itineraries/${encodeURIComponent(itineraryId)}/items`, {
    method: "PUT",
    body: JSON.stringify({ assignment_ids: [...previous, state.assignment.id], expected_assignment_ids: previous }),
  });
}

let itineraryEditPending = false;

function updateItineraryControls() {
  const unavailable = itineraryEditPending || !state.itinerariesReady || state.itinerariesGroupId !== state.group?.id;
  if (unavailable) $("itinerariesOutput")?.querySelectorAll("button").forEach((node) => { node.disabled = true; });
  if (has("createItinerary")) $("createItinerary").disabled = !state.teacher || !state.group || unavailable;
  if (has("loadItineraries")) $("loadItineraries").disabled = !state.teacher || !state.group || itineraryEditPending;
}

async function editItineraryItem(button) {
  if (itineraryEditPending) return;
  const itinerary = state.itineraries.find((item) => item.id === button.dataset.editItinerary);
  if (!itinerary) return;
  const previous = itinerary.items.map((item) => item.assignment_id);
  const ids = [...previous];
  const index = ids.indexOf(button.dataset.itineraryAssignment);
  if (index < 0) return;
  const action = button.dataset.itineraryAction;
  if (action === "remove") ids.splice(index, 1);
  else {
    const target = index + (action === "up" ? -1 : 1);
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
  }
  await saveItineraryChange(`/api/teacher/itineraries/${encodeURIComponent(itinerary.id)}/items`, {
    method: "PUT",
    body: JSON.stringify({ assignment_ids: ids, expected_assignment_ids: previous }),
  });
}

async function selectGroupItinerary(itineraryId) {
  if (!state.teacher || !state.group || itineraryEditPending) return;
  const selected = state.itineraries.find((itinerary) => itinerary.is_selected);
  await saveItineraryChange(`/api/teacher/groups/${encodeURIComponent(state.group.id)}/itinerary`, {
    method: "PUT",
    body: JSON.stringify({ itinerary_id: itineraryId, expected_itinerary_id: selected?.id || null }),
  });
}

async function saveItineraryChange(path, options) {
  if (itineraryEditPending || !state.itinerariesReady || state.itinerariesGroupId !== state.group?.id) return;
  itineraryEditPending = true;
  const groupId = state.group?.id;
  let feedback = null;
  updateItineraryControls();
  try {
    await api(path, options);
    if (path === "/api/teacher/itineraries" && state.group?.id === groupId) $("itineraryTitle").value = "";
    if (state.group?.id === groupId) await loadItineraries();
  } catch (error) {
    if (state.group?.id !== groupId) return;
    // Keep the editor available, and load a collaborator's changes before retrying.
    try { await loadItineraries(); } catch { renderItineraries({ itineraries: state.itineraries }); }
    feedback = t(error.status === 409 ? "teacher.itinerary.conflict" : "teacher.itinerary.saveError");
  } finally {
    itineraryEditPending = false;
    // Restore boundary buttons from their real positions, only with fresh data.
    if (state.itinerariesReady && state.itinerariesGroupId === state.group?.id) {
      renderItineraries({ itineraries: state.itineraries });
    }
    updateItineraryControls();
    if (feedback && state.group?.id === groupId) {
      const notice = document.createElement("p");
      notice.setAttribute("role", "alert");
      notice.textContent = feedback;
      $("itinerariesOutput").prepend(notice);
    }
  }
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
    setTeacherSession(false);
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
  setEmpty($("teacherOutput"), t("teacher.logoutMessage"));
  setEmpty($("resultsOutput"), t("teacher.resultsPlaceholder"));
}

async function teacherSummary() {
  const summary = await api("/api/teacher/summary", { method: "GET" });
  state.groups = summary.groups || [];
  setOutput(
    $("teacherOutput"),
    `
      <p><strong>${escapeHtml(summary.active)}</strong> ${t("teacher.activeOfTotal", { total: escapeHtml(summary.total) })}</p>
      ${table(summary.groups, [
        { key: "name", label: t("teacher.groupOpaque") },
        { key: "tenant_id", label: t("teacher.tenant") },
        { key: "active", label: t("teacher.active") },
      ])}
    `,
  );
}

async function loadTeacherData() {
  const [summary, assignmentData, identityData] = await Promise.all([
    api("/api/teacher/summary", { method: "GET" }),
    api("/api/teacher/activity-assignments", { method: "GET" }),
    api("/api/teacher/identities", { method: "GET" }),
  ]);
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
  const [summary] = await loadTeacherData();
  setOutput($("teacherOutput"), teacherDashboard(summary, state.assignments));
  if (state.group && has("itinerariesOutput")) {
    await loadItineraries();
  }
}

async function createBatch() {
  if (!state.teacher) {
    throw new Error(t("teacher.errors.loginFirst"));
  }
  const tenantId = $("tenantId").value.trim() || "centre";
  const count = Number($("identityCount").value || 6);
  const batch = await api("/api/identities/batch", {
    method: "POST",
    body: JSON.stringify({ tenant_id: tenantId, count, pin_length: 4 }),
  });
  state.group = batch.group;
  state.identities = batch.identities;
  state.assignment = null;
  state.assignments = [];
  saveState();
  setOutput(
    $("teacherOutput"),
    `
      <p>${t("teacher.groupCreated")} <strong>${escapeHtml(batch.group.group_code)}</strong></p>
      <p>${t("teacher.pickCardHint")}</p>
      ${groupLinks(batch.group)}
      ${batchActions(batch.identities, batch.group.group_code)}
      ${credentialCards(batch.identities)}
    `,
  );
}

async function addGroupIdentities() {
  if (!state.teacher) throw new Error(t("teacher.errors.loginFirst"));
  if (!state.group) throw new Error(t("teacher.errors.selectGroupFirst"));
  const count = Number($("additionalIdentityCount").value || 6);
  const batch = await api(`/api/teacher/groups/${encodeURIComponent(state.group.id)}/identities`, {
    method: "POST",
    body: JSON.stringify({ count, pin_length: 4 }),
  });
  const [summary, assignmentData, identityData] = await loadTeacherData();
  setOutput(
    $("teacherOutput"),
    `<p>${t("teacher.identitiesAdded", { count: batch.identities.length })}</p>${batchActions(batch.identities, state.group.group_code)}${credentialCards(batch.identities)}${teacherDashboard(summary, assignmentData.assignments || [], identityData.identities || [])}`,
  );
}

async function deleteGroup() {
  if (!state.teacher) throw new Error(t("teacher.errors.loginFirst"));
  if (!state.group) throw new Error(t("teacher.errors.selectGroupFirst"));
  if (!window.confirm(t("teacher.confirmDeleteGroup", { group: state.group.group_code }))) return;
  await api(`/api/teacher/groups/${encodeURIComponent(state.group.id)}`, { method: "DELETE" });
  state.group = null;
  state.assignment = null;
  state.identities = [];
  state.assignments = [];
  state.itineraries = [];
  saveState();
  setEmpty($("teacherOutput"), t("teacher.groupDeleted"));
  setEmpty($("membersOutput"), t("teacher.membersEmpty"));
  setEmpty($("itinerariesOutput"), t("teacher.itinerariesEmpty"));
  await refreshDashboard();
}

async function regeneratePin(identityId) {
  if (!state.teacher) {
    throw new Error(t("teacher.errors.loginFirst"));
  }
  const identity = state.identities.find((item) => item.id === identityId);
  const regenerated = await api(`/api/identities/${encodeURIComponent(identityId)}/regenerate-pin`, {
    method: "POST",
  });
  const [summary, assignmentData, identityData] = await loadTeacherData();
  setOutput(
    $("teacherOutput"),
    `
      <p>${t("teacher.pinRegenerated")} <strong>${escapeHtml(identity ? identity.public_code : regenerated.id)}</strong>.</p>
      <p class="pin-notice">${t("teacher.newPin")} <strong>${escapeHtml(regenerated.pin)}</strong>. ${t("teacher.pinStoreHint")}</p>
      ${teacherDashboard(summary, assignmentData.assignments || [], identityData.identities || [])}
    `,
  );
}

async function revokeIdentity(identityId) {
  if (!state.teacher) {
    throw new Error(t("teacher.errors.loginFirst"));
  }
  const identity = state.identities.find((item) => item.id === identityId);
  const label = identity ? identity.public_code : identityId;
  if (!window.confirm(t("teacher.confirmRevoke", { label }))) {
    return;
  }
  await api(`/api/identities/${encodeURIComponent(identityId)}/revoke`, { method: "POST" });
  const [summary, assignmentData, identityData] = await loadTeacherData();
  setOutput(
    $("teacherOutput"),
    `<p>${t("teacher.revoked", { label: escapeHtml(label) })}</p>${teacherDashboard(summary, assignmentData.assignments || [], identityData.identities || [])}`,
  );
}

async function loadGroupMembers() {
  if (!state.teacher) throw new Error(t("teacher.errors.loginFirst"));
  if (!state.group) throw new Error(t("teacher.errors.selectGroupFirst"));
  const data = await api(`/api/teacher/groups/${encodeURIComponent(state.group.id)}/members`, { method: "GET" });
  const members = data.members || [];
  setOutput(
    $("membersOutput"),
    members.length
      ? table(members.map((member) => ({
          ...member,
          action: member.role === "owner"
            ? ""
            : `<button class="compact danger" type="button" data-remove-member="${escapeHtml(member.teacher_id)}">${t("teacher.removeMember")}</button>`,
        })), [
          { key: "teacher_id", label: t("teacher.memberIdLabel") },
          { key: "role", label: t("common.status") },
          { key: "created_at", label: t("common.date") },
          {
            key: "action",
            label: "",
            html: true,
          },
        ])
      : `<p>${t("common.tableEmpty")}</p>`,
  );
}

async function addGroupMember() {
  if (!state.teacher) throw new Error(t("teacher.errors.loginFirst"));
  if (!state.group) throw new Error(t("teacher.errors.selectGroupFirst"));
  const teacherId = $("memberTeacherId").value.trim();
  if (!teacherId) throw new Error(t("teacher.errors.enterMemberId"));
  await api(`/api/teacher/groups/${encodeURIComponent(state.group.id)}/members`, {
    method: "POST",
    body: JSON.stringify({ teacher_id: teacherId, role: "teacher" }),
  });
  $("memberTeacherId").value = "";
  await loadGroupMembers();
}

async function removeGroupMember(teacherId) {
  if (!state.teacher) throw new Error(t("teacher.errors.loginFirst"));
  if (!state.group) throw new Error(t("teacher.errors.selectGroupFirst"));
  if (!window.confirm(t("teacher.confirmRemoveMember", { id: teacherId }))) return;
  await api(`/api/teacher/groups/${encodeURIComponent(state.group.id)}/members/${encodeURIComponent(teacherId)}`, {
    method: "DELETE",
  });
  await loadGroupMembers();
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

async function loadResults() {
  if (!state.assignment) {
    throw new Error(t("teacher.errors.selectActivityFirst"));
  }
  const assignmentId = state.assignment.id;
  const data = await api(`/api/teacher/activity-assignments/${assignmentId}/results`, { method: "GET" });
  const rows = data.results.map((row) => ({
    ...row,
    status: row.completed ? t("student.done") : t("student.pending"),
    action: row.completed
      ? `<button class="compact secondary" type="button" data-unmark-completed="${escapeHtml(assignmentId)}:${escapeHtml(row.identity_id)}">${t("teacher.unmarkCompleted")}</button>`
      : `<button class="compact secondary" type="button" data-mark-completed="${escapeHtml(assignmentId)}:${escapeHtml(row.identity_id)}">${t("teacher.markCompleted")}</button>`,
  }));
  setOutput(
    $("resultsOutput"),
    table(rows, [
      { key: "public_code", label: t("common.code") },
      { key: "attempts", label: t("common.attempts") },
      { key: "best_score", label: t("common.bestScore") },
      { key: "last_score_at", label: t("common.lastScoreAt") },
      { key: "status", label: t("common.status") },
      { key: "action", label: "", html: true },
    ]),
  );
}

async function toggleManualCompletion(assignmentId, identityId, completed) {
  await api(`/api/teacher/activity-assignments/${encodeURIComponent(assignmentId)}/students/${encodeURIComponent(identityId)}/complete`, {
    method: completed ? "DELETE" : "POST",
  });
  await loadResults();
}

async function loadRanking() {
  if (!state.assignment) {
    throw new Error(t("teacher.errors.selectActivityFirst"));
  }
  const appId = state.assignment.app_id;
  const activityId = state.assignment.activity_id;
  const ranking = await api(`/api/rankings?app_id=${encodeURIComponent(appId)}&activity_id=${encodeURIComponent(activityId)}&limit=20`, { method: "GET" });
  setOutput(
    $("resultsOutput"),
    table(ranking, [
      { key: "public_code", label: t("common.code") },
      { key: "score", label: t("common.score") },
      { key: "ts", label: t("common.date") },
    ]),
  );
}

function bind(id, fn, outputId = "resultsOutput") {
  const node = $(id);
  if (!node) return;
  node.addEventListener("click", async () => {
    try {
      await fn();
    } catch (error) {
      const output = $(outputId);
      if (output) {
        setOutput(output, `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    }
  });
}

document.addEventListener("click", (event) => {
  const card = event.target.closest(".credential");
  if (card) {
    if (has("studentCode") && has("studentPin") && has("studentOutput")) {
      $("studentCode").value = card.dataset.code;
      $("studentPin").value = card.dataset.pin;
      setOutput($("studentOutput"), `<p>${t("common.credentialLoaded")}</p>`);
    }
    return;
  }

  const printBatchButton = event.target.closest("[data-print-batch]");
  if (printBatchButton) {
    const batch = pendingBatches.get(printBatchButton.dataset.printBatch);
    if (batch) printBatchCards(batch.identities, batch.groupCode);
    return;
  }

  const downloadBatchButton = event.target.closest("[data-download-batch-csv]");
  if (downloadBatchButton) {
    const batch = pendingBatches.get(downloadBatchButton.dataset.downloadBatchCsv);
    if (batch) downloadBatchCsv(batch.identities, batch.groupCode);
    return;
  }

  const groupButton = event.target.closest("[data-select-group]");
  if (groupButton) {
    const group = state.groups.find((item) => item.id === groupButton.dataset.selectGroup);
    if (!group) return;
    state.group = { id: group.id, group_code: group.name, tenant_id: group.tenant_id };
    state.assignment = null;
    saveState();
    refreshDashboard().catch((error) => {
      if (has("teacherOutput")) {
        setOutput($("teacherOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    });
    return;
  }

  const assignmentButton = event.target.closest("[data-select-assignment]");
  if (assignmentButton) {
    const assignment = state.assignments.find((item) => item.id === assignmentButton.dataset.selectAssignment);
    if (!assignment) return;
    const group = state.groups.find((item) => item.id === assignment.group_id);
    state.assignment = assignment;
    if (group) {
      state.group = { id: group.id, group_code: group.name, tenant_id: group.tenant_id };
    }
    saveState();
    if (has("resultsOutput")) {
      setOutput(
        $("resultsOutput"),
        `<p>${t("teacher.activitySelected")} <strong>${escapeHtml(assignment.title || assignment.activity_id)}</strong>.</p>`,
      );
    }
    if (has("itinerariesOutput")) {
      loadItineraries().catch(() => {});
    }
    return;
  }

  const pinButton = event.target.closest("[data-regenerate-pin]");
  if (pinButton) {
    regeneratePin(pinButton.dataset.regeneratePin).catch((error) => {
      if (has("teacherOutput")) {
        setOutput($("teacherOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    });
    return;
  }

  const revokeButton = event.target.closest("[data-revoke-identity]");
  if (revokeButton) {
    revokeIdentity(revokeButton.dataset.revokeIdentity).catch((error) => {
      if (has("teacherOutput")) {
        setOutput($("teacherOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    });
    return;
  }

  const markCompletedButton = event.target.closest("[data-mark-completed]");
  if (markCompletedButton) {
    const [assignmentId, identityId] = markCompletedButton.dataset.markCompleted.split(":");
    toggleManualCompletion(assignmentId, identityId, false).catch((error) => {
      if (has("resultsOutput")) {
        setOutput($("resultsOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    });
    return;
  }

  const unmarkCompletedButton = event.target.closest("[data-unmark-completed]");
  if (unmarkCompletedButton) {
    const [assignmentId, identityId] = unmarkCompletedButton.dataset.unmarkCompleted.split(":");
    toggleManualCompletion(assignmentId, identityId, true).catch((error) => {
      if (has("resultsOutput")) {
        setOutput($("resultsOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    });
    return;
  }

  const removeMemberButton = event.target.closest("[data-remove-member]");
  if (removeMemberButton) {
    removeGroupMember(removeMemberButton.dataset.removeMember).catch((error) => {
      if (has("membersOutput")) {
        setOutput($("membersOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    });
    return;
  }

  const selectItineraryButton = event.target.closest("[data-select-group-itinerary]");
  if (selectItineraryButton) {
    selectGroupItinerary(selectItineraryButton.dataset.selectGroupItinerary);
    return;
  }
  if (event.target.closest("[data-clear-group-itinerary]")) {
    selectGroupItinerary(null);
    return;
  }

  const editItineraryButton = event.target.closest("[data-edit-itinerary]");
  if (editItineraryButton) {
    editItineraryItem(editItineraryButton);
    return;
  }

  const addItineraryItemButton = event.target.closest("[data-add-itinerary-item]");
  if (addItineraryItemButton) {
    addSelectedActivityToItinerary(addItineraryItemButton.dataset.addItineraryItem).catch((error) => {
      if (has("itinerariesOutput")) setOutput($("itinerariesOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
    });
    return;
  }

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
bind("createBatch", createBatch, "teacherOutput");
bind("addGroupIdentities", addGroupIdentities, "teacherOutput");
bind("deleteGroup", deleteGroup, "teacherOutput");
bind("assignFavoriteResources", assignFavoriteResources, "resourcesOutput");
bind("addGroupMember", addGroupMember, "membersOutput");
bind("loadGroupMembers", loadGroupMembers, "membersOutput");
bind("studentLogin", studentLogin, "studentOutput");
bind("studentLogout", studentLogout, "studentOutput");
bind("loadResults", loadResults);
bind("loadRanking", loadRanking);
bind("createItinerary", createItinerary, "itinerariesOutput");
bind("loadItineraries", loadItineraries, "itinerariesOutput");

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
  if (has("itinerariesOutput") && state.teacher && state.group) {
    renderItineraries({ itineraries: state.itineraries });
    if (itineraryEditPending) {
      $("itinerariesOutput").querySelectorAll("button").forEach((node) => { node.disabled = true; });
    }
  }
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

restoreState();
setAuthentikLinks();
setApplicationLinks();
loadEnabledModules();
loadBlocsLink();
if (has("teacherOidcLogin")) {
  setTeacherSession(false);
}
if (has("teacherOutput")) {
  if (state.group) {
    setOutput(
      $("teacherOutput"),
      `<p>${t("teacher.groupRestored")} <strong>${escapeHtml(state.group.group_code)}</strong>. ${t("teacher.groupRestoredHint")}</p>${groupLinks(state.group)}`,
    );
  } else {
    setEmpty($("teacherOutput"), t("teacher.emptyCredentials"));
  }
}
if (has("resultsOutput")) {
  if (state.assignment) {
    setOutput(
      $("resultsOutput"),
      `<p>${t("teacher.activityRestored")} <strong>${escapeHtml(state.assignment.title || state.assignment.activity_id)}</strong>.</p>`,
    );
  } else {
    setEmpty($("resultsOutput"), t("teacher.resultsPlaceholder"));
  }
}

refreshStudentSession().catch(() => {});
checkIdentityStatus();
checkOidc();
checkFirstRunSetup();
if (has("teacherOidcLogin")) {
  refreshTeacherSession();
}
