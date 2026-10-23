const {chooseLanguage}=require('./helpers/language');
const {test,expect}=require('@playwright/test');
const fs=require('fs'),os=require('os'),path=require('path');
const settings={max_file_bytes:50*1048576,group_quota_bytes:500*1048576,student_quota_bytes:50*1048576,students_can_upload:true};
async function setup(page,student=false){
 const model={rows:{G:[],H:[]},posts:[],identity:student?{id:'pupil-a',group_id:'G',public_code:'ABC'}:null};
 await page.addInitScript(()=>{localStorage.setItem('edutictac-portal-lang','va');localStorage.setItem('edutictac-commons-state',JSON.stringify({group:{id:'G',group_code:'Aula G'}}));});
 await page.route('**/api/**',async route=>{
  const req=route.request(),url=new URL(req.url()),p=url.pathname,method=req.method();
  if(p==='/api/setup/status')return route.fulfill({json:{pending:false}});
  if(p==='/api/auth/oidc/status')return route.fulfill({json:{enabled:true}});
  if(p==='/api/modules/status')return route.fulfill({json:{enabled:[]}});
  if(p==='/api/auth/student'){model.identity={id:req.postDataJSON().public_code==='DEF'?'pupil-b':'pupil-a',group_id:'G',public_code:req.postDataJSON().public_code};return route.fulfill({json:{identity:model.identity}});}
  if(p==='/api/auth/logout'){model.identity=null;return route.fulfill({json:{ok:true}});}
  if(p==='/api/student/dashboard')return route.fulfill({status:model.identity?200:401,json:model.identity?{identity:model.identity,assignments:[]}:{detail:'not authenticated'}});
  if(p==='/api/teacher/summary')return route.fulfill({json:{groups:[{id:'G',name:'Aula G'},{id:'H',name:'Aula H'}],total:0,active:0}});
  if(p==='/api/teacher/identities')return route.fulfill({json:{identities:[]}});
  if(p==='/api/teacher/activity-assignments')return route.fulfill({json:{assignments:[]}});
  if(p==='/api/teacher/itineraries')return route.fulfill({json:{itineraries:[]}});
  const match=p.match(/^\/api\/teacher\/groups\/([^/]+)\/files(?:\/([^/]+)(\/download)?)?$/)||p.match(/^\/api\/student\/group-files(?:\/([^/]+)(\/download)?)?$/)&&['','G',p.split('/')[4],p.endsWith('/download')];
  if(match){
   const [,group,id,download]=match,rows=model.rows[group];
   if(download)return route.fulfill({body:rows.find(r=>r.id===id)?.body||'Example',headers:{'Content-Type':'application/octet-stream','Content-Disposition':'attachment; filename="activity.txt"'}});
   if(method==='GET')return route.fulfill({json:{files:rows.filter(r=>!student||r.scope==='shared'||r.identity_id===model.identity?.id),settings,usage:{group_bytes:rows.reduce((sum,r)=>sum+r.size,0),student_bytes:0}}});
   if(method==='DELETE'){model.rows[group]=rows.filter(r=>r.id!==id);return route.fulfill({json:{deleted:id}});}
   if(method==='POST'){
    const name=decodeURIComponent(req.headers()['x-file-path']),body=req.postDataBuffer().toString();model.posts.push({group,name,body});
    const old=rows.find(r=>r.relative_path===name&&r.scope===(student?'submission':'shared'));
    if(old&&req.headers()['x-file-replace']!=='1')return route.fulfill({status:409,json:{detail:'file_exists'}});
    if(old)rows.splice(rows.indexOf(old),1);
    const file={id:old?.id||'file-'+model.posts.length,group_id:group,relative_path:name,body,size:Buffer.byteLength(body),scope:student?'submission':'shared',identity_id:student?model.identity.id:null};rows.push(file);
    return route.fulfill({status:201,json:{id:file.id,replaced:Boolean(old)}});
   }
  }
  return route.fulfill({status:401,json:{detail:'not authenticated'}});
 });
 await page.goto(student?'/student.html':'/teacher.html');
 if(student)await expect(page.locator('#studentLogout')).toBeVisible();else await expect(page.locator('[data-select-group=H]')).toBeEnabled();
 await page.locator('[data-classroom-files] > summary').click();
 await expect(page.locator('[data-files-refresh]')).toBeEnabled();
 if(student)await page.locator('[data-files-tab=submission]').click();
 await expect(page.locator('[data-files-input]')).toBeEnabled();
 return model;
}
const file=(name='activity.txt',text='Hola aula')=>({name,mimeType:'text/plain',buffer:Buffer.from(text)});

test('fitxers: carpeta, descàrrega, reemplaçament confirmat i eliminació',async({page})=>{
 const model=await setup(page);
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'commons-folder-'));
 try{
  fs.mkdirSync(path.join(root,'Valencià'));fs.writeFileSync(path.join(root,'Valencià','àlbum.txt'),'Hola');
  await page.locator('[data-files-folder]').setInputFiles(root);
  await expect(page.locator('[data-classroom-file]')).toHaveCount(1);
  expect(model.posts[0].name).toBe(path.basename(root)+'/Valencià/àlbum.txt');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
 await page.locator('[data-files-input]').setInputFiles(file());await expect(page.locator('[data-classroom-file]')).toHaveCount(2);
 page.once('dialog',dialog=>dialog.dismiss());await page.locator('[data-files-input]').setInputFiles(file());
 await expect(page.locator('[data-files-input]')).toBeEnabled();expect(model.posts).toHaveLength(2);
 page.once('dialog',dialog=>dialog.accept());await page.locator('[data-files-input]').setInputFiles(file('activity.txt','Nou'));
 await expect(page.locator('[data-files-feedback]')).toContainText('guardat 1');expect(model.posts.at(-1).body).toBe('Nou');
 const downloaded=page.waitForEvent('download');await page.locator('[data-classroom-file]').filter({hasText:'activity.txt'}).locator('[data-file-download]').click();expect((await downloaded).suggestedFilename()).toBe('activity.txt');
 page.once('dialog',dialog=>dialog.accept());await page.locator('[data-classroom-file]').filter({hasText:'activity.txt'}).locator('[data-file-delete]').click();await expect(page.locator('[data-classroom-file]')).toHaveCount(1);
 await chooseLanguage(page,'es');await expect(page.locator('[data-classroom-files] > summary')).toHaveText('Archivos del aula');
 await chooseLanguage(page,'en');await expect(page.locator('[data-classroom-files] > summary')).toHaveText('Classroom files');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('alumnat: entregues privades i canvi d’identitat sense conservar les de l’anterior',async({page})=>{
 const model=await setup(page,true);
 await expect(page.locator('[data-classroom-files]')).toContainText('Només tu i el professorat');
 await page.locator('[data-files-input]').setInputFiles(file('private.txt'));
 await expect(page.locator('[data-classroom-file]')).toHaveCount(1);
 expect(model.rows.G[0].identity_id).toBe('pupil-a');
 await page.locator('#studentLogout').click();await expect(page.locator('[data-classroom-files]')).toHaveCount(0);
 await page.locator('#studentCode').fill('DEF');await page.locator('#studentPin').fill('1234');await page.locator('#studentLogin').click();await expect(page.locator('#studentLogout')).toBeVisible();
 await page.locator('[data-classroom-files] > summary').click();await page.locator('[data-files-tab=submission]').click();
 await expect(page.locator('[data-files-input]')).toBeEnabled();await expect(page.locator('[data-classroom-file]')).toHaveCount(0);
});

test('canviar d’aula durant la pujada cancel·la la resta de la carpeta',async({page})=>{
 await setup(page);let release,started;const waiting=new Promise(resolve=>started=resolve);let posts=0;
 await page.route('**/api/teacher/groups/*/files',async route=>{
  if(route.request().method()!=='POST')return route.fallback();posts++;started();await new Promise(resolve=>release=resolve);await route.fulfill({status:201,json:{id:'old'}}).catch(()=>{});
 });
 await page.locator('[data-files-input]').setInputFiles([file('first.txt'),file('second.txt')]);await waiting;
 await page.locator('[data-select-group=H]').click();release();
 await expect(page.locator('[data-files-input]')).toBeEnabled();await expect(page.locator('[data-classroom-file]')).toHaveCount(0);expect(posts).toBe(1);
});

test('arrossegar un fitxer i missatge clar quan se supera la quota',async({page})=>{
 const model=await setup(page);
 await page.locator('.files-upload').evaluate(element=>{const data=new DataTransfer();data.items.add(new File(['Dibuix'],'dibuix.txt',{type:'text/plain'}));element.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:data}));});
 await expect(page.locator('[data-classroom-file]')).toHaveCount(1);expect(model.posts[0].name).toBe('dibuix.txt');
 await page.route('**/api/teacher/groups/G/files',route=>route.request().method()==='POST'?route.fulfill({status:413,json:{detail:'files_quota_exceeded'}}):route.fallback());
 await page.locator('[data-files-input]').setInputFiles(file());await expect(page.locator('[data-files-feedback]')).toContainText('No queda prou espai');
});
