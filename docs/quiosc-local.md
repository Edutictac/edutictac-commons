# Quiosc automàtic en el mateix ordinador d’Epoptes

Este mode evita configurar professorat, MAC, UID o grups Commons. El docent
entra en LliureX amb la identitat habitual i obri **EduTicTac Quiosc** des del
menú d’aplicacions. S’aprofita el permís real d’eixa sessió per a connectar amb
Epoptes, sense demanar ni arreplegar la contrasenya de Conselleria i sense un
segon inici de sessió web.

La implementació està en proves. **No s’ha validat encara sobre LliureX 23 real
ni està activada en el desplegament de demostració.** El quiosc continua sent
bàsic i supervisat; esta millora no afig aïllament de KDE ni filtre web.

## Preparació automàtica del servidor

No cal executar cap ordre. Des de l'instal·lador alpha36, si l'ordinador on
s'instal·la Commons té servidor Epoptes, Quiosc es prepara sol:

- en instal·lar o actualitzar el paquet, si el socket d'Epoptes ja existix;
- amb la unitat `edutictac-quiosc-prepare.path`, quan Epoptes s'instal·la o
  arranca després de Commons.

La preparació **no activa Quiosc**. Després, una persona administradora
l'activa en Administració → Eines del centre. En un servidor sense Epoptes la
casella queda deshabilitada i el panell explica que Quiosc només funciona en
l'ordinador de l'aula amb Epoptes.

Si cal repetir-la a mà (per exemple, després de canviar les interfícies de
xarxa), l'administració pot reiniciar el servei o usar l'script:

```bash
sudo systemctl restart edutictac-quiosc-prepare.service
# o bé, amb diagnòstic detallat:
cd /opt/edutictac-commons
sudo python3 scripts/setup-quiosc-local.py --check
sudo python3 scripts/setup-quiosc-local.py --deploy
```

No és una operació que haja de repetir cada docent. El programa comprova el
socket, la identitat root del dimoni, el protocol AMP i la capacitat de la
imatge ID API abans de canviar res. Si falta Epoptes o la imatge encara no
incorpora el codi nou, s’atura. No instal·la paquets, no crea comptes, no canvia
permisos d’Epoptes i no modifica cap ordinador de l’alumnat.

Detecta GID i ruta del socket, port de Commons i MAC del servidor. Escriu
únicament la configuració de connexió necessària en `.env`, una configuració
sense contrasenyes en `/etc/edutictac-quiosc.json`, l’entrada del menú i un
llançador Python en el servidor. Prepara el directori volàtil mitjançant
`/etc/tmpfiles.d/edutictac-quiosc.conf`, sense un altre dimoni resident al host.
Les MAC del servidor s’exclouen de l’aula automàtica per a no seleccionar
l’ordinador del professor. Si canvien les interfícies de xarxa, l’administració
ha de repetir la preparació (vore més amunt).

El Compose principal reutilitza estes variables; la integració es conserva
quan el servei systemd o els scripts d’actualització executen `-f compose.yml`.
No cal un override separat ni un inventari JSON per a este mode. Desactivat,
els volums addicionals apunten només a les dades que ID API ja té muntades i
no s’obri cap socket d’autorització. Activat, Epoptes es munta en lectura sola
i el directori de connexió local és l’únic muntatge addicional amb escriptura.
No es munta el socket Docker ni s’usa un contenidor privilegiat.

## Epoptes de LliureX

L'Epoptes de LliureX 23 està modificat: no publica `/run/epoptes/epoptes.socket`
i la GUI parla per TCP en el port 10000. LliureX el protegix amb dos connectors
n4d: `EpoptesServer` tanca el port i l'obri per IP quan algú autoritzat crida
`register_ip`, i `EpoptesFilter` només deixa connectar-se els grups `teachers`,
`admins`, root i l'usuari principal de l'equip (gid 1000).

Commons s'hi adapta **sense modificar res de LliureX**. El paquet instal·la
`edutictac-quiosc-epoptes.socket`, que només s'activa si existix el connector
`EpoptesServer`. Oferix un socket Unix de root en
`/run/edutictac-quiosc-epoptes/epoptes.socket` amb la mateixa política: grup de
servei de Commons i una ACL amb els grups que LliureX autoritza, llegits del seu
connector i de les seues regles. Cada connexió arranca un pont efímer
(`scripts/quiosc-epoptes-bridge.py`, sense dimoni resident) que:

1. comprova que el port 10000 l'escolta el dimoni Epoptes de root; si no, talla;
2. si el port local està tancat, el registra amb la mateixa crida n4d que la GUI
   d'Epoptes, autenticat amb la clau mestra de n4d de root i només per a
   `127.0.0.1`: des de la xarxa continua tancat;
3. passa les dades sense interpretar-les ni registrar-les.

La preparació automàtica detecta este socket igual que l'estàndard i la resta
del procés (llançador, prova del nucli, cookie) no canvia.

## Com es comprova el permís

1. El llançador s’executa amb l’usuari real del docent, mai amb sudo. Connecta
   amb Epoptes: el sistema operatiu aplica els grups i ACL de la sessió LliureX.
   Si cal renovar un grup, pot usar `sg` amb la pertinença ja resolta per NSS,
   igual que el llançador Epoptes revisat; no demana contrasenyes.
2. Passa eixa connexió oberta al contenidor mitjançant `SCM_RIGHTS`. ID API
   comprova el UID que proporciona el nucli, la ruta real del dimoni, el
   propietari root del socket muntat i les credencials root de l’interlocutor.
   Un nom d’usuari, un UID escrit en JSON, una IP o el rol genèric «professor»
   de Commons no substituïxen esta prova.
3. S’emet una autorització d’un sol ús, vàlida 60 segons i guardada només com
   a hash en SQLite. El llançador la transferix per formulari POST al navegador.
   No apareix en URL, arguments de procés, configuració ni logs.
4. El formulari temporal només es servix en loopback al mateix UID, comprovat
   amb les metadades TCP del nucli. Un altre usuari local no pot obtindre’l
   encara que veja la ruta oberta pel navegador. La pàgina no es guarda en
   memòria cau, no admet marcs i no transmet referències a altres llocs.
5. Una cookie HttpOnly de quatre hores dona accés exclusivament a `/api/quiosc`.
   L’accés queda auditat amb un identificador pseudònim del UID local. No dona
   accés als grups, documents ni altres API docents de Commons. Tancar el
   navegador no revoca necessàriament la cookie; caduca al límit de quatre hores.

Si falla alguna comprovació, no s’atorga el permís. El llindar actual exigix
un dimoni Epoptes root i Docker convencional sense remapatge d’usuaris.
Altres propietaris del dimoni o Docker rootless no estan validats i no s’han
d’admetre eliminant la comprovació. L’accés des d’un altre dispositiu tampoc
s’autoritza per pertànyer a la xarxa: este mode és per a l’ordinador Epoptes.

## Detecció d’equips i abast

L’aula «Epoptes» es genera des de `EnumerateClients` i `info`. S’exclouen les
connexions de sistema UID 0, les MAC invàlides i les del servidor. Els IDs dels
equips són estables per MAC/UID encara que canvie el handle de connexió.
L’inventari recorda els equips vistos per a mostrar-los com a desconeguts
quan es desconnecten. Un equip que no s’ha vist mai no es pot inventar a
partir del protocol; no s’importen els fitxers privats de grups de la GUI.

Quan canvia l’usuari d’un PC es mostra l’últim UID detectat; les sessions
històriques conserven el seu propi destinatari. Diverses sessions actives sobre
una mateixa MAC es consideren ambigües i no es despatxen ordres automàticament.
Un ID alié o caducat enviat pel navegador es rebutja.

**L’abast és el dels clients que exposa eixe dimoni Epoptes.** Este mode es
prepara en el servidor d’una aula; no deduïx permisos entre aules d’un servidor
compartit ni interpreta filtres visuals de la GUI com a controls de seguretat.
Un centre amb un únic dimoni compartit per diverses aules necessita validar
l’abast abans d’activar-lo. No s’ha d’ampliar a tot el centre assumint que la
identitat digital, per si mateixa, limita la llista retornada pel socket.

## Validació pendent en l’aula

- Docent autoritzat: obrir la icona i arribar directament als equips, sense
  formularis de configuració ni nou login. Verificar també navegador i perfil
  habituals, el mode X11, la identitat de la sessió i el grup/ACL efectiu.
- Usuari sense permís Epoptes: el llançador i l’accés web han de fallar.
- Usuari amb rol docent Commons però sense prova Epoptes: no veu esta aula.
- Desconnexió, canvi d’usuari, dues sessions i reinici del servidor: comprovar
  llistes, caducitat, recuperació i regeneració del directori del socket.
- Executar el procediment de Firefox i recuperació de `quiosc.md`. Esta
  autorització no valida el comportament visual ni els atajos de KDE.

Proves de desenvolupament: `tests/test_quiosc_local.py` inclou el protocol de
pas de descriptors, caducitat i no reutilització, origen del formulari, abast de
la cookie, detecció automàtica i denegació d’identitats no verificades.
`QUIOSC_DOCKER_TEST=1` afig una prova amb un dimoni Unix root real dins d’un
contenidor de prova i un llançador no root; no usa alumnes ni el servidor real.
