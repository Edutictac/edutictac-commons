# Commons 0.1.1-beta6.1 — correcció del nom d’aula

Correcció sobre beta6. Conserva les dades, els fitxers d’aula, els mòduls i la
configuració. No sobreescriu els tags de beta6.

## Canvis

- `POST /api/identities/batch` desa i retorna el nom d’aula opcional. En beta6
  el formulari l’enviava, però el backend creava l’aula sense etiqueta.
- Es manté la resta de beta6: estabilitat, xarxes separades, accés LAN mDNS/IP,
  límit de 20 aules visible i fallback de llengua al català.

## Imatges

Només es reconstrueix `commons-id-api`. Les altres imatges es retaguen des dels
digests verificats de beta6; els digests finals consten en
[images.json](images.json) i [compose.images.json](compose.images.json).

## Actualització

Actualitza el paquet i després les imatges. Fes una còpia i comprova-la abans
del canvi. Beta6 es conserva com a versió anterior.

El paquet `0.1.1~beta6.1` es publica a APT amb la firma habitual. La validació
en LliureX i el desplegament es documenten en
[docs/VALIDACIO-BETA6.1.md](../../docs/VALIDACIO-BETA6.1.md).
