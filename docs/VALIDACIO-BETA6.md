# Validació beta6

Font: `release/beta6` sobre `main` `9c28e46`. Les imatges de beta5 es
conserven intactes; beta6 publica tags nous.

## Proves executades

- `npm test`: 370 proves. La primera execució va deixar una prova de navegador
  d’idioma fora de temps per càrrega; repetida aïlladament, 2/2 aprovada.
- `pytest tests/test_central_session.py tests/test_id_api_migrations.py
  tests/test_group_access_matrix.py tests/test_itineraries.py`: 196 aprovades.
- `npx playwright test tests/browser/teacher-credentials.spec.js
  tests/browser/teacher-groups.spec.js tests/browser/language.spec.js`:
  54 aprovades.
- Auditats els 8 artefactes propis amb `check-release-artifacts.py`: cap
  Credential, `.env`, clau ni dada local dins de les imatges.
- Comprovada la plataforma `linux/amd64` de les 13 imatges del manifest.
- Aixecada una pila aïllada beta6 (id-api + portal, xarxes B3) i executat
  `test-flow.sh`: docent → credencials → alumne → puntuació → resultats, correcte.
- `pytest tests/test_ubuntu_package.py tests/test_image_updates.py`: 29 aprovades.
- Paquet `0.1.1~beta6` construït i auditat: 5.908.732 bytes, SHA-256
  `5ed9f2fd40adbcf9db4cfd39951091dacf446d5a5bb2000e360aaed6bd5d05f1`.
- APT: firma `InRelease` verificada, índex i descàrrega amb hash correcte,
  candidat `0.1.1~beta6` comprovat amb una instal·lació aïllada d’APT.
- Portal: 26 proves de la pàgina d’instal·lació i del selector, aprovades.

## Imatges

Els tags `0.1.1-beta6` d’id-api, portal, administració, Play, Blocs, Llibres,
Banc i API del Banc s’han publicat al registre. Els digests finals són als
manifestos [images.json](../releases/0.1.1-beta6/images.json) i
[compose.images.json](../releases/0.1.1-beta6/compose.images.json).

## Pendents en esta fase

- Prova d’instal·lació/actualització en LliureX amb el paquet final.
- Desplegament en producció i còpia de seguretat prèvia.
