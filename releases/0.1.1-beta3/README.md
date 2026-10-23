# Commons 0.1.1-beta3 — entrega en preparació

Instal·lador amd64 per a LliureX 23, Ubuntu i Debian:
`edutictac-commons_0.1.1~beta3_amd64.deb`. Esta carpeta registra les imatges
immobilitzades; encara no acredita una publicació APT ni una instal·lació neta
del paquet final. No s’han substituït els serveis federats de producció.

## Contingut

- Nucli amb aules, accés de l’alumnat amb codi i PIN, Rebost central i
  fitxers d’aula compartits; entregues privades per a cada alumne.
- Selector de mòduls: Play, EduHoot, Banc de recursos, Blocs, Llibres i Quiosc.
- Blocs i Llibres reutilitzen les imatges del Rebost. La publicació de treballs
  de l’alumnat manté la revisió docent.
- Quotes i límits de fitxers configurables, còpies i restauració amb els nous
  directoris, i actualitzacions d’imatges que ordenen bé les versions beta.
- El proxy admet fitxers grans només en les rutes de pujada de l’aula;
  conserva els límits dels altres serveis.

## Instal·lació i actualització

Esta entrega usa descàrrega d’imatges per Internet (`BUNDLE_IMAGES=none`).
No és un instal·lador autònom sense connexió. Consulta [la guia per a centres](../../INSTALL-CENTRES.md).

En una primera instal·lació, instal·la el paquet i reinicia abans d’activar
Commons i triar els mòduls. Això aplica el permís de Docker a la sessió docent.
En la primera arrancada, espera que el servei d’accés estiga preparat.

En una instal·lació existent, fes una còpia verificable, actualitza primer el
paquet i després les imatges des d’Administració. El paquet conserva els tags,
els secrets i els mòduls de la instància; per tant, actualitzar el paquet per
si sol no actualitza els contenidors. No cal reinstal·lar ni recrear les aules.
El selector d’actualitzacions reconeix la beta3 final com a posterior a les
seues candidates, sense ordenar els números com a text.

## Procedència de les imatges

`images.json` i `compose.images.json` fixen les 13 referències amd64. Les
imatges del motor d’identitat, Blocs, Llibres i Banc conserven els digests ja
provats durant l’assaig beta3; portal i administració incorporen els canvis
d’entrega. Play incorpora la regeneració del client amb l’ajudant d’idioma
compartit actual. No s’han canviat les versions dels serveis de tercers.

## Validació disponible

- 538 proves Python correctes, 2 omeses; 294 proves del navegador correctes.
- Play: 58 proves de navegador correctes i proves del service worker.
- Actualització real en LliureX des del paquet beta2 al candidat beta3,
  mantenint configuració, secrets, selecció de mòduls i les 19 taules prèvies.
- Actualització d’imatges pel mecanisme instal·lat; fitxers compartits i
  privats previs conservats, i comprovació del proxy amb pujades de 2 MiB.
- Imatge final de Play: el fitxer servit coincidix amb el client versionat.

Queda pendent la comprovació del paquet final exacte, l’assaig d’instal·lació
neta i la publicació signada. Les comprovacions anteriors del servidor, dels
editors i de les còpies es detallen en [beta2](../../docs/VALIDACIO-BETA2-LLIUREX.md)
i [fitxers d’aula](../../docs/FITXERS-AULA.md); no substituïxen eixa validació final.

Quiosc continua sent un navegador supervisat. La prova virtual no substituïx
un pilot en equips físics del centre. Els llibres i projectes guardats només
en el navegador requerixen una còpia o descàrrega pròpia.
