const { test, expect } = require('@playwright/test');

const languages = {
  ca: { logout: 'Sortir', prompt: 'Entra amb el teu codi + PIN per veure el teu itinerari individual.' },
  va: { logout: 'Eixir', prompt: 'Entra amb el teu codi + PIN per vore el teu itinerari individual.' },
  es: { logout: 'Salir', prompt: 'Entra con tu código + PIN para ver tu itinerario individual.' },
  en: { logout: 'Log out', prompt: 'Log in with your code + PIN to see your individual itinerary.' },
};

async function mockApi(page, authenticated = false) {
  const identity = { id: 'test-student', public_code: 'TEST01', avatar_icon: '🚀' };
  await page.route('**/api/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/health') return route.fulfill({ json: { status: 'ok' } });
    if (path === '/api/auth/me' && authenticated) return route.fulfill({ json: { identity } });
    if (path === '/api/student/dashboard' && authenticated) {
      return route.fulfill({ json: { identity, assignments: [] } });
    }
    return route.fulfill({ status: 401, json: { detail: 'test unauthenticated' } });
  });
}

for (const [lang, text] of Object.entries(languages)) {
  test(`${lang}: taulers, text inicial i persistencia`, async ({ page }) => {
    await mockApi(page);
    await page.goto('/student.html');
    await expect(page.locator('.lang-switcher button')).toHaveText(['CA', 'VA', 'ES', 'EN']);
    await page.locator(`[data-lang="${lang}"]`).click();
    await expect(page.locator('#studentOutput')).toHaveText(text.prompt);
    await expect(page.locator('#studentLogout')).toHaveText(text.logout);
    await page.reload();
    await expect(page.locator('#studentOutput')).toHaveText(text.prompt);
    await page.goto('/teacher.html');
    const sessionLogout = { ca: 'Eixir de la sessió', va: 'Eixir de la sessió', es: 'Salir de la sesión', en: 'Sign out' };
    await expect(page.locator('#logoutSessionButton')).toHaveText(sessionLogout[lang]);
    await expect(page.locator('#eduhootActivityId')).toHaveCount(0);
    await expect(page.locator('#assignFavoriteResources')).toBeDisabled();
    await expect(page.locator(`[data-lang="${lang}"]`)).toHaveAttribute('aria-current', 'true');
  });
}

test('canviar idioma conserva el perfil i els botons de les icones', async ({ page }) => {
  await mockApi(page, true);
  await page.goto('/student.html');
  for (const lang of ['va', 'en', 'es', 'ca', 'va']) {
    await page.locator(`[data-lang="${lang}"]`).click();
    await expect(page.locator('.student-profile')).toBeVisible();
    await expect(page.locator('[data-student-icon]')).toHaveCount(28);
    await expect(page.locator('#studentOutput')).toContainText('TEST01');
  }
});

for (const [locale, expected] of [['ca-ES', 'ca'], ['ca-ES-valencia', 'va']]) {
  test(`autodeteccio ${locale}`, async ({ browser }) => {
    const context = await browser.newContext({ locale });
    const page = await context.newPage();
    await mockApi(page);
    await page.goto('http://127.0.0.1:18082/student.html');
    await expect(page.locator(`[data-lang="${expected}"]`)).toHaveAttribute('aria-current', 'true');
    await context.close();
  });
}
