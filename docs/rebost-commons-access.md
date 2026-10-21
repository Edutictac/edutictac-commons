# Accés compartit de Commons, Rebost i Blocs

Implementat, verificat i activat en l'stack local el 20-10-2026. Sense publicació externa.

## Com funciona

`compose.rebost-blocs.yml` és un complement opcional del Compose existent. Incorpora
la imatge estàtica de Blocs com a editor intern, sense port públic, API d'identitat ni
base de dades addicionals. Reutilitza el Dockerfile del repositori germà
`../edutictac-blocs`; es pot configurar `BLOCS_SOURCE_DIR` i `BLOCS_TAG`.

El portal carrega les ubicacions nginx del complement només quan es munta el seu fitxer.
La portada mostra Blocs quan `/blocs/status` anuncia que la integració està habilitada.
Sense complement, la portada oculta l'enllaç i nginx continua arrancant normalment.

L'entrada `/blocs-access.html` comprova la sessió de **Rebost**, no sols una cookie de
professorat. Amb una sessió individual vàlida obri `/blocs/editor.html`. Sense sessió,
oferix codi/PIN, compte del centre si OIDC està habilitat i treball anònim en Blocs.
Un error de connexió mostra Reintentar; no s'anuncia un accés correcte.

El codi/PIN usa `/api/auth/student`, i després torna a l'entrada de Blocs. El login
OIDC conserva el seu callback actual de Commons i torna també a eixa entrada. No es crea
una altra aplicació Authentik ni una contrasenya per a Rebost. La sessió vella OIDC sense
registre revocable de Rebost requerix tornar a entrar. Els accessos tècnics compartits
no obtenen biblioteca individual.

El gestor central també retorna a `/assets/` després d'entrar amb codi/PIN. El tauler
només admet estos dos destins de retorn explícits; ignora URLs externes o altres rutes.
En el selector de Blocs l'accés continua obrint-se en una altra pestanya, conservant
el projecte i permetent Reintentar després de l'accés.

## Rutes i dades

| Ruta | Responsable |
| --- | --- |
| `/blocs-access.html`, `/student.html` | Portal i accés habitual de Commons |
| `/api/auth/oidc/*`, `/api/auth/student`, `/api/auth/logout` | `id-api` existent |
| `/assets/`, `/api/assets/v1/` | Rebost central amb la mateixa sessió |
| `/blocs/*` | Editor estàtic de Blocs, eliminant el prefix en el proxy |
| `/static/*` | Mitjans de la build actual de Blocs |

Les ubicacions `/blocs/` i `/static/` són `^~`, perquè el tractament general de JS/CSS
del portal no intercepte els fitxers de l'editor. No es reserven `/js/`, `/api/auth/me`
ni `/api/projects` per a Blocs. El proxy de Scratch queda en `/blocs/scratch-assets/`.
No s'envien cookies ni Authorization al servidor estàtic Blocs. Les peticions de Rebost
continuen dirigint-se a l'API central sota el mateix protocol, host i port.

`BLOCS_IDENTITY_MODE=anonymous` afecta exclusivament el proveïdor propi de comptes i
projectes de Blocs: **no desactiva la sessió de Commons ni la biblioteca privada**.
No es connecta el client de projectes Blocs a la resposta incompatible `/api/auth/me`
de Commons. Es mantenen guardat/obertura natius `.sb3`. Integrar projectes personals
en Commons requerirà un treball separat.

Els recursos d'usuari persistixen en la SQLite existent `data/id.db`, inclosa en les
còpies de Commons. El volum nou `blocs_catalog_cache` només és una cau regenerable
del catàleg Scratch; no conté imatges privades. No s'ha executat cap migració.

## Preparació del desplegament

Validació sense llegir `.env` ni mostrar secrets:

```sh
docker compose --env-file /dev/null -f compose.yml -f compose.rebost-blocs.yml config --quiet
```

Per a tornar a arrancar la candidata local amb Authentik gestionat pel wrapper existent:

```sh
./scripts/up-rebost-local.sh
```

El wrapper usa les imatges locals `rebost-local`, no baixa ni compila imatges i no altera
les etiquetes publicades. Es pot canviar la candidata amb `REBOST_LOCAL_TAG`.
Les referències OIDC d'esta instal·lació local es lligen de `pass`; es poden indicar amb
`REBOST_OIDC_CLIENT_ID_PASS` i `REBOST_OIDC_CLIENT_SECRET_PASS`, o proporcionar les variables
OIDC explícites. El wrapper compartit respecta ara estes variables sense substituir-les
per les d'una altra instància. Les referències anteriors del magatzem es conserven intactes.
Per a crear una altra candidata cal reconstruir portal/API i Blocs amb una etiqueta pròpia.
Conservar les variables OIDC i la clau de sessió actuals; no usar un `compose up`
genèric que buide eixa configuració. En HTTPS, configurar `REBOST_PUBLIC_ORIGIN` amb
l'origen públic i les cookies segures segons el proxy existent. No exposar `blocs:8080`.
No hi ha nous secrets, dependències, serveis comercials ni cap API d'IA.

En l'activació local s'ha reutilitzat la imatge API ja provada després de comprovar els
hashes de les fonts, reconstruït el portal i empaquetat la build Blocs validada amb la seua
etapa runtime original. S'han conservat les imatges anteriors i fet una còpia privada offline
de `data/` i del volum PostgreSQL abans d'arrancar. Només s'han activat API, portal, Blocs,
PostgreSQL i servidor/worker Authentik; els altres mòduls i les demos continuen intactes.
API, portal i Blocs tenen reinici `unless-stopped` en este complement.

La configuració local prèvia no coincidia amb el PostgreSQL conservat. La credencial original
s'ha verificat en memòria contra el verificador SCRAM del rol i s'han recuperat les tres
referències d'autenticació de la còpia operativa anterior. No s'han reinicialitzat dades,
canviat contrasenyes/rols ni mostrat secrets. Les rutes privades de recuperació es documenten
en la memòria operativa, mai en Git.

També s'ha recuperat l'enllaç amb el proveïdor OIDC Commons existent i afegit el callback
de la Tailnet sense eliminar els retorns locals anteriors. No s'ha creat una altra aplicació
OIDC ni rotat el seu secret. El formulari real d'Authentik està comprovat en navegador i
l'autenticació del client està verificada contra el seu endpoint de token amb un codi
deliberadament invàlid (rebutjat com `invalid_grant`, sense generar cap token).
La pàgina d'entrada respon HTTP 200 des d'un altre equip de la Tailnet.

## Verificació automàtica

```sh
python -m pytest -q tests/test_rebost_access.py tests/test_rebost.py tests/test_rebost_catalog.py
python scripts/verify-rebost-commons.py
```

La prova Docker requerix la imatge local `commons-rebost-check:local`, nginx 1.27-alpine,
nginx-unprivileged 1.27-alpine, la build del repositori germà, Playwright, Chromium i Pillow.
No baixa imatges: usa `--pull=never`. Crea una xarxa interna per a API/editor, una segona
xarxa del portal amb un port aleatori lligat a loopback i un volum temporal. Munta la
configuració real del portal i la build de Blocs. El navegador bloqueja altres orígens.
Elimina els contenidors, xarxes, volum i fitxer temporal amb la clau de prova en acabar.
No llig `.env`, no toca comptes reals i no usa la ruta de demostració `/demo/session`.

Comprova en castellà/ratolí i valencià/context tàctil: portada, accés codi/PIN real,
retorn a Blocs, selecció d'una imatge privada, revocació i reproducció d'una cookie
antiga després de tancar sessió, aïllament d'una segona identitat, recuperació de la
biblioteca en tornar a entrar, retorn al gestor central, rebuig d'un retorn extern i
portal sense el complement opcional.

També es comprova que una cookie tècnica compartida antiga no obté biblioteca privada
ni provoca un bucle de retorn des del tauler d'alumnat.

Resultat local: **41 proves de nucli/catàleg/accés** aprovades (37 existents i 4 noves),
**22 proves de regressió** de mòduls/aïllament Docker aprovades, Compose validat sense
`.env` i prova de navegador sobre nginx/API reals en els dos idiomes aprovada.

Les proves OIDC recorren els endpoints de login i callback de Commons, la creació del
principal, els tres rols i la revocació, substituint únicament el proveïdor en la frontera
del token verificat d'Authlib. **No equivalen a un inici de sessió Authentik real**.
La redirecció i el formulari del proveïdor local estan verificats. El 20-10-2026 l'usuari
ha confirmat que l'accés del centre i Rebost funcionen des de l'iPad. És una comprovació
manual de l'usuari, separada de les proves automàtiques; no acredita encara totes les
operacions d'edició i guardat en tauleta.
La revocació remota d'un compte només en Authentik conserva la limitació documentada en
[Rebost](rebost.md); el tancament de sessió local sí que revoca l'accés central.
# Catálogos públicos y biblioteca personal

Actualización 21-10-2026: los catálogos revisados EduTicTac y Scratch, sus familias,
miniaturas, imágenes, fuentes y licencias se pueden leer sin cuenta. El endpoint
`GET /api/assets/v1/catalogs` comunica las capacidades y cantidades públicas, sin
identidad ni información personal. `/me` y la colección `mine` conservan el acceso
individual; las lecturas de identificadores privados también exigen sesión.

El gestor y los selectores incrustados empiezan en el catálogo para visitantes.
«Mis imágenes · Entrar» muestra los accesos ya existentes de Commons. Consultar,
buscar, previsualizar o seleccionar una imagen de catálogo no crea una biblioteca
ni sesión anónima en el servidor. Guardar una copia, subir, modificar y eliminar
continúan requiriendo una identidad individual y las comprobaciones existentes.

Esta ampliación sustituye la restricción de lectura autenticada de los catálogos
descrita en verificaciones anteriores. La privacidad de los recursos personales,
las cuotas, las licencias y las cabeceras de seguridad se conservan.
