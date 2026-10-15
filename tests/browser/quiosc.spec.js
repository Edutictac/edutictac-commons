const { test, expect } = require('@playwright/test');

test('Quiosc distingue simulación, selecciona equipos y permite recuperación individual', async ({ page }) => {
  const devices = [
    {id: 'pc1', label: 'Equipo <01>', state: 'simulation_available', ready: true},
    {id: 'pc2', label: 'Equipo 02', state: 'unknown', ready: false}
  ];
  let session = null;
  let started = null;
  await page.route('**/api/quiosc/**', async route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    let data;
    if (path.endsWith('/rooms')) data = {mode: 'simulation', rooms: [{id: 'lab', name: 'Aula'}]};
    else if (path.endsWith('/devices')) data = {mode: 'simulation', devices};
    else if (path.endsWith('/rooms/lab/sessions')) data = {sessions: session ? [session.session] : []};
    else if (request.method() === 'POST' && path === '/api/quiosc/sessions') {
      started = request.postDataJSON();
      expect(request.headers()['x-quiosc-request']).toBe('1');
      session = {session: {id: 'abc', mode: 'simulation', created: 1}, devices: [{id: 'pc1', label: 'Equipo <01>', state: 'simulation_running', updated: 1, evidence: {reason: 'SIMULACIÓN'}}]};
      data = session;
    } else if (path.endsWith('/stop')) {
      expect(request.postDataJSON()).toEqual({device_id: 'pc1'});
      session.devices[0].state = 'simulation_finished'; data = session;
    } else data = session;
    await route.fulfill({json: data});
  });
  await page.goto('/quiosc.html');
  await expect(page.locator('#mode')).toContainText('SIMULACIÓN');
  await expect(page.getByText('No bloquea el escritorio', {exact: false})).toBeVisible();
  await expect(page.locator('input[value=pc2]')).toBeDisabled();
  await page.locator('#all').check();
  await page.locator('#url').fill('https://example.org/quiz?id=1');
  await page.locator('#exam button').click();
  await expect(page.locator('#results')).toContainText('SIMULACIÓN: actividad ficticia');
  expect(started.devices).toEqual(['pc1']);
  await page.getByRole('button', {name: 'Restaurar este equipo'}).click();
  await expect(page.locator('#results')).toContainText('SIMULACIÓN: finalizado ficticio');
  await expect(page.locator('#results strong')).toHaveText('Equipo <01>: ');
});

test('Quiosc informa de la falta de autenticación docente', async ({ page }) => {
  await page.route('**/api/quiosc/**', route => route.fulfill({status: 401, json: {detail: 'teacher authentication required'}}));
  await page.goto('/quiosc.html');
  await expect(page.locator('#message')).toContainText('entra desde el panel docente');
});
