<script setup>
import {computed, onBeforeUnmount, onMounted, provide, ref} from 'vue';
import {RebostClient} from '/assets/client.js';
import AssetCard from './AssetCard.vue';
import {usePortalTranslations} from '../shared/usePortalTranslations.js';

const api = new RebostClient();
const federated = window.commonsDeployment?.mode === 'federated';
const params = new URLSearchParams(location.search);
const picking = params.get('mode') === 'pick' && window.parent !== window;
const pickType = params.get('type') === 'background' ? 'background' : 'sprite';
const familySelection = picking && pickType === 'sprite' && params.get('supports_families') === '1' && params.get('selection') === 'sprite';
const types = ['sprite', 'background', 'object', 'illustration'];
const filterTypes = picking ? (pickType === 'background' ? ['background'] : ['sprite', 'object', 'illustration']) : ['', ...types];
if (picking && ['es', 'ca', 'va', 'en'].includes(params.get('lang'))) window.i18nPortal.setLang(params.get('lang'));
const locale = ref(window.i18nPortal.getLang());
const t = usePortalTranslations();
const active = ref(false), authenticated = ref(false), busy = ref(false), capabilities = ref([]);
const collection = ref(['mine', 'catalog', 'scratch'].includes(params.get('collection')) ? params.get('collection') : '');
const search = ref(''), filter = ref(picking ? pickType : ''), uploadType = ref('sprite');
const items = ref([]), cursor = ref(''), status = ref(''), drag = ref(false);
const filesInput = ref(null), dialog = ref(null), previewUrl = ref(''), previewName = ref('');
const locked = computed(() => collection.value === 'mine' && !authenticated.value);
const title = computed(() => t('rebost.' + (collection.value || 'mine')));
let alive = true, listGeneration = 0, searchTimer;
let loadedQuery = '';
function language() { locale.value = window.i18nPortal.getLang(); }
function report(error) {
  status.value = t('rebost.' + error.message) !== 'rebost.' + error.message ? error.message : 'error';
  if (error.status === 401) {
    authenticated.value = false;
    if (collection.value === 'mine') { listGeneration++; items.value = []; cursor.value = ''; closePreview(); }
  }
}
async function run(operation) {
  if (busy.value || !alive) return;
  busy.value = true; status.value = 'working';
  try {
    const message = await operation();
    if (alive) {
      status.value = typeof message === 'string' ? message : '';
      if (status.value) document.getElementById('status')?.scrollIntoView({block: 'nearest'});
    }
  }
  catch (error) {
    if ([404, 412].includes(error.status)) await refresh().catch(() => {});
    if (alive) report(error);
  } finally { busy.value = false; }
}
async function refresh(more = false) {
  const generation = ++listGeneration;
  if (locked.value) { items.value = []; cursor.value = ''; closePreview(); return; }
  const query = JSON.stringify([collection.value, search.value, filter.value]);
  // Never append a page belonging to a previous search.
  more = more && query === loadedQuery;
  const result = await api.list({collection: collection.value, q: search.value, type: filter.value, cursor: more ? cursor.value : '', grouped: collection.value === 'scratch'});
  if (!alive || generation !== listGeneration || (collection.value === 'mine' && !authenticated.value)) return;
  items.value = more ? [...items.value, ...result.items] : result.items;
  cursor.value = result.next_cursor; loadedQuery = query;
}
async function chooseCollection(value) {
  collection.value = value; search.value = ''; filter.value = picking ? pickType : '';
  clearTimeout(searchTimer);
  const address = new URL(location.href); address.searchParams.set('collection', value); history.replaceState(null, '', address);
  items.value = []; cursor.value = '';
  await refresh();
}
function searchChanged() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (!alive) return;
    if (busy.value) { searchChanged(); return; }
    await run(() => refresh());
  }, 250);
}
async function upload(files) {
  if (picking || locked.value || collection.value !== 'mine' || !active.value) return;
  await run(async () => {
    try { for (const file of files) await api.add(file, file.name.replace(/\.[^.]+$/, '').slice(0, 200) || 'Imatge', uploadType.value); }
    catch (error) { await refresh().catch(() => {}); throw error; }
    try { await refresh(); } catch (error) { report(error); return 'saved_refresh_failed'; }
    return 'image_saved';
  });
}
function openFiles() { if (active.value && !busy.value) filesInput.value.click(); }
function filesChanged(event) { const files = [...event.target.files]; event.target.value = ''; upload(files); }
function dropped(event) { drag.value = false; upload([...event.dataTransfer.files]); }
function clearPreview() { URL.revokeObjectURL(previewUrl.value); previewUrl.value = ''; previewName.value = ''; }
function closePreview() { dialog.value?.close(); clearPreview(); }
async function preview(item, name) {
  const blob = await api.read(item.id);
  if (!alive || (item.collection === 'mine' && !authenticated.value)) return;
  clearPreview(); previewUrl.value = URL.createObjectURL(blob); previewName.value = name; dialog.value.showModal();
}
function select(item, name, family) {
  window.parent.postMessage({format: 'rebost-selection', version: 1, request: params.get('request') || '', id: item.id, name,
    ...(family ? {family: true, familyRevision: item.family.revision} : {})}, location.origin);
}
function keydown(event) {
  if (picking && event.key === 'Escape' && !dialog.value?.open)
    window.parent.postMessage({format: 'rebost-selection', version: 1, request: params.get('request') || '', cancel: true}, location.origin);
}
async function download(item, license = false) {
  const blob = await api.source(item.id, license);
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = item.id + (license ? '.license.txt' : '.source.svg');
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
// Login opens another tab in picker mode. Recheck the shared session on return.
let checkingSession = false;
async function recheckSession() {
  if (!active.value || busy.value || checkingSession || !alive) return;
  checkingSession = true;
  try {
    let signedIn;
    try { await api.me(); signedIn = true; }
    catch (error) { if (error.status !== 401) throw error; signedIn = false; }
    if (!alive || signedIn === authenticated.value) return;
    authenticated.value = signedIn;
    if (!signedIn) { listGeneration++; items.value = []; cursor.value = ''; closePreview(); }
    await run(() => refresh());
  } catch (error) { if (alive) report(error); }
  finally { checkingSession = false; }
}
function pagehide(event) { if (!event.persisted) { listGeneration++; items.value = []; clearPreview(); } }
provide('rebost', {api, t, locale, authenticated, picking, familySelection, types, run, refresh, chooseCollection, preview, select, download, report});
onMounted(async () => {
  document.body.classList.toggle('picking', picking);
  window.addEventListener('edutictac:langchange', language);
  window.addEventListener('focus', recheckSession);
  window.addEventListener('edutictac:sessionchange', recheckSession);
  window.addEventListener('pagehide', pagehide);
  document.addEventListener('keydown', keydown);
  await run(async () => {
    let profile;
    try { profile = await api.me(); authenticated.value = true; }
    catch (error) { if (error.status !== 401) throw error; profile = await api.catalogs(); }
    capabilities.value = profile.capabilities;
    if (!collection.value) collection.value = authenticated.value ? 'mine' : 'catalog';
    if ((collection.value === 'catalog' && !capabilities.value.includes('catalog')) || (collection.value === 'scratch' && !capabilities.value.includes('scratch_catalog'))) collection.value = 'mine';
    active.value = true; await refresh();
  });
});
onBeforeUnmount(() => {
  alive = false; listGeneration++; clearTimeout(searchTimer); clearPreview();
  window.removeEventListener('edutictac:langchange', language);
  window.removeEventListener('focus', recheckSession);
  window.removeEventListener('edutictac:sessionchange', recheckSession);
  window.removeEventListener('pagehide', pagehide);
  document.removeEventListener('keydown', keydown);
  document.body.classList.remove('picking');
});
</script>

<template>
  <header class="topbar">
    <div v-if="!picking" class="brand-lockup">
      <img :src="'/commons-mark.svg'" alt="" width="46" height="46">
      <div><p class="eyebrow">EduTicTac Commons</p><h1>EduTicTac Rebost</h1></div>
    </div>
    <div class="topbar-actions">
      <!-- Fora del selector incrustat, el xip comú mostra la sessió i l'eixida. -->
      <edutictac-account v-if="!picking" id="accountWidget"></edutictac-account>
      <p v-else id="sessionStatus" class="status session-status" :class="{signed: authenticated}" role="status">{{ !active ? t('rebost.checkingSession') : authenticated ? t('rebost.signedIn') : t('rebost.signedOut') }}</p>
    </div>
  </header>
  <main class="single-layout rebost-layout">
    <div class="role-heading">
      <p class="eyebrow">EduTicTac Rebost</p>
      <h2>{{ t('rebost.heading') }}</h2>
      <p id="intro" class="teacher-intro">{{ t('rebost.intro') }}</p>
    </div>
    <p id="status" :class="{success: ['success', 'image_saved'].includes(status), error: status && !['success', 'image_saved', 'working'].includes(status)}" role="status" aria-live="polite">{{ status ? t('rebost.' + status) : '' }}</p>
    <section id="access" class="panel" :hidden="!active || authenticated">
      <p id="accessHint">{{ t('rebost.access') }}</p>
      <div class="actions"><a class="button-link secondary" id="studentLogin" href="/student.html?next=%2Fassets%2F" :target="picking ? '_blank' : undefined" rel="noopener noreferrer">{{ t('rebost.student') }}</a>
      <a class="button-link" id="oidcLogin" href="/api/auth/oidc/login?next=%2Fassets%2F" :target="picking ? '_blank' : undefined" rel="noopener noreferrer">{{ t('rebost.oidc') }}</a></div>
    </section>
    <fieldset id="controls" :disabled="busy || !active" :hidden="!active">
      <legend id="mine">{{ title }}</legend>
      <div class="library-toolbar panel">
        <div id="collections" class="collections" role="group" :aria-label="t('rebost.collection')">
          <button id="mineTab" class="secondary" type="button" :aria-pressed="collection === 'mine'" @click="run(() => chooseCollection('mine'))">{{ t('rebost.mine') }}{{ authenticated ? '' : ' · ' + t('common.login') }}</button>
          <button id="catalogTab" class="secondary" type="button" :hidden="!capabilities.includes('catalog')" :aria-pressed="collection === 'catalog'" @click="run(() => chooseCollection('catalog'))">{{ t('rebost.catalog') }}</button>
          <button id="scratchTab" class="secondary" type="button" :hidden="!capabilities.includes('scratch_catalog')" :aria-pressed="collection === 'scratch'" @click="run(() => chooseCollection('scratch'))">{{ t('rebost.scratch') }}</button>
        </div>
        <p id="collectionHint">{{ picking ? t('rebost.pickHint') : collection === 'mine' ? t('rebost.privateHint') : collection === 'scratch' ? t('rebost.scratchHint') : t('rebost.catalogHint') }}</p>
        <div id="uploadArea" :hidden="picking || collection !== 'mine' || !authenticated">
          <section id="drop" tabindex="0" role="button" :aria-label="t('rebost.upload')" :class="{drag}" @click="openFiles" @keydown.self.enter.prevent="openFiles" @keydown.self.space.prevent="openFiles" @dragenter.prevent="drag = true" @dragover.prevent="drag = true" @dragleave="drag = false" @drop.prevent="dropped">
            <strong id="uploadText">{{ t('rebost.upload') }}</strong><p id="formats">{{ t('rebost.formats') }}</p>
            <input id="files" ref="filesInput" type="file" accept="image/png,image/jpeg,image/webp" multiple hidden @click.stop @change="filesChanged">
          </section>
          <label><span id="uploadTypeLabel">{{ t('rebost.uploadType') }}</span><select id="uploadType" v-model="uploadType"><option v-for="value in types" :key="value" :value="value">{{ t('rebost.' + value) }}</option></select></label>
        </div>
        <div class="filters" :hidden="locked">
          <label><span id="searchLabel">{{ t('rebost.search') }}</span><input id="search" v-model="search" type="search" :placeholder="t('rebost.searchPlaceholder')" maxlength="200" @input="searchChanged"></label>
          <label><span id="filterLabel">{{ t('rebost.filter') }}</span><select id="filter" v-model="filter" @change="run(() => refresh())"><option v-for="value in filterTypes" :key="value" :value="value">{{ value ? t('rebost.' + value) : t('rebost.all') }}</option></select></label>
        </div>
      </div>
      <p id="empty" :hidden="locked || items.length > 0 || busy">{{ t('rebost.empty') }}</p>
      <section id="grid" :aria-label="title" :hidden="locked"><AssetCard v-for="item in items" :key="item.id" :item="item" /></section>
      <button id="more" type="button" :hidden="locked || !cursor" @click="run(() => refresh(true))">{{ t('rebost.more') }}</button>
    </fieldset>
    <dialog id="preview" ref="dialog" :aria-label="t('rebost.view')" @close="clearPreview">
      <button id="closePreview" type="button" @click="closePreview">{{ t('rebost.close') }}</button>
      <img id="previewImage" :src="previewUrl || undefined" :alt="previewName">
    </dialog>
  </main>
  <footer v-if="federated && !picking" class="admin-entry"><a href="/privacy.html">{{ t('privacy.title') }}</a></footer>
</template>
