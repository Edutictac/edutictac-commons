const {chooseLanguage} = require('./helpers/language');
const { test, expect } = require('@playwright/test');

const anonymous = {
  authenticated: false, kind: 'anonymous', role: null, display_name: null, username: null, public_code: null,
  login_available: true,
  links: { login: '/api/auth/oidc/login?next=%2Fteacher.html', teacher: '/teacher.html', student: '/student.html', account: null, logout: '/api/auth/session/logout' },
};
const teacher = { ...anonymous, authenticated: true, kind: 'oidc', role: 'profesor', display_name: 'Laia Ferrer', username: 'laia' };

async function mockSession(page, model) {
  await page.route('**/api/**', route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path === '/api/auth/session') {
      if (model.offline) return route.fulfill({ status: 503, json: { detail: 'down' } });
      return route.fulfill({ json: model.session, headers: { 'Cache-Control': 'no-store' } });
    }
    if (path === '/api/auth/session/logout' && request.method() === 'POST') {
      model.logouts += 1;
      model.session = anonymous;
      return route.fulfill({ json: { ok: true } });
    }
    return route.fulfill({ status: 401, json: { detail: 'test unauthenticated' } });
  });
}

test('sense sessió: inici visible i menú d’entrada per a professorat i alumnat', async ({ page }) => {
  const model = { session: anonymous, logouts: 0 };
  await mockSession(page, model);
  await page.goto('/teacher.html?lang=va');
  const widget = page.locator('edutictac-account');
  const home = widget.locator('.eta-home').first();
  await expect(home).toHaveAttribute('href', '/');
  await expect(home).toHaveAttribute('aria-label', 'Inici d’EduTicTac');
  const chip = widget.locator('summary');
  await expect(chip).toHaveAttribute('aria-label', 'Entrar');
  await chip.click();
  await expect(widget.getByRole('menuitem', { name: /Professorat/ })).toHaveAttribute('href', /\/api\/auth\/oidc\/login\?next=/);
  await expect(widget.getByRole('menuitem', { name: /Alumnat/ })).toHaveAttribute('href', /\/student\.html$/);
  await page.keyboard.press('Escape');
  await expect(widget.locator('details')).not.toHaveAttribute('open', '');
});

test('amb sessió: nom, rol, tauler i eixida central amb confirmació', async ({ page }) => {
  const model = { session: teacher, logouts: 0 };
  await mockSession(page, model);
  await page.goto('/index.html?lang=es');
  const widget = page.locator('edutictac-account');
  const chip = widget.locator('summary');
  await expect(chip).toHaveAttribute('aria-label', 'Laia Ferrer · Profesorado');
  await expect(widget.locator('.eta-avatar')).toHaveText('LF');
  await chip.click();
  await expect(widget.getByRole('menuitem', { name: 'Panel docente' })).toHaveAttribute('href', /\/teacher\.html$/);
  await expect(widget.getByRole('menuitem', { name: 'Cuenta y contraseña' })).toHaveAttribute('href', /default-password-change/);
  page.once('dialog', dialog => dialog.accept());
  await widget.getByRole('menuitem', { name: 'Salir de la sesión' }).click();
  await expect(chip).toHaveAttribute('aria-label', 'Entrar');
  expect(model.logouts).toBe(1);
});

test('si cancel·la la confirmació, la sessió continua', async ({ page }) => {
  const model = { session: teacher, logouts: 0 };
  await mockSession(page, model);
  await page.goto('/index.html?lang=ca');
  const widget = page.locator('edutictac-account');
  await widget.locator('summary').click();
  page.once('dialog', dialog => dialog.dismiss());
  await widget.getByRole('menuitem', { name: 'Eixir de la sessió' }).click();
  expect(model.logouts).toBe(0);
  await expect(widget.locator('summary')).toHaveAttribute('aria-label', /Laia Ferrer/);
});

test('sense connexió: avís i reintent', async ({ page }) => {
  const model = { session: teacher, logouts: 0, offline: true };
  await mockSession(page, model);
  await page.goto('/index.html?lang=en');
  const widget = page.locator('edutictac-account');
  await expect(widget.locator('summary')).toHaveAttribute('aria-label', 'Offline');
  model.offline = false;
  await widget.locator('summary').click();
  await widget.getByRole('menuitem', { name: 'Try again' }).click();
  await expect(widget.locator('summary')).toHaveAttribute('aria-label', 'Laia Ferrer · Teacher');
});

test('el xip canvia d’idioma amb el selector de la pàgina', async ({ page }) => {
  await mockSession(page, { session: anonymous, logouts: 0 });
  await page.goto('/student.html?lang=ca');
  const home = page.locator('edutictac-account .eta-home').first();
  await expect(home).toHaveAttribute('aria-label', 'Inici d’EduTicTac');
  await chooseLanguage(page,'en');
  await expect(home).toHaveAttribute('aria-label', 'EduTicTac home');
});

for (const [path, homeLabel] of [
  ['/privacy.html?lang=va', 'Inici d’EduTicTac'],
  ['/teacher-help.html?lang=es', 'Inicio de EduTicTac'],
  ['/quiosc.html?lang=en', 'EduTicTac home'],
  ['/blocs-access.html?lang=va', 'Inici d’EduTicTac'],
  ['/llibres-login.html?lang=va', 'Inici d’EduTicTac'],
  ['/assets/?lang=ca', 'Inici d’EduTicTac'],
]) {
  test(`${path}: enllaç d’inici i xip de compte visibles`, async ({ page }) => {
    await mockSession(page, { session: anonymous, logouts: 0 });
    await page.goto(path);
    const home = page.locator('edutictac-account .eta-home').first();
    await expect(home).toBeVisible();
    await expect(home).toHaveAttribute('href', '/');
    await expect(home).toHaveAttribute('aria-label', homeLabel);
    await expect(page.locator('edutictac-account summary')).toBeVisible();
  });
}

test('tema: Auto segueix el sistema, Fosc i Clar es guarden i sobreviuen a la recàrrega', async ({ page, context }) => {
  await mockSession(page, { session: anonymous, logouts: 0 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/index.html?lang=va');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(html).toHaveAttribute('data-theme-preference', 'auto');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(html).toHaveAttribute('data-theme', 'light');

  const widget = page.locator('edutictac-account');
  await widget.locator('summary').click();
  const group = widget.getByRole('radiogroup', { name: 'Tema' });
  await expect(group.getByRole('radio', { name: /Auto/ })).toHaveAttribute('aria-checked', 'true');
  await group.getByRole('radio', { name: /Fosc/ }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(group.getByRole('radio', { name: /Fosc/ })).toHaveAttribute('aria-checked', 'true');
  const cookies = await context.cookies();
  expect(cookies.find(cookie => cookie.name === 'edutictac_theme')?.value).toBe('dark');
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(17, 26, 24)');

  // Sense parpelleig: el tema guardat ja hi és abans que carregue el widget.
  await page.route('**/assets/account-widget.js', route => route.abort());
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.unroute('**/assets/account-widget.js');
  await page.reload();

  await widget.locator('summary').click();
  await group.getByRole('radio', { name: /Fosc/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(group.getByRole('radio', { name: /Auto/ })).toHaveAttribute('aria-checked', 'true');
  await expect(group.getByRole('radio', { name: /Auto/ })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(group.getByRole('radio', { name: /Clar/ })).toHaveAttribute('aria-checked', 'true');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('el tema es comparteix entre pàgines i amb Rebost', async ({ page }) => {
  await mockSession(page, { session: anonymous, logouts: 0 });
  await page.goto('/teacher.html?lang=es');
  await page.locator('edutictac-account summary').click();
  await page.getByRole('radio', { name: /Oscuro/ }).click();
  await page.goto('/assets/?lang=es');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('edutictac-account summary').click();
  await expect(page.getByRole('radio', { name: /Oscuro/ })).toHaveAttribute('aria-checked', 'true');
});

test('sense theme-preference.js no hi ha selector de tema', async ({ page }) => {
  await mockSession(page, { session: anonymous, logouts: 0 });
  await page.route('**/assets/theme-preference.js', route => route.fulfill({ body: '', contentType: 'text/javascript' }));
  await page.goto('/index.html?lang=ca');
  await page.locator('edutictac-account summary').click();
  await expect(page.locator('edutictac-account').getByRole('menuitem', { name: /Professorat/ })).toBeVisible();
  await expect(page.locator('edutictac-account [data-theme-option]')).toHaveCount(0);
  await expect(page.locator('edutictac-account [data-lang-option]')).toHaveCount(4);
});

test('l’idioma es tria dins del xip i canvia tota la pàgina', async ({ page }) => {
  await mockSession(page, { session: anonymous, logouts: 0 });
  await page.goto('/teacher.html?lang=ca');
  await expect(page.locator('.lang-switcher')).toHaveCount(0);
  const widget = page.locator('edutictac-account');
  await widget.locator('summary').click();
  const group = widget.getByRole('radiogroup', { name: 'Idioma' });
  await expect(group.getByRole('radio')).toHaveText(['CA', 'VA', 'ES', 'EN']);
  await expect(group.getByRole('radio', { name: 'Català' })).toHaveAttribute('aria-checked', 'true');
  await group.getByRole('radio', { name: 'Español' }).click();
  await expect(page.locator('h1')).toHaveText('Panel docente');
  await expect(widget.locator('.eta-home')).toHaveAttribute('aria-label', 'Inicio de EduTicTac');
  await group.getByRole('radio', { name: 'Español' }).focus();
  await page.keyboard.press('ArrowRight');
  // L'etiqueta del grup també canvia d'idioma.
  const english = widget.getByRole('radiogroup', { name: 'Language' }).getByRole('radio', { name: 'English' });
  await expect(english).toHaveAttribute('aria-checked', 'true');
  await expect(english).toBeFocused();
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Teacher dashboard');
});
