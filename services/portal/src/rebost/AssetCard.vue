<script setup>
import {computed, inject, onBeforeUnmount, ref, watch} from 'vue';

const props = defineProps({item: {type: Object, required: true}, nested: Boolean});
const app = inject('rebost');
const {api, t, locale, authenticated, picking, familySelection, types, run, refresh, chooseCollection, preview, select, download, report} = app;
const name = ref(''), type = ref(''), thumbnail = ref('');
const expanded = ref(false), members = ref(null);
let alive = true, generation = 0;
const displayName = computed(() => {
  if (!['catalog', 'scratch'].includes(props.item.collection)) return props.item.name;
  const names = props.item.names || {};
  return names[locale.value] || (locale.value === 'va' && names.ca) || names.es || names.ca || names.en || props.item.name || props.item.id;
});
const group = computed(() => !props.nested && props.item.collection === 'scratch' && props.item.family?.count > 1);
const origin = computed(() => ['catalog', 'scratch'].includes(props.item.collection) ? props.item : props.item.provenance);
watch(() => props.item, async item => {
  name.value = item.name; type.value = item.type;
  expanded.value = false; members.value = null;
  const request = ++generation;
  URL.revokeObjectURL(thumbnail.value); thumbnail.value = '';
  try {
    const blob = await api.read(item.id, true);
    if (alive && request === generation) thumbnail.value = URL.createObjectURL(blob);
  } catch (error) { if (alive && request === generation) report(error); }
}, {immediate: true});
onBeforeUnmount(() => { alive = false; generation++; URL.revokeObjectURL(thumbnail.value); });
async function toggle() {
  await run(async () => {
    if (!members.value) {
      const family = await api.family(props.item.family.id);
      if (family.id !== props.item.family.id || family.revision !== props.item.family.revision) throw new Error('revision_conflict');
      if (!alive) return;
      members.value = family.items;
    }
    expanded.value = !expanded.value;
  });
}
function saveCopy() { return run(async () => {
  if (!authenticated.value) { await chooseCollection('mine'); return 'login_required'; }
  await api.duplicate(props.item);
  try { await chooseCollection('mine'); } catch (error) { report(error); return 'saved_refresh_failed'; }
  return 'image_saved';
}); }
function remove() { if (confirm(t('rebost.confirm'))) run(async () => { await api.remove(props.item); await refresh(); }); }
</script>

<template>
  <component :is="nested ? 'section' : 'article'" :data-id="item.id" :class="{'family-costume': nested, 'expanded-family': expanded}">
    <button type="button" class="image secondary" :aria-label="t('rebost.view') + ': ' + displayName" @click="run(() => preview(item, displayName))">
      <img :src="thumbnail || undefined" :alt="displayName">
    </button>
    <template v-if="picking || item.readonly">
      <component :is="nested ? 'h3' : 'h2'">{{ displayName }}</component>
      <span>{{ t('rebost.' + item.type) }}</span>
    </template>
    <template v-else>
      <label>{{ t('rebost.name') }}<input v-model="name" maxlength="200" required></label>
      <label>{{ t('rebost.filter') }}<select v-model="type"><option v-for="value in types" :key="value" :value="value">{{ t('rebost.' + value) }}</option></select></label>
    </template>
    <p v-if="origin && !nested" class="credit">{{ origin.attribution }} · {{ origin.license }}</p>
    <span v-if="group">{{ item.family.count }} {{ t('rebost.costumeCount') }}</span>
    <small>{{ item.width }} × {{ item.height }} px</small>
    <div class="actions">
      <button v-if="picking" type="button" @click="select(item, displayName, group && familySelection)">{{ group && familySelection ? t('rebost.addFamily') : t('rebost.choose') }}</button>
      <button v-else-if="item.readonly" type="button" @click="saveCopy">{{ authenticated ? (group ? t('rebost.saveImage') : t('rebost.saveCopy')) : t('rebost.loginToSave') }}</button>
      <template v-else>
        <button type="button" @click="run(async () => { await api.update(item, name, type); try { await refresh(); } catch (error) { report(error); return 'saved_refresh_failed'; } return 'success'; })">{{ t('rebost.save') }}</button>
        <button type="button" class="secondary" @click="run(async () => { await api.duplicate(item); try { await refresh(); } catch (error) { report(error); return 'saved_refresh_failed'; } return 'image_saved'; })">{{ t('rebost.duplicate') }}</button>
        <button type="button" class="danger" @click="remove">{{ t('rebost.remove') }}</button>
      </template>
      <template v-if="origin && !picking">
        <button type="button" class="secondary" @click="run(() => download(item))">{{ t('rebost.source') }}</button>
        <button type="button" class="secondary" @click="run(() => download(item, true))">{{ t('rebost.license') }}</button>
      </template>
      <button v-if="group" class="secondary" type="button" :aria-expanded="expanded" @click="toggle">{{ expanded ? t('rebost.hideCostumes') : t('rebost.costumes') }}</button>
    </div>
    <div v-if="members" class="family-variants" :hidden="!expanded">
      <AssetCard v-for="member in members" :key="member.id" :item="member" nested />
    </div>
  </component>
</template>
