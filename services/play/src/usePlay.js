import {ref,reactive,computed,onMounted,onBeforeUnmount,nextTick} from 'vue';
import {TYPES,CHILD_TYPES,TYPE_LABELS,newActivity,hydrate,serialize,validate,clone} from './model.js';
import {commonsBridge} from './commons.js';
import '../../portal/public/assets/language-preference.js';
export function usePlay(){
 const base=location.pathname==='/play'||location.pathname.startsWith('/play/')?'/play':'';
 const DRAFT='edutictac-play-draft';
 const storedLang=window.commonsLanguage.read();
 const language=ref(['es','ca','va','en'].includes(storedLang)?storedLang:'es'),dictionary=ref({});
 const t=key=>key.split('.').reduce((value,k)=>value?.[k],dictionary.value)||key;
 const view=ref('home'),ready=ref(false),busy=ref(false),form=ref(newActivity()),saved=ref(null),formError=ref(''),message=ref(''),messageError=ref(false),imageTasks=ref(0),demoUrl=ref('');
 const capabilities=ref({}),submission=ref(null),integrated=ref(false);
 // URL de Commons per al xip de compte (null = Play sense Commons, sense xip).
 const commonsBase=ref(null);
 const drafts={},catalog=ref({}),catalogDraft=reactive({subjects:'',educational_stages:'',levels:'',tags:''}),catalogMessage=ref('');
 const library=reactive({items:[],total:0,offset:0,hasMore:false,term:'',type:'',loading:false,error:false});
 const bank=reactive({items:[],term:'',loading:false,error:false}),bankDialog=ref();
 const adminInput=ref(''),adminToken=ref('');
 try{adminToken.value=localStorage.getItem('edutictac-play-admin-token')||'';localStorage.removeItem('edutictac-play-admin-token');}catch{}
 let epoch=0,languageSeq=0,librarySeq=0,bankSeq=0,catalogSeq=0,active=true,previousActor='';
 const bridge=commonsBridge(base,id=>{if(saved.value?.id===id&&active)message.value='resultSaved';});
 const savingDisabled=computed(()=>busy.value||imageTasks.value>0);
 const published=computed(()=>['published','updated'].includes(saved.value?.recursos?.status));
 const editorTitle=computed(()=>t(form.value.type==='compound'?'compound.editor':form.value.type==='multiple-choice'?'editorTitle':TYPE_LABELS[form.value.type]+'Editor'));
 function creator(){let key=localStorage.getItem('edutictac-play-creator-key');if(!key||!/^[A-Za-z0-9_-]{16,128}$/.test(key)){key=crypto.randomUUID?crypto.randomUUID().replace(/-/g,''):Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('edutictac-play-creator-key',key);}return key;}
 async function api(path,options={}){const response=await fetch(base+'/api'+path,{credentials:'same-origin',cache:'no-store',...options,headers:{'X-Play-Creator':creator(),...options.headers}});const data=await response.json();if(!response.ok){const error=new Error('request');error.status=response.status;error.details=Array.isArray(data.errors)?data.errors:[];throw error;}return data;}
 function post(path,payload,headers={}){return api(path,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(payload)});}
 async function changeLanguage(value){
  if(!['es','ca','va','en'].includes(value))return;
  const seq=++languageSeq;try{const r=await fetch(base+'/i18n/'+(value==='va'?'ca':value)+'.json');if(!r.ok)throw Error();let data=await r.json();if(value==='va'){const variant=await fetch(base+'/i18n/va.json');if(!variant.ok)throw Error();data={...data,...await variant.json()};}if(seq!==languageSeq||!active)return;dictionary.value=data;language.value=value;document.documentElement.lang=value==='va'?'ca':value;window.commonsLanguage.remember(value);}catch{formError.value='languageError';}
 }
 // El xip i el seu CSS es carreguen del mateix Commons: una sola versió per a tot.
 function mountAccount(value){
  if(typeof value!=='string')return;
  const url=value.startsWith('//')?location.protocol+value:value;
  try{if(url&&!['http:','https:'].includes(new URL(url).protocol))return;}catch{return;}
  commonsBase.value=url;
  if(document.getElementById('edutictacAccountScript'))return;
  const css=document.createElement('link');css.rel='stylesheet';css.href=url+'/assets/account-widget.css';document.head.append(css);
  const script=document.createElement('script');script.id='edutictacAccountScript';script.defer=true;script.src=url+'/assets/account-widget.js';document.head.append(script);
 }
 // Si el xip veu que s'ha entrat o eixit en una altra pestanya, es revisen els permisos.
 function sessionChanged(){if(active&&ready.value)void loadPublication();}
 function choose(type){if(!TYPES.includes(type)||savingDisabled.value)return;drafts[form.value.type]=form.value;if(!drafts[type])drafts[type]={...newActivity(type),title:form.value.title,question:form.value.question};form.value=drafts[type];view.value='editor';formError.value='';++epoch;}
 function go(where){if(busy.value)return;++epoch;view.value=where;message.value='';formError.value='';bankDialog.value?.close();++bankSeq;}
 async function saveActivity(preview=false){
  if(savingDisabled.value)return;const payload=serialize(form.value,language.value),errors=validate(payload,t);formError.value=errors.join(' ');if(errors.length)return;
  busy.value=true;const current=epoch;
  try{
   if(preview)localStorage.setItem(DRAFT,JSON.stringify({...payload,_owner:capabilities.value.actor||''}));
   const data=await post(preview?'/previews':'/activities',payload);if(current!==epoch||!active)return;
   saved.value=data;if(!preview)await loadPublication();if(current!==epoch||!active)return;view.value='previewPanel';message.value=preview?'':'saved';messageError.value=false;
   if(!preview)localStorage.removeItem(DRAFT);
   history.replaceState({},'',preview?base+'/'+bridge.query():base+'/'+data.id+bridge.query());
  }catch(error){if(current===epoch&&active){const text=error.details?.join(' ');formError.value=error.status===401?t('loginToSave'):text||t(preview?'previewError':'saveError');message.value='saveError';messageError.value=true;}}
  finally{if(current===epoch)busy.value=false;}
 }
 async function loadLibrary(){
  const seq=++librarySeq,current=epoch;library.loading=true;library.error=false;
  try{const p=new URLSearchParams({limit:'12',offset:library.offset,q:library.term.trim(),type:library.type});const data=await api('/activities?'+p);if(seq!==librarySeq||current!==epoch||!active)return;Object.assign(library,{items:data.items,total:data.total,offset:data.offset,hasMore:data.hasMore});}
  catch{if(seq===librarySeq&&current===epoch)library.error=true;}
  finally{if(seq===librarySeq)library.loading=false;}
 }
 function openLibrary(){go('library');library.offset=0;void loadLibrary();}
 function filterLibrary(offset=0){library.offset=offset;void loadLibrary();}
 function applyToken(){if(busy.value)return;adminToken.value=adminInput.value.trim();adminInput.value='';catalogMessage.value='';++librarySeq;void loadLibrary();}
 async function removeActivity(id,inLibrary=false){
  if(busy.value||!window.confirm(t(inLibrary?'libraryConfirmDelete':'deleteConfirm')))return;
  busy.value=true;const current=epoch;
  try{await api('/activities/'+id,{method:'DELETE',headers:adminToken.value?{'X-Admin-Token':adminToken.value}:{}});if(current!==epoch||!active)return;if(inLibrary)await loadLibrary();else{saved.value=null;localStorage.removeItem(DRAFT);history.replaceState({},'',base+'/');view.value='home';}}
  catch{if(current===epoch){message.value='deleteError';messageError.value=true;if(inLibrary)library.error=true;}}
  finally{if(current===epoch)busy.value=false;}
 }
 async function loadPublication(){
  const current=epoch;
  try{const data=await api('/publication/me');if(current!==epoch||!active)return;capabilities.value=data;
   submission.value=null;
   if(data.can_submit&&saved.value?.id&&!saved.value.id.startsWith('preview-')){const id=saved.value.id;const result=await api('/submissions/'+id);if(current===epoch&&saved.value?.id===id&&active)submission.value=result;}
  }catch{if(current===epoch){capabilities.value={};submission.value=null;}}
 }
 async function submitReview(){
  if(busy.value||!capabilities.value.can_submit||!saved.value?.id)return;
  busy.value=true;const current=epoch,id=saved.value.id;
  try{const result=await post('/submissions/'+id,{revision:submission.value?.revision||0},{'X-Play-Review':'1'});if(current!==epoch||!active)return;submission.value=result;message.value='reviewSent';messageError.value=false;}
  catch{if(current===epoch){message.value='reviewSubmitError';messageError.value=true;}}
  finally{if(current===epoch)busy.value=false;}
 }
 async function publication(withdraw=false){
  if(busy.value||!capabilities.value.can_publish||!saved.value?.id||saved.value.id.startsWith('preview-'))return;busy.value=true;const current=epoch,id=saved.value.id;message.value=withdraw?'unpublishRecursosLoading':'publishRecursosLoading';
  try{const data=await post('/recursos/'+(withdraw?'unpublish':'publish'),{activity_id:id});if(current!==epoch||saved.value?.id!==id||!active)return;saved.value.recursos=data;message.value=withdraw?'unpublishRecursosDone':'publishRecursosDone';messageError.value=false;}
  catch{if(current===epoch){message.value=withdraw?'unpublishRecursosError':'publishRecursosError';messageError.value=true;}}
  finally{if(current===epoch)busy.value=false;}
 }
 async function loadCatalog(){
  const seq=++catalogSeq;try{const data=await api('/catalog');if(seq!==catalogSeq||!active)return;catalog.value=data;for(const key of Object.keys(catalogDraft))catalogDraft[key]=(data[key]||[]).join('\n');}catch{/* Optional catalogue failure does not discard the draft. */}
 }
 async function saveCatalog(){
  if(busy.value)return;if(!adminToken.value){catalogMessage.value='catalogTokenRequired';return;}busy.value=true;const current=epoch;
  try{await post('/catalog',{...Object.fromEntries(Object.entries(catalogDraft).map(([key,value])=>[key,value.split('\n').map(v=>v.trim()).filter(Boolean)])),labels:catalog.value.labels||{}},{'X-Admin-Token':adminToken.value});if(current===epoch&&active){catalogMessage.value='catalogSaved';await loadCatalog();}}
  catch{if(current===epoch)catalogMessage.value='catalogError';}
  finally{if(current===epoch)busy.value=false;}
 }
 async function loadBank(){
  const seq=++bankSeq,current=epoch;bank.loading=true;bank.error=false;
  try{const data=await api('/activities?'+new URLSearchParams({limit:'100',q:bank.term.trim()}));if(seq!==bankSeq||current!==epoch||!active)return;bank.items=data.items.filter(a=>CHILD_TYPES.includes(a.type));}
  catch{if(seq===bankSeq)bank.error=true;}
  finally{if(seq===bankSeq)bank.loading=false;}
 }
 async function openBank(){if(savingDisabled.value)return;bank.term='';bank.items=[];bankDialog.value.showModal();void loadBank();}
 async function addFromBank(id){
  if(busy.value||form.value.type!=='compound'||form.value.activities.length>=10)return;
  const current=epoch,seq=bankSeq,target=form.value;busy.value=true;
  try{const data=await api('/activities/'+id);if(current!==epoch||seq!==bankSeq||form.value!==target||!bankDialog.value.open||!active)return;if(!CHILD_TYPES.includes(data.type))throw Error();target.activities.push({...hydrate(data),sourceActivityId:id});bankDialog.value.close();message.value='bank.copied';}
  catch{if(current===epoch)bank.error=true;}
  finally{if(current===epoch)busy.value=false;}
 }
 function closeBank(){++bankSeq;bankDialog.value?.close();}
 async function copy(){try{await navigator.clipboard.writeText(location.href);message.value='copied';messageError.value=false;}catch{message.value='copyError';messageError.value=true;}}
 async function boot(){
  const bootEpoch=epoch;
  await changeLanguage(language.value);try{await bridge.launch();}catch{formError.value=t('launchError');return;}
  if(bootEpoch!==epoch||!active)return;void bridge.flush();void loadCatalog();await loadPublication();if(bootEpoch!==epoch||!active)return;
  api('/config').then(data=>{integrated.value=Boolean(data.integrated);mountAccount(data.commonsBase);try{const url=new URL(data.commonsUrl);if(data.demo&&['http:','https:'].includes(url.protocol)&&!url.username&&!url.password)demoUrl.value=url.href;}catch{}}).catch(()=>{});
  const id=location.pathname.match(new RegExp('^'+base+'/([A-Za-z0-9]{8})$'))?.[1]||new URLSearchParams(location.search).get('activity');
  if(id){try{if(!/^[A-Za-z0-9]{8}$/.test(id))throw Error();const data=await api('/activities/'+id);if(bootEpoch!==epoch||!active)return;saved.value=data;await loadPublication();if(bootEpoch!==epoch||!active)return;form.value=hydrate(data);drafts[form.value.type]=form.value;view.value='previewPanel';message.value='saved';}catch{formError.value=t('libraryError');}}
  else{try{const draft=JSON.parse(localStorage.getItem(DRAFT)||'null');if(draft&&TYPES.includes(draft.type)&&(!draft._owner||draft._owner===capabilities.value.actor)){form.value=hydrate(draft);drafts[form.value.type]=form.value;}}catch{localStorage.removeItem(DRAFT);}}
  ready.value=true;document.documentElement.dataset.playReady='true';
 }
 function hide(){previousActor=capabilities.value.actor||'';document.getElementById('playApp')?.setAttribute('hidden','');active=false;++epoch;++librarySeq;++bankSeq;++catalogSeq;adminToken.value='';adminInput.value='';capabilities.value={};submission.value=null;busy.value=false;bankDialog.value?.close();}
 async function show(event){
  if(!event.persisted)return;active=true;
  if(!ready.value){await boot();document.getElementById('playApp')?.removeAttribute('hidden');return;}
  await loadPublication();
  if(previousActor&&previousActor!==capabilities.value.actor){saved.value=null;form.value=newActivity();Object.keys(drafts).forEach(key=>delete drafts[key]);view.value='home';localStorage.removeItem(DRAFT);}
  if(saved.value?.visibility==='private'){
   try{saved.value=await api('/activities/'+saved.value.id);}catch{saved.value=null;form.value=newActivity();view.value='home';}
  }
  await nextTick();document.getElementById('playApp')?.removeAttribute('hidden');void loadCatalog();if(view.value==='library')void loadLibrary();
 }

 function online(){void bridge.flush();}
 onMounted(()=>{void boot();window.addEventListener('online',online);window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);window.addEventListener('edutictac:sessionchange',sessionChanged);});
 onBeforeUnmount(()=>{hide();window.removeEventListener('online',online);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);window.removeEventListener('edutictac:sessionchange',sessionChanged);});
 return {capabilities,submission,integrated,commonsBase,submitReview,loadPublication,base,TYPES,CHILD_TYPES,TYPE_LABELS,language,t,view,ready,busy,form,saved,formError,message,messageError,imageTasks,savingDisabled,demoUrl,catalog,catalogDraft,catalogMessage,library,bank,bankDialog,adminInput,adminToken,published,editorTitle,choose,go,changeLanguage,saveActivity,loadLibrary,openLibrary,filterLibrary,applyToken,removeActivity,publication,saveCatalog,openBank,loadBank,addFromBank,closeBank,copy,onStatement:bridge.report};
}
