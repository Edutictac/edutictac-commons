<script setup>
import {onBeforeUnmount,reactive,ref,watch} from 'vue';
const props=defineProps({t:Function,authorized:Boolean,canWrite:Boolean});
const open=ref(false),loading=ref(false),pending=ref(false),ready=ref(false),feedback=ref(''),usage=ref(null);
const values=reactive({max:50,group:500,student:50,upload:true});
let epoch=0,controller=null;
const size=value=>((value||0)/1048576).toLocaleString(undefined,{maximumFractionDigits:2});
function reset(){epoch++;controller?.abort();ready.value=false;loading.value=false;pending.value=false;feedback.value='';usage.value=null;}
watch(()=>props.authorized,value=>{reset();if(value&&open.value)void load();});
async function request(options={}){
 controller?.abort();controller=new AbortController();
 const response=await fetch('/api/admin/files/settings',{credentials:'same-origin',cache:'no-store',signal:controller.signal,...options});
 if(!response.ok)throw new Error('files_settings_failed');return response.json();
}
function apply(data){
 if(!data.settings)throw new Error('invalid_files_settings');
 values.max=data.settings.max_file_bytes/1048576;values.group=data.settings.group_quota_bytes/1048576;values.student=data.settings.student_quota_bytes/1048576;values.upload=data.settings.students_can_upload;
 usage.value=data;ready.value=true;
}
async function load(){
 if(!props.authorized||pending.value||loading.value)return;
 const version=epoch;loading.value=true;feedback.value='';
 try{const data=await request();if(version===epoch)apply(data);}catch{if(version===epoch){ready.value=false;feedback.value='filesSettings.error';}}
 finally{if(version===epoch)loading.value=false;}
}
async function save(){
 if(!props.canWrite||pending.value||loading.value||!ready.value)return;
 if(values.student>values.group||values.max>values.group){feedback.value='filesSettings.invalid';return;}
 const version=epoch;pending.value=true;feedback.value='';
 try{
  const data=await request({method:'PUT',headers:{'Content-Type':'application/json','X-Commons-Files':'1'},body:JSON.stringify({max_file_bytes:Math.round(values.max*1048576),group_quota_bytes:Math.round(values.group*1048576),student_quota_bytes:Math.round(values.student*1048576),students_can_upload:values.upload})});
  if(version===epoch){apply(data);feedback.value='filesSettings.saved';}
 }catch{if(version===epoch)feedback.value='filesSettings.error';}
 finally{if(version===epoch)pending.value=false;}
}
function toggle(event){open.value=event.target.open;if(open.value&&!ready.value)void load();}
onBeforeUnmount(reset);
</script>
<template>
 <section class="panel" data-files-settings>
  <details @toggle="toggle"><summary><strong>{{t('filesSettings.title')}}</strong></summary>
   <p>{{t('filesSettings.help')}}</p>
   <p v-if="!authorized">{{t('filesSettings.signIn')}}</p>
   <button type="button" class="secondary" data-files-settings-refresh :disabled="!authorized||loading||pending" @click="load">{{t('login.refresh')}}</button>
   <p v-if="loading" role="status">{{t('filesSettings.loading')}}</p>
   <p v-if="feedback" role="status" data-files-settings-feedback>{{t(feedback)}}</p>
   <form v-if="authorized&&ready" @submit.prevent="save">
    <fieldset :disabled="!canWrite||loading||pending" class="teacher-fields">
     <label>{{t('filesSettings.max')}}<input v-model.number="values.max" data-files-max type="number" min="0.001" max="100" step="0.001" required></label>
     <label>{{t('filesSettings.group')}}<input v-model.number="values.group" data-files-group type="number" min="0.001" max="100000" step="0.001" required></label>
     <label>{{t('filesSettings.student')}}<input v-model.number="values.student" data-files-student type="number" min="0.001" max="100000" step="0.001" required></label>
     <label><input v-model="values.upload" data-files-upload type="checkbox">{{t('filesSettings.allowUpload')}}</label>
     <button type="submit" data-files-settings-save>{{t('filesSettings.save')}}</button>
    </fieldset>
    <p>{{t('filesSettings.usage',{used:size(usage.usage.total_bytes),free:size(usage.disk_free_bytes),count:usage.usage.files})}}</p>
   </form>
  </details>
 </section>
</template>
