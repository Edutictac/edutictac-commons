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

Principi: **cap dada persistent sense backup** i **cap actualització sense
backup recent i verificable**.

- [ ] Documentar política de backup per servei: `id-api`, EduHoot/Mongo,
  uploads, logs rellevants, configuració local i futurs mòduls.
- [ ] Ampliar `make backup` perquè cobrisca tots els serveis amb dades
  persistents activats.
- [ ] Ampliar `make restore` i documentar restauració pas a pas per servei.
- [ ] Afegir verificació mínima de backup/restauració en entorn local segur.
- [ ] Crear panell `/admin` només per administració tècnica.
- [ ] Mostrar en `/admin` estat de serveis, versió instal·lada i últim backup.
- [ ] Permetre crear backup manual des del panell.
- [ ] Llistar backups disponibles i avisar si algun servei no està cobert.
- [ ] Consultar `IMAGE_REGISTRY` i detectar si hi ha una versió nova
  disponible.
- [ ] Oferir actualització guiada d'imatges: backup previ obligatori,
  descàrrega, reinici, healthchecks i rollback documentat.
- [ ] Definir canals `stable`, `testing` i `dev`; centres en `stable` per
  defecte.

### Fita 4 — EduHoot com a primera activitat integrada

**Resultat:** el professorat pot crear o seleccionar una activitat EduHoot i
l'alumnat pot completar-la amb la mateixa identitat pseudònima.

- [ ] Documentar exactament què espera EduHoot del servei d'identitat.
- [ ] Validar el flux amb `COMPOSE_PROFILES=eduhoot`.
- [ ] Crear una prova funcional que cobrisca portal + identitat + EduHoot.
- [ ] Evitar que l'alumnat necessite cap compte personal.
- [ ] Documentar persistència local d'EduHoot (`data/eduhoot-*`) i còpia de
  seguretat.

### Fita 5 — Privacitat per a centres

**Resultat:** un centre pot entendre què dades guarda el stack i què no guarda.

- [ ] Crear `docs/PRIVACITAT.md` amb explicació clara de codi + PIN,
  pseudonimització i límits.
- [ ] Crear fitxa docent imprimible.
- [ ] Crear informació breu per a famílies.
- [ ] Crear fitxa tècnica per a direcció/DPD.
- [ ] Revisar que cap document prometa anonimat absolut.

### Fita 6 — Distribució

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
- part de P0-8: repositori públic, instruccions reproduïbles i mecanisme de
  versionat;
- instal·lador v1 del nucli replicable.

Queden fora d'aquest repo, excepte com a documentació o integració futura:
Nextcloud complet, WordPress, Forgejo, DokuWiki i la instància real
`edutictac.es`.
