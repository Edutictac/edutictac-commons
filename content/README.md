# Catàleg de continguts compartit

Aquest directori documenta el contracte del futur repositori independent
`edutictac-content`. No conté encara dades reals del catàleg ni activitats
privades de cap centre.

El repositori de continguts publicarà un `manifest.json` versionat i fitxers
associats. Commons podrà descarregar una versió, validar-la i importar per
separat els canals `resources` i `eduhoot`.

Cada canal publica un únic fitxer agregat: `resources/catalog.json` i
`eduhoot/quizzes.json`. L'importador de Commons els envia sencers als serveis
corresponents (`recursos-api` i EduHoot local), de manera que el manifest només
cal que referencie eixos dos artefactes (un ítem per canal).

## Contracte mínim

Cada entrada del manifest té:

- `id`: identificador estable i únic dins del canal;
- `channel`: `resources` o `eduhoot`;
- `title`, `description`, `language` i `license`;
- `revision`: número enter que creix quan canvia el contingut;
- `artifact.path`: ruta relativa al fitxer publicat;
- `artifact.sha256`: hash SHA-256 del fitxer;
- `metadata`: camps específics del canal.

Les rutes són relatives al directori de la versió publicada. No s'accepten
rutes absolutes ni `..`. Les instal·lacions han de validar el manifest i els
hashes abans d'activar una sincronització.

El manifest d'exemple es pot comprovar amb:

```bash
python3 scripts/validate-content-manifest.py content/manifest.example.json
```
