const {chooseLanguage} = require('./helpers/language');
const {test, expect} = require('@playwright/test');

async function dashboard(page) {
  let groups = ['a', 'b'];
  const calls = [];
  const members = {a: [{teacher_id: 'oidc:owner', role: 'owner', created_at: '2026'}, {teacher_id: 'oidc:friend', role: 'teacher', created_at: '2026'}], b: [{teacher_id: 'oidc:other', role: 'owner', created_at: '2026'}]};
  await page.addInitScript(() => {
    localStorage.setItem('edutictac-portal-lang', 'va');
    localStorage.setItem('edutictac-commons-state', JSON.stringify({group: {id: 'a', group_code: 'Aula a'}}));
  });
  await page.route('**/api/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname;
    if (path === '/api/teacher/summary') return route.fulfill({json: {groups: groups.map(id => ({id, name: `Aula ${id}`, tenant_id: 'centre', active: 2})), active: 4, total: 4}});
    if (path === '/api/teacher/activity-assignments') return route.fulfill({json: {assignments: [{id: 'activity-b', title: 'Activity B', group_id: 'b', app_id: 'play', activity_id: 'activity-b'}]}});
    if (path === '/api/teacher/identities') return route.fulfill({json: {identities: []}});
    if (path === '/api/teacher/itineraries') return route.fulfill({json: {itineraries: []}});
    const match = path.match(/^\/api\/teacher\/groups\/([ab])(?:\/members(?:\/(.+))?)?$/);
    if (match) {
      const [, id, teacher] = match;
      calls.push({path, method: request.method(), ...(request.postData() ? {body: request.postDataJSON()} : {})});
      if (path.endsWith('/members')) {
        if (request.method() === 'POST') members[id].push({teacher_id: request.postDataJSON().teacher_id, role: 'teacher', created_at: '2026'});
        return route.fulfill({json: {group_id: id, members: members[id]}});
      }
      if (teacher) { members[id] = members[id].filter(member => member.teacher_id !== decodeURIComponent(teacher)); return route.fulfill({json: {ok: true}}); }
      if (request.method() === 'DELETE') { groups = groups.filter(value => value !== id); return route.fulfill({json: {deleted: id}}); }
    }
    if (path === '/api/setup/status') return route.fulfill({json: {pending: false}});
    if (path === '/api/auth/oidc/status') return route.fulfill({json: {enabled: true}});
    return route.fulfill({status: 401, json: {detail: 'test unauthenticated'}});
  });
  await page.goto('/teacher.html');
  await expect(page.locator('#groupsPanel tbody tr')).toHaveCount(2);
  await page.locator('summary').filter({has: page.locator('[data-i18n="teacher.membersTitle"]')}).click();
  return calls;
}

test('selecció d’aula i gestió de membres sense duplicar taules', async ({page}) => {
  const calls = await dashboard(page);
  await expect(page.locator('[data-select-group=a]')).toHaveCount(1);
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput tbody tr')).toHaveCount(2);
  await expect(page.locator('#membersOutput tr').filter({hasText: 'oidc:owner'}).getByRole('button')).toHaveCount(0);
  await page.locator('#memberTeacherId').fill('oidc:new-teacher');
  await page.locator('#memberTeacherId').press('Enter');
  await expect(page.locator('#membersOutput tbody tr')).toHaveCount(3);
  expect(calls.find(call => call.method === 'POST').body).toEqual({teacher_id: 'oidc:new-teacher', role: 'teacher'});
  await page.locator('#memberTeacherId').fill('oidc:draft');
  await chooseLanguage(page,'es');
  await expect(page.locator('#addGroupMember')).toHaveText('Añadir docente');
  await expect(page.locator('#memberTeacherId')).toHaveValue('oidc:draft');
  page.on('dialog', dialog => dialog.accept());
  await page.locator('[data-remove-member="oidc:new-teacher"]').click();
  await expect(page.locator('#membersOutput tbody tr')).toHaveCount(2);
  await page.locator('[data-select-group=b]').click();
  await expect(page.locator('[data-select-group=b]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#membersOutput table')).toHaveCount(0);
  await expect(page.locator('#memberTeacherId')).toHaveValue('');
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput')).toContainText('oidc:other');
});

test('un grup sense permís no exposa membres ni permet canvis, però deixa reintentar', async ({page}) => {
  const calls = await dashboard(page);
  await page.route('**/api/teacher/groups/a/members', route => route.fulfill({status: 404, json: {detail: 'group not found'}}));
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput [role=alert]')).toContainText('propietari');
  await expect(page.locator('#addGroupMember')).toBeDisabled();
  await expect(page.locator('#loadGroupMembers')).toBeEnabled();
  await expect(page.locator('#teacherOidcLogin')).not.toBeVisible();
  expect(calls.filter(call => call.method === 'POST')).toHaveLength(0);
});

for (const status of [200, 401]) {
  test(`els membres tardans ${status} d’una altra aula no tornen a pantalla`, async ({page}) => {
    await dashboard(page);
    let started, release;
    const requested = new Promise(resolve => {started = resolve;});
    const held = new Promise(resolve => {release = resolve;});
    await page.route('**/api/teacher/groups/a/members', async route => {
      started(); await held;
      return route.fulfill({status, json: {group_id: 'a', members: [{teacher_id: 'stale-teacher', role: 'teacher'}]}});
    });
    await page.locator('#loadGroupMembers').click(); await requested;
    await page.locator('[data-select-group=b]').click();
    await page.locator('#loadGroupMembers').click();
    await expect(page.locator('#membersOutput')).toContainText('oidc:other');
    const response = page.waitForResponse(value => value.url().endsWith('/groups/a/members'));
    release(); await response;
    await expect(page.locator('#membersOutput')).toContainText('oidc:other');
    await expect(page.locator('#membersOutput')).not.toContainText('stale-teacher');
    await expect(page.locator('#teacherOidcLogin')).not.toBeVisible();
  });
}

test('una alta pendent no esborra l’esborrany de l’aula nova', async ({page}) => {
  await dashboard(page);
  let started, release;
  const requested = new Promise(resolve => {started = resolve;});
  const held = new Promise(resolve => {release = resolve;});
  await page.route('**/api/teacher/groups/a/members', async route => {
    if (route.request().method() !== 'POST') return route.fallback();
    started(); await held; return route.fulfill({json: {group_id: 'a'}});
  });
  await page.locator('#memberTeacherId').fill('oidc:old');
  await page.locator('#memberTeacherId').press('Enter'); await requested;
  await page.locator('[data-select-group=b]').click();
  await page.locator('#memberTeacherId').fill('oidc:new');
  const response = page.waitForResponse(value => value.url().endsWith('/groups/a/members'));
  release(); await response;
  await expect(page.locator('#memberTeacherId')).toHaveValue('oidc:new');
  await expect(page.locator('#addGroupMember')).toBeEnabled();
});

test('confirmar l’eliminació només elimina l’aula capturada, mantenint una selecció posterior', async ({page}) => {
  const calls = await dashboard(page);
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#deleteGroup').click();
  expect(calls.filter(call => call.method === 'DELETE')).toHaveLength(0);
  let started, release;
  const requested = new Promise(resolve => {started = resolve;});
  const held = new Promise(resolve => {release = resolve;});
  await page.route('**/api/teacher/groups/a', async route => {
    started(); await held; return route.fallback();
  });
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#deleteGroup').click(); await requested;
  // Assignment selection lives outside the pending group selector.
  await page.locator('[data-select-assignment=activity-b]').click();
  await expect(page.locator('[data-select-group=b]')).toHaveAttribute('aria-pressed', 'true');
  release();
  await expect(page.locator('#groupsPanel tbody tr')).toHaveCount(1);
  await expect(page.locator('[data-select-group=b]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#deleteGroup')).toBeEnabled();
});

test('noms amb aparença d’HTML i identificadors invàlids es mantenen inerts', async ({page}) => {
  const calls = await dashboard(page);
  const hostile = '<img src=x onerror=alert(1)>';
  await page.route('**/api/teacher/groups/a/members', route => route.fulfill({json: {group_id: 'a', members: [{teacher_id: hostile, role: 'owner', created_at: '2026'}]}}));
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput')).toContainText(hostile);
  await expect(page.locator('#membersOutput img')).toHaveCount(0);
  await page.locator('#memberTeacherId').fill(hostile);
  await page.locator('#memberTeacherId').press('Enter');
  await expect(page.locator('#membersOutput [role=alert]')).toBeVisible();
  expect(calls.filter(call => call.method === 'POST')).toHaveLength(0);
});

test('un error de xarxa bloqueja canvis fins a carregar membres actuals', async ({page}) => {
  await dashboard(page);
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput tbody tr')).toHaveCount(2);
  let offline = true;
  await page.route('**/api/teacher/groups/a/members', route => offline ? route.fulfill({status: 503, json: {detail: 'unavailable'}}) : route.fallback());
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput [role=alert]')).toBeVisible();
  await expect(page.locator('#membersOutput tbody tr')).toHaveCount(0);
  await expect(page.locator('#addGroupMember')).toBeDisabled();
  offline = false;
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput tbody tr')).toHaveCount(2);
  await expect(page.locator('#addGroupMember')).toBeEnabled();
});

test('una sessió caducada retira tant les aules com els membres', async ({page}) => {
  await dashboard(page);
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput tbody tr')).toHaveCount(2);
  await page.route('**/api/teacher/groups/a/members', route => route.fulfill({status: 401, json: {detail: 'session_required'}}));
  await page.locator('#loadGroupMembers').click();
  await expect(page.locator('#membersOutput tbody tr')).toHaveCount(0);
  await expect(page.locator('#groupsPanel tbody tr')).toHaveCount(0);
  await expect(page.locator('#addGroupMember')).toBeDisabled();
  await expect(page.locator('#deleteGroup')).toBeDisabled();
  await expect(page.locator('#teacherOidcLogin')).toBeVisible();
});
