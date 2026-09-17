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

test('crear y reproducir un reto con varias actividades', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Modo reto' }).click();
  await page.locator('#title').fill('Reto de ciencias');
  await page.locator('#question').fill('Supera estas dos pruebas');
  await page.locator('.compound-step').nth(0).locator('.compound-title').fill('Quiz');
  await page.locator('.compound-step').nth(0).locator('.compound-question').fill('¿Cuál vuela?');
  await page.locator('.compound-step').nth(0).locator('.compound-answers').fill('*Águila\nGato');
  await page.locator('.compound-step').nth(1).locator('.compound-type').selectOption('true-false');
  await page.locator('.compound-step').nth(1).locator('.compound-title').fill('Verdadero o falso');
  await page.locator('.compound-step').nth(1).locator('.compound-question').fill('El agua moja.');
  await page.getByRole('button', { name: 'Previsualizar' }).click();
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.getByText('¿Cuál vuela?')).toBeVisible();
  await expect(player.getByRole('link', { name: /Siguiente/ })).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
});

test('añadir una actividad guardada desde el banco a un reto', async ({ page, request }) => {
  const title = `Actividad del banco ${Date.now()}`;
  const response = await request.post('/play/api/activities', {
    data: {
      type: 'multiple-choice',
      title,
      question: '¿Qué planeta habitamos?',
      answers: [{ text: 'La Tierra', correct: true }, { text: 'Marte', correct: false }],
    },
  });
  expect(response.ok()).toBeTruthy();

  await page.goto('/play/');
  await page.getByRole('button', { name: 'Modo reto' }).click();
  await page.getByRole('button', { name: 'Añadir desde el banco' }).click();
  await expect(page.locator('#compoundBankDialog')).toBeVisible();
  await page.locator('#compoundBankSearch').fill(title);
  await page.locator('#compoundBankList article').filter({ hasText: title }).getByRole('button', { name: 'Añadir' }).click();
  await expect(page.locator('.compound-step')).toHaveCount(3);
  await expect(page.locator('.compound-step').last().locator('.compound-title')).toHaveValue(title);
  await expect(page.locator('.compound-step').last()).toContainText('Copia del banco');
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

test('crear y reproducir una actividad de ordenar', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Ordenar' }).click();
  await page.locator('#title').fill('Ciclo de una planta');
  await page.locator('#question').fill('Ordena las fases');
  await page.locator('.classify-text').nth(0).fill('Semilla');
  await page.locator('.classify-category').nth(0).selectOption('0');
  await page.locator('.classify-text').nth(1).fill('Planta');
  await page.locator('.classify-category').nth(1).selectOption('1');
  await page.locator('.classify-text').nth(2).fill('Flor');
  await page.locator('.classify-category').nth(2).selectOption('2');
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.getByRole('button', { name: /Posición 1/ })).toBeVisible();
  await expect(player.getByRole('button', { name: /Posición 2/ })).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
});

test('crear y reproducir una actividad de rellenar huecos', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Rellenar huecos' }).click();
  await page.locator('#title').fill('Ciencia básica');
  await page.locator('#question').fill('Completa la frase');
  await page.locator('#fillBlanksText').fill('El agua hierve a *100* grados.');
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.locator('input.h5p-text-input')).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
});

test('crear y reproducir una sopa de letras', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Sopa de letras' }).click();
  await page.locator('#title').fill('Naturaleza');
  await page.locator('#question').fill('Encuentra las palabras');
  await page.locator('.find-word').nth(0).fill('agua');
  await page.locator('.find-word').nth(1).fill('tierra');
  await page.locator('.find-word').nth(2).fill('planta');
  await page.locator('.find-word').nth(3).fill('animal');
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.locator('.h5p-find-the-words')).toBeVisible();
  await expect(player.getByText('agua', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
});

test('crear y reproducir una actividad de arrastrar palabras', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Arrastrar palabras' }).click();
  await page.locator('#title').fill('Planetas');
  await page.locator('#question').fill('Completa la frase');
  await page.locator('#dragTextText').fill('La Tierra gira alrededor del *Sol*.');
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.locator('.h5p-drag-text')).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
});

test('crear y reproducir una actividad de marcar palabras', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Marcar palabras' }).click();
  await page.locator('#title').fill('Gramática');
  await page.locator('#question').fill('Señala los adjetivos');
  await page.locator('#markWordsText').fill('El *rápido* guepardo cruzó la *seca* llanura.');
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.locator('.h5p-mark-the-words')).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
});

test('crear y reproducir tarjetas de estudio', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Tarjetas de estudio' }).click();
  await page.locator('#title').fill('Repaso');
  await page.locator('#question').fill('Estudia estos conceptos');
  await page.locator('.dialog-front').nth(0).fill('Capital de Francia');
  await page.locator('.dialog-back').nth(0).fill('París');
  await page.locator('.dialog-front').nth(1).fill('Planeta rojo');
  await page.locator('.dialog-back').nth(1).fill('Marte');
  await page.locator('.dialog-front').nth(2).fill('2 + 2');
  await page.locator('.dialog-back').nth(2).fill('4');
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.locator('.h5p-dialogcards')).toBeVisible();
  await expect(player.getByText('Capital de Francia')).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
});

test('crear y reproducir un crucigrama', async ({ page }) => {
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Crucigrama' }).click();
  await page.locator('#title').fill('Naturaleza');
  await page.locator('#question').fill('Resuelve el crucigrama');
  await page.locator('.crossword-answer').nth(0).fill('planeta');
  await page.locator('.crossword-clue').nth(0).fill('Cuerpo que gira alrededor de una estrella');
  await page.locator('.crossword-answer').nth(1).fill('oceano');
  await page.locator('.crossword-clue').nth(1).fill('Gran extensión de agua salada');
  await page.locator('.crossword-answer').nth(2).fill('montana');
  await page.locator('.crossword-clue').nth(2).fill('Elevación natural del terreno');
  await page.locator('.crossword-answer').nth(3).fill('bosque');
  await page.locator('.crossword-clue').nth(3).fill('Lugar poblado de árboles');
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.locator('.h5p-crossword')).toBeVisible();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('#download')).toBeVisible();
});

test('el crucigrama mantiene una cuadrícula usable en tablet', async ({ page }) => {
  await page.setViewportSize({ width: 810, height: 1080 });
  await page.goto('/play/');
  await page.getByRole('button', { name: 'Crucigrama' }).click();
  await page.locator('#title').fill('Crucigrama tablet');
  await page.locator('#question').fill('Resuelve');
  for (const [index, word, clue] of [
    [0, 'planeta', 'Cuerpo'], [1, 'oceano', 'Agua'], [2, 'montana', 'Tierra'], [3, 'bosque', 'Arboles'],
  ]) {
    await page.locator('.crossword-answer').nth(index).fill(word);
    await page.locator('.crossword-clue').nth(index).fill(clue);
  }
  await page.getByRole('button', { name: 'Previsualizar' }).click({ force: true });
  await expect(page.locator('#savePreview')).toBeVisible();
  await expect.poll(() => page.frames().length).toBeGreaterThan(1);
  const player = page.frames().find((frame) => frame !== page.mainFrame());
  await expect(player.locator('.h5p-crossword')).toBeVisible();
  await expect.poll(() => page.locator('iframe').evaluate((iframe) => iframe.clientHeight)).toBeGreaterThan(700);
  await expect.poll(() => player.locator('.h5p-crossword-grid').evaluate((grid) => grid.clientWidth)).toBeGreaterThan(500);
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
