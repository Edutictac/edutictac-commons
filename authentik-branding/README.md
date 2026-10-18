# Marca EduTicTac en Authentik

Aplica a l'accés de Commons la mateixa identitat que `id.edutictac.es`, sense
dependre d'Internet: tots els recursos els servix el mateix Authentik.

| Element | Fitxer | Com s'aplica |
|---|---|---|
| Títol, logo, favicon, fons, CSS, tema clar i locale | `../authentik-blueprints/edutictac-branding.yaml`, `custom.css`, `assets/` | Blueprint en el worker |
| Títols dels fluxos en valencià | `default-blueprints/<versió>/` | Substituïx `/blueprints/default` |
| Traducció valenciana sobre el locale `es` | `i18n/<versió>/` | Muntatge en servidor i worker |
| Peu de pàgina (EduTicTac Commons, edutictac.es) | `startup_migration.py` | Migració de sistema en cada arrancada |

El blueprint i els blueprints per defecte només es tornen a aplicar quan canvia
el seu fitxer (instal·lació o actualització de Commons). El peu s'omple només si
està buit; en una instal·lació nova apareix després del primer reinici.

## Procedència

- Logo, favicon i fons: repositori `Edutictac/edutictac.es`, `assets/id/`.
- Fonts Inter i Poppins (SIL Open Font License 1.1): `assets/fonts/` del mateix
  repositori, només els subconjunts llatins que usa el CSS.
- CSS: el de la marca d'`id.edutictac.es`, amb les URL de les fonts canviades a
  rutes locals.
- Traducció: repositori `Edutictac/authentik-va`, construïda per a la versió
  d'Authentik fixada en `compose.yml`.

## En canviar `AUTHENTIK_TAG`

1. Construir la traducció per a la versió nova en `authentik-va` (el nom del
   fragment JS canvia) i copiar-la en `i18n/<versió>/`.
2. `python3 scripts/build-authentik-default-blueprints.py --tag <versió>`.
3. Actualitzar les rutes de `compose.yml`.
4. `python3 -m pytest tests/test_authentik_branding.py` i
   `python3 scripts/test-authentik-branding-docker.py` (Authentik aïllat amb
   `docker run`, sense volums ni recursos compartits).
