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

## Pseudonimització, no anonimat

El sistema fa **pseudonimització**: el professorat pot relacionar el codi amb
l'alumne/a **fora del sistema**. Per tant no es pot descriure com a anonimat
absolut en cap document oficial.

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
