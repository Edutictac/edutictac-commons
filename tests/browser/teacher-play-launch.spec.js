const { test, expect } = require('@playwright/test');

test('el botón de Play usa el puerto del servicio Play local', async ({ page }) => {
  const identity = { id: 'test-student', public_code: 'TEST01', avatar_icon: '🚀' };
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/auth/me') return route.fulfill({ json: { identity } });
    if (path === '/api/student/dashboard') {
      return route.fulfill({ json: {
        identity,
        assignments: [{ id: 'assignment-1', app_id: 'edutictac-play', activity_id: 'Ab12Cd34', title: 'Actividad Play', completed: false }],
      } });
    }
    if (path === '/api/student/launch-token') return route.fulfill({ json: { token: 'launch-test-token' } });
    if (path === '/api/health') return route.fulfill({ json: { status: 'ok' } });
    return route.fulfill({ status: 401, json: { detail: 'test unauthenticated' } });
  });
  await page.route('http://127.0.0.1:18084/**', (route) => route.abort());

  await page.goto('/student.html');
  const playRequest = page.waitForRequest((request) => request.url().startsWith('http://127.0.0.1:18084/play/'));
  await page.getByRole('button', { name: /Abrir actividad|Obrir activitat|Open activity/ }).click();
  expect((await playRequest).url()).toBe('http://127.0.0.1:18084/play/Ab12Cd34?launch_token=launch-test-token');
});
