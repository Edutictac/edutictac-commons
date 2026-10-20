# Revisió de Rebost i funcionalitats existents de Blocs

20-10-2026. Auditoria local del codi i prova Chromium. La centralització continua pendent.
En l’auditoria inicial no es va retirar cap funcionalitat ni dada; vegeu al final la neteja aplicada posteriorment.

## Conclusió

Prioritzar el Rebost central abans de consolidar un gestor/editor paral·lel dins de Blocs.
Blocs ja incorpora la major part de les operacions gràfiques proposades. La novetat útil és
una biblioteca entre aplicacions amb identitat, permisos i persistència comuns, i el suport
per a descripcions/imatges pendents en projectes generats amb IA.

## Comparació comprovada

Les rutes de codi següents corresponen al repositori `edutictac-blocs`.

| Operació | Ja existent en Blocs | Aportació del prototip Rebost i decisió proposada |
|---|---|---|
| Pujar personatge o fons | `sprite-selector.jsx`, `stage-selector.jsx` i els seus contenidors: catàleg, fitxer i dibuix. | Duplica una entrada de fitxers. Integrar la font central en els selectors habituals. |
| Dibuixar i editar | `paint-editor-wrapper.jsx` usa `scratch-paint` i guarda SVG/bitmap en la VM. | Un segon editor no aporta una capacitat necessària dins de Blocs. Reutilitzar Disfresses/Fons. |
| Girar i redimensionar proporcionalment | `scratch-paint/src/helper/selection-tools/{bounding-box-tool,rotate-tool,scale-tool}.js`. Les cantonades mantenen proporcions sense Shift. | Els controls nous de gir a 90° i escala percentual simplifiquen operacions que ja existixen. No justifiquen un editor addicional. |
| Posició i grandària en escena | `src/containers/target-pane.jsx`, `postSpriteInfo`. | Ja existent; diferenciar transformar píxels de canviar grandària del personatge. |
| Transparència | `scratch-paint/src/helper/layer.js` dibuixa la quadrícula de transparència. | Vista repetida en el prototip. |
| Retallar | Selecció i edició bitmap; ajust dels límits transparents en `scratch-paint/src/helper/bitmap.js`. | El prototip afegeix un retall percentual simètric dels quatre marges. No s’ha trobat un control natiu equivalent amb eixe mateix flux; tampoc és un retallador de rectangle lliure. Diferència limitada, insuficient per a justificar el panell complet. |
| Reanomenar, duplicar, eliminar i descarregar | `costume-tab.jsx`, `paint-editor-wrapper.jsx`, `target-pane.jsx`. | Operacions de projecte ja existents. Gestionar entrades d’una biblioteca central és un àmbit diferent i sí que les necessita en la seua pàgina pròpia. |
| Reutilitzar entre projectes | Motxilla local: `tw-local-backpack-api.js`, IndexedDB `TW_Backpack`; activada en `render-interface.jsx`. | El prototip crea un segon IndexedDB d’imatges i una API privada exclusiva de Blocs. Cap dels dos equival a una biblioteca central Commons. Mantindre la motxilla: també admet sprites, so i programes. |
| Imatges pendents de la IA | JSON v3, marcadors i vinculació del prototip. | Aportació diferenciada a conservar, sense exigir passar per un gestor/editor duplicat. |

## Dos catàlegs separats i una incidència local

Els botons d’afegir personatge i fons obrin les biblioteques natives (`sprite-library.jsx`,
`backdrop-library.jsx` i JSON en `src/lib/libraries`). No consulten la nova biblioteca privada
ni el Rebost central futur. La integració del prototip només entra des de Fitxer → Rebost.

A més, la vista local del port 18613 s’estava servint amb `python -m http.server`.
Les dades del catàleg es carregaven, però els bytes demanats en `/scratch-assets/` retornaven
404 perquè faltava el proxy nginx. El fons Arctic va reproduir el 404. No era una regressió
del catàleg del desplegament ni un problema dels botons de producció.

Correcció local: mateixa build, mateixa adreça i mateix origen, servits amb la plantilla nginx
existent i la imatge base ja disponible. Contenidor temporal `blocs-rebost-preview`, sense
modificar Compose ni altres serveis. Prova Chromium amb els botons natius: afegir Abby i Arctic,
comprovar els recursos reals carregats i respostes 200 del proxy del mateix origen.
No s’han enviat imatges privades; només recursos del catàleg públic pel proxy existent.

## Direcció proposada

1. Construir contracte, identitat, emmagatzematge privat i gestor central en Commons.
2. Preparar el catàleg comú amb procedència i llicències verificades, sense donar per fet que
   els bytes dels catàlegs Scratch ja estan empaquetats en el repositori.
3. Afegir **Tria del Rebost** als punts habituals d’afegir personatge, disfressa i fons;
   afegir **Guarda al Rebost** des de Disfresses/Fons. Evitar un segon recorregut per Fitxer.
4. Conservar JSON v3 i la vinculació d’imatges pendents, v1/v2 i els projectes `.sb3`.
5. Substituir el gestor provisional de Blocs per l’adaptador central, amb migració explícita
   de les imatges existents. No esborrar IndexedDB, API o dades de prova per a netejar la interfície.
6. En el MVP central no crear un altre editor gràfic. Les transformacions opcionals de la
   pàgina central es reconsideraran per necessitats de les altres aplicacions; normalització
   i validació de seguretat continuen sent obligatòries.

El contingut central ha de conservar dimensions i proporcions independents de Blocs.
Actualment `src/assets/library.js` normalitza els recursos de tipus fons a 480 × 360 en guardar:
esta decisió del prototip no ha de traslladar-se a Commons. L’ajust a l’escenari correspon a
l’adaptador consumidor; Books i altres mòduls poden necessitar altres dimensions.

La proposta inicial precedix les dos entregues locals posteriors: nucli central privat
(documentat en `rebost.md`) i neteja de Blocs (descrita a continuació).

## Aplicació de la neteja (20-10-2026)

Retirats del codi de Blocs l’entrada Fitxer → Rebost, el diàleg i el panell/editor duplicat.
La revisió de JSON IA conserva un selector de fitxer per recurs declarat, sense biblioteca ni
controls de transformació. Es conserva la lectura d’imatges antigues i no s’han eliminat
IndexedDB, taules, BLOBs o projectes. La connexió als controls natius de Blocs es farà quan
s’integre el Rebost central; esta neteja no anuncia una integració encara inexistent.
