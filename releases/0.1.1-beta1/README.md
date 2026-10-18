# Commons 0.1.1-beta1 — pilots LliureX

Primera beta per a pilots controlats en LliureX/Ubuntu amd64. Instal·lador:
`edutictac-commons_0.1.1~beta1_amd64.deb`.

Inclou els arreglos del pont Epoptes de LliureX d'alpha33/alpha37 i les
correccions verificades en l'aula virtual professor/alumne:

- Publicació Play → Recursos per l'origen HTTP local configurat, mantenint
  les restriccions de host, port i credencials.
- Generació d'alumnat des de Recursos després del login Authentik: el servei
  rep la credencial interna que faltava, sense lliurar-la al navegador.
- Recuperació del permís local d'Epoptes quan LliureX deixa un bloqueig
  anterior al permís; registre serialitzat mitjançant n4d.
- El panell mostra la versió del paquet instal·lat.
- Proves de catàleg i assignació que usen la configuració instal·lada i
  retiren els seus recursos i grups temporals.

Les quatre imatges Commons conserven el contingut d'alpha33. Recursos API
incorpora els arreglos; el frontend de Recursos conserva el contingut
d'alpha12. Les referències immutables i la procedència es registren en
`images.json`; les dades del paquet, en `installer.json`.

## Abast

La beta és per a pilots acompanyats. Quiosc és un navegador supervisat:
no aporta aïllament de KDE ni filtre de navegació. La prova en aula virtual
no substituïx la validació en equips físics d'un centre.

No es dona per tancat el SSO complet dels quatre serveis, la identitat
pseudònima compartida en tots els recorreguts ni cesta → itinerari. La
publicació local de Play i el login/generació d'alumnat de Recursos sí tenen
comprovacions específiques. No usar captures amb dades reals d'alumnat.

## Controls d'entrega

El registre de publicació ha d'incloure instal·lació neta del paquet exacte,
activació, selector de mòduls, reinici, fluxos funcionals, backup/restauració
i `release-check`. Consulta també `CHECKLIST-ENTREGA.md` i
`docs/resources-integration.md`.

## Primera instal·lació

Instal·la el paquet i reinicia l'equip si l'instal·lador indica que ha afegit
accés a Docker. Fes-ho abans d'activar mòduls o crear còpies des del panell.
Després, obri Commons des del menú d'aplicacions, activa la instància amb el
codi d'un sol ús i selecciona els mòduls des d'Administració.

Les eines de desenvolupament de les proves de navegador usen Node 22;
no són un requisit per a l'ús docent del paquet instal·lat.

En la primera arrancada o després d'un reinici, Authentik pot continuar
preparant el primer accés després que el portal ja responga. En la prova
neta va caldre repetir el primer login; espera un minut i torna a entrar
si encara no apareix el formulari. És una limitació coneguda d'esta beta.

## Validació de la publicació (2026-10-18)

En l'aula virtual LliureX 23 (professor + alumne), amb el professor instal·lat
des de zero sobre una imatge base neta i proves com a usuari docent `lliurex`:

- Instal·lació, activació i selector de mòduls (EduHoot, Play, Recursos i
  Quiosc) correctes. Quiosc preparat automàticament pel pont Epoptes.
- Reinici complet: Commons, pont Epoptes, Epoptes i sessió gràfica tornen sols;
  contenidors saludables i sense reinicis.
- Fluxos `test-flow`, `test-recursos`, `test-teacher-resources` i
  `test-eduhoot-flow` correctes, també després del reinici.
- Backup complet i verificat; restauració real comprovada amb una activitat de
  Play creada després del backup, que desapareix en restaurar. Quiosc queda
  desactivat després de restaurar, com està previst, i es reactiva amb el
  selector.
- Codi: 201 proves Python (+48 de Quiosc amb Docker real) i 70 de navegador.
  `release-check`: requisits, sintaxi i artefactes correctes; el flux funcional
  s'ha validat en l'aula virtual perquè el Commons del host està aturat.
- Imatges: les 11 referències d'`images.json` existixen al registre; els tags
  `0.1.1-beta1` apunten als mateixos digests i admeten pull anònim.
- APT: signatura InRelease, Packages.gz i SHA-256/mida del `.deb` descarregat
  verificats. El paquet publicat es va construir des de `12bdb4e`; respecte a
  `7cd28f0`, instal·lat en l'aula, només canvien les proves del paquet.
