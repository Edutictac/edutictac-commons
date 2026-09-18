# Roadmap operatiu — EduTicTac Commons Stack

> Projecte: **EduTicTac Commons**  
> Repo: `edutictac-commons`  
> Pista: **B — Stack Docker replicable**  
> Data inicial: 2026-09-14

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

## Estat actual

La versió `0.1.0-alpha` ja conté:

- `commons-id-api`: API FastAPI amb credencial pseudònima d'alumnat, sessions,
  grups, assignacions i puntuacions;
- `commons-portal`: portal demo amb flux docent -> alumnat -> resultats;
- integració opcional d'EduHoot via perfil Docker Compose;
- scripts d'operació local: `doctor`, `up`, `test-flow`, `bootstrap-demo`,
  `backup`, `restore`, `export-images`, `load-images` i `release-check`;
- backups automàtics amb timer d'usuari de systemd i panell `/admin`
  (contenidor `admin`) per gestionar-los sense terminal;
- documentació d'instal·lació en centres i checklist d'entrega.

El criteri d'estabilitat actual és:

```bash
make DOCKER="sudo docker" release-check
```

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
tauler docent des de la primera arrencada. El Banc de recursos avançat, la
cistella i el SSO docent dins d'EduHoot continuen a la secció «v2».

## Estat per tancar la v1

El producte i el paquet ja estan implementats. Només queden dos bloquejos de
lliurament:

1. provar `edutictac-commons_0.1.1~alpha4_amd64.deb` en una màquina neta real,
   incloent-hi activació, OIDC, flux docent → alumnat → EduHoot i restauració;
2. publicar el `.deb` com a artefacte descarregable (release o repositori
   APT). Ara mateix només es genera localment en `dist/`.

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
còpies de seguretat completes, restauració provada i actualitzacions
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
- [x] Publicar el `.deb` `0.1.1~alpha4` en el repositori APT signat
  [`packages.edutictac.es`](https://packages.edutictac.es), amb clau pública,
  índexs signats i documentació d'instal·lació.

## v2 — més enllà del nucli finançat

Ítems que queden **fora** de la v1.0 (nucli finançat per la 4D). Es treballen a
continuació, amb l'objectiu d'arribar-hi abans d'agost 2027 (vegeu §0.1 del
roadmap 4D).

### Fita v2-1 — Authentik (identitat docent i d'administració)

La base d'Authentik ja està incorporada a la v1 instal·lable. Aquesta fita v2
conserva les millores d'integració que encara no són necessàries per al nucli.

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
- [ ] Connectar la identitat OIDC pseudònima amb Portal, Play, Recursos i
  EduHoot.
- [x] Provar el flux complet contra una instància Authentik del laboratori per
  a Commons/Portal i Recursos.
- [ ] Afegir classes/grups i permisos compartits completament integrats en el
  tauler i els itineraris.

La primera migració de dades i els endpoints de membresía estan implementats i
documentats en `docs/groups-permissions.md`. Les consultes del tauler, les
credencials, les assignacions, els resultats i les estadístiques ja respecten
els docents col·laboradors; queda afegir la gestió visual i connectar-ho amb
classes i itineraris.

### Fita v2-2 — Banc de recursos (cistella i recorregut)

**Resultat:** el professorat pot triar activitats del Banc de recursos des del
tauler (cistella de recursos) i assignar-les als recorreguts, amb més fonts
d'activitat que EduHoot sol.

- [x] Dockeritzar `recursos-api` i el frontend de `recursos` com a mòdul del
  stack (perfil Compose propi, persistència a `data/recursos-*`).
- [x] Integrar la identitat docent (Authentik/OIDC) al Banc de recursos perquè
  els preferits queden al compte.
- [ ] Crear un catàleg controlat de categories i etiquetes per a les activitats:
  l'alumnat només podrà seleccionar valors tancats i el professorat podrà
  crear, editar, activar o desactivar els valors del seu centre o espai.
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
- [ ] Integrar la cistella de favorits en el tauler docent Commons i conservar
  la sessió OIDC compartida entre portal i Recursos.
- [x] Cercador local del Banc de recursos al tauler docent i assignació de
  recursos Play al grup seleccionat, conservant l'`activity_id` per al tauler
  de resultats.
- [x] Preparar en `id-api` el modelo mínimo de itinerarios sobre asignaciones
  existentes, con orden estable y compatibilidad con el dashboard del
  alumnado.
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

La comprovació del 2026-09-17 confirma que `recursos` i `recursos-api` són
repositoris i serveis separats de Commons; el perfil Compose local ja els pot
desplegar, `recursos-api` indexa EduHoot amb un flux pull i té implementada la
ingesta push autenticada per a Play. El cicle local de publicació, actualització
i retirada ja conserva el `resource_id`; queda activar-lo en producció i
completar la cistella i els itineraris del tauler docent.

El contracte local i la validació del payload ja estan preparats en
`services/play/recursos.py` i `tests/test_recursos_contract.py`; queda pendent
connectar-los amb una API real de `recursos` quan el servei i el seu contracte
estiguen disponibles.

El contracte de resultats, assignacions i funcionament local-first de Play està
en `docs/play-commons-integration.md`.

### Fita v2-3 — Catàleg compartit de la xarxa de centres

**Resultat:** els centres poden rebre una còpia local del catàleg comú i
compartir activitats seleccionades amb la resta de la xarxa sense dependre en
temps real de `edutictac.es`.

- [ ] Crear el repositori independent `edutictac-content` com a font de
  continguts publicats, separat del codi de Commons i de les dades privades
  dels centres.
- [ ] Importar-hi el catàleg inicial d'activitats i recursos que ja existeix a
  `edutictac.es`, conservant identificadors, metadades, idioma, llicència i
  autoria.
- [ ] Definir un manifest versionat amb identificadors estables, revisions,
  hashes SHA-256, dependències i fitxers de Recursos/EduHoot.
- [ ] Publicar les versions en `contenido.edutictac.es` mitjançant HTTPS com a
  artefactes estàtics servits per Nginx o emmagatzematge compatible amb S3.
- [ ] Afegir en Administració dues accions independents: «Sincronitzar
  Recursos» i «Sincronitzar EduHoot».
- [ ] Fer la sincronització idempotent, amb descàrrega temporal, validació del
  manifest, actualització atòmica, informe de canvis i última versió vàlida
  local.
- [ ] Permetre proposar des de Play i EduHoot activitats per compartir amb la
  xarxa, mantenint privades per defecte les activitats de centre, docent i
  alumnat.
- [ ] Incorporar revisió, moderació, llicència, centre d'origen i retirada de
  continguts publicats.
- [ ] Documentar el flux de publicació, sincronització, rollback i treball
  sense connexió amb el repositori central.

### Fita v2-4 — SSO docent a EduHoot

- [ ] Permetre l'accés del professorat a EduHoot amb Authentik/OIDC (crear i
  gestionar qüestionaris), en lloc del flux actual per tokens.

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
- cap flux exigeix noms reals, correus o identificadors institucionals
  d'alumnat.

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
