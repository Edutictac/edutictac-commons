# Validació beta6

Font: `release/beta6` sobre `main` `9c28e46`. Les imatges de beta5 es
conserven intactes; beta6 publica tags nous.

## Proves executades

- `npm test`: 369 proves aprovades. Una prova de navegador d’idioma va superar
  el temps límit per càrrega; repetida aïlladament, 2/2 aprovada.
- `pytest tests/test_central_session.py tests/test_id_api_migrations.py
  tests/test_group_access_matrix.py tests/test_itineraries.py`: 196 aprovades.
- `npx playwright test tests/browser/teacher-credentials.spec.js
  tests/browser/teacher-groups.spec.js tests/browser/language.spec.js`:
  54 aprovades.
- Auditats els 8 artefactes propis amb `check-release-artifacts.py`: cap
  Credential, `.env`, clau ni dada local dins de les imatges.
- Comprovada la plataforma `linux/amd64` de les 13 imatges del manifest.

## Imatges

Els tags `0.1.1-beta6` d’id-api, portal, administració, Play, Blocs, Llibres,
Banc i API del Banc s’han publicat al registre. Els digests finals són als
manifestos [images.json](../releases/0.1.1-beta6/images.json) i
[compose.images.json](../releases/0.1.1-beta6/compose.images.json).

## Pendents en esta fase

- Publicació i verificació del paquet APT `0.1.1~beta6`.
- Prova d’instal·lació/actualització en LliureX i desplegament en producció.
