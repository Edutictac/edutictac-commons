// account-embed.js: una línia en una app estàtica d'un altre origen.
// L'app i Commons són dos orígens públics simulats: Chrome no deixa que una pàgina
// simulada carregue recursos de loopback, així que els fitxers del xip es servixen des d'ací.
const {test, expect} = require('@playwright/test');
const path = require('path');
const ASSETS = path.join(__dirname, '../../services/portal/public/assets');

const session = {authenticated: true, kind: 'oidc', role: 'profesor', display_name: 'Laia Ferrer', public_code: null,
  login_available: true, links: {teacher: '/teacher.html', student: '/student.html', account: null, logout: '/api/auth/session/logout'}};

async function app(page, attributes) {
  const calls = [];
  await page.route('https://commons.test/**', route => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/assets/')) return route.fulfill({path: path.join(ASSETS, path.basename(url.pathname))});
    if (url.pathname === '/api/auth/session') {
      calls.push(url.href);
      return route.fulfill({json: session, headers: {'Access-Control-Allow-Origin': 'https://app.test', 'Access-Control-Allow-Credentials': 'true'}});
    }
    return route.fulfill({status: 404, body: ''});
  });
  await page.route('https://app.test/**', route => route.fulfill({contentType: 'text/html', body:
    `<!doctype html><html lang="ca-ES-valencia"><head><meta charset="utf-8">
     <script src="https://commons.test/assets/account-embed.js" ${attributes} defer></script></head>
     <body><button id="play">Juga</button></body></html>`}));
  await page.goto('https://app.test/');
  return calls;
}

test('mode compte: xip complet en la cantonada, amb la sessió de Commons', async ({page}) => {
  const calls = await app(page, 'data-position="top-right"');
  const slot = page.locator('#edutictac-account-embed');
  await expect(slot).toHaveClass(/eta-embed--top-right/);
  await expect(slot.locator('summary')).toHaveAttribute('aria-label', 'Laia Ferrer · Professorat');
  await expect(slot.locator('.eta-home')).toHaveAttribute('href', 'https://edutictac.es/');
  await expect(slot.locator('.eta-home')).toHaveAttribute('aria-label', 'Inici d’EduTicTac');
  expect(await slot.evaluate(node => getComputedStyle(node).position)).toBe('fixed');
  await slot.locator('summary').click();
  await expect(slot.getByRole('menuitem', {name: 'Tauler docent'})).toHaveAttribute('href', 'https://commons.test/teacher.html');
  await expect(slot.locator('[data-lang-option], [data-theme-option]')).toHaveCount(0);
  expect(calls.length).toBeGreaterThan(0);
  await expect(page.locator('#play')).toBeVisible();
});

test('mode inici: només l’enllaç, sense consultar cap sessió', async ({page}) => {
  const calls = await app(page, 'data-mode="home" data-position="bottom-left" data-home="https://edutictac.es/jocs/"');
  const slot = page.locator('#edutictac-account-embed');
  await expect(slot).toHaveClass(/eta-embed--bottom-left/);
  await expect(slot.locator('.eta-home')).toHaveAttribute('href', 'https://edutictac.es/jocs/');
  await expect(slot.locator('summary')).toHaveCount(0);
  await page.waitForTimeout(500);
  expect(calls).toHaveLength(0);
});

test('una posició desconeguda torna a la cantonada per defecte i no es duplica', async ({page}) => {
  await app(page, 'data-position="center"');
  await page.evaluate(() => {
    const again = document.createElement('script');
    again.src = 'https://commons.test/assets/account-embed.js';
    document.head.append(again);
  });
  await page.waitForTimeout(300);
  await expect(page.locator('#edutictac-account-embed')).toHaveCount(1);
  await expect(page.locator('#edutictac-account-embed')).toHaveClass(/eta-embed--top-right/);
});

test('si l’app reescriu el <body> en arrancar, el xip hi torna', async ({page}) => {
  await app(page, 'data-mode="home"');
  await expect(page.locator('#edutictac-account-embed .eta-home')).toBeVisible();
  await page.evaluate(() => { document.body.innerHTML = '<main id="game">Joc</main>'; });
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#edutictac-account-embed .eta-home')).toBeVisible();
  await expect(page.locator('#edutictac-account-embed')).toHaveCount(1);
});
