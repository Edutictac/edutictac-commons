# Commons 0.1.1-beta4-candidate6

Conserva la [candidata 5](../0.1.1-beta4-candidate5/README.md) i corregix una
resposta detectada en la validació LliureX: en rebutjar una pujada massa gran,
l’API responia 413 abans de rebre el cos complet i nginx podia presentar 502
per reinici de la connexió.

L’API descarta els bytes restants abans de respondre al límit, sense guardar
l’arxiu rebutjat ni acumular el cos complet en memòria. Es manté la pujada per
flux i els límits independents de la resta d’API.

- 38 proves de fitxers, permisos, límits, proxy i còpies correctes.
- Integració amb nginx i API reals: 413 per a contingut amb mida coneguda i per
  a enviament per fragments; cap arxiu rebutjat guardat; límit JSON conservat.
- Sessió docent/alumnat, xip de Banc, idioma, Inici local i eixida correctes.

Només canvia la imatge id-api respecte de C5. Les 13 referències es fixen en
[images.json](images.json). No s’ha publicat cap instal·lador APT.
