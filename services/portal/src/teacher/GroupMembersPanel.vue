<script setup>
import {computed, onBeforeUnmount, ref, shallowRef} from 'vue';
import {usePortalTranslations} from '../shared/usePortalTranslations.js';

const props = defineProps({api: Function, onSessionExpired: Function});
const t = usePortalTranslations();
const context = shallowRef({teacher: false, group: null});
const members = ref([]), teacherId = ref(''), pending = ref(false), loaded = ref(false), blocked = ref(false), feedback = ref('');
const unavailable = computed(() => !context.value.teacher || !context.value.group || pending.value);
let epoch = 0, alive = true;
function setContext(next) {
  if (next.teacher !== context.value.teacher || next.group?.id !== context.value.group?.id) {
    epoch++; members.value = []; teacherId.value = ''; pending.value = false;
    loaded.value = false; blocked.value = false; feedback.value = '';
  }
  context.value = next;
}
function current(version) { return alive && epoch === version && context.value.teacher && context.value.group; }
function failed(error, version) {
  if (!current(version)) return;
  members.value = []; loaded.value = false; blocked.value = true;
  if (error.status === 401) { props.onSessionExpired(); feedback.value = 'teacher.errors.loginFirst'; }
  else feedback.value = [403, 404].includes(error.status) ? 'teacher.groupAccessUnavailable' : error.status === 422 ? 'teacher.invalidMemberId' : 'teacher.membersOperationError';
}
async function read(groupId, version) {
  const data = await props.api(`/api/teacher/groups/${encodeURIComponent(groupId)}/members`, {method: 'GET'});
  if (!current(version)) return;
  if (data.group_id !== groupId) throw new Error('wrong_group');
  members.value = data.members || []; loaded.value = true; blocked.value = false;
}
async function run(operation) {
  if (unavailable.value) return;
  const version = epoch, groupId = context.value.group.id;
  pending.value = true; feedback.value = '';
  try { await operation(groupId, version); }
  catch (error) { failed(error, version); }
  finally { if (alive && epoch === version) pending.value = false; }
}
function load() { return run(read); }
function add() {
  if (blocked.value) return;
  const id = teacherId.value.trim();
  if (!/^(?:oidc:)?[A-Za-z0-9:_-]{3,128}$/.test(id) || id.length > 128) { feedback.value = 'teacher.invalidMemberId'; return; }
  return run(async (groupId, version) => {
    await props.api(`/api/teacher/groups/${encodeURIComponent(groupId)}/members`, {method: 'POST', body: JSON.stringify({teacher_id: id, role: 'teacher'})});
    if (!current(version)) return;
    teacherId.value = '';
    await read(groupId, version);
  });
}
function remove(member) {
  if (blocked.value || member.role === 'owner' || !confirm(t('teacher.confirmRemoveMember', {id: member.teacher_id}))) return;
  return run(async (groupId, version) => {
    await props.api(`/api/teacher/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(member.teacher_id)}`, {method: 'DELETE'});
    if (current(version)) await read(groupId, version);
  });
}
defineExpose({setContext});
onBeforeUnmount(() => { alive = false; epoch++; });
</script>

<template>
  <p class="hint">{{ t('teacher.membersHint') }}</p>
  <form class="grid-fields" @submit.prevent="add">
    <label><span>{{ t('teacher.memberIdLabel') }}</span><input id="memberTeacherId" v-model="teacherId" type="text" maxlength="128" :placeholder="t('teacher.memberIdPlaceholder')" autocomplete="off" :disabled="unavailable || blocked"></label>
    <div class="actions">
      <button id="addGroupMember" type="submit" class="secondary" :disabled="unavailable || blocked">{{ t('teacher.addMember') }}</button>
      <button id="loadGroupMembers" type="button" class="secondary" :disabled="unavailable" @click="load">{{ t('teacher.loadMembers') }}</button>
    </div>
  </form>
  <div id="membersOutput" class="output" :class="{empty: !loaded}" :aria-busy="pending">
    <p v-if="feedback" role="alert">{{ t(feedback) }}</p>
    <p v-if="!context.teacher || !context.group">{{ t('teacher.membersEmpty') }}</p>
    <p v-else-if="!loaded && !feedback">{{ t('teacher.membersPrompt') }}</p>
    <p v-else-if="loaded && !members.length">{{ t('common.tableEmpty') }}</p>
    <table v-if="members.length">
      <thead><tr><th>{{ t('teacher.memberIdLabel') }}</th><th>{{ t('common.status') }}</th><th>{{ t('common.date') }}</th><th>{{ t('teacher.removeMember') }}</th></tr></thead>
      <tbody><tr v-for="member in members" :key="member.teacher_id">
        <td>{{ member.teacher_id }}</td><td>{{ member.role }}</td><td>{{ member.created_at }}</td>
        <td><button v-if="member.role !== 'owner'" type="button" class="compact danger" :data-remove-member="member.teacher_id" :disabled="unavailable || blocked" @click="remove(member)">{{ t('teacher.removeMember') }}</button></td>
      </tr></tbody>
    </table>
  </div>
</template>
