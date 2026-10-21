<script setup>
import {onBeforeUnmount, ref} from 'vue';
import {usePortalTranslations} from '../shared/usePortalTranslations.js';
import {useCredentials} from './useCredentials.js';
import {downloadCredentials, printCredentials} from './credentialExports.js';

const props = defineProps({api: Function, onCreated: Function, onRefresh: Function, onSessionExpired: Function});
const t = usePortalTranslations();
const freshPanel = ref(null);
// Hide synchronously before a back/forward-cache snapshot can capture PINs.
const hideFresh = () => { if (freshPanel.value) freshPanel.value.hidden = true; };
window.addEventListener('pagehide', hideFresh);
onBeforeUnmount(() => window.removeEventListener('pagehide', hideFresh));
const {context, tenant, count, additionalCount, fresh, pending, feedback, identities, unavailable, setContext, create, add, regenerate, revoke} = useCredentials(props);
function print() { if (!printCredentials(fresh.value, context.value.group?.group_code, t)) feedback.value = 'teacher.credentialsPopupBlocked'; }
function remove(identity) { revoke(identity, confirm(t('teacher.confirmRevoke', {label: identity.public_code}))); }
defineExpose({setContext});
</script>

<template>
  <form class="grid-fields" @submit.prevent="create">
    <label><span>{{ t('teacher.tenantLabel') }}</span><input id="tenantId" v-model="tenant" type="text" maxlength="200" :disabled="unavailable"></label>
    <label><span>{{ t('common.students') }}</span><input id="identityCount" v-model.number="count" type="number" min="1" max="30" required :disabled="unavailable"></label>
    <div class="actions"><button id="createBatch" type="submit" :disabled="unavailable">{{ t('teacher.generateCredentials') }}</button></div>
  </form>
  <Teleport to="#credentialsDetails">
  <p v-if="feedback" :role="feedback.includes('Error') || feedback.includes('Unavailable') || feedback.includes('loginFirst') || feedback.includes('Blocked') ? 'alert' : 'status'">{{ t(feedback) }} <strong v-if="feedback === 'teacher.groupCreated'">{{ context.group?.group_code }}</strong><strong v-else-if="feedback === 'teacher.pinRegenerated'">{{ fresh.at(-1)?.public_code }}</strong></p>
  <section v-if="context.teacher && fresh.length" id="freshCredentials" ref="freshPanel" :aria-label="t('teacher.generateCredentials')">
    <p class="pin-notice">{{ t('teacher.credentialsFreshHint') }}</p>
    <div class="export-actions" :aria-label="t('teacher.exports')">
      <button type="button" class="secondary" data-print-batch :disabled="pending" @click="print">{{ t('teacher.printBatch') }}</button>
      <button type="button" class="secondary" data-download-batch-csv :disabled="pending" @click="downloadCredentials(fresh, context.group?.group_code)">{{ t('teacher.downloadBatchCsv') }}</button>
    </div>
    <div class="cards"><article v-for="item in fresh" :key="item.id" class="credential">
      <strong>{{ item.public_code }}</strong><span>PIN {{ item.pin }}</span>
    </article></div>
  </section>
  <section id="credentialsOutput" class="output" :class="{empty: !context.teacher || !identities.length}" :aria-busy="pending">
    <h3>{{ context.group ? t('teacher.activeCredentials') : t('teacher.recentCredentials') }}</h3>
    <p v-if="!context.teacher">{{ t('teacher.errors.loginFirst') }}</p>
    <p v-else-if="!identities.length">{{ t('common.tableEmpty') }}</p>
    <table v-else>
      <thead><tr><th>{{ t('common.code') }}</th><th>{{ t('common.group') }}</th><th>{{ t('teacher.pinUpdated') }}</th><th>{{ t('teacher.credentialActions') }}</th></tr></thead>
      <tbody><tr v-for="identity in identities" :key="identity.id">
        <td>{{ identity.public_code }}</td><td>{{ context.groups.find(group => group.id === identity.group_id)?.name || identity.group_name || identity.group_id }}</td><td>{{ identity.pin_rotated_at || '' }}</td>
        <td><div class="inline-actions">
          <button type="button" class="compact secondary" :data-regenerate-pin="identity.id" :disabled="unavailable" @click="regenerate(identity)">{{ t('teacher.regeneratePin') }}</button>
          <button type="button" class="compact danger" :data-revoke-identity="identity.id" :disabled="unavailable" @click="remove(identity)">{{ t('teacher.revoke') }}</button>
        </div></td>
      </tr></tbody>
    </table>
  </section>
  <div class="subsection-heading"><span class="eyebrow">{{ t('teacher.groupTools') }}</span></div>
  <form class="grid-fields" @submit.prevent="add">
    <label><span>{{ t('teacher.addStudentsCount') }}</span><input id="additionalIdentityCount" v-model.number="additionalCount" type="number" min="1" max="120" required :disabled="unavailable || !context.group"></label>
    <div class="actions"><button id="addGroupIdentities" type="submit" class="secondary" :disabled="unavailable || !context.group">{{ t('teacher.addStudents') }}</button></div>
  </form>
  </Teleport>
</template>
