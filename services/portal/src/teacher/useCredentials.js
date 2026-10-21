import {computed, onBeforeUnmount, ref, shallowRef} from 'vue';

export function useCredentials({api, onCreated, onRefresh, onSessionExpired}) {
  const context = shallowRef({teacher: false, group: null, identities: [], groups: []});
  const tenant = ref('centre'), count = ref(6), additionalCount = ref(6);
  const fresh = ref([]), pending = ref(false), blocked = ref(false), feedback = ref('');
  const identities = computed(() => context.value.teacher ? context.value.identities.filter(item => !context.value.group || item.group_id === context.value.group.id) : []);
  const unavailable = computed(() => !context.value.teacher || pending.value || blocked.value);
  let epoch = 0, alive = true;
  function clear() { fresh.value = []; feedback.value = ''; }
  function setContext(next) {
    if (next.teacher !== context.value.teacher || next.group?.id !== context.value.group?.id) {
      epoch++; clear(); pending.value = false; blocked.value = false;
    } else if (next.identities !== context.value.identities) {
      blocked.value = false;
      const active = new Set(next.identities.filter(item => item.active !== 0 && item.active !== false).map(item => item.id));
      fresh.value = fresh.value.filter(item => active.has(item.id));
    }
    context.value = next;
  }
  function failure(error) {
    if (error.status === 401) { onSessionExpired(); feedback.value = 'teacher.errors.loginFirst'; }
    else {
      blocked.value = true;
      if ([403, 404].includes(error.status)) { clear(); feedback.value = 'teacher.groupAccessUnavailable'; }
      else feedback.value = 'teacher.credentialsOperationError';
    }
  }
  async function refresh(scope) {
    try { await onRefresh(); }
    catch (error) {
      if (!scope.current()) return;
      if ([401, 403, 404].includes(error.status)) failure(error);
      else { blocked.value = true; feedback.value = 'teacher.credentialsRefreshError'; }
    }
  }
  async function run(operation) {
    if (unavailable.value) return;
    const scope = {
      version: epoch,
      current() { return alive && this.version === epoch && context.value.teacher; },
      adopt() { this.version = epoch; pending.value = true; }
    };
    pending.value = true; feedback.value = '';
    try { await operation(scope); }
    catch (error) { if (scope.current()) failure(error); }
    finally { if (alive && scope.version === epoch) pending.value = false; }
  }
  function batchItems(batch) {
    if (!batch.group?.id || !Array.isArray(batch.identities) || batch.identities.length > 120 || batch.identities.some(item => !item.id || typeof item.public_code !== 'string' || !/^\d{4}(\d{2})?$/.test(item.pin))) throw new Error('invalid_batch');
    return batch.identities.map(({id, public_code, pin}) => ({id, public_code, pin}));
  }
  function create() {
    if (!Number.isInteger(count.value) || count.value < 1 || count.value > 30) { feedback.value = 'teacher.credentialsCountError'; return; }
    return run(async scope => {
      const batch = await api('/api/identities/batch', {method: 'POST', body: JSON.stringify({tenant_id: tenant.value.trim() || 'centre', count: count.value, pin_length: 4})});
      if (!scope.current()) return;
      const items = batchItems(batch);
      // Only group metadata crosses into the legacy portal, never the PINs.
      onCreated({group: batch.group, count: items.length});
      scope.adopt(); fresh.value = items; feedback.value = 'teacher.groupCreated';
      await refresh(scope);
    });
  }
  function add() {
    if (!context.value.group) return;
    if (!Number.isInteger(additionalCount.value) || additionalCount.value < 1 || additionalCount.value > 120) { feedback.value = 'teacher.credentialsCountError'; return; }
    const groupId = context.value.group.id;
    return run(async scope => {
      const batch = await api(`/api/teacher/groups/${encodeURIComponent(groupId)}/identities`, {method: 'POST', body: JSON.stringify({count: additionalCount.value, pin_length: 4})});
      if (!scope.current()) return;
      const items = batchItems(batch);
      if (batch.group.id !== groupId) throw new Error('wrong_group');
      fresh.value = items; feedback.value = 'teacher.credentialsAdded';
      await refresh(scope);
    });
  }
  function regenerate(identity) {
    return run(async scope => {
      // A failed response could follow a successful rotation: never keep an old PIN.
      fresh.value = fresh.value.filter(item => item.id !== identity.id);
      const result = await api(`/api/identities/${encodeURIComponent(identity.id)}/regenerate-pin`, {method: 'POST'});
      if (!scope.current()) return;
      if (result.id !== identity.id || !/^\d{4}(\d{2})?$/.test(result.pin)) throw new Error('invalid_pin');
      fresh.value = [...fresh.value, {id: identity.id, public_code: identity.public_code, pin: result.pin}];
      feedback.value = 'teacher.pinRegenerated';
      await refresh(scope);
    });
  }
  function revoke(identity, confirmed) {
    if (!confirmed) return;
    return run(async scope => {
      fresh.value = fresh.value.filter(item => item.id !== identity.id);
      await api(`/api/identities/${encodeURIComponent(identity.id)}/revoke`, {method: 'POST'});
      if (!scope.current()) return;
      feedback.value = 'teacher.credentialsRevoked';
      await refresh(scope);
    });
  }
  function pagehide() {
    // Also scrub back/forward-cache pages, whose JS heap can otherwise survive.
    epoch++; clear(); pending.value = false;
  }
  window.addEventListener('pagehide', pagehide);
  onBeforeUnmount(() => { alive = false; pagehide(); window.removeEventListener('pagehide', pagehide); });
  return {context, tenant, count, additionalCount, fresh, pending, blocked, feedback, identities, unavailable, setContext, create, add, regenerate, revoke};
}
