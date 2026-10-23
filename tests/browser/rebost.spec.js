const {test, expect} = require('@playwright/test');

const id = 'img-' + 'a'.repeat(64);
const revision = '1';
const item = {id, revision, name: '<img src=x onerror=alert(1)>', names: {es: 'Personaje', ca: 'Personatge'}, type: 'sprite', collection: 'scratch', readonly: true, width: 40, height: 40, family: {id, revision, count: 2}};
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL1sAAAAASUVORK5CYII=', 'base64');

async function mockAPI(page, authenticated = false) {
  let signedIn = authenticated;
  const requests = [];
  await page.route('**/api/assets/v1/**', async route => {
    const path = new URL(route.request().url()).pathname;
    requests.push(route.request().url());
    if (path.endsWith('/me')) return route.fulfill({status: signedIn ? 200 : 401, json: signedIn ? {capabilities: ['catalog', 'scratch_catalog']} : {detail: 'session_required'}});
    if (path.endsWith('/catalogs')) return route.fulfill({json: {capabilities: ['catalog', 'scratch_catalog']}});
    if (path.endsWith('/items')) {
      const collection = new URL(route.request().url()).searchParams.get('collection');
      return route.fulfill({json: {items: [{...item, ...(collection === 'mine' ? {collection: 'mine', readonly: false, family: undefined} : {})}], next_cursor: ''}});
    }
    if (path.endsWith('/family')) return route.fulfill({json: {id, revision, items: [{...item, family: undefined}]}});
    if (path.endsWith('/thumbnail') || path.endsWith('/content')) return route.fulfill({contentType: 'image/png', body: png});
    return route.fulfill({status: 404, json: {detail: 'not_found'}});
  });
  await page.route(/\/api\/auth\/session(\?|$)/, route => route.fulfill({json: {
    authenticated: signedIn, kind: signedIn ? 'oidc' : 'anonymous', role: signedIn ? 'profesor' : null,
    display_name: signedIn ? 'Docent Prova' : null, username: null, public_code: null, login_available: true,
    links: {login: '/api/auth/oidc/login?next=%2Fassets%2F', teacher: '/teacher.html', student: '/student.html', account: null, logout: '/api/auth/session/logout'},
  }}));
  return {requests, signIn(value) { signedIn = value; }};
}

test('public catalogues, private session loss and recovery, safe names', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const mock = await mockAPI(page);
  await page.addInitScript(() => {
    window.activeBlobs = new Set();
    const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = blob => { const url = create(blob); window.activeBlobs.add(url); return url; };
    URL.revokeObjectURL = url => { window.activeBlobs.delete(url); revoke(url); };
  });
  await page.goto('/assets/');
  await expect(page.locator('#grid > article')).toHaveCount(1);
  await page.locator('#mineTab').click();
  await expect(page.locator('#access')).toBeVisible();
  expect(mock.requests.filter(url => url.includes('collection=mine'))).toHaveLength(0);
  mock.signIn(true);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('article input')).toHaveValue(item.name);
  expect(await page.locator('article img').count()).toBe(1);
  await page.locator('.image').click();
  await expect(page.locator('#preview')).toBeVisible();
  mock.signIn(false);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('#access')).toBeVisible();
  await expect(page.locator('#grid > article')).toHaveCount(0);
  await expect(page.locator('#preview')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => window.activeBlobs.size)).toBe(0);
  expect(errors).toEqual([]);
});

for (const families of [false, true]) {
  test(`same-origin iframe selection, family negotiation=${families}`, async ({page}) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await mockAPI(page);
    // A local static document hosts the real selector; no editor internals are mocked.
    await page.goto('/assets/');
    await page.evaluate(families => {
      window.selections = [];
      window.addEventListener('message', event => {
        if (event.origin === location.origin) window.selections.push(event.data);
      });
      const frame = document.createElement('iframe');
      frame.id = 'picker';
      frame.src = '/assets/?mode=pick&collection=scratch&lang=es&type=sprite&request=check&selection=sprite' + (families ? '&supports_families=1' : '');
      document.body.append(frame);
    }, families);
    const picker = page.frameLocator('#picker');
    await picker.getByRole('button', {name: families ? 'Añadir personaje con disfraces' : 'Usar en el proyecto', exact: true}).click();
    expect(errors).toEqual([]);
    await expect.poll(() => page.evaluate(() => window.selections.length)).toBe(1);
    const selected = await page.evaluate(() => window.selections[0]);
    expect(selected).toEqual({format: 'rebost-selection', version: 1, request: 'check', id, name: 'Personaje', ...(families ? {family: true, familyRevision: revision} : {})});
    await picker.locator('#search').press('Escape');
    await expect.poll(() => page.evaluate(() => window.selections.length)).toBe(2);
    expect(await page.evaluate(() => window.selections[1])).toEqual({format: 'rebost-selection', version: 1, request: 'check', cancel: true});
  });
}


test('family revision mismatch is explained without displaying stale costumes', async ({page}) => {
  await mockAPI(page);
  await page.route('**/family', route => route.fulfill({json: {id, revision: 'changed', items: [item]}}));
  await page.goto('/assets/?collection=scratch');
  await page.locator('[data-lang=es]').click();
  await page.getByRole('button', {name: 'Ver disfraces', exact: true}).click();
  await expect(page.locator('#status')).toContainText('Esta imagen ha cambiado');
  await expect(page.locator('.family-costume')).toHaveCount(0);
  await expect(page.locator('#controls')).toBeEnabled();
});


test('visitant veu la sessió i ha d’entrar abans de guardar, sense còpies falses',async({page})=>{
  await mockAPI(page);let copies=0;
  await page.route('**/copies',route=>{copies++;return route.fulfill({json:{}});});
  await page.goto('/assets/?collection=catalog');await page.locator('[data-lang=es]').click();
  await expect(page.locator('edutictac-account summary')).toHaveAttribute('aria-label', 'Entrar');
  await expect(page.locator('edutictac-account .eta-home')).toHaveAttribute('href', '/');
  await expect(page.locator('#oidcLogin')).toBeVisible();
  await page.getByRole('button',{name:'Entrar para guardar una copia',exact:true}).click();
  await expect(page.locator('#status')).toContainText('Para guardar esta imagen, entra');
  expect(copies).toBe(0);
});

for(const refreshFails of [false,true]) {
  test(`guardar una còpia confirma el resultat, refresc fallit=${refreshFails}`,async({page})=>{
    await mockAPI(page,true);let copies=0;
    await page.route('**/copies',route=>{copies++;return route.fulfill({json:{item:{...item,collection:'mine',readonly:false}}});});
    if(refreshFails)await page.route('**/items?**',route=>{
      if(new URL(route.request().url()).searchParams.get('collection')==='mine')return route.fulfill({status:500,json:{detail:'operation_failed'}});
      return route.fallback();
    });
    await page.goto('/assets/?collection=catalog');await page.locator('[data-lang=es]').click();
    await expect(page.locator('edutictac-account summary')).toHaveAttribute('aria-label', 'Docent Prova · Profesorado');
    await expect(page.locator('#oidcLogin')).toBeHidden();
    await page.getByRole('button',{name:/^Guardar (esta imagen|en mis imágenes)$/}).click();
    await expect(page.locator('#status')).toContainText(refreshFails?'La imagen se ha guardado, pero':'Imagen guardada en Mis imágenes');
    expect(copies).toBe(1);
    if(!refreshFails)await expect(page.locator('article input')).toHaveCount(1);
  });
}


test('quatre idiomes compartits: selector únic, noms amb alternativa i errors reactius',async({page})=>{
  await mockAPI(page);
  await page.route('**/family',route=>route.fulfill({json:{id,revision:'changed',items:[item]}}));
  await page.goto('/assets/?collection=scratch');
  for(const [lang,heading,guest,name] of [
    ['es','Tu biblioteca de imágenes','Inicio de EduTicTac','Personaje'],
    ['va','La teua biblioteca d’imatges','Inici d’EduTicTac','Personatge'],
    ['ca','La teva biblioteca d’imatges','Inici d’EduTicTac','Personatge'],
    ['en','Your image library','EduTicTac home','Personaje']]) {
    await page.locator('[data-lang='+lang+']').click();
    await expect(page.locator('.role-heading h2')).toHaveText(heading);
    await expect(page.locator('edutictac-account .eta-home')).toHaveAttribute('aria-label', guest);
    await expect(page.locator('.lang-switcher .active')).toHaveCount(1);
    await expect(page.locator('.lang-switcher .active')).toHaveAttribute('data-lang',lang);
    await expect(page.locator('#grid > article > h2')).toHaveText(name);
    await expect(page.locator('body')).not.toContainText('rebost.');
  }
  await page.getByRole('button',{name:'View costumes',exact:true}).click();
  await expect(page.locator('#status')).toContainText('This image changed');
  await page.locator('[data-lang=es]').click();
  await expect(page.locator('#status')).toContainText('Esta imagen ha cambiado');
  await page.locator('[data-lang=en]').click();
  await page.reload();
  await expect(page.locator('.role-heading h2')).toHaveText('Your image library');
  await page.goto('/');
  await expect(page.locator('#welcomeTitle')).toContainText('Your classroom');
  await page.goto('/assets/');
  await expect(page.locator('.role-heading h2')).toHaveText('Your image library');
});

test('selector incrustat respecta anglés i conserva el contracte del projecte',async({page})=>{
  await mockAPI(page);await page.goto('/assets/');
  await page.evaluate(()=>{
    window.selections=[];
    window.addEventListener('message',event=>{if(event.origin===location.origin)window.selections.push(event.data);});
    const frame=document.createElement('iframe');frame.id='englishPicker';
    frame.src='/assets/?mode=pick&collection=scratch&lang=en&type=sprite&request=english-check';
    document.body.append(frame);
  });
  const picker=page.frameLocator('#englishPicker');
  await picker.getByRole('button',{name:'Use in the project',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>window.selections.length)).toBe(1);
  expect(await page.evaluate(()=>window.selections[0])).toEqual({format:'rebost-selection',version:1,request:'english-check',id,name:'Personaje'});
});


test('la biblioteca pot carregar els estils comuns darrere de proxies limitats a assets',async({page,request})=>{
  const canonical=await request.get('/styles.css'), alias=await request.get('/assets/commons.css');
  expect(alias.status()).toBe(200);
  expect(await alias.text()).toBe(await canonical.text());
  await mockAPI(page);
  await page.route('**/styles.css',route=>route.fulfill({status:404,body:''}));
  await page.goto('/assets/');
  await expect(page.locator('#oidcLogin')).toBeVisible();
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent').trim())).not.toBe('');
});
