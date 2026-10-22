<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue';
import H5PPlayer from './H5PPlayer.vue';
const props=defineProps({base:String,t:Function});
const rows=ref([]),selected=ref(null),busy=ref(false),error=ref(''),message=ref(''),feedback=ref(''),offset=ref(0),more=ref(false);
let epoch=0,active=true;
async function api(path,options={}){const response=await fetch(props.base+'/api/reviews'+path,{credentials:'same-origin',cache:'no-store',...options});const data=await response.json();if(!response.ok)throw Error();return data;}
async function load(next=offset.value){
 if(busy.value)return;busy.value=true;const token=++epoch;error.value='';selected.value=null;feedback.value='';
 try{const data=await api('?offset='+next);if(token!==epoch||!active)return;rows.value=data.items;offset.value=data.offset;more.value=data.more;}
 catch{if(token===epoch){error.value='reviewError';rows.value=[];}}
 finally{if(token===epoch)busy.value=false;}
}
async function select(id){
 if(busy.value)return;busy.value=true;const token=++epoch;selected.value=null;feedback.value='';error.value='';message.value='';
 try{const data=await api('/'+id);if(token===epoch&&active)selected.value=data;}
 catch{if(token===epoch)error.value='reviewError';}
 finally{if(token===epoch)busy.value=false;}
}
async function decide(decision){
 if(busy.value||!selected.value)return;if(decision==='return'&&!feedback.value.trim()){error.value='feedbackRequired';return;}
 busy.value=true;const token=++epoch,item=selected.value;error.value='';
 try{
  const result=await api('/'+item.id,{method:'POST',headers:{'Content-Type':'application/json','X-Play-Review':'1'},body:JSON.stringify({decision,revision:item.revision,feedback:feedback.value.trim()})});
  if(token!==epoch||!active)return;
  selected.value={...item,...result};rows.value=rows.value.map(row=>row.id===item.id?{...row,...result}:row);message.value=decision==='approve'?'reviewApproved':decision==='return'?'reviewReturned':'reviewWithdrawn';
 }catch{if(token===epoch)error.value='reviewDecisionError';}
 finally{if(token===epoch)busy.value=false;}
}
function hide(){active=false;++epoch;rows.value=[];selected.value=null;feedback.value='';busy.value=false;}
function show(event){if(event.persisted){active=true;void load();}}
onMounted(()=>{void load();window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);});
onBeforeUnmount(()=>{hide();window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);});
</script>
<template><section id="playReviews" class="panel"><div class="section-heading"><h1>{{t('reviewsTitle')}}</h1><button id="refreshReviews" class="button secondary" :disabled="busy" @click="load()">{{t('refresh')}}</button></div><p v-if="error" role="alert" class="error">{{t(error)}}</p><p v-if="message" id="reviewMessage" role="status">{{t(message)}}</p><p v-if="busy" role="status">{{t('libraryLoading')}}</p><p v-if="!busy&&!rows.length">{{t('reviewsEmpty')}}</p><div id="playReviewList" class="library-grid"><article v-for="item in rows" :key="item.id" class="library-card"><h2>{{item.title}}</h2><p>{{item.class_name}} · {{t('reviewStatus.'+item.status)}}</p><button class="button" :data-review-id="item.id" :disabled="busy" @click="select(item.id)">{{t('reviewOpen')}}</button></article></div><div class="actions"><button id="reviewsPrev" class="button secondary" :disabled="busy||offset===0" @click="load(Math.max(0,offset-25))">{{t('libraryPrev')}}</button><button id="reviewsNext" class="button secondary" :disabled="busy||!more" @click="load(offset+25)">{{t('libraryNext')}}</button></div><section v-if="selected" id="playReviewDetail"><h2>{{selected.title}}</h2><p>{{t('reviewStatus.'+selected.status)}}</p><H5PPlayer :base="base" :activity="selected.activity">{{t('playerError')}}</H5PPlayer><label>{{t('reviewFeedback')}}<textarea id="reviewFeedback" v-model="feedback" maxlength="2000" :disabled="busy"></textarea></label><div class="actions"><button v-if="selected.status==='pending'" id="approvePlay" class="button" :disabled="busy" @click="decide('approve')">{{t('reviewApprove')}}</button><button v-if="selected.status==='pending'" id="returnPlay" class="button secondary" :disabled="busy" @click="decide('return')">{{t('reviewReturn')}}</button><button v-if="selected.status==='approved'" id="withdrawPlay" class="button secondary" :disabled="busy" @click="decide('withdraw')">{{t('unpublishRecursos')}}</button></div></section></section></template>
