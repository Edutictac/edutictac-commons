const { test, expect } = require('@playwright/test');

test('crear, previsualizar, guardar y reproducir un quiz', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Quiz' }).click();
  await page.locator('#title').fill('Animales del bosque');
  await page.locator('#question').fill('¿Cuál puede volar?');
  await page.locator('.answer-row:nth-child(1) .answer-text').fill('Águila');
  await page.locator('.answer-row:nth-child(2) .answer-text').fill('Gato');

  await page.getByRole('button', { name: 'Previsualizar' }).click();
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.getByText('¿Cuál puede volar?')).toBeVisible();

  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
  await expect(page).toHaveURL(/\/play\/[A-Za-z0-9]{8}$/);
});

test('crear, previsualizar, guardar y reproducir un verdadero/falso', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Verdadero/Falso' }).click();
  await page.locator('#title').fill('Ciencia básica');
  await page.locator('#question').fill('El agua se congela a 0 °C.');
  await page.getByRole('button', { name: 'Previsualizar' }).click();
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.getByText('El agua se congela a 0 °C.')).toBeVisible();
  await expect(player.getByRole('radio', { name: /Verdadero/ })).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
  await expect(page).toHaveURL(/\/play\/[A-Za-z0-9]{8}$/);
});

test('crear y reproducir un Memory', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Memory' }).click();
  await page.locator('#title').fill('Animales');
  await page.locator('#question').fill('Encuentra las parejas');
  await page.locator('.card-text').nth(0).fill('Gato');
  await page.locator('.card-text').nth(1).fill('Perro');
  await page.getByRole('button', { name: 'Previsualizar' }).click();
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.getByText('Juego de memoria. Encuentra las parejas.')).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
  await expect(page).toHaveURL(/\/play\/[A-Za-z0-9]{8}$/);
});

test('crear y reproducir una actividad de relacionar', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Relacionar' }).click();
  await page.locator('#title').fill('Capitales');
  await page.locator('#question').fill('Relaciona cada país con su capital');
  await page.locator('.match-left').nth(0).fill('España');
  await page.locator('.match-right').nth(0).fill('Madrid');
  await page.locator('.match-left').nth(1).fill('Italia');
  await page.locator('.match-right').nth(1).fill('Roma');
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.getByRole('button', { name: /España/ })).toBeVisible();
  await expect(player.getByRole('button', { name: 'Madrid' })).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
  await expect(page).toHaveURL(/\/play\/[A-Za-z0-9]{8}$/);
});
