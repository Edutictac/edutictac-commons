import {portalBuild} from './vite.portal.shared.mjs';
const config=portalBuild('admin/src/main.js','admin-ui.js');
config.build.outDir='admin/public/assets';
export default config;
