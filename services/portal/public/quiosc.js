/* Same-origin Commons session cookies; no credentials or command text stored. */
(() => {
  'use strict';
  const el = id => document.getElementById(id);
  const labels = {
    available: 'Disponible: quiosco básico compatible', incompatible: 'No compatible',
    starting: 'Iniciando; sin confirmación de navegador', basic_kiosk: 'Proceso de Firefox observado (quiosco básico)',
    restoring: 'Restaurando: cerrando procesos propios y retirando perfil',
    error: 'Error; revisar y recuperar', unknown: 'Desconectado o estado desconocido',
    finished: 'Finalizado; perfil temporal retirado', simulation_available: 'SIMULACIÓN: disponible ficticio',
    simulation_running: 'SIMULACIÓN: actividad ficticia', simulation_finished: 'SIMULACIÓN: finalizado ficticio'
  };
  let busy = false;
  let mode = 'disabled';
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
    const value = await response.json();
    if (!response.ok) throw new Error(typeof value.detail === 'string' ? value.detail : 'Solicitud no válida');
    return value;
  }
  async function perform(fn) {
    if (busy) return;
    busy = true;
    el('message').textContent = 'Consultando… Puede tardar según el número de equipos.';
    document.querySelectorAll('button').forEach(b => { b.disabled = true; });
    try { await fn(); el('message').textContent = ''; }
    catch (error) { el('message').textContent = `${error.message}. Si falta la sesión docente, entra desde el panel docente. Ante un corte, consulta las sesiones antes de volver a iniciar.`; }
    finally { busy = false; document.querySelectorAll('button').forEach(b => { b.disabled = false; }); }
  }
  function roomPath() { return `/rooms/${encodeURIComponent(el('room').value)}`; }
  function sessionPath() {
    if (!el('session').value) throw new Error('Selecciona una sesión');
    return `/sessions/${encodeURIComponent(el('session').value)}`;
  }
  async function listSessions(selected) {
    const result = await api(`${roomPath()}/sessions`);
    const select = el('session');
    select.replaceChildren();
    result.sessions.forEach(s => {
      const option = node('option', `${s.mode === 'simulation' ? 'SIMULACIÓN · ' : ''}${new Date(s.created * 1000).toLocaleString()} · ${s.id.slice(0, 8)}`);
      option.value = s.id; select.append(option);
    });
    if (selected) select.value = selected;
    if (select.value) render(await api(sessionPath()));
    else el('results').replaceChildren();
  }
  function render(result) {
    const root = el('results'); root.replaceChildren();
    result.devices.forEach(d => {
      const row = node('p');
      row.append(node('strong', `${d.label}: `), node('span', labels[d.state] || d.state),
        node('small', ` · Observado ${new Date(d.updated * 1000).toLocaleTimeString()} · ${d.evidence.reason || ''} `));
      if (!['finished', 'simulation_finished'].includes(d.state)) {
        const restore = node('button', 'Restaurar este equipo'); restore.type = 'button';
        restore.addEventListener('click', () => perform(async () => render(await api(`${sessionPath()}/stop`, {device_id: d.id}))));
        row.append(restore);
      }
      root.append(row);
    });
  }
  async function discover() {
    const result = await api(`${roomPath()}/devices`);
    el('devices').replaceChildren(); el('all').checked = false;
    result.devices.forEach(d => {
      const row = node('p'); const label = node('label'); const check = node('input');
      check.type = 'checkbox'; check.value = d.id; check.name = 'device'; check.disabled = !d.ready;
      label.append(check, document.createTextNode(` ${d.label || d.id} · ${labels[d.state] || d.state} · ${d.reason || ''}`));
      row.append(label); el('devices').append(row);
    });
    await listSessions();
  }
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
      if (!devices.length) throw new Error('Selecciona al menos un equipo preparado');
      const result = await api('/sessions', {room_id: el('room').value, devices, url: el('url').value, seconds: Number(el('minutes').value) * 60});
      await listSessions(result.session.id); render(result);
    });
  });
  perform(async () => {
    const value = await api('/rooms'); mode = value.mode;
    el('mode').textContent = mode === 'real' ? 'EJECUCIÓN REAL · Solo quiosco básico supervisado' : mode === 'simulation' ? 'SIMULACIÓN · No se conecta a equipos ni aplica restricciones' : 'Módulo desactivado. La administración debe configurar las aulas y la conexión Epoptes.';
    value.rooms.forEach(r => { const option = node('option', r.name); option.value = r.id; el('room').append(option); });
    if (value.rooms.length) await discover();
  });
})();
