import {portalBuild} from './vite.portal.shared.mjs';

// Paquet autònom (porta Vue dins) perquè també el carreguen llocs sense Vue.
// És un script clàssic: els llocs externs el carreguen amb `defer`.
const config = portalBuild('services/portal/src/account/main.js', 'account-widget.js');
config.build.lib.formats = ['iife'];
config.build.lib.name = 'EdutictacAccount';
export default config;
