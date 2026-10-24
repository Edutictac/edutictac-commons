# Validació beta5 en LliureX 23

24-10-2026. Entrega de seguretat sobre beta4, amb la mateixa selecció
opcional d’aplicacions i els fitxers d’aula conservats.

## Proves automatitzades

- Suite Python completa: 622 correctes i 2 Docker optatives omeses.
- Després de les correccions de release: 12 proves d’instal·lador, 7 de
  seguretat/ingress i 48 d’autenticació, tokens, publicació i fitxers correctes.
- Portal: 366 proves i flux docent → credencial → alumnat → resultat amb
  `make release-check` en Docker aïllat.
- Play: 62 proves de navegador i 2 de service worker.
- Web de descàrrega: 60 proves de navegador; xip i peu conservats.
- Bundles reconstruïts sense diferències. Imatges i paquet auditats sense
  rutes de treball locals ni credencials.

## Actualització i instal·lació neta

L’actualització real des de beta4 conserva la configuració, les credencials,
les aules i tots els blobs de fitxers. El paquet conserva els tags instal·lats;
l’actualitzador independent descarrega i fixa els digests de les imatges.
S’activen el mode de producció, els tokens separats i el requisit de xifratge.

La instal·lació neta s’ha fet en un overlay separat sobre la base original.
S’han comprovat instal·lació, reinici, activació inicial, accés administratiu
i selecció de les sis eines. La candidata 2 de l’instal·lador incorpora la
correcció que impedix que els tags de la plantilla substituïsquen els del
paquet. Les correccions de runtime s’han aplicat incrementalment amb els
mateixos scripts abans de la promoció al paquet final.

El filtratge d’Administració reconeix la xarxa Docker real, també amb rangs
10.x: des del mateix servidor, hostname i loopback retornen 200; des d’un
altre equip de la LAN, 403. No s’ha ampliat el permís a la LAN.

## Còpies i dades

S’ha creat una còpia age i verificat el contingut amb la clau privada externa.
Després d’esborrar realment un blob d’aula, la restauració completa recupera
byte per byte els fitxers i conserva les files d’aula. La clau temporal de
restauració s’elimina; la privada queda fora del servidor.

`age` no estava disponible a l’espill LliureX. S’ha verificat el paquet
actualitzat d’Ubuntu Jammy amb les claus preexistents i els índexs firmats;
el repositori EduTicTac el proporciona sense modificar-lo.

## Recorregut amb professorat i alumnat

En dos equips virtuals: accés OIDC docent, creació d’aula, accés amb codi/PIN,
llibre amb una imatge del Rebost, enviament privat del llibre per l’alumnat,
aprovació docent i lectura pública anònima correctes. Les crides al Banc
usen el token específic de Recursos, incloses les crides internes des de
Commons. Es manté compatibilitat amb el token anterior quan no hi ha tokens
separats configurats.

## Abast

La promoció final comprova els 13 digests publicats. La instal·lació neta
inicial usa una candidata amb les actualitzacions incrementals descrites;
no s’afirma una segona instal·lació des de zero del paquet final exacte.
L’acceptació humana d’un centre real i el login personal en producció són
operacions diferents d’esta validació amb comptes de prova.

Ingress de totes les apps, certificats de centre, 2FA/systemd i els blocs B/C
continuen fora d’esta release. Els artefactes beta4 publicats es conserven.

## Estat final del laboratori

El paquet final exacte s’ha instal·lat i les 13 imatges coincidixen amb el
manifest. Després de conservar el disc de la instal·lació neta validada,
s’ha recuperat el disc de l’aula original i actualitzat també a beta5 final.
Configuració, files prèvies i blobs d’aula conservats; professor i alumne
arrancats i les sis eines seleccionades.
