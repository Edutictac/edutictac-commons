<script setup>
import {onBeforeUnmount, ref, shallowRef} from 'vue';
import {usePortalTranslations} from '../shared/usePortalTranslations.js';
const props = defineProps({onSelect: Function, onSessionExpired: Function});
const t = usePortalTranslations();
const context = shallowRef({teacher: false, group: null, groups: [], assignments: [], assignment: null, summary: null, dataReady: false});
const pending = ref(false), feedback = ref('');
let epoch = 0, alive = true;
function setContext(next) {
  if (next.teacher !== context.value.teacher || next.group?.id !== context.value.group?.id || next.assignment?.id !== context.value.assignment?.id) {
    epoch++; pending.value = false; feedback.value = '';
  } else if (next.dataReady) feedback.value = '';
  context.value = next;
}
function report(error) {
  if (error.status === 401) { props.onSessionExpired(); feedback.value = 'teacher.errors.loginFirst'; }
  else feedback.value = [403, 404].includes(error.status) ? 'teacher.assignmentAccessUnavailable' : 'teacher.assignmentsLoadError';
}
async function select(id) {
  if (!context.value.teacher || !context.value.dataReady || pending.value) return;
  const operation = props.onSelect(id), version = epoch;
  pending.value = true;
  try { await operation; }
  catch (error) { if (alive && version === epoch) report(error); }
  finally { if (alive && version === epoch) pending.value = false; }
}
defineExpose({setContext, report});
onBeforeUnmount(() => { alive = false; epoch++; });
</script>

<template>
  <section id="teacherOutput" class="output" :class="{empty: !context.teacher}" :aria-busy="pending || (context.teacher && !context.dataReady)">
    <p v-if="feedback" role="alert">{{ t(feedback) }}</p>
    <p v-if="!context.teacher">{{ t('teacher.errors.loginFirst') }}</p>
    <template v-else>
      <p v-if="context.summary"><strong>{{ context.summary.active || 0 }}</strong> {{ t('teacher.activeOfTotal', {total: context.summary.total || 0}) }}</p>
      <div class="teacher-context">
        <p>{{ t(context.group ? 'teacher.groupSelected' : 'teacher.noGroupSelected') }} <strong v-if="context.group">{{ context.group.label || context.group.group_code || context.group.name }}</strong></p>
        <p>{{ t(context.assignment ? 'teacher.activitySelected' : 'teacher.noActivitySelected') }} <strong v-if="context.assignment && context.dataReady">{{ context.assignments.find(item => item.id === context.assignment.id)?.title || '' }}</strong></p>
        <div class="export-actions" :aria-label="t('teacher.exports')">
          <template v-if="context.group">
            <a class="button-link" :href="`/api/groups/${encodeURIComponent(context.group.id)}/cards`" target="_blank" rel="noopener">{{ t('teacher.cards') }}</a>
            <a class="button-link secondary" :href="`/api/groups/${encodeURIComponent(context.group.id)}/csv`" target="_blank" rel="noopener">{{ t('teacher.csvCodes') }}</a>
          </template>
          <a class="button-link secondary" :href="'/api/teacher/stats.csv' + (context.group ? '?group_id=' + encodeURIComponent(context.group.id) : '')" target="_blank" rel="noopener">{{ t('teacher.csvStats') }}</a>
        </div>
      </div>
      <h3>{{ t('teacher.assignments') }}</h3>
      <template v-if="!context.dataReady"><p v-if="!feedback">{{ t('teacher.assignmentsLoading') }}</p></template>
      <p v-else-if="!context.assignments.length">{{ t('common.tableEmpty') }}</p>
      <table v-else>
        <thead><tr><th>{{ t('common.title') }}</th><th>{{ t('common.group') }}</th><th>{{ t('common.activity') }}</th><th>{{ t('common.select') }}</th></tr></thead>
        <tbody><tr v-for="assignment in context.assignments" :key="assignment.id">
          <td>{{ assignment.title }}</td><td>{{ context.groups.find(group => group.id === assignment.group_id)?.label || context.groups.find(group => group.id === assignment.group_id)?.name || assignment.group_id }}</td><td>{{ assignment.activity_id }}</td>
          <td><button type="button" class="compact secondary" :data-select-assignment="assignment.id" :aria-pressed="context.assignment?.id === assignment.id" :disabled="pending" @click="select(assignment.id)">{{ t('common.select') }}</button></td>
        </tr></tbody>
      </table>
    </template>
  </section>
</template>
