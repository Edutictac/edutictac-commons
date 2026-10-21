<script setup>
import {usePortalTranslations} from '../shared/usePortalTranslations.js';
import {useResults} from './useResults.js';
const props = defineProps({api: Function, onSessionExpired: Function});
const t = usePortalTranslations();
const {context, assignment, rows, mode, ready, loading, pending, feedback, unavailable, setContext, load, complete} = useResults(props.api, props.onSessionExpired);
defineExpose({setContext});
</script>

<template>
  <div class="actions">
    <button id="loadResults" type="button" :disabled="unavailable" @click="load('results')">{{ t('teacher.viewResults') }}</button>
    <button id="loadRanking" type="button" class="secondary" :disabled="unavailable" @click="load('ranking')">{{ t('teacher.viewRanking') }}</button>
  </div>
  <div id="resultsOutput" class="output" :class="{empty: !ready}" :aria-busy="loading || pending">
    <p v-if="feedback" role="alert">{{ t(feedback) }}</p>
    <p v-if="context.teacher && assignment && context.dataReady"><strong>{{ assignment.title || assignment.activity_id }}</strong></p>
    <p v-if="loading" role="status">{{ t('teacher.resultsLoading') }}</p>
    <p v-else-if="!ready && !feedback">{{ t('teacher.resultsPlaceholder') }}</p>
    <template v-if="context.teacher && assignment && context.dataReady && ready">
      <p v-if="mode === 'ranking'" class="hint">{{ t('teacher.activityRanking') }}</p>
      <p v-if="!rows.length">{{ t('common.tableEmpty') }}</p>
      <table v-else-if="mode === 'results'">
        <thead><tr><th>{{ t('common.code') }}</th><th>{{ t('common.attempts') }}</th><th>{{ t('common.bestScore') }}</th><th>{{ t('common.lastScoreAt') }}</th><th>{{ t('common.status') }}</th><th>{{ t('teacher.markCompleted') }}</th></tr></thead>
        <tbody><tr v-for="row in rows" :key="row.identity_id">
          <td>{{ row.public_code }}</td><td>{{ row.attempts }}</td><td>{{ row.best_score ?? '' }}</td><td>{{ row.last_score_at || '' }}</td><td>{{ t(row.completed ? 'student.done' : 'student.pending') }}</td>
          <td><button type="button" class="compact secondary" :data-mark-completed="!row.completed ? assignment.id + ':' + row.identity_id : undefined" :data-unmark-completed="row.completed ? assignment.id + ':' + row.identity_id : undefined" :disabled="unavailable || loading" @click="complete(row)">{{ t(row.completed ? 'teacher.unmarkCompleted' : 'teacher.markCompleted') }}</button></td>
        </tr></tbody>
      </table>
      <table v-else>
        <thead><tr><th>{{ t('common.code') }}</th><th>{{ t('common.score') }}</th><th>{{ t('common.date') }}</th></tr></thead>
        <tbody><tr v-for="(row, index) in rows" :key="index"><td>{{ row.public_code }}</td><td>{{ row.score }}</td><td>{{ row.ts }}</td></tr></tbody>
      </table>
    </template>
  </div>
</template>
