# Fitxa tècnica per a direcció, coordinació TIC o DPD

> Document de suport per al centre que desplega el stack EduTicTac Commons.
> No substitueix la revisió de l'Administració educativa ni del Delegat/da de
> Protecció de Dades.

## Arquitectura

- Serveis del stack autoallotjats al centre (portal + `id-api` + Authentik +
  EduHoot i Recursos opcionals).
- **Identitat de l'alumnat**: codi públic + PIN, gestionada per `id-api`, sense
  dades identificatives.
- **Identitat del professorat i de l'administració**: Authentik (OIDC),
  autoallotjat pel mateix centre. L'`id-api` no crea contrasenyes pròpies ni
  copia nom, correu o grups d'Authentik: només guarda el `sub` opac i un
  pseudònim derivat per HMAC. Vegeu `authentik.md`.
- Grups opacs generats pel sistema (no identifiquen cap aula real).
- Rànquings vinculats al codi pseudònim, no al nom real.
- Panell docent d'estadístiques del grup i exportació CSV.
- Catàleg de recursos (`recursos`/`recursos-api`, opcional): banc de materials
  educatius, poblable manualment o per sincronització amb un canal de
  continguts extern de materials ja publicats amb llicència oberta (autor i
  llicència del material, no dades de l'alumnat ni del professorat).
- Panell `/admin` local per a operacions tècniques (estat, backups,
  restauració i actualitzacions); l'accés requereix identitat Authentik amb
  rol `administrador` o l'usuari `ADMIN_OIDC_USERNAME`; el portal només
  l'exposa a localhost, la Tailnet o un túnel SSH, mai a la LAN directa.

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
| Nom/correu/grups del professorat (Authentik) | No a `id-api` (resta al proveïdor Authentik) | Autenticació docent/admin | Gestionat pel centre en Authentik |
| Metadades de recursos del catàleg (autor, llicència, proveïdor) | Si el mòdul Recursos està actiu | Atribució i tria pedagògica de materials | Es reemplaça amb cada sincronització del catàleg |

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
- Gestió dels comptes d'Authentik del professorat/administració (alta, baixa
  i grups), ja que eixes dades resten en Authentik, no en `id-api`.
- Si activar el mòdul Recursos i confiar en el canal de continguts extern, o
  mantindre només materials propis del centre.

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

<!-- updated: 2026-09-19 -->
