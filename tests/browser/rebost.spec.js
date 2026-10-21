const {test, expect} = require('@playwright/test');

const id = 'img-' + 'a'.repeat(64);
const revision = '1';
const item = {id, revision, name: '<img src=x onerror=alert(1)>', names: {es: 'Personaje', ca: 'Personatge'}, type: 'sprite', collection: 'scratch', readonly: true, width: 40, height: 40, family: {id, revision, count: 2}};
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL1sAAAAASUVORK5CYII=', 'base64');

async function mockAPI(page, authenticated = false) {
  let signedIn = authenticated;
  const requests = [];
  await page.route('**/api/assets/v1/**', async route => {
    const path = new URL(route.request().url()).pathname;
    requests.push(route.request().url());
    if (path.endsWith('/me')) return route.fulfill({status: signedIn ? 200 : 401, json: signedIn ? {capabilities: ['catalog', 'scratch_catalog']} : {detail: 'session_required'}});
    if (path.endsWith('/catalogs')) return route.fulfill({json: {capabilities: ['catalog', 'scratch_catalog']}});
    if (path.endsWith('/items')) {
      const collection = new URL(route.request().url()).searchParams.get('collection');
      return route.fulfill({json: {items: [{...item, ...(collection === 'mine' ? {collection: 'mine', readonly: false, family: undefined} : {})}], next_cursor: ''}});
    }
    if (path.endsWith('/family')) return route.fulfill({json: {id, revision, items: [{...item, family: undefined}]}});
    if (path.endsWith('/thumbnail') || path.endsWith('/content')) return route.fulfill({contentType: 'image/png', body: png});
    return route.fulfill({status: 404, json: {detail: 'not_found'}});
  });
  return {requests, signIn(value) { signedIn = value; }};
}

test('public catalogues, private session loss and recovery, safe names', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const mock = await mockAPI(page);
  await page.addInitScript(() => {
    window.activeBlobs = new Set();
    const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = blob => { const url = create(blob); window.activeBlobs.add(url); return url; };
    URL.revokeObjectURL = url => { window.activeBlobs.delete(url); revoke(url); };
  });
  await page.goto('/assets/');
  await expect(page.locator('#grid > article')).toHaveCount(1);
  await page.locator('#mineTab').click();
  await expect(page.locator('#access')).toBeVisible();
  expect(mock.requests.filter(url => url.includes('collection=mine'))).toHaveLength(0);
  mock.signIn(true);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('article input')).toHaveValue(item.name);
  expect(await page.locator('article img').count()).toBe(1);
  await page.locator('.image').click();
  await expect(page.locator('#preview')).toBeVisible();
  mock.signIn(false);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('#access')).toBeVisible();
  await expect(page.locator('#grid > article')).toHaveCount(0);
  await expect(page.locator('#preview')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => window.activeBlobs.size)).toBe(0);
  expect(errors).toEqual([]);
});

for (const families of [false, true]) {
  test(`same-origin iframe selection, family negotiation=${families}`, async ({page}) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await mockAPI(page);
    // A local static document hosts the real selector; no editor internals are mocked.
    await page.goto('/assets/');
    await page.evaluate(families => {
      window.selections = [];
      window.addEventListener('message', event => {
        if (event.origin === location.origin) window.selections.push(event.data);
      });
      const frame = document.createElement('iframe');
      frame.id = 'picker';
      frame.src = '/assets/?mode=pick&collection=scratch&lang=es&type=sprite&request=check&selection=sprite' + (families ? '&supports_families=1' : '');
      document.body.append(frame);
    }, families);
    const picker = page.frameLocator('#picker');
    await picker.getByRole('button', {name: families ? 'Añadir personaje con disfraces' : 'Usar en el proyecto', exact: true}).click();
    expect(errors).toEqual([]);
    await expect.poll(() => page.evaluate(() => window.selections.length)).toBe(1);
    const selected = await page.evaluate(() => window.selections[0]);
    expect(selected).toEqual({format: 'rebost-selection', version: 1, request: 'check', id, name: 'Personaje', ...(families ? {family: true, familyRevision: revision} : {})});
    await picker.locator('#search').press('Escape');
    await expect.poll(() => page.evaluate(() => window.selections.length)).toBe(2);
    expect(await page.evaluate(() => window.selections[1])).toEqual({format: 'rebost-selection', version: 1, request: 'check', cancel: true});
  });
}


test('family revision mismatch is explained without displaying stale costumes', async ({page}) => {
  await mockAPI(page);
  await page.route('**/family', route => route.fulfill({json: {id, revision: 'changed', items: [item]}}));
  await page.goto('/assets/?collection=scratch');
  await page.locator('[data-lang=es]').click();
  await page.getByRole('button', {name: 'Ver disfraces', exact: true}).click();
  await expect(page.locator('#status')).toContainText('Esta imagen ha cambiado');
  await expect(page.locator('.family-costume')).toHaveCount(0);
  await expect(page.locator('#controls')).toBeEnabled();
});
