<script setup>
// Xip de compte, enllaç d'inici i selector de tema comuns a EduTicTac.
// Es publica com a <edutictac-account> (vegeu main.js) i llig la configuració
// dels atributs `data-*` de l'element; mira la capçalera de main.js.
import {computed, nextTick, onBeforeUnmount, onMounted, ref, useHost} from 'vue';
import {LANGUAGE_NAMES, TEXT, languageHost, pageLang} from './texts.js';

const PUBLIC_HOME = 'https://edutictac.es/';
const THEMES = ['auto', 'light', 'dark'];

const host = useHost();
const data = ref({...host.dataset});
const lang = ref(pageLang(host));
const state = ref(null);
const status = ref('checking');
const open = ref(false);
const alignStart = ref(false);
const theme = ref(window.edutictacTheme?.read?.() || 'auto');
// Les apps amb tema propi (Blocs, Llibres) no carreguen theme-preference.js:
// allà el xip no oferix un selector que no tindria cap efecte.
const themeAvailable = !!window.edutictacTheme;
// El selector d'idioma només apareix si la pàgina sap canviar d'idioma.
// Es resol en muntar: els scripts d'i18n de les pàgines ja s'han carregat.
const languages = ref([]);
// Una app pot impedir el canvi en un moment donat (p. ex. Llibres amb un llibre obert).
const languageLocked = ref(false);
let pageLanguage = null;
const details = ref(null);
const menu = ref(null);
let sequence = 0;

const t = computed(() => TEXT[lang.value]);
const base = computed(() => (data.value.base || '').replace(/\/+$/, ''));
const sameOrigin = computed(() => !base.value || new URL(base.value + '/').origin === location.origin);
// Una app instal·lada (PWA) obri «Inici» en el navegador i no dins de la finestra de l'app.
const installed = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
const homeUrl = computed(() => data.value.home || (sameOrigin.value ? '/' : PUBLIC_HOME));
// data-home-only: només l'enllaç d'inici, sense consultar cap sessió (jocs infantils).
const homeOnly = computed(() => 'homeOnly' in data.value);
// data-no-student: l'app encara no guarda feina de l'alumnat (Blocs), així que no s'oferix l'accés amb codi i PIN.
const noStudent = computed(() => 'noStudent' in data.value);
// «Inici» no té sentit en la mateixa pàgina d'inici (portada d'edutictac.es o del portal).
const onHome = computed(() => {
  const clean = url => { const u = new URL(url, location.href); return u.origin + u.pathname.replace(/\/index\.html$/, '/'); };
  try { return clean(homeUrl.value) === clean(location.href); } catch { return false; }
});
const authed = computed(() => status.value === 'ready' && !!state.value?.authenticated);
const links = computed(() => state.value?.links || {});
const staff = computed(() => ['profesor', 'administrador'].includes(state.value?.role));
const roleName = computed(() => t.value.roles[state.value?.role] || '');

const name = computed(() => {
  const s = state.value || {};
  if (s.kind === 'oidc') return s.display_name || s.username || roleName.value || t.value.signIn;
  if (s.kind === 'teacher') return t.value.localTeacher;
  if (s.kind === 'student') return t.value.student.replace('{code}', s.public_code || '');
  return t.value.signIn;
});
const initials = computed(() => {
  const parts = String(name.value).trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || '?').slice(0, 2);
  return letters.toUpperCase();
});
const chipLabel = computed(() => {
  if (status.value === 'checking') return t.value.checking;
  if (status.value === 'offline') return t.value.unavailable;
  return authed.value ? `${name.value} · ${roleName.value}` : t.value.signIn;
});
const accountLink = computed(() => links.value.account || data.value.accountUrl || null);

function resolve(path) {
  return path ? new URL(path, (base.value || location.origin) + '/').href : null;
}

function signature(s) {
  return s && JSON.stringify([s.authenticated, s.kind, s.role, s.display_name, s.public_code]);
}

function announce() {
  window.dispatchEvent(new CustomEvent('edutictac:sessionchange', {detail: state.value}));
}

async function refresh() {
  if (homeOnly.value) return;
  const current = ++sequence;
  // Sempre l'URL completa: una app servida pel mateix origen a través d'un
  // proxy (Llibres) ha de tornar a ella i no al portal. Commons només l'accepta
  // si és del mateix host o d'un origen de confiança; si no, torna a "/".
  const back = location.href;
  try {
    const response = await fetch(resolve('/api/auth/session?next=' + encodeURIComponent(back)), {
      credentials: 'include', cache: 'no-store', headers: {Accept: 'application/json'},
    });
    if (!response.ok) throw new Error(String(response.status));
    const next = await response.json();
    if (current !== sequence) return;
    const changed = state.value !== null && signature(state.value) !== signature(next);
    state.value = next;
    status.value = 'ready';
    if (changed) announce();
  } catch {
    if (current === sequence) status.value = 'offline';
  }
}

function retry() {
  status.value = 'checking';
  refresh();
}

async function logout() {
  if (!window.confirm(t.value.logoutConfirm)) return;
  try {
    const response = await fetch(resolve(links.value.logout || '/api/auth/session/logout'), {
      method: 'POST', credentials: 'include', cache: 'no-store',
    });
    if (!response.ok) throw new Error(String(response.status));
  } catch {
    window.alert(t.value.logoutError);
    return;
  }
  state.value = {...(state.value || {}), authenticated: false, kind: 'anonymous', role: null, display_name: null, public_code: null};
  announce();
  if ('noReload' in data.value) refresh();
  else location.reload();
}

// Abans d'anar a entrar, l'app pot guardar la feina (Blocs desa el projecte obert):
// si cancel·la l'esdeveniment, ella mateixa continua cap a `detail.url` quan acabe.
function beforeLogin(event) {
  const url = event.currentTarget.href;
  const notice = new CustomEvent('edutictac:beforelogin', {cancelable: true, detail: {url}});
  if (!window.dispatchEvent(notice)) event.preventDefault();
}

function chooseTheme(value) {
  theme.value = value;
  window.edutictacTheme?.remember?.(value);
}

function chooseLanguage(value) {
  if (!pageLanguage || languageLocked.value || !languages.value.includes(value)) return;
  pageLanguage.set(value);
  lang.value = pageLang(host);
}

function radioKeys(event, options, current, choose, attribute) {
  const step = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1}[event.key];
  if (!step) return;
  event.preventDefault();
  const next = options[(options.indexOf(current) + step + options.length) % options.length];
  choose(next);
  nextTick(() => menu.value?.querySelector(`[${attribute}="${next}"]`)?.focus());
}

function languageKeys(event) {
  radioKeys(event, languages.value, lang.value, chooseLanguage, 'data-lang-option');
}

function themeKeys(event) {
  radioKeys(event, THEMES, theme.value, chooseTheme, 'data-theme-option');
}

async function toggled() {
  open.value = details.value.open;
  if (!open.value) return;
  languageLocked.value = !!pageLanguage?.disabled?.();
  // El menú s'obri cap a la dreta o l'esquerra segons on cap.
  alignStart.value = false;
  await nextTick();
  if (menu.value && menu.value.getBoundingClientRect().left < 8) alignStart.value = true;
}

function close(focusChip = false) {
  if (!details.value?.open) return;
  details.value.open = false;
  if (focusChip) details.value.querySelector('summary')?.focus();
}

const onOutside = event => { if (!host.contains(event.target)) close(); };
const onKey = event => { if (event.key === 'Escape') close(true); };
const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
const onLang = () => { lang.value = pageLang(host); };
const onTheme = event => { theme.value = event.detail?.preference || theme.value; };
// app.js pot afegir `data-account-url` o `data-public-home` després de muntar.
const observer = new MutationObserver(() => { data.value = {...host.dataset}; lang.value = pageLang(host); });

onMounted(() => {
  pageLanguage = languageHost();
  languages.value = pageLanguage ? pageLanguage.languages.filter(code => TEXT[code]) : [];
  document.addEventListener('click', onOutside);
  document.addEventListener('visibilitychange', onVisible);
  host.addEventListener('keydown', onKey);
  window.addEventListener('edutictac:langchange', onLang);
  window.addEventListener('edutictac:themechange', onTheme);
  window.addEventListener('edutictac:sessionrefresh', refresh);
  observer.observe(host, {attributes: true});
  refresh();
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onOutside);
  document.removeEventListener('visibilitychange', onVisible);
  host.removeEventListener('keydown', onKey);
  window.removeEventListener('edutictac:langchange', onLang);
  window.removeEventListener('edutictac:themechange', onTheme);
  window.removeEventListener('edutictac:sessionrefresh', refresh);
  observer.disconnect();
});
</script>

<template>
  <nav class="eta" :aria-label="t.nav">
    <a v-if="!onHome" class="eta-home" :href="homeUrl" :aria-label="t.homeLabel" :title="t.homeLabel"
       :target="installed ? '_blank' : null" :rel="installed ? 'noopener' : null">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h5v-6h3v6h5V9.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="eta-home__text">{{ t.home }}</span>
    </a>
    <a v-if="data.publicHome" class="eta-home eta-home--public" :href="data.publicHome">{{ t.publicHome }}</a>

    <details v-if="!homeOnly" ref="details" class="eta-account" :data-state="status" :data-authenticated="authed ? 'true' : 'false'" @toggle="toggled">
      <summary class="eta-chip" aria-haspopup="menu" :aria-label="chipLabel" :title="chipLabel">
        <span v-if="authed && state.kind === 'oidc'" class="eta-avatar">{{ initials }}</span>
        <span v-else class="eta-avatar"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 21v-1a8 8 0 0 1 16 0v1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
        <span v-if="authed" class="eta-who">
          <span class="eta-name">{{ name }}</span>
          <span class="eta-role">{{ roleName }}</span>
        </span>
        <span v-else class="eta-name">{{ chipLabel }}</span>
      </summary>

      <div ref="menu" class="eta-menu" role="menu" :data-align="alignStart ? 'start' : 'end'">
        <button v-if="status === 'offline'" type="button" class="eta-item" role="menuitem" @click="retry">{{ t.retry }}</button>
        <template v-else-if="authed">
          <a v-if="staff" class="eta-item" role="menuitem" :href="resolve(links.teacher)"><span>{{ t.dashboardTeacher }}</span></a>
          <a v-if="state.kind === 'student'" class="eta-item" role="menuitem" :href="resolve(links.student)"><span>{{ t.dashboardStudent }}</span></a>
          <a v-if="state.kind === 'oidc' && accountLink" class="eta-item" role="menuitem" :href="accountLink"><span>{{ t.account }}</span></a>
        </template>
        <template v-else-if="status === 'ready'">
          <a class="eta-item" role="menuitem" :href="resolve(links.login || links.teacher)" @click="beforeLogin"><span>{{ t.teacherLogin }}</span><small>{{ t.teacherLoginHint }}</small></a>
          <a v-if="!noStudent" class="eta-item" role="menuitem" :href="resolve(links.student)" @click="beforeLogin"><span>{{ t.studentLogin }}</span><small>{{ t.studentLoginHint }}</small></a>
        </template>

        <div v-if="languages.length > 1" class="eta-theme eta-language" role="radiogroup" :aria-label="t.language"
             :style="{gridTemplateColumns: `repeat(${languages.length}, 1fr)`}" @keydown="languageKeys">
          <span class="eta-theme__label" aria-hidden="true">{{ t.language }}</span>
          <button v-for="code in languages" :key="code" type="button" role="radio"
                  class="eta-theme__option" :data-lang-option="code" :lang="code === 'va' ? 'ca-ES-valencia' : code"
                  :aria-label="LANGUAGE_NAMES[code]" :title="LANGUAGE_NAMES[code]"
                  :aria-checked="lang === code ? 'true' : 'false'" :tabindex="lang === code ? 0 : -1"
                  :disabled="languageLocked" @click="chooseLanguage(code)">
            <span>{{ code.toUpperCase() }}</span>
          </button>
        </div>

        <div v-if="themeAvailable" class="eta-theme" role="radiogroup" :aria-label="t.theme" @keydown="themeKeys">
          <span class="eta-theme__label" aria-hidden="true">{{ t.theme }}</span>
          <button v-for="option in ['auto', 'light', 'dark']" :key="option" type="button" role="radio"
                  class="eta-theme__option" :data-theme-option="option"
                  :aria-checked="theme === option ? 'true' : 'false'" :tabindex="theme === option ? 0 : -1"
                  :title="option === 'auto' ? t.themeAutoHint : null" @click="chooseTheme(option)">
            <svg v-if="option === 'auto'" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg>
            <svg v-else-if="option === 'light'" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
            <span>{{ option === 'auto' ? t.themeAuto : option === 'light' ? t.themeLight : t.themeDark }}</span>
          </button>
        </div>

        <button v-if="authed" type="button" class="eta-item eta-item--logout" role="menuitem" @click="logout">{{ t.logout }}</button>
      </div>
    </details>
  </nav>
</template>
