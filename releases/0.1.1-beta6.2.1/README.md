# Commons 0.1.1-beta6.2.1 — hotfix de xarxa i clau de còpies

Hotfix del paquet sobre beta6.2. Conserva les dades, els fitxers d’aula, els
mòduls i la configuració. La majoria d’imatges continuen sent
`0.1.1-beta6.2`; només canvia l’administració.

## Canvis

- El portal passa a `networks: [core, recursos, editors]`.
- Blocs i Llibres queden accessibles després de reiniciar, sense connexions
  manuals al contenidor.
- `/admin/` admet el propi servidor per qualsevol IP local, la Tailnet o un
  túnel SSH. Les IP exactes s'actualitzen en arrancar; els altres equips de la
  LAN continuen rebent 403.
- Els helpers de Play i EduHoot usen la mateixa autenticació que el producte
  (sessió OIDC o token específic) i ja passen en la instal·lació real.
- El paquet prepara el directori `systemd/user` de l'usuari del servei amb la
  propietat correcta perquè el timer de còpies es puga instal·lar.
- El selector d'eines demana la clau pública age si falta i la desa sense
  guardar mai la privada al servidor. La selecció s'atura amb
  `backup_key_required` abans de crear una còpia sense xifrar.
- La prova `tests/test_compose_stability.py` exigix la xarxa i les proves
  noves cobrixen el guardat de la clau i el bloqueig de la selecció.

## Imatges

La resta d'imatges són les de [beta6.2](../0.1.1-beta6.2/images.json). Només
es publica una imatge nova d'administració amb el formulari de la clau
pública: `commons-admin:0.1.1-beta6.2.1`.

## Instal·lació

Paquet candidat `0.1.1~beta6.2.1`. Actualitza una instal·lació beta5, beta6,
beta6.1 o beta6.2 conservant `.env`, dades i mòduls.

## Validació

- Actualització beta6.2 → beta6.2.1 en la VM LliureX del professor.
- Reinici ordenat: 13 contenidors saludables.
- El portal conserva `core`, `recursos` i `editors`; `llibres` resol `portal`.
- Primera selecció de cinc eines amb la clau pública configurada: backup age
  verificat, cap clau privada al servidor i estat `idle`.
- Administració des del professor per `127.0.0.1`, IP i mDNS: 200; des de
  l'alumne: 403; després de reiniciar, el comportament es conserva.
- `make test-play-commons` amb cookie OIDC i `make test-eduhoot-flow` amb el
  token específic: tots dos correctes.
- Timer de còpies: instal·lació i desinstal·lació com a `lliurex` correctes;
  el timer queda actiu i després inactiu.
- Des de l’alumne, per IP i mDNS, Portal, Identitat, Play, EduHoot, Recursos,
  Blocs, Llibres i Rebost retornen 200.
