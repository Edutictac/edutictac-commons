import {ref,reactive,computed,onMounted,onBeforeUnmount} from 'vue';
import {formatters} from './format.js';
const MODULES=['play','eduhoot','recursos','blocs','llibres','quiosc'];
const JOBS={
  'commons-modules-job':/^edutictac-commons-modules-\d{14}-[a-f0-9]{8}$/,
  'commons-backup-job':/^edutictac-commons-(?:backup-\d{14}-[a-f0-9]{8}|restore-\d{14})$/,
  'commons-images-job':/^edutictac-commons-(?:update|rollback)-\d{14}$/,
};
export function useAdmin(){
  const prefix=location.pathname.startsWith('/admin/')?'/admin':'';
  const language=ref(window.i18nAdmin.getLang());
  const t=(key,vars)=>{language.value;return window.i18nAdmin.t(key,vars);};
  const {renderStatus,renderUpdateStatus}=formatters(t);
  const authorized=ref(false), checking=ref(false), pending=ref(false), loggingOut=ref(false), active=ref(true);
  const status=ref(null), modules=ref(null), selected=ref([]), moduleError=ref('');
  const wizard=ref(),wizardOpen=ref(false),dismissed=ref(false);
  const apiMessage=ref('status.checking'),statusError=ref('');
  const output=ref({key:'common.actionPlaceholder'}),teacherMessage=ref('');
  const teacher=reactive({username:'',name:'',email:''}),credential=ref(null);
  const mount=ref(''),mountDirty=ref(false),restore=ref(''),rollback=ref('');
  const job=ref(null),trackingPaused=ref(false);
  let epoch=0,statusSequence=0,moduleSequence=0,actionSequence=0,failures=0,life=0;
  const timer=ref(null),polling=ref(false);
  const pollState=computed(()=>trackingPaused.value?'paused':polling.value?'polling':timer.value!==null?'waiting':'idle');
  const busy=computed(()=>pending.value||Boolean(job.value)||modules.value?.phase==='applying');
  const canWrite=computed(()=>active.value&&authorized.value&&!busy.value);
  const moduleManageable=computed(()=>Boolean(modules.value?.manageable));
  const backups=computed(()=>(status.value?.backups||[]).filter(b=>!b.error));
  const rollbacks=computed(()=>backups.value.filter(b=>b.update));
  const secondary=computed(()=>status.value?.backup_secondary||{enabled:false,mount:'',last:{}});
  const statusText=computed(()=>statusError.value?t(statusError.value):(status.value?renderStatus(status.value):t('status.signInToView')));
  const actionText=computed(()=>output.value.log!==undefined?output.value.log+'\n\n'+t(output.value.key):output.value.updates?renderUpdateStatus(output.value.updates):output.value.key?t(output.value.key,output.value.vars):output.value.text||'');
  const modulesNotice=computed(()=>t(moduleError.value||(!authorized.value?'modules.signIn':!modules.value?'modules.unavailable':!moduleManageable.value?'modules.updateInstaller':busy.value?'modules.applying':modules.value.error?'modules.failed':modules.value.configured?'modules.ready':'modules.firstHint')));
  const secondaryText=computed(()=>{
    if(!authorized.value)return '';
    const state=secondary.value,last=state.last||{};
    const result=last.error==='invalid_configuration'?'failed':state.enabled?last.result||'ready':'disabled';
    const items=[t(`secondary.state.${result}`),last.backup||'',last.checked_at||''];
    if(result==='failed'&&last.error){const key=`secondary.error.${last.error}`;items.push(t(key)===key?t('secondary.error.copy_failed'):t(key));}
    return items.filter(Boolean).join(' · ');
  });
  function storage(key,value){try{if(value===null)sessionStorage.removeItem(key);else sessionStorage.setItem(key,value);}catch{/* Tracking remains in memory if storage is blocked. */}}
  function storedJob(){
    for(const [key,pattern] of Object.entries(JOBS)){
      let unit;try{unit=sessionStorage.getItem(key);}catch{return null;}
      if(!unit)continue;
      if(pattern.test(unit))return {key,unit,startedAt:Date.now()};
      storage(key,null);
    }
    return null;
  }
  function clearTeacher(){credential.value=null;teacher.username='';teacher.name='';teacher.email='';teacherMessage.value='';}
  function closeWizard(){wizard.value?.close();wizardOpen.value=false;dismissed.value=true;}
  function invalidate(){
    ++epoch;++statusSequence;++moduleSequence;++actionSequence;
    authorized.value=false;pending.value=false;output.value={key:'common.actionPlaceholder'};status.value=null;modules.value=null;selected.value=[];clearTeacher();
    restore.value='';rollback.value='';mount.value='';mountDirty.value=false;statusError.value='';moduleError.value='';closeWizard();
  }
  async function request(path,options={},current=()=>true){
    const requestEpoch=epoch,requestLife=life;
    const response=await fetch(prefix+path,{credentials:'same-origin',cache:'no-store',...options});
    if(response.status===401||response.status===403){if(requestEpoch===epoch&&requestLife===life&&active.value&&current()){invalidate();apiMessage.value='status.authRequired';}const e=new Error('unauthorized');e.status=response.status;throw e;}
    const data=await response.json();
    if(!response.ok){const e=new Error(data.output||data.error||'operation_failed');e.status=response.status;throw e;}
    return data;
  }
  function message(key,error=false){output.value={key,error};}
  async function loadModules(){
    if(!authorized.value||!active.value)return;
    const e=epoch,seq=++moduleSequence;
    try{
      const data=await request('/api/modules',{},()=>seq===moduleSequence);if(e!==epoch||seq!==moduleSequence||!active.value)return;
      if(!modules.value||data.revision!==modules.value.revision||data.phase==='failed')selected.value=MODULES.filter(name=>data.enabled?.includes(name));
      modules.value=data;moduleError.value='';
      if(data.manageable&&!data.configured&&!busy.value&&!dismissed.value){wizardOpen.value=true;}
    }catch{if(e===epoch&&seq===moduleSequence){modules.value=null;moduleError.value='modules.unavailable';}}
  }
  async function loadStatus(){
    if(!active.value)return;
    const e=epoch,seq=++statusSequence;checking.value=true;
    try{
      const data=await request('/api/status',{},()=>seq===statusSequence);if(e!==epoch||seq!==statusSequence||!active.value)return;
      authorized.value=true;status.value=data;statusError.value='';apiMessage.value='status.connected';
      if(!backups.value.some(b=>b.name===restore.value))restore.value=backups.value[0]?.name||'';
      if(!rollbacks.value.some(b=>b.name===rollback.value))rollback.value=rollbacks.value[0]?.name||'';
      if(!mountDirty.value)mount.value=secondary.value.mount||'';
      await loadModules();
      if(job.value&&!polling.value&&timer.value===null)schedule();
    }catch{if(e===epoch&&seq===statusSequence){invalidate();apiMessage.value='status.disconnected';statusError.value='admin.loadError';}}
    finally{if(seq===statusSequence||!authorized.value)checking.value=false;}
  }
  function stopPoll(){if(timer.value!==null)clearTimeout(timer.value);timer.value=null;}
  function schedule(){stopPoll();if(active.value&&job.value&&!trackingPaused.value)timer.value=setTimeout(pollJob,3000);}
  async function pollJob(){
    if(polling.value||!job.value||!active.value)return;
    polling.value=true;timer.value=null;
    const current=job.value,l=life,statusVersion=statusSequence;
    const stillCurrent=()=>l===life&&active.value&&job.value===current;
    try{
      const data=await request('/api/job-status?unit='+encodeURIComponent(current.unit),{},()=>stillCurrent()&&statusVersion===statusSequence);
      if(!stillCurrent())return;
      failures=0;
      if(data.running){
        output.value={log:data.log||'',key:'job.running'};
        if(Date.now()-current.startedAt>timeout(current))pauseTracking();else schedule();
      }else{
        storage(current.key,null);job.value=storedJob();
        output.value={log:data.log||'',key:data.result==='success'?'job.success':'job.failed',error:data.result!=='success'};
        await loadStatus();if(stillCurrent())schedule();else if(l===life&&active.value&&job.value)schedule();
      }
    }catch{
      if(!stillCurrent())return;
      failures++;
      if(Date.now()-current.startedAt>timeout(current)||(current.key!=='commons-backup-job'&&failures>30))pauseTracking();
      else{message('job.reconnecting');schedule();}
    }finally{if(l===life)polling.value=false;}
  }
  function timeout(current){return current.key==='commons-backup-job'?30*60*1000:10*60*1000;}
  function pauseTracking(){trackingPaused.value=true;message('job.timeout',true);}
  function resumeTracking(){if(!job.value||pending.value)return;job.value={...job.value,startedAt:Date.now()};failures=0;trackingPaused.value=false;schedule();}
  function track(unit,key){
    if(!JOBS[key]?.test(unit))throw new Error('invalid_job');
    job.value={unit,key,startedAt:Date.now()};storage(key,unit);trackingPaused.value=false;failures=0;schedule();
  }
  async function operation(path,payload={},key=null){
    if(!canWrite.value)return;
    pending.value=true;credential.value=null;const e=epoch,seq=++actionSequence;
    message('common.executing');
    try{
      const data=await request(path,{method:'POST',headers:{'Content-Type':'application/json',...(path==='/api/modules'?{'X-Commons-Modules':'1'}:path.startsWith('/api/backup/')?{'X-Commons-Backup':'1'}:{})},body:JSON.stringify(payload)});
      if(e!==epoch||seq!==actionSequence||!active.value)return;
      if(!data.ok)throw new Error(data.output||'operation_failed');
      if(key){track(data.unit,key);if(key==='commons-modules-job')closeWizard();}
      else{output.value={text:data.output||t('job.success')};await loadStatus();}
    }catch(error){
      if(e!==epoch||seq!==actionSequence||!active.value)return;
      if(path==='/api/modules'){
        await loadModules();if(e!==epoch)return;
        const code=['configuration_changed','operation_busy','quiosc_not_prepared','host_runner_unavailable'].includes(error.message)?'modules.error.'+error.message:'modules.failed';
        moduleError.value=code;message(code,true);
      }else message('admin.operationError',true);
    }finally{if(seq===actionSequence)pending.value=false;}
  }
  function applyModules(){if(!moduleManageable.value||!canWrite.value)return;return operation('/api/modules',{enabled:MODULES.filter(name=>selected.value.includes(name)),revision:modules.value.revision},'commons-modules-job');}
  async function createTeacher(){
    if(!canWrite.value)return;
    const payload=Object.fromEntries(Object.entries(teacher).map(([k,v])=>[k,v.trim()]));
    if(!/^[A-Za-z0-9][A-Za-z0-9._-]{2,149}$/.test(payload.username)||!payload.name)return;
    pending.value=true;credential.value=null;teacherMessage.value='teachers.creating';const e=epoch,seq=++actionSequence;
    try{
      const data=await request('/api/teachers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(e!==epoch||!active.value)return;
      if(!data.teacher?.username||!data.teacher?.temporary_password)throw new Error('invalid_teacher');
      clearTeacher();credential.value={username:data.teacher.username,password:data.teacher.temporary_password};
    }catch{if(e===epoch&&active.value)teacherMessage.value='admin.teacherError';}
    finally{if(seq===actionSequence)pending.value=false;}
  }
  async function checkUpdates(){
    if(!canWrite.value)return;pending.value=true;message('images.checking');const e=epoch,seq=++actionSequence;
    try{const data=await request('/api/updates');if(e===epoch&&seq===actionSequence&&active.value)output.value=data.output?{text:data.output,error:data.ok===false}:{updates:data,error:data.ok===false};}
    catch{if(e===epoch&&seq===actionSequence)message('admin.operationError',true);}
    finally{if(seq===actionSequence)pending.value=false;}
  }
  function confirmed(path,key){if(canWrite.value&&window.confirm(t(key)))return operation(path);}
  function backupCreate(){if(canWrite.value&&window.confirm(t('backup.createConfirm')))return operation('/api/backup/create',{},'commons-backup-job');}
  function typedAction(type){
    if(!canWrite.value)return;
    const names={restore:restore.value,rollback:rollback.value};
    const base=type==='restore'?'backup.restore':type==='rollback'?'images.rollback':'images.update';
    if(type!=='update'&&!names[type]){message(type==='restore'?'backup.noneSelected':'images.rollbackNone',true);return;}
    if(window.prompt(t(base+'Prompt',{backup:names[type]}))!==t(base+'ConfirmWord')){message(base+'Cancelled');return;}
    return operation('/api/'+(type==='restore'?'backup/restore':'images/'+type),type==='update'?{}:{backup:names[type]},type==='restore'?'commons-backup-job':'commons-images-job');
  }
  function secondaryAction(action){
    if(!canWrite.value)return;
    if(action==='configure'&&(!mount.value.trim().startsWith('/')||mount.value.trim()==='/')){message('secondary.error.invalid_configuration',true);return;}
    mountDirty.value=false;
    return operation('/api/backup/secondary',action==='configure'?{action,mount:mount.value.trim()}:{action},'commons-backup-job');
  }
  async function logout(){
    if(loggingOut.value)return;loggingOut.value=true;
    ++life;stopPoll();polling.value=false;invalidate();pending.value=true;checking.value=false;output.value={key:'common.actionPlaceholder'};apiMessage.value='status.disconnected';
    const seq=actionSequence;
    try{await fetch('/api/auth/oidc/logout',{method:'POST',credentials:'same-origin',cache:'no-store'});}catch{if(seq===actionSequence&&active.value)apiMessage.value='status.authRequired';}
    finally{if(seq===actionSequence){pending.value=false;loggingOut.value=false;}}
  }
  function login(){if(!pending.value)location.href='/api/auth/oidc/login?next=%2Fadmin%2F';}
  function langChange(){language.value=window.i18nAdmin.getLang();}
  function hide(){active.value=false;++life;stopPoll();polling.value=false;invalidate();pending.value=false;loggingOut.value=false;output.value={key:'common.actionPlaceholder'};checking.value=false;document.getElementById('adminApp')?.setAttribute('hidden','');}
  async function show(event){if(!event.persisted)return;active.value=true;document.getElementById('adminApp')?.removeAttribute('hidden');job.value=storedJob();trackingPaused.value=false;await loadStatus();schedule();}
  onMounted(()=>{job.value=storedJob();if(job.value)message('modules.applying');void loadStatus();schedule();window.addEventListener('edutictac:langchange',langChange);window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);});
  onBeforeUnmount(()=>{hide();window.removeEventListener('edutictac:langchange',langChange);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);});
  return {t,language,authorized,checking,pending,loggingOut,busy,canWrite,status,statusText,output,actionText,apiMessage,modules,selected,moduleManageable,moduleError,modulesNotice,wizard,wizardOpen,dismissed,closeWizard,teacher,teacherMessage,credential,clearTeacher,mount,mountDirty,restore,rollback,backups,rollbacks,secondary,secondaryText,job,pollState,trackingPaused,loadStatus,applyModules,createTeacher,checkUpdates,confirmed,backupCreate,typedAction,secondaryAction,operation,logout,login,resumeTracking};
}
