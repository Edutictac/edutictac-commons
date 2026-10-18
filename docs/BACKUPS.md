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

Com a opció segons l'equipament del centre, es pot mantindre una **segona còpia
en un altre dispositiu del centre**, com un NAS o un disc USB connectat
periòdicament. Ha de ser un dispositiu diferent del disc del servidor per poder
recuperar les dades si este falla. No cal un servei de núvol ni enviar les dades
fora del centre.

Esta segona còpia és opcional i encara no té configuració ni automatització en
el panell. Cal copiar una carpeta de backup ja completada i verificada, limitar
l'accés a les persones responsables i protegir les dades i les claus que conté;
el xifrat és especialment convenient si el dispositiu és extraïble.

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
