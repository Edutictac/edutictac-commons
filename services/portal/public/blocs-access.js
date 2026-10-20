/* Commons login remains the owner of the session; Blocs only consumes Rebost. */
const BLOCS_ACCESS_TEXT = {
  es: {
    loading: 'Comprobando el acceso…',
    hint: 'Entra para utilizar tus imágenes del Rebost en Blocs.',
    student: 'Entrar con código y PIN', oidc: 'Entrar con la cuenta del centro',
    anonymous: 'Abrir Blocs sin iniciar sesión', retry: 'Volver a intentar',
    unavailable: 'No se puede conectar con Blocs o con el Rebost. Vuelve a intentarlo.'
  },
  va: {
    loading: 'Comprovant l’accés…',
    hint: 'Entra per a utilitzar les teues imatges del Rebost en Blocs.',
    student: 'Entra amb codi i PIN', oidc: 'Entra amb el compte del centre',
    anonymous: 'Obri Blocs sense iniciar sessió', retry: 'Torna a intentar-ho',
    unavailable: 'No es pot connectar amb Blocs o amb el Rebost. Torna a intentar-ho.'
  }
};
const accessElement = id => document.getElementById(id);
let accessError = false;
let accessReady = false;
function accessLanguage() {
  const text = BLOCS_ACCESS_TEXT[window.i18nPortal.getLang() === 'es' ? 'es' : 'va'];
  for (const [id, key] of Object.entries({hint:'hint',studentLogin:'student',oidcLogin:'oidc',anonymous:'anonymous',retry:'retry'})) {
    accessElement(id).textContent = text[key];
  }
  accessElement('status').textContent = accessError ? text.unavailable : accessReady ? '' : text.loading;
}
window.addEventListener('edutictac:langchange', accessLanguage);
accessLanguage();
(async () => {
  try {
    const options = {credentials: 'same-origin', cache: 'no-store'};
    const available = await fetch('/blocs/status', options);
    if (!available.ok || (await available.json()).enabled !== true) throw new Error('unavailable');
    const profile = await fetch('/api/assets/v1/me', options);
    if (profile.ok) {
      const data = await profile.json();
      if (!Array.isArray(data.capabilities) || !data.capabilities.includes('private_library')) throw new Error('unavailable');
      location.replace('/blocs/editor.html');
      return;
    }
    if (profile.status !== 401) throw new Error('unavailable');
    accessReady = true; accessLanguage();
    accessElement('access').hidden = false;
    // Code/PIN and anonymous editing still work when OIDC is disabled or offline.
    try {
      const provider = await fetch('/api/auth/oidc/status', options);
      accessElement('oidcLogin').hidden = !provider.ok || (await provider.json()).enabled !== true;
    } catch (_) { /* The optional provider is unavailable. */ }
  } catch (_) {
    accessError = true; accessLanguage(); accessElement('retry').hidden = false;
  }
})();
