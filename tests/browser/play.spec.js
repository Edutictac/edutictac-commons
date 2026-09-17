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
  await expect.poll(() => player.evaluate(() => {
    const images = Array.from(document.querySelectorAll('.h5p-memory-card img'));
    return images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0);
  })).toBe(true);
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

test('crear y reproducir una actividad de clasificar', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Clasificar' }).click();
  await page.locator('#title').fill('Naturaleza');
  await page.locator('#question').fill('Clasifica cada elemento');
  await page.locator('.category-name').nth(0).fill('Seres vivos');
  await page.locator('.category-name').nth(1).fill('No vivos');
  await page.locator('.classify-text').nth(0).fill('Árbol');
  await page.locator('.classify-category').nth(0).selectOption('0');
  await page.locator('.classify-text').nth(1).fill('Piedra');
  await page.locator('.classify-category').nth(1).selectOption('1');
  await page.locator('.classify-text').nth(2).fill('Gato');
  await page.locator('.classify-category').nth(2).selectOption('0');
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.getByText('Seres vivos')).toBeVisible();
  await expect(player.getByText('No vivos')).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
  await expect(page).toHaveURL(/\/play\/[A-Za-z0-9]{8}$/);
});

test('envía a Commons el resultado real de un Quiz H5P', async ({ page }) => {
  let scorePayload;
  await page.route('**/play/api/commons/score', async (route) => {
    scorePayload = route.request().postDataJSON();
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true, score: scorePayload.score }) });
  });
  await page.goto('/play/?assignment_id=assignment-test');
  await page.getByRole('button', { name: 'Quiz' }).click();
  await page.locator('#title').fill('Resultado H5P');
  await page.locator('#question').fill('¿Cuál puede volar?');
  await page.locator('.answer-row:nth-child(1) .answer-text').fill('Águila');
  await page.locator('.answer-row:nth-child(2) .answer-text').fill('Gato');
  await page.getByRole('button', { name: 'Previsualizar' }).click();
  await page.locator('#savePreview').click();
  await expect(page).toHaveURL(/\/play\/[A-Za-z0-9]{8}\?assignment_id=assignment-test$/);
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await player.getByText('Águila').click({ force: true });
  await player.getByRole('button', { name: /Comprobar/ }).click();
  await expect.poll(() => scorePayload).toMatchObject({ assignment_id: 'assignment-test', score: 100 });
  expect(scorePayload.activity_id).toMatch(/^[A-Za-z0-9]{8}$/);
  expect(scorePayload.metadata.source).toBe('h5p-xapi');
  expect(scorePayload.result_id).toMatch(/^urn:edutictac-play:/);
  expect(scorePayload.metadata.statement_id).toBe(scorePayload.result_id);
});

test('reintenta el resultado pendiente al recuperar conexión', async ({ page }) => {
  let scoreCalls = 0;
  await page.route('**/play/api/commons/score', async (route) => {
    scoreCalls += 1;
    if (scoreCalls === 1) {
      await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'offline' }) });
      return;
    }
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true, score: 100 }) });
  });
  await page.goto('/play/?assignment_id=assignment-test&launch_context=context-test');
  await page.getByRole('button', { name: 'Quiz' }).click();
  await page.locator('#title').fill('Resultado pendiente');
  await page.locator('#question').fill('¿Cuál puede volar?');
  await page.locator('.answer-row:nth-child(1) .answer-text').fill('Águila');
  await page.locator('.answer-row:nth-child(2) .answer-text').fill('Gato');
  await page.getByRole('button', { name: 'Previsualizar' }).click();
  await page.locator('#savePreview').click();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await player.getByText('Águila').click({ force: true });
  await player.getByRole('button', { name: /Comprobar/ }).click();
  await expect.poll(() => scoreCalls).toBe(1);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('edutictac-play-result-queue') || '[]').length)).toBe(1);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect.poll(() => scoreCalls).toBe(2);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('edutictac-play-result-queue'))).toBeNull();
});

test('biblioteca: lista, filtra y borra actividades con token', async ({ page, request }) => {
  const marker = `Biblio${Date.now().toString(36)}`;
  for (const title of [`${marker} uno`, `${marker} dos`]) {
    await request.post('/play/api/activities', { data: { type: 'multiple-choice', title, question: 'q', answers: [{ text: 'a', correct: true }, { text: 'b', correct: false }] } });
  }
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Ver biblioteca' }).click();
  await page.locator('#librarySearch').fill(marker);
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.locator('.library-card')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Borrar' })).toHaveCount(0);
  await page.locator('.library-admin summary').click();
  await page.locator('#libraryToken').fill('test-admin-token');
  await page.getByRole('button', { name: 'Guardar token' }).click();
  await expect(page.getByRole('button', { name: 'Borrar' })).toHaveCount(2);
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Borrar' }).first().click();
  await expect(page.locator('.library-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Borrar' }).first().click();
  await expect(page.locator('.library-card')).toHaveCount(0);
});
