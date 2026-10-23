# Còpies completes i restauració

Disponible en la distribució alpha27 / paquet alpha30. Els backups
anteriors continuen sent llegibles i es marquen com a parcials en Administració.

## Què es guarda

| Servei | Dades incloses |
|---|---|
| Commons | Instantània SQLite d'identitats, grups, assignacions, itineraris i resultats |
| Authentik | Exportació lògica PostgreSQL, fitxers i plantilles locals |
| Play | Activitats, catàleg i fitxers guardats |
| Recursos | Instantània SQLite, documents i altres fitxers locals |
| EduHoot | Exportació de totes les bases de Mongo, uploads i logs |
| Quiosc | Instantània SQLite de sessions, inventari i auditoria, quan existeix |
| Configuració | `.env` privat, referències de Compose/blueprints/compatibilitat i configuració local de Quiosc si està preparada |
| Dades addicionals | Catàleg descarregat i altres fitxers persistents de `data/` |

Els mòduls desactivats també es copien si conserven dades. Una base de dades
aturada pot arrancar temporalment per exportar-la; després torna al seu estat
anterior. PostgreSQL es copia amb `pg_dump`, mai obrint el seu volum amb un
segon servidor. Mongo es copia amb `mongodump`; els seus fitxers interns no
formen part dels arxius de dades.

## Crear i comprovar

En Administració, **Crear backup ara** inicia un treball en el host. El panell
mostra el progrés, conserva el seguiment si es recarrega i es reconnecta després
de la pausa. El procés és independent del contenidor del panell.

Per mantindre coherents les bases i els documents, es paren breument els serveis
amb escriptura i es reprenen els que estaven en marxa, també si la còpia falla.
Les bases de dades continuen disponibles per fer les exportacions. Les sessions
pendents de restaurar de Quiosc impedixen esta parada: cal resoldre-les abans.

Des del directori de la instal·lació:

```bash
./scripts/backup.sh
./scripts/backup-check.sh
```

La còpia només es publica en `backups/commons-<data>/` quan el manifest,
SHA-256, arxius i integritat SQLite passen la validació. La carpeta temporal
s'elimina si falla. El manifest v2 declara els serveis i fitxers inclosos;
no conté claus ni el contingut de la configuració. Fitxers `0600`, carpetes
`0700`: la còpia conté dades privades i claus de recuperació.

El manifest i els hashes comproven integritat; no substituïxen una prova real
de restauració. Les còpies automàtiques es guarden localment en el servidor.

## Segona còpia opcional en un dispositiu del centre

Disponible amb les imatges alpha30 i el paquet alpha34. Cal actualitzar tant
el paquet com la imatge d’Administració en instal·lacions existents.

En **Administració → Backups → Segona còpia del centre**, indicar el punt de
muntatge del NAS o USB en el servidor (per exemple, `/mnt/copias-centre`) i prémer
**Activar en este dispositiu**. Després es pot usar **Copiar l'últim backup ara**
per fer la primera còpia sense esperar la programació diària. **Desactivar
segona còpia** conserva tant les còpies locals com les del dispositiu.

El centre ha de muntar el dispositiu prèviament amb les ferramentes del sistema.
El panell no munta unitats ni demana credencials de xarxa. Cal un dispositiu
físic diferent del disc del servidor, amb permís d'escriptura per al compte que
executa Commons i permisos privats: carpetes 0700 i fitxers 0600. El xifrat és
especialment convenient per a dispositius extraïbles. No cal núvol ni enviar
les dades fora del centre.

Es comprova el muntatge, es rebutja el mateix sistema de fitxers i, quan sysfs
permet identificar-los, particions/LVM/RAID que comparteixen discos físics amb
els backups locals. Es registra una empremta del dispositiu (UUID o origen de
xarxa); si canvia, cal revisar i tornar a activar el destí. Un sistema de
fitxers que no permeta verificar permisos privats es rebutja. En configuracions
d'emmagatzematge que no expose sysfs, el responsable ha de comprovar que el
destí es troba en un altre dispositiu físic.

Cada backup local manual o programat es copia **després de completar-lo i de
reprendre els serveis**. El destí és:

```text
<punt-de-muntatge>/edutictac-commons/<identificador-instal·lació>/commons-<data>/
```

La còpia es prepara en una carpeta temporal del dispositiu i només es publica
quan els hashes de tots els fitxers coincideixen amb la còpia local validada.
Un reintent comprova una còpia ja existent sense sobreescriure-la. Si hi ha
contingut diferent amb el mateix nom, s'atura i es conserva el contingut existent.
No es puja un format v1 parcial.

Si el dispositiu està desconnectat, canvia, es queda sense espai o falla
l'escriptura, es manté la còpia local i el panell mostra l'últim intent fallit.
El resultat del backup local continua sent correcte i s'aplica la seua retenció.
El descriptor del muntatge es manté obert durant la còpia per evitar escriure
en el directori buit del servidor si es desmunta la unitat. Tornar a connectar
el dispositiu i prémer **Copiar l'últim backup ara** reintenta la còpia; la següent
execució diària també ho intentarà. El botó copia l'últim backup, no tot l'històric.

**Retenció:** el 7/4/6 continua aplicant-se només a les còpies locals. La segona
còpia conserva les carpetes publicades, sense esborrat automàtic. Cal revisar
periòdicament l'espai i gestionar les còpies antigues del dispositiu; el panell
avisa si una còpia no cap.

La configuració (`backups/secondary.json`) i l'últim resultat
(`backups/secondary-status.json`) són locals i privats. No s'inclouen en la
restauració de dades: després de canviar de servidor, cal tornar a seleccionar
el dispositiu. No es guarden credencials del NAS.

CLI equivalent, des del directori de la instal·lació i amb el mateix compte del
servei (sense `sudo`):

```bash
python3 scripts/backup-secondary.py configure --mount /mnt/copias-centre
python3 scripts/backup-secondary.py copy
python3 scripts/backup-secondary.py disable
```

Per recuperar una còpia del dispositiu, traslladar la carpeta `commons-<data>`
completa a `backups/` en el servidor de destí, mantenint permisos 0700/0600.
Validar-la amb `backup-check.sh` i usar el selector de restauració habitual del
panell. No sobreescriure una carpeta local existent: comprovar primer si és la
mateixa còpia. La recuperació completa conserva les mateixes comprovacions i
còpia de seguretat prèvia que una restauració des del disc local.

## Programació

**Activar backups automàtics** manté el timer d'usuari existent: cada dia a les
03:15, amb marge aleatori de deu minuts, verificació i retenció 7/4/6. El servei
disposa de fins a trenta minuts i compartix el bloqueig de manteniment amb
actualitzacions, restauracions i selector de mòduls.

```bash
./scripts/install-backup-timer.sh
systemctl --user list-timers edutictac-commons-backup.timer
```

El compte que executa el treball necessita Docker i sessió systemd d'usuari;
per funcionar després de tancar sessió, l'administració del servidor ha de
habilitar `loginctl enable-linger` per a eixe compte.

## Restaurar

En Administració, seleccionar la còpia i escriure la confirmació indicada.
També es pot executar:

```bash
./scripts/restore.sh backups/commons-YYYYmmddTHHMMSSZ
```

Abans de canviar dades, es validen tots els hashes, SQLite i les rutes i tipus
dels arxius. Es rebutgen rutes que isquen del destí, dispositius, enllaços
insegurs i manifests incomplets. Després es crea una còpia completa de seguretat
de l'estat actual; si falla, la restauració no comença.

Els serveis amb escriptura es paren. Es restauren PostgreSQL, Mongo, SQLite i
fitxers dels serveis declarats. La configuració recupera les claus de les
aplicacions, però conserva els ports, adreces, imatges, identitat del projecte,
usuari local i accés al PostgreSQL del servidor de destí. La plantilla Compose
i els fitxers de programa actuals es mantenen; les referències arxivades
permeten revisar personalitzacions abans de reintroduir-les.

Quiosc queda desactivat després d'una restauració completa: revisar l'aula i,
en un altre servidor, repetir la preparació d'Epoptes abans de reactivar-lo.
No es recuperen sockets ni processos d'una sessió anterior.

Si la restauració falla després de començar, es deixa constància del treball,
la còpia prèvia continua disponible i els serveis amb escriptura es mantenen
aturats. Cal recuperar des d'eixa còpia i revisar l'error abans de reprendre
l'activitat; no es presenta el procés com a completat.

Les còpies v1 restauren únicament id-api i, si ho declaren, EduHoot. El panell
advertix de la seua cobertura parcial; no restauren claus ni dades d'altres
mòduls. Com en el format nou, es crea una còpia de seguretat abans de començar.

## Prova aïllada

`python3 scripts/test-modules-docker.py --backup-roundtrip` crea recursos amb
noms exclusius i rebutja qualsevol volum, xarxa o bind mount que isca del seu
entorn temporal. Fa una còpia, canvia dades i comprova que restaurar recupera
PostgreSQL, Mongo, SQLite i fitxers. Requerix les imatges de prova indicades al
script. No executar una variant que reutilitze noms normalitzats del stack actiu.

## Blocs i Llibres

Els projectes i llibres es guarden al navegador o es descarreguen. El backup del
servidor no substituïx la descàrrega d’eixos treballs. El Rebost i les publicacions
del Banc continuen en les seues còpies existents. La caché del catàleg Blocs és
regenerable i no necessita una còpia pròpia.
