# Peu comú EduTicTac

Barra discreta al final de les pàgines públiques dels serveis propis. No
substituïx el xip de compte: no porta selector d'idioma ni de tema, no és fixa
i no tapa contingut.

## Aspecte

- Una línia en escriptori i dos blocs en mòbil.
- Esquerra: `EduTicTac · <servei> · <versió>` (la versió s'omet si no n'hi ha).
- Dreta: `Inici`, `Privacitat`, `Codi font` i la llicència, enllaçada al
  `LICENSE` del repositori.
- Text petit, color atenuat, bord superior, focus visible i mode clar/fosc.
- Un sol `<footer class="ett-footer">` per pàgina.

## CSS

Fitxer canònic:

```text
edutictac-commons/services/portal/public/assets/edutictac-footer.css
```

Cada projecte en guarda una còpia idèntica (`styles/edutictac-footer.css`,
`public/assets/...`) i la carrega des del seu propi origen. No s'enllaça a
Commons: així el peu es veu si Commons no respon i no cal ampliar la CSP.

Quan es canvie el CSS cal actualitzar totes les còpies i passar les proves de
cada projecte. Les còpies han de tindre el mateix hash.

## Markup

Dins d'un contenidor que ja té padding (per exemple, la web pública):

```html
<footer class="ett-footer">
  <p class="ett-footer__id">
    <span class="ett-footer__brand">EduTicTac</span>
    <span aria-hidden="true">·</span>
    <span class="ett-footer__service">Commons</span>
    <span class="ett-footer__version">v0.1.1-beta5</span>
  </p>
  <div class="ett-footer__links">
    <a href="/" data-i18n="footer.home">Inici</a>
    <a href="/privacy.html" data-i18n="footer.privacy">Privacitat</a>
    <a href="https://git.edutictac.es/Edutictac/edutictac-commons" data-i18n="footer.source">Codi font</a>
    <a href="https://git.edutictac.es/Edutictac/edutictac-commons/src/branch/main/LICENSE">AGPL-3.0</a>
  </div>
</footer>
```

Fora d'un contenidor amb padding, afegir `ett-footer--page`:

```html
<footer class="ett-footer ett-footer--page">...</footer>
```

## i18n

Claus compartides: `footer.home`, `footer.privacy`, `footer.source`. La marca,
el nom del servei, la versió i l'identificador de llicència no es tradueixen.
Si una app no té i18n, el text base pot quedar en català; no s'inventen
traduccions.

## On s'aplica

- `edutictac.es`: les set pàgines públiques.
- Commons: portada, tauler docent, tauler alumnat, privacitat, ajuda docent,
  accés a Blocs, accés a Llibres i Rebost.
- Apps: només portades o pantalles d'entrada; mai editors a pantalla completa
  ni el mode presentació.

Fora d'abast: Quiosc, editor de Blocs, editor de Play, EduCraft, mode
presentació de Robotics i serveis de tercers.
