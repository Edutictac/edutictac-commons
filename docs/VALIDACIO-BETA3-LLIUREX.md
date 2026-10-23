# Validació de Commons beta3 en LliureX

Validació completada el 24 d’octubre de 2026 en l’aula virtual LliureX 23.
Professor: 5 GB de RAM i 4 CPU; alumnat: 1,5 GB i 2 CPU. Els navegadors de
prova s’executen com a usuari `lliurex`, no com a root.

## Artefacte validat

- Paquet exacte: `edutictac-commons_0.1.1~beta3_amd64.deb`, 5.828.392 bytes.
- SHA-256: `c6c604ff90ce594c1df8c42a9415f281a618ace7e1d3acc3b3950de8f41bffff`.
- Font del paquet: `a369420`; les revisions posteriors d’esta preparació
  documenten la validació i el manual, sense canviar eixe artefacte.
- Imatges: `0.1.1-beta3`, 13 referències amd64 fixades en
  [el manifest](../releases/0.1.1-beta3/images.json). Totes coincidixen amb
  les imatges reals de la instal·lació neta.
- Paquet amb descàrrega d’imatges per Internet, sense imatges incorporades.
- Les imatges pròpies estan al registre; la publicació APT signada i el canvi
  de la pàgina pública de descàrrega continuen pendents.

## Resultats

| Comprovació | Resultat |
| --- | --- |
| Python complet | 538 correctes, 2 omeses; 4 avisos |
| Navegador del portal | 294 correctes |
| Play | 58 de navegador correctes i service worker correcte |
| Compilació dels cinc clients | Sense diferències en els bundles versionats |
| Artefactes | Paquet i imatges noves sense fitxers locals o credencials |
| Instal·lació Docker aïllada amb editors | Instal·lació, fluxos, còpia i restauració correctes |
| Actualització real del paquet i les imatges | Correcta; configuració i treballs anteriors conservats |
| Instal·lació neta del paquet exacte | Correcta, sobre la base LliureX immutable |
| Activació i selector dels sis mòduls | Correctes des del navegador docent |
| Blocs i Rebost | Personatge amb quatre disfresses, moviment i guardar/reobrir correctes |
| Llibres i Rebost | Imatge, dibuix, guardar/reobrir i lectura correctes |
| Publicació de l’alumnat | Enviament, aprovació docent i lectura pública correctes |
| Fitxers d’aula | Carpeta compartida, entrega privada i lectura docent correctes |
| Aïllament entre alumnes | Un segon alumne no pot llegir ni eliminar l’entrega real del primer |
| Proxy de pujades | Fitxer d’aula de 2 MiB admés; JSON de 2 MiB en l’API ordinària rebutjat |
| Còpia i restauració natives | Manifest complet verificat; fitxer eliminat recuperat amb el contingut exacte |
| Reinici de professor i alumnat | Fitxers, llibre aprovat i accés als sis mòduls conservats |
| Quiosc real després del reinici | Sessió iniciada, finalitzada i perfil temporal netejat |
| Salut final | 13 serveis actius i saludables, sense reinicis de contenidor |
| Manual web | Mòbil i escriptori, ca/va/es, enllaç al manual, copiar ordre i ajuda correctes |

L’actualització del paquet conserva els tags previs fins que s’actualitzen les
imatges des del panell. El nou comparador detecta la beta3 final com a posterior
a les candidates. La preparació normal de Quiosc pot recalcular
`QUIOSC_SERVER_MACS`; no s’exigix igualtat byte a byte de tot l’`.env`.

Després de restaurar, Quiosc queda desactivat com està previst. Es va reactivar
pel selector ordinari abans de provar el reinici. També es van repetir amb èxit
els fluxos instal·lats `test-flow.sh`, `test-recursos-flow.sh`,
`test-teacher-resources-flow.sh` i `test-eduhoot-flow.sh`.

## Còpies de l’aula de prova

Abans de començar la instal·lació neta, es va apagar l’aula i conservar la capa
anterior de només lectura. Còpia xifrada al NAS verificada per checksum i per
lectura, desxifrat i descompressió complets, sense crear un altre disc temporal
local. La base immutable de LliureX es conserva. Les ferramentes temporals de
navegador de l’alumnat s’han retirat; es mantenen els llibres i perfils.

## Abast i límits

- La prova d’actualització real comença en la beta2 instal·lada. No s’ha assajat
  l’alpha26 exacta anunciada anteriorment a la web.
- El primer inici del servei d’accés pot necessitar més temps que el portal;
  cal esperar que acabe la preparació abans d’entrar o obrir Quiosc.
- La prova virtual no substituïx un pilot en equips físics d’un centre.
- Les còpies del servidor no inclouen projectes guardats únicament en el navegador.
- El xip nou de compte, tema i idioma continua en la branca de desenvolupament
  independent i queda reservat per a beta4, per decisió de l’usuari.
- Esta preparació no ha substituït els serveis federats de producció.

## Guia per a instal·lar

[Manual bàsic d’instal·lació](INSTALACION-RAPIDA.md). La seua versió HTML està
preparada en `instala-commons.html` del repositori del portal edutictac.es,
amb els idiomes i el disseny del lloc. La publicació web s’ha de coordinar amb
el paquet APT perquè l’enllaç de descàrrega siga vàlid.
