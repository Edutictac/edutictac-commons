const EDUHOOT_APP = "eduhoot";
const PLAY_APP = "edutictac-play";
const STORAGE_KEY = "edutictac-commons-state";
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
  student: null,
  studentAssignments: [],
  resources: [],
};

const $ = (id) => document.getElementById(id);
const has = (id) => Boolean($(id));
const t = window.i18nPortal.t;

function setAuthentikLinks() {
  const url = `${window.location.protocol}//${window.location.hostname}:9000/`;
  ["authentikHomeLink", "authentikNavLink"].forEach((id) => {
    const link = $(id);
    if (link) link.href = url;
  });
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
  ["teacherSummary", "refreshDashboard", "createBatch", "createEduhootAssignment", "teacherLogout", "addGroupMember", "loadGroupMembers"].forEach((id) => {
    const node = $(id);
    if (node) {
      node.disabled = !active;
    }
  });
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
    throw new Error(detail);
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

function renderResources(data) {
  const output = $("resourcesOutput");
  if (!output) return;
  state.resources = data.items || [];
  if (!state.resources.length) {
    setEmpty(output, t("teacher.resourcesEmpty"));
    return;
  }
  setOutput(output, `<div class="cards">${state.resources.map((resource) => `
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
    renderResources(await api("/resources-api/teacher/favorites?limit=48", { method: "GET" }));
  } catch (error) {
    setEmpty(output, t("teacher.favoritesUnavailable"));
  }
}

async function assignResource(resource) {
  if (!state.group) throw new Error("Selecciona primer un grup.");
  const assignment = await api("/api/teacher/activity-assignments", {
    method: "POST",
    body: JSON.stringify({
      group_id: state.group.id,
      app_id: resource.provider === PLAY_APP ? PLAY_APP : "resource",
      activity_id: resourceActivityId(resource),
      title: resource.title || resource.external_id,
    }),
  });
  state.assignment = assignment.assignment;
  await loadTeacherData();
  setOutput($("resourcesOutput"), `<p>Recurs assignat: <strong>${escapeHtml(assignment.assignment.title)}</strong>.</p>`);
}

function studentDashboard(assignments) {
  const completed = assignments.filter((assignment) => assignment.completed).length;
  const total = assignments.length;
  const rows = assignments.map((assignment) => ({
    ...assignment,
    title: assignment.title || assignment.activity_id,
    status: assignment.completed ? t("student.done") : t("student.pending"),
    best_score: assignment.best_score ?? "",
    last_score_at: assignment.last_score_at || "",
    action:
      assignment.app_id === EDUHOOT_APP
        ? `<button class="compact secondary" type="button" data-launch-eduhoot-assignment="${escapeHtml(assignment.id)}">${t("student.openEduhoot")}</button>`
        : assignment.app_id === PLAY_APP
          ? `<button class="compact secondary" type="button" data-launch-play-assignment="${escapeHtml(assignment.id)}">${t("student.openPlay")}</button>`
        : "",
  }));
  return `
    <p>${t("student.progressLabel")} <strong>${completed}/${total}</strong> ${t("student.progressCompleted")}</p>
    ${table(rows, [
      { key: "title", label: t("common.activity") },
      { key: "status", label: t("common.status") },
      { key: "best_score", label: t("common.bestScore") },
      { key: "last_score_at", label: t("common.lastScoreAt") },
      { key: "action", label: "", html: true },
    ])}
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

async function checkHealth() {
  $("apiStatus").textContent = t("common.apiStatus.checking");
  try {
    await api("/api/health", { method: "GET" });
    $("apiStatus").textContent = t("common.apiStatus.ok");
    $("apiStatus").classList.remove("error");
  } catch (error) {
    $("apiStatus").textContent = t("common.apiStatus.error");
    $("apiStatus").classList.add("error");
  }
}

async function checkOidc() {
  const button = $("teacherOidcLogin");
  if (!button) return;
  try {
    const status = await api("/api/auth/oidc/status", { method: "GET" });
    button.disabled = !status.enabled;
    button.title = status.enabled ? status.issuer : "OIDC no configurado en este entorno";
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

async function teacherLogin() {
  const token = $("teacherToken").value.trim();
  await api("/api/teacher/login", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  setTeacherSession(true);
  await refreshDashboard();
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
      ${credentialCards(batch.identities)}
    `,
  );
}

async function createEduhootAssignment() {
  if (!state.teacher) {
    throw new Error(t("teacher.errors.loginFirst"));
  }
  if (!state.group) {
    throw new Error(t("teacher.errors.selectGroupFirst"));
  }
  const activityId = $("eduhootActivityId").value.trim();
  if (!activityId) {
    throw new Error(t("teacher.errors.enterEduhootId"));
  }
  const title = $("eduhootActivityTitle").value.trim() || `EduHoot ${activityId}`;
  const created = await api("/api/teacher/activity-assignments", {
    method: "POST",
    body: JSON.stringify({
      group_id: state.group.id,
      app_id: EDUHOOT_APP,
      activity_id: activityId,
      title,
    }),
  });
  state.assignment = created.assignment;
  state.assignments = [created.assignment, ...state.assignments.filter((item) => item.id !== created.assignment.id)];
  saveState();
  setOutput(
    $("resultsOutput"),
    `<p>${t("teacher.eduhootAssigned")} <strong>${escapeHtml(state.group.group_code)}</strong>: <strong>${escapeHtml(title)}</strong>.</p>`,
  );
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
  setStudentSession(true);
  await loadStudentDashboard();
}

async function studentLogout() {
  await api("/api/auth/logout", { method: "POST" });
  state.student = null;
  state.studentAssignments = [];
  setStudentSession(false);
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
    setStudentSession(true);
    await loadStudentDashboard();
  } catch (error) {
    state.student = null;
    setStudentSession(false);
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
  const url = new URL(`/play/${encodeURIComponent(assignment.activity_id)}`, window.location.origin);
  url.searchParams.set("launch_token", launch.token);
  window.location.href = url.toString();
}

async function loadResults() {
  if (!state.assignment) {
    throw new Error(t("teacher.errors.selectActivityFirst"));
  }
  const data = await api(`/api/teacher/activity-assignments/${state.assignment.id}/results`, { method: "GET" });
  setOutput(
    $("resultsOutput"),
    table(data.results, [
      { key: "public_code", label: t("common.code") },
      { key: "attempts", label: t("common.attempts") },
      { key: "best_score", label: t("common.bestScore") },
      { key: "last_score_at", label: t("common.lastScoreAt") },
    ]),
  );
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

  const removeMemberButton = event.target.closest("[data-remove-member]");
  if (removeMemberButton) {
    removeGroupMember(removeMemberButton.dataset.removeMember).catch((error) => {
      if (has("membersOutput")) {
        setOutput($("membersOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>`);
      }
    });
    return;
  }

  const iconButton = event.target.closest("[data-student-icon]");
  if (iconButton) {
    updateStudentIcon(iconButton.dataset.studentIcon).catch((error) => {
      setOutput($("studentOutput"), `<p><strong>${t("common.errorLabel")}</strong> ${escapeHtml(error.message)}</p>${studentProfileCard()}${studentDashboard(state.studentAssignments)}`);
    });
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

bind("teacherLogin", teacherLogin, "teacherOutput");
bind("teacherOidcLogin", teacherOidcLogin);
bind("teacherLogout", teacherLogout, "teacherOutput");
bind("teacherSummary", teacherSummary, "teacherOutput");
bind("refreshDashboard", refreshDashboard, "teacherOutput");
bind("createBatch", createBatch, "teacherOutput");
bind("createEduhootAssignment", createEduhootAssignment, "resultsOutput");
bind("addGroupMember", addGroupMember, "membersOutput");
bind("loadGroupMembers", loadGroupMembers, "membersOutput");
bind("studentLogin", studentLogin, "studentOutput");
bind("studentLogout", studentLogout, "studentOutput");
bind("loadResults", loadResults);
bind("loadRanking", loadRanking);

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

restoreState();
setAuthentikLinks();
if (has("teacherLogin")) {
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
checkHealth();
checkOidc();
if (has("teacherLogin")) {
  refreshTeacherSession();
}
