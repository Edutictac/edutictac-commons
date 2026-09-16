const { test, expect } = require('@playwright/test');

const moodleUser = process.env.MOODLE_USER;
const moodlePassword = process.env.MOODLE_PASSWORD;
const courseId = process.env.MOODLE_COURSE_ID;
const playUrl = process.env.PLAY_URL || 'http://127.0.0.1:8084';

test('EduTicTac Play exporta e importa un H5P en Moodle', async ({ page, request }, testInfo) => {
  test.skip(!moodleUser || !moodlePassword || !courseId,
    'Configura MOODLE_USER, MOODLE_PASSWORD y MOODLE_COURSE_ID para probar la importación.');

  const title = `EduTicTac Play test ${Date.now()}`;
  const created = await request.post(`${playUrl}/api/activities`, {
    data: {
      title,
      question: '¿Cuál es una herramienta libre?',
      answers: [
        { text: 'Moodle', correct: true },
        { text: 'Una respuesta de prueba', correct: false },
      ],
    },
  });
  expect(created.ok()).toBeTruthy();
  const activity = await created.json();
  const download = await request.get(`${playUrl}/api/activities/${activity.id}/download`);
  expect(download.ok()).toBeTruthy();
  const h5pFile = testInfo.outputPath(`${activity.id}.h5p`);
  require('fs').writeFileSync(h5pFile, await download.body());

  await page.goto('login/index.php', { waitUntil: 'domcontentloaded', timeout: 15_000 });
  const usernameInput = page.locator('input[name="username"]:visible').first();
  if (await usernameInput.count()) {
    await usernameInput.fill(moodleUser);
    await page.locator('input[name="password"]:visible').first().fill(moodlePassword);
    await page.locator('button[type="submit"], input[type="submit"]').first().click();
  }
  await expect(page).not.toHaveURL(/login/);

  await page.goto(`course/view.php?id=${encodeURIComponent(courseId)}`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
  const contentBankLink = page.locator('a[href*="contentbank/index.php"]').first();
  await expect(contentBankLink).toHaveCount(1);
  const contentBankUrl = await contentBankLink.getAttribute('href');
  await page.goto(contentBankUrl, { waitUntil: 'domcontentloaded', timeout: 15_000 });

  await page.getByRole('link', { name: /upload|pujar|subir/i }).click();
  await page.locator('input.fp-btn-choose').click();
  await page.getByText(/upload file|pujar un archivo|subir un archivo/i).click();
  await page.locator('input[type="file"]').setInputFiles(h5pFile);
  await page.getByRole('button', { name: /upload this file|pujar este archivo|subir este archivo/i }).click();
  await page.getByRole('button', { name: /save changes|guardar cambios|desa els canvis/i }).click();

  await expect(page).toHaveURL(/contentbank\/view\.php/);
  await expect.poll(() => page.frames().some((frame) => frame.url() === 'about:blank')).toBeTruthy();
  const h5pFrame = page.frames().find((frame) => frame.url() === 'about:blank');
  await expect(h5pFrame.getByText('¿Cuál es una herramienta libre?')).toBeVisible();
});
