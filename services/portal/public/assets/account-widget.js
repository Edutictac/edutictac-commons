/* Xip de compte i enllaç d'inici comuns a les pàgines i apps d'EduTicTac.
 *
 * Ús:
 *   <link rel="stylesheet" href="https://commons.edutictac.es/assets/account-widget.css">
 *   <script src="https://commons.edutictac.es/assets/account-widget.js" defer></script>
 *   <edutictac-account data-base="https://commons.edutictac.es"></edutictac-account>
 *
 * Atributs:
 *   data-base         URL de Commons (buit = mateix origen).
 *   data-home         destí de «Inici» (per defecte "/" en Commons i
 *                     https://edutictac.es/ fora).
 *   data-public-home  enllaç secundari opcional a la web pública.
 *   data-account-url  pàgina del compte si el servidor no en dona cap.
 *   data-lang         ca | va | es | en; si falta, segueix la pàgina.
 *   data-no-reload    no recarregar la pàgina després d'eixir.
 *
 * Només mostra la sessió: no protegix cap contingut. Emet
 * `edutictac:sessionchange` (detail = estat) quan canvia.
 */
(function () {
  'use strict';
  if (window.customElements?.get('edutictac-account')) return;

  const PUBLIC_HOME = 'https://edutictac.es/';
  const TEXT = {
    ca: {
      home: 'Inici', homeLabel: 'Inici d’EduTicTac', publicHome: 'edutictac.es', nav: 'Compte EduTicTac',
      checking: 'Comprovant…', signIn: 'Entrar', unavailable: 'Sense connexió', retry: 'Tornar a provar',
      teacherLogin: 'Professorat', teacherLoginHint: 'Compte EduTicTac', studentLogin: 'Alumnat', studentLoginHint: 'Codi i PIN',
      dashboardTeacher: 'Tauler docent', dashboardStudent: 'Tauler d’alumnat', account: 'Compte i contrasenya',
      logout: 'Eixir de la sessió', logoutConfirm: 'Vols tancar la sessió en totes les aplicacions d’EduTicTac?',
      logoutError: 'No s’ha pogut tancar la sessió.', student: 'Alumne {code}', localTeacher: 'Accés docent local',
      roles: { administrador: 'Administració', profesor: 'Professorat', alumno: 'Alumnat' },
    },
    va: {
      home: 'Inici', homeLabel: 'Inici d’EduTicTac', publicHome: 'edutictac.es', nav: 'Compte EduTicTac',
      checking: 'Comprovant…', signIn: 'Entrar', unavailable: 'Sense connexió', retry: 'Tornar a provar',
      teacherLogin: 'Professorat', teacherLoginHint: 'Compte EduTicTac', studentLogin: 'Alumnat', studentLoginHint: 'Codi i PIN',
      dashboardTeacher: 'Tauler docent', dashboardStudent: 'Tauler de l’alumnat', account: 'Compte i contrasenya',
      logout: 'Eixir de la sessió', logoutConfirm: 'Vols tancar la sessió en totes les aplicacions d’EduTicTac?',
      logoutError: 'No s’ha pogut tancar la sessió.', student: 'Alumne {code}', localTeacher: 'Accés docent local',
      roles: { administrador: 'Administració', profesor: 'Professorat', alumno: 'Alumnat' },
    },
    es: {
      home: 'Inicio', homeLabel: 'Inicio de EduTicTac', publicHome: 'edutictac.es', nav: 'Cuenta EduTicTac',
      checking: 'Comprobando…', signIn: 'Entrar', unavailable: 'Sin conexión', retry: 'Reintentar',
      teacherLogin: 'Profesorado', teacherLoginHint: 'Cuenta EduTicTac', studentLogin: 'Alumnado', studentLoginHint: 'Código y PIN',
      dashboardTeacher: 'Panel docente', dashboardStudent: 'Panel del alumnado', account: 'Cuenta y contraseña',
      logout: 'Salir de la sesión', logoutConfirm: '¿Quieres cerrar la sesión en todas las aplicaciones de EduTicTac?',
      logoutError: 'No se ha podido cerrar la sesión.', student: 'Alumno {code}', localTeacher: 'Acceso docente local',
      roles: { administrador: 'Administración', profesor: 'Profesorado', alumno: 'Alumnado' },
    },
    en: {
      home: 'Home', homeLabel: 'EduTicTac home', publicHome: 'edutictac.es', nav: 'EduTicTac account',
      checking: 'Checking…', signIn: 'Sign in', unavailable: 'Offline', retry: 'Try again',
      teacherLogin: 'Teachers', teacherLoginHint: 'EduTicTac account', studentLogin: 'Students', studentLoginHint: 'Code and PIN',
      dashboardTeacher: 'Teacher dashboard', dashboardStudent: 'Student dashboard', account: 'Account and password',
      logout: 'Sign out', logoutConfirm: 'Sign out of every EduTicTac application?',
      logoutError: 'Could not sign out.', student: 'Student {code}', localTeacher: 'Local teacher access',
      roles: { administrador: 'Administration', profesor: 'Teacher', alumno: 'Student' },
    },
  };

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h5v-6h3v6h5V9.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    user: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 21v-1a8 8 0 0 1 16 0v1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  };

  function pageLang(element) {
    const own = element.dataset.lang;
    if (TEXT[own]) return own;
    const shared = window.commonsLanguage?.read?.();
    if (TEXT[shared]) return shared;
    const html = (document.documentElement.lang || '').toLowerCase();
    if (html.includes('valencia')) return 'va';
    const short = html.slice(0, 2);
    return TEXT[short] ? short : 'ca';
  }

  function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || '?').slice(0, 2);
    return letters.toUpperCase();
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === null || value === undefined || value === false) continue;
      if (key === 'text') node.textContent = value;
      else if (key === 'html') node.innerHTML = value; // només icones fixes d'este fitxer
      else node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of [].concat(children)) if (child) node.append(child);
    return node;
  }

  class EdutictacAccount extends HTMLElement {
    constructor() {
      super();
      this.state = null;
      this.status = 'checking';
      this.sequence = 0;
      this.onVisible = () => { if (document.visibilityState === 'visible') this.refresh(); };
      this.onLang = () => this.render();
      this.onOutside = event => {
        const details = this.querySelector('details');
        if (details?.open && !this.contains(event.target)) details.open = false;
      };
      this.onKey = event => {
        const details = this.querySelector('details');
        if (event.key === 'Escape' && details?.open) {
          details.open = false;
          details.querySelector('summary')?.focus();
        }
      };
    }

    connectedCallback() {
      document.addEventListener('visibilitychange', this.onVisible);
      document.addEventListener('click', this.onOutside);
      this.addEventListener('keydown', this.onKey);
      window.addEventListener('edutictac:langchange', this.onLang);
      window.addEventListener('edutictac:sessionrefresh', this);
      this.render();
      this.refresh();
    }

    disconnectedCallback() {
      document.removeEventListener('visibilitychange', this.onVisible);
      document.removeEventListener('click', this.onOutside);
      this.removeEventListener('keydown', this.onKey);
      window.removeEventListener('edutictac:langchange', this.onLang);
      window.removeEventListener('edutictac:sessionrefresh', this);
    }

    handleEvent(event) {
      if (event.type === 'edutictac:sessionrefresh') this.refresh();
    }

    get base() {
      return (this.dataset.base || '').replace(/\/+$/, '');
    }

    resolve(path) {
      if (!path) return null;
      return new URL(path, (this.base || location.origin) + '/').href;
    }

    get homeUrl() {
      if (this.dataset.home) return this.dataset.home;
      return this.base && new URL(this.base + '/').origin !== location.origin ? PUBLIC_HOME : '/';
    }

    async refresh() {
      const sequence = ++this.sequence;
      // En el mateix origen n'hi ha prou amb la ruta; fora, l'URL completa ha
      // d'estar entre els orígens de confiança de Commons o es torna a "/".
      const sameOrigin = !this.base || new URL(this.base + '/').origin === location.origin;
      const next = encodeURIComponent(sameOrigin ? location.pathname + location.search + location.hash : location.href);
      try {
        const response = await fetch(this.resolve('/api/auth/session?next=' + next), {
          credentials: 'include',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(String(response.status));
        const state = await response.json();
        if (sequence !== this.sequence) return;
        const before = this.state && JSON.stringify([this.state.authenticated, this.state.kind, this.state.role, this.state.display_name, this.state.public_code]);
        const after = JSON.stringify([state.authenticated, state.kind, state.role, state.display_name, state.public_code]);
        this.state = state;
        this.status = 'ready';
        this.render();
        if (before !== null && before !== after) this.announce();
      } catch {
        if (sequence !== this.sequence) return;
        this.status = 'offline';
        this.render();
      }
    }

    announce() {
      window.dispatchEvent(new CustomEvent('edutictac:sessionchange', { detail: this.state }));
    }

    async logout() {
      const t = TEXT[pageLang(this)];
      if (!window.confirm(t.logoutConfirm)) return;
      try {
        const response = await fetch(this.resolve(this.state?.links?.logout || '/api/auth/session/logout'), {
          method: 'POST',
          credentials: 'include',
          cache: 'no-store',
        });
        if (!response.ok) throw new Error(String(response.status));
      } catch {
        window.alert(t.logoutError);
        return;
      }
      this.state = { ...(this.state || {}), authenticated: false, kind: 'anonymous', role: null, display_name: null, public_code: null };
      this.announce();
      if (!('noReload' in this.dataset)) { location.reload(); return; }
      this.refresh();
    }

    label(t) {
      const s = this.state || {};
      if (s.kind === 'oidc') return s.display_name || s.username || t.roles[s.role] || t.signIn;
      if (s.kind === 'teacher') return t.localTeacher;
      if (s.kind === 'student') return t.student.replace('{code}', s.public_code || '');
      return t.signIn;
    }

    menuItem(href, text, hint) {
      if (!href) return null;
      return el('a', { class: 'eta-item', href, role: 'menuitem' }, [
        el('span', { text }),
        hint ? el('small', { text: hint }) : null,
      ]);
    }

    render() {
      const t = TEXT[pageLang(this)];
      const s = this.state || {};
      const links = s.links || {};
      const authed = this.status === 'ready' && s.authenticated;
      const wasOpen = this.querySelector('details')?.open;

      const nav = el('nav', { class: 'eta', 'aria-label': t.nav });
      const home = el('a', { class: 'eta-home', href: this.homeUrl, 'aria-label': t.homeLabel, title: t.homeLabel, html: ICONS.home });
      home.append(el('span', { class: 'eta-home__text', text: t.home }));
      nav.append(home);
      if (this.dataset.publicHome) {
        nav.append(el('a', { class: 'eta-home eta-home--public', href: this.dataset.publicHome, text: t.publicHome }));
      }

      const details = el('details', { class: 'eta-account', 'data-state': this.status, 'data-authenticated': authed ? 'true' : 'false' });
      const summary = el('summary', { class: 'eta-chip', 'aria-haspopup': 'menu' });
      if (this.status === 'checking') {
        summary.append(el('span', { class: 'eta-avatar', html: ICONS.user }), el('span', { class: 'eta-name', text: t.checking }));
      } else if (this.status === 'offline') {
        summary.append(el('span', { class: 'eta-avatar', html: ICONS.user }), el('span', { class: 'eta-name', text: t.unavailable }));
      } else if (authed) {
        const name = this.label(t);
        summary.append(
          el('span', { class: 'eta-avatar', text: s.kind === 'oidc' ? initials(name) : null, html: s.kind === 'oidc' ? null : ICONS.user }),
          el('span', { class: 'eta-who' }, [
            el('span', { class: 'eta-name', text: name }),
            el('span', { class: 'eta-role', text: t.roles[s.role] || '' }),
          ]),
        );
        summary.setAttribute('aria-label', `${name} · ${t.roles[s.role] || ''}`);
      } else {
        summary.append(el('span', { class: 'eta-avatar', html: ICONS.user }), el('span', { class: 'eta-name', text: t.signIn }));
      }
      if (!summary.hasAttribute('aria-label')) summary.setAttribute('aria-label', summary.textContent);
      summary.title = summary.getAttribute('aria-label');
      details.append(summary);

      const menu = el('div', { class: 'eta-menu', role: 'menu' });
      if (this.status === 'offline') {
        const retry = el('button', { type: 'button', class: 'eta-item', role: 'menuitem', text: t.retry });
        retry.addEventListener('click', () => { this.status = 'checking'; this.render(); this.refresh(); });
        menu.append(retry);
      } else if (authed) {
        const staff = s.role === 'profesor' || s.role === 'administrador';
        menu.append(...[
          staff ? this.menuItem(this.resolve(links.teacher), t.dashboardTeacher) : null,
          s.kind === 'student' ? this.menuItem(this.resolve(links.student), t.dashboardStudent) : null,
          s.kind === 'oidc' ? this.menuItem(links.account || this.dataset.accountUrl || null, t.account) : null,
        ].filter(Boolean));
        const out = el('button', { type: 'button', class: 'eta-item eta-item--logout', role: 'menuitem', text: t.logout });
        out.addEventListener('click', () => this.logout());
        menu.append(out);
      } else if (this.status === 'ready') {
        menu.append(...[
          this.menuItem(this.resolve(links.login || links.teacher), t.teacherLogin, t.teacherLoginHint),
          this.menuItem(this.resolve(links.student), t.studentLogin, t.studentLoginHint),
        ].filter(Boolean));
      }
      details.append(menu);
      // El menú s'obri cap a la dreta o l'esquerra segons on caben.
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        menu.dataset.align = 'end';
        if (menu.getBoundingClientRect().left < 8) menu.dataset.align = 'start';
      });
      if (wasOpen && this.status !== 'checking') details.open = true;
      nav.append(details);
      this.replaceChildren(nav);
    }
  }

  customElements.define('edutictac-account', EdutictacAccount);
})();
