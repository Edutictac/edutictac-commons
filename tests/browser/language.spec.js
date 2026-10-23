const {chooseLanguage} = require('./helpers/language');
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
    await expect(page.locator('edutictac-account [data-lang-option]')).toHaveText(['CA', 'VA', 'ES', 'EN']);
    await chooseLanguage(page,lang);
    await expect(page.locator('#studentOutput')).toHaveText(text.prompt);
    await expect(page.locator('#studentLogout')).toHaveText(text.logout);
    await page.reload();
    await expect(page.locator('#studentOutput')).toHaveText(text.prompt);
    await page.goto('/teacher.html');
    const homeLabel = { ca: 'Inici d’EduTicTac', va: 'Inici d’EduTicTac', es: 'Inicio de EduTicTac', en: 'EduTicTac home' };
    await expect(page.locator('edutictac-account .eta-home').first()).toHaveAttribute('aria-label', homeLabel[lang]);
    await expect(page.locator('#eduhootActivityId')).toHaveCount(0);
    await expect(page.locator('#assignFavoriteResources')).toBeDisabled();
    await expect(page.locator(`edutictac-account [data-lang-option=\"${lang}\"]`)).toHaveAttribute('aria-checked', 'true');
  });
}

test('canviar idioma conserva el perfil i els botons de les icones', async ({ page }) => {
  await mockApi(page, true);
  await page.goto('/student.html');
  for (const lang of ['va', 'en', 'es', 'ca', 'va']) {
    await chooseLanguage(page,lang);
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
    await expect(page.locator(`edutictac-account [data-lang-option=\"${expected}\"]`)).toHaveAttribute('aria-checked', 'true');
    await context.close();
  });
}

test('la preferència d’idioma es conserva entre subdominis, sense sessió',async({page})=>{
  const helper=require('fs').readFileSync(require('path').join(__dirname,'../../services/portal/public/assets/language-preference.js'),'utf8');
  await page.route(/^https:\/\/(?:commons\.)?edutictac\.es\//,r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Language preference test</title>'}));
  await page.goto('https://commons.edutictac.es/');await page.addScriptTag({content:helper});
  await page.evaluate(()=>window.commonsLanguage.remember('va'));
  await page.goto('https://edutictac.es/play/');await page.addScriptTag({content:helper});
  expect(await page.evaluate(()=>window.commonsLanguage.read())).toBe('va');
  await page.evaluate(()=>window.commonsLanguage.remember('es'));
  await page.goto('https://commons.edutictac.es/');await page.addScriptTag({content:helper});
  expect(await page.evaluate(()=>window.commonsLanguage.read())).toBe('es');
  await page.goto('https://edutictac.es/play/?lang=va');await page.addScriptTag({content:helper});
  expect(await page.evaluate(()=>window.commonsLanguage.read())).toBe('va');
  await page.evaluate(()=>window.commonsLanguage.remember('en'));
  await page.reload();await page.addScriptTag({content:helper});
  expect(await page.evaluate(()=>window.commonsLanguage.read())).toBe('en');
});

test('la cookie compartida recorre Commons, Banc i Llibres conservant el filtre del Banc',async({page})=>{
  const helper=require('fs').readFileSync(require('path').join(__dirname,'../../services/portal/public/assets/language-preference.js'),'utf8');
  await page.route(/^https:\/\/(?:commons|recursos|llibres)\.edutictac\.es\//,r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Language test</title>'}));
  const load=async url=>{await page.goto(url);await page.addScriptTag({content:helper});};
  await load('https://commons.edutictac.es/');
  await page.evaluate(()=>window.commonsLanguage.remember('va'));
  await load('https://recursos.edutictac.es/?lang=Castellano');
  expect(await page.evaluate(()=>window.commonsLanguage.read({parameter:'ui_lang'}))).toBe('va');
  await page.evaluate(()=>window.commonsLanguage.remember('en',{parameter:'ui_lang'}));
  expect(new URL(page.url()).searchParams.get('lang')).toBe('Castellano');
  await load('https://llibres.edutictac.es/');
  expect(await page.evaluate(()=>window.commonsLanguage.read())).toBe('en');
  await page.evaluate(()=>window.commonsLanguage.remember('ca'));
  await load('https://commons.edutictac.es/');
  expect(await page.evaluate(()=>window.commonsLanguage.read())).toBe('ca');
});
