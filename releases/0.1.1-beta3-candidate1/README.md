# Candidata de Fitxers de l’aula

`0.1.1-beta3-candidate1`, validada el 23 d’octubre de 2026.

Actualització d’imatges sobre una instal·lació beta2 existent, sense paquet nou.
Incorpora carpetes compartides pel professorat, entregues privades de l’alumnat
i límits configurables des d’Administració. No depén del Banc.

Es reconstruïxen `commons-id-api`, `commons-portal` i `commons-admin`. La resta
conserva les imatges verificades de beta2, amb les etiquetes necessàries perquè
l’actualitzador detecte un conjunt complet. No canvien els volums ni Compose.

- [Manifest amb digests i revisions](images.json).
- [Referències Compose](compose.images.json).
- [Validació real en LliureX](../../docs/VALIDACIO-BETA3-FITXERS.md).
- [Funcionament, límits i API](../../docs/FITXERS-AULA.md).

L’actualitzador instal·lat en beta2 fa la còpia prèvia, comprova les imatges,
descarrega la candidata i recrea els contenidors. La migració additiva s’aplica
en arrancar l’API. El paquet instal·lat i `VERSION` continuen en beta2;
Administració mostra l’etiqueta nova de les imatges.

La còpia de beta2 ja inclou `data/id-api/files` com a arrel addicional. S’ha
comprovat una restauració completa amb fitxers reals, després d’esborrar-ne un
des de la interfície. No cal substituir els scripts del servidor per a esta
actualització local.

El codi viu en `feature/aula-fitxers`; `main` conserva la beta2 validada.
No és una publicació APT ni un desplegament en producció federada.
