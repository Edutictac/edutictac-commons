# Preparació de beta 4: candidata 3

Estat del 24 d’octubre de 2026. **La versió continua oberta** fins a incorporar
el xip compartit en Banc de recursos i validar el conjunt definitiu en LliureX.
No s’ha publicat l’instal·lador en APT ni canviat la descàrrega pública.

## Artefactes preparats

- Imatges amd64 amb etiqueta `0.1.1-beta4-candidate3`: les 13 referències
  estan fixades en [el manifest](../releases/0.1.1-beta4-candidate3/images.json).
- Paquet `edutictac-commons_0.1.1~beta4~candidate3_amd64.deb`, de 5.873.628 bytes.
- SHA-256: `c8ada568f6e84ede84c69362507a0336c84d41ba3e17a3d1f2fe75a1becb58a7`.
- Revisió del paquet: `b58bb00004f110a050f6d26a0fcf37b774124305`.
- Instal·lador amb descàrrega d’imatges per Internet. Metadades en
  [installer.json](../releases/0.1.1-beta4-candidate3/installer.json).

La versió del paquet, els tres valors inicials d’imatge i les 13 referències
empaquetades coincidixen amb la candidata 3. L’auditoria del paquet no detecta
fitxers privats. Estes comprovacions no instal·len el paquet en LliureX.
Els artefactes anteriors amb etiqueta `0.1.1-beta4` corresponen al prototip C2;
no constituïxen la versió definitiva.

## Comprovacions completades fora de LliureX

| Àmbit | Resultat | Abast |
| --- | --- | --- |
| API de Commons | 569 correctes, 2 omeses | Backend sense canvis posteriors en esta candidata |
| Portal C3 | 342 correctes | Navegador, inclòs el xip compartit i Rebost |
| Play C3 | 62 correctes i 2 proves del service worker | Navegador i funcionament del service worker |
| Llibres C3 | 103 correctes, 17 omeses | Entorn Docker aïllat; proves de producció opcionals omeses |
| Clients de Commons | Compilació reproduïble | Sis fitxers generats, inclòs el xip de compte |
| Web d’instal·lació | 46 correctes | Proves de navegador de la branca preparada |
| Blocs | 311 correctes de 312 en la passada conjunta | Un timeout; les 45 proves del fitxer afectat passen en execució aïllada |

Les proves de Llibres utilitzen instantànies de Banc (`bcc4368`) i la seua API
(`1558359`), per evitar interferir amb el desenvolupament del xip en curs.
**No validen encara eixa integració.** La revisió de Llibres provada és
`d9f5ee8`; els canvis des de `511b707` són ajustos dels tests.

També s’ha verificat la lectura completa de la còpia xifrada del punt de
recuperació anterior en el NAS: desxifrat, descompressió i hash dels
6.810.435.584 bytes originals. No s’ha restaurat ni modificat cap VM per a
fer esta comprovació.

## Una única passada final pendent

Per indicació de l’usuari, no es repetixen ara les proves en LliureX.
Quan Banc estiga preparat:

1. Actualitzar les instantànies de Banc i API utilitzades en la preparació.
2. Generar les imatges afectades, fixar les referències i reconstruir el paquet.
3. Executar les proves d’integració amb el Banc definitiu.
4. Fer una única passada completa en LliureX docent/alumnat: actualització,
   instal·lació neta, activació, aplicacions, persistència, còpia, restauració
   i reinici.
5. Revisar els resultats abans de tancar la versió, etiquetar-la i coordinar
   la publicació signada i la web.

Les proves d’actualització dels prototips C1/C2 es conserven com a antecedents;
no substituïxen la validació final. La producció continua sense canvis derivats
d’esta preparació.
