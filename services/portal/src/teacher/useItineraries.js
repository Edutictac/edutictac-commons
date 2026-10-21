import {computed, onBeforeUnmount, ref, shallowRef} from 'vue';

export function useItineraries(api, onSessionExpired) {
  const context = shallowRef({teacher: false, group: null, assignments: [], assignment: null});
  const itineraries = ref([]), title = ref(''), ready = ref(false), loading = ref(false), pending = ref(false);
  const feedback = ref('');
  let epoch = 0, loadSequence = 0, writeSequence = 0, alive = true;
  const selected = computed(() => itineraries.value.find(item => item.is_selected));
  const unavailable = computed(() => !context.value.teacher || !context.value.group || !ready.value || pending.value);

  function setContext(next) {
    const changed = next.teacher !== context.value.teacher || next.group?.id !== context.value.group?.id;
    context.value = next;
    if (changed) {
      epoch++; loadSequence++; writeSequence++;
      itineraries.value = []; title.value = ''; ready.value = false;
      loading.value = false; pending.value = false; feedback.value = '';
    }
  }
  function current(version) { return alive && version === epoch && context.value.teacher && Boolean(context.value.group); }
  function expired(error) {
    if (error.status !== 401) return false;
    itineraries.value = []; ready.value = false;
    onSessionExpired();
    feedback.value = 'teacher.errors.loginFirst';
    return true;
  }
  async function load() {
    if (!context.value.teacher || !context.value.group) return false;
    const version = epoch, sequence = ++loadSequence, groupId = context.value.group.id;
    ready.value = false; loading.value = true; feedback.value = '';
    try {
      const data = await api(`/api/teacher/itineraries?group_id=${encodeURIComponent(groupId)}`, {method: 'GET'});
      if (!current(version) || sequence !== loadSequence) return false;
      itineraries.value = data.itineraries || []; ready.value = true;
      return true;
    } catch (error) {
      if (current(version) && sequence === loadSequence && !expired(error)) feedback.value = 'teacher.itinerary.loadError';
      return false;
    } finally {
      if (alive && version === epoch && sequence === loadSequence) loading.value = false;
    }
  }
  async function save(path, body) {
    if (unavailable.value) return;
    const version = epoch, sequence = ++writeSequence;
    pending.value = true; feedback.value = '';
    try {
      await api(path, {method: path === '/api/teacher/itineraries' ? 'POST' : 'PUT', body: JSON.stringify(body)});
      if (!current(version) || sequence !== writeSequence) return;
      if (path === '/api/teacher/itineraries') title.value = '';
      await load();
    } catch (error) {
      if (!current(version) || sequence !== writeSequence || expired(error)) return;
      // Refresh collaborators' changes before allowing another write. A failed
      // refresh leaves the old cards visible but disabled until an explicit retry.
      const refreshed = await load();
      if (!current(version) || sequence !== writeSequence) return;
      feedback.value = error.status === 409 && refreshed ? 'teacher.itinerary.conflict' : 'teacher.itinerary.saveError';
    } finally {
      // An older group's completion must not unlock a newer group's write.
      if (alive && version === epoch && sequence === writeSequence) pending.value = false;
    }
  }
  function create() {
    if (!title.value.trim()) { feedback.value = 'teacher.errors.enterItineraryTitle'; return; }
    return save('/api/teacher/itineraries', {title: title.value.trim(), group_id: context.value.group?.id});
  }
  function edit(itinerary, assignmentId, action) {
    const previous = itinerary.items.map(item => item.assignment_id), ids = [...previous];
    const index = ids.indexOf(assignmentId);
    if (index < 0) return;
    if (action === 'remove') ids.splice(index, 1);
    else {
      const target = index + (action === 'up' ? -1 : 1);
      if (target < 0 || target >= ids.length) return;
      [ids[index], ids[target]] = [ids[target], ids[index]];
    }
    return save(`/api/teacher/itineraries/${encodeURIComponent(itinerary.id)}/items`, {assignment_ids: ids, expected_assignment_ids: previous});
  }
  function add(itinerary) {
    const assignmentId = context.value.assignment?.id;
    if (!assignmentId) { feedback.value = 'teacher.errors.selectActivityFirst'; return; }
    const previous = itinerary.items.map(item => item.assignment_id);
    if (previous.includes(assignmentId)) return;
    return save(`/api/teacher/itineraries/${encodeURIComponent(itinerary.id)}/items`, {assignment_ids: [...previous, assignmentId], expected_assignment_ids: previous});
  }
  function select(id) {
    return save(`/api/teacher/groups/${encodeURIComponent(context.value.group?.id)}/itinerary`, {itinerary_id: id, expected_itinerary_id: selected.value?.id || null});
  }
  function assignmentTitle(id) { return context.value.assignments.find(item => item.id === id)?.title || id; }
  onBeforeUnmount(() => { alive = false; epoch++; loadSequence++; writeSequence++; });
  return {context, itineraries, title, ready, loading, pending, feedback, selected, unavailable, setContext, load, create, edit, add, select, assignmentTitle};
}
