# Funcionament en una LAN sense Internet

Data de l'auditoria: 24-10-2026.

## Conclusió

El nucli de Commons no depén de CDN, fonts de Google ni serveis externs per
carregar el portal, la identitat, els taulers o les apps. Els recursos
opcionals de continguts sí que poden necessitar Internet, però no bloquegen
l'ús local.

L'accés previst és `http://edutictac.local` amb els ports per aplicació. Si un
dispositiu no resol `.local`, el portal i les apps també responen per IP. Per
al login docent per IP cal configurar `EDUTICTAC_PUBLIC_HOST`; el codi/PIN de
l'alumnat funciona per IP sense canvis.

## Què s'ha comprovat

- El portal carrega tots els scripts, CSS, fonts i el xip de compte des del
  mateix host (`/assets/...`, `/styles.css`, `/i18n.js`). No hi ha CDN.
- El portal respon per `127.0.0.1`, per la IP de la LAN i per
  `edutictac.local` (HTTP 200), i `/api/health` també respon per IP.
- Els enllaços de les apps del portal es generen amb
  `window.location.hostname` y el port corresponent; per tant, si s'entra per
  IP, els enllaços apunten a la IP.
- L'única dependència opcional externa detectada és la sincronització de
  continguts (`CONTENT_CATALOG_BASE_URL`) i la importació pública d'EduHoot;
  no són necessàries per al portal, l'aula ni les credencials.
- Els enllaços a activitats externes del catàleg poden no obrir-se sense
  Internet; les activitats allotjades localment sí.

## mDNS: problema detectat i correcció

En un equip amb Docker, Avahi pot anunciar `edutictac.local` amb la IP del
bridge de Docker (`172.x`) o una IPv6 link-local. Un altre dispositiu de la
LAN que resolga eixa adreça no arribarà al servidor.

Correcció aplicada a l'instal·lador: `postinst` calcula les interfícies
físiques i escriu `allow-interfaces=` a `/etc/avahi/avahi-daemon.conf`, de
manera que no s'anuncien `docker0`, `br-*`, `veth*`, `virbr*` ni `vnet*`.
A l'equip d'auditoria, abans: `edutictac.local -> 172.23.0.1`; després:
`edutictac.local -> 192.168.100.6` (IP de la LAN).

En instal·lacions existents cal reaplicar el `postinst` o afegir
manualment `allow-interfaces=<interfície-física>` i reiniciar `avahi-daemon`.
Si canvieu de targeta (Ethernet/WiFi), torneu a revisar-ho.

## Compatibilitat mDNS per dispositiu

| Dispositiu | `.local` | Recomanació |
|---|---|---|
| macOS / iOS / iPadOS | Sí, Bonjour | mDNS o IP |
| Windows 10/11 | Variable segons versió i aplicació | Provar; si falla, IP |
| Linux amb Avahi | Sí | mDNS o IP |
| Android | Variable segons fabricant/navegador | IP com a opció principal |
| ChromeOS | Suport limitat | IP |

Per això el portal sempre ha de tindre una via d'accés per IP. No s'ha
d'introduir cap dependència obligatòria de DNS extern ni de certificats.

## Accés per IP

1. Esbrineu la IP del servidor:
   ```bash
   hostname -I
   ```
2. Obriu `http://<IP>:<PORTAL_PORT>/` (per defecte `:8082`, o `:80` si el
   paquet l'ha configurat així).
3. Les apps del portal es poden obrir pels seus ports:
   `:8084` Play, `:8086` Recursos, `:8090` EduHoot, `:8098` Llibres.
4. Per al login docent (OIDC) per IP, poseu a `.env`:
   ```env
   EDUTICTAC_PUBLIC_HOST=192.168.1.50
   ```
   i reapliqueu la configuració (`postinst`/instal·lador). Això regenera
   issuer, redirects, URLs d'apps i `PLAY_ALLOWED_HOSTS` amb la IP.
   L'alumnat amb codi/PIN no necessita este canvi.

No poseu una IP dinàmica en `EDUTICTAC_PUBLIC_HOST`; useu una IP fixa o el
nom mDNS.

## Accés directe

L'instal·lador crea una entrada de menú i una icona a l'escriptori de qui
instal·la. La icona executa `edutictac-commons-open`, que llig `.env`, prova
`edutictac.local` i, si no respon, obri la IP. Per tant, la icona no depén
d'una resolució mDNS concreta.

## Diagnòstic

```bash
make lan-doctor
```

Comprova:
- a quina adreça resol `edutictac.local` i si és Docker/link-local;
- `allow-interfaces` d'Avahi;
- portal i ports d'apps per IP i per mDNS;
- si hi ha Internet (només informatiu).

## Proxy invers unificat

`compose.ingress.yml` i Caddy continuen sent una **opció** per al portal, no
la configuració per defecte. No s'ha d'activar si trenca l'accés per IP o els
ports actuals. La resta d'apps continuen amb els seus ports.
