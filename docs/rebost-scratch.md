# Catàleg Scratch del Rebost

Primera selecció local: 31 imatges (15 personatges, 10 fons i 6 objectes).
Pestanya pròpia **Catàleg Scratch / Catálogo Scratch**, separada de Catàleg EduTicTac
i de les biblioteques privades. Disponible al gestor i al selector que incrusta Blocs.
No és una còpia completa de la galeria de Scratch: inicialment incorpora només la primera
disfressa dels personatges seleccionats, sense sons ni animacions.

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
entre nom original, hash de Scratch i ID central de les 31 imatges.

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

Les ID centrals deriven de `scratch:<md5>.svg` i no del nom traduït. La col·lecció API és
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
