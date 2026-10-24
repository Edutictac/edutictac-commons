# Commons 0.1.1-beta4-candidate5

Conserva la integració de la [candidata 4](../0.1.1-beta4-candidate4/README.md)
i restringix les funcions docents de Banc als rols de professorat i administració.
Una sessió OIDC d’alumnat pot conservar preferències personals sense adquirir
permisos docents. El codi/PIN de l’alumnat manté el comportament anterior.

- API de Banc: 133 proves correctes, inclosa la denegació de funcions docents.
- Integració real en Docker: docent, alumnat, xip, idioma, Inici local i eixida
  compartida correctes; cap consulta al Commons públic.
- Comprovació addicional amb una galeta OIDC d’alumnat signada per l’id-api
  de prova: funcions docents denegades i preferències personals disponibles.

Només canvia la imatge de l’API de Banc respecte de C4. Les 13 referències
es fixen en [images.json](images.json). No s’ha publicat cap instal·lador APT.
