export function formatters(t) {
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


return {renderStatus,renderUpdateStatus};
}
