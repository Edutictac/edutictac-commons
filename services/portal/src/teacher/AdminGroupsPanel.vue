<script setup>
import {nextTick, onBeforeUnmount, ref, shallowRef} from 'vue';
import {usePortalTranslations} from '../shared/usePortalTranslations.js';
import GroupMembersPanel from './GroupMembersPanel.vue';

// Gestió de les aules del centre per a administració. Només apareix si el
// servidor accepta la sessió com a administració; no mostra dades de l'alumnat.
const props = defineProps({api: Function, onDeleted: Function, onSessionExpired: Function});
const t = usePortalTranslations();
const available = ref(false), groups = ref([]), selected = shallowRef(null);
const pending = ref(false), feedback = ref(''), members = ref(null);
const transferEnabled = ref(null), transferDraft = ref(false);
const transferPending = ref(false), transferFeedback = ref('');
let teacher = false, epoch = 0, alive = true;

function setContext(next) {
  if (Boolean(next.teacher) === teacher) return;
  teacher = Boolean(next.teacher);
  epoch++; available.value = false; groups.value = []; selected.value = null; feedback.value = '';
  transferEnabled.value = null; transferFeedback.value = '';
  if (teacher) load();
}
async function load() {
  const version = epoch;
  pending.value = true;
  try {
    const data = await props.api('/api/admin/groups', {method: 'GET'});
    if (!alive || version !== epoch) return;
    groups.value = data.groups || []; available.value = true; feedback.value = '';
    if (selected.value && !groups.value.some(group => group.id === selected.value.id)) selected.value = null;
    try {
      const settings = await props.api('/api/admin/transfer/settings', {method: 'GET'});
      if (!alive || version !== epoch) return;
      transferEnabled.value = settings.enabled === true;
      transferDraft.value = transferEnabled.value;
      transferFeedback.value = '';
    } catch {
      if (alive && version === epoch) transferFeedback.value = 'admin.transferLoadError';
    }
  } catch (error) {
    if (!alive || version !== epoch) return;
    // Sense permís d'administració el panell no existeix per a esta sessió. Un
    // panell opcional no tanca mai la sessió docent: ho fan els panells comuns.
    if ([401, 403].includes(error.status)) { available.value = false; groups.value = []; }
    else if (available.value) feedback.value = 'admin.loadError';
  } finally { if (alive && version === epoch) pending.value = false; }
}
async function saveTransfer() {
  if (transferPending.value || transferEnabled.value === null || transferDraft.value === transferEnabled.value) return;
  if (transferDraft.value && !confirm(t('admin.transferConfirm'))) return;
  const version = epoch;
  transferPending.value = true; transferFeedback.value = '';
  try {
    const result = await props.api('/api/admin/transfer/settings', {
      method: 'PUT', body: JSON.stringify({enabled: transferDraft.value}),
    });
    if (!alive || version !== epoch) return;
    transferEnabled.value = result.enabled === true;
    transferDraft.value = transferEnabled.value;
    transferFeedback.value = 'admin.transferSaved';
    window.dispatchEvent(new Event('commons:transfer-settings-changed'));
  } catch (error) {
    if (!alive || version !== epoch) return;
    if (error.status === 401) props.onSessionExpired();
    transferFeedback.value = 'admin.transferSaveError';
  } finally { if (alive && version === epoch) transferPending.value = false; }
}
async function manage(group) {
  selected.value = group; feedback.value = '';
  await nextTick();
  members.value?.setContext({teacher: true, group: {id: group.id, group_code: group.group_code}});
  members.value?.load();
}
async function remove() {
  const group = selected.value;
  if (!group || pending.value || !confirm(t('teacher.confirmDeleteGroup', {group: group.group_code}))) return;
  const version = epoch;
  pending.value = true; feedback.value = '';
  try {
    await props.api(`/api/teacher/groups/${encodeURIComponent(group.id)}`, {method: 'DELETE'});
    if (!alive || version !== epoch) return;
    selected.value = null;
    await props.onDeleted?.(group.id);
  } catch (error) {
    if (!alive || version !== epoch) return;
    if (error.status === 401) props.onSessionExpired();
    feedback.value = 'teacher.groupOperationError';
  } finally {
    if (alive && version === epoch) { pending.value = false; await load(); }
  }
}
defineExpose({setContext});
onBeforeUnmount(() => { alive = false; epoch++; });
</script>

<template>
  <details v-if="available" id="adminGroups" class="panel teacher-collapsible">
    <summary class="panel-summary">
      <span class="eyebrow">{{ t('admin.groupsEyebrow') }}</span>
      <strong>{{ t('admin.groupsTitle') }}</strong>
    </summary>
    <div class="panel-content" :aria-busy="pending">
      <p class="hint">{{ t('admin.groupsHint') }}</p>
      <p v-if="feedback" role="alert">{{ t(feedback) }}</p>
      <div class="panel" :aria-label="t('admin.transferTitle')">
        <h3>{{ t('admin.transferTitle') }}</h3>
        <p class="hint">{{ t('admin.transferHint') }}</p>
        <p v-if="transferFeedback" :role="transferFeedback === 'admin.transferSaved' ? 'status' : 'alert'">{{ t(transferFeedback) }}</p>
        <label v-if="transferEnabled !== null"><input v-model="transferDraft" type="checkbox" :disabled="transferPending"> {{ t('admin.transferEnable') }}</label>
        <div class="actions"><button id="adminSaveTransfer" type="button" class="secondary" :disabled="transferPending || transferEnabled === null || transferDraft === transferEnabled" @click="saveTransfer">{{ t('admin.transferSave') }}</button></div>
      </div>
      <div class="output" :class="{empty: !groups.length}">
        <p v-if="!groups.length">{{ t('common.tableEmpty') }}</p>
        <table v-else>
          <thead><tr><th>{{ t('teacher.groupOpaque') }}</th><th>{{ t('admin.owner') }}</th><th>{{ t('admin.collaborators') }}</th><th>{{ t('common.date') }}</th><th>{{ t('admin.manage') }}</th></tr></thead>
          <tbody><tr v-for="group in groups" :key="group.id">
            <td><strong v-if="group.label">{{ group.label }}</strong><span v-if="group.label"> · </span>{{ group.group_code }}</td><td>{{ group.owner_id || t('admin.noOwner') }}</td><td>{{ group.collaborators }}</td><td>{{ (group.created_at || '').slice(0, 10) }}</td>
            <td><button type="button" class="compact secondary" :data-admin-group="group.id" :aria-pressed="selected?.id === group.id" :disabled="pending" @click="manage(group)">{{ t('admin.manage') }}</button></td>
          </tr></tbody>
        </table>
      </div>
      <section v-if="selected" :aria-label="t('admin.selectedGroup', {group: selected.group_code})">
        <h3>{{ t('admin.selectedGroup', {group: selected.group_code}) }}</h3>
        <GroupMembersPanel ref="members" :api="api" :on-session-expired="onSessionExpired" />
        <div class="actions"><button id="adminDeleteGroup" type="button" class="danger" :disabled="pending" @click="remove">{{ t('teacher.deleteGroup') }}</button></div>
      </section>
    </div>
  </details>
</template>
