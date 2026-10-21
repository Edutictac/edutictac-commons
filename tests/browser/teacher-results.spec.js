const {test, expect} = require('@playwright/test');

async function dashboard(page) {
  const assignments = ['a', 'b', 'c'].map(id => ({id, title: `Activity ${id}`, app_id: 'play', activity_id: id, group_id: id === 'c' ? 'other' : 'group'}));
  const completed = {a: false, b: false, c: false}, calls = [];
  await page.addInitScript(() => {
    localStorage.setItem('edutictac-portal-lang', 'va');
    localStorage.setItem('edutictac-commons-state', JSON.stringify({group: {id: 'group', group_code: 'Group'}}));
  });
  await page.route('**/api/**', route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname;
    if (path === '/api/teacher/summary') return route.fulfill({json: {groups: [{id: 'group', name: 'Group'}, {id: 'other', name: 'Other'}], active: 1, total: 1}});
    if (path === '/api/teacher/activity-assignments') return route.fulfill({json: {assignments}});
    if (path === '/api/teacher/identities') return route.fulfill({json: {identities: []}});
    if (path === '/api/teacher/itineraries') return route.fulfill({json: {itineraries: []}});
    if (path.endsWith('/results')) {
      const id = path.split('/')[4];
      return route.fulfill({json: {assignment: assignments.find(item => item.id === id), results: [{identity_id: 'pupil:one', public_code: 'Pupil ' + id, attempts: 0, best_score: 0, last_score_at: null, completed: completed[id]}]}});
    }
    if (path.endsWith('/complete')) {
      calls.push({path, method: request.method()});
      completed[path.split('/')[4]] = request.method() === 'POST';
      return route.fulfill({json: {ok: true}});
    }
    if (path === '/api/rankings') { calls.push({path, query: url.searchParams.toString()}); return route.fulfill({json: [{public_code: 'Ranked pupil', score: 95, ts: '2026'}]}); }
    if (path === '/api/setup/status') return route.fulfill({json: {pending: false}});
    if (path === '/api/auth/oidc/status') return route.fulfill({json: {enabled: true}});
    return route.fulfill({status: 401, json: {detail: 'test unauthenticated'}});
  });
  await page.goto('/teacher.html');
  await expect(page.locator('[data-select-assignment=a]')).toBeEnabled();
  await page.locator('[data-select-assignment=a]').click();
  await page.locator('summary').filter({has: page.locator('[data-i18n="teacher.results"]')}).click();
  return calls;
}

test('selecció, resultats, marques manuals, classificació i idioma', async ({page}) => {
  const calls = await dashboard(page);
  await expect(page.locator('[data-select-assignment=a]')).toHaveCount(1);
  await page.locator('#loadResults').click();
  await expect(page.locator('#resultsOutput tbody tr')).toHaveCount(1);
  await expect(page.locator('#resultsOutput tbody td').nth(2)).toHaveText('0');
  await page.locator('[data-mark-completed]').click();
  await expect(page.locator('[data-unmark-completed]')).toBeEnabled();
  await page.locator('[data-unmark-completed]').click();
  await expect(page.locator('[data-mark-completed]')).toBeEnabled();
  expect(calls.filter(call => call.method).map(call => call.method)).toEqual(['POST', 'DELETE']);
  expect(calls[0].path).toContain('/students/pupil%3Aone/complete');
  await page.locator('#loadRanking').click();
  await expect(page.locator('#resultsOutput')).toContainText('Ranked pupil');
  expect(new URLSearchParams(calls.find(call => call.query).query).get('activity_id')).toBe('a');
  await page.locator('[data-lang=es]').click();
  await expect(page.locator('#resultsOutput')).toContainText('Clasificación de la actividad');
  await page.locator('[data-select-assignment=b]').click();
  await expect(page.locator('#resultsOutput tbody tr')).toHaveCount(0);
  await expect(page.locator('[data-select-assignment=b]')).toHaveAttribute('aria-pressed', 'true');
});

for (const status of [200, 401, 503]) {
  test(`una lectura tardana ${status} no canvia la nova activitat`, async ({page}) => {
    await dashboard(page);
    let started, release;
    const requested = new Promise(resolve => {started = resolve;});
    const held = new Promise(resolve => {release = resolve;});
    await page.route('**/api/teacher/activity-assignments/a/results', async route => {
      started(); await held; return status === 200 ? route.fallback() : route.fulfill({status, json: {detail: 'old failure'}});
    });
    await page.locator('#loadResults').click(); await requested;
    await page.locator('[data-select-assignment=b]').click();
    await page.locator('#loadResults').click();
    await expect(page.locator('#resultsOutput')).toContainText('Pupil b');
    const response = page.waitForResponse(value => value.url().endsWith('/a/results'));
    release(); await response;
    await expect(page.locator('#resultsOutput')).toContainText('Pupil b');
    await expect(page.locator('#resultsOutput')).not.toContainText('Pupil a');
    await expect(page.locator('#teacherOidcLogin')).not.toBeVisible();
  });
}

test('una marca antiga no desbloqueja una escriptura posterior', async ({page}) => {
  await dashboard(page);
  let oldStarted, releaseOld, newStarted, releaseNew;
  const oldRequest = new Promise(resolve => {oldStarted = resolve;});
  const heldOld = new Promise(resolve => {releaseOld = resolve;});
  const newRequest = new Promise(resolve => {newStarted = resolve;});
  const heldNew = new Promise(resolve => {releaseNew = resolve;});
  await page.route('**/api/teacher/activity-assignments/a/students/**/complete', async route => {oldStarted(); await heldOld; return route.fallback();});
  await page.route('**/api/teacher/activity-assignments/c/students/**/complete', async route => {newStarted(); await heldNew; return route.fallback();});
  await page.locator('#loadResults').click();
  await page.locator('[data-mark-completed]').click(); await oldRequest;
  await page.locator('[data-select-assignment=c]').click();
  await page.locator('#loadResults').click();
  await page.locator('[data-mark-completed]').click(); await newRequest;
  const response = page.waitForResponse(value => value.url().includes('/a/students/'));
  releaseOld(); await response;
  await expect(page.locator('[data-mark-completed]')).toBeDisabled();
  await expect(page.locator('#resultsOutput')).toContainText('Pupil c');
  releaseNew();
  await expect(page.locator('[data-unmark-completed]')).toBeEnabled();
});

test('un resultat amb identificador diferent no es representa', async ({page}) => {
  await dashboard(page);
  await page.route('**/api/teacher/activity-assignments/a/results', route => route.fulfill({json: {assignment: {id: 'b'}, results: [{public_code: 'Wrong assignment'}]}}));
  await page.locator('#loadResults').click();
  await expect(page.locator('#resultsOutput [role=alert]')).toBeVisible();
  await expect(page.locator('#resultsOutput')).not.toContainText('Wrong assignment');
});

test('resultats amb aparença d’HTML són text i perdre sessió els retira', async ({page}) => {
  await dashboard(page);
  await page.route('**/api/teacher/activity-assignments/a/results', route => route.fulfill({json: {assignment: {id: 'a'}, results: [{identity_id: 'safe', public_code: '<img src=x onerror=alert(1)>', completed: false}]}}));
  await page.locator('#loadResults').click();
  await expect(page.locator('#resultsOutput')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('#resultsOutput img')).toHaveCount(0);
  await page.route('**/api/teacher/activity-assignments/a/results', route => route.fulfill({status: 401, json: {detail: 'session_required'}}));
  await page.locator('#loadResults').click();
  await expect(page.locator('#resultsOutput tbody tr')).toHaveCount(0);
  await expect(page.locator('#teacherOutput tbody tr')).toHaveCount(0);
  await expect(page.locator('#loadResults')).toBeDisabled();
});

test('un error de guardat exigeix recarregar abans de marcar de nou', async ({page}) => {
  await dashboard(page);
  await page.locator('#loadResults').click();
  await page.route('**/api/teacher/activity-assignments/a/students/**/complete', route => route.fulfill({status: 503, json: {detail: 'unavailable'}}));
  await page.locator('[data-mark-completed]').click();
  await expect(page.locator('#resultsOutput [role=alert]')).toBeVisible();
  await expect(page.locator('#resultsOutput tbody tr')).toHaveCount(0);
  await expect(page.locator('#loadResults')).toBeEnabled();
  await page.locator('#loadResults').click();
  await expect(page.locator('[data-mark-completed]')).toBeEnabled();
});
