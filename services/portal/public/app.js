const DEMO_APP = "commons-demo";
const DEMO_ACTIVITY = "primera-activitat";

const state = {
  group: null,
  identities: [],
  assignment: null,
  student: null,
};

const $ = (id) => document.getElementById(id);

function setOutput(node, content) {
  node.classList.remove("empty");
  node.innerHTML = content;
}

function setEmpty(node, content) {
  node.classList.add("empty");
  node.textContent = content;
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
            </button>
          `,
        )
        .join("")}
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

async function teacherLogin() {
  const token = $("teacherToken").value.trim();
  await api("/api/teacher/login", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  setOutput($("teacherOutput"), "<p>Sessió docent iniciada.</p>");
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
  const tenantId = $("tenantId").value.trim() || "demo-centre";
  const count = Number($("identityCount").value || 6);
  const batch = await api("/api/identities/batch", {
    method: "POST",
    body: JSON.stringify({ tenant_id: tenantId, count, pin_length: 4 }),
  });
  state.group = batch.group;
  state.identities = batch.identities;
  setOutput(
    $("teacherOutput"),
    `
      <p>Grup generat: <strong>${escapeHtml(batch.group.group_code)}</strong></p>
      <p>Tria una targeta per omplir l'accés de l'alumne.</p>
      ${credentialCards(batch.identities)}
    `,
  );
}

async function createAssignment() {
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
    `<p>Hola, <strong>${escapeHtml(login.identity.public_code)}</strong>. Ja tens sessió pseudònima.</p>`,
  );
}

async function sendScore() {
  if (!state.student) {
    throw new Error("Entra primer com a alumne.");
  }
  const score = Math.floor(60 + Math.random() * 41);
  const saved = await api("/api/scores", {
    method: "POST",
    body: JSON.stringify({
      app_id: DEMO_APP,
      activity_id: DEMO_ACTIVITY,
      assignment_id: state.assignment ? state.assignment.id : "",
      score,
      metadata: { demo: true },
    }),
  });
  setOutput(
    $("studentOutput"),
    `<p>Activitat completada per <strong>${escapeHtml(saved.public_code)}</strong> amb puntuació <strong>${saved.score}</strong>.</p>`,
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

function bind(id, fn) {
  $(id).addEventListener("click", async () => {
    try {
      await fn();
    } catch (error) {
      setOutput($("resultsOutput"), `<p><strong>Error:</strong> ${escapeHtml(error.message)}</p>`);
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

bind("teacherLogin", teacherLogin);
bind("teacherSummary", teacherSummary);
bind("createBatch", createBatch);
bind("createAssignment", createAssignment);
bind("studentLogin", studentLogin);
bind("sendScore", sendScore);
bind("loadResults", loadResults);
bind("loadRanking", loadRanking);

checkHealth();
