const API_PREFIX = window.location.pathname.startsWith("/admin/") ? "/admin" : "";

const apiStatus = document.getElementById("apiStatus");
const statusOutput = document.getElementById("statusOutput");
const actionOutput = document.getElementById("actionOutput");
const teacherOutput = document.getElementById("teacherOutput");
const restoreBackupSelect = document.getElementById("restoreBackupSelect");
const rollbackBackupSelect = document.getElementById("rollbackBackupSelect");

const t = window.i18nAdmin.t;

function setOutput(el, text, isError) {
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
  ["commons", "eduhoot"].forEach((name) => {
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
let jobPollTimer = null;

function stopJobPoll() {
  if (jobPollTimer) {
    clearTimeout(jobPollTimer);
    jobPollTimer = null;
  }
}

async function pollJob(unit, startedAt) {
  stopJobPoll();
  let data;
  try {
    const resp = await apiFetch(`/api/job-status?unit=${encodeURIComponent(unit)}`);
    data = await resp.json();
    if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
  } catch (err) {
    setOutput(actionOutput, `${t("common.errorLabel")} ${err.message}`, true);
    return;
  }

  const log = data.log || "";
  if (data.running) {
    if (Date.now() - startedAt > JOB_POLL_TIMEOUT_MS) {
      setOutput(actionOutput, `${log}\n\n${t("job.timeout")}`, true);
      return;
    }
    setOutput(actionOutput, `${log}\n\n${t("job.running")}`, false);
    jobPollTimer = setTimeout(() => pollJob(unit, startedAt), JOB_POLL_INTERVAL_MS);
    return;
  }

  const success = data.result === "success";
  setOutput(actionOutput, `${log}\n\n${success ? t("job.success") : t("job.failed")}`, !success);
  await loadStatus();
}

async function runJobAction(path, payload) {
  setOutput(actionOutput, t("common.executing"), false);
  try {
    const resp = await apiFetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    setOutput(actionOutput, data.output || JSON.stringify(data), !data.ok);
    if (data.ok && data.unit) {
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
  });
});

document.getElementById("refreshBtn").addEventListener("click", loadStatus);

document.getElementById("backupCreateBtn").addEventListener("click", () => {
  runAction("/api/backup/create", t("backup.createConfirm"));
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
loadStatus();
