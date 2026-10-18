# Roadmap operatiu — EduTicTac Commons Stack

> Projecte: **EduTicTac Commons**  
> Repo: `edutictac-commons`  
> Pista: **B — Stack Docker replicable**  
> Data inicial: 2026-09-14
> Última revisió: 2026-10-18

Aquest document resumeix el treball que toca fer en aquest repositori. El
roadmap complet de la candidatura 4D viu en el repo
`edutictac-4d-solicitud`; ací només es manté la part executable del stack
Docker replicable.

## Regla de treball

El desenvolupament nou del comú es fa i es prova ací, en el stack Docker,
abans de considerar-lo aplicable a cap instància real. La instància
`edutictac.es` continua sent referència i producció, però no és el banc de
proves de funcionalitats noves.

Cada canvi funcional ha de deixar:

- codi o configuració versionada;
- instruccions d'ús o operació actualitzades;
- una comprovació reproduïble (`make test-flow`, `make release-check` o prova
  equivalent);
- cap secret, dada real o artefacte local en el repositori.

## Estat verificat — 2026-10-18

Versió publicada: **imatges Commons alpha30 i instal·lador alpha34** en APT
signat. Codi i tag `v0.1.1-alpha30` en Forgejo i GitHub; manifests, firma APT
i hash del paquet descarregat comprovats. [Notes de publicació](../releases/0.1.1-alpha30/README.md).

Ja implementat i publicat:

- nucli docent/alumnat amb identitat pseudònima, grups compartits,
  assignacions i resultats;
- itineraris amb ordre, selecció activa per grup, permisos i conservació del
  progrés, incloent-hi migració de dades existents;
- selector inicial i gestió posterior de Play, EduHoot, Recursos i Quiosc des
  d'Administració; conserva dades i recupera la configuració si falla un canvi;
- Authentik i activació inicial, operació des del panell, actualitzacions i
  backups complets dels serveis amb dades i de la configuració privada;
- sincronització independent de Recursos i EduHoot, amb manifest, hashes i
  catàleg versionat en el repositori `edutictac-content`;
- CA/VA/ES/EN. Validació de la publicació: 178 proves Python correctes,
  2 proves Docker optatives de Quiosc omeses, 70 proves de navegador i prova
  Docker d'activació/desactivació, dades conservades i recuperació correctes.

La publicació no dona per validats el pilot LliureX, el SSO complet dels quatre
serveis ni una instal·lació nova amb esta versió. L'estat del desplegament es
registra en [PROPERA-SESSIO.md](PROPERA-SESSIO.md).

## Ordre de treball immediat

1. Validar la instal·lació nova en LliureX: activació, OIDC, selector,
   backups complets, reinici i recuperació.
2. Validar Quiosc amb Epoptes en una aula real, inclosa restauració dels equips.
3. Tancar el flux v2 docent: sessió compartida amb Recursos, favorits i
   assignació de la cistella a un itinerari concret.

Desplegament en la instal·lació existent **completat**: alpha34/alpha30, perfils
conservats i primera còpia completa real verificada. Temporitzador diari activat
a les 03:15 (Europe/Madrid), amb fins a deu minuts de retard aleatori.
Restauració completa comprovada en Docker aïllat, sense restaurar la instal·lació
real. [Abast i comprovacions](BACKUPS-VALIDACIO.md); [recuperació](BACKUPS.md).

Les caselles següents diferencien implementació de validació integral. Una
funció implementada pot continuar tenint una prova de camp pendent.

## Objectiu v1 (nucli finançat)

Construir un nucli instal·lable que un centre puga provar sense coneixement
intern de l'ecosistema EduTicTac:

1. tauler docent usable;
2. accés d'alumnat amb codi + PIN;
3. primer recorregut didàctic pilotable;
4. EduHoot integrat en el flux com a primera activitat real;
5. documentació i kit mínim de privacitat;
6. còpies de seguretat i restauració provades;
7. paquet d'imatges versionat i actualitzable;
8. instal·lador `.deb` per a Ubuntu amd64 amb configuració inicial automàtica.

Aquesta v1.0 és el **mínim entregable** de la primera fase 4D. Authentik ja
forma part de la distribució instal·lable perquè permet deixar operatiu el
tauler docent des de la primera arrencada. La integració avançada del Banc de
recursos, la cistella i el **SSO docent i la identitat pseudònima de l'alumnat
entre EduHoot, Recursos i Play** continuen a la secció «v2».

## Estat per tancar la v1

El producte i el paquet ja estan implementats. Queda pendent validar el
lliurament:

1. provar `edutictac-commons_0.1.1~alpha34_amd64.deb` en una màquina neta real,
   incloent-hi activació, OIDC, flux docent → alumnat → EduHoot i restauració;

El `.deb` ja està publicat en el repositori APT signat
`packages.edutictac.es` (vegeu Fita 6).

La validació de traduccions del portal i la reorganització d'usabilitat del
tauler docent ja estan incorporades. El tancament formal requereix repetir el
`release-check` després de la prova d'instal·lació neta.

## Fites

### Fita 1 — Base tècnica sanejada

**Resultat:** el stack actual és fiable com a base de desenvolupament.

- [x] Stack local arranca amb Docker Compose.
- [x] Flux demo automàtic docent -> credencials -> alumne -> puntuació ->
  resultats.
- [x] Artefactes locals ignorats i comprovats pel `release-check`.
- [x] Documentació tècnica pròpia en `docs/`.
- [x] Inventari curt de serveis, ports, dades persistents i scripts.

### Fita 2 — Tauler docent i alumnat v1

**Resultat:** el portal deixa de ser només una demo i es converteix en el primer
tauler Commons.

- [x] Separar visualment flux docent i flux alumnat.
- [x] Llistar grups i assignacions ja creades, no només l'estat guardat en
  `localStorage`.
- [x] Permetre regenerar PIN i revocar identitats des del tauler.
- [x] Afegir exportació docent clara: targetes, CSV de codis i estadístiques.
- [x] Afegir una vista d'alumnat amb recorregut i progrés bàsic.

### Fita 3 — Administració operativa: backups i actualitzacions

**Resultat:** el stack es pot administrar des d'un panell tècnic segur, amb
còpies amb cobertura explícita per servei, restauració provada i actualitzacions
controlades d'imatges Docker/OCI.

Punt de represa detallat: `docs/PROPERA-SESSIO.md`.

Principi: **cap dada persistent sense backup** i **cap actualització sense
backup recent i verificable**.

- [x] Documentar política inicial de backup per servei i marcar pendents:
  `id-api`, EduHoot/Mongo, uploads, logs rellevants, configuració local i
  futurs mòduls.
- [x] Ampliar `make backup` perquè cobrisca `id-api` amb manifest i checksum.
- [x] Ampliar `make backup` perquè cobrisca EduHoot (Mongo `kahootDB` via
  `mongodump`, uploads i informes de sessió via tar) quan `eduhoot-mongo`
  estiga en marxa.
- [x] Ampliar `make restore` per a `id-api` i documentar el flux base.
- [x] Ampliar `make restore` per a EduHoot (mongo/uploads/logs), incloent-hi
  el cas dels directoris propietat de l'uid intern del contenidor (resolt
  amb `mongo:7` com a root, sense pull addicional).
- [x] Afegir verificació mínima de backup/restauració en entorn local segur
  per a `id-api`.
- [x] Afegir verificació de backup/restauració amb `COMPOSE_PROFILES=eduhoot`
  (`make backup-check` ja detectava genèricament la cobertura declarada al
  manifest; provat en real amb un cicle backup→restore complet).
- [x] Crear panell `/admin` només per administració tècnica.
- [x] Mostrar en `/admin` estat de serveis, versió instal·lada i últim backup.
- [x] Permetre crear backup manual des del panell.
- [x] Permetre restaurar backup seleccionat des del panell amb confirmació.
- [x] Llistar backups disponibles i avisar si algun servei no està cobert.
- [x] Versionar la imatge pròpia `commons-admin` i incloure-la en
  `export-images`/`push-images`.
- [x] Consultar `IMAGE_REGISTRY` i detectar si les imatges configurades estan
  disponibles (`make check-images` via `docker manifest inspect`).
- [x] Oferir actualització guiada d'imatges: backup previ obligatori,
  descàrrega, reinici, healthchecks i verificació funcional (`make
  update-images`, també accessible des del panell `/admin`).
- [x] Automatitzar comparació de canal/versió disponible contra la instal·lada
  (`make check-updates`, endpoint `/api/updates`).
- [x] Definir canals `stable`, `testing` i `dev`.
- [x] Rollback assistit des del panell; crea un backup de seguretat, recupera
  els tags anteriors i verifica salut i flux funcional.
- [x] Selecció de mòduls amb revisió de configuració, bloqueig compartit de
  manteniment, progrés persistent i recuperació davant fallades.
- [x] Implementar cobertura completa de backup/restauració per a Authentik,
  Play, Recursos, Quiosc i configuració, mantenint les còpies v1 llegibles.
  Pausa coherent dels serveis amb escriptura i treballs del panell en el host.
- [x] Publicar i activar alpha27/alpha30 amb la primera còpia completa real i
  el temporitzador d'usuari comprovats. [Guia de recuperació](BACKUPS.md).
- [x] Implementar la segona còpia opcional en un NAS o USB del centre: activació,
  còpia immediata, desactivació i últim resultat des del panell; còpia automàtica
  després del backup local, validació i protecció davant desconnexió.
- [x] Publicar i desplegar alpha30/alpha34 amb el panell i els scripts de segona
  còpia. Llançament real del backup complet des del contenidor comprovat.
- [ ] Seleccionar un NAS o USB real del centre i validar la primera segona còpia.
  Millora opcional: queda desactivada fins a configurar el dispositiu.
  Les còpies locals automàtiques continuen operatives. [Ús i límits](BACKUPS.md).

### Fita 4 — EduHoot com a primera activitat integrada

**Resultat:** el professorat pot crear o seleccionar una activitat EduHoot i
l'alumnat pot completar-la amb la mateixa identitat pseudònima.

- [x] Documentar exactament què espera EduHoot del servei d'identitat.
- [x] Validar el flux amb `COMPOSE_PROFILES=eduhoot`.
- [x] Crear una prova funcional que cobrisca portal + identitat + EduHoot
  (`make test-eduhoot-flow`, inclou token intern obligatori, associació
  automàtica i `assignment_id` explícit).
- [x] Evitar que l'alumnat necessite cap compte personal.
- [x] Documentar persistència local d'EduHoot (`data/eduhoot-*`) i còpia de
  seguretat.
- [x] Permetre assignar una activitat EduHoot des del tauler docent (per ID de
  quiz) i registrar puntuacions de partida en Commons via token intern.
- [x] Permetre mode mixt en EduHoot: entrada amb nom curt o amb codi + PIN
  Commons sense demanar nom addicional.

### Fita 5 — Privacitat per a centres

**Resultat:** un centre pot entendre què dades guarda el stack i què no guarda.

- [x] Crear `docs/PRIVACITAT.md` amb explicació clara de codi + PIN,
  pseudonimització i límits.
- [x] Crear fitxa docent imprimible.
- [x] Crear informació breu per a famílies.
- [x] Crear fitxa tècnica per a direcció/DPD.
- [x] Revisar que cap document prometa anonimat absolut.

### Fita 6 — Distribució

**Resultat:** la v1 es pot portar a una màquina neta.

- [x] Revisar `IMAGE_REGISTRY`, `IMAGE_TAG` i `VERSION` per a la distribució
  alpha actual.
- [x] Exportar imatges amb `make export-images`.
- [x] Provar `make load-images` en un entorn simulat local; queda pendent una
  màquina neta real.
- [x] Publicar instruccions de `docker compose pull` amb registre propi en la
  documentació d'instal·lació i operació.
- [x] Mantindre canals de versió sense usar `latest`.
- [x] Provar el flux de reset amb restauració (`CONFIRM_RESET_TEST=1 make
  test-reset-flow`): backup previ, dades temporals, reset buit i restore.
- [ ] Validar en una màquina neta el paquet `.deb` per a Ubuntu amd64 amb
  dependències, configuració inicial, servei systemd i comprovació
  postinstal·lació.
- [x] Publicar el `.deb` `0.1.1~alpha34` en el repositori APT signat
  [`packages.edutictac.es`](https://packages.edutictac.es), amb clau pública,
  índexs signats i documentació d'instal·lació.

## v2 — més enllà del nucli finançat

### Progrés implementat i publicat — 2026-10-18

- [x] Editor docent d'itineraris: pujar, baixar i llevar passos, conservant
  assignacions i resultats; CA/VA/ES/EN i ús en mòbil.
- [x] Guardat atòmic amb detecció de canvis simultanis entre docents i
  comprovació de permisos del grup.
- [x] Selecció d'un únic itinerari actiu per grup, amb retirada de selecció,
  control de canvis simultanis i migració de dades existents.
- [x] Títol de l'itinerari seleccionat visible al tauler de l'alumnat, mantenint
  la resta d'assignacions i el progrés.
- [x] Estabilització local: permisos després de revocar col·laboradors,
  recuperació de connexió, respostes tardanes i proves completes en verd.
  Resultats i límits: `docs/ESTABILITZACIO-V2.md`.

La cistella de favorits i l'assignació al grup ja tenen implementació local;
les caselles d'integració següents continuen pendents fins a validar la sessió
OIDC compartida i el flux complet amb Recursos. L'editor i la selecció nous
estan inclosos en alpha26 (instal·lador alpha29). La validació del desplegament
es registra en `docs/PROPERA-SESSIO.md`.
Migració i restauració provades en Docker aïllat. Contracte i proves:
`docs/itineraries.md`.

Ítems que queden **fora** de la v1.0 (nucli finançat per la 4D). Es treballen a
continuació, amb l'objectiu d'arribar-hi abans d'agost 2027 (vegeu §0.1 del
roadmap 4D).

### Fita v2-1 — Authentik i SSO docent dels serveis educatius

La base d'Authentik ja està incorporada a la v1 instal·lable. Aquesta fita v2
concentra la integració completa de la identitat docent i de la identitat
pseudònima de l'alumnat amb **EduHoot, Recursos i Play**; la v1 només necessita
el nucli instal·lable i el flux docent bàsic.

- [x] Afegir al `id-api` el flux OIDC opcional Authorization Code amb Authentik.
- [x] Mantindre el mode codi + PIN quan OIDC no estiga configurat.
- [x] Crear sessió local signada i mapejar `alumno`, `profesor` i
  `administrador` sense guardar noms ni correus.
- [x] Documentar issuer, callback, property mapping, claims i llicències.
- [x] Desplegar **Authentik (OIDC)** a l'stack i preparar-ne el bootstrap
  automàtic en el paquet `.deb`, amb aplicació/proveïdor Commons i activació
  inicial d'un sol ús.
- [ ] Validar l'activació OIDC del paquet en una màquina neta i activar-lo en
  una instal·lació de centre.
- [ ] Connectar i validar el SSO docent amb Portal, Play, Recursos i EduHoot.
- [ ] Compartir la identitat pseudònima de l'alumnat entre Play, Recursos i
  EduHoot, mantenint l'accés amb codi + PIN i sense comptes personals.
- [ ] Completar l'accés docent a EduHoot per OIDC, substituint el flux actual
  basat en tokens.
- [x] Provar el flux complet contra una instància Authentik del laboratori per
  a Commons/Portal i Recursos.
- [x] Gestió visual de docents col·laboradors en els grups; consultes,
  credencials, assignacions, resultats i itineraris respecten els permisos.
- [x] Revocació de col·laboradors i control de canvis simultanis coberts per
  les proves dels itineraris.

Migració i contracte de membres del grup en `docs/groups-permissions.md`;
editor i selecció en `docs/itineraries.md`. La sessió compartida entre serveis
continua requerint una validació completa independent.

### Fita v2-2 — Banc de recursos (cistella i recorregut)

**Resultat:** el professorat pot triar activitats del Banc de recursos des del
tauler (cistella de recursos) i assignar-les als recorreguts, amb més fonts
d'activitat que EduHoot sol.

- [x] Dockeritzar `recursos-api` i el frontend de `recursos` com a mòdul del
  stack (perfil Compose propi, persistència a `data/recursos-*`).
- [x] Integrar la identitat docent (Authentik/OIDC) al Banc de recursos perquè
  els preferits queden al compte.
- [x] Catàleg controlat inicial de Play amb etiquetes traduïdes i valors
  tancats per a la classificació de les activitats.
- [ ] Completar la gestió docent dels vocabularis del centre i unificar-la
  entre Play, Commons i Recursos.
- [x] Definir el contracte inicial del catàleg amb identificadors estables i
  etiquetes `es`, `ca` i `en`, mantenint el token local com a permís provisional.
- [ ] Aplicar el catàleg controlat als camps de matèria, etapa, nivell i
  etiquetes, amb identificadors estables, noms traduïbles i filtres coherents
  entre Play, Commons i `recursos`.
- [ ] Preparar la migració de metadades lliures existents: conservar el text
  original, proposar coincidències i enviar els valors no reconeguts a revisió
  docent abans d'incorporar-los al catàleg.
- [x] Preparar el banc de Play per a propietat i visibilitat: activitats
  públiques anònimes, privades per identitat fiable i estat de classe reservat.
- [x] Crear en `recursos-api` l'endpoint `GET /api/teacher/favorites`
  (sessió OIDC docent) que resol els preferits a recurs complet.
- [x] Interfície de favorits/cistella en el tauler docent i assignació al grup.
- [ ] Validar el recorregut real amb favorits persistents i sessió OIDC
  compartida entre el portal i Recursos.
- [x] Cercador local del Banc de recursos al tauler docent i assignació de
  recursos Play al grup seleccionat, conservant l'`activity_id` per al tauler
  de resultats.
- [x] Model d'itineraris sobre assignacions existents, ordre estable,
  selecció per grup i visualització al tauler d'alumnat.
- [ ] Assignar recursos de la cistella als recorreguts des del tauler; qualsevol
  recurs és assignable, només els d'app (JClic/H5P/EduHoot) generen puntuació i
  resultats.
- [ ] Migració de preferits anònims → OIDC (diferida mentre no hi haja comptes
  reals al Banc de recursos).
- [x] Integrar EduTicTac Play amb `recursos`: enviar activitats H5P públiques i
  metadades perquè `recursos` les indexe i les reproduïsca amb el seu visor H5P.
- [x] Integrar Play amb les APIs de Commons per a itineraris, assignacions i
  resultats abans de convertir `recursos` en el visor canònic. Play haurà de
  funcionar també sense identitat, guardant els borradors en el navegador.
- [x] Afegir una modalitat visual de classificació basada en H5P Drag and Drop,
  amb editor simplificat, previsualització, reproducció i exportació `.h5p`.
- [x] Afegir una modalitat d'ordenació per a seqüències i cronologies, basada
  en la mateixa biblioteca H5P i amb límits adequats per a mòbil.
- [x] Definir l'enllaç canònic configurable de les activitats: visor autònom de
  Play durant el MVP i, posteriorment, visor o redirecció a `recursos`.
- [x] Associar l'activitat de Play amb el `resource_id` de `recursos`, incloent
  actualització, retirada, permisos i sincronització sense duplicar fitxers.
- [x] Agrupar activitats compatibles en un únic Modo Reto `H5P.QuestionSet`,
  amb exportació H5P, reproducció paginada i qualificació agregada.
- [x] Afegir activitats ja guardades des del banc com a passos del Modo Reto,
  conservant una còpia estable i `sourceActivityId` per a la traçabilitat.

El detall del contracte i les decisions de propietat del recurs estan en
`docs/resources-integration.md`. Aquesta integració és posterior al MVP i no
és necessària per crear, jugar o exportar activitats H5P localment.

Recursos i recursos-api són serveis separats i ja tenen integració
implementada: ingesta autenticada de Play, indexació d'EduHoot i contracte de
propietat/publicació. No es considera validat el cicle docent complet només
per tindre estos endpoints. Queden el SSO real de tots els serveis i la
cistella → itinerari. Contracte i proves: `services/play/recursos.py` i
`tests/test_recursos_contract.py`.

El contracte de resultats, assignacions i funcionament local-first de Play està
en `docs/play-commons-integration.md`.

### Fita v2-3 — Catàleg compartit de la xarxa de centres

**Resultat:** els centres poden rebre una còpia local del catàleg comú i
compartir activitats seleccionades amb la resta de la xarxa sense dependre en
temps real de `edutictac.es`.

- [x] Crear el repositori independent `edutictac-content` com a font de
  continguts publicats, separat del codi de Commons i de les dades privades
  dels centres.
- [x] Importar-hi el catàleg inicial d'activitats i recursos que ja existeix a
  `edutictac.es`, conservant identificadors, metadades, idioma, llicència i
  autoria.
- [x] Definir un manifest versionat amb identificadors estables, revisions,
  hashes SHA-256, dependències i fitxers de Recursos/EduHoot.
- [x] Publicar les versions en `contenido.edutictac.es` mitjançant HTTPS com a
  artefactes estàtics servits per Nginx o emmagatzematge compatible amb S3.
- [x] Afegir en Administració dues accions independents: «Sincronitzar
  Recursos» i «Sincronitzar EduHoot».
- [x] Descàrrega temporal, validació del manifest i SHA-256, activació local
  atòmica i importació amb recompte de canvis. Ingesta idempotent comprovada.
- [ ] Validar el rollback complet entre versions de catàleg i la recuperació
  coherent del servei importador si falla després d'activar la còpia local.
- [ ] Permetre proposar des de Play i EduHoot activitats per compartir amb la
  xarxa, mantenint privades per defecte les activitats de centre, docent i
  alumnat.
- [ ] Incorporar revisió, moderació, llicència, centre d'origen i retirada de
  continguts publicats.
- [x] Documentar el manifest i la publicació inicial en `edutictac-content`,
  així com els dos canals i la validació en `content/README.md`.
- [ ] Completar la guia de moderació, rollback integral i prova sense
  connexió amb el repositori central.

La publicació inicial del catàleg i la validació d'ingesta daten del
2026-09-18. Queda separat el treball de proposta/moderació de noves activitats:
la recepció de catàlegs ja està implementada, la governança editorial no.

### Fita v2-4 — SSO docent i identitat d'alumnat entre EduHoot, Recursos i Play

- [ ] Permetre l'accés del professorat a EduHoot amb Authentik/OIDC (crear i
  gestionar qüestionaris), en lloc del flux actual per tokens.
- [ ] Mantindre una sessió docent compartida entre Commons, Recursos i Play.
- [ ] Mantindre una identitat pseudònima d'alumnat compartida entre Commons,
  Recursos, Play i EduHoot, sense exigir compte personal ni nom real.
- [ ] Validar permisos, propietat d'activitats i gestió de grups en els tres
  serveis sense exigir comptes separats.

### Fita v2-5 — Visor net de vídeos i col·lecció docent

**Resultat:** el professorat pot guardar vídeos de YouTube en una col·lecció
catalogada, preparar-los en una interfície neta per a l'aula i assignar-los a
un grup classe dins del recorregut de l'alumnat.

Criteri legal i de producte: la funcionalitat s'ha de presentar com a **visor
net / sense distraccions**, no com a bloquejador d'anuncis. Ha d'usar el
reproductor oficial de YouTube o `youtube-nocookie.com`, mantenir l'atribució i
el consentiment quan corresponga, i no ha d'interferir tècnicament amb la
publicitat servida pel reproductor.

- [ ] Avaluar el fork de Digiview (`ladigitale/digiview`, AGPLv3) com a base:
  llicència, avisos d'autoria, obligació de publicar el codi modificat i
  encaix amb la UI/stack Commons.
- [ ] Definir model de dades per a la biblioteca de vídeos docent: URL/ID de
  YouTube, títol, descripció, miniatura, inici/fi, idioma/subtítols, categoria,
  etiquetes, visibilitat i professor/centre propietari.
- [ ] Afegir al tauler docent una col·lecció de vídeos amb busca, filtres per
  categoria/etiqueta i accions ràpides: crear, editar, previsualitzar, duplicar
  i assignar a grup.
- [ ] Permetre assignar un vídeo guardat a un grup classe com una activitat
  Commons (`activity_assignments`) sense puntuació obligatòria, marcant progrés
  com a visualitzat/completat si corresponga.
- [ ] Afegir al tauler de l'alumnat una targeta de vídeo assignat que obri el
  visor net mantenint la identitat pseudònima i sense demanar cap compte
  personal.
- [ ] Documentar el text públic recomanat: "vídeos en una interfície neta, sense
  comentaris, recomanacions ni distraccions externes", evitant prometre
  eliminació garantida de publicitat.
- [ ] Incloure els vídeos i metadades en la política de backup/restauració i en
  la documentació de privacitat per a centres.

### Fita v2-6 — LRS complet (xAPI)

- [ ] Desplegar `lrsql` (LRS) com a mòdul de l'stack i connectar-hi el Learning
  Bridge (normalització JClic/H5P) i el SDK client per al progrés docent, més
  enllà de la prova de concepte finançada.

### Fita v2-7 — Configuració de desplegament

- [x] Assistent inicial i activació/desactivació de Play, EduHoot, Recursos i
  Quiosc des d'Administració; dades conservades i nucli sempre actiu.
- [x] Migració de la selecció d'instal·lacions anteriors i recuperació si falla
  l'arrancada. Quiosc queda condicionat a preparar Epoptes prèviament.
- [ ] Validar l'assistent i els canvis posteriors en una màquina LliureX nova.

- [ ] Permetre configurar des del panell d'administració els ports publicats
  pel host, amb detecció de conflictes, reinici controlat, còpia de la
  configuració anterior i rollback si el stack no recupera la salut.

## Criteris de no-go

No es dona una versió per preparada si:

- `make release-check` falla en una màquina amb Docker funcional;
- cal editar secrets a mà dins del codi o de les imatges;
- el professorat no pot recuperar o regenerar credencials;
- no hi ha forma documentada de parar, arrancar, copiar i restaurar dades;
- la documentació confon pseudonimització amb anonimat complet;
- algun flux d'alumnat exigix noms reals, correus o identificadors institucionals.

## Relació amb el roadmap 4D

Aquest repo cobreix la **Pista B** del roadmap 4D:

- P0-13: credencial pseudònima i recorregut didàctic mínim;
- P1-10: ampliació de la credencial a més apps;
- P1-16: kit de privacitat per a centres;
- P1-17: editor avançat de recorreguts didàctics — inclou la **cistella de
  recursos** (els preferits del Banc de recursos resolts al tauler del
  professorat, per triar-los i assignar-los als recorreguts de l'alumnat);
- part de P0-8: repositori públic, instruccions reproduïbles i mecanisme de
  versionat;
- instal·lador v1 del nucli replicable.

Queden fora d'aquest repo, excepte com a documentació o integració futura:
Nextcloud complet, Moodle, WordPress, Forgejo, DokuWiki i la instància real
`edutictac.es`.
