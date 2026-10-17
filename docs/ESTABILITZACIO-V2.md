# Estabilització del bloc d'itineraris v2 — 2026-10-17

Estat actualitzat el 2026-10-18: **publicat i desplegat**, inclòs en les imatges
alpha26 i el paquet alpha29. [Comprovacions de desplegament](DESPLEGAMENT-ALPHA26.md).
No equival a una versió estable de tot Commons ni valida el SSO compartit amb
Recursos. Els resultats detallats següents corresponen a l'estabilització del
bloc d'itineraris del 2026-10-17; la publicació alpha26 afegix les proves del selector.

## Correccions

- Els permisos dels itineraris depenen de l'accés actual al grup. Un docent
  col·laborador revocat perd accés també als itineraris que havia creat; la
  persona propietària del grup conserva la gestió.
- Afegir passos des del tauler usa el mateix guardat atòmic i control de canvis
  simultanis que reordenar o llevar passos.
- Les respostes i els errors tardans d'un grup anterior no substituïxen els
  itineraris del grup que el docent té seleccionat.
- Les operacions de l'editor es bloquegen mentre es guarda. Si fallen tant
  l'operació com la recàrrega, no es permet editar dades obsoletes; el botó
  d'actualització permet recuperar l'editor quan torna la connexió.
- Es rebutgen els títols buits o compostos només d'espais.
- Les proves antigues d'idiomes i de llançament de Recursos s'han adaptat als
  controls actuals. La de Recursos comprova el registre de l'inici i la URL
  d'obertura, a més dels atributs de privacitat de la finestra.

## Resultats

| Comprovació | Resultat |
|---|---|
| Suite Python completa (`pytest tests -q -rs`) | 89 correctes, 2 optatives omeses |
| Portal amb Chromium (`npm test`) | 54 correctes, escriptori i mòbil |
| Itineraris, inclosos en les suites anteriors | 15 proves d'API i 18 de navegador |
| Sintaxi JavaScript, shell i YAML del workflow | Correcta |
| `git diff --check` | Correcte |

Les dues omissions Python requerixen activar expressament les proves Docker
de socket i interlocutor root de Quiosc. No són proves d'itineraris.
Les suites usen SQLite temporal, dades sintètiques i APIs simulades al
navegador. Les proves Python també exerciten Play amb un servidor HTTP temporal.

`npm test` executa Portal i Quiosc; Play i Moodle mantenen les configuracions
independents (`npm run test:play` i `npm run test:moodle`). No s'han executat les
proves de navegador específiques de Play ni la integració amb Moodle en esta
estabilització. `make release-check` ara inclou tota la suite del portal.
No s'ha executat contra el stack actiu: els seus fluxos funcionals creen dades.

La configuració d'integració contínua executa `npm test` i la suite Python
completa en dos treballs independents. El workflow s'ha validat localment com
a YAML; la seua execució remota ja ha acabat correctament amb el codi publicat.

## Reproducció

Des de l'arrel d'este repositori, amb Node i Python disponibles:

```bash
npm ci
npx playwright install chromium
npm test
python3 -m venv /tmp/commons-v2-tests
/tmp/commons-v2-tests/bin/python -m pip install -r tests/requirements-quiosc.txt
/tmp/commons-v2-tests/bin/python -m pytest tests -q -rs
git diff --check
```

## Desplegament completat i límits

Imatges publicades i desplegament en la instal·lació existent completats amb
còpia prèvia i recompte de files SQLite conservat. Migració i restauració també
provades en Docker aïllat. Queda la validació del navegador amb Authentik real
en tots els serveis i una instal·lació nova en LliureX; no es tanquen eixes
proves amb els resultats unitaris. Els canvis previs de Makefile i
admin/server.py s'han preservat. Vegeu [estat de represa](PROPERA-SESSIO.md).
