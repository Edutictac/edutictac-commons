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
POST   /api/teacher/groups/{group_id}/identities
DELETE /api/teacher/groups/{group_id}
```

El tauler docent inclou una gestió inicial per seleccionar un grup, consultar,
afegir i retirar docents col·laboradors. La identificació es demana com a valor
pseudònim (`oidc:...`) i no com a nom o correu. El propietari es mostra però no
es pot retirar des de la interfície.

El mateix tauler permet afegir noves identitats a un grup existent. L'eliminació
del grup és una operació exclusiva del propietari o l'administració i elimina
en cascada les credencials, assignacions, itineraris, sessions, tokens de
llançament i puntuacions del grup.

El cos del `POST` és:

```json
{"teacher_id": "oidc:abc123", "role": "teacher"}
```

No es pot retirar el propietari. La validació del grup es fa al servidor i no
es confia en cap rol o identificador enviat pel navegador.

Les lectures i operacions de treball del grup ja respecten aquesta membresía:

- resum docent i llistat d'alumnat;
- consulta, rotació i revocació de credencials de l'alumnat;
- targetes imprimibles i exportació de codis;
- assignacions d'activitats i consulta dels seus resultats;
- estadístiques CSV.

La gestió de membres continua reservada al propietari del grup i a
l'administració. Això evita que un docent col·laborador puga modificar la
composició del grup, però li permet treballar amb les activitats i resultats
que té assignats.

Queda per a la següent iteració millorar la descoberta de l'identificador OIDC
i connectar aquesta informació amb classes i itineraris de la capa Commons.
