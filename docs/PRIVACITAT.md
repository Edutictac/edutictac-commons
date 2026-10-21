# Privacitat del stack EduTicTac Commons

> Repo: `edutictac-commons` · Versió: `0.1.1-alpha`
>
> Aquest document descriu què guarda el stack **de manera real**, què no
> guarda i amb quines mesures de seguretat. No és material legal: és
> documentació tècnica de privacitat per a qui desplega el stack.

## Abast i responsabilitat

Aquest document descriu el comportament del programari. Abans d'usar-lo amb
alumnat real, el centre ha de completar la fitxa `DIRECCIO-DPD.md` amb el seu
responsable del tractament, contacte DPD, ubicació del servidor, base jurídica,
terminis de conservació i procediments d'atenció de drets.

## Què és

EduTicTac Commons és un conjunt d'eines educatives lliures i autoallotjables.
Aquest stack conté el nucli: el portal (tauler docent i vista d'alumnat),
l'`id-api` (credencial pseudònima) i, opcionalment, EduHoot, el catàleg de
recursos (`recursos`/`recursos-api`) i Authentik com a proveïdor d'accés per
al professorat i l'administració.

## Identitat del professorat i de l'administració: Authentik

El professorat i l'administració **no accedeixen amb un token compartit**:
inicien sessió amb Authentik, el proveïdor OIDC autoallotjat pel mateix
centre. L'`id-api` no crea una base de contrasenyes pròpia ni copia nom,
correu ni grups d'Authentik: després del login només conserva una cookie de
sessió firmada amb el `sub` opac del proveïdor i un pseudònim derivat per
HMAC. La resta de dades (nom, correu, grups) resta a Authentik, que el
centre gestiona i allotja ell mateix. Vegeu `authentik.md` per al detall
tècnic.

El mode codi + PIN de l'alumnat és independent d'Authentik i continua
funcionant igual encara que Authentik no estiga configurat.

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

### Catàleg de recursos (opcional, perfil `recursos`)

| Dada | Contingut | Observacions |
|---|---|---|
| Base SQLite `recursos-api` (`data/recursos.db`) | títol, descripció, autor, llicència, proveïdor, tipus, matèria, etapa, URL d'origen de cada recurs | Metadades de continguts, **no** dades personals de l'alumnat del centre |
| Favorits i valoracions del professorat | vinculats al pseudònim OIDC del docent, no a l'índex públic | Igual que la resta d'identitat docent: pseudònima |

El catàleg pot poblar-se manualment o sincronitzant-se amb un canal de
continguts extern (`content_sync`, veure `CONTENT_CATALOG_BASE_URL`). Els
recursos importats d'eixe canal són materials de tercers ja publicats amb
llicència oberta (per exemple JClic, H5P); l'autoria i la llicència que es
guarden són les del material, no dades de l'alumnat ni del professorat del
centre.

## Dades que **no** es guarden

El `id-api` no emmagatzema en cap moment:

- nom ni cognoms de l'alumnat;
- correu electrònic de l'alumnat;
- identificadors institucionals (NIA, DNI, etc.);
- data de naixement;
- centre, curs ni aula reals (només el codi de grup opac);
- cap relació automàtica entre l'alumne/a real i el codi pseudònim.

Tampoc del professorat ni de l'administració: l'`id-api` no copia el nom,
el correu ni els grups que gestiona Authentik; només guarda el `sub` opac i
un pseudònim derivat per HMAC.

## PIN

El PIN és privat i **el servidor mai el guarda en text pla**. Conserva només un
hash PBKDF2-SHA256 amb salt (210 000 iteracions). El PIN només es mostra **una
vegada**, en el moment de generar o regenerar la credencial. Si es perd, es
regenera (mai es recupera l'antic).

El tauler docent manté els PIN acabats de generar només en memòria del navegador,
per a mostrar el lot i permetre'n la impressió o la descàrrega explícita en CSV.
No es guarden en localStorage, sessionStorage o IndexedDB. Desapareixen en
recarregar, canviar de grup, tancar/perdre la sessió o abandonar la pàgina;
les respostes tardanes d'una operació anterior no els tornen a mostrar. Els
fitxers de targetes o CSV amb PIN són exportacions demanades pel docent. Les
exportacions ordinàries del grup no permeten recuperar els PIN.


## Cookies

| Cookie | Ús | Caducitat | Propietats |
|---|---|---|---|
| `edutictac_id` | sessió de l'alumnat | 180 dies | `HttpOnly`, `SameSite=Lax`; `Secure` en HTTPS |
| `edutictac_teacher` | sessió del professorat | 8 hores | `HttpOnly`, `SameSite=Lax`; `Secure` en HTTPS |

Són cookies tècniques de sessió, firmades (HMAC). El portal també pot guardar en
`localStorage` del navegador un estat de demostració local
(`edutictac-commons-demo-state`), mai dades personals.

En una demo local sense HTTPS, el stack pot configurar
`EDUTICTAC_ID_COOKIE_SECURE=0` perquè el navegador accepte les cookies. En un
desplegament real s'ha d'usar HTTPS i cookies `Secure`.

## Mesures de seguretat

- PIN amb hash PBKDF2-SHA256 + salt.
- Cookies `HttpOnly`/`Secure`/`SameSite=Lax`.
- Limitació d'intents (`rate limiting`) per adreça IP.
- Revocació de credencials i de sessions.
- Regeneració de PIN sense recuperar l'antic.
- Connexió HTTPS en desplegament real.
- Codi font obert i auditable.
- Còpies de seguretat amb restauració verificada.
- Tests funcionals reproduïbles (`make release-check`, `make
  test-eduhoot-flow` i, en entorn controlat, `CONFIRM_RESET_TEST=1 make
  test-reset-flow`).

## Conservació

| Element | Conservació per defecte |
|---|---|
| Sessions d'alumnat | 180 dies (renovables) |
| PIN (hash) | mentre la identitat estiga activa |
| Còpies de seguretat | retenció 7 diàries / 4 setmanals / 6 mensuals |
| Identitats i puntuacions | **a decidir pel centre** (vegeu `DIRECCIO-DPD.md`) |

Recomanació inicial per a pilots: revisar grups i puntuacions en acabar la
prova, exportar només allò necessari i eliminar o revocar credencials que ja no
s'hagen d'usar.

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

El stack no inclou analítica, publicitat ni rastreig. Authentik és un
proveïdor extern **autoallotjat pel mateix centre** (no un tercer extern),
igual que el canal de sincronització de continguts, que descarrega només
materials de tercers ja publicats amb llicència oberta.

Si el centre afegeix serveis externs, plugins, proxies o analítica pròpia, ha
d'actualitzar aquesta documentació i la fitxa `DIRECCIO-DPD.md`.

## Drets i eliminació

El stack no coneix la identitat real de l'alumnat. Per això, qualsevol petició
d'accés, rectificació o eliminació s'ha de gestionar des de la correspondència
que conserve el centre entre alumne/a real i codi pseudònim, si existeix.

Operativament, el professorat pot revocar credencials i regenerar PINs des del
tauler. La supressió completa de dades d'un grup o d'un pilot s'ha de fer amb
un procediment del centre, després de comprovar si cal conservar evidències o
resultats educatius.

## Contacte i dades del centre

Les dades d'ubicació del servidor, el responsable del tractament i el contacte
de privacitat els ha de completar el centre en `DIRECCIO-DPD.md`.

<!-- updated: 2026-09-19 -->
