import {RebostClient} from './client.js';

const TEXT = {
  es: {
    login: 'Entrar', loginToSave: 'Entrar para guardar una copia',
    hideCostumes: 'Ocultar disfraces', costumes: 'Ver disfraces', costumeCount: 'disfraces', addFamily: 'Añadir personaje con disfraces', saveImage: 'Guardar esta imagen', choose: 'Usar en el proyecto', pickHint: 'Elige una imagen para tu proyecto.',
    intro: 'Guarda tus imágenes y encuentra personajes y fondos del catálogo.',
    scratch: 'Catálogo Scratch', scratchHint: 'Selección de imágenes de Scratch. Conserva los créditos y la licencia CC BY-SA 2.0.', catalog: 'Catálogo EduTicTac', collection: 'Colección', privateHint: 'Tus imágenes son privadas.',
    catalogHint: 'Guarda una copia en Mis imágenes para reutilizarla. Se conserva su licencia.',
    saveCopy: 'Guardar en mis imágenes', source: 'Descargar original SVG', license: 'Descargar licencia',
    mine: 'Mis imágenes', upload: 'Subir imágenes o arrastrarlas aquí',
    formats: 'PNG, JPEG o WebP. Hasta 5 MiB y 4096 × 4096 píxeles por imagen.',
    uploadType: 'Tipo de las imágenes que vas a subir', search: 'Buscar por nombre', filter: 'Tipo', all: 'Todos los tipos',
    sprite: 'Personaje', background: 'Fondo', object: 'Objeto', illustration: 'Ilustración',
    name: 'Nombre', save: 'Guardar cambios', duplicate: 'Duplicar', remove: 'Eliminar', view: 'Ver imagen',
    empty: 'Todavía no hay imágenes que coincidan con esta búsqueda.', more: 'Mostrar más', close: 'Cerrar',
    access: 'Entra con tu cuenta del centro o con tu código y PIN para abrir tu biblioteca privada.',
    student: 'Entrar como alumnado', oidc: 'Entrar con la cuenta del centro', working: 'Guardando…',
    confirm: '¿Eliminar esta imagen de tu biblioteca? Las copias incorporadas a proyectos se conservan.',
    success: 'Cambios guardados.', error: 'No se ha podido completar la operación. Vuelve a intentarlo.',
    session_required: 'Entra de nuevo para abrir tu biblioteca privada.', invalid_image: 'Usa una imagen válida PNG, JPEG o WebP.',
    animated_image: 'Usa una imagen fija, sin animación.', image_limit: 'La imagen debe ocupar como máximo 5 MiB.',
    dimension_limit: 'La imagen debe medir como máximo 4096 × 4096 píxeles.',
    library_limit: 'Tu biblioteca ha alcanzado su límite. Elimina imágenes que no necesites.',
    installation_limit: 'El Rebost del centro ha alcanzado su límite. Consulta con la persona responsable.',
    disk_limit: 'El centro necesita liberar espacio antes de guardar más imágenes.',
    revision_conflict: 'Esta imagen ha cambiado desde otra ventana. Revisa la lista actualizada.',
    invalid_name: 'Escribe un nombre de hasta 200 caracteres.', not_found: 'La imagen ya no está disponible.',
    origin_required: 'Abre el Rebost desde la dirección de Commons.'
  },
  ca: {
    login: 'Entra', loginToSave: 'Entra per a guardar una còpia',
    hideCostumes: 'Amagar disfresses', costumes: 'Veure disfresses', costumeCount: 'disfresses', addFamily: 'Afegir personatge amb disfresses', saveImage: 'Guarda esta imatge', choose: 'Usa en el projecte', pickHint: 'Tria una imatge per al teu projecte.',
    intro: 'Guarda les teues imatges i troba personatges i fons del catàleg.',
    scratch: 'Catàleg Scratch', scratchHint: 'Selecció d’imatges de Scratch. Conserva els crèdits i la llicència CC BY-SA 2.0.', catalog: 'Catàleg EduTicTac', collection: 'Col·lecció', privateHint: 'Les teues imatges són privades.',
    catalogHint: 'Guarda una còpia en Les meues imatges per a reutilitzar-la. Es conserva la llicència.',
    saveCopy: 'Guarda en les meues imatges', source: 'Descarrega l’original SVG', license: 'Descarrega la llicència',
    mine: 'Les meues imatges', upload: 'Puja imatges o arrossega-les ací',
    formats: 'PNG, JPEG o WebP. Fins a 5 MiB i 4096 × 4096 píxels per imatge.',
    uploadType: 'Tipus de les imatges que pujaràs', search: 'Busca pel nom', filter: 'Tipus', all: 'Tots els tipus',
    sprite: 'Personatge', background: 'Fons', object: 'Objecte', illustration: 'Il·lustració',
    name: 'Nom', save: 'Guarda els canvis', duplicate: 'Duplica', remove: 'Elimina', view: 'Mostra la imatge',
    empty: 'Encara no hi ha imatges que coincidisquen amb esta cerca.', more: 'Mostra’n més', close: 'Tanca',
    access: 'Entra amb el teu compte del centre o amb el teu codi i PIN per a obrir la biblioteca privada.',
    student: 'Entra com a alumnat', oidc: 'Entra amb el compte del centre', working: 'Guardant…',
    confirm: 'Vols eliminar esta imatge de la biblioteca? Les còpies incorporades a projectes es conserven.',
    success: 'Canvis guardats.', error: 'No s’ha pogut completar l’operació. Torna a intentar-ho.',
    session_required: 'Torna a entrar per a obrir la biblioteca privada.', invalid_image: 'Usa una imatge vàlida PNG, JPEG o WebP.',
    animated_image: 'Usa una imatge fixa, sense animació.', image_limit: 'La imatge ha d’ocupar com a màxim 5 MiB.',
    dimension_limit: 'La imatge ha de mesurar com a màxim 4096 × 4096 píxels.',
    library_limit: 'La biblioteca ha arribat al límit. Elimina imatges que no necessites.',
    installation_limit: 'El Rebost del centre ha arribat al límit. Consulta amb la persona responsable.',
    disk_limit: 'El centre necessita alliberar espai abans de guardar més imatges.',
    revision_conflict: 'Esta imatge ha canviat des d’una altra finestra. Revisa la llista actualitzada.',
    invalid_name: 'Escriu un nom de fins a 200 caràcters.', not_found: 'La imatge ja no està disponible.',
    origin_required: 'Obri el Rebost des de l’adreça de Commons.'
  }
};
const params = new URLSearchParams(location.search);
// Selection is available only to a same-origin embedding editor. No cross-origin bridge.
const picking = params.get('mode') === 'pick' && window.parent !== window;
const pickType = params.get('type') === 'background' ? 'background' : 'sprite';
const permittedTypes = picking ? (pickType === 'background' ? ['background'] : ['sprite', 'object', 'illustration']) : null;
const nonce = params.get('request') || '';
const familySelection = picking && pickType === 'sprite' && params.get('supports_families') === '1' && params.get('selection') === 'sprite';
if (picking) {
  document.body.classList.add('picking');
  const locale = params.get('lang');
  if (['es', 'ca', 'va'].includes(locale)) window.i18nPortal.setLang(locale === 'ca' ? 'va' : locale);
  document.querySelector('header > a').hidden = true;
  for (const id of ['studentLogin', 'oidcLogin']) {
    document.getElementById(id).target = '_blank';
    document.getElementById(id).rel = 'noopener noreferrer';
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.getElementById('preview').open) window.parent.postMessage({format: 'rebost-selection', version: 1,
      request: nonce, cancel: true}, location.origin);
  });
}
const api = new RebostClient();
const $ = id => document.getElementById(id);
const types = ['sprite', 'background', 'object', 'illustration'];
let text, active = false, authenticated = false, busy = false, collection = (['mine', 'catalog', 'scratch'].includes(params.get('collection')) ? params.get('collection') : ''), cursor = '', urls = [], previewUrl = '', searchTimer;
function language() {
  text = TEXT[window.i18nPortal.getLang() === 'es' ? 'es' : 'ca'];
  document.documentElement.lang = text === TEXT.es ? 'es' : 'ca';
  for (const [id, key] of Object.entries({intro:'intro',mine:'mine',uploadText:'upload',formats:'formats',
    uploadTypeLabel:'uploadType',searchLabel:'search',filterLabel:'filter',accessHint:'access',
    studentLogin:'student',oidcLogin:'oidc',empty:'empty',more:'more',closePreview:'close'})) $(id).textContent = text[key];
  collectionLabels();
  $('preview').setAttribute('aria-label', text.view);
  $('drop').setAttribute('aria-label', text.upload);
  for (const id of ['uploadType', 'filter']) {
    const previous = $(id).value;
    $(id).replaceChildren();
    for (const type of (id === 'filter' ? (picking ? permittedTypes : [''].concat(types)) : types)) {
      const option = document.createElement('option'); option.value = type; option.textContent = type ? text[type] : text.all; $(id).append(option);
    }
    $(id).value = previous || (id === 'filter' ? (picking ? pickType : '') : 'sprite');
  }
  if (active && !busy) run(() => refresh());
}
function collectionLabels() {
  $('mine').textContent = text[collection === 'catalog' ? 'catalog' : collection === 'scratch' ? 'scratch' : 'mine'];
  $('mineTab').textContent = text.mine + (authenticated ? '' : ' · ' + text.login); $('catalogTab').textContent = text.catalog;
  $('scratchTab').textContent = text.scratch;
  $('scratchTab').setAttribute('aria-pressed', String(collection === 'scratch'));
  $('mineTab').setAttribute('aria-pressed', String(collection === 'mine'));
  $('catalogTab').setAttribute('aria-pressed', String(collection === 'catalog'));
  $('collections').setAttribute('aria-label', text.collection);
  $('collectionHint').textContent = picking ? text.pickHint : (collection === 'mine' ? text.privateHint : collection === 'scratch' ? text.scratchHint : text.catalogHint);
  const locked = collection === 'mine' && !authenticated;
  $('access').hidden = !locked;
  $('uploadArea').hidden = picking || collection !== 'mine' || !authenticated;
  $('grid').hidden = locked;
  document.querySelector('.filters').hidden = locked;
  $('grid').setAttribute('aria-label', text[collection === 'catalog' ? 'catalog' : collection === 'scratch' ? 'scratch' : 'mine']);
}
async function chooseCollection(value) {
  collection = value;
  const address = new URL(location.href); address.searchParams.set('collection', value); history.replaceState(null, '', address);
  $('search').value = ''; $('filter').value = picking ? pickType : ''; collectionLabels();
  await refresh();
}
async function downloadOriginal(item, license = false) {
  const blob = await api.source(item.id, license);
  const url = URL.createObjectURL(blob); const link = node('a');
  link.href = url; link.download = item.id + (license ? '.license.txt' : '.source.svg');
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function message(error) {
  $('status').textContent = text[error.message] || text.error;
  if (error.status === 401) {
    authenticated = false; collectionLabels();
    if (collection === 'mine') { $('grid').replaceChildren(); $('empty').hidden = true; $('more').hidden = true; }
  }
}
async function run(operation) {
  if (busy) return;
  busy = true; $('controls').disabled = true; $('status').textContent = text.working;
  try { await operation(); $('status').textContent = ''; }
  catch (error) {
    if (error.status === 412 || error.status === 404) await refresh().catch(() => {});
    message(error);
  } finally { busy = false; $('controls').disabled = !active; }
}
function node(tag, content) { const element = document.createElement(tag); if (content) element.textContent = content; return element; }
function button(label, handler) { const b = node('button', label); b.type = 'button'; b.addEventListener('click', handler); return b; }
async function card(item, nested = false) {
  const article = node(nested ? 'section' : 'article');
  if (nested) article.className = 'family-costume';
  const group = !nested && item.collection === 'scratch' && item.family && item.family.count > 1; article.dataset.id = item.id;
  const displayName = ['catalog', 'scratch'].includes(item.collection) ? item.names[text === TEXT.es ? 'es' : 'ca'] : item.name;
  const picture = node('img'); picture.alt = displayName;
  const blob = await api.read(item.id, true); const url = URL.createObjectURL(blob); urls.push(url); picture.src = url;
  const view = button(text.view + ': ' + displayName, () => run(async () => {
    URL.revokeObjectURL(previewUrl); previewUrl = URL.createObjectURL(await api.read(item.id));
    $('previewImage').src = previewUrl; $('previewImage').alt = displayName; $('preview').showModal();
  }));
  view.className = 'image'; view.replaceChildren(picture); view.setAttribute('aria-label', text.view + ': ' + displayName);
  const actions = node('div'); actions.className = 'actions';
  article.append(view);
  if (picking) {
    article.append(node(nested ? 'h3' : 'h2', displayName), node('span', text[item.type]));
    actions.append(button(group && familySelection ? text.addFamily : text.choose, () => {
      window.parent.postMessage({format: 'rebost-selection', version: 1, request: nonce,
        id: item.id, name: displayName, ...(group && familySelection ? {family: true, familyRevision: item.family.revision} : {})}, location.origin);
    }));
  } else if (item.readonly) {
    article.append(node(nested ? 'h3' : 'h2', displayName), node('span', text[item.type]));
    actions.append(button(authenticated ? (group ? text.saveImage : text.saveCopy) : text.loginToSave, () => run(async () => {
      if (!authenticated) return chooseCollection('mine');
      await api.duplicate(item); await chooseCollection('mine');
    })));
  } else {
    const nameLabel = node('label', text.name); const name = node('input'); name.value = item.name; name.maxLength = 200; name.required = true; nameLabel.append(name);
    const typeLabel = node('label', text.filter); const select = node('select');
    for (const type of types) { const option = node('option', text[type]); option.value = type; select.append(option); }
    select.value = item.type; typeLabel.append(select);
    article.append(nameLabel, typeLabel);
    actions.append(button(text.save, () => run(async () => { await api.update(item, name.value, select.value); await refresh(); })),
      button(text.duplicate, () => run(async () => { await api.duplicate(item); await refresh(); })),
      button(text.remove, () => { if (confirm(text.confirm)) run(async () => { await api.remove(item); await refresh(); }); }));
  }
  const origin = ['catalog', 'scratch'].includes(item.collection) ? item : item.provenance;
  if (origin) {
    if (!nested) {
      const credit = node('p', origin.attribution + ' · ' + origin.license); credit.className = 'credit'; article.append(credit);
    }
    if (!picking) actions.append(button(text.source, () => run(() => downloadOriginal(item))),
      button(text.license, () => run(() => downloadOriginal(item, true))));
  }
  if (group) {
    article.append(node('span', item.family.count + ' ' + text.costumeCount));
    const variants = node('div'); variants.className = 'family-variants'; variants.hidden = true;
    let loaded = false;
    const toggle = button(text.costumes, () => run(async () => {
      if (!loaded) {
        const family = await api.family(item.family.id);
        if (family.id !== item.family.id || family.revision !== item.family.revision) throw new Error('revision_conflict');
        const children = [];
        for (const member of family.items) children.push(await card(member, true));
        variants.append(...children); loaded = true;
      }
      variants.hidden = !variants.hidden;
      article.classList.toggle('expanded-family', !variants.hidden);
      toggle.textContent = variants.hidden ? text.costumes : text.hideCostumes;
      toggle.setAttribute('aria-expanded', String(!variants.hidden));
    }));
    toggle.setAttribute('aria-expanded', 'false');
    actions.append(toggle); article.append(node('small', item.width + ' × ' + item.height + ' px'), actions, variants);
  } else article.append(node('small', item.width + ' × ' + item.height + ' px'), actions);
  return article;
}
async function refresh(more = false) {
  if (collection === 'mine' && !authenticated) {
    $('grid').replaceChildren(); $('empty').hidden = true; $('more').hidden = true;
    collectionLabels(); return;
  }
  const result = await api.list({q: $('search').value, type: $('filter').value, cursor: more ? cursor : '', collection, grouped: collection === 'scratch'});
  const cards = [];
  for (const item of result.items) cards.push(await card(item));
  if (!more) {
    // Keep only URLs used by the new result, releasing previous thumbnails.
    const previous = urls.splice(0, urls.length - result.items.length); previous.forEach(URL.revokeObjectURL);
    $('grid').replaceChildren();
  }
  $('grid').append(...cards); cursor = result.next_cursor;
  $('more').hidden = !cursor; $('empty').hidden = $('grid').childElementCount > 0;
}
async function upload(files) {
  await run(async () => {
    try {
      for (const file of files) await api.add(file, file.name.replace(/\.[^.]+$/, '').slice(0,200) || 'Imatge', $('uploadType').value);
    } finally { await refresh(); }
  });
}
$('drop').addEventListener('click', () => { if (!busy && active) $('files').click(); });
$('drop').addEventListener('keydown', event => { if (active && !busy && event.target === $('drop') && ['Enter',' '].includes(event.key)) { event.preventDefault(); $('files').click(); } });
$('files').addEventListener('change', async event => { const files = Array.from(event.target.files); event.target.value = ''; await upload(files); });
for (const action of ['dragenter', 'dragover']) $('drop').addEventListener(action, event => { event.preventDefault(); $('drop').classList.add('drag'); });
$('drop').addEventListener('dragleave', () => $('drop').classList.remove('drag'));
$('drop').addEventListener('drop', event => { event.preventDefault(); $('drop').classList.remove('drag'); upload(Array.from(event.dataTransfer.files)); });
$('mineTab').addEventListener('click', () => run(() => chooseCollection('mine')));
$('catalogTab').addEventListener('click', () => run(() => chooseCollection('catalog')));
$('scratchTab').addEventListener('click', () => run(() => chooseCollection('scratch')));
$('search').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => run(() => refresh()), 250); });
$('filter').addEventListener('change', () => run(() => refresh()));
$('more').addEventListener('click', () => run(() => refresh(true)));
$('closePreview').addEventListener('click', () => $('preview').close());
$('preview').addEventListener('close', () => { URL.revokeObjectURL(previewUrl); $('previewImage').removeAttribute('src'); previewUrl = ''; });
window.addEventListener('edutictac:langchange', language);
window.addEventListener('pagehide', () => urls.forEach(URL.revokeObjectURL));
language();
await run(async () => {
  let profile;
  try { profile = await api.me(); authenticated = true; }
  catch (error) { if (error.status !== 401) throw error; profile = await api.catalogs(); }
  if (!collection) collection = authenticated ? 'mine' : 'catalog';
  $('catalogTab').hidden = !profile.capabilities.includes('catalog');
  $('scratchTab').hidden = !profile.capabilities.includes('scratch_catalog');
  if ((collection === 'catalog' && !profile.capabilities.includes('catalog')) ||
      (collection === 'scratch' && !profile.capabilities.includes('scratch_catalog'))) collection = 'mine';
  collectionLabels(); active = true; $('controls').hidden = false; await refresh();
});
