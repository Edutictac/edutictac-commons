# Rebost: orígenes y proxies — una sola lista

## Regla
**`EDUTICTAC_ID_ALLOWED_ORIGINS` es la única lista de orígenes de confianza** de Commons. Decide quién puede leer la
sesión con cookies (CORS), a qué sitios se vuelve tras entrar y quién puede usar el Rebost de forma cruzada.
`REBOST_ALLOWED_ORIGINS` **no hay que definirla**: si está vacía, el Rebost usa la lista central. Solo se define
para *estrechar* el Rebost respecto a la sesión (un origen puede iniciar sesión sin poder usar el Rebost).
Sin comodines de subdominio: se enumera cada origen propio (`https://crea.edutictac.es`, no `*.edutictac.es`).
`REBOST_PUBLIC_ORIGIN` es otra cosa: el origen público de Commons detrás de un proxy TLS, para validar `Origin` en las escrituras.

## Quién necesita qué

| Cliente | Cómo accede | Necesita |
|---|---|---|
| Commons (`/assets/`) | mismo origen | nada |
| Llibres, Blocs | iframe + proxy **del mismo origen** (`/assets/`, `/api/assets/v1/`) | nada en Commons; el proxy no necesita CORS |
| EduCrea | otro origen, cookie de Commons | su origen en `EDUTICTAC_ID_ALLOWED_ORIGINS` |
| App nueva incrustada | como Llibres/Blocs | ver la lista de comprobación |

Las apps incrustadas **no** deben depender de CORS: el proxy las hace del mismo origen. Solo una app que llame a Commons
desde su propio origen (EduCrea) entra en la lista.

## Bancos externos
- **Modo servidor (recomendado):** `REBOST_BANKS_ENABLED=1`. La pestaña de bancos usa `/api/assets/v1/banks/*` (GET, mismo
  origen). Los proxies de Llibres y Blocs ya lo cubren con su regla `GET /api/assets/v1/`; no hace falta CORS, ni
  `connect-src` hacia EduCrea, ni `REBOST_BANK_SEARCH_URL`. Guardar y elegir sigue siendo `POST /api/assets/v1/items`.
- **Modo EduCrea (heredado):** `REBOST_BANK_SEARCH_URL` apunta a EduCrea; hace falta `connect-src` hacia ese origen en el
  proxy de cada app incrustada y `EDUCREA_BANK_CORS_ORIGINS` en EduCrea con los orígenes de esas apps. Cuando Commons
  anuncia la capacidad `banks`, el selector ya no usa este modo y esa configuración puede retirarse.

## Lista de comprobación para una app nueva
1. ¿Se incrusta por proxy del mismo origen? → proxy `GET /assets/` y `GET /api/assets/v1/` (más `POST /api/assets/v1/items` solo
   si guarda); CSP `connect-src 'self'`. **No** tocar la lista de orígenes.
2. ¿Llama a Commons desde su propio origen? → añadir ese origen exacto a `EDUTICTAC_ID_ALLOWED_ORIGINS`; usar
   `new RebostClient({endpoint, allowedOrigins: [origen]})`.
3. Usar `@edutictac/rebost-client` y su contrato del selector; no copiar clientes.
4. Probar: lectura con cookie, preflight de `POST /items` (cabeceras `X-Rebost-*`) y que otro origen no recibe `Access-Control-Allow-Origin`.

Pruebas: `tests/test_settings_and_app_tokens.py::test_one_origin_list_serves_sessions_and_rebost`,
`tests/test_rebost.py::test_educrea_origin_cors_and_credit_metadata` y `tests/test_rebost_banks.py::test_banks_use_the_rebost_cors_policy`.
