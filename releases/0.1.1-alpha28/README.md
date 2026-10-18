# Commons alpha28 / instal·lador alpha32 — Segona còpia del centre

Segona còpia opcional en un NAS o disc USB muntat en el servidor del centre.
Administració permet configurar el destí, copiar l'últim backup i desactivar-la.
Els pròxims backups locals es repliquen després de recuperar els serveis.

- Verificació del muntatge, empremta del dispositiu i permisos privats.
- Còpia temporal i publicació després de verificar tots els hashes.
- Si falta el dispositiu o falla la còpia, es conserva el backup local i s'avisa.
- No se sobreescriuen còpies diferents ni s'esborren còpies del segon dispositiu.
  La retenció 7/4/6 continua aplicant-se només al disc local.
- Desactivada per defecte; cal seleccionar un dispositiu real per activar-la.

Cal actualitzar el paquet i la imatge d'Administració. API, portal i Play
conserven el contingut d'alpha27, publicat també amb tag alpha28.
Les instal·lacions existents conserven els tags fins a actualitzar les imatges.

Validació del codi: 178 proves Python correctes, 2 Docker optatives de Quiosc
omeses i 70 proves de navegador correctes. Proves amb destí temporal i errors
simulats; NAS/USB físic pendent d'escollir i provar.

[Guia de configuració i recuperació](../../docs/BACKUPS.md).

L'instal·lador alpha32 conserva l'accés del compte del servei a les còpies i a
la configuració privada després d'actualitzar. Substituïx alpha31 abans del
desplegament d'esta publicació.

**Substituïda per alpha29/alpha33**, que corregix el llançador Python del host.
