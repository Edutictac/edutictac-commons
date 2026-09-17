# Classes, grups i permisos

El nucli `id-api` ja prepara la col·laboració docent sense crear comptes ni
contrasenyes pròpies. Els grups tenen un propietari i una taula de membres
pseudònims:

- `owner`: pot gestionar membres i el grup;
- `teacher`: docent col·laborador del grup.

El `teacher_id` recomanat és l'identificador pseudònim OIDC (`oidc:<hash>`),
mai el correu o el nom real. Els grups existents es migren automàticament i el
seu creador es registra com a propietari.

## API inicial

Amb una sessió docent:

```http
GET    /api/teacher/groups/{group_id}/members
POST   /api/teacher/groups/{group_id}/members
DELETE /api/teacher/groups/{group_id}/members/{teacher_id}
```

El cos del `POST` és:

```json
{"teacher_id": "oidc:abc123", "role": "teacher"}
```

No es pot retirar el propietari. La validació del grup es fa al servidor i no
es confia en cap rol o identificador enviat pel navegador.

La següent iteració connectarà les lectures i escriptures de grup,
assignacions i resultats amb aquesta membresía, i afegirà la gestió visual al
tauler docent.

