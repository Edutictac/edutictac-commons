# Commons 0.1.1-beta6 — estabilitat, xarxes i aula

Entrega sobre beta5. Conserva les dades, els fitxers d’aula, els mòduls i la
configuració federada. No reutilitza ni sobreescriu els tags de beta5.

## Canvis

- Límits de memòria, CPU i PIDs, rotació de logs, `restart: unless-stopped`,
  healthchecks i `busy_timeout` de SQLite.
- Xarxes Docker separades per nucli, recursos, Play, EduHoot, editors i
  Authentik; bases de dades aïllades.
- Accés per LAN sense Internet: `edutictac.local`, IP de reserva, icona i
  llançador resistents, i guia d’instal·lació amb URL i port.
- Nom humà opcional per a cada aula i avís del límit de 20 aules al selector.
- El portal torna al català quan el navegador no demana cap dels idiomes
  suportats.
- El xip compartit pot amagar l’entrada de codi i PIN a les aplicacions que ho
  demanen.

## Imatges

Les imatges de Commons es publiquen amb el tag `0.1.1-beta6`. Les peces sense
canvis de codi (administració, Play, Blocs, Llibres i Banc) es retaguen des
dels digests verificats de beta5; els digests finals consten en
[images.json](images.json) i [compose.images.json](compose.images.json).

## Actualització

Actualitza primer el paquet i després les imatges des del panell. Fes una còpia
de seguretat i comprova-la abans del canvi. La beta5 es conserva com a versió
anterior per a rollback.

El paquet `0.1.1~beta6` està publicat a APT amb la firma habitual. La descàrrega,
l’índex i la selecció de versió s’han verificat; els hashes consten en
[installer.json](installer.json) i [apt-verification.json](apt-verification.json).
La validació final en LliureX i el desplegament en centres queden pendents i es
documentaran en [docs/VALIDACIO-BETA6.md](../../docs/VALIDACIO-BETA6.md).
