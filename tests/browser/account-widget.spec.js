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
  await page.locator('[data-lang="en"]').click();
  await expect(home).toHaveAttribute('aria-label', 'EduTicTac home');
});
