/* Inserció d'una línia per a apps estàtiques d'EduTicTac (Robotics, EduMúsic,
 * jocs…). Carrega el xip de compte de Commons (component Vue) i el fixa en una
 * cantonada, sense tocar l'HTML de l'app:
 *
 *   <script src="https://commons.edutictac.es/assets/account-embed.js"
 *           data-mode="account" data-position="top-right" defer></script>
 *
 * data-mode      account (xip complet, per defecte) | home (només «Inici», sense sessió)
 * data-position  top-right (per defecte) | top-left | bottom-right | bottom-left
 * data-home      destí de «Inici» (per defecte https://edutictac.es/)
 * data-lang      ca | va | es | en; si falta, segueix la pàgina
 * data-hide-when selector CSS: el xip s'amaga mentre la pàgina el complix (p. ex. el
 *                mode presentació de Robotics, ".app.presentation"); també en pantalla completa
 *
 * Commons ha d'admetre l'origen exacte de l'app en EDUTICTAC_ID_ALLOWED_ORIGINS
 * (no s'admeten comodins de subdomini). Només mostra la sessió.
 */
(function () {
  'use strict';
  var script = document.currentScript;
  if (!script || document.getElementById('edutictac-account-embed')) return;
  var base = new URL(script.src).origin;
  var mode = script.getAttribute('data-mode') === 'home' ? 'home' : 'account';
  var positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
  var position = positions.indexOf(script.getAttribute('data-position')) >= 0
    ? script.getAttribute('data-position') : 'top-right';

  var hideWhen = script.getAttribute('data-hide-when') || '';
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = base + '/assets/account-widget.css';
  css.setAttribute('data-edutictac-account', '');
  document.head.appendChild(css);

  function mount() {
    var slot = document.createElement('div');
    slot.id = 'edutictac-account-embed';
    slot.className = 'eta-embed eta-embed--' + position;
    var widget = document.createElement('edutictac-account');
    widget.setAttribute('data-base', base);
    widget.setAttribute('data-density', 'compact');
    widget.setAttribute('data-no-reload', '');
    if (mode === 'home') widget.setAttribute('data-home-only', '');
    ['data-home', 'data-lang'].forEach(function (name) {
      if (script.hasAttribute(name)) widget.setAttribute(name, script.getAttribute(name));
    });
    slot.appendChild(widget);
    document.body.appendChild(slot);
    // Algunes apps reescriuen tot el <body> en arrancar (Blockly Games fa
    // body.innerHTML = …): si el xip desapareix, es torna a posar tal qual.
    function sync() {
      if (!slot.isConnected && document.body) document.body.appendChild(slot);
      var hidden = !!document.fullscreenElement;
      if (!hidden && hideWhen) {
        try { hidden = !!document.querySelector(hideWhen); } catch (error) { hideWhen = ''; }
      }
      slot.hidden = hidden;
    }
    // Les classes només s'observen si l'app demana amagar-lo en algun mode.
    new MutationObserver(sync).observe(document.documentElement, hideWhen
      ? {childList: true, subtree: true, attributes: true, attributeFilter: ['class']}
      : {childList: true, subtree: true});
    document.addEventListener('fullscreenchange', sync);
    sync();
    var loader = document.createElement('script');
    loader.src = base + '/assets/account-widget.js';
    loader.defer = true;
    document.head.appendChild(loader);
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
