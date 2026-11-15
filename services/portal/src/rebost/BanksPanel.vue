<script setup>
import {computed, inject, onBeforeUnmount, reactive, ref} from 'vue';

// Search of the free image banks through EduCrea (the banks live in its API, not in Commons). The teacher's EduCrea
// session cookie travels with every request (same site); EduCrea only answers GET reads for this origin.
const app = inject('rebost');
const {api, t, locale, authenticated, run, report} = app;
const base = String(window.commonsDeployment?.bankSearchUrl || '').replace(/\/$/, '');
const BANKS = [
  {id: 'arasaac', name: 'ARASAAC', nc: true}, {id: 'wikimedia', name: 'Wikimedia Commons'}, {id: 'met', name: 'The Met'},
  {id: 'icons', name: 'Iconos y emojis'}, {id: 'openverse', name: 'Openverse'},
];
const PER_BANK = 6;
const query = ref(''), freeOnly = ref(true), searching = ref(false), loginNeeded = ref(false), message = ref('');
const groups = ref([]), expanded = ref(new Set()), thumbs = reactive({}), saved = ref(new Set()), savingId = ref('');
let controller = null, generation = 0;

const apiLanguage = () => ({ca: 'va', va: 'va', es: 'es', en: 'en'}[locale.value] || 'es');
const isFree = license => !/(^|[^A-Za-z])NC([^A-Za-z]|$)|non[- ]?commercial/i.test(license || '');
const key = item => item.provider + ':' + item.id;
const visible = group => expanded.value.has(group.id) ? group.items : group.items.slice(0, PER_BANK);
const total = computed(() => groups.value.reduce((sum, group) => sum + group.items.length, 0));

async function get(path, signal) {
  // A plain credentialed GET (no custom headers, no cache mode): a simple CORS request, so no preflight is needed.
  const response = await fetch(base + path, {credentials: 'include', signal});
  if (response.status === 401) { const error = new Error('login'); error.login = true; throw error; }
  if (!response.ok) throw new Error('bank_error');
  return response;
}
function clearThumbs() { for (const name of Object.keys(thumbs)) { URL.revokeObjectURL(thumbs[name]); delete thumbs[name]; } }
async function loadThumbs(items, id) {
  await Promise.all(items.map(async item => {
    if (thumbs[key(item)]) return;
    try {
      const blob = await (await get(`/api/image-banks/${item.provider}/${encodeURIComponent(item.id)}/thumbnail`, controller?.signal)).blob();
      if (id === generation) thumbs[key(item)] = URL.createObjectURL(blob);
    } catch { /* the card still shows its title and licence */ }
  }));
}
async function search() {
  const term = query.value.trim();
  if (!term || !base) return;
  controller?.abort(); controller = new AbortController();
  const id = ++generation;
  clearThumbs(); expanded.value = new Set(); saved.value = new Set(); message.value = ''; loginNeeded.value = false; searching.value = true;
  groups.value = BANKS.map(bank => ({...bank, status: 'pending', items: []}));
  await Promise.all(groups.value.map(async (group, index) => {
    try {
      const params = new URLSearchParams({q: term, language: apiLanguage()});
      const found = await (await get(`/api/image-banks/${group.id}/search?${params}`, controller.signal)).json();
      if (id !== generation) return;
      // NC banks (ARASAAC) are always shown, labelled; the filter only trims NC items from mixed banks.
      const items = freeOnly.value && !group.nc ? found.items.filter(item => isFree(item.license)) : found.items;
      groups.value[index] = {...group, status: 'done', items};
      loadThumbs(items.slice(0, PER_BANK), id);
    } catch (error) {
      if (id !== generation || error.name === 'AbortError') return;
      if (error.login) loginNeeded.value = true;
      groups.value[index] = {...group, status: error.login ? 'login' : 'error', items: []};
    }
  }));
  if (id === generation) searching.value = false;
}
function more(group) {
  expanded.value = new Set(expanded.value).add(group.id);
  loadThumbs(group.items, generation);
}
async function save(item) {
  if (!authenticated.value) { message.value = t('rebost.banksSaveLogin'); return; }
  savingId.value = key(item); message.value = '';
  await run(async () => {
    try {
      const blob = await (await get(`/api/image-banks/${item.provider}/${encodeURIComponent(item.id)}/content`)).blob();
      const type = blob.type.split(';')[0];
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(type)) throw new Error('image_format');
      await api.add(new File([blob], 'image', {type}), (item.title || 'Imatge').slice(0, 200), 'illustration', item.credit || '', item.license || '');
      saved.value = new Set(saved.value).add(key(item));
      return t('rebost.banksSaved');
    } catch (error) {
      if (error.status === 401) return report(error);
      throw error.status ? error : Object.assign(new Error('operation_failed'), {status: 0});
    }
  });
  savingId.value = '';
}
onBeforeUnmount(() => { controller?.abort(); generation++; clearThumbs(); });
</script>

<template>
  <section id="banks" class="panel banks-panel">
    <form class="banks-search" @submit.prevent="search">
      <label><span>{{ t('rebost.search') }}</span>
        <input v-model="query" type="search" maxlength="80" :placeholder="t('rebost.banksPlaceholder')"></label>
      <label class="banks-free"><input v-model="freeOnly" type="checkbox"> {{ t('rebost.banksFreeOnly') }}</label>
      <button type="submit" :disabled="searching || !query.trim()">{{ searching ? t('rebost.banksSearching') : t('rebost.search') }}</button>
    </form>
    <p class="banks-note">{{ t('rebost.banksNcNote') }} {{ searching ? t('rebost.banksSlow') : '' }}</p>
    <p v-if="loginNeeded" class="banks-login" role="alert">{{ t('rebost.banksLogin') }}
      <a class="button-link secondary" :href="base" target="_blank" rel="noopener noreferrer">{{ t('rebost.banksOpenEducrea') }}</a></p>
    <p v-if="message" role="status">{{ message }}</p>
    <template v-for="group in groups" :key="group.id">
      <h3 class="banks-title">{{ group.name }}<span v-if="group.status === 'pending'" class="banks-state"> · {{ t('rebost.banksSearching') }}</span>
        <span v-else-if="group.status === 'error'" class="banks-state"> · {{ t('rebost.banksFailed') }}</span>
        <span v-else-if="group.status === 'done' && !group.items.length" class="banks-state"> · {{ t('rebost.banksEmpty') }}</span></h3>
      <div v-if="group.items.length" class="banks-grid">
        <article v-for="item in visible(group)" :key="key(item)" class="bank-card">
          <div class="image"><img :src="thumbs[key(item)] || undefined" :alt="item.title"></div>
          <h4>{{ item.title }}</h4>
          <p class="credit"><span v-if="!isFree(item.license)" class="nc-badge" :title="t('rebost.banksNcTitle')">NC</span> {{ item.license }}
            <template v-if="item.source_url"> · <a :href="item.source_url" target="_blank" rel="noopener noreferrer">{{ group.name }}</a></template></p>
          <div class="actions"><button type="button" :disabled="savingId === key(item) || saved.has(key(item))" @click="save(item)">
            {{ saved.has(key(item)) ? t('rebost.banksSaved') : t('rebost.banksSave') }}</button></div>
        </article>
      </div>
      <button v-if="group.items.length > PER_BANK && !expanded.has(group.id)" type="button" class="secondary" @click="more(group)">
        {{ t('rebost.banksMore') }} · {{ group.name }} ({{ group.items.length - PER_BANK }})</button>
    </template>
  </section>
</template>
