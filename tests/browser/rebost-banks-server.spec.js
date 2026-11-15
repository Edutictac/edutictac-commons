const {test, expect} = require('@playwright/test');

// Banks searched by Commons itself (capability `banks`): same origin, same session, no EduCrea involved.
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL1sAAAAASUVORK5CYII=', 'base64');
const item = (provider, id, title, license) => ({provider, id: String(id), title, keywords: [], license, license_url: '',
  source_url: `https://example.test/${provider}/${id}`, credit: `Autoria ${provider}`, media_type: 'image/png',
  thumbnail_url: `/api/assets/v1/banks/${provider}/${id}/thumbnail`, content_url: `/api/assets/v1/banks/${provider}/${id}/content`});
const results = {arasaac: [item('arasaac', 1, 'casa', 'CC BY-NC-SA 4.0')], wikimedia: [item('wikimedia', 10, 'casa blanca', 'CC BY-SA 4.0')],
  met: [], openverse: [item('openverse', 'o1', 'libre', 'CC BY 4.0'), item('openverse', 'o2', 'noncom', 'CC BY-NC 4.0')]};

async function setup(page, {banks = true, session = true} = {}) {
  await page.route('**/deployment.js', route => route.fulfill({contentType: 'text/javascript', body: "window.commonsDeployment = Object.freeze({ mode: 'local' });"}));
  await page.route(/\/api\/auth\/session(\?|$)/, route => route.fulfill({json: {authenticated: session, kind: 'oidc', role: 'profesor', display_name: 'Docent',
    username: null, public_code: null, login_available: true, links: {login: '/x', teacher: '/teacher.html', student: '/student.html', account: null, logout: '/x'}}}));
  const seen = [], saves = [];
  await page.route('**/api/assets/v1/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname;
    seen.push(request.method() + ' ' + path);
    const caps = ['private_library', 'catalog', 'scratch_catalog', ...(banks ? ['banks'] : [])];
    if (path.endsWith('/me')) return route.fulfill({status: session ? 200 : 401, json: session ? {capabilities: caps} : {detail: 'session_required'}});
    if (path.endsWith('/catalogs')) return route.fulfill({json: {capabilities: ['catalog', 'scratch_catalog']}});
    if (path.endsWith('/banks')) return route.fulfill({json: {providers: Object.keys(results).map(id => ({id}))}});
    const search = /\/banks\/([a-z]+)\/search$/.exec(path);
    if (search) return route.fulfill({json: {provider: search[1], license: 'x', license_url: '', commercial_use: true, items: results[search[1]]}});
    if (/\/banks\/.*\/(thumbnail|content)$/.test(path)) return route.fulfill({contentType: 'image/png', body: png});
    if (path.endsWith('/items') && request.method() === 'POST') { saves.push(request.headers()); return route.fulfill({status: 201, json: {id: 'img-' + 'b'.repeat(64)}}); }
    if (path.endsWith('/items')) return route.fulfill({json: {items: [], next_cursor: ''}});
    return route.fulfill({status: 404, json: {detail: 'not_found'}});
  });
  await page.route('https://crea.edutictac.es/**', route => route.abort()); // EduCrea must not be contacted
  return {seen, saves};
}

test('server banks: tab shown by the capability, searched same-origin, only announced providers, NC filtered', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const mock = await setup(page);
  await page.goto('/assets/');
  await page.locator('#banksTab').click();
  await page.locator('#banks input[type=search]').fill('casa');
  await page.locator('#banks button[type=submit]').click();
  await expect(page.locator('#banks .banks-title')).toHaveCount(4); // no «Iconos»: Commons does not announce it
  await expect(page.locator('#banks')).toContainText('casa blanca');
  await expect(page.locator('#banks')).toContainText('libre');
  await expect(page.locator('#banks')).not.toContainText('noncom');
  expect(mock.seen.some(line => line.startsWith('GET /api/assets/v1/banks/wikimedia/search'))).toBe(true);
  await expect(page.locator('#banks .banks-login')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('server banks: no tab without the capability', async ({page}) => {
  await setup(page, {banks: false});
  await page.goto('/assets/');
  await expect(page.locator('#catalogTab')).toBeVisible();
  await expect(page.locator('#banksTab')).toBeHidden();
});

test('server banks: save stores the image with its credit and licence', async ({page}) => {
  const mock = await setup(page);
  await page.goto('/assets/');
  await page.locator('#banksTab').click();
  await page.locator('#banks input[type=search]').fill('casa');
  await page.locator('#banks button[type=submit]').click();
  await expect(page.locator('#banks')).toContainText('casa blanca');
  await page.locator('#banks button', {hasText: /desa|guarda|save/i}).first().click();
  await expect.poll(() => mock.saves.length).toBe(1);
  expect(mock.saves[0]['x-rebost-license']).toBeTruthy();
  expect(decodeURIComponent(mock.saves[0]['x-rebost-credit'])).toContain('Autoria');
});
