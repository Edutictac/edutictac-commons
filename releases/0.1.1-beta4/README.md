# Commons 0.1.1-beta4 — entrega en preparació

Integra el xip compartit de compte, tema i idioma amb els fitxers d’aula de
beta3. Inclou el xip en Commons, Rebost, Play, Blocs i Llibres; manté el codi
i PIN de l’alumnat. La biblioteca pública no requerix identificar-se.

El xip mostra i gestiona la sessió de Commons. Les funcionalitats pròpies
de comptes i projectes de cada aplicació conserven els seus permisos.

Instal·lador amd64: `edutictac-commons_0.1.1~beta4_amd64.deb`, amb descàrrega
d’imatges per Internet. La publicació APT i la web pública estan pendents.

## Estat de la preparació

**Entrega oberta: falta integrar el xip en Banc de recursos.** Les proves
finals en LliureX s’ajornen fins que el conjunt estiga complet, per a fer-les
una sola vegada. No s’ha publicat el paquet en APT ni actualitzat la web pública.

La [candidata 3](../0.1.1-beta4-candidate3/README.md) incorpora el xip compartit
corregit que utilitza Llibres. Les referències i el paquet sense sufix de
candidata són prototips anteriors; no acrediten una entrega final validada.

## Instal·lació i actualització

[Guia bàsica](../../docs/INSTALACION-RAPIDA.md). En una instal·lació nova,
reinicia abans d’activar Commons. En una instal·lació existent, crea una
còpia, actualitza primer el paquet i després les imatges des d’Administració.
Això conserva els secrets, les aules i la selecció de mòduls.

## Validació

La validació anterior de [beta3](../../docs/VALIDACIO-BETA3-LLIUREX.md) és el
punt de partida. Les comprovacions automatitzades es fan en entorns aïllats. La instal·lació
neta, els recorreguts docent/alumnat, la restauració i el reinici de la versió
definitiva en LliureX queden pendents de Banc.
