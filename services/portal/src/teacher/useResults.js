import {computed, onBeforeUnmount, ref, shallowRef} from 'vue';

export function useResults(api, onSessionExpired) {
  const context = shallowRef({teacher: false, group: null, assignment: null, assignments: [], dataReady: false});
  const assignment = computed(() => context.value.assignments.find(item => item.id === context.value.assignment?.id));
  const rows = ref([]), mode = ref('results'), ready = ref(false), loading = ref(false), pending = ref(false), feedback = ref('');
  let epoch = 0, readSequence = 0, alive = true;
  const unavailable = computed(() => !context.value.teacher || !assignment.value || !context.value.dataReady || pending.value);
  function reset() { epoch++; readSequence++; rows.value = []; ready.value = false; loading.value = false; pending.value = false; feedback.value = ''; }
  function setContext(next) {
    const changed = next.teacher !== context.value.teacher || next.group?.id !== context.value.group?.id || next.assignment?.id !== context.value.assignment?.id;
    context.value = next;
    if (changed || (next.dataReady && !assignment.value)) reset();
  }
  function current(version) { return alive && epoch === version && context.value.teacher && assignment.value; }
  function failed(error, saving = false) {
    rows.value = []; ready.value = false;
    if (error.status === 401) { onSessionExpired(); feedback.value = 'teacher.errors.loginFirst'; }
    else feedback.value = [403, 404].includes(error.status) ? 'teacher.assignmentAccessUnavailable' : saving ? 'teacher.resultsSaveError' : 'teacher.resultsLoadError';
  }
  async function load(view = 'results') {
    if (!context.value.teacher || !assignment.value || !context.value.dataReady) return;
    const selected = assignment.value, version = epoch, sequence = ++readSequence;
    mode.value = view; loading.value = true; ready.value = false; rows.value = []; feedback.value = '';
    try {
      const path = view === 'ranking'
        ? '/api/rankings?' + new URLSearchParams({app_id: selected.app_id, activity_id: selected.activity_id, limit: '20'})
        : `/api/teacher/activity-assignments/${encodeURIComponent(selected.id)}/results`;
      const data = await api(path, {method: 'GET'});
      if (!current(version) || sequence !== readSequence) return;
      if (view === 'results' && data.assignment?.id !== selected.id) throw new Error('wrong_assignment');
      const result = view === 'ranking' ? data : data.results;
      if (!Array.isArray(result)) throw new Error('invalid_results');
      rows.value = result; ready.value = true;
    } catch (error) { if (current(version) && sequence === readSequence) failed(error); }
    finally { if (alive && epoch === version && sequence === readSequence) loading.value = false; }
  }
  async function complete(row) {
    if (unavailable.value || loading.value || !ready.value || mode.value !== 'results') return;
    const selected = assignment.value, version = epoch;
    pending.value = true; feedback.value = '';
    try {
      await api(`/api/teacher/activity-assignments/${encodeURIComponent(selected.id)}/students/${encodeURIComponent(row.identity_id)}/complete`, {method: row.completed ? 'DELETE' : 'POST'});
      if (current(version)) await load('results');
    } catch (error) { if (current(version)) failed(error, true); }
    finally { if (alive && epoch === version) pending.value = false; }
  }
  onBeforeUnmount(() => { alive = false; reset(); });
  return {context, assignment, rows, mode, ready, loading, pending, feedback, unavailable, setContext, load, complete};
}
