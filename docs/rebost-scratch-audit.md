# Revisió ràpida del catàleg Scratch

21-10-2026. Classificació reproduïble de les 949 imatges úniques referenciades
per Blocs. Ja n'hi ha 61 en el Rebost; les 888 restants es poden revisar per lots.
Esta classificació no incorpora recursos ni aprova noves llicències.

| Lot pendent | Imatges | Què acredita la comprovació |
|---|---:|---|
| SVG amb coincidència històrica | 693 | El mateix identificador de contingut apareix en els JSON oficials fixats. |
| Mapa de bits amb coincidència històrica | 190 | La mateixa coincidència; necessiten també el camí tècnic per conservar la font de mapa de bits en Blocs. |
| Possibles marques | 2 | Els noms activen una alerta conservadora; no es determina automàticament si són marques ni si es poden usar. |
| Sense evidència històrica en estos JSON | 3 | Cal cercar més procedència; no significa que estiguen prohibits. |

Els lots són excloents. La prioritat és: ja incorporat, alerta de nom, falta
d'evidència històrica, format. Una alerta pot afectar també una imatge sense
coincidència històrica. La revisió de marques per paraules pot donar falsos
positius i falsos negatius; no substituïx veure les imatges i comprovar drets.

## Com accelerar la revisió

1. Agrupar els fitxers que pertanyen al mateix personatge i conservar totes les
   referències: el report agrupa les pendents en 389 famílies lògiques. La primera
   família alfabètica és la clau de lot quan un mateix fitxer té diversos usos.
2. El primer lot de **30 imatges de famílies ja presents** està revisat i
   incorporat. El report actual no deixa cap pendent en eixes famílies.
   Per als lots nous cal triar famílies i comprovar procedència, imatge i atribució.
3. Descarregar només els lots seleccionats, comprovar MD5 i registrar SHA-256.
   La coincidència de metadades no verifica encara els bytes del servidor.
4. Validar SVG, renderitzar sense xarxa ni JavaScript i generar fulls de contacte
   per revisar visualment diversos recursos alhora. Separar errors i casos dubtosos.
5. Comprovar marques, autoria i condicions aplicables; registrar la decisió amb
   les evidències. Només després afegir els recursos aprovats al paquet versionat.

El report conserva nom del personatge, disfressa, etiquetes, col·lecció d'origen,
referències històriques i possibles alertes per cada hash. Cap entrada queda
autoritzada pel classificador (`approved_by_this_audit: false`), incloses les que
ja estan incorporades per una revisió anterior.

## Reproducció

```sh
python3 scripts/audit-scratch-catalog.py --download-metadata
python3 scripts/audit-scratch-catalog.py --check
python3 -m pytest -q tests/test_scratch_audit.py
```

La descàrrega opcional és només de tres JSON públics amb revisions i SHA-256
fixats; mai d'imatges. Sense l'opció utilitza la memòria cau local. No accedix
a comptes, biblioteques privades, Docker ni al catàleg en execució.

[Report complet de metadades](rebost-scratch-audit.json).
[Decisió de llicència i selecció ja incorporada](rebost-scratch.md).

Verificació: 7 proves aprovades, incloent deduplicació, noms iguals amb hashes
distints, alertes de marques, separació de formats i prohibició d'aprovar per
simple coincidència. `--check` confirma que el report correspon a les fonts actuals.
