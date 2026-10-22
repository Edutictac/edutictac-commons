/* Shared UI preference only: never an identity or authorization cookie. */
(function () {
  'use strict';
  const supported = ['es', 'ca', 'va', 'en'];
  const keys = ['edutictac-lang', 'edutictac-portal-lang', 'edutictac-play-lang'];
  const valid = value => supported.includes(value);
  function stored() {
    const cookie = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith('edutictac_language='));
    const value = cookie?.slice('edutictac_language='.length);
    if (valid(value)) return value;
    try { for (const key of keys) { const value = localStorage.getItem(key); if (valid(value)) return value; } } catch {}
    return null;
  }
  function read({parameter = "lang"} = {}) {
    const requested = new URLSearchParams(location.search).get(parameter);
    return valid(requested) ? requested : stored();
  }
  function remember(value, {parameter = "lang"} = {}) {
    if (!valid(value)) return;
    try { for (const key of keys) localStorage.setItem(key, value); } catch {}
    const publicDomain = location.hostname === 'edutictac.es' || location.hostname.endsWith('.edutictac.es');
    document.cookie = 'edutictac_language=' + value + '; Path=/; Max-Age=31536000; SameSite=Lax'
      + (publicDomain ? '; Domain=edutictac.es' : '') + (location.protocol === 'https:' ? '; Secure' : '');
    const url = new URL(location.href);
    if (url.searchParams.has(parameter)) { url.searchParams.set(parameter, value); history.replaceState(history.state, '', url.pathname + url.search + url.hash); }
  }
  window.commonsLanguage = Object.freeze({read, stored, remember});
})();
