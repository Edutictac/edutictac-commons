# Play en Vue i publicació supervisada

## Arquitectura inspeccionada

`services/play` és un servidor Python independent amb activitats en JSON i
biblioteques H5P locals. `playcore` separa configuració, validació, catàleg,
emmagatzematge i exportació. El frontend anterior creava camps amb DOM i
redefinia funcions per cada tipus; restaurava diverses activitats amb temporitzadors.

La migració incorpora `services/play/src`: `PlayApp.vue`, `ActivityFields.vue`,
`CompoundStep.vue`, `usePlay.js`, `model.js`, `commons.js` i `H5PPlayer.vue`.
El model de formulari és explícit; la hidratació no usa temporitzadors. Els
13 tipus existents continuen disponibles, inclosos reptes i còpies del banc.
Els camps i classes es conserven per a les proves i els estils actuals.

Les traduccions addicionals disperses es reunixen en els JSON d’idioma existents.
El selector VA reutilitza la variant valenciana que Play ja tenia en `ca`,
sense canviar el codi d’idioma H5P. Canviar idioma conserva els esborranys.
Vue interpola títols i notes com a text, sense HTML de formularis dinàmic.
Les imatges de memòria, relacions i classificació conserven la conversió WebP
local i els límits del servidor; es restauren amb les activitats guardades.

`H5PPlayer.vue` manté h5p-standalone, biblioteques, rutes de paquets i xAPI.
Retira listeners i el resize del crucigrama quan canvia d’activitat. El pont
Commons conserva tokens de llançament, assignment/context, resultats, idempotència
i la cua local de reintents. Favorits, identitats i notes no es dupliquen.

La biblioteca, classificació controlada, previsualització, descàrrega i
publicació/retirada usen els contractes existents. El token administratiu antic
es retira de localStorage en recuperar-lo i queda només en memòria; es neteja
en navegar. La clau de creador continua amb el seu emmagatzematge i significat.
No s’exposen credencials en registres o captures.

## Compilació i primera verificació

`npm run build:play` reutilitza Vite/Vue ja presents i genera el bundle estàtic
`services/play/public/assets/ui/play-ui.js`. `build:portal` també l’inclou; CI
comprova el bundle i executa `test:play`. El service worker passa a shell-v15
i inclou el nou bundle. Node no és necessari en el contenidor Python.
La llicència MIT de Vue es distribuïx amb el bundle i es mantenen els avisos
d’H5P i les altres biblioteques en `services/play/NOTICES.md`.

Les **36 proves de navegador existents** passen en escriptori/mòbil amb servidor
Python i H5P reals: tots els tipus, reptes, còpia del banc, crucigrama responsive,
guardat, biblioteca/borrat i resultats xAPI amb cua. Les dades són temporals;
no es creen activitats en la instal·lació de treball.

## Nou objectiu acordat

L’usuari demana que Play deixe de ser una demo després d’incorporar el flux de
Llibres: l’alumnat envia una activitat privada al seu docent, i només una
aprovació del docent de l’aula la publica en el Banc de Recursos. El docent
conserva la publicació directa de les seues activitats. La migració Vue continua
amb este requisit; el desplegament de producció es farà després de comprovar el
flux i l’entorn real, sense convertir activitats privades existents en públiques.
