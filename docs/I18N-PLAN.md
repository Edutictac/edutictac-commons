# Plan: soporte multi-idioma (es/ca/va/en) en els taulers de Commons

> Document de disseny. Implementat 2026-09-15: mòduls `i18n.js` a portal i admin, selector d'idioma a les 4 pàgines i text migrat amb claus `data-i18n*` / `t()`. Vegeu `services/portal/public/i18n.js` i `admin/public/i18n.js`.

## Context

EduTicTac Commons no té cap mecanisme d'idioma implementat: les 4 pàgines dels "taulers" (`<html lang="ca">`, literalment titulades "Tauler docent" / "Tauler alumnat" / "Panell d'administració") tenen tot el text hardcodejat en català, tant al marcat estàtic com al JS que genera contingut dinàmic (taules, missatges d'error/estat). L'objectiu és que cada centre puga fer servir el portal i el panell admin en el seu idioma, amb detecció automàtica de l'idioma del navegador seguint l'estàndard (BCP-47/RFC 4647) i canvi manual persistent.

Idiomes acordats: **es, ca, va, en**. `va` (valencià) no és un subtag BCP-47 reconegut pels navegadors, així que no es pot autodetectar de forma literal; a més `ca` i `va` comparteixen la majoria del text, així que `va` s'implementa com un **overlay d'overrides sobre `ca`** (patró estàndard d'herència de locale usat per CLDR/ICU, gettext, i18next, Java ResourceBundles), no com a diccionari paral·lel complet.

Abast acordat: **Portal** (`index.html`, `teacher.html`, `student.html`, `app.js`) + **Admin** (`index.html`, `app.js`). Queda fora l'HTML generat per `services/id-api/main.py` (fitxes imprimibles).

## Disseny

### Idiomes i fallback
- Diccionaris complets: `es`, `ca`, `en`.
- `va`: objecte petit amb només les claus la redacció valenciana de les quals difereix de la catalana. Comença quasi buit i creix amb el temps.
- Cadena de resolució de `t(key)`: per a `lang==='va'` → `va` → `ca` → `es` (fallback final) → la pròpia `key` com a últim recurs visible en QA. Per a la resta d'idiomes, cadena d'un sol esglaó + fallback a `es`.
- En donar d'alta una clau nova: per defecte s'escriu en `es`/`ca`/`en`; només s'afegeix a `va` si el text realment canvia.

### Estructura d'arxius
Dos mòduls i18n **independents** (portal i admin són imatges Docker diferents, sense arxiu compartit ni bundler — confirmat en `compose.yml`/Dockerfiles):
- **Nou** `services/portal/public/i18n.js` → exposa `window.i18nPortal` (`t`, `getLang`, `setLang`, `applyStaticTranslations`)
- **Nou** `admin/public/i18n.js` → exposa `window.i18nAdmin`, mateixa forma

Cadascun és una IIFE amb `SUPPORTED_LANGS = ['es','ca','va','en']`, `FALLBACK_LANG = 'es'`, el diccionari `translations`, i `STORAGE_KEY` propi (`edutictac-portal-lang` / `edutictac-admin-lang`). No es crea un tercer arxiu de config central — no aporta valor sense bundler.

Separat de `app.js` perquè: (a) necessita executar-se com més prompte millor en `<head>`, abans que `app.js` (que continua carregant-se al final de `<body>`, sense canvis en la seua posició) existisca; (b) responsabilitat única — no barrejar ~200 entrades × 4 idiomes amb la lògica de negoci de `app.js`.

### Detecció d'idioma (`detectLang()`)
1. `localStorage.getItem(STORAGE_KEY)` si està en `SUPPORTED_LANGS` → guanya sempre (preferència manual persistent).
2. Si no hi ha valor guardat, recórrer `navigator.languages` (fallback a `navigator.language`/`userLanguage`) en ordre de preferència de l'usuari, aplicant *lookup* BCP-47 per subtag primari:
   - si el tag conté `valencia` explícit (p.ex. `ca-ES-valencia`) → `va`
   - si el subtag primari és `ca` → `va` (regla de negoci: públic objectiu = Comunitat Valenciana; `navigator` mai retorna `"va"` literal, així que el català detectat s'interpreta com a valencià; `ca` continua disponible manualment al selector)
   - si el subtag primari està en `SUPPORTED_LANGS` (`es`/`en`) → eixe idioma
3. Si res coincideix → `FALLBACK_LANG` (`es`).

`setLang(newLang)` valida, persisteix en `localStorage`, actualitza `document.documentElement.lang` (amb `va` → s'exposa com a `ca`, ja que `va` no és un subtag HTML vàlid — distinció documentada entre idioma intern de l'app i atribut `lang` del document), i **actualitza el DOM en calent sense recarregar** (hi ha estat de sessió actiu en memòria a `app.js` que es perdria amb un reload).

### Selector d'idioma
Grup de botons `data-lang="es|ca|va|en"` en el `<header class="topbar">` de les 4 pàgines (mateix lloc on ja hi ha `#apiStatus`), estil `.lang-switcher` reutilitzant convenció visual d'EduHoot. Un únic listener de delegació d'esdeveniments dins de `i18n.js` (`click` → `e.target.closest('[data-lang]')` → `setLang(...)`), sense `onclick` inline repetit per botó/pàgina.

### Migració del text (patró, no llista exhaustiva)
Convenció de claus: `namespace.seccio.camp` (namespaces: `common`, `home`, `teacher`, `student` en portal; `common`, `login`, `status`, `backup`, `images` en admin).

- **HTML estàtic**: afegir `data-i18n="clau"` (→ `textContent`), `data-i18n-placeholder="clau"` (→ `.placeholder`), `data-i18n-title="clau"` (→ `.title`/`aria-label`) mantenint el text català original com a contingut per defecte al markup (fallback visual + referència llegible).
- **Taules/labels dinàmics a `app.js`** (p.ex. `services/portal/public/app.js:216-234`): substituir literals `label: "Codi"` per `label: window.i18nPortal.t("teacher.table.code")`. Important: `t()` mai embolica dades del backend (eixes continuen passant per `escapeHtml()` com ara).
- **Missatges d'error/estat** (p.ex. `app.js:292-298` `checkHealth()`, `app.js:376` etc. `throw new Error("Entra primer com a docent.")`): substituir per `window.i18nPortal.t("common.apiStatus.ok")` / `t("teacher.errors.loginFirst")`.

Ordre de migració recomanat (incremental i verificable en cada pas):
1. `i18n.js` (portal i admin) amb 2-3 claus de prova + selector cablejat a les 4 pàgines — validar el mecanisme end-to-end abans de tocar contingut real.
2. `index.html` (34 línies, la més petita).
3. `teacher.html` + funcions de `app.js` relacionades amb docent.
4. `student.html` + funcions de `app.js` relacionades amb alumnat.
5. `admin/public/index.html` + `admin/public/app.js` (pot anar en paral·lel, mòdul independent).

### Evitar el flash d'idioma incorrecte
- `<script src="/i18n.js">` com a **primer script del `<head>`**, sense `defer`/`async` → `detectLang()` + `document.documentElement.setAttribute('lang', ...)` s'executen de forma síncrona abans de pintar el body.
- Tècnica "hide until ready": la IIFE afegeix `html.classList.add('i18n-pending')`; a `styles.css` (portal i admin): `html.i18n-pending body { visibility: hidden; }`; a `DOMContentLoaded` es crida `applyStaticTranslations()` i es treu la classe. Com és un script local sense latència de xarxa, el body queda ocult microsegons — millora deliberada respecte del propi EduHoot, que no resol aquest flash.
- `app.js` no canvia de posició (continua al final de `<body>`), només comença a cridar `window.i18nPortal.t(...)`.

## Arxius afectats

- **Nou** `services/portal/public/i18n.js`
- **Nou** `admin/public/i18n.js`
- `services/portal/public/index.html`, `teacher.html`, `student.html` — afegir `data-i18n*` + selector + `<script>` a `<head>`
- `services/portal/public/app.js` — major volum de migració (~148 strings: taules, missatges)
- `services/portal/public/styles.css` — regla anti-flash + `.lang-switcher`
- `admin/public/index.html` — afegir `data-i18n*` + selector + `<script>` a `<head>`
- `admin/public/app.js` — ~54 strings d'estat del backend Docker
- `admin/public/styles.css` — regla anti-flash + `.lang-switcher`

## Verificació

Build i arrancada (sense bind-mount de `public/`, cal reconstruir imatge després de cada canvi):
```bash
cd ~/github/Edutictac/edutictac-commons
make up   # docker compose --env-file .env -f compose.yml up --build -d
```
- Portal: `http://localhost:${PORTAL_PORT:-8082}/` (+ `/teacher.html`, `/student.html`)
- Admin: `http://127.0.0.1:${ADMIN_PORT:-8091}/` (només loopback)

Per iterar més ràpid en un sol servei: `docker compose --env-file .env -f compose.yml build portal` (o `admin`) + `make up`.

Comprovacions manuals en DevTools:
1. `localStorage.clear()` en cada origen (portal i admin són orígens diferents) → recarregar → idioma segons autodetecció.
2. Forçar `navigator.languages` des de la consola abans de recarregar: `['ca-ES']` → `va`; `['ca-ES-valencia']` → `va`; `['en-US','es-ES']` → `en`; `['fr-FR']` (no suportat) → `es`.
3. Triar idioma manualment amb el selector, recarregar → ha de prevaldre sobre `navigator.languages`.
4. Amb CPU throttling alt, confirmar que no es veu el català original abans de la traducció (passa directe d'ocult a l'idioma correcte).
5. Canviar idioma a `index.html`, navegar a `teacher.html`/`student.html` → l'idioma persisteix (mateix origen/`localStorage`/`app.js`).
6. Canviar idioma a admin (`127.0.0.1:8091`, origen diferent) → no afecta el portal ni viceversa.
7. Amb idioma `va` actiu, esborrar temporalment una clau de `va` a `i18n.js` → ha de caure a `ca` sense mostrar la clau crua.
8. Amb idioma `va` actiu, inspeccionar `<html lang>` → ha de mostrar `ca` (no `va`).
