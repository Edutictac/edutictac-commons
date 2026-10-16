/* Same-origin Commons sessions; translations share the portal preference. */
(() => {
  'use strict';
  const el = id => document.getElementById(id);
  const t = (key, vars) => window.i18nPortal.t(`quiosc.${key}`, vars);
  const locale = () => ({va: 'ca-ES-valencia', ca: 'ca-ES', es: 'es-ES', en: 'en-GB'}[window.i18nPortal.getLang()]);
  const stateLabel = state => {
    const key = `state.${state}`;
    const value = t(key);
    return value === `quiosc.${key}` ? t('state.unknown') : value;
  };
  const reason = value => value ? window.i18nPortal.t(window.quioscReasonKeys[value] || 'quiosc.reason.other') : '';
  let localLauncher = false;
  let busy = false;
  let mode = null;
  let deviceRows = [];
  let sessionRows = [];
  let currentResult = null;
  let messageKey = '';
  function node(tag, text) {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    return n;
  }
  async function api(path, body) {
    const response = await fetch(`/api/quiosc${path}`, {
      credentials: 'same-origin', cache: 'no-store',
      ...(body !== undefined ? {method: 'POST', headers: {'Content-Type': 'application/json', 'X-Quiosc-Request': '1'}, body: JSON.stringify(body)} : {})
    });
    if (!response.ok) {
      const key = `http${response.status}`;
      throw new Error(t(key) === `quiosc.${key}` ? 'requestFailed' : key);
    }
    return response.json();
  }
  function renderMessage() {
    el('message').textContent = !messageKey ? '' : messageKey === 'busy' ? t('busy') : `${t(messageKey)}. ${t(localLauncher ? 'localHint' : 'recoveryHint')}`;
  }
  async function perform(fn) {
    if (busy) return;
    busy = true; messageKey = 'busy'; renderMessage();
    document.querySelectorAll('button:not([data-lang])').forEach(b => { b.disabled = true; });
    try { await fn(); messageKey = ''; }
    catch (error) { messageKey = t(error.message) === `quiosc.${error.message}` ? 'requestFailed' : error.message; }
    finally {
      busy = false; renderMessage();
      document.querySelectorAll('button:not([data-lang])').forEach(b => { b.disabled = false; });
    }
  }
  function roomPath() { return `/rooms/${encodeURIComponent(el('room').value)}`; }
  function sessionPath() {
    if (!el('session').value) throw new Error('chooseSession');
    return `/sessions/${encodeURIComponent(el('session').value)}`;
  }
  function renderSessions(selected = el('session').value) {
    el('session').replaceChildren();
    sessionRows.forEach(s => {
      const option = node('option', `${s.mode === 'simulation' ? t('simulationPrefix') : ''}${new Date(s.created * 1000).toLocaleString(locale())} · ${s.id.slice(0, 8)}`);
      option.value = s.id; el('session').append(option);
    });
    if (selected) el('session').value = selected;
  }
  async function listSessions(selected) {
    const result = await api(`${roomPath()}/sessions`);
    sessionRows = result.sessions; renderSessions(selected || '');
    if (el('session').value) render(await api(sessionPath()));
    else { currentResult = null; el('results').replaceChildren(); }
  }
  function render(result) {
    currentResult = result;
    const root = el('results'); root.replaceChildren();
    result.devices.forEach(d => {
      const row = node('p');
      row.append(node('strong', `${d.label}: `), node('span', stateLabel(d.state)),
        node('small', ` · ${t('observed', {time: new Date(d.updated * 1000).toLocaleTimeString(locale())})} · ${reason(d.evidence.reason)} `));
      if (!['finished', 'simulation_finished'].includes(d.state)) {
        const restore = node('button', t('restore')); restore.type = 'button'; restore.disabled = busy;
        restore.addEventListener('click', () => perform(async () => render(await api(`${sessionPath()}/stop`, {device_id: d.id}))));
        row.append(restore);
      }
      root.append(row);
    });
  }
  function renderDevices() {
    const selected = new Set(Array.from(document.querySelectorAll('input[name=device]:checked'), c => c.value));
    el('devices').replaceChildren();
    deviceRows.forEach(d => {
      const row = node('p'); const label = node('label'); const check = node('input');
      check.type = 'checkbox'; check.value = d.id; check.name = 'device'; check.disabled = !d.ready;
      check.checked = selected.has(d.id) && d.ready;
      label.append(check, document.createTextNode(` ${d.label || d.id} · ${stateLabel(d.state)} · ${reason(d.reason)}`));
      row.append(label); el('devices').append(row);
    });
  }
  async function discover() {
    const result = await api(`${roomPath()}/devices`);
    deviceRows = result.devices;
    el('devices').replaceChildren(); el('all').checked = false;
    renderDevices(); await listSessions();
  }
  function renderMode() {
    // This is dynamic after the initial placeholder, not a static translation.
    el('mode').removeAttribute('data-i18n');
    el('mode').textContent = t(mode === 'real' ? 'real' : mode === 'simulation' ? 'simulation' : mode === 'disabled' ? 'disabled' : 'checking');
  }
  window.addEventListener('edutictac:langchange', () => {
    renderMode(); renderMessage(); renderDevices(); renderSessions();
    if (currentResult) render(currentResult);
  });
  el('discover').addEventListener('click', () => perform(discover));
  el('room').addEventListener('change', () => perform(discover));
  el('session').addEventListener('change', () => perform(async () => render(await api(sessionPath()))));
  el('all').addEventListener('change', () => document.querySelectorAll('input[name=device]:enabled').forEach(c => { c.checked = el('all').checked; }));
  el('refresh').addEventListener('click', () => perform(async () => render(await api(`${sessionPath()}/refresh`, {}))));
  el('stop').addEventListener('click', () => perform(async () => render(await api(`${sessionPath()}/stop`, {}))));
  el('exam').addEventListener('submit', event => {
    event.preventDefault();
    perform(async () => {
      const devices = Array.from(document.querySelectorAll('input[name=device]:checked:enabled'), c => c.value);
      if (!devices.length) throw new Error('chooseDevices');
      const result = await api('/sessions', {room_id: el('room').value, devices, url: el('url').value, seconds: Number(el('minutes').value) * 60});
      await listSessions(result.session.id); render(result);
    });
  });
  perform(async () => {
    const access = await api('/access').catch(() => null);
    localLauncher = access?.local_launcher === true;
    el('localAccess').hidden = !localLauncher;
    const value = await api('/rooms'); mode = value.mode; renderMode();
    value.rooms.forEach(r => { const option = node('option', r.name); option.value = r.id; el('room').append(option); });
    if (value.rooms.length) await discover();
  });
})();
