const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('edutictac-portal-lang')) localStorage.setItem('edutictac-portal-lang', 'es');
  });
});

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


for (const [lang, heading, disabled] of [
  ['va', 'Activitat supervisada', 'Mòdul desactivat.'],
  ['ca', 'Activitat supervisada', 'Mòdul desactivat.'],
  ['es', 'Actividad supervisada', 'Módulo desactivado.'],
  ['en', 'Supervised activity', 'Module disabled.'],
]) {
  test(`Quiosc conserva l’idioma ${lang} del portal`, async ({ page }) => {
    await page.route('**/api/quiosc/**', route => route.fulfill({json: {mode: 'disabled', rooms: []}}));
    await page.goto('/teacher.html');
    await page.locator(`[data-lang="${lang}"]`).click();
    await page.getByRole('link', {name: 'EduTicTac Quiosc'}).click();
    await expect(page.getByRole('heading', {name: heading, exact: true})).toBeVisible();
    await expect(page.locator('#mode')).toContainText(disabled);
    await expect(page.locator(`[data-lang="${lang}"]`)).toHaveAttribute('aria-current', 'true');
    await page.reload();
    await expect(page.getByRole('heading', {name: heading, exact: true})).toBeVisible();
  });
}

test('Quiosc traduïx estats, avisos i errors al valencià sense perdre la selecció', async ({ page }) => {
  const devices = [{id: 'pc1', label: 'PC 1', state: 'simulation_available', ready: true,
    reason: 'SIMULACIÓN: equipo ficticio; no se consulta Epoptes'}];
  const session = {session: {id: 'abc', mode: 'simulation', created: 1}, devices: [
    {id: 'pc1', label: 'PC 1', state: 'basic_kiosk', updated: 1,
      evidence: {reason: 'Solo quiosco básico supervisado; escritorio y navegación sin aislar'}}]};
  await page.route('**/api/quiosc/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/rooms')) return route.fulfill({json: {mode: 'simulation', rooms: [{id: 'lab', name: 'Aula'}]}});
    if (path.endsWith('/devices')) return route.fulfill({json: {devices}});
    if (path.endsWith('/rooms/lab/sessions')) return route.fulfill({json: {sessions: [session.session]}});
    if (path.endsWith('/refresh')) return route.fulfill({status: 503, json: {detail: 'Epoptes no disponible'}});
    return route.fulfill({json: session});
  });
  await page.goto('/quiosc.html');
  await expect(page.locator('#results')).toContainText('Proceso de Firefox observado');
  await page.locator('input[value=pc1]').check();
  await page.locator('#url').fill('https://example.org/quiz');
  await page.locator('[data-lang=va]').click();
  await expect(page.locator('#mode')).toContainText('SIMULACIÓ');
  await expect(page.locator('#devices')).toContainText('no es consulta Epoptes');
  await expect(page.locator('#results')).toContainText('Procés de Firefox observat');
  await expect(page.locator('#results')).toContainText('escriptori i navegació sense aïllar');
  await expect(page.locator('input[value=pc1]')).toBeChecked();
  await expect(page.locator('#url')).toHaveValue('https://example.org/quiz');
  await expect(page.getByRole('button', {name: 'Restaurar este equip'})).toBeVisible();
  await page.locator('#refresh').click();
  await expect(page.locator('#message')).toContainText('Epoptes o la seua configuració');
  await page.locator('[data-lang=en]').click();
  await expect(page.locator('#message')).toContainText('Epoptes or its configuration');
  await expect(page.locator('#results')).toContainText('Firefox process observed');
});


test('Quiosc detecta el valencià del navegador sense preferència guardada', async ({ browser }) => {
  const context = await browser.newContext({locale: 'ca-ES-valencia'});
  try {
    const page = await context.newPage();
    await page.route('**/api/quiosc/**', route => route.fulfill({json: {mode: 'disabled', rooms: []}}));
    await page.goto('http://127.0.0.1:18082/quiosc.html');
    await expect(page.locator('[data-lang=va]')).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('#mode')).toContainText('Mòdul desactivat.');
    await expect(page.locator('#start')).toHaveText('Iniciar l’activitat supervisada');
  } finally { await context.close(); }
});
