const {test, expect} = require('@playwright/test');

const ORIGIN = 'http://127.0.0.1:18082';
const EDUCREA = 'https://crea.edutictac.es'; // the only EduCrea origin the page's CSP lets it connect to
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL1sAAAAASUVORK5CYII=', 'base64');
const cors = {'access-control-allow-origin': ORIGIN, 'access-control-allow-credentials': 'true'};
const bankItem = (provider, id, title, license) => ({provider, id, title, keywords: [], thumbnail_url: '', content_url: '', license,
  license_url: '', source_url: `https://example.test/${provider}/${id}`, credit: `Autoria ${provider}`, media_type: 'image/png'});
const results = {
  arasaac: [bankItem('arasaac', 1, 'casa', 'CC BY-NC-SA 4.0')],
  wikimedia: Array.from({length: 8}, (_, i) => bankItem('wikimedia', 10 + i, `casa ${i}`, 'CC BY-SA 4.0')),
  met: [], icons: [bankItem('icons', 'tabler:home', 'home', 'MIT')],
  openverse: [bankItem('openverse', 'o1', 'libre', 'CC BY 4.0'), bankItem('openverse', 'o2', 'noncomercial', 'CC BY-NC 4.0')],
};

async function setup(page, {configured = true, educreaSession = true, rebostSession = true} = {}) {
  await page.route('**/deployment.js', route => route.fulfill({contentType: 'text/javascript',
    body: `window.commonsDeployment = Object.freeze({ mode: 'local'${configured ? `, bankSearchUrl: '${EDUCREA}'` : ''} });`}));
  await page.route(/\/api\/auth\/session(\?|$)/, route => route.fulfill({json: {authenticated: rebostSession, kind: 'oidc', role: 'profesor',
    display_name: 'Docent', username: null, public_code: null, login_available: true, links: {login: '/x', teacher: '/teacher.html', student: '/student.html', account: null, logout: '/x'}}}));
  const saves = [];
  await page.route('**/api/assets/v1/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname;
    if (path.endsWith('/me')) return route.fulfill({status: rebostSession ? 200 : 401, json: rebostSession ? {capabilities: ['catalog', 'scratch_catalog']} : {detail: 'session_required'}});
    if (path.endsWith('/catalogs')) return route.fulfill({json: {capabilities: ['catalog', 'scratch_catalog']}});
    if (path.endsWith('/items') && request.method() === 'POST') { saves.push(request.headers()); return route.fulfill({status: 201, json: {id: 'img-' + 'b'.repeat(64)}}); }
    if (path.endsWith('/items')) return route.fulfill({json: {items: [], next_cursor: ''}});
    return route.fulfill({status: 404, json: {detail: 'not_found'}});
  });
  const asked = [];
  await page.route(`${EDUCREA}/**`, async route => {
    if (route.request().method() !== 'GET') return route.fulfill({status: 403, json: {detail: 'EduCrea only answers simple GET reads'}});
    const url = new URL(route.request().url());
    asked.push(url.pathname + url.search);
    if (!educreaSession) return route.fulfill({status: 401, headers: cors, json: {detail: 'No autenticado'}});
    const search = /\/api\/image-banks\/([a-z]+)\/search$/.exec(url.pathname);
    if (search) return route.fulfill({headers: cors, json: {provider: search[1], license: 'x', license_url: '', commercial_use: true, items: results[search[1]]}});
    if (/\/(thumbnail|content)$/.test(url.pathname)) return route.fulfill({headers: {...cors, 'content-type': 'image/png'}, body: png});
    return route.fulfill({status: 404, headers: cors, json: {}});
  });
  return {saves, asked};
}

test('the banks tab only exists when the installation points to an EduCrea', async ({page}) => {
  await setup(page, {configured: false});
  await page.goto('/assets/');
  await expect(page.locator('#catalogTab')).toBeVisible();
  await expect(page.locator('#banksTab')).toBeHidden();
});

test('searches every bank at once, always shows ARASAAC with an NC label and filters NC elsewhere', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const mock = await setup(page);
  await page.goto('/assets/');
  await page.locator('#banksTab').click();
  await expect(page.locator('#banks')).toBeVisible();
  await expect(page.locator('#grid')).toBeHidden();
  await page.locator('#banks input[type=search]').fill('casa');
  await page.locator('#banks button[type=submit]').click();
  await expect(page.locator('#banks .banks-title')).toHaveCount(5);
  await expect(page.locator('#banks .bank-card')).toHaveCount(1 + 6 + 1 + 1); // arasaac, 6 of 8, icons, openverse (NC item filtered)
  await expect(page.locator('#banks .bank-card', {hasText: 'casa'}).first().locator('.nc-badge')).toHaveText('NC');
  await expect(page.locator('#banks .bank-card', {hasText: 'noncomercial'})).toHaveCount(0);
  await expect.poll(() => page.locator('#banks .bank-card img[src^="blob:"]').count()).toBe(9);
  await page.getByRole('button', {name: /Wikimedia Commons \(2\)/}).click();
  await expect(page.locator('#banks .bank-card')).toHaveCount(11);
  await page.locator('#banks .banks-free input').uncheck();
  await page.locator('#banks button[type=submit]').click();
  await expect(page.locator('#banks .bank-card', {hasText: 'noncomercial'})).toHaveCount(1);
  expect(mock.asked.some(path => path.includes('/arasaac/search'))).toBe(true);
  expect(errors).toEqual([]);
});

test('saves a bank image into the personal Rebost with its credit and licence', async ({page}) => {
  const mock = await setup(page);
  await page.goto('/assets/');
  await page.locator('#banksTab').click();
  await page.locator('#banks input[type=search]').fill('casa');
  await page.locator('#banks button[type=submit]').click();
  const card = page.locator('#banks .bank-card', {hasText: 'home'});
  await expect(card).toHaveCount(1);
  await card.locator('button').click();
  await expect(card.locator('button')).toBeDisabled();
  expect(mock.saves).toHaveLength(1);
  const headers = mock.saves[0];
  expect(headers['x-rebost-type']).toBe('illustration');
  expect(decodeURIComponent(headers['x-rebost-credit'])).toBe('Autoria icons');
  expect(decodeURIComponent(headers['x-rebost-license'])).toBe('MIT');
  expect(headers['content-type']).toBe('image/png');
});

test('without an EduCrea session it asks to sign in there; without a Rebost session it will not save', async ({page}) => {
  await setup(page, {educreaSession: false});
  await page.goto('/assets/');
  await page.locator('#banksTab').click();
  await page.locator('#banks input[type=search]').fill('casa');
  await page.locator('#banks button[type=submit]').click();
  await expect(page.locator('#banks .banks-login')).toBeVisible();
  await expect(page.locator('#banks .banks-login a')).toHaveAttribute('href', EDUCREA);
});
