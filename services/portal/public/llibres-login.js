/* Completion of Commons' existing OIDC flow; no credentials or profile data. */
const lang = new URLSearchParams(location.search).get("lang") === "va" ? "va" : "es";
const text = lang === "va" ? {
  checking: "Comprovant l’accés…", ready: "Ja pots publicar el teu llibre",
  done: "Torna a la pestanya de Llibres. El formulari es mostrarà automàticament; si cal, prem Actualitzar després d’entrar.",
  teacher: "Esta sessió no té permisos docents", teacherHelp: "Entra amb una altra sessió de Commons que tinga permisos de professorat o administració.",
  missing: "Cal iniciar sessió", missingHelp: "Entra amb el teu compte docent i després torna a la pestanya del llibre.",
  unavailable: "No s’ha pogut comprovar l’accés", retryHelp: "Torna a Llibres i prem Actualitzar després d’entrar.",
  retry: "Entrar amb compte docent", close: "Tanca esta pestanya i torna al llibre",
} : {
  checking: "Comprobando acceso…", ready: "Ya puedes publicar tu libro",
  done: "Vuelve a la pestaña de Llibres. El formulario aparecerá automáticamente; si hace falta, pulsa Actualizar tras entrar.",
  teacher: "Esta sesión no tiene permisos docentes", teacherHelp: "Entra con otra sesión de Commons que tenga permisos de profesorado o administración.",
  missing: "Hace falta iniciar sesión", missingHelp: "Entra con tu cuenta docente y después vuelve a la pestaña del libro.",
  unavailable: "No se ha podido comprobar el acceso", retryHelp: "Vuelve a Llibres y pulsa Actualizar tras entrar.",
  retry: "Entrar con cuenta docente", close: "Cerrar esta pestaña y volver al libro",
};
document.documentElement.lang = lang === "va" ? "ca-valencia" : "es";
const title = document.getElementById("login-title");
const message = document.getElementById("login-message");
const retry = document.getElementById("login-retry");
const close = document.getElementById("login-close");
title.textContent = text.checking;
close.textContent = text.close;
close.onclick = () => window.close();
retry.textContent = text.retry;
retry.href = "/api/auth/oidc/login?next=" + encodeURIComponent("/llibres-login.html?lang=" + lang);
(async () => {
  try {
    const response = await fetch("/api/llibres/me", {credentials: "same-origin", cache: "no-store"});
    if (!response.ok) throw new Error("unavailable");
    const result = await response.json();
    if (result.can_publish) {
      title.textContent = text.ready; message.textContent = text.done;
    } else {
      const teacher = result.reason === "publication_teacher_required";
      title.textContent = teacher ? text.teacher : text.missing;
      message.textContent = teacher ? text.teacherHelp : text.missingHelp;
      retry.hidden = false;
    }
  } catch {
    title.textContent = text.unavailable; message.textContent = text.retryHelp;
  }
})();
