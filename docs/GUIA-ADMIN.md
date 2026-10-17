# Guia d'administració d'EduTicTac Commons

Esta guia explica com usar el panell `/admin` per a qui gestiona el stack
d'un centre: comprovar l'estat del servei, donar d'alta professorat, fer
còpies de seguretat i aplicar actualitzacions (o desfer-les) sense necessitat
d'obrir un terminal.

No confons este panell amb el panell docent (vore
[docs/GUIA-DOCENTE.md](GUIA-DOCENTE.md)): `/admin` és per a qui manté tècnicament
la instal·lació del centre, no per al professorat que crea activitats.

## 1. Accedir al panell

El panell està disponible en dues adreces, segons des d'on hi accedixes:

- `http://<host-del-centre>:8082/admin/` — a través del portal públic. Esta és
  l'adreça recomanada: funciona des de qualsevol dispositiu de la mateixa
  xarxa (per exemple, la Tailnet del centre), no només des de l'ordinador
  servidor.
- `http://127.0.0.1:8091/` — accés directe, només funciona des del mateix
  ordinador on corre el stack (el port `8091` es publica lligat a
  `127.0.0.1`).

Passos:

1. Obri l'adreça del panell. Veuràs les seccions "Accés", "Professorat",
   "Estat" i "Accions", però buides o amb l'avís de sessió requerida.
2. Prem **Entrar**. Et redirigix a l'inici de sessió d'Authentik.
3. Inicia sessió amb el compte configurat com a administrador
   (`ADMIN_OIDC_USERNAME` en `.env`; per defecte `akadmin`).
4. Tornes al panell i l'"Estat" apareix omplit automàticament.

Només eixe usuari concret pot fer servir el panell: si inicies sessió amb un
altre compte Authentik (encara que siga professorat), les peticions a
`/api/*` tornen `401 no autoritzat`.

Botons de la secció "Accés":

- **Entrar** — inicia sessió amb Authentik.
- **Eixir** — tanca la sessió i neteja l'estat mostrat en pantalla.
- **Actualitzar** — torna a consultar l'estat sense recarregar la pàgina
  (útil per a vore si un backup o una actualització ja ha acabat).

## Ferramentes del centre

Disponible amb el paquet alpha29 i les imatges alpha26. En una instal·lació nova, després d'activar el portal i entrar
com a administrador, s'obri un assistent per triar **Play, EduHoot, Recursos i
Quiosc**. Pots deixar-ho per a més tard.

Per canviar la selecció després, obri **Ferramentes del centre**, marca o
desmarca les opcions i prem **Aplicar selecció**. El panell mostra el progrés
i recupera el seguiment si recarregues la pàgina. Espera que acabe abans de
fer una altra operació de manteniment.

El portal, la identitat, Administració i Authentik es mantenen actius. Quan
desactives una ferramenta, es conserven les seues dades, assignacions i
resultats; els accessos deixen de mostrar-se fins que la tornes a activar.
Abans d'aplicar el canvi es comprova una còpia de seguretat. El servei pot
interrompre's breument; si falla, s'intenta recuperar la selecció anterior.

Quiosc només es pot activar després de la [preparació d'Epoptes](quiosc-local.md)
en el servidor. Si hi ha equips amb sessions pendents de restaurar, primer
cal resoldre-les. Una actualització conserva les ferramentes que ja utilitzes.

## 2. Llegir l'"Estat operatiu del stack"

Esta secció es carrega sola en entrar i es refresca després de cada acció.
Mostra:

- **Versió del stack** i les **imatges** en ús (registre, tag comú
  `IMAGE_TAG`/`ADMIN_TAG` i tag d'EduHoot).
- **Canal d'actualitzacions** (`UPDATE_CHANNEL`: `testing`, `dev` o `stable`).
- **Perfils actius** (`COMPOSE_PROFILES`, p. ex. `authentik`, `eduhoot`,
  `recursos`).
- **Serveis**, un per línia, amb si responen o no.
- **Últim backup** (nom i data) i, si n'hi ha, **avisos de cobertura** (per
  exemple, si algun servei amb dades persistents no s'ha inclòs en l'últim
  backup).
- **Backups disponibles**, amb data i versió de cadascun.
- **Timer de backups automàtics**: si està instal·lat i actiu, quan es va
  executar per última vegada i quan tornarà a executar-se.

Si el navegador mostra "Necessites iniciar sessió", torna al pas 1.

## 3. Donar d'alta professorat

La secció "Professorat" crea un compte docent nou directament des del panell,
sense passar per Authentik ni per terminal:

1. Omple **Usuari**, **Nom complet** i **Correu electrònic**.
2. Prem **Crear docent**.
3. Apunta la contrasenya temporal que apareix: **només es mostra una
   vegada**. Si es perd, cal crear el compte de nou o restablir-la per un
   altre mitjà.

## 4. Còpies de seguretat

Dins d'"Accions" → "Backups":

- **Crear backup ara** — copia la base d'identitat i, quan està actiu,
  EduHoot (Mongo, uploads i logs). Apareix a "Backups disponibles" en acabar.
  Authentik, Play, Recursos i Quiosc requerixen encara còpies addicionals;
  ampliar la cobertura i la restauració automàtica continua pendent.
- **Activar backups automàtics** / **Desactivar backups automàtics** —
  instal·la o elimina un timer del sistema que fa backups periòdics sense
  intervenció.
- **Restaurar backup seleccionat** — selecciona un backup de la llista
  desplegable i prem el botó. Et demanarà escriure la paraula `RESTAURAR`
  per confirmar, perquè **para el stack i substituïx les dades actuals** per
  les del backup triat. Fes-ho només si estàs segur: no es pot desfer sense
  un altre backup previ.

Restaurar un backup és una acció llarga: mentre s'executa veuràs el
"Progrés en viu" descrit en la secció 5 (el registre va apareixent línia a
línia fins que acaba, amb un missatge final d'èxit o error).

## 5. Comprovar i aplicar actualitzacions (i tornar arrere)

Dins d'"Accions" → "Imatges":

### Comprovar actualitzacions

Prem **Comprovar actualitzacions**. Consulta el registre d'imatges
(`registry.edutictac.es`) i mostra, per al bundle comú (`commons`) i per
EduHoot per separat: la versió instal·lada, la versió disponible en el canal
configurat i si hi ha una actualització pendent.

Açò només consulta, no canvia res.

### Actualitzar imatges

Prem **Actualitzar imatges**. Se't demanarà escriure `ACTUALITZAR` per
confirmar. L'acció:

1. Crea un backup automàticament abans de tocar res.
2. Descarrega les imatges noves del canal configurat.
3. Reinicia els serveis afectats amb les imatges noves.
4. Verifica que el stack torna a funcionar.

Esta acció actualitza en un sol pas totes les imatges pròpies del bundle
`commons` (`commons-id-api`, `commons-portal`, `commons-admin` i
`commons-play`): el mateix panell que estàs fent servir queda al dia sense
cap acció manual addicional. EduHoot té el seu propi cicle de versions i
tag (`EDUHOOT_TAG`) i s'actualitza a banda si `check-updates` en detecta una
de nova.

### Progrés en viu

Des que confirmes, l'acció s'executa en segon pla i el quadre de resultats
va mostrant el registre real a mesura que avança (cada ~3 segons), no només
un missatge fix d'"iniciat". En acabar veuràs un avís explícit:

- ✅ **Completat amb èxit.**
- ❌ **Ha fallat. Revisa el registre de dalt.**

Si l'acció triga més de deu minuts, el panell deixa de comprovar-la (avís
⚠️) però el procés pot continuar corrent al servidor; prem **Actualitzar**
en la secció "Accés" més tard per confirmar com ha acabat.

### Tornar a la versió anterior (rollback)

Si una actualització falla alguna comprovació, o simplement es vol tornar
arrere, la llista desplegable de "rollback" només mostra els backups creats
just abans d'una actualització (els que porten registrada la versió
anterior). Selecciona'n un, prem **Tornar a la versió anterior**, escriu
`TORNAR` per confirmar. Fa el mateix procés (backup previ, restauració,
verificació) amb el mateix "Progrés en viu" descrit adalt.

## 6. Sincronitzar continguts

Dins d'"Accions" → "Continguts":

- **Sincronitzar Recursos** — actualitza el catàleg compartit del banc de
  recursos.
- **Sincronitzar EduHoot** — importa o actualitza les activitats públiques
  d'EduHoot des de la font configurada.

Estes dues accions són síncrones (acaben en segons) i no fan servir el
"Progrés en viu": el resultat apareix directament en el quadre d'accions.

## 7. Notes de seguretat

- Només l'usuari configurat en `ADMIN_OIDC_USERNAME` (per defecte
  `akadmin`) pot fer servir el panell; l'autenticació es delega sempre en
  Authentik.
- El panell no exposa cap port públic propi: només és accessible en
  `127.0.0.1:8091` en l'ordinador servidor o, a través del portal, en el
  mateix origen que la resta del stack (`:8082/admin/`).
- Les accions destructives (restaurar un backup, actualitzar imatges, fer
  rollback) sempre demanen escriure una paraula de confirmació abans
  d'executar-se.
