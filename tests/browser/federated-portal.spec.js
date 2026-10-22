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
    await expect(page.locator('#'+id)).toHaveAttribute('href',url);await expect(page.locator('#'+id)).toBeVisible();
  }
  await expect(page.locator('#adminHomeLink')).toBeHidden();
  await expect(page.locator('#firstRunSetupDialog')).toHaveCount(0);
  for(const language of ['es','va','ca','en']){
    await page.locator('[data-lang='+language+']').click();await expect(page.locator('h1')).toHaveText('EduTicTac Commons');
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
