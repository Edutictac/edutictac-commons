# Pla ajornat — trasllat xifrat d'aules entre instal·lacions Commons

> Estat: primer tall d'API implementat i desactivat per defecte. No és una
> funció completa per a alumnat real ni autoritza cap desplegament.
>
> Primera fase: exportació i importació manual d'un fitxer xifrat. El docent
> pot guardar-lo en el seu OneDrive del tenant GVA amb el navegador, si TIC i
> el DPD confirmen que eixe ús està permés. Commons no accedix a Microsoft Graph.
> Els fitxers de l'aula queden per a una fase posterior.

## Primer tall implementat

L'API d'identitat disposa de dos endpoints, ocults fins que una persona
administradora active el trasllat en el panell de grups del tauler docent.
L'ajust és persistent i té efecte immediat en tota la instal·lació.
`EDUTICTAC_CLASSROOM_TRANSFER_ENABLED=1` només establix el valor inicial
si encara no hi ha cap ajust guardat:

- `POST /api/teacher/groups/{group_id}/transfer/export`: retorna un paquet
  xifrat i una clau de recuperació aleatòria. La resposta no s'ha de guardar
  en logs ni compartir com un únic fitxer. Cal una petició del mateix origen.
- `POST /api/teacher/groups/transfer/import`: rep `package` i
  `recovery_key`, valida el contingut i crea o actualitza el grup amb el
  docent autenticat com a propietari.

El xifrat usa AES-256-GCM i una clau aleatòria per exportació. L'exportació
rebutja grups amb col·laboradors, fitxers d'aula o imatges privades de
l'alumnat. La importació només admet un grup que encara no existisca en
destí; rebutja duplicats i conflictes d'identificador. També permet tornar a
importar sobre una aula existent si la seua revisió coincidix exactament amb
la base del paquet; davant de canvis divergents retorna un conflicte sense
sobreescriure dades. El panell docent ja permet descarregar el fitxer, mostrar
la clau una vegada i importar-la. Encara no hi ha previsualització, fusió de
canvis divergents, vinculació OIDC entre instal·lacions ni recuperació guiada.
Per això la funció continua apagada
per defecte. Les proves actuals usen exclusivament SQLite i dades fictícies.

La migració additiva 4, posterior a l'etiqueta d'aula de beta6, guarda en
`group_transfer_state` la revisió importada.
El resum normalitza l'ID docent local, de manera que dos instal·lacions poden
comparar el mateix estat pedagògic encara que el pseudònim OIDC siga diferent.
No es modifica la migració anterior de fitxers.

### Prova entre dos hosts — 26-10-2026

En el primer host es va crear una instància temporal amb una aula fictícia,
una credencial pseudònima, una activitat i un resultat. L'API va exportar el
paquet xifrat (HTTP 200), es va moure el fitxer al segon host i una altra
instància temporal el va importar (HTTP 201). La comprovació al destí va
trobar un grup, una identitat i un resultat. La clau es va passar per un canal
separat i no es va mostrar en logs; les dades i els entorns temporals es van
retirar en acabar.

**Limitació de la primera prova:** el segon host encara no disposava d'una
VM docent LliureX. La prova valida el
transport i la importació entre equips físics amb dades sintètiques, però
encara no validava el flux en una imatge LliureX docent ni l'ús del navegador
amb OneDrive. Esta limitació no era un defecte del producte.

### Preparació de la VM docent — 26-10-2026

S'ha creat una VM docent a partir d'una còpia sanejada de la imatge de prova.
La imatge original no s'ha alterat. El disc QCOW2 és independent, les
empremtes SHA-256 d'origen i destí coincidixen i `qemu-img check` no troba
errors. La VM ha arrancat i ha obtingut xarxa.

**Incidència de l'entorn:** el segon host ha quedat temporalment fora de línia
mentre es preparava l'entorn temporal de prova. En tornar a estar accessible,
s'ha arrancat de nou la VM i s'ha completat la prova.

### Prova de retorn amb la VM — 26-10-2026

S'ha executat l'API actual de Commons en entorns temporals separats, un en
el primer host i un altre dins de la VM docent LliureX. L'origen ha
exportat un grup amb una identitat pseudònima fictícia, una activitat i un
resultat de 8. El fitxer xifrat i la clau han viatjat per separat. La VM ha
importat el grup (HTTP 201), ha validat l'accés de l'alumne fictici (HTTP
200), ha afegit un resultat de 9 i ha exportat un segon fitxer (HTTP 200).
L'origen ha importat el retorn sobre el grup existent (HTTP 200) i ha
comprovat els dos resultats, 8 i 9, i l'accés de l'alumne (HTTP 200).

La prova valida el recorregut lògic amb SQLite i dades fictícies dins de la
VM LliureX. No valida encara una instal·lació completa de Commons, els
controls del navegador, OneDrive ni l'operativa amb dades reals. La funció
continua desactivada per defecte. Els entorns, claus i fitxers temporals
s'han retirat després de la prova.

## Necessitat i recorregut del docent

Les VLAN de les aules poden impedir la comunicació entre servidors. El docent
ha de poder continuar amb un grup en Commons B després de treballar en
Commons A, sense que els dos servidors estiguen encesos alhora.

1. En Commons A, el docent selecciona el grup i prem «Exportar aula». Commons
   prepara una instantània lògica coherent, la xifra i descarrega un fitxer
   versionat. Mostra l'estat de l'exportació i les instruccions de custòdia de
   la clau de recuperació.
2. El docent puja el fitxer xifrat al seu OneDrive des del navegador habitual.
   Commons no rep tokens de Microsoft ni sincronitza carpetes de OneDrive.
3. En l'altra aula, el docent descarrega el fitxer de OneDrive i obri Commons B.
   Selecciona «Importar aula», tria el fitxer i aporta la clau per un canal
   separat. Commons mostra una previsualització dels canvis i els conflictes.
4. Després de confirmar, Commons aplica els canvis en una transacció. Per
   continuar més tard en A, el docent repetix el recorregut en sentit contrari.

La interfície ha d'indicar la revisió local, l'últim paquet importat i si hi
ha canvis locals pendents d'exportar. El fitxer de OneDrive és un mitjà de
transport; les còpies de seguretat del centre continuen sent necessàries.
No hi ha sincronització automàtica en esta fase.

## Abast inicial

| Incloure en el paquet | Posposar o excloure |
|---|---|
| Grup i propietat del docent que exporta | Fitxers compartits i entregues de l'alumnat |
| Identitats pseudònimes, codi, hash del PIN, estat i rotació | Sessions, cookies i tokens de llançament |
| Assignacions, itineraris, ordre i selecció activa | Bases de dades completes i backups |
| Resultats i marques manuals de completat | Authentik, secrets, configuració i dades del host |
| Revocacions i eliminacions amb tombstones | Bases pròpies d'EduHoot, Recursos, Play o Quiosc |

Revisar el model vigent abans d'implementar: `groups`, `group_memberships`,
`student_identities`, `activity_assignments`, `scores`, `manual_completions`,
`itineraries`, `itinerary_items` i `group_itinerary_selection`. Un resultat
d'un mòdul extern només entra si ja està registrat en `id-api`.

El primer pilot inclou **un sol docent propietari i un grup**, amb trasllat
seqüencial entre dos instal·lacions. L'accés col·laboratiu de diversos docents
i les modificacions simultànies necessiten un disseny posterior de permisos i
conflictes; no s'han de donar per resolts en el pilot.

## Contracte i integritat del paquet

- Exportar dades lògiques per grup; no copiar `id.db`, el seu WAL ni carpetes
  internes mentre el servei escriu. La captura ha de ser coherent respecte de
  totes les taules incloses.
- Incloure, dins del contingut xifrat, format i versió de protocol,
  identificador de centre i grup, instal·lació d'origen, revisió de partida i
  revisió nova, data, identificadors estables i hashes de les dades.
- Usar xifrat autenticat amb una biblioteca reconeguda i una clau forta de
  recuperació. La clau no viatja en el mateix fitxer ni s'envia a OneDrive.
  Definir com es genera, entrega, recupera, rota i revoca abans de programar
  la interfície. Una contrasenya docent curta no és suficient per si sola.
- Limitar grandària i recursos de desxifrat, rebutjar formats desconeguts i
  validar integritat, estructura i vinculació amb el grup abans d'aplicar res.
  Mantindre el paquet desxifrat en memòria o en espai temporal privat que es
  netege.
- Registrar l'identificador dels paquets aplicats: importar el mateix fitxer
  dues vegades no ha de duplicar resultats. Preservar ID de grup, alumnat,
  activitats i resultats i comprovar col·lisions de codis públics.
- Abans d'escriure, comparar la revisió de partida amb la revisió local. Si
  A i B han canviat el mateix grup des de l'últim intercanvi, detindre la
  importació i mostrar el conflicte; no substituir en silenci una versió per
  l'altra. Les revocacions i eliminacions han de conservar tombstones.
- Fer una còpia local recuperable abans de la importació i aplicar-la de
  manera atòmica. Una fallada ha de deixar el grup en l'estat anterior.

## Identitat i permisos

L'identificador docent actual es deriva del `sub` OIDC amb un secret local.
Dos instal·lacions poden donar identificadors diferents al mateix docent.
En la primera importació, cal definir una vinculació explícita i verificable
entre el propietari del paquet i el docent autenticat en destí, sense copiar
el secret de sessió. Les importacions posteriors han de comprovar la mateixa
vinculació. L'aplicació de dades ha de passar per autorització del servidor;
el fitxer i la clau, per si sols, no han de concedir accés a altres grups.

La rotació o revocació d'un PIN s'ha de traslladar al destí. Revisar els PIN
existents de quatre dígits i invalidar les sessions locals afectades. El
trasllat de la correspondència entre codi i alumne real queda fora de Commons.

## OneDrive, privacitat i límits

- Confirmar amb TIC que està permés guardar este tipus de paquet en el OneDrive
  del docent i que el flux de pujada i descàrrega pel navegador funciona en
  els equips reals de les aules. No donar per fet l'accés a Microsoft Graph,
  a una carpeta muntada ni a un client de sincronització en LliureX.
- Confirmar amb el DPD qui és responsable del tractament, períodes de
  conservació, eliminació, eixida d'un docent del centre i recuperació quan el
  seu compte de OneDrive deixa d'estar disponible. El xifrat no converteix les
  dades pseudònimes en anònimes.
- Evitar que el nom del fitxer revele centre, grup o docent. Informar que el
  navegador i OneDrive conserven una còpia del paquet i que la clau s'ha de
  custodiar per separat. Actualitzar `PRIVACITAT.md` i `DIRECCIO-DPD.md` abans
  d'un pilot amb dades reals.
- Els fitxers antics i les descàrregues locals requerixen una política
  d'eliminació. L'exportació manual no garantix que l'altre Commons tinga la
  revisió més recent: l'estat visible i la comprovació de revisió són
  essencials.

## Treball pendent per fases

1. **Validació d'ús:** confirmar amb TIC i DPD l'ús del OneDrive docent, els
   terminis i el procediment quan canvia el professorat. Provar el navegador
   en LliureX amb un fitxer fictici.
2. **Contracte i seguretat:** definir format, xifrat, clau de recuperació,
   identitat docent, revisions i política de conflictes. Auditar totes les
   vies d'escriptura del nucli perquè l'exportació siga coherent.
3. **Prototip local:** dos Commons amb dades fictícies. A → B → A, paquet
   repetit, alterat i edicions divergents ja estan provats. Queden revocació,
   eliminació, importació interrompuda i altres casos de conflicte.
4. **Interfície i operació:** completar la previsualització, l'estat de revisió
   i la guia per al docent; provar backup i reversió. Els botons inicials
   d'exportació i importació ja estan implementats darrere del flag.
5. **Pilot controlat:** un docent, un grup i dos aules del mateix centre,
   després de completar documentació i validacions. Mesurar fricció real abans
   d'ampliar a diversos docents o grups.

## Fase posterior: fitxers de l'aula

Incorporar metadades i blobs de `classroom_files` com una unitat coherent.
Definir versions per ruta, substitució, esborrat, quotes i permisos de les
entregues privades; verificar integritat i restauració d'una aula completa.
Les entregues poden contindre noms i altres dades directament identificatives,
de manera que requerixen una revisió específica de privacitat i capacitat de
OneDrive abans d'activar esta fase.
