<script setup>
import {computed,watch} from 'vue';
import {usePortalTranslations} from '../shared/usePortalTranslations.js';
import {acceptedFiles,useClassroomFiles} from './useClassroomFiles.js';
const props=defineProps({api:Function,onSessionExpired:Function,enabled:Boolean,groupId:String,identityId:{type:String,default:''}});
const t=usePortalTranslations();
const {settings,usage,tab,ready,loading,pending,feedback,done,total,search,visible,disabled,base,setContext,load,toggle,upload,remove,drop}=useClassroomFiles(props.api,t,props.onSessionExpired);
watch(()=>[props.enabled,props.groupId,props.identityId],()=>setContext({enabled:props.enabled,groupId:props.groupId,identityId:props.identityId}),{immediate:true});
const student=computed(()=>Boolean(props.identityId));
const canUpload=computed(()=>ready.value&&!disabled.value&&(student.value?tab.value==='submission'&&settings.value?.students_can_upload:tab.value==='shared'));
const used=computed(()=>student.value?usage.value?.student_bytes:usage.value?.group_bytes);
const quota=computed(()=>student.value?settings.value?.student_quota_bytes:settings.value?.group_quota_bytes);
const size=value=>((value||0)/1048576).toLocaleString(undefined,{maximumFractionDigits:2});
function choose(event){const files=Array.from(event.target.files||[]);event.target.value='';void upload(files);}
</script>
<template>
  <details class="classroom-files" data-classroom-files @toggle="toggle">
    <summary><strong>{{t('files.title')}}</strong></summary>
    <p>{{t(student?'files.studentHint':'files.teacherHint')}}</p>
    <p v-if="!enabled||!groupId">{{t('files.selectGroup')}}</p>
    <template v-else>
      <div class="actions">
        <button type="button" data-files-tab="shared" :aria-pressed="tab==='shared'" @click="tab='shared'">{{t('files.shared')}}</button>
        <button type="button" data-files-tab="submission" :aria-pressed="tab==='submission'" @click="tab='submission'">{{t(student?'files.mine':'files.submissions')}}</button>
        <button type="button" class="secondary" data-files-refresh :disabled="disabled" @click="load()">{{t('files.refresh')}}</button>
      </div>
      <p v-if="student&&tab==='submission'" class="hint">{{t('files.privateHint')}}</p>
      <p v-if="loading" role="status">{{t('files.loading')}}</p>
      <p v-if="feedback" role="status" data-files-feedback>{{t(feedback,{count:done})}}</p>
      <p v-if="done&&feedback&&feedback!=='files.saved'">{{t('files.partial',{count:done})}}</p>
      <template v-if="ready">
        <p>{{t('files.quota',{used:size(used),limit:size(quota)})}}</p>
        <progress :value="used||0" :max="quota||1" :aria-label="t('files.space')"></progress>
        <p class="hint">{{t('files.limit',{limit:size(settings.max_file_bytes)})}}</p>
        <p v-if="student&&!settings.students_can_upload">{{t('files.uploadDisabled')}}</p>
        <div v-if="canUpload||pending" class="files-upload" @dragover.prevent @drop.prevent="canUpload&&drop($event)">
          <p>{{t('files.drop')}}</p>
          <div class="actions">
            <label class="button-link" :aria-disabled="!canUpload">{{t('files.choose')}}<input data-files-input type="file" multiple :accept="acceptedFiles" :disabled="!canUpload" @change="choose"></label>
            <label class="button-link secondary" :aria-disabled="!canUpload">{{t('files.chooseFolder')}}<input data-files-folder type="file" multiple webkitdirectory :disabled="!canUpload" @change="choose"></label>
          </div>
        </div>
        <template v-if="pending"><p role="status">{{t('files.progress',{done,total})}}</p><progress :value="done" :max="total||1" :aria-label="t('files.progress',{done,total})"></progress></template>
        <label>{{t('files.search')}}<input v-model="search" type="search" data-files-search></label>
        <p v-if="!visible.length&&!loading">{{t('files.empty')}}</p>
        <ul class="file-list">
          <li v-for="file in visible" :key="file.id" :data-classroom-file="file.id">
            <div><strong>{{file.relative_path}}</strong><small>{{size(file.size)}} MiB<span v-if="!student&&file.public_code"> · {{file.public_code}}</span></small></div>
            <div class="actions">
              <a :href="disabled?undefined:base+'/'+encodeURIComponent(file.id)+'/download'" class="button-link secondary" :aria-disabled="disabled" data-file-download>{{t('files.download')}}</a>
              <button v-if="!student||file.scope==='submission'" type="button" class="secondary" :disabled="disabled" data-file-delete @click="remove(file)">{{t('files.delete')}}</button>
            </div>
          </li>
        </ul>
      </template>
    </template>
  </details>
</template>
