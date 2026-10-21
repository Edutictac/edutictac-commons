const { test, expect } = require('@playwright/test');

async function editor(page, { conflict = false, selection = false, selectionConflict = false, twoGroups = false } = {}) {
  let items = ['a', 'b', 'c'];
  let selected = 'journey';
  const updates = [];
  await page.addInitScript(() => {
    localStorage.setItem('edutictac-portal-lang', 'va');
    localStorage.setItem('edutictac-commons-state', JSON.stringify({ group: { id: 'group', group_code: 'GTEST' } }));
  });
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/teacher/summary') return route.fulfill({ json: { groups: [
      { id: 'group', name: 'GTEST', tenant_id: 'test', active: 1 },
      ...(twoGroups ? [{ id: 'other', name: 'GOTHER', tenant_id: 'test', active: 1 }] : []),
    ], active: 1, total: 1 } });
    if (path === '/api/teacher/activity-assignments') return route.fulfill({ json: { assignments: ['a', 'b', 'c'].map((id) => ({ id, title: `Activity ${id}`, group_id: 'group', app_id: 'play', activity_id: id })) } });
    if (path === '/api/teacher/identities') return route.fulfill({ json: { identities: [] } });
    if (path === '/api/teacher/itineraries' && new URL(route.request().url()).searchParams.get('group_id') === 'other') {
      return route.fulfill({ json: { itineraries: [{ id: 'other-journey', title: 'Other science', group_id: 'other', items: [] }] } });
    }
    if (path === '/api/teacher/itineraries') return route.fulfill({ json: { itineraries: [
      { id: 'journey', title: 'Science', group_id: 'group', is_selected: selected === 'journey', items: items.map((assignment_id, position) => ({ assignment_id, position })) },
      ...(selection ? [{ id: 'reading', title: 'Reading', group_id: 'group', is_selected: selected === 'reading', items: [] }] : []),
    ] } });
    if (path === '/api/teacher/groups/group/itinerary') {
      const body = route.request().postDataJSON();
      updates.push(body);
      if (selectionConflict) {
        selected = 'reading';
        return route.fulfill({ status: 409, json: { detail: 'selection changed' } });
      }
      selected = body.itinerary_id;
      return route.fulfill({ json: { selected_itinerary_id: selected } });
    }
    if (path === '/api/teacher/itineraries/journey/items') {
      const body = route.request().postDataJSON();
      updates.push(body);
      if (conflict) {
        items = ['c', 'b', 'a'];
        return route.fulfill({ status: 409, json: { detail: 'itinerary changed' } });
      }
      items = body.assignment_ids;
      return route.fulfill({ json: { itinerary: { id: 'journey' } } });
    }
    if (path === '/api/setup/status') return route.fulfill({ json: { pending: false } });
    if (path === '/api/auth/oidc/status') return route.fulfill({ json: { enabled: true } });
    return route.fulfill({ status: 401, json: { detail: 'test unauthenticated' } });
  });
  await page.goto('/teacher.html');
  await page.locator('summary').filter({ has: page.locator('[data-i18n="teacher.itineraries"]') }).click();
  await expect(page.locator('#itinerariesOutput li')).toHaveCount(3);
  return updates;
}

test('el docent reordena i lleva passos, també en mòbil', async ({ page }) => {
  const updates = await editor(page);
  const output = page.locator('#itinerariesOutput');
  await expect(output.getByRole('button', { name: 'Pujar: Activity a', exact: true })).toBeDisabled();
  await expect(output.getByRole('button', { name: 'Baixar: Activity c', exact: true })).toBeDisabled();
  await output.getByRole('button', { name: 'Pujar: Activity b', exact: true }).click();
  await expect(output.locator('li > span')).toHaveText(['Activity b', 'Activity a', 'Activity c']);
  expect(updates[0]).toEqual({ assignment_ids: ['b', 'a', 'c'], expected_assignment_ids: ['a', 'b', 'c'] });
  await output.getByRole('button', { name: 'Baixar: Activity a', exact: true }).click();
  await expect(output.locator('li > span')).toHaveText(['Activity b', 'Activity c', 'Activity a']);
  await output.getByRole('button', { name: 'Llevar de l’itinerari: Activity c', exact: true }).click();
  await expect(output.locator('li > span')).toHaveText(['Activity b', 'Activity a']);
  await expect(output).toContainText('conserva l’activitat assignada');
  await page.locator('[data-lang="en"]').click();
  await expect(output.getByRole('button', { name: 'Move down: Activity b', exact: true })).toBeVisible();
});

test('un canvi simultani recarrega el recorregut i avisa sense sobreescriure', async ({ page }) => {
  await editor(page, { conflict: true });
  const output = page.locator('#itinerariesOutput');
  await output.getByRole('button', { name: 'Pujar: Activity b', exact: true }).click();
  await expect(output.getByRole('alert')).toContainText('Un altre docent');
  await expect(output.locator('li > span')).toHaveText(['Activity c', 'Activity b', 'Activity a']);
  await expect(output.getByRole('button', { name: 'Pujar: Activity b', exact: true })).toBeEnabled();
});

test('selecció i retirada del recorregut actiu del grup', async ({ page }) => {
  const updates = await editor(page, { selection: true });
  const output = page.locator('#itinerariesOutput');
  const science = output.locator('article').filter({ has: page.getByText('Science', { exact: true }) });
  const reading = output.locator('article').filter({ has: page.getByText('Reading', { exact: true }) });
  // Full itinerary cards must not inherit the narrow credential/PIN columns.
  await expect.poll(async () => (await science.boundingBox())?.width || 0).toBeGreaterThan(200);
  await expect(science.getByRole('status')).toHaveText('Actiu per a l’alumnat');
  await output.getByRole('button', { name: 'Usar amb l’alumnat: Reading', exact: true }).click();
  await expect(reading.getByRole('status')).toHaveText('Actiu per a l’alumnat');
  await expect(science.getByRole('status')).toHaveCount(0);
  expect(updates[0]).toEqual({ itinerary_id: 'reading', expected_itinerary_id: 'journey' });
  await output.getByRole('button', { name: 'Deixar sense itinerari actiu', exact: true }).click();
  await expect(output.getByRole('status')).toHaveCount(0);
  await expect(output).toContainText('No hi ha cap itinerari actiu');
  expect(updates[1]).toEqual({ itinerary_id: null, expected_itinerary_id: 'reading' });
  await page.locator('[data-lang="en"]').click();
  await output.getByRole('button', { name: 'Use with students: Science', exact: true }).click();
  await expect(science.getByRole('status')).toHaveText('Active for students');
});

test('la selecció concurrent es recarrega sense perdre la del company', async ({ page }) => {
  await editor(page, { selection: true, selectionConflict: true });
  const output = page.locator('#itinerariesOutput');
  await output.getByRole('button', { name: 'Deixar sense itinerari actiu', exact: true }).click();
  await expect(output.getByRole('alert')).toContainText('Un altre docent');
  await expect(output.locator('article').filter({ has: page.getByText('Reading', { exact: true }) }).getByRole('status')).toBeVisible();
});

test('l’alumnat veu el títol traduït sense interpretar HTML i conserva l’historial', async ({ page }) => {
  let selected = { id: 'journey', title: '<img src=x> Science' };
  const identity = { id: 'pupil', public_code: 'ABC' };
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/auth/me') return route.fulfill({ json: { identity } });
    if (path === '/api/student/dashboard') return route.fulfill({ json: {
      identity, selected_itinerary: selected,
      assignments: [{ id: 'a', title: 'Finished', app_id: 'play', activity_id: 'a', completed: true }],
    } });
    return route.fulfill({ status: 401, json: { detail: 'test unauthenticated' } });
  });
  await page.goto('/student.html');
  for (const [lang, prefix] of [['ca', 'Itinerari'], ['va', 'Itinerari'], ['es', 'Itinerario'], ['en', 'Itinerary']]) {
    await page.locator(`[data-lang="${lang}"]`).click();
    await expect(page.locator('[data-student-itinerary]')).toHaveText(`${prefix}: <img src=x> Science`);
    await expect(page.locator('[data-student-itinerary] img')).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'Show history', exact: true }).click();
  await expect(page.getByText('Finished', { exact: true })).toBeVisible();
  await expect(page.locator('[data-student-itinerary]')).toBeVisible();
  selected = null;
  await page.reload();
  await expect(page.locator('.student-profile')).toBeVisible();
  await expect(page.locator('[data-student-itinerary]')).toHaveCount(0);
});

test('un error de xarxa bloqueja dades obsoletes fins que es poden recarregar', async ({ page }) => {
  await editor(page);
  let offline = true;
  await page.route(/\/api\/teacher\/itineraries(?:[/?]|$)/, (route) => {
    if (offline) return route.fulfill({ status: 503, json: { detail: 'unavailable' } });
    return route.fallback();
  });
  const output = page.locator('#itinerariesOutput');
  await output.getByRole('button', { name: 'Pujar: Activity b', exact: true }).click();
  await expect(output.getByRole('alert')).toBeVisible();
  await expect(output.getByRole('button', { name: 'Pujar: Activity b', exact: true })).toBeDisabled();
  await expect(page.locator('#loadItineraries')).toBeEnabled();
  offline = false;
  await page.locator('#loadItineraries').click();
  await expect(output.getByRole('button', { name: 'Pujar: Activity b', exact: true })).toBeEnabled();
  await output.getByRole('button', { name: 'Pujar: Activity b', exact: true }).click();
  await expect(output.locator('li > span')).toHaveText(['Activity b', 'Activity a', 'Activity c']);
});

test('afegir una activitat usa el mateix guardat atòmic que reordenar', async ({ page }) => {
  const updates = await editor(page);
  const output = page.locator('#itinerariesOutput');
  await output.getByRole('button', { name: 'Llevar de l’itinerari: Activity c', exact: true }).click();
  await expect(output.locator('li')).toHaveCount(2);
  await page.locator('[data-select-assignment="c"]').click();
  await expect(output.locator('[data-add-itinerary-item]')).toBeVisible();
  await output.locator('[data-add-itinerary-item]').click();
  await expect(output.locator('li > span')).toHaveText(['Activity a', 'Activity b', 'Activity c']);
  expect(updates[1]).toEqual({ assignment_ids: ['a', 'b', 'c'], expected_assignment_ids: ['a', 'b'] });
});

for (const status of [200, 503]) {
test(`una resposta tardana ${status} no substituïx els itineraris del grup nou`, async ({ page }) => {
  await editor(page, { twoGroups: true });
  let release;
  let started;
  const held = new Promise((resolve) => { release = resolve; });
  const requested = new Promise((resolve) => { started = resolve; });
  await page.route('**/api/teacher/itineraries?group_id=group', async (route) => {
    started();
    await held;
    await route.fulfill({ status, json: { itineraries: [{ id: 'late', title: 'Old group response', group_id: 'group', items: [] }] } });
  });
  await page.locator('#loadItineraries').click();
  await requested;
  await page.locator('[data-select-group="other"]').click();
  await expect(page.locator('#itinerariesOutput')).toContainText('Other science');
  const response = page.waitForResponse((value) => value.url().endsWith('/api/teacher/itineraries?group_id=group'));
  release();
  await response;
  await expect(page.locator('#itinerariesOutput')).toContainText('Other science');
  await expect(page.getByText('Old group response', { exact: true })).toHaveCount(0);
});
}

test('crear amb Enter conserva el títol com a text i canviar idioma conserva l’esborrany', async ({page}) => {
  await editor(page);
  const title = '<img src=x onerror=alert(1)> Un camí';
  let body;
  await page.route('**/api/teacher/itineraries', async route => {
    if (route.request().method() !== 'POST') return route.fallback();
    body = route.request().postDataJSON();
    return route.fulfill({json: {itinerary: {id: 'created'}}});
  });
  await page.route('**/api/teacher/itineraries?group_id=group', route => route.fulfill({json: {itineraries: [{id: 'created', title, group_id: 'group', items: []}]}}));
  await page.locator('#itineraryTitle').fill(title);
  await page.locator('#itineraryTitle').press('Enter');
  await expect(page.locator('#itinerariesOutput strong')).toHaveText(title);
  expect(body).toEqual({title, group_id: 'group'});
  await expect(page.locator('#itineraryTitle')).toHaveValue('');
  expect(await page.locator('#itinerariesOutput img').count()).toBe(0);
  await page.locator('#itineraryTitle').fill('Següent recorregut');
  await page.locator('[data-lang=en]').click();
  await expect(page.locator('#createItinerary')).toHaveText('Create itinerary');
  await expect(page.locator('#itineraryTitle')).toHaveValue('Següent recorregut');
});

test('perdre sessió lleva els itineraris i desactiva l’edició', async ({page}) => {
  await editor(page);
  await page.route('**/api/teacher/itineraries?group_id=group', route => route.fulfill({status: 401, json: {detail: 'session_required'}}));
  await page.locator('#loadItineraries').click();
  await expect(page.locator('#itinerariesOutput article')).toHaveCount(0);
  await expect(page.locator('#itinerariesOutput [role=alert]')).toBeVisible();
  await expect(page.locator('#createItinerary')).toBeDisabled();
  await expect(page.locator('#loadItineraries')).toBeDisabled();
  await expect(page.locator('#teacherOidcLogin')).toBeVisible();
});

for (const status of [200, 409, 401]) {
  test(`un guardat antic ${status} no desbloqueja ni altera el guardat del grup nou`, async ({page}) => {
    await editor(page, {twoGroups: true});
    let oldStarted, releaseOld, newStarted, releaseNew;
    const oldRequest = new Promise(resolve => {oldStarted = resolve;});
    const heldOld = new Promise(resolve => {releaseOld = resolve;});
    const newRequest = new Promise(resolve => {newStarted = resolve;});
    const heldNew = new Promise(resolve => {releaseNew = resolve;});
    await page.route('**/api/teacher/itineraries/journey/items', async route => {
      oldStarted(); await heldOld;
      return route.fulfill({status, json: status === 200 ? {itinerary: {id: 'journey'}} : {detail: 'old write rejected'}});
    });
    await page.route('**/api/teacher/groups/other/itinerary', async route => {
      newStarted(); await heldNew;
      return route.fulfill({json: {selected_itinerary_id: 'other-journey'}});
    });
    await page.getByRole('button', {name: 'Pujar: Activity b', exact: true}).click();
    await oldRequest;
    await page.locator('[data-select-group=other]').click();
    const select = page.getByRole('button', {name: 'Usar amb l’alumnat: Other science', exact: true});
    await select.click();
    await newRequest;
    const response = page.waitForResponse(value => value.url().endsWith('/itineraries/journey/items'));
    releaseOld(); await response;
    await expect(select).toBeDisabled();
    await expect(page.locator('#itinerariesOutput [role=alert]')).toHaveCount(0);
    await expect(page.locator('#teacherOidcLogin')).not.toBeVisible();
    releaseNew();
    await expect(select).toBeEnabled();
    await expect(page.locator('#itinerariesOutput')).toContainText('Other science');
    await expect(page.locator('#itinerariesOutput')).not.toContainText('Science');
  });
}

test('si no arriba el mòdul d’itineraris, la resta del tauler continua disponible', async ({page}) => {
  await page.route('**/assets/teacher-itineraries.js', route => route.fulfill({status: 503, body: ''}));
  await page.route('**/api/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/teacher/summary') return route.fulfill({json: {groups: [], active: 0, total: 0}});
    if (path === '/api/teacher/activity-assignments') return route.fulfill({json: {assignments: []}});
    if (path === '/api/teacher/identities') return route.fulfill({json: {identities: []}});
    if (path === '/api/setup/status') return route.fulfill({json: {pending: false}});
    return route.fulfill({status: 401, json: {detail: 'test unauthenticated'}});
  });
  await page.goto('/teacher.html');
  await page.locator('summary').filter({has: page.locator('[data-i18n="teacher.itineraries"]')}).click();
  await page.locator('[data-lang=es]').click();
  await expect(page.locator('#itinerariesPanel')).toContainText('Recarga la página');
  await expect(page.locator('#refreshDashboard')).toBeEnabled();
  await expect(page.locator('#teacherOidcLogin')).not.toBeVisible();
  await page.locator('#refreshDashboard').click();
  await expect(page.locator('#teacherOutput')).toBeVisible();
});
