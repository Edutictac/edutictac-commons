# Privacitat del stack EduTicTac Commons

> Repo: `edutictac-commons` · Versió: `0.1.0-alpha`
>
> Aquest document descriu què guarda el stack **de manera real**, què no
> guarda i amb quines mesures de seguretat. No és material legal: és
> documentació tècnica de privacitat per a qui desplega el stack.

## Què és

EduTicTac Commons és un conjunt d'eines educatives lliures i autoallotjables.
Aquest stack conté el nucli: el portal (tauler docent i vista d'alumnat),
l'`id-api` (credencial pseudònima) i, opcionalment, EduHoot.

## Model de credencial: codi + PIN

L'alumnat **no es registra amb la seua identitat real**. El professorat genera
credencials formades per:

- un **codi públic** de 3 caràcters (per exemple `K7P`, sense caràcters
  ambigus);
- un **PIN privat** de 4 o 6 dígits.

Amb aquest codi + PIN l'alumnat pot participar en activitats, conservar progrés
entre dispositius i aparéixer en rànquings. Tot això **sense** que el servidor
conega el nom, el correu ni cap identificador institucional de l'alumne/a.

## Dades que es guarden

### `id-api` (base SQLite `data/id.db`)

| Dada | Contingut | Observacions |
|---|---|---|
| Grups | `id` opac, codi de grup (`G7F4K2`), `tenant_id`, `created_by_teacher_id`, dates | El codi de grup és opac, no identifica cap aula real |
| Identitats | `id` opac, `public_code`, `pin_hash`, `active`, dates | **Mai** nom ni identificador d'alumne/a |
| Sessions | `token_hash` (sha256), data d'expiració, `revoked_at` | La sessió no conté el codi en clar |
| Puntuacions | `app_id`, `activity_id`, `assignment_id`, `score`, metadades, data | Vinculades a la identitat pseudònima |
| Assignacions | `app_id`, `activity_id`, `title`, `group_id`, `created_by_teacher_id` | Activitats proposades pel professorat |

### EduHoot (opcional, perfil `eduhoot`)

| Dada | Contingut |
|---|---|
| Base Mongo `kahootDB` | qüestionaris, partides i comptes d'EduHoot |
| `data/eduhoot-uploads/` | imatges pujades a EduHoot |
| `data/eduhoot-logs/` | informes de sessió amb resultats reals de l'alumnat |

## Dades que **no** es guarden

El `id-api` no emmagatzema en cap moment:

- nom ni cognoms de l'alumnat;
- correu electrònic de l'alumnat;
- identificadors institucionals (NIA, DNI, etc.);
- data de naixement;
- centre, curs ni aula reals (només el codi de grup opac);
- cap relació automàtica entre l'alumne/a real i el codi pseudònim.

## PIN

El PIN és privat i **mai es guarda en text pla**. El servidor conserva només un
hash PBKDF2-SHA256 amb salt (210 000 iteracions). El PIN només es mostra **una
vegada**, en el moment de generar o regenerar la credencial. Si es perd, es
regenera (mai es recupera l'antic).

## Cookies

| Cookie | Ús | Caducitat | Propietats |
|---|---|---|---|
| `edutictac_id` | sessió de l'alumnat | 180 dies | `HttpOnly`, `Secure`, `SameSite=Lax` |
| `edutictac_teacher` | sessió del professorat | 8 hores | `HttpOnly`, `Secure`, `SameSite=Lax` |

Són cookies tècniques de sessió, firmades (HMAC). El portal també pot guardar en
`localStorage` del navegador un estat de demostració local
(`edutictac-commons-demo-state`), mai dades personals.

## Mesures de seguretat

- PIN amb hash PBKDF2-SHA256 + salt.
- Cookies `HttpOnly`/`Secure`/`SameSite=Lax`.
- Limitació d'intents (`rate limiting`) per adreça IP.
- Revocació de credencials i de sessions.
- Regeneració de PIN sense recuperar l'antic.
- Connexió HTTPS en desplegament real.
- Codi font obert i auditable.
- Còpies de seguretat amb restauració verificada.

## Conservació

| Element | Conservació per defecte |
|---|---|
| Sessions d'alumnat | 180 dies (renovables) |
| PIN (hash) | mentre la identitat estiga activa |
| Còpies de seguretat | retenció 7 diàries / 4 setmanals / 6 mensuals |
| Identitats i puntuacions | **a decidir pel centre** (vegeu `DIRECCIO-DPD.md`) |

## Pseudonimització ≠ anonimat

Aquest sistema fa **pseudonimització**, no anonimat absolut:

- el professorat pot conéixer, **fora del sistema**, quina alumna o alumne
  correspon a cada codi (per exemple, en repartir les targetes);
- l'adreça IP pot aparéixer de manera transitòria en el `rate limiting`;
- les puntuacions queden vinculades a un codi estable i, si el professorat
  conserva la correspondència, es poden relacionar amb una persona.

Per això aquesta documentació evita deliberadament el terme «anonimat» i parla
de «codi pseudònim» i de «pseudonimització».

## Analítica i serveis de tercers

El stack no inclou analítica, publicitat, rastreig ni fonts externes. Les
imatges i les fonts es serveixen des del propi desplegament.

## Contacte i dades del centre

Les dades d'ubicació del servidor, el responsable del tractament i el contacte
de privacitat els ha de completar el centre en `DIRECCIO-DPD.md`.

<!-- updated: 2026-09-15 -->
