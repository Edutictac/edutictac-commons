const {chooseLanguage} = require('./helpers/language');
const {test, expect} = require('@playwright/test');
const initialIdentity = {id:'pupil',group_id:'class',public_code:'ABC',avatar_icon:'🚀'};
const activities = [
  {id:'done',app_id:'play',activity_id:'done',title:'Done activity',completed:true,best_score:0,last_score_at:'2026-10-21'},
  {id:'play',app_id:'edutictac-play',activity_id:'math',title:'Play activity',started:true},
  {id:'quiz',app_id:'eduhoot',activity_id:'quiz',title:'Quiz'},
  {id:'link',app_id:'resource',activity_id:'link',title:'Resource',launch_url:'/resource-view'},
  {id:'document:one',app_id:'resource',activity_id:'teacher-upload:document',title:'Document'},
];
async function student(page, {authenticated=true, enabled=['play','eduhoot','recursos'], items=activities}={}) {
  const model = {authenticated, identity:{...initialIdentity}, items:structuredClone(items), requests:[]};
  await page.addInitScript(() => localStorage.setItem('edutictac-portal-lang','va'));
  await page.route('**/api/**', route => {
    const request=route.request(), path=new URL(request.url()).pathname;
    if (path === '/api/modules/status') return route.fulfill({json:{enabled}});
    if (path === '/api/auth/student') {
      model.requests.push({path,method:request.method()}); model.authenticated=true;
      return route.fulfill({json:{identity:model.identity}});
    }
    if (path === '/api/auth/logout') { model.authenticated=false; return route.fulfill({json:{ok:true}}); }
    if (path === '/api/auth/me' && model.authenticated) return route.fulfill({json:{identity:model.identity}});
    if (path === '/api/student/dashboard' && model.authenticated) return route.fulfill({json:{identity:model.identity,assignments:model.items,selected_itinerary:{id:'journey',title:'Science'}}});
    if (path === '/api/student/profile' && model.authenticated) {
      model.identity={...model.identity,...request.postDataJSON()}; model.requests.push({path,method:request.method()});
      return route.fulfill({json:{identity:model.identity}});
    }
    if (path === '/api/student/launch-token' && model.authenticated) {
      model.requests.push({path,assignment:request.postDataJSON().assignment_id});
      return route.fulfill({status:201,json:{token:'synthetic-launch-token'}});
    }
    if (path === '/api/setup/status') return route.fulfill({json:{pending:false}});
    return route.fulfill({status:401,json:{detail:'unauthenticated'}});
  });
  await page.goto('/student.html');
  if(authenticated) await expect(page.locator('#refreshStudent')).toBeEnabled();
  else await expect(page.locator('#studentLogin')).toBeEnabled();
  return model;
}

async function login(page) {
  await page.locator('#studentCode').fill('abc');
  await page.locator('#studentPin').fill('1234');
  await page.locator('#studentPin').press('Enter');
}

test('codi i PIN amb Enter, neteja temporal i restauració de sessió', async ({page}) => {
  const model=await student(page,{authenticated:false});
  await login(page);
  await expect(page.locator('.student-profile')).toContainText('ABC');
  await expect(page.locator('#studentPin')).toHaveValue('');
  await expect(page.locator('#studentLoginPanel')).toBeHidden();
  expect(model.requests.filter(row=>row.path==='/api/auth/student')).toHaveLength(1);
  const storage=await page.evaluate(()=>({local: {...localStorage}, session:{...sessionStorage}}));
  expect(JSON.stringify(storage)).not.toContain('1234');
  expect(JSON.stringify(storage)).not.toContain('pupil');
  await page.reload();
  await expect(page.locator('.student-profile')).toContainText('ABC');
  await page.locator('#studentLogout').click();
  await expect(page.locator('.student-profile')).toHaveCount(0);
  await expect(page.locator('#studentLogin')).toBeEnabled();
  await expect(page.locator('#studentOutput')).toContainText('Sessió tancada');
});

test('itinerari, zero, historial i canvi d’idioma sense recarregar dades', async ({page}) => {
  await student(page);
  await expect(page.locator('[data-student-itinerary]')).toContainText('Science');
  await expect(page.locator('#studentOutput')).toContainText('1/5');
  await expect(page.getByText('Done activity',{exact:true})).toHaveCount(0);
  await page.locator('[data-toggle-student-history]').click();
  const row=page.locator('tr').filter({has:page.getByText('Done activity',{exact:true})});
  await expect(row.locator('td').nth(2)).toHaveText('0');
  let reads=0; page.on('request', request=>{if(request.url().includes('/api/student/dashboard'))reads++;});
  await chooseLanguage(page,'es');
  await expect(page.locator('[data-student-itinerary]')).toHaveText('Itinerario: Science');
  await expect(page.getByText('Done activity',{exact:true})).toBeVisible();
  expect(reads).toBe(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('avatar guardat, doble enviament bloquejat i resposta després d’eixir descartada', async ({page}) => {
  const model=await student(page);
  await page.locator('[data-student-icon="🦊"]').click();
  await expect(page.locator('[data-student-icon="🦊"]')).toHaveAttribute('aria-pressed','true');
  let release, started; const waiting=new Promise(resolve=>started=resolve);
  await page.route('**/api/student/profile',async route=>{
    started(); await new Promise(resolve=>release=resolve);
    await route.fulfill({json:{identity:{...model.identity,avatar_icon:'🐱'}}});
  });
  await page.locator('[data-student-icon="🐱"]').click(); await waiting;
  await expect(page.locator('[data-student-icon="🦊"]')).toBeDisabled();
  await page.locator('#studentLogout').click(); release();
  await expect(page.locator('#studentLogin')).toBeEnabled();
  await expect(page.locator('.student-profile')).toHaveCount(0);
});

for (const status of [200,401,503]) {
  test(`una lectura antiga ${status} no recupera dades després d’eixir i entrar amb un altre codi`, async ({page})=>{
    const model=await student(page); let release, started;
    const waiting=new Promise(resolve=>started=resolve);
    await page.route('**/api/student/dashboard',async route=>{
      if (!release) {
        started(); await new Promise(resolve=>release=resolve);
        await route.fulfill({status,json:status===200?{identity:initialIdentity,assignments:activities}: {detail:'old'}});
      } else await route.fallback();
    });
    await page.locator('#refreshStudent').click(); await waiting;
    await page.locator('#studentLogout').click();
    model.identity={id:'new-pupil',public_code:'XYZ',group_id:'other',avatar_icon:'🐼'}; model.items=[];
    await login(page);
    await expect(page.locator('.student-profile')).toContainText('XYZ');
    release();
    await chooseLanguage(page,'es');
    await expect(page.locator('.student-profile')).toContainText('XYZ');
    await expect(page.locator('#studentOutput')).not.toContainText('ABC');
  });
}

test('error de càrrega conserva sessió, retira resultats i permet reintentar', async ({page})=>{
  await student(page);
  await page.route('**/api/student/dashboard',route=>route.fulfill({status:503,json:{detail:'private server error'}}));
  await page.locator('#refreshStudent').click();
  await expect(page.locator('#studentOutput')).toContainText('No s’han pogut carregar');
  await expect(page.locator('tbody tr')).toHaveCount(0);
  await expect(page.locator('[data-student-icon]').first()).toBeDisabled();
  await expect(page.locator('#studentLogout')).toBeVisible();
  await page.unroute('**/api/student/dashboard');
  await page.locator('#refreshStudent').click();
  await expect(page.locator('tbody tr')).toHaveCount(4);
});

test('sessió caducada retira perfil i activitats, sense mostrar errors del servidor', async ({page})=>{
  await student(page);
  await page.route('**/api/student/dashboard',route=>route.fulfill({status:401,json:{detail:'private detail'}}));
  await page.locator('#refreshStudent').click();
  await expect(page.locator('.student-profile')).toHaveCount(0);
  await expect(page.locator('#studentLogin')).toBeEnabled();
  await expect(page.locator('#studentOutput')).toContainText('La sessió ha caducat');
  await expect(page.locator('#studentOutput')).not.toContainText('private detail');
});

test('PIN incorrecte i límit d’intents donen missatges traduïts', async ({page})=>{
  await student(page,{authenticated:false});
  for (const [status,text] of [[401,'Comprova el codi'],[429,'Espera un poc']]) {
    await page.route('**/api/auth/student',route=>route.fulfill({status,json:{detail:'private detail'}}));
    await login(page);
    await expect(page.locator('#studentOutput')).toContainText(text);
    await expect(page.locator('#studentPin')).toHaveValue('');
    await expect(page.locator('#studentLogin')).toBeEnabled();
  }
});

test('títols i codis amb HTML són text i els mòduls desactivats no s’obrin', async ({page})=>{
  await student(page,{enabled:[],items:[{id:'bad',app_id:'play',title:'<img src=x onerror="window.bad=true">',activity_id:'bad'}]});
  await expect(page.locator('tbody')).toContainText('<img src=x');
  await expect(page.locator('#studentOutput img')).toHaveCount(0);
  await expect(page.locator('[data-launch-play-assignment]')).toHaveCount(0);
  expect(await page.evaluate(()=>window.bad)).toBeUndefined();
});

for(const type of ['play','quiz']) {
  test(`llançament ${type} conserva identificadors, idioma i paràmetres`,async ({page})=>{
    const model=await student(page); let destination;
    await page.route(type==='play'?'**:18084/**':'**:8090/**',route=>{destination=new URL(route.request().url());return route.fulfill({contentType:'text/html',body:'<p>Activity</p>'});});
    await page.locator(type==='play'?'[data-launch-play-assignment=play]':'[data-launch-eduhoot-assignment=quiz]').click();
    await expect(page.getByText('Activity',{exact:true})).toBeVisible();
    expect(model.requests.at(-1).assignment).toBe(type);
    if(type==='play'){expect(destination.pathname).toBe('/math');expect(destination.searchParams.has('launch_token')).toBe(true);}
    else {expect(destination.pathname).toBe('/solo/');expect(destination.searchParams.get('id')).toBe('quiz');expect(destination.searchParams.get('lang')).toBe('va');expect(destination.searchParams.has('commonsLaunchToken')).toBe(true);}
  });
}

for(const document of [false,true]) {
  test(`recurs ${document?'document':'enllaç'} reserva pestanya abans de la xarxa i conserva aïllament`,async ({page,context})=>{
    await student(page);
    await context.route(document?'**/api/student/activity-assignments/**/resource?*':'**/resource-view',route=>route.fulfill({contentType:'text/html',body:'<p>Resource viewer</p>'}));
    const opened=context.waitForEvent('page');
    await page.locator(document?'[data-launch-document-assignment]':'[data-launch-resource-assignment]').click();
    const popup=await opened;
    await expect(popup.getByText('Resource viewer')).toBeVisible();
    expect(await popup.evaluate(()=>window.opener===null)).toBe(true);
    if(document){const url=new URL(popup.url());expect(decodeURIComponent(url.pathname)).toContain('/document:one/resource');expect(url.searchParams.has('launch_token')).toBe(true);}
    await popup.close();
  });
}

test('un URL executable no navega i tanca la pestanya provisional',async ({page,context})=>{
  await student(page,{items:[{id:'bad',app_id:'resource',activity_id:'bad',title:'Bad',launch_url:'javascript:window.bad=true'}]});
  await page.locator('[data-launch-resource-assignment]').click();
  await expect(page.locator('#studentOutput')).toContainText('No s’ha pogut obrir');
  expect(context.pages()).toHaveLength(1);
  expect(await page.evaluate(()=>window.bad)).toBeUndefined();
});

test('pestanyes bloquejades no registren un llançament',async ({page})=>{
  const model=await student(page);
  await page.evaluate(()=>window.open=()=>null);
  await page.locator('[data-launch-resource-assignment]').click();
  await expect(page.locator('#studentOutput')).toContainText('Permet obrir pestanyes');
  expect(model.requests.filter(row=>row.path.endsWith('launch-token'))).toHaveLength(0);
});

test('error en eixir es pot reintentar sense donar la sessió per tancada',async ({page})=>{
  await student(page);
  await page.route('**/api/auth/logout',route=>route.fulfill({status:503,json:{detail:'failed'}}));
  await page.locator('#studentLogout').click();
  await expect(page.locator('.student-profile')).toHaveCount(0);
  await expect(page.locator('#studentLogin')).toBeDisabled();
  await expect(page.locator('#studentOutput')).toContainText('No s’ha pogut confirmar');
  await page.unroute('**/api/auth/logout');
  await page.locator('#studentOutput').getByRole('button',{name:'Eixir',exact:true}).click();
  await expect(page.locator('#studentLogin')).toBeEnabled();
});

test('pagehide neteja PIN i snapshot; pageshow recupera únicament la sessió vigent',async ({page})=>{
  const model=await student(page);
  await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
  await expect(page.locator('#studentOutput')).toBeHidden();
  await expect(page.locator('#studentPin')).toHaveValue('');
  model.authenticated=false;
  await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
  await expect(page.locator('#studentOutput')).toBeVisible();
  await expect(page.locator('.student-profile')).toHaveCount(0);
  await expect(page.locator('#studentLogin')).toBeEnabled();
});

test('si falta el bundle hi ha un avís de recàrrega i la navegació continua',async ({page})=>{
  await page.addInitScript(() => localStorage.setItem('edutictac-portal-lang','va'));
  await page.route('**/assets/student-ui.js',route=>route.abort());
  await page.goto('/student.html');
  await expect(page.locator('#studentPanel')).toContainText('Torna a carregar');
  await expect(page.locator('edutictac-account .eta-home')).toHaveAttribute('href','/');
  await expect(page.locator('edutictac-account .eta-home')).toBeVisible();
});

for (const status of [200,401]) {
  test(`llançament tardà ${status} després d’eixir tanca la pestanya sense recuperar sessió`,async ({page,context})=>{
    await student(page); let release, started;
    const waiting=new Promise(resolve=>started=resolve);
    await page.route('**/api/student/launch-token',async route=>{
      started(); await new Promise(resolve=>release=resolve);
      await route.fulfill({status,json:status===200?{token:'synthetic-launch-token'}:{detail:'expired'}});
    });
    await page.locator('[data-launch-resource-assignment]').click(); await waiting;
    await page.locator('#studentLogout').click(); release();
    await expect(page.locator('#studentLogin')).toBeEnabled();
    await expect(page.locator('.student-profile')).toHaveCount(0);
    expect(context.pages()).toHaveLength(1);
  });
}

test('un doble submit del formulari no envia dos accessos',async ({page})=>{
  await student(page,{authenticated:false}); let release, started, requests=0;
  const waiting=new Promise(resolve=>started=resolve);
  await page.route('**/api/auth/student',async route=>{
    requests++; started(); await new Promise(resolve=>release=resolve); await route.fallback();
  });
  await page.locator('#studentCode').fill('abc'); await page.locator('#studentPin').fill('1234');
  await page.evaluate(()=>{const form=document.getElementById('studentLoginPanel');form.requestSubmit();form.requestSubmit();});
  await waiting; await expect(page.locator('#studentLogin')).toBeDisabled();
  await expect(page.locator('#studentPin')).toHaveValue('');
  release(); await expect(page.locator('.student-profile')).toBeVisible(); expect(requests).toBe(1);
});

for(const next of ['/assets/','https://example.test/','//example.test/']) {
  test(`el retorn després del PIN respecta la llista tancada: ${next}`,async ({page})=>{
    await student(page,{authenticated:false});
    await page.route('**/assets/',route=>route.fulfill({contentType:'text/html',body:'<p>Rebost destination</p>'}));
    await page.goto('/student.html?next='+encodeURIComponent(next));
    await expect(page.locator('#studentLogin')).toBeEnabled(); await login(page);
    if(next==='/assets/')await expect(page.getByText('Rebost destination')).toBeVisible();
    else {await expect(page.locator('.student-profile')).toBeVisible();expect(new URL(page.url()).pathname).toBe('/student.html');}
  });
}
