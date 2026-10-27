<script setup>
import {onBeforeUnmount, ref, shallowRef} from 'vue';
import {usePortalTranslations} from '../shared/usePortalTranslations.js';
import ClassroomTransferPanel from './ClassroomTransferPanel.vue';

const props = defineProps({api: Function, onSelect: Function, onDeleted: Function, onImported: Function, onSessionExpired: Function});
const t = usePortalTranslations();
const context = shallowRef({teacher: false, group: null, groups: []});
const pending = ref(false), feedback = ref('');
let epoch = 0, alive = true;
function setContext(next) {
  if (next.teacher !== context.value.teacher || next.group?.id !== context.value.group?.id) {
    epoch++; pending.value = false; feedback.value = '';
  }
  context.value = next;
}
function failed(error, version) {
  if (!alive || epoch !== version) return;
  if (error.status === 401) { props.onSessionExpired(); feedback.value = 'teacher.errors.loginFirst'; }
  else feedback.value = [403, 404].includes(error.status) ? 'teacher.groupAccessUnavailable' : 'teacher.groupOperationError';
}
async function select(id) {
  if (!context.value.teacher || pending.value) return;
  // The portal synchronously changes context before refreshing its dashboard.
  const operation = props.onSelect(id), version = epoch;
  pending.value = true; feedback.value = '';
  try { await operation; }
  catch (error) { failed(error, version); }
  finally { if (alive && epoch === version) pending.value = false; }
}
async function remove() {
  if (!context.value.teacher || !context.value.group || pending.value) return;
  const group = context.value.group;
  if (!confirm(t('teacher.confirmDeleteGroup', {group: group.group_code || group.name}))) return;
  const version = epoch;
  pending.value = true; feedback.value = '';
  try {
    await props.api(`/api/teacher/groups/${encodeURIComponent(group.id)}`, {method: 'DELETE'});
    // Apply deletion to the group actually deleted, even if selection has changed.
    if (alive) await props.onDeleted(group.id);
  } catch (error) { failed(error, version); }
  finally { if (alive && epoch === version) pending.value = false; }
}
defineExpose({setContext});
onBeforeUnmount(() => { alive = false; epoch++; });
</script>

<template>
  <section :aria-label="t('teacher.groups')" :aria-busy="pending">
    <h3>{{ t('teacher.groups') }}</h3>
    <p v-if="feedback" role="alert">{{ t(feedback) }}</p>
    <div class="output" :class="{empty: !context.teacher || !context.groups.length}">
      <p v-if="!context.teacher">{{ t('teacher.errors.loginFirst') }}</p>
      <p v-else-if="!context.groups.length">{{ t('common.tableEmpty') }}</p>
      <table v-else>
        <thead><tr><th>{{ t('teacher.groupLabel') }}</th><th>{{ t('teacher.tenant') }}</th><th>{{ t('teacher.active') }}</th><th>{{ t('common.select') }}</th></tr></thead>
        <tbody><tr v-for="group in context.groups" :key="group.id">
          <td><strong v-if="group.label">{{ group.label }}</strong><span v-if="group.label" class="hint"> · </span>{{ group.name }}</td><td>{{ group.tenant_id }}</td><td>{{ group.active ?? 0 }}</td>
          <td><button type="button" class="compact secondary" :data-select-group="group.id" :aria-pressed="context.group?.id === group.id" :disabled="pending" @click="select(group.id)">{{ t('common.select') }}</button></td>
        </tr></tbody>
      </table>
      <p v-if="context.teacher && context.groupsTotal > context.groups.length" class="hint">{{ t('teacher.groupsLimit', {shown: context.groups.length, total: context.groupsTotal}) }}</p>
    </div>
    <div class="actions"><button id="deleteGroup" type="button" class="danger" :disabled="!context.teacher || !context.group || pending" @click="remove">{{ t('teacher.deleteGroup') }}</button></div>
    <ClassroomTransferPanel :api="api" :teacher="context.teacher" :group="context.group" :on-imported="onImported" :on-session-expired="onSessionExpired" />
  </section>
</template>
