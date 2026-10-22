const {test,expect}=require('@playwright/test');
const activity={id:'Ab12Cd34',type:'multiple-choice',title:'Pupil quiz',question:'Which?',answers:[{text:'A',correct:true},{text:'B',correct:false}],owned:true,visibility:'private'};
async function mock(page,{role='student',saved=false}={}){
 const model={calls:[],revision:0,status:'draft',feedback:''};
 await page.addInitScript(()=>{
  localStorage.setItem('edutictac-play-lang','es');
  window._h5pReady=Promise.resolve();window._h5pCtor={H5P:class{constructor(container){container.textContent='Synthetic player';return Promise.resolve();}}};
 });
 await page.route('**/play/api/**',async route=>{
  const req=route.request(),path=new URL(req.url()).pathname.replace('/play/api','');
  const body=req.postData()?req.postDataJSON():null;
  if(req.method()==='POST')model.calls.push({path,body,headers:req.headers()});
  if(path==='/publication/me')return route.fulfill({json:{actor:role==='teacher'?'teacher':'pupil',can_publish:role==='teacher',can_submit:role==='student',can_review:role==='teacher',role,class_name:'Class A'}});
  if(path==='/catalog')return route.fulfill({json:{subjects:['matematicas'],educational_stages:['primaria'],levels:['basico'],tags:['repaso']}});
  if(path==='/config')return route.fulfill({json:{demo:false,integrated:true}});
  if(path==='/activities'&&req.method()==='POST')return route.fulfill({status:201,json:{...body,id:activity.id,owned:true,visibility:'private'}});
  if(path==='/previews')return route.fulfill({status:201,json:{...body,id:'preview-1234abcd'}});
  if(path==='/activities/'+activity.id)return route.fulfill({json:activity});
  if(path.startsWith('/activities?')||path==='/activities')return route.fulfill({json:{items:[],total:0,offset:0,hasMore:false}});
  if(path==='/submissions/'+activity.id){if(req.method()==='POST'){model.revision++;model.status='pending';}return route.fulfill({json:{id:activity.id,revision:model.revision,status:model.status,feedback:model.feedback}});}
  if(path==='/reviews')return route.fulfill({json:{items:[{...activity,status:'pending',revision:1,class_name:'Class A'}],offset:0,more:false}});
  if(path==='/reviews/'+activity.id){
   if(req.method()==='POST'){model.status={approve:'approved',return:'returned',withdraw:'withdrawn'}[body.decision];model.revision=body.revision+1;return route.fulfill({json:{...activity,status:model.status,revision:model.revision}});}
   return route.fulfill({json:{...activity,status:'pending',revision:1,activity}});
  }
  return route.fulfill({status:404,json:{error:'unavailable'}});
 });
 if(saved)await page.route('**/play/'+activity.id,route=>route.fulfill({path:require('path').join(__dirname,'../../services/play/public/index.html'),contentType:'text/html'}));
 await page.goto('/play/'+(saved?activity.id:''));await expect(page.locator('html')).toHaveAttribute('data-play-ready','true');return model;
}

test('alumnat envia el treball privat al docent i veu confirmació, sense publicació directa',async({page})=>{
 const model=await mock(page,{saved:true});await expect(page.locator('#publishRecursos')).toHaveCount(0);await expect(page.locator('#submitPlayReview')).toBeEnabled();
 await page.locator('#submitPlayReview').click();await expect(page.locator('#savedMessage')).toContainText('Todavía no es pública');await expect(page.locator('#submissionStatus')).toContainText('Pendiente');await expect(page.locator('#submitPlayReview')).toBeDisabled();
 expect(model.calls[0]).toMatchObject({path:'/submissions/'+activity.id,body:{revision:0}});expect(model.calls[0].headers['x-play-review']).toBe('1');
});

test('docent revisa, aprova i retira amb revisió exacta i confirmació visible',async({page})=>{
 const model=await mock(page,{role:'teacher'});await page.locator('#openReviews').click();await page.locator('[data-review-id]').click();
 await expect(page.locator('#playReviewDetail')).toContainText('Pupil quiz');await page.locator('#approvePlay').click();await expect(page.locator('#reviewMessage')).toContainText('aprobada y publicada');
 expect(model.calls[0]).toMatchObject({path:'/reviews/'+activity.id,body:{decision:'approve',revision:1,feedback:''}});
 await page.locator('#withdrawPlay').click();await expect(page.locator('#reviewMessage')).toContainText('retirada');expect(model.calls[1].body.revision).toBe(2);
});

test('devolució exigix comentari i manté el contingut privat',async({page})=>{
 const model=await mock(page,{role:'teacher'});await page.locator('#openReviews').click();await page.locator('[data-review-id]').click();await page.locator('#returnPlay').click();
 await expect(page.locator('#playReviews [role=alert]')).toContainText('Escribe un comentario');expect(model.calls).toHaveLength(0);
 await page.locator('#reviewFeedback').fill('Revisa la respuesta B');await page.locator('#returnPlay').click();await expect(page.locator('#reviewMessage')).toContainText('devuelta');
 expect(model.calls[0].body).toEqual({decision:'return',revision:1,feedback:'Revisa la respuesta B'});
});

test('error de publicació no mostra èxit ni reenvia automàticament',async({page})=>{
 await mock(page,{role:'teacher'});let calls=0;await page.route('**/play/api/reviews/'+activity.id,route=>{if(route.request().method()==='POST'){calls++;return route.fulfill({status:503,json:{error:'unavailable'}});}return route.fulfill({json:{...activity,status:'pending',revision:1,activity}});});
 await page.locator('#openReviews').click();await page.locator('[data-review-id]').click();await page.locator('#approvePlay').click();await expect(page.locator('#playReviews [role=alert]')).toContainText('No se pudo completar');await expect(page.locator('#reviewMessage')).toHaveCount(0);expect(calls).toBe(1);
});

test('idioma conserva text, categories i etiquetes sense recarregar',async({page})=>{
 await mock(page);await page.locator('[data-type=classify]').click();await page.locator('#title').fill('Mi trabajo');await page.locator('.category-name').first().fill('Animales');await page.locator('#subject').selectOption('matematicas');await page.locator('#activityTags').selectOption('repaso');
 for(const lang of ['en','va','ca','es']){await page.locator('#language').selectOption(lang);await expect(page.locator('#title')).toHaveValue('Mi trabajo');await expect(page.locator('.category-name').first()).toHaveValue('Animales');await expect(page.locator('#activityTags')).toHaveValues(['repaso']);}
});

test('guarda una sola vegada mentre la petició està pendent',async({page})=>{
 const model=await mock(page);let release,started;const waiting=new Promise(resolve=>started=resolve);let calls=0;
 await page.route('**/play/api/activities',async route=>{calls++;started();await new Promise(resolve=>release=resolve);await route.fulfill({status:201,json:{...route.request().postDataJSON(),id:activity.id,owned:true}});});
 await page.locator('[data-type=true-false]').click();await page.locator('#title').fill('True');await page.locator('#question').fill('Question');await page.locator('#save').click();await waiting;
 await expect(page.locator('#save')).toBeDisabled();await page.locator('#activityForm').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));release();await expect(page.locator('#download')).toBeVisible();expect(calls).toBe(1);
});

test('previsualització guarda un esborrany i torna a obrir correctament ordenació',async({page})=>{
 await mock(page);await page.locator('[data-type=ordering]').click();await page.locator('#title').fill('Orden');await page.locator('#question').fill('Ordena');
 for(let i=0;i<3;i++)await page.locator('.classify-text').nth(i).fill('Paso '+i);
 await page.locator('.classify-category').nth(2).selectOption({value:'2'});await page.locator('#preview').click();await expect(page.locator('#savePreview')).toBeVisible();
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-play-ready','true');await page.locator('[data-type=ordering]').click();await expect(page.locator('#title')).toHaveValue('Orden');await expect(page.locator('.classify-category').nth(2)).toHaveValue('2');
});

test('token administratiu es buida del camp i no es persistix',async({page})=>{
 await mock(page);await page.locator('#openLibrary').click();await page.locator('.library-admin summary').click();await page.locator('#libraryToken').fill('synthetic-test-only');await page.locator('#libraryTokenSave').click();await expect(page.locator('#libraryToken')).toHaveValue('');
 expect(await page.evaluate(()=>localStorage.getItem('edutictac-play-admin-token'))).toBeNull();
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide')));await expect(page.locator('#libraryToken')).toHaveValue('');
});

test('en tornar a una sessió diferent es retiren la còpia privada i el formulari',async({page})=>{
 await mock(page,{saved:true});await expect(page.locator('#previewTitle')).toHaveText('Pupil quiz');
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide')));await expect(page.locator('#playApp')).toBeHidden();
 await page.route('**/play/api/publication/me',route=>route.fulfill({json:{can_publish:false,can_submit:false,can_review:false}}));
 await page.route('**/play/api/activities/'+activity.id,route=>route.fulfill({status:404,json:{error:'not found'}}));
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
 await expect(page.locator('#playApp')).toBeVisible();await expect(page.locator('#previewTitle')).toHaveCount(0);await expect(page.locator('#title')).toHaveValue('');
});

test('les imatges esquerra i dreta s’optimitzen sense perdre una càrrega concurrent',async({page})=>{
 const model=await mock(page);await page.locator('[data-type=matching]').click();await page.locator('#title').fill('Images');await page.locator('#question').fill('Match');
 for(let i=0;i<2;i++){await page.locator('.match-left').nth(i).fill('Left '+i);await page.locator('.match-right').nth(i).fill('Right '+i);}
 const pixels=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=8;canvas.height=8;const ctx=canvas.getContext('2d');ctx.fillStyle='green';ctx.fillRect(0,0,8,8);return canvas.toDataURL('image/png').split(',')[1];});
 const file={name:'pixel.png',mimeType:'image/png',buffer:Buffer.from(pixels,'base64')};
 await Promise.all([page.locator('.matching-row').first().locator('[data-side=left]').setInputFiles(file),page.locator('.matching-row').first().locator('[data-side=right]').setInputFiles(file)]);
 await expect(page.locator('.matching-row').first().locator('.editor-thumbnail')).toHaveCount(2);await expect(page.locator('#save')).toBeEnabled();await page.locator('#save').click();await expect(page.locator('#download')).toBeVisible();
 const sent=model.calls.find(call=>call.path==='/activities').body;expect(sent.pairs[0].leftImage).toMatch(/^data:image\/webp;base64,/);expect(sent.pairs[0].rightImage).toMatch(/^data:image\/webp;base64,/);
});
