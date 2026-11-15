/* Copiado de @edutictac/rebost-client 152a39a (MIT). No editar aquí: scripts/sync-rebost-client.sh */
/* Protocolo postMessage del selector (/assets/?mode=pick). Formato versionado: 'rebost-selection' v1. */
import {ITEM_ID} from '/assets/client.js';

export const SELECTION_FORMAT = 'rebost-selection';
export const SELECTION_VERSION = 1;

/** Nuevo identificador de petición (hay que guardarlo y pasarlo a isSelection). */
export function newRequestId() {
  return Array.from(globalThis.crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16)).join('-');
}

/**
 * URL del selector para un iframe. `base` por defecto: '/assets/'.
 * Parámetros: mode=pick, type (sprite|background), request, lang (es|ca|va|en),
 * collection (mine|catalog|scratch), y para personajes con varias poses supports_families=1&selection=sprite.
 */
export function pickerUrl({base = '/assets/', type, request, lang, collection, families = false} = {}) {
  const url = new URL(base, globalThis.location?.href);
  url.searchParams.set('mode', 'pick');
  if (type) url.searchParams.set('type', type);
  url.searchParams.set('request', request);
  if (lang) url.searchParams.set('lang', lang);
  if (collection) url.searchParams.set('collection', collection);
  if (families) { url.searchParams.set('supports_families', '1'); url.searchParams.set('selection', 'sprite'); }
  return url.pathname + url.search;
}

/** Mensaje que envía el selector al elegir una imagen (versión 1). `family` = elegir la familia entera. */
export function selectionMessage({request, id, name, family}) {
  return {format: SELECTION_FORMAT, version: SELECTION_VERSION, request: request || '', id, ...(name === undefined ? {} : {name}),
    ...(family ? {family: true, familyRevision: family.revision} : {})};
}

/** Mensaje de cancelación (p. ej. tecla Escape). */
export const cancelMessage = request => ({format: SELECTION_FORMAT, version: SELECTION_VERSION, request: request || '', cancel: true});

/** Envía un mensaje al padre solo a su mismo origen. */
export function postToParent(message, {parent = globalThis.parent, origin = globalThis.location.origin} = {}) {
  parent.postMessage(message, origin);
}

/**
 * Valida un MessageEvent del selector.
 * @returns {{cancel:true}|{id:string,family:boolean,familyRevision?:number}|null} null si no es válido.
 */
export function parseSelection(event, {source, request, origin = globalThis.location?.origin}) {
  const d = event?.data;
  if (!d || event.origin !== origin || event.source !== source) return null;
  if (d.format !== SELECTION_FORMAT || d.version !== SELECTION_VERSION || d.request !== request) return null;
  if (d.cancel === true) return {cancel: true};
  if (typeof d.id !== 'string' || !ITEM_ID.test(d.id)) return null;
  if (d.family === undefined) return {id: d.id, family: false};
  if (d.family === true && Number.isSafeInteger(d.familyRevision) && d.familyRevision > 0)
    return {id: d.id, family: true, familyRevision: d.familyRevision};
  return null;
}
