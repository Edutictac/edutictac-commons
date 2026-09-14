const TOKEN_KEY = "edutictacAdminToken";

const tokenInput = document.getElementById("adminToken");
const apiStatus = document.getElementById("apiStatus");
const statusOutput = document.getElementById("statusOutput");
const actionOutput = document.getElementById("actionOutput");
const restoreBackupSelect = document.getElementById("restoreBackupSelect");

localStorage.removeItem(TOKEN_KEY);

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

function setToken(token) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

function setOutput(el, text, isError) {
  el.textContent = text;
  el.classList.remove("empty", "error");
  if (isError) {
    el.classList.add("error");
  }
}

async function apiFetch(path, options) {
  const token = getToken();
  const headers = Object.assign({}, (options && options.headers) || {}, {
    Authorization: `Bearer ${token}`,
  });
  const resp = await fetch(path, Object.assign({}, options, { headers }));
  if (resp.status === 401) {
    apiStatus.textContent = "Token invàlid";
    throw new Error("no autoritzat");
  }
  return resp;
}

function fmtService(name, info) {
  const state = info.reachable ? "OK" : "NO respon";
  return `- ${name}: ${state} (${info.detail})`;
}

function fmtBackup(b) {
  if (b.error) {
    return `  - ${b.name}: ${b.error}`;
  }
  const warn = b.warnings && b.warnings.length ? ` | avisos: ${b.warnings.join("; ")}` : "";
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
    option.textContent = "Cap backup disponible";
    restoreBackupSelect.appendChild(option);
    restoreBackupSelect.disabled = true;
    return;
  }
  usable.forEach((backup) => {
    const option = document.createElement("option");
    option.value = backup.name;
    option.textContent = `${backup.name} (${backup.created_at || "sense data"})`;
    restoreBackupSelect.appendChild(option);
  });
  restoreBackupSelect.disabled = false;
}

function renderStatus(data) {
  const lines = [];
  lines.push(`Versió del stack: ${data.stack_version}`);
  lines.push(`Imatges: registre=${data.image_registry} tag=${data.image_tag} eduhoot=${data.eduhoot_tag}`);
  lines.push(`Canal d'actualitzacions: ${data.update_channel || "testing"}`);
  lines.push(`Perfils actius: ${data.active_profiles.length ? data.active_profiles.join(", ") : "cap"}`);
  lines.push("");
  lines.push("Serveis:");
  Object.entries(data.services).forEach(([name, info]) => {
    lines.push(fmtService(name, info));
  });
  lines.push("");
  if (data.last_backup) {
    lines.push(`Últim backup: ${data.last_backup.name} (${data.last_backup.created_at})`);
  } else {
    lines.push("Últim backup: cap");
  }
  if (data.coverage_warnings && data.coverage_warnings.length) {
    lines.push(`Avisos de cobertura: ${data.coverage_warnings.join("; ")}`);
  }
  lines.push("");
  lines.push(`Backups disponibles (${data.backups.length}):`);
  data.backups.forEach((b) => lines.push(fmtBackup(b)));
  lines.push("");
  const timer = data.backup_timer.timer || {};
  const service = data.backup_timer.service || {};
  lines.push("Timer de backup automàtic:");
  lines.push(`  UnitFileState: ${fmtSystemdValue(timer, "UnitFileState")}`);
  lines.push(`  ActiveState (timer): ${fmtSystemdValue(timer, "ActiveState")}`);
  lines.push(`  Última execució: ${fmtSystemdValue(timer, "LastTriggerUSec")}`);
  lines.push(`  Pròxima execució: ${fmtSystemdValue(timer, "NextElapseUSecRealtime")}`);
  lines.push(`  ActiveState (servei): ${fmtSystemdValue(service, "ActiveState")}`);
  lines.push(`  Resultat última execució: ${fmtSystemdValue(service, "Result")}`);
  lines.push(`Comprovat: ${data.checked_at}`);
  return lines.join("\n");
}

function renderUpdateStatus(data) {
  const lines = [];
  lines.push(`Registre: ${data.registry}`);
  lines.push(`Canal: ${data.channel}`);
  ["commons", "eduhoot"].forEach((name) => {
    const item = data[name];
    if (!item) return;
    lines.push("");
    lines.push(`${name}:`);
    if (item.error) {
      lines.push(`  ERROR: ${item.error}`);
    } else {
      lines.push(`  Instal·lada: ${item.current || "-"}`);
      lines.push(`  Disponible: ${item.candidate || "-"}`);
      lines.push(`  Actualització: ${item.update_available ? "sí" : "no"}`);
    }
  });
  return lines.join("\n");
}

async function loadStatus() {
  try {
    const resp = await apiFetch("/api/status");
    if (!resp.ok) {
      setOutput(statusOutput, `Error carregant estat: HTTP ${resp.status}`, true);
      return;
    }
    const data = await resp.json();
    apiStatus.textContent = "Connectat";
    populateBackupSelect(data.backups || []);
    setOutput(statusOutput, renderStatus(data), false);
  } catch (err) {
    setOutput(statusOutput, `Error: ${err.message}`, true);
  }
}

async function checkUpdates() {
  setOutput(actionOutput, "Comprovant actualitzacions...", false);
  try {
    const resp = await apiFetch("/api/updates");
    const data = await resp.json();
    setOutput(actionOutput, data.output || renderUpdateStatus(data), !resp.ok || data.ok === false);
  } catch (err) {
    setOutput(actionOutput, `Error: ${err.message}`, true);
  }
}

async function runAction(path, confirmMessage) {
  if (!window.confirm(confirmMessage)) {
    return;
  }
  setOutput(actionOutput, "Executant...", false);
  try {
    const resp = await apiFetch(path, { method: "POST" });
    const data = await resp.json();
    setOutput(actionOutput, data.output || JSON.stringify(data), !data.ok);
    await loadStatus();
  } catch (err) {
    setOutput(actionOutput, `Error: ${err.message}`, true);
  }
}

async function runJsonAction(path, payload) {
  setOutput(actionOutput, "Executant...", false);
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
    setOutput(actionOutput, `Error: ${err.message}`, true);
  }
}

document.getElementById("loginBtn").addEventListener("click", () => {
  setToken(tokenInput.value.trim());
  loadStatus();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  setToken("");
  localStorage.removeItem(TOKEN_KEY);
  tokenInput.value = "";
  apiStatus.textContent = "Desconnectat";
  setOutput(statusOutput, "Entra amb el token per veure l'estat.", false);
  statusOutput.classList.add("empty");
});

document.getElementById("refreshBtn").addEventListener("click", loadStatus);

document.getElementById("backupCreateBtn").addEventListener("click", () => {
  runAction("/api/backup/create", "Crear un backup ara?");
});

document.getElementById("timerInstallBtn").addEventListener("click", () => {
  runAction(
    "/api/backup-timer/install",
    "Activar el timer diari de backups automàtics en aquest host?"
  );
});

document.getElementById("timerUninstallBtn").addEventListener("click", () => {
  runAction(
    "/api/backup-timer/uninstall",
    "Desactivar el timer de backups automàtics en aquest host?"
  );
});

document.getElementById("backupRestoreBtn").addEventListener("click", () => {
  const backup = restoreBackupSelect.value;
  if (!backup) {
    setOutput(actionOutput, "No hi ha cap backup seleccionat.", true);
    return;
  }
  const typed = window.prompt(
    `Aquesta accio parara el stack i restaurara ${backup}. Escriu RESTAURAR per continuar.`
  );
  if (typed !== "RESTAURAR") {
    setOutput(actionOutput, "Restauracio cancel·lada.", false);
    return;
  }
  runJsonAction("/api/backup/restore", { backup });
});

document.getElementById("imagesCheckBtn").addEventListener("click", checkUpdates);

document.getElementById("imagesUpdateBtn").addEventListener("click", () => {
  const typed = window.prompt(
    "Aquesta accio buscara el tag mes recent del canal, creara un backup, descarregara imatges i reiniciara el stack. Escriu ACTUALITZAR per continuar."
  );
  if (typed !== "ACTUALITZAR") {
    setOutput(actionOutput, "Actualitzacio cancel·lada.", false);
    return;
  }
  runJsonAction("/api/images/update", {});
});

const savedToken = getToken();
if (savedToken) {
  tokenInput.value = savedToken;
  loadStatus();
}
