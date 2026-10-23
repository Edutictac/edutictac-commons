// L'idioma es tria dins del xip de compte (<edutictac-account>), com el tema.
const {expect} = require('@playwright/test');

async function chooseLanguage(page, lang) {
  const widget = page.locator('edutictac-account');
  const details = widget.locator('details');
  if (!(await details.evaluate(node => node.open))) await widget.locator('summary').click();
  await widget.locator(`[data-lang-option="${lang}"]`).click();
  await expect(widget.locator(`[data-lang-option="${lang}"]`)).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
}

module.exports = {chooseLanguage};
