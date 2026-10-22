const {test,expect}=require('@playwright/test');
const deployment={mode:'federated',authentikUrl:'https://id.example.test/',applications:{
  play:'https://example.test/play/',recursos:'https://resources.example.test/',eduhoot:'https://quiz.example.test/',blocs:'https://blocks.example.test/'}};
async function setup(page,config=deployment,oidc=true){
  await page.route('**/deployment.js',route=>route.fulfill({contentType:'text/javascript',body:'window.commonsDeployment='+JSON.stringify(config)+';'}));
  await page.route('**/api/**',route=>{
    const path=new URL(route.request().url()).pathname;
    if(path==='/api/modules/status')return route.fulfill({json:{enabled:['play','quiosc']}});
    if(path==='/api/auth/oidc/status')return route.fulfill({json:{enabled:oidc,issuer:'https://id.example.test/application/o/commons/'}});
    if(path==='/api/setup/status')return route.fulfill({json:{pending:true}});
    return route.fulfill({status:401,json:{detail:'unauthenticated'}});
  });
}

test('portal federat manté URL pròpies, identitat i llengües sense administració local',async({page})=>{
  await setup(page);await page.goto('/');
  await expect(page.locator('h1')).toHaveText('EduTicTac Commons');
  for(const [id,url] of Object.entries({playHomeLink:deployment.applications.play,resourcesHomeLink:deployment.applications.recursos,eduhootHomeLink:deployment.applications.eduhoot,blocsHomeLink:deployment.applications.blocs,authentikHomeLink:deployment.authentikUrl})){
    await expect(page.locator('#'+id)).toHaveAttribute('href',id==='playHomeLink'?url+'?lang='+await page.evaluate(()=>window.i18nPortal.getLang()):url);await expect(page.locator('#'+id)).toBeVisible();
  }
  await expect(page.locator('#adminHomeLink')).toBeHidden();
  await expect(page.locator('#firstRunSetupDialog')).toHaveCount(0);
  for(const language of ['es','va','ca','en']){
    await page.locator('[data-lang='+language+']').click();await expect(page.locator('h1')).toHaveText('EduTicTac Commons');
    await expect(page.locator('#playHomeLink')).toHaveAttribute('href',deployment.applications.play+'?lang='+language);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('accés docent federat no consulta instal·lador ni oferix Quiosc',async({page})=>{
  await setup(page);const setupRequests=[];
  page.on('request',request=>{if(request.url().includes('/api/setup/'))setupRequests.push(request.url());});
  await page.goto('/teacher.html');await expect(page.locator('#teacherOidcLogin')).toBeEnabled();
  await expect(page.locator('a[href="/quiosc.html"]')).toBeHidden();
  await expect(page.locator('#authentikNavLink')).toHaveAttribute('href',deployment.authentikUrl);
  await expect(page.locator('#teacherResourcesLink')).toHaveAttribute('href',deployment.applications.recursos);
  await expect(page.locator('#loadFavoriteResources')).toHaveCount(0);
  await expect(page.locator('#assignFavoriteResources')).toHaveCount(0);
  expect(setupRequests).toEqual([]);
});

test('identitat encara no activada deshabilita entrada sense demanar configurar servidor',async({page})=>{
  await setup(page,deployment,false);await page.goto('/teacher.html');
  await expect(page.locator('#teacherOidcLogin')).toBeDisabled();
  await expect(page.locator('#oidcSetupDialog')).not.toBeVisible();
  await expect(page.locator('#firstRunSetupDialog')).toHaveCount(0);
});

test('configuració no admet URL executables ni credencials en els enllaços',async({page})=>{
  await setup(page,{...deployment,applications:{play:'javascript:alert(1)',recursos:'https://user:password@example.test/'}});
  await page.goto('/');
  await expect(page.locator('#playHomeLink')).not.toHaveAttribute('href',/javascript:/);
  await expect(page.locator('#resourcesHomeLink')).not.toHaveAttribute('href',/password/);
});


test('guia federada explica assignació individual i obri el banc públic',async({page})=>{
  await setup(page); await page.goto('/teacher-help.html');
  await expect(page.locator('#helpResourcesLink')).toHaveAttribute('href',deployment.applications.recursos);
  for(const language of ['es','va','ca','en']) {
    await page.locator('[data-lang='+language+']').click();
    await expect(page.locator('[data-i18n="help.federated.step4Title"]')).not.toHaveText(/help\./);
    await expect(page.locator('[data-i18n="help.step4Text"]')).toHaveCount(0);
  }
});


test('avís central accessible i traduït sense prometre sessions comunes',async({page})=>{
  await setup(page); await page.goto('/');
  await expect(page.locator('a[href="/privacy.html"]')).toBeVisible();
  await page.locator('a[href="/privacy.html"]').click();
  for(const language of ['es','va','ca','en']) {
    await page.locator('[data-lang='+language+']').click();
    await expect(page.locator('[data-i18n="privacy.teacherText"]')).toContainText('EduTicTac');
    await expect(page.locator('[data-i18n="privacy.sessionText"]')).toContainText('180');
    await expect(page.locator('h1')).not.toHaveText(/privacy\./);
  }
});


test('avís beta visible en portada i taulers, traduït i sense desbordament',async({page})=>{
  await setup(page,{...deployment,releaseStage:'beta'});
  for(const path of ['/','/teacher.html','/student.html','/teacher-help.html','/privacy.html','/assets/','/blocs-access.html']) {
    await page.goto(path);
    await expect(page.locator('.beta-notice')).toBeVisible();
    await expect(page.locator('.beta-notice strong')).toHaveText('BETA');
    await expect(page.locator('.beta-notice span')).not.toHaveText('common.betaNotice');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.goto('/');
  for(const language of ['es','va','ca','en']) {
    await page.locator('[data-lang='+language+']').click();
    await expect(page.locator('.beta-notice span')).toContainText(/beta/i);
  }
});

test('el cartell beta es pot retirar amb la configuració del desplegament',async({page})=>{
  await setup(page);await page.goto('/');
  await expect(page.locator('.beta-notice')).toHaveCount(0);
});
