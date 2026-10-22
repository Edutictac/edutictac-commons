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

## Revisió docent implementada

La frontera d’identitat és `GET /api/play/access` en ID API: reutilitza les
sessions individuals i la revocació del Rebost/Llibres, la regla comuna
propietari/col·laborador d’aula i les identitats pseudònimes actives. Una galeta
OIDC d’alumnat sense aula comprovada o un token tècnic no permeten revisar.
L’administració conserva la mateixa moderació d’aules que Llibres.

Play incorpora `/api/publication/me`, `/api/submissions/{id}` i `/api/reviews`.
L’alumnat només pot enviar una activitat seua a la seua aula. El servidor força
visibilitat privada per a les activitats de l’alumnat, encara que el JSON demane
`public`. Les previsualitzacions autenticades també són privades. En Commons
integrat, guardar requerix sessió; el mode autònom/demo conserva el seu ús
anònim i la caducitat existent. Les activitats antigues no canvien de visibilitat.

La revisió es guarda en el JSON existent de l’activitat, sense nova base de dades.
Els guardats són atòmics i les decisions/borrats se serialitzen en el servidor
ThreadingHTTPServer actual. Cada guardat de l’editor continua creant una còpia
amb ID nou, com abans; el contingut enviat és immutable. Les decisions exigixen
la revisió esperada. Repetir una aprovació confirmada és idempotent; una decisió
antiga no pot sobreescriure’n una altra. La ruta de publicació directa docent
només accepta activitats pròpies i no pot eludir una revisió d’alumnat.

El docent pot reproduir la còpia privada, tornar-la amb un comentari obligatori,
aprovar-la i publicar-la, o retirar una publicació aprovada. Abans d’aprovar es
revalida també que l’alumne seguisca actiu en l’aula; retirar continua possible
si l’alumne ja no hi és. La publicació es fa amb l’adaptador servidor-a-servidor
existent del banc; només després d’una resposta de publicació correcta es marca
aprovada i pública. Si el banc falla, continua pendent i privada. La retirada
la torna a deixar privada. No es poden borrar còpies aprovades sense retirar-les.
Les capçaleres de publicació no inclouen identitat docent/alumne i el payload
públic exclou propietat i metadades de revisió.

La biblioteca pública de Recursos manté la seua protecció i ara accepta els
13 tipus de Play. Els URL publicats respecten tant `/play` com una instal·lació
en l’arrel. No es torna a crear un catàleg separat de treballs aprovats.

## Proves del flux

- 52 proves de navegador en escriptori/mòbil, incloses les 36 amb H5P real.
- 34 proves Python d’exportació, permisos de l’aula i flux HTTP de revisió:
  denegació entre alumnes/aules, revocació, revisió concurrent, devolució,
  reenvió, retirada, errors del banc, CSRF, privacitat i publicació pròpia docent.
- Recursos API: 24 proves d’ingesta, inclosos tots els tipus, reintents
  idempotents i rebuig de tipus desconeguts.

Els tests de revisió executen el servidor Play real amb identitat i banc de
proves aïllats. Les regles d’aula es proven contra ID API i SQLite temporal.
No es creen treballs ni comptes personals en la instal·lació real.

El pas de la demo de `edutictac.es/play/` a producció requerix decidir on viuen
les aules i les sessions: el VPS de la demo no tenia ID API/Commons. No n’hi ha
prou amb retirar l’avís. Queda pendent la resposta de l’usuari sobre Commons
central o revisió en el Commons de cada centre; no es desplega al VPS mentre
esta decisió d’identitat no estiga resolta.
