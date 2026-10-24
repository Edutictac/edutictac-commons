# Commons 0.1.1-beta4-candidate4

Integra Banc de recursos amb el xip compartit i la sessió central de Commons.
El contenidor de Banc usa el portal del mateix host, amb el port configurat,
tant per IP com per mDNS o Tailnet. El botó Inici torna al Commons local.
El compte docent OIDC i el codi/PIN de l’alumnat es reconeixen sense tornar a
entrar en Banc; el catàleg públic continua accessible sense sessió.

Els taulers públics de la branca web incorporen CA/VA/ES/EN. La preparació no
desplega els serveis de producció ni publica paquets APT.

## Revisió

- Taulers i web: 70 proves de navegador correctes en escriptori i mòbil.
- Banc: 98 proves de navegador, 5 del service worker i 4 d’empaquetat correctes.
- API de Banc: 132 proves correctes.
- Sessió central de Commons: 29 proves correctes; instal·lador: 9.
- Integració amb quatre contenidors reals: configuració local, ruta interna
  bloquejada, retorn d’accés, sessió docent i d’alumnat compartides, idioma,
  Inici i tancament de sessió del xip correctes, sense consultar Commons públic.
- Quatre imatges reconstruïdes amb auditoria de rutes privades correcta.
  Les altres quatre imatges pròpies i els tercers es reutilitzen de C3.

Les 13 referències estan fixades en [images.json](images.json). Falta la
passada final en LliureX amb el paquet reconstruït abans de tancar beta4.
