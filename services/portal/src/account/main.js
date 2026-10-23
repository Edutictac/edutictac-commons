/* Xip de compte, enllaç d'inici i selector de tema comuns a EduTicTac.
 *
 * Ús (també en llocs sense Vue: el paquet porta Vue dins):
 *   <script src="https://commons.edutictac.es/assets/theme-preference.js"></script>
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
 *   data-home-only    només l'enllaç «Inici»: no consulta ni mostra cap sessió.
 *   data-density      "compact" per a barres baixes.
 *
 * Només mostra la sessió: no protegix cap contingut. Emet
 * `edutictac:sessionchange` (detail = estat) quan canvia i escolta
 * `edutictac:sessionrefresh` per a tornar-la a consultar.
 */
import {defineCustomElement} from 'vue';
import AccountWidget from './AccountWidget.ce.vue';

// El mateix script carrega el seu CSS: les pàgines no necessiten un <link> en el
// <head>, que bloquejaria el primer pintat si Commons tarda o no respon.
const source = document.currentScript?.src;
const linked = [...document.querySelectorAll('link[rel=stylesheet]')].some(link => /\/account-widget\.css(\?|$)/.test(link.href));
if (source && !linked) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('account-widget.css', source).href;
  css.dataset.edutictacAccount = '';
  document.head.appendChild(css);
}

if (!customElements.get('edutictac-account')) {
  // Sense shadow DOM: els estils viuen en account-widget.css i hereten les
  // variables de color de cada pàgina.
  customElements.define('edutictac-account', defineCustomElement(AccountWidget, {shadowRoot: false}));
}
