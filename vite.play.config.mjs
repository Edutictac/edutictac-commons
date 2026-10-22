import {portalBuild} from './vite.portal.shared.mjs';
const config=portalBuild('services/play/src/main.js','play-ui.js');
config.build.outDir='services/play/public/assets/ui';
export default config;
