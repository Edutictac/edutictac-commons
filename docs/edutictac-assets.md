# EduTicTac Rebost: integració amb Commons

Auditoria i implementació inicial: 19-10-2026. El codi de Blocs viu en el repositori
[Edutictac/edutictac-blocs](https://github.com/Edutictac/edutictac-blocs), separat d’este stack.
La implementació i el contracte compartit estan documentats en
[docs/assets.md de Blocs](https://github.com/Edutictac/edutictac-blocs/blob/blocs/docs/assets.md).

## Arquitectura comprovada

Commons 0.1.1-beta1 conté portal/identitat, Play, Recursos, administració, EduHoot i Authentik.
Play conserva fitxers en `data/play`; Recursos té una API i biblioteca d’activitats pròpia.
Blocs encara no forma part de Compose ni dels backups generals de Commons. La seua GUI és
un fork React/TurboWarp servit per nginx; la seua API opcional usa FastAPI, Authentik i SQLite.
No s’han afegit serveis, ports, secrets ni bases noves a este stack per a Rebost.

## Prototip inicial de Blocs (retirat de la interfície)

- Flux històric **Fitxer → EduTicTac Rebost…** (retirat): pujada, arrossegar i soltar, cerca, classificació,
  miniatures, reanomenament, duplicació, eliminació i selecció de personatges/fons.
- PNG, JPEG i WebP verificats i normalitzats; SVG de pujada rebutjat. S’aprofita l’editor
  de disfresses existent i s’oferixen transformacions bàsiques abans de guardar.
- JSON `blocs-project` v3 amb recursos descrits, vinculats o pendents; v1/v2 i catàlegs
  anteriors es mantenen. Marcadors visibles, mai substitucions silencioses de personatges.
- Peticions copiades a IA externa, incloses peticions per a cada imatge. Sense APIs d’IA.
- `.sb3` conserva el projecte i les imatges; s’obri i es guarda des de Fitxer en Blocs.
- Biblioteca anònima en IndexedDB del navegador; biblioteca de compte en la mateixa SQLite
  privada de l’API Blocs, amb autorització per propietari, quotes i control d’origen.
- Interfície en castellà i valencià. El mòdul reutilitzable és `src/assets/` de Blocs,
  separat de l’adaptador de la VM. Books no s’ha implementat.

## Preparació per a Books i altres mòduls

El contracte comú és `{id,type,name,description,file}`; `file` és una ID opaca, no una URL.
Tipus inicials: `sprite`, `background`, `object`, `illustration`. La biblioteca exposa
`list/read/add/update/remove/duplicate` i un panell React independent de Redux i de la VM.
Books podrà reutilitzar-los amb un adaptador de pàgina i el mateix endpoint privat del mateix
origen. Àudio, narració i animacions requeriran una ampliació versionada quan s’implementen.

No s’ha de connectar un mòdul de Books directament a URLs privades d’un altre domini ni exposar
les imatges a Recursos públic. La reutilització entre comptes o la publicació requerixen una
política explícita de permisos; ara es pot entregar voluntàriament el fitxer `.sb3` del projecte.
Rebost gestiona imatges i no duplica la importació/exportació de projectes de Blocs.

## Persistència i desplegament

La biblioteca privada es guarda en `BLOCS_DB_PATH`, normalment
`/var/lib/blocs-api/identity.sqlite3`. Cal actualitzar GUI i API Blocs conjuntament i instal·lar
Pillow 13.0.0 (MIT-CMU). El servei systemd existent ja té directori privat i umask restrictiva.
Si es contenidoritza eixa API, cal muntar un volum persistent sobre `/var/lib/blocs-api`.
El volum nginx `blocs-assets` és només la cau Scratch i no substituïx eixe emmagatzematge.

Els backups d’este stack no cobrixen automàticament una API Blocs externa. Incorporeu la seua
SQLite amb el backup API, comproveu la restauració en una ruta aïllada i vigileu l’espai lliure.
Les quotes per compte no limiten l’espai total de tots els comptes. L’eliminació de la biblioteca
no altera les imatges ja incorporades als projectes ni les còpies operatives anteriors.

No s’ha publicat cap imatge ni s’ha reiniciat cap servei instal·lat. Les proves del Rebost viuen
al repositori Blocs: unitàries de compatibilitat, API amb SQLite temporal, flux de navegador
en castellà/valencià i prova Docker amb contenidor/volum nous i xarxa desactivada. Abans d’un
pilot real, cal validar el desplegament concret amb Authentik i una tauleta física.

## Plan de centralització

La prioritat confirmada és una biblioteca central accessible des de diferents aplicacions,
amb identitat i permisos comuns. [Pla tècnic, migració i criteris d’acceptació](assets-central-plan.md).
El pla complet continua pendent de completar. El 20-10-2026 s’ha implementat localment
el [nucli privat i el gestor central](rebost.md), amb proves d’API, navegador i persistència.
Encara no està desplegat. La tria de personatge/fons des de Blocs ja usa Rebost en local;
guardar dibuixos des del pintor també està implementat localment. Integrar un segon editor continua pendent.

Ampliació d’abast confirmada el 20-10-2026 i implementada per fases en local:

- **Guarda al Rebost** des de Disfresses/Fons de Blocs: còpia privada de la imatge seleccionada,
  inicialment PNG amb transparència, reutilitzable des d’altres aplicacions; sense sincronitzar
  canvis posteriors ni exportar el projecte.
- **Catàleg EduTicTac** i **Les meues imatges** en el selector comú. Reutilitzar el catàleg de Blocs
  després d’inventariar llicències i procedència, conservant atribució i IDs antics. Originals
  comuns de només lectura; editar crea una còpia privada. Càrrega versionada sense duplicacions
  ni dependència de descàrregues externes durant l’ús.

Els fluxos, permisos, límits i criteris d’acceptació estan inclosos en el pla central.

Revisió de duplicitats: [què ja resol Blocs i com simplificar la integració](rebost-blocs-audit.md).
Es prioritza el nucli central abans de consolidar un gestor/editor paral·lel dins de Blocs.

Neteja aplicada a Blocs: retirats menú, diàleg i editor de la biblioteca provisional. Es
conserven les dades i la revisió IA amb vinculació directa de fitxer. **Tria del Rebost** ja
està en els botons de personatge/fons, reutilitzant Disfresses/Fons per a editar.


Actualització: la tria central ja està disponible també en Disfresses/Fons i en cada recurs
pendent de la revisió IA, mantenint noms i blocs. La suite habitual de Blocs inclou les proves
noves; el navegador comprova `.sb3` amb crèdits i imatges sense sessió. No s’han publicat canvis.
