# Fitxa tècnica per a direcció, coordinació TIC o DPD

> Document de suport per al centre que desplega el stack EduTicTac Commons.
> No substitueix la revisió de l'Administració educativa ni del Delegat/da de
> Protecció de Dades.

## Arquitectura

- Serveis del stack autoallotjats al centre (portal + `id-api` + EduHoot
  opcional).
- **Identitat de l'alumnat**: codi públic + PIN, gestionada per `id-api`, sense
  dades identificatives.
- **Identitat del professorat**: token d'accés en aquesta versió; previst
  Authentik/OIDC en la v2.
- Grups opacs generats pel sistema (no identifiquen cap aula real).
- Rànquings vinculats al codi pseudònim, no al nom real.
- Panell docent d'estadístiques del grup i exportació CSV.
- Panell `/admin` local per a operacions tècniques (estat, backups,
  restauració i actualitzacions); s'ha de protegir amb token fort i no
  exposar-lo directament a internet.

## Taula de dades

| Dada | Es recull? | Finalitat | Conservació |
|---|---|---|---|
| Nom i cognoms de l'alumnat | No | — | — |
| Correu de l'alumnat | No | — | — |
| Identificador institucional (NIA…) | No | — | — |
| Data de naixement | No | — | — |
| Centre / curs / aula reals | No (només codi de grup opac) | Evitar informació innecessària | — |
| Codi públic | Sí | Identificació dins l'activitat | A decidir pel centre |
| PIN | No en text pla (hash) | Autenticació | Hash mentre la identitat estiga activa |
| Puntuació / progrés | Sí | Activitat educativa | A decidir pel centre |
| Informes EduHoot | Si el mòdul està actiu | Resultats de sessió | A decidir pel centre |
| Sessió tècnica | Sí | No reintroduir el PIN | 180 dies |
| Adreça IP | Transitària (rate limiting) | Seguretat | No s'emmagatzema de manera duradora |
| Cookies | Sí, tècniques | Sessió | Segons caducitat de la cookie |

## Mesures de seguretat

- PIN amb hash PBKDF2-SHA256 + salt (210 000 iteracions); mai en text pla.
- Cookies `HttpOnly`/`Secure`/`SameSite=Lax`.
- `Rate limiting` per adreça IP.
- Revocació de credencials i de sessions; regeneració de PIN.
- HTTPS en desplegament real.
- Codi font obert i auditable.
- Còpies de seguretat amb restauració verificada (retenció 7 diàries / 4
  setmanals / 6 mensuals).
- Actualitzacions guiades amb backup previ obligatori.
- Proves reproduïbles de funcionament (`make release-check`) i de
  reset/restauració en entorn controlat.

## Pseudonimització, no anonimat

El sistema fa **pseudonimització**: el professorat pot relacionar el codi amb
l'alumne/a **fora del sistema**. Per tant no es pot descriure com a anonimat
absolut en cap document oficial.

## Decisions que ha de prendre el centre

- Base jurídica del tractament.
- Qui pot crear grups i credencials.
- Qui conserva, si cal, la correspondència codi ↔ alumne/a real.
- Termini de conservació de grups, puntuacions i informes EduHoot.
- Política de còpies de seguretat: ubicació, xifrat, accés i eliminació.
- Procediment per atendre peticions d'accés o eliminació.
- Procediment d'incidències: pèrdua de targetes, ús indegut d'un PIN o accés
  no autoritzat al panell docent/admin.

## Procediment mínim recomanat per a un pilot

1. Completar aquesta fitxa abans de començar.
2. Canviar tots els tokens demo de `.env`.
3. Activar HTTPS si hi ha accés des de dispositius diferents del servidor.
4. Generar credencials només per al grup pilot.
5. Informar famílies/professorat amb `FAMILIES.md` i `FITXA-DOCENT.md`.
6. Fer `make backup` abans i després de la prova.
7. En tancar el pilot, decidir si es conserven resultats, s'exporten o es
   revoquen/elimina el grup segons la política del centre.

## Plantilla per a completar pel centre

| Camp | Valor |
|---|---|
| Centre / entitat | |
| Ubicació del servidor (proveïdor / país) | |
| Responsable del tractament | |
| Delegat/da de Protecció de Dades (contacte) | |
| Base jurídica del tractament | |
| Període de conservació d'identitats i puntuacions | |
| Procediment d'incidències de seguretat | |
| Procediment d'exportació i eliminació de dades | |
| Inventari final de serveis del desplegament | |

<!-- updated: 2026-09-15 -->
