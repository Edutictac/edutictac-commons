const DEMO_APP = "commons-demo";
const DEMO_ACTIVITY = "primera-activitat";
const ACTIVITY_QUESTIONS = 3;
const STORAGE_KEY = "edutictac-commons-demo-state";

const state = {
  teacher: false,
  group: null,
  identities: [],
  assignment: null,
  student: null,
};

const $ = (id) => document.getElementById(id);

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
  node.innerHTML = content;
}

function setEmpty(node, content) {
  node.classList.add("empty");
  node.textContent = content;
}

function setTeacherSession(active) {
  state.teacher = active;
  ["teacherSummary", "createBatch", "createAssignment", "teacherLogout"].forEach((id) => {
    $(id).disabled = !active;
  });
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
              <small>Usar en alumnat</small>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function groupLinks(group) {
  if (!group) return "";
  return `
    <div class="actions">
      <a class="button-link" href="/api/groups/${encodeURIComponent(group.id)}/cards" target="_blank" rel="noopener">Targetes</a>
      <a class="button-link secondary" href="/api/groups/${encodeURIComponent(group.id)}/csv" target="_blank" rel="noopener">CSV codis</a>
    </div>
  `;
}

function table(rows, columns) {
  if (!rows.length) {
    return "<p>Sense dades encara.</p>";
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
                ${columns.map((col) => `<td>${escapeHtml(row[col.key] ?? "")}</td>`).join("")}
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function activityScore() {
  const answers = Array.from(document.querySelectorAll("#activityForm input[type='radio']:checked"));
  if (answers.length !== ACTIVITY_QUESTIONS) {
    throw new Error("Respon les tres preguntes abans d'enviar l'activitat.");
  }
  const correct = answers.reduce((total, answer) => total + Number(answer.value), 0);
  return {
    correct,
    total: ACTIVITY_QUESTIONS,
    score: Math.round((correct / ACTIVITY_QUESTIONS) * 100),
  };
}

async function checkHealth() {
  try {
    await api("/api/health", { method: "GET" });
    $("apiStatus").textContent = "API activa";
    $("apiStatus").classList.remove("error");
  } catch (error) {
    $("apiStatus").textContent = "API no disponible";
    $("apiStatus").classList.add("error");
  }
}

async function refreshTeacherSession() {
  try {
    await api("/api/teacher/summary", { method: "GET" });
    setTeacherSession(true);
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
  setOutput(
    $("teacherOutput"),
    state.group
      ? `<p>Sessió docent iniciada. Grup recuperat: <strong>${escapeHtml(state.group.group_code)}</strong>.</p>${groupLinks(state.group)}`
      : "<p>Sessió docent iniciada.</p>",
  );
}

async function teacherLogout() {
  await api("/api/teacher/logout", { method: "POST" });
  setTeacherSession(false);
  state.group = null;
  state.identities = [];
  state.assignment = null;
  saveState();
  setEmpty($("teacherOutput"), "Sessió docent tancada. Entra de nou per generar credencials.");
  setEmpty($("resultsOutput"), "Els resultats apareixeran ací.");
}

async function teacherSummary() {
  const summary = await api("/api/teacher/summary", { method: "GET" });
  setOutput(
    $("teacherOutput"),
    `
      <p><strong>${summary.active}</strong> identitats actives de ${summary.total} totals.</p>
      ${table(summary.groups, [
        { key: "name", label: "Grup opac" },
        { key: "tenant_id", label: "Tenant" },
        { key: "active", label: "Actives" },
      ])}
    `,
  );
}

async function createBatch() {
  if (!state.teacher) {
    throw new Error("Entra primer com a docent.");
  }
  const tenantId = $("tenantId").value.trim() || "demo-centre";
  const count = Number($("identityCount").value || 6);
  const batch = await api("/api/identities/batch", {
    method: "POST",
    body: JSON.stringify({ tenant_id: tenantId, count, pin_length: 4 }),
  });
  state.group = batch.group;
  state.identities = batch.identities;
  state.assignment = null;
  saveState();
  setOutput(
    $("teacherOutput"),
    `
      <p>Grup generat: <strong>${escapeHtml(batch.group.group_code)}</strong></p>
      <p>Tria una targeta d'ací baix per omplir l'accés de l'alumne. Els PINs només es mostren en aquest moment; el CSV no els inclou.</p>
      ${groupLinks(batch.group)}
      ${credentialCards(batch.identities)}
    `,
  );
}

async function createAssignment() {
  if (!state.teacher) {
    throw new Error("Entra primer com a docent.");
  }
  if (!state.group) {
    throw new Error("Genera primer un grup.");
  }
  const created = await api("/api/teacher/activity-assignments", {
    method: "POST",
    body: JSON.stringify({
      group_id: state.group.id,
      app_id: DEMO_APP,
      activity_id: DEMO_ACTIVITY,
      title: "Activitat demo Commons",
    }),
  });
  state.assignment = created.assignment;
  saveState();
  setOutput(
    $("resultsOutput"),
    `<p>Activitat assignada al grup <strong>${escapeHtml(state.group.group_code)}</strong>.</p>`,
  );
}

async function studentLogin() {
  const publicCode = $("studentCode").value.trim().toUpperCase();
  const pin = $("studentPin").value.trim();
  const login = await api("/api/auth/student", {
    method: "POST",
    body: JSON.stringify({ public_code: publicCode, pin }),
  });
  state.student = login.identity;
  setOutput(
    $("studentOutput"),
    `<p>Hola, <strong>${escapeHtml(login.identity.public_code)}</strong>. Ja tens sessió pseudònima. Pots completar el repte.</p>`,
  );
}

async function sendScore() {
  if (!state.student) {
    throw new Error("Entra primer com a alumne.");
  }
  const result = activityScore();
  const saved = await api("/api/scores", {
    method: "POST",
    body: JSON.stringify({
      app_id: DEMO_APP,
      activity_id: DEMO_ACTIVITY,
      assignment_id: state.assignment ? state.assignment.id : "",
      score: result.score,
      metadata: { demo: true, correct: result.correct, total: result.total },
    }),
  });
  setOutput(
    $("studentOutput"),
    `<p>Activitat completada per <strong>${escapeHtml(saved.public_code)}</strong>: ${result.correct}/${result.total} encerts, puntuació <strong>${saved.score}</strong>.</p>`,
  );
}

async function loadResults() {
  if (!state.assignment) {
    throw new Error("Assigna primer l'activitat demo.");
  }
  const data = await api(`/api/teacher/activity-assignments/${state.assignment.id}/results`, { method: "GET" });
  setOutput(
    $("resultsOutput"),
    table(data.results, [
      { key: "public_code", label: "Codi" },
      { key: "attempts", label: "Intents" },
      { key: "best_score", label: "Millor puntuació" },
      { key: "last_score_at", label: "Última vegada" },
    ]),
  );
}

async function loadRanking() {
  const ranking = await api(`/api/rankings?app_id=${DEMO_APP}&activity_id=${DEMO_ACTIVITY}&limit=20`, { method: "GET" });
  setOutput(
    $("resultsOutput"),
    table(ranking, [
      { key: "public_code", label: "Codi" },
      { key: "score", label: "Puntuació" },
      { key: "ts", label: "Data" },
    ]),
  );
}

function bind(id, fn, outputId = "resultsOutput") {
  $(id).addEventListener("click", async () => {
    try {
      await fn();
    } catch (error) {
      setOutput($(outputId), `<p><strong>Error:</strong> ${escapeHtml(error.message)}</p>`);
    }
  });
}

document.addEventListener("click", (event) => {
  const card = event.target.closest(".credential");
  if (!card) return;
  $("studentCode").value = card.dataset.code;
  $("studentPin").value = card.dataset.pin;
  setOutput($("studentOutput"), `<p>Credencial carregada. Ja pots entrar com a alumne.</p>`);
});

bind("teacherLogin", teacherLogin, "teacherOutput");
bind("teacherLogout", teacherLogout, "teacherOutput");
bind("teacherSummary", teacherSummary, "teacherOutput");
bind("createBatch", createBatch, "teacherOutput");
bind("createAssignment", createAssignment, "resultsOutput");
bind("studentLogin", studentLogin, "studentOutput");
bind("sendScore", sendScore, "studentOutput");
bind("loadResults", loadResults);
bind("loadRanking", loadRanking);

restoreState();
setTeacherSession(false);
if (state.group) {
  setOutput(
    $("teacherOutput"),
    `<p>Grup demo recuperat: <strong>${escapeHtml(state.group.group_code)}</strong>. Entra com a docent per obrir targetes, CSV o consultar resultats.</p>${groupLinks(state.group)}`,
  );
}
if (state.assignment) {
  setOutput(
    $("resultsOutput"),
    `<p>Activitat demo recuperada: <strong>${escapeHtml(state.assignment.title || state.assignment.activity_id)}</strong>.</p>`,
  );
}
checkHealth();
refreshTeacherSession();
