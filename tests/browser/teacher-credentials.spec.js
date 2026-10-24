const {chooseLanguage} = require('./helpers/language');
const {test, expect} = require('@playwright/test');
const fs = require('node:fs/promises');

// All identities and PINs in this file are synthetic, never installed accounts.
const SAMPLE_PIN = '0246', ROTATED_PIN = '1357';
async function dashboard(page) {
  let groups = ['a', 'b'];
  const calls = [];
  let identities = [{id: 'first', public_code: 'FIRST', group_id: 'a', active: true}, {id: 'other', public_code: 'OTHER', group_id: 'b', active: true}];
  await page.addInitScript(() => {
    if (!localStorage.getItem('edutictac-portal-lang')) localStorage.setItem('edutictac-portal-lang', 'va');
    if (!localStorage.getItem('edutictac-commons-state')) localStorage.setItem('edutictac-commons-state', JSON.stringify({group: {id: 'a', group_code: 'Aula a'}}));
    window.print = () => { window.__printed = true; };
  });
  await page.route('**/api/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname;
    if (request.method() === 'POST') calls.push({path, body: request.postData() ? request.postDataJSON() : null});
    if (path === '/api/teacher/summary') return route.fulfill({json: {groups: groups.map(id => ({id, name: `Aula ${id}`, tenant_id: 'centre', active: 1})), active: identities.length, total: identities.length}});
    if (path === '/api/teacher/identities') return route.fulfill({json: {identities}});
    if (path === '/api/teacher/activity-assignments') return route.fulfill({json: {assignments: []}});
    if (path === '/api/teacher/itineraries') return route.fulfill({json: {itineraries: []}});
    if (path === '/api/identities/batch' || path.endsWith('/identities')) {
      const group = path === '/api/identities/batch' ? 'created' : path.split('/')[4];
      if (!groups.includes(group)) groups.push(group);
      const item = {id: 'new-' + identities.length, public_code: 'NEW' + identities.length, group_id: group, active: true};
      identities.push(item);
      return route.fulfill({status: 201, json: {group: {id: group, group_code: 'Aula ' + group, tenant_id: 'centre'}, identities: [{...item, pin: SAMPLE_PIN}]}});
    }
    if (path.endsWith('/regenerate-pin')) return route.fulfill({json: {id: path.split('/')[3], pin: ROTATED_PIN}});
    if (path.endsWith('/revoke')) { identities = identities.filter(item => item.id !== path.split('/')[3]); return route.fulfill({json: {ok: true}}); }
    if (path === '/api/teacher/logout') return route.fulfill({json: {ok: true}});
    if (path === '/api/setup/status') return route.fulfill({json: {pending: false}});
    if (path === '/api/auth/oidc/status') return route.fulfill({json: {enabled: true}});
    return route.fulfill({status: 401, json: {detail: 'test unauthenticated'}});
  });
  await page.goto('/teacher.html');
  await expect(page.locator('#credentialsOutput tbody tr')).toHaveCount(1);
  return calls;
}
async function create(page) {
  await page.locator('#identityCount').fill('1');
  await page.locator('#identityCount').press('Enter');
  await expect(page.locator('#freshCredentials .credential')).toHaveCount(1);
  await expect(page.locator('#createBatch')).toBeEnabled();
}
async function storageHasPins(page) {
  return page.evaluate(pins => {
    const stored = JSON.stringify({local: {...localStorage}, session: {...sessionStorage}});
    return pins.some(pin => stored.includes(pin));
  }, [SAMPLE_PIN, ROTATED_PIN]);
}

test('la etiqueta opcional de l’aula arriba a l’API', async ({page}) => {
  const calls = await dashboard(page);
  await page.locator('#groupLabel').fill('3r A · Ciències');
  await page.locator('#identityCount').fill('1');
  await page.locator('#identityCount').press('Enter');
  await expect(page.locator('#freshCredentials .credential')).toHaveCount(1);
  expect(calls.find(call => call.path === '/api/identities/batch').body).toMatchObject({label: '3r A · Ciències'});
});

test('crear aula, CSV explícit amb PIN i recàrrega sense credencials recuperables', async ({page}) => {
  const calls = await dashboard(page);
  await create(page);
  expect(calls.find(call => call.path === '/api/identities/batch').body).toEqual({tenant_id: 'centre', label: '', count: 1, pin_length: 4});
  await expect(page.locator('[data-select-group=created]')).toHaveAttribute('aria-pressed', 'true');
  expect(await storageHasPins(page)).toBe(false);
  expect(await page.evaluate(async () => (await indexedDB.databases()).length)).toBe(0);
  const downloadEvent = page.waitForEvent('download');
  await page.locator('[data-download-batch-csv]').click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toMatch(/\.csv$/);
  expect((await fs.readFile(await download.path(), 'utf8')).includes(SAMPLE_PIN)).toBe(true);
  await chooseLanguage(page,'es');
  await expect(page.locator('#freshCredentials')).toContainText('desaparecen al recargar');
  await expect(page.locator('#freshCredentials .credential')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('[data-select-group=created]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#credentialsOutput tbody tr')).toHaveCount(1);
  await expect(page.locator('#freshCredentials')).toHaveCount(0);
  expect(await storageHasPins(page)).toBe(false);
});

test('afegir identitats, rotar PIN i revocar sense conservar un PIN anterior', async ({page}) => {
  await dashboard(page);
  await page.locator('#additionalIdentityCount').fill('1');
  await page.locator('#additionalIdentityCount').press('Enter');
  await expect(page.locator('#freshCredentials .credential')).toHaveCount(1);
  await expect(page.locator('#credentialsOutput tbody tr')).toHaveCount(2);
  await page.locator('[data-regenerate-pin=new-2]').click();
  await expect(page.locator('#freshCredentials')).toContainText(ROTATED_PIN);
  await expect(page.locator('#freshCredentials')).not.toContainText(SAMPLE_PIN);
  page.on('dialog', dialog => dialog.accept());
  await page.locator('[data-revoke-identity=new-2]').click();
  await expect(page.locator('#credentialsOutput tbody tr')).toHaveCount(1);
  await expect(page.locator('#freshCredentials')).toHaveCount(0);
});

test('canviar grup i perdre sessió lleven els PIN de pantalla', async ({page}) => {
  await dashboard(page); await create(page);
  await page.locator('[data-select-group=a]').click();
  await expect(page.locator('#freshCredentials')).toHaveCount(0);
  await page.locator('[data-regenerate-pin=first]').click();
  await expect(page.locator('#freshCredentials')).toContainText(ROTATED_PIN);
  await page.route('**/api/identities/first/regenerate-pin', route => route.fulfill({status: 401, json: {detail: 'session_required'}}));
  await page.locator('[data-regenerate-pin=first]').click();
  await expect(page.locator('#freshCredentials')).toHaveCount(0);
  await expect(page.locator('#credentialsOutput tbody tr')).toHaveCount(0);
  await expect(page.locator('#createBatch')).toBeDisabled();
});

test('una resposta tardana no mostra els PIN ni canvia el grup seleccionat', async ({page}) => {
  await dashboard(page);
  let started, release;
  const requested = new Promise(resolve => {started = resolve;});
  const held = new Promise(resolve => {release = resolve;});
  await page.route('**/api/identities/batch', async route => {started(); await held; return route.fallback();});
  await page.locator('#createBatch').click(); await requested;
  await page.locator('[data-select-group=b]').click();
  const response = page.waitForResponse(value => value.url().endsWith('/api/identities/batch'));
  release(); await response;
  await expect(page.locator('[data-select-group=b]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#freshCredentials')).toHaveCount(0);
  expect(await storageHasPins(page)).toBe(false);
});

test('un error de refresc conserva el lot generat sense repetir la creació', async ({page}) => {
  const calls = await dashboard(page);
  await page.route('**/api/teacher/identities', route => route.fulfill({status: 503, json: {detail: 'unavailable'}}));
  await page.locator('#createBatch').click();
  await expect(page.locator('#freshCredentials .credential')).toHaveCount(1);
  await expect(page.locator('#credentialsDetails [role=alert]')).toContainText('s’han generat');
  await expect(page.locator('#createBatch')).toBeDisabled();
  expect(calls.filter(call => call.path === '/api/identities/batch')).toHaveLength(1);
  await expect(page.locator('[data-download-batch-csv]')).toBeEnabled();
});

test('la memòria de navegació no torna a mostrar targetes sensibles', async ({page}) => {
  await dashboard(page); await create(page);
  const hiddenBeforeSnapshot = await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', {persisted: true}));
    return document.getElementById('freshCredentials')?.hidden;
  });
  expect(hiddenBeforeSnapshot).toBe(true);
  await expect(page.locator('#freshCredentials')).toHaveCount(0);
});

test('impressió local amb text inert i sense scripts', async ({page}) => {
  await dashboard(page); await create(page);
  const popupEvent = page.waitForEvent('popup');
  await page.locator('[data-print-batch]').click();
  const popup = await popupEvent;
  await expect(popup.locator('article')).toHaveCount(1);
  await expect(popup.locator('article em')).toHaveText(SAMPLE_PIN);
  expect(await popup.locator('script').count()).toBe(0);
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  expect(await storageHasPins(page)).toBe(false);
  await popup.close();
});

test('un segon enviament no duplica una generació pendent', async ({page}) => {
  await dashboard(page);
  let started, release, requests = 0;
  const requested = new Promise(resolve => {started = resolve;});
  const held = new Promise(resolve => {release = resolve;});
  await page.route('**/api/identities/batch', async route => {requests++; started(); await held; return route.fallback();});
  await page.locator('#createBatch').click(); await requested;
  await page.evaluate(() => document.querySelector('#identityCount').form.requestSubmit());
  expect(requests).toBe(1);
  release();
  await expect(page.locator('#freshCredentials .credential')).toHaveCount(1);
  await expect(page.locator('#createBatch')).toBeEnabled();
  expect(requests).toBe(1);
});
