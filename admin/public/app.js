const API_PREFIX = window.location.pathname.startsWith("/admin/") ? "/admin" : "";

const apiStatus = document.getElementById("apiStatus");
const statusOutput = document.getElementById("statusOutput");
const actionOutput = document.getElementById("actionOutput");
const teacherOutput = document.getElementById("teacherOutput");
const restoreBackupSelect = document.getElementById("restoreBackupSelect");
const rollbackBackupSelect = document.getElementById("rollbackBackupSelect");

const t = window.i18nAdmin.t;
const modulesForm = document.getElementById("modulesForm");
let moduleState = null;
let moduleWizardDismissed = false;
let moduleJobUnit = sessionStorage.getItem("commons-modules-job");
if (moduleJobUnit && !/^edutictac-commons-modules-\d{14}-[a-f0-9]{8}$/.test(moduleJobUnit)) {
  sessionStorage.removeItem("commons-modules-job");
  moduleJobUnit = null;
}

let backupJobUnit = sessionStorage.getItem("commons-backup-job");
if (backupJobUnit && !/^edutictac-commons-(?:backup-\d{14}-[a-f0-9]{8}|restore-\d{14})$/.test(backupJobUnit)) {
  sessionStorage.removeItem("commons-backup-job");
  backupJobUnit = null;
}

function closeModuleWizard() {
  const dialog = document.getElementById("modulesWizard");
  if (dialog.open) dialog.close();
  document.getElementById("modulesFormHome").appendChild(modulesForm);
  document.getElementById("modulesLater").hidden = true;
  moduleWizardDismissed = true;
}

document.getElementById("modulesLater").addEventListener("click", closeModuleWizard);
document.getElementById("modulesWizard").addEventListener("cancel", (event) => {
  event.preventDefault();
  closeModuleWizard();
});

async function loadModules() {
  const notice = document.getElementById("modulesNotice");
  const choices = document.getElementById("modulesChoices");
  const apply = document.getElementById("modulesApply");
  try {
    const response = await apiFetch("/api/modules");
    if (!response.ok) throw new Error("unavailable");
    const state = await response.json();
    if (!moduleState || state.revision !== moduleState.revision || state.phase === "failed") {
      modulesForm.querySelectorAll('[name="module"]').forEach((input) => {
        input.checked = state.enabled.includes(input.value);
      });
    }
    moduleState = state;
    if (moduleJobUnit && jobPollTimer === null && !jobPollInFlight) {
      jobPollTimer = setTimeout(() => pollJob(moduleJobUnit, Date.now()), JOB_POLL_INTERVAL_MS);
    }
    if (backupJobUnit && jobPollTimer === null && !jobPollInFlight) {
      jobPollTimer = setTimeout(() => pollJob(backupJobUnit, Date.now()), JOB_POLL_INTERVAL_MS);
    }
    const busy = Boolean(moduleJobUnit || backupJobUnit) || state.phase === "applying";
    document.getElementById("backupCreateBtn").disabled = busy;
    choices.disabled = !state.manageable || busy;
    apply.disabled = !state.manageable || busy;
    const quiosc = modulesForm.querySelector('[value="quiosc"]');
    quiosc.disabled = !state.available.quiosc && !quiosc.checked;
    document.getElementById("modulesQuioscHint").hidden = state.available.quiosc;
    setOutput(notice, t(!state.manageable ? "modules.updateInstaller" : busy ? "modules.applying" :
      state.error ? "modules.failed" : state.configured ? "modules.ready" : "modules.firstHint"), Boolean(state.error));
    if (state.manageable && !state.configured && !busy && !moduleWizardDismissed) {
      document.getElementById("modulesWizardContent").appendChild(modulesForm);
      document.getElementById("modulesLater").hidden = false;
      const dialog = document.getElementById("modulesWizard");
      if (!dialog.open) dialog.showModal();
    }
  } catch {
    choices.disabled = true;
    apply.disabled = true;
    setOutput(notice, t("modules.unavailable"), true);
  }
}

modulesForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!moduleState || moduleJobUnit) return;
  const enabled = [...modulesForm.querySelectorAll('[name="module"]:checked')].map((input) => input.value);
  document.getElementById("modulesChoices").disabled = true;
  document.getElementById("modulesApply").disabled = true;
  try {
    const response = await apiFetch("/api/modules", {
      method: "POST", headers: { "Content-Type": "application/json", "X-Commons-Modules": "1" },
      body: JSON.stringify({ enabled, revision: moduleState.revision }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok || !result.unit) throw new Error(result.output || "operation_failed");
    moduleJobUnit = result.unit;
    sessionStorage.setItem("commons-modules-job", result.unit);
    closeModuleWizard();
    setOutput(document.getElementById("modulesNotice"), t("modules.applying"), false);
    setOutput(actionOutput, t("modules.applying"), false);
    jobPollTimer = setTimeout(() => pollJob(result.unit, Date.now()), JOB_POLL_INTERVAL_MS);
  } catch (error) {
    await loadModules();
    const key = ["configuration_changed", "operation_busy", "quiosc_not_prepared", "host_runner_unavailable"].includes(error.message)
      ? `modules.error.${error.message}` : "modules.failed";
    setOutput(document.getElementById("modulesNotice"), t(key), true);
  }
});

function setOutput(el, text, isError) {
  el.removeAttribute("data-i18n");
  el.textContent = text;
  el.classList.remove("empty", "error");
  if (isError) {
    el.classList.add("error");
  }
}

document.getElementById("teacherForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  setOutput(teacherOutput, t("teachers.creating"), false);
  const payload = {
    username: document.getElementById("teacherUsername").value.trim(),
    name: document.getElementById("teacherName").value.trim(),
    email: document.getElementById("teacherEmail").value.trim(),
  };
  try {
    const response = await apiFetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    const teacher = data.teacher;
    setOutput(teacherOutput, t("teachers.created", {
      username: teacher.username,
      password: teacher.temporary_password,
    }), false);
    event.target.reset();
  } catch (error) {
    setOutput(teacherOutput, `${t("common.errorLabel")} ${error.message}`, true);
  }
});

async function apiFetch(path, options) {
  const resp = await fetch(`${API_PREFIX}${path}`, Object.assign({ credentials: "same-origin" }, options));
  if (resp.status === 401) {
    apiStatus.textContent = t("status.authRequired");
    throw new Error(t("errors.unauthorized"));
  }
  return resp;
}

function fmtService(name, info) {
  const state = info.reachable ? "OK" : t("status.notResponding");
  return `- ${name}: ${state} (${info.detail})`;
}

function fmtBackup(b) {
  if (b.error) {
    return `  - ${b.name}: ${b.error}`;
  }
  const warn = b.warnings && b.warnings.length ? ` | ${t("backup.warnings")}: ${b.warnings.join("; ")}` : "";
  return `  - ${b.name} (${b.created_at}, v${b.stack_version})${warn}`;
}

function fmtSystemdValue(data, key) {
  if (data.error) {
    return `ERROR: ${data.error}`;
  }
  return data[key] || "?";
}

function populateBackupSelect(backups) {
  restoreBackupSelect.textContent = "";
  const usable = backups.filter((b) => !b.error);
  if (!usable.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = t("backup.noneAvailable");
    restoreBackupSelect.appendChild(option);
    restoreBackupSelect.disabled = true;
    return;
  }
  usable.forEach((backup) => {
    const option = document.createElement("option");
    option.value = backup.name;
    option.textContent = `${backup.name} (${backup.created_at || t("backup.noDate")})`;
    restoreBackupSelect.appendChild(option);
  });
  restoreBackupSelect.disabled = false;
}

function populateRollbackSelect(backups) {
  rollbackBackupSelect.textContent = "";
  const usable = backups.filter((backup) => backup.update && !backup.error);
  if (!usable.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = t("images.rollbackNone");
    rollbackBackupSelect.appendChild(option);
    rollbackBackupSelect.disabled = true;
    return;
  }
  usable.forEach((backup) => {
    const option = document.createElement("option");
    option.value = backup.name;
    option.textContent = `${backup.name} (→ ${backup.update.previous_image_tag})`;
    rollbackBackupSelect.appendChild(option);
  });
  rollbackBackupSelect.disabled = false;
}

function renderStatus(data) {
  const lines = [];
  lines.push(t("status.stackVersion", { version: data.stack_version }));
  lines.push(t("status.imagesLine", {
    registry: data.image_registry,
    tag: data.image_tag,
    eduhoot: data.eduhoot_tag,
  }));
  lines.push(t("status.updateChannel", { channel: data.update_channel || "testing" }));
  lines.push(t("status.activeProfiles", {
    profiles: data.active_profiles.length ? data.active_profiles.join(", ") : t("status.none"),
  }));
  lines.push("");
  lines.push(t("status.services"));
  Object.entries(data.services).forEach(([name, info]) => {
    lines.push(fmtService(name, info));
  });
  lines.push("");
  if (data.last_backup) {
    lines.push(t("status.lastBackup", {
      name: data.last_backup.name,
      date: data.last_backup.created_at,
    }));
  } else {
    lines.push(t("status.lastBackupNone"));
  }
  if (data.coverage_warnings && data.coverage_warnings.length) {
    lines.push(t("status.coverageWarnings", { warnings: data.coverage_warnings.join("; ") }));
  }
  lines.push("");
  lines.push(t("status.backupsAvailable", { count: data.backups.length }));
  data.backups.forEach((b) => lines.push(fmtBackup(b)));
  lines.push("");
  const timer = data.backup_timer.timer || {};
  const service = data.backup_timer.service || {};
  lines.push(t("status.backupTimer"));
  lines.push(`  ${t("status.unitFileState")} ${fmtSystemdValue(timer, "UnitFileState")}`);
  lines.push(`  ${t("status.activeStateTimer")} ${fmtSystemdValue(timer, "ActiveState")}`);
  lines.push(`  ${t("status.lastRun")} ${fmtSystemdValue(timer, "LastTriggerUSec")}`);
  lines.push(`  ${t("status.nextRun")} ${fmtSystemdValue(timer, "NextElapseUSecRealtime")}`);
  lines.push(`  ${t("status.activeStateService")} ${fmtSystemdValue(service, "ActiveState")}`);
  lines.push(`  ${t("status.lastRunResult")} ${fmtSystemdValue(service, "Result")}`);
  lines.push(t("status.checkedAt", { date: data.checked_at }));
  return lines.join("\n");
}

function renderUpdateStatus(data) {
  const lines = [];
  lines.push(`${t("status.registryLine")} ${data.registry}`);
  lines.push(`${t("status.channelLine")} ${data.channel}`);
  ["commons", "eduhoot", "recursos"].forEach((name) => {
    const item = data[name];
    if (!item) return;
    lines.push("");
    lines.push(`${name}:`);
    if (item.error) {
      lines.push(`  ERROR: ${item.error}`);
    } else {
      lines.push(`  ${t("status.installed")} ${item.current || "-"}`);
      lines.push(`  ${t("status.available")} ${item.candidate || "-"}`);
      lines.push(`  ${t("status.updateAvailable")} ${item.update_available ? t("status.yes") : t("status.no")}`);
    }
  });
  return lines.join("\n");
}

async function loadStatus() {
  try {
    const resp = await apiFetch("/api/status");
    if (!resp.ok) {
      setOutput(statusOutput, t("status.loadError", { status: resp.status }), true);
      return;
    }
    const data = await resp.json();
    apiStatus.textContent = t("status.connected");
    populateBackupSelect(data.backups || []);
    populateRollbackSelect(data.backups || []);
    setOutput(statusOutput, renderStatus(data), false);
    await loadModules();
  } catch (err) {
    setOutput(statusOutput, `${t("common.errorLabel")} ${err.message}`, true);
  }
}

async function checkUpdates() {
  setOutput(actionOutput, t("images.checking"), false);
  try {
    const resp = await apiFetch("/api/updates");
    const data = await resp.json();
    setOutput(actionOutput, data.output || renderUpdateStatus(data), !resp.ok || data.ok === false);
  } catch (err) {
    setOutput(actionOutput, `${t("common.errorLabel")} ${err.message}`, true);
  }
}

async function runAction(path, confirmMessage) {
  if (!window.confirm(confirmMessage)) {
    return;
  }
  setOutput(actionOutput, t("common.executing"), false);
  try {
    const resp = await apiFetch(path, { method: "POST" });
    const data = await resp.json();
    setOutput(actionOutput, data.output || JSON.stringify(data), !data.ok);
    await loadStatus();
  } catch (err) {
    setOutput(actionOutput, `${t("common.errorLabel")} ${err.message}`, true);
  }
}

async function runJsonAction(path, payload) {
  setOutput(actionOutput, t("common.executing"), false);
  try {
    const resp = await apiFetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    setOutput(actionOutput, data.output || JSON.stringify(data), !data.ok);
    await loadStatus();
  } catch (err) {
    setOutput(actionOutput, `${t("common.errorLabel")} ${err.message}`, true);
  }
}

const JOB_POLL_INTERVAL_MS = 3000;
const JOB_POLL_TIMEOUT_MS = 10 * 60 * 1000;
const JOB_POLL_MAX_CONSECUTIVE_FAILURES = 30;
let jobPollTimer = null;
let jobPollFailures = 0;
let jobPollInFlight = false;

function stopJobPoll() {
  if (jobPollTimer) {
    clearTimeout(jobPollTimer);
    jobPollTimer = null;
  }
}

async function pollJob(unit, startedAt) {
  if (jobPollInFlight) return;
  jobPollInFlight = true;
  try {
    jobPollTimer = null;
    stopJobPoll();
    let data;
    try {
      const resp = await apiFetch(`/api/job-status?unit=${encodeURIComponent(unit)}`);
      data = await resp.json();
      if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
      jobPollFailures = 0;
    } catch (err) {
      // "Actualitzar imatges" també reinicia el propi contenidor admin que
      // servix este JS i respon a este mateix polling: durant eixe reinici
      // el fetch pot fallar de forma transitòria encara que la feina de
      // fons (systemd-run --collect, independent del contenidor) continue i
      // acabe amb èxit. Reintenta unes quantes vegades abans de donar-ho per
      // fallat perquè l'usuari no vega un error fals mentre tot va bé.
      jobPollFailures += 1;
      const timedOut = Date.now() - startedAt > (backupJobUnit ? 30 * 60 * 1000 : JOB_POLL_TIMEOUT_MS);
      if (timedOut || (!backupJobUnit && jobPollFailures > JOB_POLL_MAX_CONSECUTIVE_FAILURES)) {
        setOutput(actionOutput, `${t("common.errorLabel")} ${err.message}`, true);
        return;
      }
      setOutput(actionOutput, t("job.reconnecting"), false);
      jobPollTimer = setTimeout(() => pollJob(unit, startedAt), JOB_POLL_INTERVAL_MS);
      return;
    }

    const log = data.log || "";
    if (data.running) {
      if (Date.now() - startedAt > (backupJobUnit ? 30 * 60 * 1000 : JOB_POLL_TIMEOUT_MS)) {
        setOutput(actionOutput, `${log}\n\n${t("job.timeout")}`, true);
        return;
      }
      setOutput(actionOutput, `${log}\n\n${t("job.running")}`, false);
      jobPollTimer = setTimeout(() => pollJob(unit, startedAt), JOB_POLL_INTERVAL_MS);
      return;
    }

    const success = data.result === "success";
    if (moduleJobUnit === unit) {
      moduleJobUnit = null;
      sessionStorage.removeItem("commons-modules-job");
    }
    if (backupJobUnit === unit) {
      backupJobUnit = null;
      sessionStorage.removeItem("commons-backup-job");
    }
    setOutput(actionOutput, `${log}\n\n${success ? t("job.success") : t("job.failed")}`, !success);
    await loadStatus();
  } finally {
    jobPollInFlight = false;
  }
}

async function runJobAction(path, payload) {
  setOutput(actionOutput, t("common.executing"), false);
  try {
    const resp = await apiFetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(path.startsWith("/api/backup/") ? { "X-Commons-Backup": "1" } : {}) },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    setOutput(actionOutput, data.ok && data.unit ? t("common.executing") : data.output || JSON.stringify(data), !data.ok);
    if (data.ok && data.unit) {
      if (path.startsWith("/api/backup/")) {
        backupJobUnit = data.unit;
        sessionStorage.setItem("commons-backup-job", data.unit);
      }
      jobPollTimer = setTimeout(() => pollJob(data.unit, Date.now()), JOB_POLL_INTERVAL_MS);
    } else {
      await loadStatus();
    }
  } catch (err) {
    setOutput(actionOutput, `${t("common.errorLabel")} ${err.message}`, true);
  }
}

document.getElementById("loginBtn").addEventListener("click", () => {
  window.location.href = "/api/auth/oidc/login?next=%2Fadmin%2F";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  fetch("/api/auth/oidc/logout", { method: "POST", credentials: "same-origin" }).finally(() => {
    apiStatus.textContent = t("status.disconnected");
    setOutput(statusOutput, t("status.signInToView"), false);
    statusOutput.classList.add("empty");
    closeModuleWizard();
    moduleState = null;
    document.getElementById("modulesChoices").disabled = true;
    document.getElementById("modulesApply").disabled = true;
  });
});

document.getElementById("refreshBtn").addEventListener("click", loadStatus);

document.getElementById("backupCreateBtn").addEventListener("click", () => {
  if (window.confirm(t("backup.createConfirm"))) runJobAction("/api/backup/create", {});
});

document.getElementById("timerInstallBtn").addEventListener("click", () => {
  runAction(
    "/api/backup-timer/install",
    t("backup.installTimerConfirm"),
  );
});

document.getElementById("timerUninstallBtn").addEventListener("click", () => {
  runAction(
    "/api/backup-timer/uninstall",
    t("backup.uninstallTimerConfirm"),
  );
});

document.getElementById("backupRestoreBtn").addEventListener("click", () => {
  const backup = restoreBackupSelect.value;
  if (!backup) {
    setOutput(actionOutput, t("backup.noneSelected"), true);
    return;
  }
  const typed = window.prompt(t("backup.restorePrompt", { backup }));
  if (typed !== t("backup.restoreConfirmWord")) {
    setOutput(actionOutput, t("backup.restoreCancelled"), false);
    return;
  }
  runJobAction("/api/backup/restore", { backup });
});

document.getElementById("imagesCheckBtn").addEventListener("click", checkUpdates);

document.getElementById("imagesUpdateBtn").addEventListener("click", () => {
  const typed = window.prompt(t("images.updatePrompt"));
  if (typed !== t("images.updateConfirmWord")) {
    setOutput(actionOutput, t("images.updateCancelled"), false);
    return;
  }
  runJobAction("/api/images/update", {});
});

document.getElementById("imagesRollbackBtn").addEventListener("click", () => {
  const backup = rollbackBackupSelect.value;
  if (!backup) {
    setOutput(actionOutput, t("images.rollbackNone"), true);
    return;
  }
  const typed = window.prompt(t("images.rollbackPrompt", { backup }));
  if (typed !== t("images.rollbackConfirmWord")) {
    setOutput(actionOutput, t("images.rollbackCancelled"), false);
    return;
  }
  runJobAction("/api/images/rollback", { backup });
});

document.getElementById("contentResourcesSyncBtn").addEventListener("click", () => {
  runJsonAction("/api/content-sync/resources", {});
});

document.getElementById("contentEduhootSyncBtn").addEventListener("click", () => {
  runJsonAction("/api/content-sync/eduhoot", {});
});

apiStatus.textContent = t("status.checking");
setOutput(statusOutput, t("status.signInToView"), false);
statusOutput.classList.add("empty");
setOutput(actionOutput, t("common.actionPlaceholder"), false);
actionOutput.classList.add("empty");
window.addEventListener("edutictac:langchange", () => {
  if (moduleState) loadModules();
});
loadStatus();

// Resume even while the identity API is briefly stopped by the backup.
if ((backupJobUnit || moduleJobUnit) && jobPollTimer === null && !jobPollInFlight) {
  jobPollTimer = setTimeout(() => pollJob(backupJobUnit || moduleJobUnit, Date.now()), JOB_POLL_INTERVAL_MS);
}
