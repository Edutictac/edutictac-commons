import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import {activityUrl, resourceUrl, returnAfterLogin} from './launch.js';

export const icons = ['🦊','🐱','🐶','🐼','🐧','🐸','🦉','🦄','🐰','🐢','🐙','🦁','🐨','🐝','🐯','🐻','🦕','🦖','🐉','🚀','🌈','⚽️','🏀','🏆','🎮','🎧','📚','🎨'];
export function useStudent(api, onSessionChanged) {
  const identity = ref(null), assignments = ref([]), itinerary = ref(null), modules = ref(null);
  const code = ref(''), pin = ref(''), history = ref(false), ready = ref(false), loading = ref(false), authPending = ref(true), writing = ref(false), feedback = ref('');
  let epoch = 0, reads = 0, authSequence = 0, alive = true;
  const popups = new Set();
  const completed = computed(() => assignments.value.filter(item => item.completed).length);
  const visible = computed(() => history.value ? assignments.value : assignments.value.filter(item => !item.completed));
  const disabled = computed(() => !ready.value || authPending.value || writing.value || loading.value);
  const current = version => alive && epoch === version;
  function clear() {
    epoch++; reads++; identity.value = null; assignments.value = []; itinerary.value = null;
    code.value = ''; pin.value = ''; history.value = false; ready.value = false; loading.value = false;
    for (const popup of popups) popup.close();
    popups.clear();
  }
  function expired() { clear(); feedback.value = 'student.sessionExpired'; onSessionChanged(); }
  function enabled(item) {
    const app = {'edutictac-play':'play', play:'play', eduhoot:'eduhoot', resource:'recursos'}[item.app_id];
    return !app || !modules.value || modules.value.includes(app);
  }
  async function load(initial = false) {
    if (!initial && (!identity.value || authPending.value || writing.value)) return;
    const version = epoch, sequence = ++reads, expected = identity.value?.id;
    loading.value = true; ready.value = false; assignments.value = []; itinerary.value = null; feedback.value = '';
    try {
      const data = await api('/api/student/dashboard', {method:'GET'});
      if (!current(version) || sequence !== reads) return;
      if (!data.identity?.id || (expected && data.identity.id !== expected) || !Array.isArray(data.assignments)) throw new Error('invalid_dashboard');
      identity.value = data.identity; assignments.value = data.assignments; itinerary.value = data.selected_itinerary || null; ready.value = true;
      if (initial) { onSessionChanged(); returnAfterLogin(identity.value); }
    } catch (error) {
      if (!current(version) || sequence !== reads) return;
      if (error.status === 401) {
        if (initial && !expected) { clear(); feedback.value = ''; }
        else expired();
      } else feedback.value = 'student.loadError';
    } finally { if (current(version) && sequence === reads) loading.value = false; }
  }
  async function login() {
    if (authPending.value || writing.value || feedback.value === 'student.logoutError') return;
    const publicCode = code.value.trim().toUpperCase(), enteredPin = pin.value.trim();
    if (!/^[A-Z0-9]{3}$/.test(publicCode) || !/^(?:\d{4}|\d{6})$/.test(enteredPin)) { pin.value = ''; feedback.value = 'student.invalidLogin'; return; }
    clear(); const version = epoch, operation = ++authSequence; authPending.value = true; feedback.value = '';
    try {
      const data = await api('/api/auth/student', {method:'POST', body:JSON.stringify({public_code:publicCode, pin:enteredPin})});
      if (!current(version)) return;
      if (!data.identity?.id) throw new Error('invalid_identity');
      identity.value = data.identity; onSessionChanged();
      if (!returnAfterLogin(identity.value)) await load(true);
    } catch (error) {
      if (current(version)) feedback.value = error.status === 429 ? 'student.tooManyAttempts' : [400,401,422].includes(error.status) ? 'student.invalidLogin' : 'student.loginError';
    } finally { if (alive && operation === authSequence) authPending.value = false; }
  }
  async function logout() {
    if (authPending.value) return;
    clear(); const version = epoch, operation = ++authSequence; authPending.value = true; feedback.value = '';
    // Clear the visible pupil immediately; no stale read or write can restore it.
    try { await api('/api/auth/logout', {method:'POST'}); if (current(version)) feedback.value = 'student.logoutMessage'; }
    catch (error) { if (current(version)) feedback.value = error.status === 401 ? 'student.logoutMessage' : 'student.logoutError'; }
    finally { if (alive && operation === authSequence) { authPending.value = false; onSessionChanged(); } }
  }
  async function icon(value) {
    if (disabled.value || !icons.includes(value)) return;
    const version = epoch; writing.value = true; feedback.value = '';
    try {
      const data = await api('/api/student/profile', {method:'PATCH', body:JSON.stringify({avatar_icon:value})});
      if (!current(version)) return;
      if (data.identity?.id !== identity.value.id) throw new Error('invalid_identity');
      identity.value = data.identity; feedback.value = 'student.iconSaved';
    } catch (error) { if (current(version)) { if (error.status === 401) expired(); else feedback.value = 'student.iconError'; } }
    finally { if (alive) writing.value = false; }
  }
  async function launch(item) {
    if (disabled.value || !enabled(item) || !assignments.value.includes(item)) return;
    const version = epoch, external = item.app_id === 'resource';
    let popup;
    // Reserve the tab during the click, before any awaited network request.
    if (external) {
      popup = window.open('', '_blank');
      if (!popup) { feedback.value = 'student.popupBlocked'; return; }
      popup.opener = null; popups.add(popup);
    }
    writing.value = true; feedback.value = '';
    try {
      const launch = await api('/api/student/launch-token', {method:'POST', body:JSON.stringify({assignment_id:item.id})});
      if (!current(version) || !enabled(item)) return;
      if (!launch.token) throw new Error('invalid_launch');
      if (!external) {
        window.location.assign(activityUrl(item, launch.token, window.i18nPortal.getLang()));
        return;
      }
      let url;
      if (String(item.activity_id).startsWith('teacher-upload:')) {
        url = new URL(`/api/student/activity-assignments/${encodeURIComponent(item.id)}/resource`, window.location.origin);
        url.searchParams.set('launch_token', launch.token); url = url.toString();
      } else {
        url = resourceUrl(item.launch_url);
        if (!url) {
          const data = await api('/resources-api/resources?' + new URLSearchParams({q:item.activity_id, limit:'50'}), {method:'GET'});
          if (!current(version) || !enabled(item)) return;
          const resource = (data.items || []).find(resource => resource.external_id === item.activity_id);
          url = resourceUrl(resource?.play_url || resource?.source_url || resource?.reuse_url || resource?.download_url);
        }
        if (!url) throw new Error('missing_resource');
      }
      if (!current(version) || !enabled(item)) return;
      if (popup.closed) throw new Error('closed_popup');
      popup.location.replace(url); popups.delete(popup); popup = null;
      assignments.value = assignments.value.map(row => row.id === item.id ? {...row, started:true} : row);
    } catch (error) { if (current(version)) { if (error.status === 401) expired(); else feedback.value = 'student.launchError'; } }
    finally { if (popup) { popups.delete(popup); popup.close(); } if (alive) writing.value = false; }
  }
  function pagehide() {
    // Remove the snapshot synchronously as well as clearing reactive state.
    document.getElementById('studentOutput')?.setAttribute('hidden', '');
    clear(); authSequence++; authPending.value = false;
  }
  async function pageshow(event) { if (event.persisted) { const operation = ++authSequence; authPending.value = true; await load(true); if (alive && operation === authSequence) { authPending.value = false; document.getElementById('studentOutput')?.removeAttribute('hidden'); } } }
  const refresh = () => { if (document.visibilityState === 'visible' && identity.value && !authPending.value && !writing.value) load(); };
  onMounted(async () => {
    const operation = ++authSequence;
    window.addEventListener('pagehide', pagehide); window.addEventListener('pageshow', pageshow);
    window.addEventListener('focus', refresh); document.addEventListener('visibilitychange', refresh);
    api('/api/modules/status', {method:'GET'}).then(data => { if (alive && Array.isArray(data.enabled)) modules.value = data.enabled; }).catch(() => {});
    await load(true); if (alive && operation === authSequence) authPending.value = false;
  });
  onBeforeUnmount(() => {
    alive = false; clear(); window.removeEventListener('pagehide', pagehide); window.removeEventListener('pageshow', pageshow);
    window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh);
  });
  return {identity, assignments, itinerary, code, pin, history, ready, loading, authPending, writing, feedback, completed, visible, disabled, enabled, login, logout, load, icon, launch};
}
