# Commons 0.1.1-alpha26 — Selector de ferramentes

Imatges `linux/amd64` construïdes des de `04d293c`: API, portal i Administració
reconstruïts; Play conserva el digest d'alpha25. Procedència i digests immutables
en [images.json](images.json); override Compose en [compose.images.json](compose.images.json).
Els canvis locals previs de Makefile i d'exportació de catàleg no s'inclouen.

- Assistent en el primer accés autenticat a Administració; es pot posposar.
- Activació i desactivació posterior de Play, EduHoot, Recursos i Quiosc.
- El nucli i Authentik romanen actius. Les dades, assignacions i resultats
  dels mòduls desactivats es conserven; el portal oculta els seus accessos.
- Backup previ, comprovació de salut, detecció de canvis simultanis, bloqueig
  de manteniment i recuperació de la configuració anterior davant fallades.
- Seguiment de l'operació després de reiniciar Administració o recarregar el
  navegador. CA/VA/ES/EN, escriptori i mòbil.
- Quiosc exigix preparació prèvia d'Epoptes i no permet canvis mentre queden
  equips pendents de restaurar. Pendent de pilot en aula LliureX real.

Paquet `0.1.1~alpha29`: instal·lacions noves amb només el nucli, selector després
d'activar el portal i iniciar sessió com a administrador. Les actualitzacions
conserven els perfils i tags existents; s'afig `play` a les configuracions
anteriors per conservar el servei que abans arrancava sempre.
Per usar el selector en una instal·lació existent, actualitzar també API,
portal i Administració a alpha26; el `.deb` conserva els tags configurats.

Validació: 123 proves Python correctes (2 Docker optatives de Quiosc omeses),
66 proves de navegador correctes i prova Docker del cicle d'activació,
desactivació, conservació de dades i rollback. Les proves Docker substituïxen
tots els noms explícits de volums i xarxes, rebutgen recursos existents i
validen els bind mounts abans de l'arrancada. Detall: [mòduls](../../docs/modules.md).

Publicació APT completada el 2026-10-18. Firma d'InRelease, SHA-256 de l'índex
i SHA-256/mida del paquet descarregat verificats. Metadades i URL directa en
[installer.json](installer.json). CI del codi font correcta:
[GitHub Actions](https://github.com/Edutictac/edutictac-commons/actions/runs/39063419375).

Amb el repositori APT ja configurat:

```bash
sudo apt update
sudo apt install edutictac-commons
```

La publicació no desplega esta versió en el stack actiu. La prova d'instal·lació
completa en una màquina LliureX nova continua sent una validació independent.
