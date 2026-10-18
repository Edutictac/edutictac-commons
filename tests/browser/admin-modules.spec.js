const { test, expect } = require('@playwright/test');

async function mockModules(page, { configured = true, conflict = false } = {}) {
  const state = { schema: 1, configured, enabled: configured ? ['play'] : [], revision: '1'.repeat(64),
    phase: 'idle', error: null, available: { play: true, eduhoot: true, recursos: true, quiosc: false }, manageable: true };
  let submitted;
  await page.addInitScript(() => localStorage.setItem('edutictac-admin-lang', 'es'));
  await page.clock.install();
  await page.route('**/admin/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/status')) return route.fulfill({ json: { stack_version: 'test', active_profiles: ['authentik'],
      services: {}, backups: [], backup_timer: {}, checked_at: 'test' } });
    if (path.endsWith('/modules') && route.request().method() === 'POST') {
      expect(route.request().headers()['x-commons-modules']).toBe('1');
      submitted = route.request().postDataJSON();
      if (conflict) {
        state.enabled = ['recursos']; state.revision = '2'.repeat(64);
        return route.fulfill({ status: 409, json: { ok: false, output: 'configuration_changed' } });
      }
      state.phase = 'applying';
      return route.fulfill({ status: 202, json: { ok: true, unit: 'edutictac-commons-modules-20261017120000-a1b2c3d4' } });
    }
    if (path.endsWith('/modules')) return route.fulfill({ json: state });
    if (path.endsWith('/job-status')) {
      state.enabled = submitted.enabled; state.revision = '2'.repeat(64); state.phase = 'idle'; state.configured = true;
      return route.fulfill({ json: { running: false, result: 'success', log: 'modules: success' } });
    }
    return route.fulfill({ status: 404, json: {} });
  });
  await page.goto('/admin/');
  return { state, submitted: () => submitted };
}

test('primer inici amb selector, idiomes i Quiosc pendent de preparar', async ({ page }) => {
  const model = await mockModules(page, { configured: false });
  const dialog = page.locator('#modulesWizard');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[value="quiosc"]')).toBeDisabled();
  await expect(dialog).toContainText('preparar Epoptes');
  await dialog.locator('[value="play"]').check();
  for (const [lang, text] of [['va', 'Ferramentes'], ['ca', 'eines'], ['en', 'tools'], ['es', 'herramientas']]) {
    await dialog.locator(`[data-lang="${lang}"]`).click();
    await expect(dialog.locator('#modulesWizardTitle')).toContainText(new RegExp(text, 'i'));
    await expect(dialog.locator('[value="play"]')).toBeChecked();
  }
  await dialog.locator('[value="recursos"]').check();
  await dialog.locator('#modulesApply').click();
  await expect(dialog).toBeHidden();
  expect(model.submitted()).toEqual({ enabled: ['play', 'recursos'], revision: '1'.repeat(64) });
  await page.clock.fastForward(3100);
  await expect(page.locator('#modulesNotice')).toContainText('actualizadas');
  await expect(page.locator('#modulesApply')).toBeEnabled();
});

test('desactivar conserva la selección vacía y permite cambiarla posteriormente', async ({ page }) => {
  const model = await mockModules(page);
  await expect(page.locator('#modulesChoices')).toBeEnabled();
  await page.locator('[value="play"]').uncheck();
  await page.locator('#modulesApply').click();
  await expect(page.locator('#modulesApply')).toBeDisabled();
  expect(model.submitted().enabled).toEqual([]);
  await page.clock.fastForward(3100);
  await expect(page.locator('#modulesApply')).toBeEnabled();
  await expect(page.locator('[value="play"]')).not.toBeChecked();
  await expect(page.locator('#modulesForm')).toContainText('conserva sus datos');
});

test('un administrador no sobrescribe una elección concurrente', async ({ page }) => {
  await mockModules(page, { conflict: true });
  await expect(page.locator('#modulesApply')).toBeEnabled();
  await page.locator('[value="eduhoot"]').check();
  await page.locator('#modulesApply').click();
  await expect(page.locator('#modulesNotice')).toContainText('otra sesión');
  await expect(page.locator('[value="recursos"]')).toBeChecked();
  await expect(page.locator('[value="eduhoot"]')).not.toBeChecked();
});

test('recargar el panel recupera el seguimiento de la operación', async ({ page }) => {
  await mockModules(page);
  await expect(page.locator('#modulesApply')).toBeEnabled();
  await page.locator('[value="eduhoot"]').check();
  await page.locator('#modulesApply').click();
  await page.reload();
  await expect(page.locator('#modulesNotice')).toContainText('Aplicando');
  await page.clock.fastForward(3100);
  await expect(page.locator('#modulesApply')).toBeEnabled();
  await expect(page.locator('[value="eduhoot"]')).toBeChecked();
});

test('la portada oculta módulos desactivados sin ocultar el acceso de administración', async ({ page }) => {
  await page.route('**/api/modules/status', (route) => route.fulfill({ json: { enabled: ['recursos'] } }));
  await page.goto('/');
  await expect(page.locator('#resourcesHomeLink')).toBeVisible();
  await expect(page.locator('#playHomeLink')).toBeHidden();
  await expect(page.locator('#eduhootHomeLink')).toBeHidden();
  await expect(page.locator('#adminHomeLink')).toBeVisible();
});


test('el backup completo se sigue tras recargar y tolera la pausa de los servicios', async ({ page }) => {
  await mockModules(page);
  await page.clock.pauseAt(await page.evaluate(() => new Date(Date.now() + 1000).toISOString()));
  const unit = 'edutictac-commons-backup-20261018060000-aabbccdd';
  let polls = 0;
  await page.route('**/admin/api/backup/create', route => {
    expect(route.request().headers()['x-commons-backup']).toBe('1');
    return route.fulfill({ status: 202, json: { ok: true, unit, output: 'backup_started' } });
  });
  await page.route('**/admin/api/job-status?*', route => {
    polls += 1;
    if (polls <= 2) return route.fulfill({ status: 401, json: {} });
    return route.fulfill({ json: { running: false, result: 'success', log: 'complete backup verified' } });
  });
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#backupCreateBtn').click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('commons-backup-job'))).toBe(unit);
  await page.reload();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.clock.fastForward(3100);
    await expect.poll(() => polls).toBe(attempt + 1);
  }
  await expect(page.locator('#actionOutput')).toContainText('complete backup verified');
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('commons-backup-job'))).toBe(null);
  await expect(page.locator('#backupCreateBtn')).toBeEnabled();
});
