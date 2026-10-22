<script setup>
import {usePortalTranslations} from '../shared/usePortalTranslations.js';
import {icons, useStudent} from './useStudent.js';
const props = defineProps({api:Function, onSessionChanged:Function});
const t = usePortalTranslations();
const {identity, assignments, itinerary, code, pin, history, ready, loading, authPending, writing, feedback, completed, visible, disabled, enabled, login, logout, load, icon, launch} = useStudent(props.api, props.onSessionChanged);
defineExpose({logout});
</script>
<template>
  <form id="studentLoginPanel" v-show="!identity" @submit.prevent="login">
    <div class="panel-heading"><p class="eyebrow">{{ t('student.access') }}</p><h3>{{ t('student.loginTitle') }}</h3></div>
    <div class="grid-fields">
      <label><span>{{ t('student.codeLabel') }}</span><input id="studentCode" v-model="code" type="text" maxlength="3" placeholder="K7P" autocomplete="off" autocapitalize="characters" spellcheck="false" :disabled="authPending"></label>
      <label><span>{{ t('student.pinLabel') }}</span><input id="studentPin" v-model="pin" type="password" inputmode="numeric" maxlength="6" autocomplete="off" :disabled="authPending"></label>
    </div>
    <div class="actions"><button id="studentLogin" type="submit" :disabled="authPending || writing || feedback === 'student.logoutError'">{{ t('student.login') }}</button></div>
  </form>
  <div id="studentSessionActions" v-show="identity" class="actions"><button id="studentLogout" type="button" class="secondary" :disabled="authPending" @click="logout">{{ t('student.logout') }}</button></div>
  <div id="studentOutput" class="output" :class="{empty: !identity}" :aria-busy="loading || authPending || writing">
    <p v-if="feedback" role="status">{{ t(feedback) }}</p>
    <button v-if="feedback === 'student.logoutError'" type="button" :disabled="authPending" @click="logout">{{ t('student.logout') }}</button>
    <p v-if="!identity && !feedback">{{ t('student.loginPrompt') }}</p>
    <template v-if="identity">
      <section class="student-profile" :aria-label="t('student.profileAria')">
        <div class="student-profile__summary"><span class="student-profile__icon" aria-hidden="true">{{ identity.avatar_icon || '🙂' }}</span><div><p>{{ t('student.hello') }} <strong>{{ identity.public_code }}</strong>.</p><p class="muted">{{ t('student.iconHint') }}</p></div></div>
        <div class="student-icon-picker" role="group" :aria-label="t('student.iconPickerAria')">
          <button v-for="value in icons" :key="value" type="button" class="student-icon" :class="{selected: identity.avatar_icon === value}" :data-student-icon="value" :aria-pressed="identity.avatar_icon === value" :title="t('student.chooseIcon') + ' ' + value" :disabled="disabled" @click="icon(value)">{{ value }}</button>
        </div>
      </section>
      <div class="actions"><button id="refreshStudent" type="button" class="secondary compact" :disabled="authPending || writing || loading" @click="load()">{{ t('student.refresh') }}</button></div>
      <p v-if="loading" role="status">{{ t('student.loading') }}</p>
      <template v-if="ready">
        <h3 v-if="itinerary" data-student-itinerary>{{ t('student.itineraryTitle', {title:itinerary.title}) }}</h3>
        <p>{{ t('student.progressLabel') }} <strong>{{ completed }}/{{ assignments.length }}</strong> {{ t('student.progressCompleted') }}</p>
        <button v-if="completed" type="button" class="compact secondary history-toggle" data-toggle-student-history="true" :aria-pressed="history" @click="history = !history">{{ t(history ? 'student.hideHistory' : 'student.showHistory') }}</button>
        <p v-if="!visible.length" class="empty">{{ t('student.noPending') }}</p>
        <div v-else class="student-table-scroll" tabindex="0" role="region" :aria-label="t('student.subtitle')">
          <table><thead><tr><th>{{ t('common.activity') }}</th><th>{{ t('common.status') }}</th><th>{{ t('common.bestScore') }}</th><th>{{ t('common.lastScoreAt') }}</th><th>{{ t('student.openPlay') }}</th></tr></thead>
            <tbody><tr v-for="item in visible" :key="item.id">
              <td>{{ item.title || item.activity_id }}</td><td>{{ t(item.completed ? 'student.done' : item.started ? 'student.inProgress' : 'student.pending') }}</td><td>{{ item.best_score ?? '' }}</td><td>{{ item.last_score_at || '' }}</td>
              <td><small v-if="!enabled(item)">{{ t('student.moduleDisabled') }}</small>
                <button v-else-if="item.app_id === 'eduhoot'" type="button" class="compact secondary" :data-launch-eduhoot-assignment="item.id" :disabled="disabled" @click="launch(item)">{{ t('student.openEduhoot') }}</button>
                <button v-else-if="['play','edutictac-play'].includes(item.app_id)" type="button" class="compact secondary" :data-launch-play-assignment="item.id" :disabled="disabled" @click="launch(item)">{{ t('student.openPlay') }}</button>
                <button v-else-if="item.app_id === 'resource' && String(item.activity_id).startsWith('teacher-upload:')" type="button" class="compact secondary" :data-launch-document-assignment="item.id" :disabled="disabled" @click="launch(item)">{{ t('student.openResource') }}</button>
                <button v-else-if="item.app_id === 'resource'" type="button" class="compact secondary" :data-launch-resource-assignment="item.id" :disabled="disabled" @click="launch(item)">{{ t('student.openResource') }}</button>
              </td>
            </tr></tbody>
          </table>
        </div>
      </template>
    </template>
    <button v-if="!identity && feedback === 'student.loadError'" type="button" class="secondary" :disabled="loading || authPending" @click="load(true)">{{ t('student.refresh') }}</button>
  </div>
</template>
