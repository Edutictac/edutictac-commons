const {test, expect} = require('@playwright/test');

// API simulada: el grup «a» és propi; «z» és d'una docent que ja no és al centre.
async function dashboard(page, {admin}) {
  let adminGroups = [
    {id: 'a', group_code: 'Aula a', tenant_id: 'centre', owner_id: 'oidc:owner', collaborators: 1, created_at: '2026-10-01'},
    {id: 'z', group_code: 'Aula z', tenant_id: 'centre', owner_id: 'oidc:gone', collaborators: 1, created_at: '2026-09-01'},
  ];
  const members = {
    a: [{teacher_id: 'oidc:owner', role: 'owner', created_at: '2026'}, {teacher_id: 'oidc:friend', role: 'teacher', created_at: '2026'}],
    z: [{teacher_id: 'oidc:gone', role: 'owner', created_at: '2026'}, {teacher_id: 'oidc:stay', role: 'teacher', created_at: '2026'}],
  };
  const calls = [];
  await page.addInitScript(() => {
    localStorage.setItem('edutictac-portal-lang', 'va');
    localStorage.setItem('edutictac-commons-state', JSON.stringify({group: {id: 'a', group_code: 'Aula a'}}));
  });
  await page.route('**/api/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname, method = request.method();
    if (path === '/api/admin/groups') {
      calls.push({path, method});
      return admin ? route.fulfill({json: {groups: adminGroups}}) : route.fulfill({status: 403, json: {detail: 'administrator required'}});
    }
    if (path === '/api/teacher/summary') return route.fulfill({json: {groups: [{id: 'a', name: 'Aula a', tenant_id: 'centre', active: 2}], active: 2, total: 2}});
    if (path === '/api/teacher/activity-assignments') return route.fulfill({json: {assignments: []}});
    if (path === '/api/teacher/identities') return route.fulfill({json: {identities: []}});
    if (path === '/api/teacher/itineraries') return route.fulfill({json: {itineraries: []}});
    const match = path.match(/^\/api\/teacher\/groups\/([az])(\/members|\/owner)?(?:\/(.+))?$/);
    if (match) {
      const [, id, kind, teacher] = match;
      calls.push({path, method, ...(request.postData() ? {body: request.postDataJSON()} : {})});
      if (kind === '/owner') {
        const {teacher_id: next} = request.postDataJSON();
        members[id] = members[id].map(member => ({...member, role: member.teacher_id === next ? 'owner' : 'teacher'}));
        adminGroups = adminGroups.map(group => group.id === id ? {...group, owner_id: next} : group);
        return route.fulfill({json: {group_id: id, owner_id: next, members: members[id]}});
      }
      if (kind === '/members' && teacher) { members[id] = members[id].filter(member => member.teacher_id !== decodeURIComponent(teacher)); return route.fulfill({json: {ok: true}}); }
      if (kind === '/members') return route.fulfill({json: {group_id: id, members: members[id]}});
      if (method === 'DELETE') { adminGroups = adminGroups.filter(group => group.id !== id); return route.fulfill({json: {deleted: id}}); }
    }
    if (path === '/api/setup/status') return route.fulfill({json: {pending: false}});
    if (path === '/api/auth/oidc/status') return route.fulfill({json: {enabled: true}});
    return route.fulfill({status: 401, json: {detail: 'test unauthenticated'}});
  });
  page.on('dialog', dialog => dialog.accept());
  await page.goto('/teacher.html');
  await expect(page.locator('#groupsPanel tbody tr')).toHaveCount(1);
  return calls;
}

test('el panell d’administració no apareix sense permís d’administració', async ({page}) => {
  const calls = await dashboard(page, {admin: false});
  await expect.poll(() => calls.filter(call => call.path === '/api/admin/groups').length).toBeGreaterThan(0);
  await expect(page.locator('#adminGroups')).toHaveCount(0);
});

test('administració rescata una aula: traspassa la propietat i l’elimina', async ({page}) => {
  const calls = await dashboard(page, {admin: true});
  await page.locator('#adminGroups summary').click();
  await expect(page.locator('#adminGroups')).toContainText('Grups del centre');
  await expect(page.locator('#adminGroups > .panel-content > .output tbody tr')).toHaveCount(2);

  await page.locator('[data-admin-group=z]').click();
  const panel = page.locator('#adminGroups section');
  await expect(panel.locator('h3')).toHaveText('Grup Aula z');
  await expect(panel.locator('tbody tr')).toHaveCount(2);
  await panel.locator('[data-make-owner="oidc:stay"]').click();
  await expect(panel.getByRole('status')).toContainText('oidc:stay és ara el propietari del grup');
  expect(calls).toContainEqual({path: '/api/teacher/groups/z/owner', method: 'PUT', body: {teacher_id: 'oidc:stay', expected_owner_id: 'oidc:gone'}});
  await expect(panel.locator('[data-make-owner="oidc:gone"]')).toBeVisible();

  await panel.locator('[data-remove-member="oidc:gone"]').click();
  await expect(panel.locator('tbody tr')).toHaveCount(1);

  await page.locator('#adminDeleteGroup').click();
  await expect(page.locator('#adminGroups section')).toHaveCount(0);
  await expect(page.locator('#adminGroups > .panel-content > .output tbody tr')).toHaveCount(1);
  expect(calls).toContainEqual({path: '/api/teacher/groups/z', method: 'DELETE'});
});

test('la propietària traspassa la seua aula des del panell de col·laboració', async ({page}) => {
  const calls = await dashboard(page, {admin: false});
  await page.locator('summary').filter({has: page.locator('[data-i18n="teacher.membersTitle"]')}).click();
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput tbody tr')).toHaveCount(2);
  await expect(page.locator('#membersOutput [data-make-owner="oidc:owner"]')).toHaveCount(0);
  await page.locator('#membersOutput [data-make-owner="oidc:friend"]').click();
  await expect(page.locator('#membersOutput').getByRole('status')).toContainText('oidc:friend és ara el propietari del grup');
  await expect(page.locator('#membersOutput tr').filter({hasText: 'oidc:owner'}).locator('[data-make-owner]')).toHaveCount(1);
  expect(calls).toContainEqual({path: '/api/teacher/groups/a/owner', method: 'PUT', body: {teacher_id: 'oidc:friend', expected_owner_id: 'oidc:owner'}});
});
