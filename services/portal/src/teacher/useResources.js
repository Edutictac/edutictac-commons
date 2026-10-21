import {computed, onBeforeUnmount, ref, shallowRef} from 'vue';
import {resourceAssignment} from './resourceAssignment.js';

export function useResources(api, onSessionExpired, onAssigned) {
  const context = shallowRef({teacher: false, group: null, dataReady: false, resourcesEnabled: true});
  const search = ref(''), rows = ref([]), loaded = ref(false), basket = ref(false), loading = ref(false), pending = ref(false), blocked = ref(false);
  const feedback = ref(''), completedCount = ref(0);
  let epoch = 0, readSequence = 0, alive = true;
  const unavailable = computed(() => !context.value.teacher || !context.value.group || !context.value.dataReady || !context.value.resourcesEnabled || loading.value || pending.value || blocked.value);
  function current(version) { return alive && version === epoch; }
  function setContext(next) {
    if (next.teacher !== context.value.teacher || next.group?.id !== context.value.group?.id || next.resourcesEnabled !== context.value.resourcesEnabled) {
      epoch++; readSequence++; rows.value = []; loaded.value = false; basket.value = false; loading.value = false; blocked.value = false; feedback.value = ''; completedCount.value = 0;
      // A request already sent may still complete for its captured classroom.
      // Keep writes locked until it settles, even after a context change.
    }
    context.value = next;
  }
  async function load(favorites = false) {
    if (!context.value.resourcesEnabled || pending.value || (favorites && !context.value.teacher)) return;
    const version = epoch, sequence = ++readSequence;
    rows.value = []; loaded.value = false; basket.value = favorites; loading.value = true; feedback.value = ''; blocked.value = false; completedCount.value = 0;
    try {
      const query = new URLSearchParams({limit: '24'});
      if (search.value.trim()) query.set('q', search.value.trim());
      const data = await api(favorites ? '/resources-api/teacher/favorites?limit=48' : '/resources-api/resources?' + query, {method: 'GET'});
      if (!current(version) || sequence !== readSequence) return;
      if (!Array.isArray(data.items)) throw new Error('invalid_resources');
      rows.value = data.items; loaded.value = true;
    } catch {
      // Recursos has its own existing session. A favorites failure does not
      // invalidate the Commons teacher session.
      if (current(version) && sequence === readSequence) feedback.value = favorites ? 'teacher.favoritesUnavailable' : 'teacher.resourcesUnavailable';
    } finally { if (current(version) && sequence === readSequence) loading.value = false; }
  }
  async function assign(resource) {
    if (unavailable.value) return;
    const version = epoch, groupId = context.value.group.id, selectedId = context.value.assignment?.id;
    const items = resource ? [resource] : [...rows.value];
    if (!items.length || (!resource && !basket.value)) return;
    // Validate the whole selection before sending its first request.
    let payloads;
    try { payloads = items.map(item => resourceAssignment(item, groupId)); }
    catch { feedback.value = 'teacher.invalidResource'; return; }
    pending.value = true; feedback.value = ''; completedCount.value = 0;
    let lastAssignment = null, mutationError = null;
    try {
      for (let index = 0; index < items.length; index++) {
        if (!current(version)) break;
        const result = await api('/api/teacher/activity-assignments', {method: 'POST', body: JSON.stringify(payloads[index])});
        if (!current(version)) break;
        if (!result.assignment?.id || result.assignment.group_id !== groupId) throw new Error('invalid_assignment');
        lastAssignment = result.assignment; completedCount.value++;
        if (basket.value) rows.value = rows.value.filter(item => item !== items[index]);
      }
    } catch (error) {
      mutationError = error;
      if (current(version)) {
        blocked.value = true;
        if (error.status === 401) { onSessionExpired(); feedback.value = 'teacher.errors.loginFirst'; }
        else feedback.value = 'teacher.resourceAssignmentError';
      }
    }
    try {
      if (current(version) && lastAssignment) {
        await onAssigned({groupId, assignment: lastAssignment, selectedId});
        if (current(version) && !mutationError) feedback.value = 'teacher.basketAssigned';
      }
    } catch (error) {
      if (current(version)) {
        blocked.value = true;
        if (error.status === 401) onSessionExpired();
        feedback.value = 'teacher.resourceRefreshError';
      }
    } finally { if (alive) pending.value = false; }
  }
  onBeforeUnmount(() => { alive = false; epoch++; readSequence++; rows.value = []; });
  return {context, search, rows, loaded, basket, loading, pending, blocked, feedback, completedCount, unavailable, setContext, load, assign};
}
