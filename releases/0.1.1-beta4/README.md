# Commons 0.1.1-beta4 — entrega en preparació

Integra el xip compartit de compte, tema i idioma amb els fitxers d’aula de
beta3. Inclou el xip en Commons, Rebost, Play, Blocs, Llibres i Banc; manté el codi
i PIN de l’alumnat. La biblioteca pública no requerix identificar-se.

El xip mostra i gestiona la sessió de Commons. Les funcionalitats pròpies
de comptes i projectes de cada aplicació conserven els seus permisos.

Instal·lador amd64: `edutictac-commons_0.1.1~beta4_amd64.deb`, amb descàrrega
d’imatges per Internet. La publicació APT i la web pública estan pendents.

## Estat de la preparació

**Banc integrat; pendent la validació final en LliureX.** Els taulers públics
estan traduïts a CA/VA/ES/EN. No s’ha publicat el paquet en APT ni actualitzat
la web pública en esta preparació.

La [candidata 6](../0.1.1-beta4-candidate6/README.md) incorpora el xip de Banc,
la sessió central, la configuració del portal local i la comprovació del rol
docent, i conserva l’error de límit de pujada a través del proxy. Les referències d’esta
carpeta ja coincidixen amb eixa candidata. Els paquets generats abans d’esta
integració continuen sent prototips; no acrediten una entrega final validada.

## Instal·lació i actualització

[Guia bàsica](../../docs/INSTALACION-RAPIDA.md). En una instal·lació nova,
reinicia abans d’activar Commons. En una instal·lació existent, crea una
còpia, actualitza primer el paquet i després les imatges des d’Administració.
Això conserva els secrets, les aules i la selecció de mòduls.

## Validació

La validació anterior de [beta3](../../docs/VALIDACIO-BETA3-LLIUREX.md) és el
punt de partida. Les comprovacions automatitzades es fan en entorns aïllats. La instal·lació
neta, els recorreguts docent/alumnat, la restauració i el reinici de la versió
definitiva en LliureX queden pendents de completar la passada final.
