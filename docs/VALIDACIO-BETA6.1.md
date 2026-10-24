# Validació beta6.1

Correcció de beta6 sobre `main` `2d62734`. Paquet i imatges amb tag nou; beta6
no es modifica.

## Proves prèvies a la publicació

- `pytest tests/test_central_session.py`: 34 aprovades, inclosa la creació per
  lot amb etiqueta i la comprovació al resum docent.
- La resta de proves de beta6 es mantenen; només canvia el backend d’id-api.

## Validació en LliureX (VM professor + alumne)

- Actualització real des de beta5 amb el paquet `0.1.1~beta6.1` i les imatges
  beta6.1; dades i configuració conservades.
- `test-flow.sh` correcte: docent → credencials → alumne → puntuació → resultats.
- Creació d’aula amb `label` i lectura al resum docent correcta.
- Portal 200 per `127.0.0.1`, per `edutictac.local` i des de l’alumne per IP.
- `edutictac-commons-open` i entrada de menú presents.

## Pendents

- Verificació APT i desplegament en producció.
