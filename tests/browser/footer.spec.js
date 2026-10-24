const { chooseLanguage } = require('./helpers/language');
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const VERSION = 'v' + fs.readFileSync(path.join(__dirname, '..', '..', 'VERSION'), 'utf8').trim();

const PAGES = ['/', '/teacher.html', '/student.html', '/privacy.html', '/teacher-help.html', '/blocs-access.html', '/llibres-login.html', '/assets/'];

for (const path of PAGES) {
  test(`${path}: un sol peu comú amb els enllaços propis`, async ({ page }) => {
    await page.goto(path);
    const footer = page.locator('footer.ett-footer');
    await expect(footer).toHaveCount(1);
    await expect(footer.locator('.ett-footer__brand')).toHaveText('EduTicTac');
    await expect(footer.locator('.ett-footer__service')).toHaveText(path === '/assets/' ? 'Rebost' : 'Commons');
    await expect(footer.locator('.ett-footer__version')).toHaveText(VERSION);
    await expect(footer.locator('.ett-footer__links a[href="/"]')).toHaveCount(1);
    await expect(footer.locator('.ett-footer__links a[href="/privacy.html"]')).toHaveCount(1);
    await expect(footer.locator('.ett-footer__links a[href$="edutictac-commons"]')).toHaveCount(1);
    await expect(footer.locator('.ett-footer__links a', { hasText: 'AGPL-3.0' })).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('el peu no duplica el de Rebost ni el peu d’administració antic', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('#adminHomeLink')).toHaveCount(1);
  await page.goto('/assets/');
  await expect(page.locator('footer')).toHaveCount(1);
});

test('els enllaços del peu es traduïxen amb el xip', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer.ett-footer');
  await chooseLanguage(page, 'en');
  await expect(footer.locator('a[href="/"]')).toHaveText('Home');
  await expect(footer.locator('a[href="/privacy.html"]')).toHaveText('Privacy');
  await expect(footer.locator('a[href*="edutictac-commons"]').first()).toHaveText('Source code');
  await chooseLanguage(page, 'es');
  await expect(footer.locator('a[href="/privacy.html"]')).toHaveText('Privacidad');
  await expect(footer.locator('a[href*="edutictac-commons"]').first()).toHaveText('Código fuente');
});
