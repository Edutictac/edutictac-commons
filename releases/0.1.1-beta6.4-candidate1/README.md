# Commons 0.1.1-beta6.4-candidate1 — control administratiu del trasllat

Candidata local en validació. **No publicada ni desplegada.** La versió pública
actual continua sent beta6.3, amb el trasllat desactivat.

## Canvi funcional

- Administració pot activar i apagar el trasllat manual d'aules des del panell
  de grups del tauler docent. L'ajust afecta la instal·lació completa, és
  persistent en SQLite i té efecte immediat.
- La migració 5 crea `classroom_transfer_settings`. La variable
  `EDUTICTAC_CLASSROOM_TRANSFER_ENABLED` només establix el valor inicial quan
  encara no existix l'ajust. El valor per defecte de la candidata està pendent
  de confirmació abans de tancar-la.
- L'API exigix sessió OIDC administradora i mateix origen per a modificar
  l'ajust; guarda la data i l'identificador de l'actor. El panell docent
  apareix o desapareix quan es guarda el canvi en el mateix navegador.

El trasllat continua sent experimental i no inclou els fitxers d'aula.

## Validació completada

- Suite Python del canvi funcional: 656 aprovades, 2 omeses.
- Proves de navegador: 378 aprovades en escriptori i mòbil.
- Imatges locals d'API i portal construïdes. El bundle de docent de la imatge
  coincideix amb el fitxer font i no conté rutes locals de compilació.
- El paquet `.deb` de la candidata es construïx i supera l'auditoria de
  credencials i rutes locals. Encara no és un instal·lador publicat.
- Instal·lació Docker temporal amb les imatges candidates d'API i portal:
  serveis saludables, fluxos docent/alumnat i EduHoot correctes, i còpia i
  restauració de SQLite, MongoDB, càrregues i informes verificades.

## Pendent abans de publicar

- Fixar el valor inicial triat per l'usuari i repetir les proves afectades.
- Generar els artefactes finals amb imatges versionades i validar
  l'actualització d'una instal·lació existent.
