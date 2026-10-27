<script setup>
import {nextTick, onBeforeUnmount, ref, watch} from 'vue';
import {usePortalTranslations} from '../shared/usePortalTranslations.js';

const props = defineProps({
  api: Function, teacher: Boolean, group: Object,
  onImported: Function, onSessionExpired: Function,
});
const t = usePortalTranslations();
const enabled = ref(false), pending = ref(false), feedback = ref('');
const recoveryKey = ref(''), importKey = ref(''), selectedFile = ref(null);
let alive = true, generation = 0;

function clearSecrets() {
  recoveryKey.value = '';
  importKey.value = '';
  if (selectedFile.value) selectedFile.value.value = '';
}
function onPageHide() { clearSecrets(); }
function onSettingsChanged() { refreshStatus(); }
window.addEventListener('pagehide', onPageHide);
window.addEventListener('commons:transfer-settings-changed', onSettingsChanged);
onBeforeUnmount(() => {
  alive = false; generation++; clearSecrets();
  window.removeEventListener('pagehide', onPageHide);
  window.removeEventListener('commons:transfer-settings-changed', onSettingsChanged);
});

watch(() => props.group?.id, () => {
  generation++; pending.value = false; clearSecrets(); feedback.value = '';
});
async function refreshStatus() {
  generation++;
  enabled.value = false;
  clearSecrets();
  if (!props.teacher) return;
  const current = generation;
  try {
    const status = await props.api('/api/teacher/transfer/status', {method: 'GET'});
    if (alive && current === generation) enabled.value = status?.enabled === true;
  } catch {
    // La disponibilitat d'esta funció opcional no governa la sessió docent.
    if (alive && current === generation) enabled.value = false;
  }
}
watch(() => props.teacher, refreshStatus, {immediate: true});

function showError(error) {
  if (error.status === 401) props.onSessionExpired();
  feedback.value = error.status === 409 ? 'teacher.transferConflict' :
    error.status === 413 ? 'teacher.transferTooLarge' : 'teacher.transferError';
}
function download(base64, groupId) {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], {type: 'application/octet-stream'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = `commons-aula-${String(groupId).replace(/[^A-Za-z0-9_-]/g, '-')}.etc`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function exportGroup() {
  if (!props.teacher || !props.group || pending.value) return;
  const groupId = props.group.id, current = generation;
  pending.value = true; clearSecrets(); feedback.value = '';
  try {
    const result = await props.api(`/api/teacher/groups/${encodeURIComponent(groupId)}/transfer/export`,
      {method: 'POST'});
    if (!alive || current !== generation) return;
    download(result.package, groupId);
    recoveryKey.value = result.recovery_key;
    feedback.value = 'teacher.transferExported';
  } catch (error) {
    if (alive && current === generation) showError(error);
  } finally {
    if (alive && current === generation) pending.value = false;
  }
}
async function importGroup() {
  const file = selectedFile.value?.files?.[0];
  if (!props.teacher || !file || !importKey.value || pending.value) return;
  const current = generation;
  pending.value = true; feedback.value = '';
  try {
    if (file.size > 8 * 1024 * 1024 + 128) {
      feedback.value = 'teacher.transferTooLarge';
      return;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 32768) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
    }
    if (!alive || current !== generation) return;
    const result = await props.api('/api/teacher/groups/transfer/import', {
      method: 'POST',
      body: JSON.stringify({package: btoa(binary), recovery_key: importKey.value}),
    });
    if (!alive || current !== generation) return;
    clearSecrets();
    await props.onImported(result.group_id);
    await nextTick();
    if (alive && props.teacher && props.group?.id === result.group_id) {
      feedback.value = 'teacher.transferImported';
    }
  } catch (error) {
    if (alive && current === generation) showError(error);
  } finally {
    if (alive && current === generation) pending.value = false;
  }
}
</script>

<template>
  <section v-if="enabled && teacher" :aria-label="t('teacher.transferTitle')" :aria-busy="pending">
    <h3>{{ t('teacher.transferTitle') }}</h3>
    <p>{{ t('teacher.transferPilotHint') }}</p>
    <p v-if="feedback" :role="feedback === 'teacher.transferExported' || feedback === 'teacher.transferImported' ? 'status' : 'alert'">{{ t(feedback) }}</p>
    <div class="actions">
      <button type="button" class="secondary" :disabled="pending || !group" @click="exportGroup">{{ t('teacher.transferExport') }}</button>
    </div>
    <p v-if="recoveryKey">{{ t('teacher.transferKeyHint') }} <code>{{ recoveryKey }}</code></p>
    <form class="grid-fields" @submit.prevent="importGroup">
      <label><span>{{ t('teacher.transferFile') }}</span><input ref="selectedFile" type="file" accept=".etc,application/octet-stream" required :disabled="pending"></label>
      <label><span>{{ t('teacher.transferKey') }}</span><input v-model.trim="importKey" type="text" minlength="43" maxlength="44" autocomplete="off" spellcheck="false" required :disabled="pending"></label>
      <div class="actions"><button type="submit" class="secondary" :disabled="pending">{{ t('teacher.transferImport') }}</button></div>
    </form>
  </section>
</template>
