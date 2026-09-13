# EduTicTac Commons Stack Local

Primer stack Docker per desenvolupar i ensenyar el producte EduTicTac Commons en `debiandesktop`, sense tocar producció.

## Ús ràpid

```bash
cd stack
cp .env.example .env
make doctor
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

## Reutilització del treball existent

Aquest stack no comença de zero: reutilitza l'API d'identitat pseudònima desenvolupada per a EduTicTac i la porta a un contenidor net dins de `services/id-api/`. La part nova d'aquest paquet és el muntatge local Docker, el portal demostratiu, els scripts d'operació/exportació i la documentació perquè altres centres puguen provar el producte sense tocar `edutictac.es`.

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

Abans d'esborrar dades locals, fes una còpia si vols conservar la demo:

```bash
make backup
```

## Operació local

```bash
make doctor      # comprova requisits locals
make up          # arranca o reconstrueix el stack
make down        # para els contenidors
make logs        # mostra logs
make ps          # estat dels serveis
make test-flow   # prova docent -> alumne -> resultats
make bootstrap-demo # crea grup, activitat i TSV de credencials en dist/
make release-check # comprovacio abans d'entrega/exportacio
make backup      # copia SQLite en backups/
make restore BACKUP=backups/id-YYYYmmddTHHMMSSZ.db
make export-images
make load-images ARCHIVE=dist/edutictac-commons-images-0.1.0-alpha.tar
```

Els objectius `up`, `down`, `build`, `logs`, `ps`, `reset` i `restore` accepten també `DOCKER="sudo docker"` quan cal.

## Diagnòstic ràpid

```bash
make ps
curl http://localhost:8082/api/health
make test-flow
```

Si has entrat com a docent abans, el navegador pot conservar una cookie de sessió durant unes hores. Usa el botó `Eixir` del portal o una finestra privada per comprovar el comportament sense sessió docent.

Si no pots entrar com a alumne, usa una targeta acabada de generar en el portal: els PINs només es mostren en eixe moment i no apareixen en el CSV.

## Notes

- Aquest stack és per desenvolupament i demostració.
- No conté Authentik encara; el docent usa token local.
- No inclou dades reals ni s'ha de connectar a producció.
- El paquet `edutictac-community` està vendorizat dins de `services/id-api/vendor/` per evitar dependències Git durant el build.
- `make bootstrap-demo` accepta variables com `DEMO_COUNT=12`, `DEMO_TENANT_ID=centre-prova` o `DEMO_TITLE="Repte inicial"`.

## Distribució

Consulta `INSTALL-CENTRES.md` per provar el stack en un centre educatiu, exportar imatges sense Docker Hub o preparar una publicació futura. Abans de compartir el paquet, revisa `CHECKLIST-ENTREGA.md` i executa `make release-check`.

La primera versió tancada queda documentada en `RELEASE-0.1.0-alpha.md`.
