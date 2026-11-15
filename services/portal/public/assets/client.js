/* Copiado de @edutictac/rebost-client ad4f585 (MIT). No editar aquí: scripts/sync-rebost-client.sh */
/* EduTicTac Rebost client (MIT). Sin framework ni dependencias; funciona en navegador y Node 20+. */

export const ITEM_ID = /^img-[a-f0-9]{64}$/;
export const LIMITS = Object.freeze({image: 5 * 1024 * 1024, sound: 2 * 1024 * 1024, source: 256 * 1024, license: 128 * 1024, metadata: 32 * 1024});
export const IMAGE_TYPES = Object.freeze(['sprite', 'background', 'object', 'illustration']);
export const SOUND_TYPES = Object.freeze(['sound']);

/** Un recurso del Rebost es una imagen o un sonido; el servidor los distingue por `type`. */
export const kindOf = item => (item?.type === 'sound' ? 'sound' : 'image');

/** Tipo MIME del audio por firma (ogg, mp3, wav) o '' si no se reconoce. */
export function sniffSound(bytes) {
  const b = bytes;
  if (b.length >= 4 && b[0] === 0x4f && b[1] === 0x67 && b[2] === 0x67 && b[3] === 0x53) return 'audio/ogg';
  if (b.length >= 3 && b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) return 'audio/mpeg';
  if (b.length >= 2 && b[0] === 0xff && (b[1] & 0xe0) === 0xe0) return 'audio/mpeg';
  if (b.length >= 12 && String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WAVE') return 'audio/wav';
  return '';
}
export const CREDIT_KEYS = ['source_id', 'source_revision', 'source_path', 'source_repository', 'license', 'attribution'];

export class RebostError extends Error {
  constructor(code, status = 0, detail = '') {
    super(detail || code); // `message` = código de detalle del servidor si lo hay (lo usan las interfaces para traducir)
    this.code = code; // session | not_found | conflict | too_large | invalid | network | operation_failed
    this.status = status;
    this.detail = detail;
  }
}

const codeFor = status => status === 401 ? 'session' : status === 404 ? 'not_found'
  : status === 412 ? 'conflict' : status === 413 ? 'too_large' : 'operation_failed';

/**
 * @param {object} [options]
 * @param {string} [options.endpoint='/api/assets/v1'] Ruta o URL absoluta de la API.
 * @param {string[]} [options.allowedOrigins] Orígenes externos permitidos (cookies con credentials:'include').
 *   Sin esto solo se admite el mismo origen.
 * @param {typeof fetch} [options.fetch]
 */
export class RebostClient {
  constructor({endpoint = '/api/assets/v1', allowedOrigins = [], fetch: fetchImpl} = {}) {
    const hasLocation = typeof location !== 'undefined' && /^https?:/.test(location.href ?? '');
    // Sin `location` (Node, pruebas) solo se admiten rutas relativas, que cuentan como mismo origen.
    const url = hasLocation ? new URL(endpoint, location.href) : new URL(endpoint, 'http://same-origin.invalid');
    const same = hasLocation ? url.origin === location.origin : url.origin === 'http://same-origin.invalid';
    if (url.search || url.hash) throw new RebostError('invalid_endpoint');
    if (!same && !allowedOrigins.includes(url.origin)) throw new RebostError('same_origin_required');
    this.endpoint = same ? url.pathname.replace(/\/$/, '') : url.origin + url.pathname.replace(/\/$/, '');
    this.credentials = same ? 'same-origin' : 'include';
    this._fetch = fetchImpl;
  }

  async request(path, options = {}) {
    const f = this._fetch ?? globalThis.fetch;
    let response;
    try {
      response = await f(this.endpoint + path, {...options, credentials: this.credentials, cache: 'no-store', redirect: 'error'});
    } catch (cause) {
      throw new RebostError('network', 0, String(cause?.message ?? cause));
    }
    if (!response.ok) {
      const body = await Promise.resolve(response.json?.()).catch(() => null) ?? {};
      throw new RebostError(codeFor(response.status), response.status, typeof body.detail === 'string' ? body.detail : '');
    }
    return response;
  }

  static itemPath(id) {
    if (!ITEM_ID.test(id)) throw new RebostError('invalid_id');
    return '/items/' + id;
  }

  async json(path, options) { return (await this.request(path, options)).json(); }
  me() { return this.json('/me'); }
  catalogs() { return this.json('/catalogs'); }
  async item(id) { return this.json(RebostClient.itemPath(id)); }
  async family(id) { return this.json(RebostClient.itemPath(id) + '/family'); }

  /** @param {{q?:string,type?:string,cursor?:string,collection?:'mine'|'catalog'|'scratch',grouped?:boolean,limit?:number}} [query] */
  list({q = '', type = '', cursor = '', collection = 'mine', grouped = false, limit} = {}) {
    const params = new URLSearchParams({collection});
    if (q.trim()) params.set('q', q.trim());
    if (type) params.set('type', type);
    if (cursor) params.set('cursor', cursor);
    if (grouped) params.set('grouped', 'true');
    if (limit) params.set('limit', String(limit));
    return this.json('/items?' + params);
  }

  /** Blob con límite de tamaño aunque no haya Content-Length. */
  async blob(path, limit) {
    const response = await this.request(path);
    const declared = Number(response.headers?.get?.('content-length'));
    if (declared > limit) throw new RebostError('too_large');
    const reader = response.body?.getReader?.();
    if (!reader) {
      const blob = await response.blob();
      if (!blob.size || blob.size > limit) throw new RebostError('too_large');
      return blob;
    }
    const chunks = [];
    let size = 0;
    try {
      for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        size += value.length;
        if (size > limit) throw new RebostError('too_large');
        chunks.push(value);
      }
    } finally { await reader.cancel().catch(() => {}); }
    if (!size) throw new RebostError('invalid');
    return new Blob(chunks, {type: response.headers?.get?.('content-type') || ''});
  }

  async content(id, limit = LIMITS.image) { return this.blob(RebostClient.itemPath(id) + '/content', limit); }
  async thumbnail(id) { return this.blob(RebostClient.itemPath(id) + '/thumbnail', LIMITS.image); }
  contentUrl(id) { return this.endpoint + RebostClient.itemPath(id) + '/content'; }
  thumbnailUrl(id) { return this.endpoint + RebostClient.itemPath(id) + '/thumbnail'; }
  async text(id, kind, limit) { return (await this.blob(RebostClient.itemPath(id) + '/' + kind, limit)).text(); }

  /** Guarda un Blob/File en la biblioteca personal. */
  async add(file, {name, type, credit = '', license = ''}) {
    const sound = type === 'sound';
    if (!file.size || file.size > (sound ? LIMITS.sound : LIMITS.image)) throw new RebostError('too_large', 413, sound ? 'sound_limit' : 'image_limit');
    const headers = {'Content-Type': file.type || (sound ? 'audio/ogg' : 'image/png'), 'X-Rebost-Name': encodeURIComponent(String(name).slice(0, 200)),
      'X-Rebost-Type': type};
    if (credit) headers['X-Rebost-Credit'] = encodeURIComponent(credit.slice(0, 300));
    if (license) headers['X-Rebost-License'] = encodeURIComponent(license.slice(0, 100));
    return this.json('/items', {method: 'POST', body: file, headers});
  }
  update(item, {name, type}) {
    return this.json(RebostClient.itemPath(item.id), {method: 'PATCH', body: JSON.stringify({name, type}),
      headers: {'Content-Type': 'application/json', 'If-Match': `"${item.revision}"`}});
  }
  duplicate(item) {
    return this.json(RebostClient.itemPath(item.id) + '/copies', {method: 'POST', headers: {'If-Match': `"${item.revision}"`}});
  }
  async remove(item) {
    await this.request(RebostClient.itemPath(item.id), {method: 'DELETE', headers: {'If-Match': `"${item.revision}"`}});
  }
}

const PNG = [137, 80, 78, 71, 13, 10, 26, 10];

/**
 * Descarga una imagen elegida con sus créditos de forma coherente: metadatos, PNG, fuente y licencia
 * de la misma revisión (si cambia mientras se lee, falla con 'conflict').
 * Sustituye a fetchRebostSelection (Blocs) y fetchImage (Llibres).
 * @param {RebostClient} client
 * @param {string} id
 * @param {{types?:string[], locale?:string, changes?:string}} [options]
 * @returns {Promise<{item:object, name:string, blob:Blob, credit:object|null}>}
 */
export async function fetchSelection(client, id, {types, locale = 'ca', changes = 'Imported as normalized PNG; may be edited.', verifyPng = true} = {}) {
  const item = await client.item(id);
  if (item.id !== id || !Number.isSafeInteger(item.revision) || item.revision < 1) throw new RebostError('invalid');
  if (types && !types.includes(item.type)) throw new RebostError('invalid');
  const blob = await client.content(id);
  if (verifyPng) {
    if (String(blob.type).split(';')[0] !== 'image/png') throw new RebostError('invalid');
    const head = new Uint8Array(await blob.slice(0, 8).arrayBuffer());
    if (PNG.some((b, i) => head[i] !== b)) throw new RebostError('invalid');
  }
  const key = locale === 'va' ? 'ca' : locale;
  const name = String(item.names?.[key] || item.name || 'Rebost').slice(0, 200);
  const origin = ['catalog', 'scratch'].includes(item.collection) ? item : item.provenance;
  let credit = null;
  if (origin) {
    credit = {id, revision: item.revision, name, changes,
      source: await client.text(id, 'source', LIMITS.source),
      licenseText: await client.text(id, 'license', LIMITS.license)};
    for (const k of CREDIT_KEYS) {
      if (typeof origin[k] !== 'string' || origin[k].length > 2000) throw new RebostError('invalid');
      credit[k] = origin[k];
    }
  }
  if ((await client.item(id)).revision !== item.revision) throw new RebostError('conflict');
  return {item, name, blob, credit};
}

/**
 * Descarga un recurso (imagen o sonido) con sus créditos, de forma coherente.
 * Las imágenes se delegan en fetchSelection; los sonidos se validan por firma y límite de 2 MiB.
 * @param {RebostClient} client
 * @param {string} id
 * @param {{kinds?:('image'|'sound')[], types?:string[], locale?:string, changes?:string, verifyPng?:boolean}} [options]
 * @returns {Promise<{kind:'image'|'sound', item:object, name:string, blob:Blob, credit:object|null}>}
 */
export async function fetchResource(client, id, options = {}) {
  const {kinds = ['image', 'sound'], types, locale = 'ca', changes = 'Imported from the Rebost; may be edited.'} = options;
  const item = await client.item(id);
  const kind = kindOf(item);
  if (!kinds.includes(kind) || (types && !types.includes(item.type))) throw new RebostError('invalid');
  if (kind === 'image') return {kind, ...(await fetchSelection(client, id, {...options, types, locale, changes}))};
  if (item.id !== id || !Number.isSafeInteger(item.revision) || item.revision < 1) throw new RebostError('invalid');
  const blob = await client.content(id, LIMITS.sound);
  const mime = sniffSound(new Uint8Array(await blob.slice(0, 12).arrayBuffer()));
  if (!mime) throw new RebostError('invalid');
  const name = String(item.names?.[locale === 'va' ? 'ca' : locale] || item.name || 'Rebost').slice(0, 200);
  const origin = ['catalog', 'scratch', 'effects'].includes(item.collection) ? item : item.provenance;
  let credit = null;
  if (origin) {
    credit = {id, revision: item.revision, name, changes};
    for (const k of ['source_id', 'license', 'attribution']) if (typeof origin[k] === 'string') credit[k] = origin[k].slice(0, 2000);
    if (typeof item.credit === 'string' && item.credit) credit.credit = item.credit.slice(0, 300);
  } else if (item.credit || item.license) {
    credit = {id, revision: item.revision, name, changes, ...(item.credit ? {credit: item.credit} : {}), ...(item.license ? {license: item.license} : {})};
  }
  if ((await client.item(id)).revision !== item.revision) throw new RebostError('conflict');
  return {kind, item, name, blob: blob.type === mime ? blob : new Blob([blob], {type: mime}), credit};
}
