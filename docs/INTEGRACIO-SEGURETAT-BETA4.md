# Integració de les correccions de seguretat sobre beta4

Data: 24-10-2026.

La integració unix `main` (`2eefa68`) amb la cadena de deu commits de
`fix/admin-csrf` a `fix/ingress-caddy` (`b0d0cea`). Conserva la beta4 publicada,
els fitxers d'aula i la configuració federada, i incorpora A3–A9:
backups age, administració restringida, CSRF, sessions OIDC revocables de
12 hores, secrets de producció, tokens per aplicació, digests/rollback,
cabeceres de seguretat i ingress TLS opcional del portal.

S'han resolt els conflictes de README, Settings i migracions sense renumerar
les migracions publicades: fitxers d'aula continua en `id-api:2` i les sessions
OIDC usen `id-api-oidc:1`. Una prova de migració des de beta4 comprova que els
registres de fitxers es conserven després de dos arranques.

## Correccions descobertes durant la integració

- Caddy restringix `/admin` abans del proxy: nginx veu l'adreça Docker de
  Caddy i per si sol no pot distingir un client LAN. La prova TLS real en una
  xarxa Docker aïllada retorna 200 per a salut i 403 per a `/admin/`,
  `//admin/`, `/%61dmin/`, `/foo/../admin/` i `/admin%2f`.
- La captura dels digests anteriors escriu dins de `backups/<còpia>/` i falla
  si falta algun digest dels serveis seleccionats. No intenta resoldre
  imatges de perfils desactivats.
- El rollback també restaura `RECURSOS_TAG`. Un error després de fixar
  imatges activa rollback encara que el refresc no haja canviat cap tag.
  Tres proves executen els scripts reals amb Docker simulat: actualització,
  refresc sense canvi de tag i digest anterior absent.
- La protecció d'origen respecta l'origen públic explícit del Rebost només
  en `/api/assets/`; les altres mutacions no hereten eixa autorització.
- Les proves de pestanyes de l'alumnat esperen l'esdeveniment de tancament
  del navegador abans de comptar les pàgines obertes.

## Validació

- `npm ci` i `npm run build:portal`: correctes; bundles versionats idèntics.
- `make release-check`: correcte en un stack aïllat amb dades temporals,
  366 proves de navegador i flux docent → alumne → puntuació → resultats.
- `npm run test:play`: 62 proves de navegador i 2 proves de service worker.
- Suite Python completa inicial: 599 correctes, 2 fallides i 14 optatives
  omeses. Les fallides eren Twisted absent en la venv i l'origen públic de
  Rebost bloquejat pel nou middleware. Després d'instal·lar les dependències
  declarades i corregir Rebost, passen el cas Twisted i les 40 proves de
  sessió, admin i origen públic. Les 14 omeses corresponen a 12 casos amb
  Playwright Python no instal·lat i 2 proves Docker que requerixen opt-in.
- Proves de migracions: 5 correctes. Digests, rollback i versions: 21
  correctes, incloses les noves regressions.
- Imatges API, portal i admin construïdes. Després de l'últim canvi de
  backend, API reconstruïda i flux funcional repetit correctament.
- Caddy valida la configuració i Compose valida l'override TLS.
- `.deb` experimental `0.1.1~beta5~candidate1` construït en `dist/` i auditat
  sense rutes de treball ni credencials. No és una release publicada ni un
  instal·lador validat en LliureX: els tags candidats encara no es publiquen.

## Punt de continuació

Esta integració no substituïx la beta4 distribuïda. `VERSION`, els defaults
de paquet i els tags beta4 publicats es mantenen. Abans de publicar cal
assignar una versió nova, publicar les imatges coordinades i els digests,
validar el paquet en instal·lació/actualització, i actualitzar APT i les
notes de release. No reconstruir ni sobreescriure els artefactes beta4.

Producció i els centres encara requerixen el desplegament corresponent.
L'ingress de les apps, la política de certificats, 2FA/systemd i els blocs B
i C continuen pendents en `../PENDIENTE.md` de l'espai de treball.
