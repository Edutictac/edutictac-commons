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

## Objectiu v1

Construir un nucli instal·lable que un centre puga provar sense coneixement
intern de l'ecosistema EduTicTac:

1. tauler docent usable;
2. accés d'alumnat amb codi + PIN;
3. primer recorregut didàctic pilotable;
4. EduHoot integrat en el flux com a primera activitat real;
5. documentació i kit mínim de privacitat;
6. còpies de seguretat i restauració provades;
7. paquet d'imatges versionat i actualitzable.

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
- [ ] Rollback assistit des del panell.

### Fita 4 — EduHoot com a primera activitat integrada

**Resultat:** el professorat pot crear o seleccionar una activitat EduHoot i
l'alumnat pot completar-la amb la mateixa identitat pseudònima.

- [x] Documentar exactament què espera EduHoot del servei d'identitat.
- [x] Validar el flux amb `COMPOSE_PROFILES=eduhoot`.
- [ ] Crear una prova funcional que cobrisca portal + identitat + EduHoot.
- [x] Evitar que l'alumnat necessite cap compte personal.
- [x] Documentar persistència local d'EduHoot (`data/eduhoot-*`) i còpia de
  seguretat.
- [x] Permetre assignar una activitat EduHoot des del tauler docent (per ID de
  quiz) i registrar puntuacions de partida en Commons via token intern.
- [x] Permetre mode mixt en EduHoot: entrada amb nom curt o amb codi + PIN
  Commons sense demanar nom addicional.

### Fita 5 — Banc de recursos (cistella i recorregut)

**Resultat:** el professorat pot triar activitats del Banc de recursos des del
tauler (cistella de recursos) i assignar-les als recorreguts, amb més fonts
d'activitat que EduHoot sol.

> **Nota d'abast:** això avança el «Banc de recursos com a mòdul de
> l'instal·lador» que el roadmap 4D situa en v2; ací s'acota a la integració
> mínima, no a l'índex federat complet ni als thumbnails proxy.

- [ ] Desplegar **Authentik (OIDC)** a l'stack com a identitat docent i
  d'administració — cobreix el tauler del professorat i la cistella de recursos,
  i elimina els tokens manuals.
- [ ] Dockeritzar `recursos-api` i el frontend de `recursos` com a mòdul del
  stack (perfil Compose propi, persistència a `data/recursos-*`).
- [ ] Integrar la identitat docent (Authentik/OIDC) al Banc de recursos perquè
  els preferits queden al compte.
- [ ] Cistella de recursos al tauler: endpoint `GET /api/teacher/favorites`
  (sessió docent) que resol els preferits a recurs complet.
- [ ] Assignar recursos de la cistella als recorreguts; qualsevol recurs és
  assignable, només els d'app (JClic/H5P/EduHoot) generen puntuació i resultats.
- [ ] Migració de preferits anònims → OIDC (diferida mentre no hi haja comptes
  reals al Banc de recursos).

### Fita 6 — Privacitat per a centres

**Resultat:** un centre pot entendre què dades guarda el stack i què no guarda.

- [ ] Crear `docs/PRIVACITAT.md` amb explicació clara de codi + PIN,
  pseudonimització i límits.
- [ ] Crear fitxa docent imprimible.
- [ ] Crear informació breu per a famílies.
- [ ] Crear fitxa tècnica per a direcció/DPD.
- [ ] Revisar que cap document prometa anonimat absolut.

### Fita 7 — Distribució

**Resultat:** la v1 es pot portar a una màquina neta.

- [ ] Revisar `IMAGE_REGISTRY`, `IMAGE_TAG` i `VERSION`.
- [ ] Exportar imatges amb `make export-images`.
- [ ] Provar `make load-images` en un entorn net o simulat.
- [ ] Publicar instruccions de `docker compose pull` amb registre propi.
- [ ] Mantindre canals de versió sense usar `latest`.

## Criteris de no-go

No es dona una versió per preparada si:

- `make release-check` falla en una màquina amb Docker funcional;
- cal editar secrets a mà dins del codi o de les imatges;
- el professorat no pot recuperar o regenerar credencials;
- no hi ha forma documentada de parar, arrancar, copiar i restaurar dades;
- la documentació confon pseudonimització amb anonimat complet;
- algun flux demana noms, correus o identificadors institucionals d'alumnat.

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
Nextcloud complet, WordPress, Forgejo, DokuWiki i la instància real
`edutictac.es`.
