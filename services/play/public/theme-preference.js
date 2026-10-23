/* Preferència de tema compartida (auto | light | dark). Mai és una galeta
 * d'identitat. Es carrega sense `defer` dins de <head> perquè el tema s'aplique
 * abans del primer pintat i no hi haja un parpelleig de tema incorrecte. */
(function () {
  'use strict';
  const valid = value => value === 'auto' || value === 'light' || value === 'dark';
  const KEY = 'edutictac-theme';
  const COOKIE = 'edutictac_theme';
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function stored() {
    const cookie = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith(COOKIE + '='));
    const value = cookie && cookie.slice(COOKIE.length + 1);
    if (valid(value)) return value;
    try { const local = localStorage.getItem(KEY); if (valid(local)) return local; } catch (error) {}
    return 'auto';
  }

  function resolved(preference) {
    if (preference === 'light' || preference === 'dark') return preference;
    return media && media.matches ? 'dark' : 'light';
  }

  function apply(preference) {
    const theme = resolved(preference);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-theme-preference', preference);
    root.style.colorScheme = theme;
    // `theme-color` pren el fons real de la pàgina una vegada hi ha CSS.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && document.body) {
      const background = getComputedStyle(document.body).backgroundColor;
      if (background) meta.setAttribute('content', background);
    }
    return theme;
  }

  function remember(preference) {
    if (!valid(preference)) return;
    try { localStorage.setItem(KEY, preference); } catch (error) {}
    const publicDomain = location.hostname === 'edutictac.es' || location.hostname.endsWith('.edutictac.es');
    document.cookie = COOKIE + '=' + preference + '; Path=/; Max-Age=31536000; SameSite=Lax'
      + (publicDomain ? '; Domain=edutictac.es' : '') + (location.protocol === 'https:' ? '; Secure' : '');
    const theme = apply(preference);
    window.dispatchEvent(new CustomEvent('edutictac:themechange', { detail: { preference: preference, theme: theme } }));
  }

  function read() { return stored(); }

  apply(stored());
  if (media) {
    const follow = () => { if (stored() === 'auto') remember('auto'); };
    if (media.addEventListener) media.addEventListener('change', follow); else if (media.addListener) media.addListener(follow);
  }
  // Una altra pestanya o subdomini pot haver canviat la preferència.
  window.addEventListener('pageshow', () => apply(stored()));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') apply(stored()); });
  document.addEventListener('DOMContentLoaded', () => apply(stored()));

  window.edutictacTheme = Object.freeze({ read: read, resolved: () => resolved(stored()), remember: remember });
})();
