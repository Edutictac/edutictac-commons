const {chooseLanguage} = require('./helpers/language');
const {test, expect} = require('@playwright/test');

const resources = [
  {external_id: 'edutictac-play:game', provider: 'edutictac-play', title: 'Play game', play_url: '/play/game'},
  {external_id: 'quiz', provider: 'eduhoot', title: 'Quiz', source_url: 'http://localhost:8090/quiz'},
  {external_id: 'teacher-upload:document', provider: 'teacher-upload', title: 'Document', download_url: '/resources-api/documents/document/download'},
];
async function dashboard(page, {teacher = true, enabled = true} = {}) {
  const assignments = [], sent = [];
  await page.addInitScript(() => {
    localStorage.setItem('edutictac-portal-lang', 'va');
    localStorage.setItem('edutictac-commons-state', JSON.stringify({group: {id: 'group', group_code: 'Group'}}));
  });
  await page.route('**/api/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/modules/status') return route.fulfill({json: {enabled: enabled ? ['recursos'] : []}});
    if (path === '/api/teacher/activity-assignments' && route.request().method() === 'POST') {
      const payload = route.request().postDataJSON(); sent.push(payload);
      const assignment = {...payload, id: 'created-' + sent.length}; assignments.push(assignment);
      return route.fulfill({status: 201, json: {assignment}});
    }
    if (path === '/api/teacher/summary' && teacher) return route.fulfill({json: {groups: [{id:'group', name:'Group'}, {id:'other', name:'Other'}], total:0, active:0}});
    if (path === '/api/teacher/activity-assignments' && teacher) return route.fulfill({json:{assignments}});
    if (path === '/api/teacher/identities' && teacher) return route.fulfill({json:{identities:[]}});
    if (path === '/api/teacher/itineraries' && teacher) return route.fulfill({json:{itineraries:[]}});
    if (path === '/api/setup/status') return route.fulfill({json:{pending:false}});
    if (path === '/api/auth/oidc/status') return route.fulfill({json:{enabled:true}});
    return route.fulfill({status:401,json:{detail:'not authenticated'}});
  });
  await page.route('**/resources-api/**', route => route.fulfill({json: {items: resources}}));
  await page.goto('/teacher.html');
  if (teacher) await expect(page.locator('[data-select-group=other]')).toBeEnabled();
  if (enabled) await page.locator('summary').filter({has:page.locator('[data-i18n="teacher.resourcesBank"]')}).click();
  return sent;
}

test('cerca amb Enter, proveïdors, idioma i una única assignació', async ({page}) => {
  const sent = await dashboard(page);
  await page.locator('#resourceSearch').fill('  my search  ');
  const request = page.waitForRequest(request => request.url().includes('/resources-api/resources?'));
  await page.locator('#resourceSearch').press('Enter');
  expect(new URL((await request).url()).searchParams.get('q')).toBe('my search');
  await expect(page.locator('[data-assign-resource]')).toHaveCount(3);
  await chooseLanguage(page,'es');
  await expect(page.locator('#resourceSearch')).toHaveValue('  my search  ');
  await page.locator('[data-assign-resource="edutictac-play:game"]').click();
  await expect(page.locator('#resourcesOutput')).toContainText('Se han asignado 1');
  expect(sent).toHaveLength(1);
  expect(sent[0]).toMatchObject({group_id:'group',app_id:'edutictac-play',activity_id:'game'});
  await expect(page.locator('[data-select-assignment=created-1]')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-assign-resource=quiz]').click();
  await expect(page.locator('#resourcesOutput')).toContainText('Se han asignado 1');
  expect(sent[1]).toMatchObject({app_id:'eduhoot',activity_id:'quiz'});
  expect(new URL(sent[1].launch_url).port).toBe('8090');
  await page.locator('[data-assign-resource="teacher-upload:document"]').click();
  await expect(page.locator('[data-select-assignment=created-3]')).toHaveCount(1);
  expect(sent[2]).toMatchObject({app_id:'resource',activity_id:'teacher-upload:document'});
});

test('la cistella completa usa el grup capturat i no repetix els recursos confirmats', async ({page}) => {
  const sent = await dashboard(page);
  await page.locator('#loadFavoriteResources').click();
  await expect(page.locator('#assignFavoriteResources')).toBeEnabled();
  await page.locator('#assignFavoriteResources').click();
  await expect(page.locator('#resourcesOutput')).toContainText("S'han assignat 3 recursos");
  expect(sent.map(item => item.group_id)).toEqual(['group','group','group']);
  await expect(page.locator('[data-assign-resource]')).toHaveCount(0);
  await expect(page.locator('#assignFavoriteResources')).toBeDisabled();
});

for (const status of [200,401]) {
test(`canviar aula durant un enviament ${status} deté la resta de la cistella`, async ({page}) => {
  await dashboard(page);
  let release, started; const waiting = new Promise(resolve => started = resolve); const posts = [];
  await page.route('**/api/teacher/activity-assignments', async route => {
    if (route.request().method() !== 'POST') return route.fallback();
    const payload = route.request().postDataJSON(); posts.push(payload); started();
    await new Promise(resolve => release = resolve);
    await route.fulfill({status: status === 200 ? 201 : status,json: status === 200 ? {assignment:{...payload,id:'late'}} : {detail:'expired'}});
  });
  await page.locator('#loadFavoriteResources').click();
  await expect(page.locator('#assignFavoriteResources')).toBeEnabled();
  await page.locator('#assignFavoriteResources').click(); await waiting;
  await page.locator('[data-select-group=other]').click();
  await expect(page.locator('#assignFavoriteResources')).toBeDisabled();
  release();
  await expect(page.locator('#loadFavoriteResources')).toBeEnabled();
  await page.locator('#searchResources').click();
  await expect(page.locator('[data-assign-resource]')).toHaveCount(3);
  expect(posts).toHaveLength(1); expect(posts[0].group_id).toBe('group');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('edutictac-commons-state')).group.id)).toBe('other');
  await expect(page.locator('#resourcesOutput')).not.toContainText('assignat');
});

}

test('un error parcial conserva el recompte i bloqueja reintents automàtics', async ({page}) => {
  const sent = await dashboard(page); let requests = 0;
  await page.route('**/api/teacher/activity-assignments', route => {
    if (route.request().method() !== 'POST') return route.fallback();
    requests++;
    if (requests === 2) return route.fulfill({status:503,json:{detail:'temporary'}});
    return route.fallback();
  });
  await page.locator('#loadFavoriteResources').click();
  await expect(page.locator('#assignFavoriteResources')).toBeEnabled();
  await page.locator('#assignFavoriteResources').click();
  await expect(page.locator('#resourcesOutput')).toContainText('confirmat 1 assignacions');
  await expect(page.locator('[data-assign-resource]')).toHaveCount(2);
  await expect(page.locator('#assignFavoriteResources')).toBeDisabled();
  await expect(page.locator('[data-select-assignment=created-1]')).toHaveCount(1);
  expect(sent).toHaveLength(1); expect(requests).toBe(2);
});

test('favorits sense sessió pròpia no expulsen el docent de Commons', async ({page}) => {
  await dashboard(page);
  await page.route('**/resources-api/teacher/favorites?*', route => route.fulfill({status:401,json:{detail:'login'}}));
  await page.locator('#loadFavoriteResources').click();
  await expect(page.locator('#resourcesOutput')).toContainText('Recursos');
  await expect(page.locator('[data-select-group=other]')).toBeEnabled();
  await expect(page.locator('#refreshDashboard')).toBeEnabled();
});

for (const status of [200,401]) {
  test(`una cistella tardana ${status} no es mostra en una altra aula`, async ({page}) => {
    await dashboard(page); let release, started;
    const waiting = new Promise(resolve => started = resolve);
    await page.route('**/resources-api/teacher/favorites?*', async route => {
      started(); await new Promise(resolve => release = resolve);
      await route.fulfill({status,json:status === 200 ? {items:resources} : {detail:'login'}});
    });
    await page.locator('#loadFavoriteResources').click(); await waiting;
    await page.locator('[data-select-group=other]').click(); release();
    await page.locator('#searchResources').click();
    await expect(page.locator('[data-assign-resource]')).toHaveCount(3);
    await expect(page.locator('#assignFavoriteResources')).toBeDisabled();
    await expect(page.locator('#refreshDashboard')).toBeEnabled();
  });
}

test('recursos i títols perillosos no executen HTML ni s’envien', async ({page}) => {
  const sent = await dashboard(page);
  await page.route('**/resources-api/resources?*', route => route.fulfill({json:{items:[{external_id:'bad',title:'<img src=x onerror="window.bad=true">',source_url:'javascript:alert(1)'}]}}));
  await page.locator('#searchResources').click();
  await expect(page.locator('#resourcesOutput img')).toHaveCount(0);
  await page.locator('[data-assign-resource=bad]').click();
  await expect(page.locator('#resourcesOutput')).toContainText('no vàlid');
  expect(sent).toHaveLength(0); expect(await page.evaluate(() => window.bad)).toBeUndefined();
});

test('catàleg públic, assignació privada i mòdul desactivat', async ({page}) => {
  const sent = await dashboard(page,{teacher:false});
  await page.locator('#searchResources').click();
  await expect(page.locator('[data-assign-resource]')).toHaveCount(3);
  await expect(page.locator('[data-assign-resource]').first()).toBeDisabled();
  await expect(page.locator('#loadFavoriteResources')).toBeDisabled();
  expect(sent).toHaveLength(0);
  await page.unrouteAll({behavior:'wait'});
  await dashboard(page,{enabled:false});
  await expect(page.locator('[data-module=recursos]')).toBeHidden();
  await expect(page.locator('#searchResources')).toBeDisabled();
});


test('perdre sessió durant una assignació retira la cistella i bloqueja noves escriptures', async ({page}) => {
  await dashboard(page);
  await page.route('**/api/teacher/activity-assignments', route => route.request().method() === 'POST'
    ? route.fulfill({status:401,json:{detail:'expired'}}) : route.fallback());
  await page.locator('#loadFavoriteResources').click();
  await expect(page.locator('#assignFavoriteResources')).toBeEnabled();
  await page.locator('#assignFavoriteResources').click();
  await expect(page.locator('[data-assign-resource]')).toHaveCount(0);
  await expect(page.locator('#refreshDashboard')).toBeDisabled();
  await expect(page.locator('#assignFavoriteResources')).toBeDisabled();
});

test('una assignació guardada no es repetix si falla el refresc del tauler', async ({page}) => {
  const sent = await dashboard(page);
  await page.locator('#loadFavoriteResources').click();
  await expect(page.locator('#assignFavoriteResources')).toBeEnabled();
  await page.route('**/api/teacher/summary', route => route.fulfill({status:503,json:{detail:'temporary'}}));
  await page.locator('#assignFavoriteResources').click();
  await expect(page.locator('#resourcesOutput')).toContainText('no repetisques');
  await expect(page.locator('#assignFavoriteResources')).toBeDisabled();
  expect(sent).toHaveLength(3);
});
