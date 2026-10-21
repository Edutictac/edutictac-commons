# Catàleg Scratch del Rebost

Catàleg local: 61 imatges (40 personatges/disfresses, 10 fons i 11 objectes).
Conserva les 31 imatges inicials i incorpora un primer lot de 30 disfresses addicionals.
Pestanya pròpia **Catàleg Scratch / Catálogo Scratch**, separada de Catàleg EduTicTac
i de les biblioteques privades. Disponible al gestor i al selector que incrusta Blocs.
El catàleg mostra **31 fitxes agrupades** per al conjunt de les 61 imatges.
Cada personatge apareix una vegada amb el nombre de disfresses i el botó
**Veure disfresses / Ver disfraces**. En afegir-lo com a personatge nou a Blocs
es poden incorporar totes les disfresses de la família; l’editor de disfresses
i la revisió d’imatges pendents continuen permetent seleccionar una sola imatge.
No es generen programes ni animacions automàtiques: es programa amb els blocs habituals.

## Procedència i decisió de llicència

S'ha contrastat la selecció amb el catàleg oficial de Scratch GUI anterior a 2026,
revisió `fa7ed724dd3070486ccf12424bd633f95572bdfd`. Els SVG descarregats coincideixen
exactament amb els MD5 de les entrades d'eixa revisió; es registren també SHA-256.

- [Catàleg oficial històric de personatges](https://github.com/scratchfoundation/scratch-gui/blob/fa7ed724dd3070486ccf12424bd633f95572bdfd/src/lib/libraries/sprites.json).
- [Catàleg oficial històric de fons](https://github.com/scratchfoundation/scratch-gui/blob/fa7ed724dd3070486ccf12424bd633f95572bdfd/src/lib/libraries/backdrops.json).
- [Condicions oficials històriques, apartat 5.2](https://github.com/scratchfoundation/scratch-www/blob/9c8ef43dc4dc9276cd22d42c36bbf14d5d0db4d0/src/views/terms/terms.jsx): materials de suport sota CC BY-SA 2.0, amb excepcions de marques en 5.4–5.5.
- [Text legal CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/legalcode.en).

La decisió és distribuir esta selecció històrica sense marques sota la llicència
indicada per a eixos materials; no traslladar la llicència del codi a les imatges.
Es conserva l'atribució indicada en les condicions originals i el text íntegre de CC.
Les condicions de 2026 remeten a la llicència aplicable a cada material; no s'utilitzen
per atribuir una llicència universal a tota la biblioteca actual ni a pujades noves.

S'exclouen mascotes i logotips de marca, contingut de col·laboradors identificats com a
marques, fotografies, sons i la resta no revisada. Circles i Underwater 1 queden fora
perquè els SVG superen el límit de font de 256 KiB que admet l'adaptador de Blocs.
Els fitxers originals de Blocs i el proxy de Scratch es mantenen intactes.

El [registre de revisió](../services/id-api/assets/catalog-scratch/reviews/review.json)
conté URL de procedència, revisions, hashes dels documents i la correspondència exacta
entre nom original, disfressa, hash de Scratch i ID central de les 61 imatges.

## Distribució i seguretat

El paquet `services/id-api/assets/catalog-scratch/` conté PNG, miniatures, fonts SVG
originals i llicència. Es distribuïx una vegada amb la mateixa API; no requerix un servei
nou ni connexió amb Scratch durant l'ús. Les consultes continuen requerint una identitat
individual de Commons. Els originals són de només lectura.

El generador només descarrega recursos amb `--download`, des de les fonts públiques
fixades; no envia cookies, imatges de l'alumnat ni dades personals. Els documents de
procedència tenen SHA-256 fixats en el generador. Abans de renderitzar, comprova MD5,
elements i atributs SVG, estils i referències internes. Chromium té JavaScript i xarxa
desactivats. La declaració DTD estàndard d'un SVG antic s'elimina de l'arbre de renderitzat
sense resoldre-la; altres DTD i entitats es rebutgen. El renderitzat buit també es rebutja.
La font original només es descarrega com a adjunt amb CSP sandbox i nosniff.

Les ID centrals deriven de `scratch:<md5>.svg` i no del nom traduït. El [primer lot addicional revisat](../scripts/scratch-costume-batch.json) fixa 30
parelles família/disfressa, hash MD5, SHA-256, tipus i noms traduïts. Les fonts
coincidixen amb les entrades de les famílies en la mateixa revisió històrica;
la revisió visual en full de contacte confirma variants sense marques visibles.
El generador verifica la pertinença exacta i el SHA-256 abans de renderitzar.

La col·lecció API és
`collection=scratch`; `catalog` continua sent exclusivament el catàleg EduTicTac existent.
`GET /api/assets/v1/me` incorpora `scratch_catalog` i `scratch_items`, mantenint `catalog_items`
com el recompte EduTicTac. Els endpoints de contingut, còpia i llicència són els mateixos.

Guardar una còpia o editar-la conserva CC BY-SA 2.0, font i atribució; no les convertix en GPL.
Blocs conserva eixa informació en comentaris inerts del `.sb3`, tant en seleccionar com
en guardar un dibuix derivat al Rebost. La còpia privada continua disponible si es retira
l'original d'una futura versió del catàleg.

## Generació

```sh
python3 scripts/build-scratch-catalog.py --download
python3 scripts/build-scratch-catalog.py --check
python3 -m pytest -q tests/test_rebost.py tests/test_rebost_catalog.py tests/test_rebost_scratch.py
```

La generació usa Playwright/Chromium i Pillow, ja utilitzats per al catàleg propi.
No s'afegixen dependències d'execució ni APIs comercials. La memòria cau és una eina
de compilació; no és un magatzem d'imatges d'usuaris. Sense `--download`, una regeneració
només utilitza la memòria cau local. `--check` valida el paquet sense xarxa ni renderitzador.


## Verificació local (21-10-2026)

48 proves de Rebost/catàleg/Scratch aprovades, amb navegador es/va i context tàctil.
Regeneració repetida idèntica i validació de tots els hashes. En Blocs, 261 proves
unitàries aprovades; compilació de producció correcta i sense errors nous d'ESLint
en els dos adaptadors modificats. Les proves de navegador es/ca seleccionen Ratpenat
i Hivern, executen moviment i reobrin el `.sb3` sense sessió conservant CC BY-SA 2.0.
La regressió de disfresses i importació IA també passa en els dos idiomes.

Docker verifica les dos col·leccions sense xarxa i amb volum temporal: còpia privada
i font/llicència GPL i CC continuen disponibles després de reiniciar. La comprovació
de l'entorn local instal·lat valida 51 + 31 entrades, HTTP 200 i protecció 401 sense sessió.
Les proves tàctils automatitzades no substituïxen la prova manual en una tauleta física.

Activació local amb còpia prèvia SQLite i imatges de retorn preservades. Es recreen
només API, portal i Blocs; no es canvien comptes, Authentik ni les seues dades.
Sense push ni publicació d'imatges en el registre.


La revisió de la resta es pot accelerar amb [classificació automàtica i lots](rebost-scratch-audit.md), sense confondre una coincidència històrica amb una aprovació.


## Primer lot de disfresses addicionals (21-10-2026)

Les 30 imatges afegides són variants de Ratpenat, Os, Papallona 1 i 2, Cranc,
Dinosaure, Gos, Peix, Marieta 2, Polp, Lloro, Conill, Pilota i Llapis.
S'han verificat l'original històric, el nom exacte de disfressa i els hashes;
revisió visual del full de contacte sense marques visibles i mateixa evidència
de llicència CC BY-SA 2.0 que les famílies inicials. Els SVG i els crèdits es
conserven; no s'atribuïx una llicència nova als recursos.

El sanejament de compilació admet també polilínies i atributs gràfics inerts
necessaris per a estes fonts, i elimina metadades d'edició Paper.js de l'arbre
renderitzat després de validar-ne el JSON. La font descarregable queda intacta.
Scripts, HTML, referències externes, CSS actiu, entitats i DTD no autoritzats
continuen rebutjats; les pujades d'usuaris continuen sense acceptar SVG.

Una prova de regressió fixa els 31 registres inicials, inclosos nom, aliases,
ID, revisió i hashes de PNG/miniatura/SVG. La prova de Blocs incorpora
Ratpenat (2) com a segon vestit del mateix personatge, executa el bloc de
següent disfressa i comprova el guardat/reobertura del `.sb3` amb CC i fonts.


Validació del lot: **21 proves** Scratch/gestor/auditoria aprovades, regeneració
del paquet de 61 imatges idèntica i verificació de hashes correcta. Navegador
Blocs es/ca amb rató/context tàctil i prova de persistència Docker sense xarxa
aprovats. Activat en local recreant només `id-api`, amb instantània SQLite
privada i imatge anterior preservades. API instal·lada: 61 imatges (40 sprites,
10 fons, 11 objectes); HTTP 200 en salut, gestor i editor, i 401 sense sessió
en la col·lecció privada. Queden 888 imatges externes pendents de revisió.
Sense commit ni push d'esta ampliació.


## Agrupació per personatge (21-10-2026)

L'agrupació usa el nom original verificat en `reviews/review.json` i una imatge
principal existent. No elimina números dels noms per deduir famílies: Papallona 1
i Papallona 2, per exemple, continuen sent personatges diferents. Les ID, revisions
i fitxers de les 61 imatges es conserven; les biblioteques privades no s'agrupen.

- `GET /api/assets/v1/items?collection=scratch&grouped=true` retorna fitxes principals.
  La cerca també troba noms i aliases de les disfresses. Paginació per ID principal.
- `GET /api/assets/v1/items/{id_principal}/family` retorna `rebost-asset-family` v1,
  membres ordenats, noms, recompte i revisió conjunta. Requerix identitat individual;
  les ID privades, desconegudes o d'una disfressa no principal reben 404.
- La llista sense `grouped` conserva les 61 imatges individuals. `/me` afegix
  `asset_families` i `scratch_families`; `scratch_items` continua sent 61.

La interfície mostra una miniatura per família i permet veure i seleccionar
cada disfressa. Copiar a Mis imágenes continua sent una còpia individual.
El selector només oferix afegir la família completa si el consumidor anuncia
`supports_families=1&selection=sprite`. El missatge manté el protocol existent
i només afegix `family:true` i `familyRevision`; no transporta imatges ni tokens.
Els clients anteriors continuen triant una sola imatge.

Blocs comprova origen, finestra i petició, consulta la família i tots els seus
membres, valida revisions i límits i prepara un únic personatge natiu amb tots
els vestits abans d'afegir-lo. No modifica cap personatge existent ni crea
programes importats. Les fallades de lectura o descodificació no importen
una família parcial. Es revalida el projecte de destinació abans de l'alta.
Cada disfressa conserva font i llicència en el `.sb3`, també sense sessió.

Es conserven els centres de rotació originals, compensant el desplaçament
i l'escala del viewBox en rasteritzar. Això manté la referència de les poses
en executar «següent disfressa». Els centres es guarden com a metadades de
revisió, es validen i formen part de la revisió conjunta de la família.
El fitxer del projecte conserva els centres natius amb la resolució bitmap.

La biblioteca i el contracte són compartits. Un futur adaptador de Books pot
triar una imatge individual sense haver d'incorporar un personatge animat.
No s'implementa Books en esta entrega ni s'afegixen serveis o dependències.


Verificació de l'agrupació: 273 proves unitàries de Blocs aprovades, compilació
de producció i ESLint dels mòduls modificats correctes. Regressió Commons
(66 proves) i comprovacions finals de famílies/centres/gestor aprovades, inclosos
els dos idiomes i context tàctil. Navegador Blocs: importació d'un personatge
amb quatre disfresses, selecció individual des de Disfresses, bloc següent
disfressa, guardat `.sb3` i reobertura anònima amb centres i crèdits conservats.
Regressió de la revisió IA i de projectes existents aprovada. Docker comprova
31 famílies, 61 imatges, revisió conjunta i centres idèntics després de reiniciar.

Activat en l'entorn local: API, portal i Blocs actualitzats amb còpia SQLite i
imatges anteriors preservades; comptes i Authentik intactes. HTTP 200 en salut,
gestor i editor, i 401 sense sessió per a la consulta agrupada. La comprovació
tàctil automatitzada no equival a una validació manual en un iPad físic.
Sense commit ni push de l'agrupació.
