const {test,expect}=require('@playwright/test');
const backup='commons-20261021T090000Z';
async function admin(page,{authorized=true}={}){
 const model={authorized,calls:[],polls:0,status:{stack_version:'test',image_registry:'registry.example',image_tag:'test',active_profiles:['authentik'],services:{identity:{reachable:true,detail:'ready'}},backups:[{name:backup,created_at:'2026-10-21',stack_version:'test',update:{previous_image_tag:'old'}},{name:'broken',error:'invalid'}],backup_timer:{},backup_secondary:{enabled:true,mount:'/media/test',last:{}},checked_at:'test'}};
 await page.addInitScript(()=>localStorage.setItem('edutictac-admin-lang','es'));
 await page.route('**/api/**',async route=>{
  const request=route.request(),path=new URL(request.url()).pathname;
  if(request.method()==='POST'){model.calls.push({path,body:request.postData()?request.postDataJSON():null,headers:request.headers()});}
  if(path==='/api/auth/oidc/logout'){model.authorized=false;return route.fulfill({json:{ok:true}});}
  if(!model.authorized)return route.fulfill({status:401,json:{error:'unauthorized'}});
  if(path==='/admin/api/status')return route.fulfill({json:model.status});
  if(path==='/admin/api/modules')return route.fulfill({json:{schema:1,configured:true,enabled:['play'],revision:'1'.repeat(64),phase:'idle',available:{quiosc:false},manageable:true}});
  if(path==='/admin/api/teachers')return route.fulfill({status:201,json:{ok:true,teacher:{username:'teacher-test',temporary_password:'SYNTHETIC-ONLY-NOT-A-SECRET'}}});
  if(path==='/admin/api/updates')return route.fulfill({json:{registry:'registry.example',channel:'testing',commons:{current:'old',candidate:'new',update_available:true}}});
  if(path==='/admin/api/job-status'){model.polls++;return route.fulfill({json:{running:false,result:'success',log:'synthetic job completed'}});}
  if(path.includes('/content-sync/')||path.includes('/backup-timer/'))return route.fulfill({json:{ok:true,output:'synthetic completed'}});
  if(path==='/admin/api/images/update'||path==='/admin/api/images/rollback')return route.fulfill({status:202,json:{ok:true,unit:'edutictac-commons-'+(path.endsWith('update')?'update':'rollback')+'-20261022090000'}});
  if(path==='/admin/api/backup/restore')return route.fulfill({status:202,json:{ok:true,unit:'edutictac-commons-restore-20261022090000'}});
  return route.fulfill({status:404,json:{error:'not found'}});
 });
 await page.goto('/admin/');
 if(authorized)await expect(page.locator('#modulesApply')).toBeEnabled();
 else await expect(page.locator('#apiStatus')).toContainText('sesión');
 return model;
}
async function teacherForm(page){await page.locator('#teacherUsername').fill('teacher-test');await page.locator('#teacherName').fill('Synthetic teacher');await page.locator('#teacherEmail').fill('synthetic@example.test');}
async function advanceJob(page){await expect(page.locator('#jobTracking')).toHaveAttribute('data-state','waiting');await page.clock.fastForward(3100);}

test('sense sessió totes les escriptures estan desactivades, fins i tot submit sintètic',async({page})=>{
 const model=await admin(page,{authorized:false});await expect(page.locator('#backupCreateBtn')).toBeDisabled();await expect(page.locator('#teacherUsername')).toBeDisabled();await expect(page.locator('#imagesUpdateBtn')).toBeDisabled();
 await page.locator('#teacherForm').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));expect(model.calls).toHaveLength(0);
});

test('alta docent, neteja explícita i absència de contrasenya en storage',async({page})=>{
 const model=await admin(page);await teacherForm(page);await page.locator('#teacherForm button[type=submit]').click();
 await expect(page.locator('#teacherOutput')).toContainText('SYNTHETIC-ONLY-NOT-A-SECRET');
 expect(model.calls[0].body).toEqual({username:'teacher-test',name:'Synthetic teacher',email:'synthetic@example.test'});
 expect(await page.evaluate(()=>JSON.stringify([Object.values(localStorage),Object.values(sessionStorage)]))).not.toContain('SYNTHETIC-ONLY');
 await page.locator('#clearTeacherCredential').click();await expect(page.locator('#teacherOutput')).not.toContainText('SYNTHETIC-ONLY');
 await teacherForm(page);await page.locator('#teacherForm button[type=submit]').click();await expect(page.locator('#clearTeacherCredential')).toBeVisible();
 await page.locator('#logoutBtn').click();await expect(page.locator('#teacherOutput')).not.toContainText('SYNTHETIC-ONLY');await expect(page.locator('#teacherUsername')).toHaveValue('');await expect(page.locator('#modulesApply')).toBeDisabled();
});

test('doble alta no crea dos docents i resposta tardana no reapareix després d’eixir',async({page})=>{
 const model=await admin(page);let release,started;const waiting=new Promise(resolve=>started=resolve);let calls=0;
 await page.route('**/admin/api/teachers',async route=>{calls++;started();await new Promise(resolve=>release=resolve);await route.fulfill({status:201,json:{teacher:{username:'old',temporary_password:'SYNTHETIC-LATE'}}});});
 await teacherForm(page);await page.locator('#teacherForm button[type=submit]').click();await waiting;
 await page.locator('#teacherForm').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 // Simulate navigating away while the server still finishes the request.
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide')));release();model.authorized=false;
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
 await expect(page.locator('#teacherUsername')).toBeDisabled();await expect(page.locator('#teacherOutput')).not.toContainText('SYNTHETIC-LATE');expect(calls).toBe(1);
});

test('pagehide neteja dades i el retorn valida de nou la sessió',async({page})=>{
 const model=await admin(page);await teacherForm(page);await page.locator('#teacherForm button[type=submit]').click();await expect(page.locator('#clearTeacherCredential')).toBeVisible();
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide')));await expect(page.locator('#adminApp')).toBeHidden();
 model.authorized=false;await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await expect(page.locator('#backupCreateBtn')).toBeDisabled();
 await expect(page.locator('#teacherOutput')).not.toContainText('SYNTHETIC-ONLY');await expect(page.locator('#statusOutput')).not.toContainText('registry.example');
});

test('actualitzar estat i idioma conserva esborranys i selecció de mòduls',async({page})=>{
 await admin(page);await teacherForm(page);await page.locator('#secondaryMount').fill('/media/new disk');await page.locator('[value=recursos]').check();
 await page.locator('#refreshBtn').click();await expect(page.locator('#refreshBtn')).toBeEnabled();await expect(page.locator('#secondaryMount')).toHaveValue('/media/new disk');await expect(page.locator('[value=recursos]')).toBeChecked();
 for(const [lang,label] of [['en','Create teacher'],['ca','Crear docent'],['va','Crear docent'],['es','Crear docente']]){
  await page.locator('header [data-lang='+lang+']').click();await expect(page.locator('#teacherForm button')).toHaveText(label);await expect(page.locator('#teacherName')).toHaveValue('Synthetic teacher');
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

for(const [type,word] of [['restore','RESTAURAR'],['update','ACTUALIZAR'],['rollback','VOLVER']]){
 test(`${type}: confirmació exacta, contracte i seguiment recuperat en recarregar`,async({page})=>{
  await page.clock.install();await page.clock.pauseAt(new Date());const model=await admin(page);
  const button=type==='restore'?'#backupRestoreBtn':type==='update'?'#imagesUpdateBtn':'#imagesRollbackBtn';
  page.once('dialog',dialog=>dialog.accept('wrong'));await page.locator(button).click();expect(model.calls).toHaveLength(0);
  page.once('dialog',dialog=>dialog.accept(word));await page.locator(button).click();await expect(page.locator('#backupCreateBtn')).toBeDisabled();
  const sent=model.calls[0];expect(sent.path).toBe('/admin/api/'+(type==='restore'?'backup/restore':'images/'+type));expect(sent.body).toEqual(type==='update'?{}:{backup});
  if(type==='restore')expect(sent.headers['x-commons-backup']).toBe('1');
  await page.reload();await advanceJob(page);await expect(page.locator('#actionOutput')).toContainText('synthetic job completed');await expect(page.locator('#backupCreateBtn')).toBeEnabled();
 });
}

test('timers i sincronització mantenen rutes, confirmació i errors inerts',async({page})=>{
 const model=await admin(page);page.once('dialog',dialog=>dialog.dismiss());await page.locator('#timerInstallBtn').click();expect(model.calls).toHaveLength(0);
 page.once('dialog',dialog=>dialog.accept());await page.locator('#timerInstallBtn').click();await expect(page.locator('#actionOutput')).toContainText('synthetic completed');
 await page.locator('#imagesCheckBtn').click();await expect(page.locator('#actionOutput')).toContainText('new');
 await page.locator('#contentResourcesSyncBtn').click();await expect(page.locator('#contentResourcesSyncBtn')).toBeEnabled();
 expect(model.calls.map(c=>c.path)).toContain('/admin/api/content-sync/resources');
 await page.route('**/admin/api/content-sync/eduhoot',route=>route.fulfill({status:500,json:{output:'<img src=x onerror=alert(1)>'}}));
 await page.locator('#contentEduhootSyncBtn').click();await expect(page.locator('#actionOutput')).toHaveClass(/error/);await expect(page.locator('#actionOutput img')).toHaveCount(0);
});

test('un 401 retira dades i no envia altres accions administratives',async({page})=>{
 const model=await admin(page);await teacherForm(page);await page.locator('#teacherForm button[type=submit]').click();await expect(page.locator('#clearTeacherCredential')).toBeVisible();
 model.authorized=false;await page.locator('#imagesCheckBtn').click();await expect(page.locator('#apiStatus')).toContainText('sesión');await expect(page.locator('#teacherOutput')).not.toContainText('SYNTHETIC-ONLY');await expect(page.locator('#backupCreateBtn')).toBeDisabled();
});

test('unitats guardades no vàlides es descarten i el fallback del bundle és llegible',async({page})=>{
 await page.addInitScript(()=>{sessionStorage.setItem('commons-images-job','../../unsafe');sessionStorage.setItem('commons-backup-job','javascript:unsafe');});
 await admin(page);await expect(page.locator('#backupCreateBtn')).toBeEnabled();expect(await page.evaluate(()=>sessionStorage.getItem('commons-images-job'))).toBe(null);
 await page.route('**/assets/admin-ui.js',route=>route.abort());await page.reload();await expect(page.locator('#adminApp')).toContainText('Recarga la página');
});
