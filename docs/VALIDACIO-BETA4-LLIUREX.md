# Validació de beta4 en LliureX

Data: 24 d’octubre de 2026. Imatges finals: `0.1.1-beta4`, conjunt C7.
La publicació en APT i la web de descàrrega continua pendent.

## Entorn i paquet

- LliureX 23 estàndard: docent amb 5 GB i 4 CPU; alumnat amb 1,5 GB i 2 CPU.
- No s’han modificat N4D, Epoptes ni el tallafoc de LliureX.
- Instal·lador amd64: `edutictac-commons_0.1.1~beta4_amd64.deb`.
- Font del paquet: `ca95f3d3829e7c6f7391115a26d7aceb51e3f3ee`.
- Mida: 5.880.412 bytes.
- SHA-256: `442643b5cc2f631a2b01ad332ffe557be7ded78b2d1a65199a2afcfab1649852`.
- Les 13 imatges estan fixades en [el manifest de beta4](../releases/0.1.1-beta4/images.json).

S’ha provat l’actualització conservant dades sobre una còpia del sistema
anterior i, després, una instal·lació neta C5. Les correccions C6 i el peu C7 s’han
instal·lat sobre eixa instal·lació amb el paquet i el mecanisme normal
d’actualització d’imatges. C5, C6 i C7 compartixen els mateixos scripts
d’instal·lació, Compose i configuració inicial; canvien el backend de pujada,
els peus de Portal i Llibres, els manifests, les proves i la documentació. No s’ha repetit una
instal·lació neta completa després d’estes actualitzacions.

## Resultats natius

| Comprovació | Resultat |
| --- | --- |
| Actualització del paquet i actualització normal d’imatges | Correctes; configuració i secrets conservats, excepte el descobriment automàtic de MAC |
| Instal·lació neta, activació i primer reinici | Correctes; sis mòduls activats des de la interfície |
| Imatges en execució | Les 13 coincidixen amb el manifest final C7 |
| Blocs | Imatges de Rebost, disfresses, moviment, guardat i reobertura correctes |
| Llibres | Rebost, dibuix, guardat, reobertura i lectura correctes |
| Publicació supervisada | L’alumnat envia un llibre; el docent l’aprova; es llig sense sessió |
| Xip docent | Compte, idioma i preferències en Commons, Rebost, Play, Llibres i Banc correctes |
| Xip d’alumnat en Banc | Codi/PIN reconeguts, Inici local, favorits persistents i eixida compartida correctes |
| Fitxers d’aula | Carpetes compartides, descàrrega, entrega privada i revisió docent correctes |
| Aïllament | Un altre alumne no pot llegir ni eliminar una entrega privada |
| Límits | Canvi en viu sense reiniciar; pujada excessiva rebutjada amb 413 i sense guardar-la |
| Persistència en actualitzar C6 | Aules, identitats i fitxers conservats |
| Còpia completa del servidor | Creació i verificació correctes, sense avisos |
| Restauració real | Material eliminat abans de restaurar; bytes compartits i privats recuperats i comprovats des dels dos equips |
| Reinici i Quiosc | Docent i alumnat reiniciats; bytes i llibre conservats; Quiosc real obri, tanca i neteja el perfil temporal |

El peu final C7 s’ha comprovat en les huit pàgines de Commons i en Llibres,
amb la versió beta4 correcta. Després de restaurar, Quiosc queda desactivat per
disseny i s’ha reactivat des d’Administració abans de la prova real.

El compte de l’alumnat continua usant codi i PIN; no s’ha substituït per OIDC.
Les còpies del laboratori es conserven en discs separats. El punt de recuperació
d’actualització està també xifrat en el NAS, amb lectura, desxifrat,
descompressió i hash verificats.

## Revisió i proves automàtiques

- Web actual, amb les maquetes de taulers retirades: 60 proves de navegador.
- Portal amb el peu compartit: 362 proves; Llibres: 29 proves de peu, idioma, biblioteca i Vue.
- Banc: 98 proves de navegador, 5 del service worker i 4 d’empaquetat.
- API de Banc: 133 proves, inclosa la denegació de funcions docents a OIDC d’alumnat.
- Sessió central de Commons: 29 proves; instal·lador: 9.
- Correcció de pujada: 38 proves de fitxers, permisos, límits, proxy i còpies.
- Docker real: sessió compartida, navegació i eixida del xip, origen local i
  errors 413 amb mida coneguda i per fragments; cap arxiu rebutjat guardat.
- Paquet final: hash, exclusió de rutes privades i 13 referències verificats.

Les comprovacions anteriors de Portal, Play, Blocs i Llibres estan detallades
en [la preparació C3](VALIDACIO-BETA4-PREPARACIO.md); els canvis posteriors i les
seues proves es registren en les candidates [C4](../releases/0.1.1-beta4-candidate4/README.md),
[C5](../releases/0.1.1-beta4-candidate5/README.md) i [C6](../releases/0.1.1-beta4-candidate6/README.md) i
[C7](../releases/0.1.1-beta4-candidate7/README.md).

## Incidències resoltes i límits de la validació

La revisió ha corregit l’origen públic del xip en Docker local, la comprovació
del rol docent en Banc i la conversió involuntària de 413 a 502 en pujades
rebutjades. La correcció del proxy s’ha comprovat també des de l’equip
d’alumnat, sense guardar el fitxer excessiu ni ampliar el límit de la resta d’API.

La primera prova de navegador del formulari d’accés docent esgotà el termini;
es comprovà el formulari i la repetició focalitzada completà l’accés i l’activació,
sense modificar l’aplicació. No es declara una validació física en tauleta.
No s’han desplegat canvis en els serveis de producció durant esta preparació.
