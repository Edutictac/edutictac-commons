# EduTicTac Commons Stack Local

Primer stack Docker per desenvolupar i ensenyar el producte EduTicTac Commons en `debiandesktop`, sense tocar producció.

## Ús ràpid

```bash
cd stack
cp .env.example .env
make up
```

Si Docker en la màquina requereix `sudo`, usa:

```bash
make DOCKER="sudo docker" up
```

Obri:

```text
http://localhost:8082
```

El token docent de demo és el valor de `EDUTICTAC_ID_TEACHER_TOKEN` en `.env` (`dev-teacher` per defecte).

## Serveis

| Servei | Port intern | Funció |
|---|---:|---|
| `portal` | 80 | Portal demo i proxy `/api/` |
| `id-api` | 8005 | Credencial pseudònima d'alumnat |

## Flux demo

1. Entra com a docent amb el token de demo.
2. Genera un grup amb 5-10 credencials.
3. Assigna l'activitat demo al grup.
4. Copia un codi + PIN generat.
5. Entra com a alumne amb eixe codi + PIN.
6. Registra una puntuació.
7. Torna al tauler docent i consulta resultats.

## Dades locals

La base SQLite viu en:

```text
stack/data/id.db
```

No es versiona. Per reiniciar la demo des de zero:

```bash
make reset
make up
```

## Operació local

```bash
make up          # arranca o reconstrueix el stack
make down        # para els contenidors
make logs        # mostra logs
make ps          # estat dels serveis
make test-flow   # prova docent -> alumne -> resultats
make backup      # copia SQLite en backups/
make restore BACKUP=backups/id-YYYYmmddTHHMMSSZ.db
```

Els objectius `up`, `down`, `build`, `logs`, `ps`, `reset` i `restore` accepten també `DOCKER="sudo docker"` quan cal.

## Notes

- Aquest stack és per desenvolupament i demostració.
- No conté Authentik encara; el docent usa token local.
- No inclou dades reals ni s'ha de connectar a producció.
- El paquet `edutictac-community` està vendorizat dins de `services/id-api/vendor/` per evitar dependències Git durant el build.
