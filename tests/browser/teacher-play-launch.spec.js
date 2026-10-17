const { test, expect } = require('@playwright/test');

test('el botón de Play usa el puerto del servicio Play local', async ({ page }) => {
  const identity = { id: 'test-student', public_code: 'TEST01', avatar_icon: '🚀' };
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/auth/me') return route.fulfill({ json: { identity } });
    if (path === '/api/student/dashboard') {
      return route.fulfill({ json: {
        identity,
        assignments: [{ id: 'assignment-1', app_id: 'play', activity_id: 'Ab12Cd34', title: 'Actividad Play', completed: false }],
      } });
    }
    if (path === '/api/student/launch-token') return route.fulfill({ json: { token: 'launch-test-token' } });
    if (path === '/api/health') return route.fulfill({ json: { status: 'ok' } });
    return route.fulfill({ status: 401, json: { detail: 'test unauthenticated' } });
  });
  await page.route('http://127.0.0.1:18084/**', (route) => route.abort());

  await page.goto('/student.html');
  const playRequest = page.waitForRequest((request) => request.url().startsWith('http://127.0.0.1:18084/Ab12Cd34'));
  await page.getByRole('button', { name: /Abrir actividad|Obrir activitat|Open activity/ }).click();
  expect((await playRequest).url()).toBe('http://127.0.0.1:18084/Ab12Cd34?launch_token=launch-test-token');
});

test('el botón de Recursos registra el inicio y abre la actividad asignada', async ({ page }) => {
  const identity = { id: 'test-student', public_code: 'TEST01', avatar_icon: '🚀' };
  let launchAssignment;
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/auth/me') return route.fulfill({ json: { identity } });
    if (path === '/api/student/dashboard') {
      return route.fulfill({ json: {
        identity,
        assignments: [{
          id: 'resource-assignment-1',
          app_id: 'resource',
          activity_id: 'recurso-1',
          title: 'Recurso externo',
          launch_url: 'https://recursos.example.test/recurso-1',
          completed: false,
        }],
      } });
    }
    if (path === '/api/student/launch-token') {
      launchAssignment = route.request().postDataJSON().assignment_id;
      return route.fulfill({ json: { token: 'test-resource-launch' } });
    }
    return route.fulfill({ status: 401, json: { detail: 'test unauthenticated' } });
  });

  await page.addInitScript(() => {
    window.open = (url, target, features) => { window.testResourceWindow = { url, target, features }; };
  });
  await page.goto('/student.html');
  await page.getByRole('button', { name: /Abrir recurso|Obrir recurs|Open resource/ }).click();
  await expect.poll(() => page.evaluate(() => window.testResourceWindow)).toEqual({
    url: 'https://recursos.example.test/recurso-1', target: '_blank', features: 'noopener,noreferrer',
  });
  expect(launchAssignment).toBe('resource-assignment-1');
});

test('el panel del alumnado oculta las actividades completadas hasta mostrar el historial', async ({ page }) => {
  const identity = { id: 'test-student', public_code: 'TEST01', avatar_icon: '🚀' };
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/auth/me') return route.fulfill({ json: { identity } });
    if (path === '/api/student/dashboard') {
      return route.fulfill({ json: {
        identity,
        assignments: [
          { id: 'pending-1', app_id: 'edutictac-play', activity_id: 'Pending1', title: 'Pendiente', completed: false },
          { id: 'done-1', app_id: 'edutictac-play', activity_id: 'Done0001', title: 'Ya realizada', completed: true },
        ],
      } });
    }
    return route.fulfill({ status: 401, json: { detail: 'test unauthenticated' } });
  });

  await page.goto('/student.html');
  await expect(page.getByText('Pendiente')).toBeVisible();
  await expect(page.getByText('Ya realizada')).toBeHidden();
  await page.getByRole('button', { name: /Mostrar historial|Mostrar historial|Show history/ }).click();
  await expect(page.getByText('Ya realizada')).toBeVisible();
});


test('desactivar Play conserva las asignaciones y resultados sin ofrecer su lanzamiento', async ({ page }) => {
  const identity = { id: 'test-student', public_code: 'TEST01', avatar_icon: '🚀' };
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/modules/status') return route.fulfill({ json: { enabled: [] } });
    if (path === '/api/auth/me') return route.fulfill({ json: { identity } });
    if (path === '/api/student/dashboard') return route.fulfill({ json: { identity, assignments: [
      { id: 'pending-disabled', app_id: 'edutictac-play', activity_id: 'Pending1', title: 'Actividad conservada', completed: false },
      { id: 'done-disabled', app_id: 'edutictac-play', activity_id: 'Done0001', title: 'Resultado conservado', completed: true, best_score: 87 },
    ] } });
    return route.fulfill({ status: 401, json: {} });
  });
  await page.goto('/student.html');
  await expect(page.getByText('Actividad conservada')).toBeVisible();
  await expect(page.locator('[data-launch-play-assignment]')).toHaveCount(0);
  await page.getByRole('button', { name: /Mostrar historial|Show history/ }).click();
  await expect(page.getByText('Resultado conservado')).toBeVisible();
  await expect(page.locator('#studentOutput')).toContainText('87');
  await expect(page.locator('[data-launch-play-assignment]')).toHaveCount(0);
});
