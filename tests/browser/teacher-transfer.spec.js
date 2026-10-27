const {test, expect} = require('@playwright/test');

test('la clau de trasllat apareix una vegada i desapareix en eixir', async ({page}) => {
  const key = 'A'.repeat(43);
  await page.addInitScript(() => {
    localStorage.setItem('edutictac-portal-lang', 'va');
    localStorage.setItem('edutictac-commons-state', JSON.stringify({
      group: {id: 'g1', group_code: 'GPROVA', tenant_id: 'centre'},
    }));
  });
  await page.route('**/api/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/setup/status') return route.fulfill({json: {pending: false}});
    if (path === '/api/auth/oidc/status') return route.fulfill({json: {enabled: true}});
    if (path === '/api/auth/me') return route.fulfill({json: {identity: {id: 'oidc:teacher', role: 'profesor'}}});
    if (path === '/api/teacher/transfer/status') return route.fulfill({json: {enabled: true}});
    if (path === '/api/teacher/summary') return route.fulfill({json: {groups: [{id: 'g1', name: 'GPROVA', tenant_id: 'centre', active: 1}], active: 1, total: 1}});
    if (path === '/api/teacher/activity-assignments') return route.fulfill({json: {assignments: []}});
    if (path === '/api/teacher/identities') return route.fulfill({json: {identities: []}});
    if (path === '/api/teacher/itineraries') return route.fulfill({json: {itineraries: []}});
    if (path === '/api/teacher/groups/g1/transfer/export') {
      return route.fulfill({json: {package: Buffer.from('ETC-AULA-1\nsynthetic').toString('base64'), recovery_key: key}});
    }
    return route.fulfill({status: 404, json: {detail: 'unavailable'}});
  });
  await page.goto('/teacher.html');
  const panel = page.getByRole('region', {name: 'Traslladar aula (prova)'});
  await expect(panel).toBeVisible();
  const download = page.waitForEvent('download');
  await panel.getByRole('button', {name: 'Exportar aula xifrada'}).click();
  expect((await download).suggestedFilename()).toBe('commons-aula-g1.etc');
  await expect(panel).toContainText(key);
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await expect(panel).not.toContainText(key);
  const stored = await page.evaluate(() => Object.values(localStorage).join(' '));
  expect(stored).not.toContain(key);
});

test('la importació envia el fitxer i neteja la clau després de confirmar', async ({page}) => {
  let imported = false, received = null;
  await page.addInitScript(() => {
    localStorage.setItem('edutictac-portal-lang', 'va');
  });
  await page.route('**/api/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/setup/status') return route.fulfill({json: {pending: false}});
    if (path === '/api/auth/oidc/status') return route.fulfill({json: {enabled: true}});
    if (path === '/api/auth/me') return route.fulfill({json: {identity: {id: 'oidc:teacher', role: 'profesor'}}});
    if (path === '/api/teacher/transfer/status') return route.fulfill({json: {enabled: true}});
    if (path === '/api/teacher/summary') return route.fulfill({json: {groups: imported ? [{id: 'g2', name: 'GPROVA', tenant_id: 'centre', active: 1}] : [], active: imported ? 1 : 0, total: imported ? 1 : 0}});
    if (path === '/api/teacher/activity-assignments') return route.fulfill({json: {assignments: []}});
    if (path === '/api/teacher/identities') return route.fulfill({json: {identities: []}});
    if (path === '/api/teacher/itineraries') return route.fulfill({json: {itineraries: []}});
    if (path === '/api/teacher/groups/transfer/import') {
      received = route.request().postDataJSON();
      imported = true;
      return route.fulfill({json: {group_id: 'g2', imported: true}});
    }
    return route.fulfill({status: 404, json: {detail: 'unavailable'}});
  });
  await page.goto('/teacher.html');
  const panel = page.getByRole('region', {name: 'Traslladar aula (prova)'});
  await expect(panel).toBeVisible();
  await panel.locator('input[type=file]').setInputFiles({
    name: 'aula.etc', mimeType: 'application/octet-stream', buffer: Buffer.from('synthetic encrypted bytes'),
  });
  await panel.getByRole('textbox', {name: 'Clau de recuperació'}).fill('B'.repeat(43));
  await panel.getByRole('button', {name: 'Importar aula xifrada'}).click();
  await expect(panel).toContainText('Aula importada.');
  await expect(panel.getByRole('textbox', {name: 'Clau de recuperació'})).toHaveValue('');
  expect(Buffer.from(received.package, 'base64').toString()).toBe('synthetic encrypted bytes');
  expect(received.recovery_key).toBe('B'.repeat(43));
  await expect(page.locator('#groupsPanel tbody tr')).toHaveCount(1);
});
