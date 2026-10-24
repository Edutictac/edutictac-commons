import {computed, onBeforeUnmount, ref, shallowRef} from 'vue';

export const acceptedFiles='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.odg,.txt,.md,.csv,.png,.jpg,.jpeg,.webp,.gif,.mp3,.ogg,.wav,.m4a,.mp4,.webm,.epub,.zip';
const errors=new Set(['file_too_large','files_quota_exceeded','files_count_limit','files_disk_full','student_upload_disabled','file_type_not_allowed','file_content_not_allowed','invalid_path','file_not_found','files_busy','upload_rate_limit']);
export function useClassroomFiles(api,t,onSessionExpired) {
  const context=shallowRef({enabled:false,groupId:'',identityId:''}),rows=ref([]),settings=ref(null),usage=ref(null);
  const open=ref(false),tab=ref('shared'),ready=ref(false),loading=ref(false),pending=ref(false),feedback=ref(''),done=ref(0),total=ref(0);
  const search=ref('');let epoch=0,sequence=0,alive=true;const controllers=new Set();
  const base=computed(()=>context.value.identityId?'/api/student/group-files':`/api/teacher/groups/${encodeURIComponent(context.value.groupId)}/files`);
  const visible=computed(()=>rows.value.filter(row=>row.scope===(tab.value==='shared'?'shared':'submission')&&row.relative_path.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())));
  const disabled=computed(()=>!context.value.enabled||!context.value.groupId||pending.value||loading.value);
  function current(version){return alive&&version===epoch&&context.value.enabled&&Boolean(context.value.groupId);}
  function reset(){epoch++;sequence++;for(const c of controllers)c.abort();controllers.clear();rows.value=[];settings.value=null;usage.value=null;ready.value=false;loading.value=false;pending.value=false;feedback.value='';done.value=0;total.value=0;search.value='';}
  function setContext(next){
    const changed=next.enabled!==context.value.enabled||next.groupId!==context.value.groupId||next.identityId!==context.value.identityId;
    context.value=next;
    if(changed){reset();tab.value='shared';if(open.value&&next.enabled&&next.groupId)void load();}
  }
  async function request(path,options={}){const controller=new AbortController();controllers.add(controller);try{return await api(path,{...options,signal:controller.signal});}finally{controllers.delete(controller);}}
  function error(error){
    rows.value=[];ready.value=false;
    if(error.status===401){feedback.value='files.sessionExpired';onSessionExpired?.();}
    else feedback.value='files.error.'+(errors.has(error.message)?error.message:'operation');
  }
  async function load(clear=true){
    if(!context.value.enabled||!context.value.groupId)return;
    const version=epoch,read=++sequence;loading.value=true;ready.value=false;if(clear)feedback.value='';
    try{const data=await request(base.value,{method:'GET'});if(!current(version)||read!==sequence)return;
      if(!Array.isArray(data.files)||!data.settings||!data.usage)throw new Error('invalid_files');
      rows.value=data.files;settings.value=data.settings;usage.value=data.usage;ready.value=true;
    }catch(e){if(current(version)&&read===sequence)error(e);}
    finally{if(current(version)&&read===sequence)loading.value=false;}
  }
  function toggle(event){open.value=event.target.open;if(open.value&&!ready.value&&!loading.value&&!pending.value)void load();}
  async function upload(files){
    if(disabled.value||!ready.value)return;
    const selected=Array.from(files||[]);if(!selected.length)return;
    if(selected.length>1000){feedback.value='files.error.files_count_limit';return;}
    const version=epoch,path=base.value;pending.value=true;feedback.value='';done.value=0;total.value=selected.length;
    try{
      for(const file of selected){
        if(!current(version))return;
        if(file.size>settings.value.max_file_bytes)throw new Error('file_too_large');
        const name=file.webkitRelativePath||file.relativePath||file.name;
        let replace=rows.value.some(row=>row.relative_path===name&&row.scope===(context.value.identityId?'submission':'shared'));
        if(replace&&!window.confirm(t('files.replace',{name})))continue;
        const options=()=>({method:'POST',body:file,headers:{'Content-Type':'application/octet-stream','X-File-Path':encodeURIComponent(name),...(replace?{'X-File-Replace':'1'}:{})}});
        try{await request(path,options());}
        catch(e){if(e.status!==409||e.message!=='file_exists'||!current(version))throw e;
          if(!window.confirm(t('files.replace',{name})))continue;replace=true;await request(path,options());}
        if(!current(version))return;done.value++;
      }
      if(current(version))feedback.value='files.saved';
    }catch(e){if(current(version))error(e);}
    finally{if(current(version)){pending.value=false;await load(false);}}
  }
  async function remove(row){
    if(disabled.value||!ready.value||!window.confirm(t('files.confirmDelete',{name:row.relative_path})))return;
    const version=epoch;pending.value=true;feedback.value='';done.value=0;total.value=0;
    try{await request(base.value+'/'+encodeURIComponent(row.id),{method:'DELETE'});if(current(version))feedback.value='files.deleted';}
    catch(e){if(current(version))error(e);}
    finally{if(current(version)){pending.value=false;await load(false);}}
  }
  async function drop(event){
    if(disabled.value||!ready.value)return;
    // Directory entries retain their relative paths; browsers without this API
    // still support the native folder chooser and ordinary dropped files.
    const selected=[];
    async function walk(entry,prefix=''){
      if(selected.length>=1000)throw new Error('files_count_limit');
      if(entry.isFile){const file=await new Promise((resolve,reject)=>entry.file(resolve,reject));file.relativePath=prefix+file.name;selected.push(file);}
      else if(entry.isDirectory){const reader=entry.createReader();let batch;do{batch=await new Promise((resolve,reject)=>reader.readEntries(resolve,reject));for(const child of batch)await walk(child,prefix+entry.name+'/');}while(batch.length);}
    }
    const version=epoch;
    try{
      const items=Array.from(event.dataTransfer?.items||[]),entries=items.map(item=>item.webkitGetAsEntry?.());
      if(entries.length&&entries.every(Boolean)){for(const entry of entries)await walk(entry);}
      else selected.push(...Array.from(event.dataTransfer?.files||[]));
      if(current(version))await upload(selected);
    }catch(e){if(current(version))error(e);}
  }
  function hide(){reset();}
  function show(event){if(event.persisted&&open.value)void load();}
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);
  onBeforeUnmount(()=>{alive=false;reset();window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);});
  return {context,rows,settings,usage,open,tab,ready,loading,pending,feedback,done,total,search,visible,disabled,base,setContext,load,toggle,upload,remove,drop};
}
