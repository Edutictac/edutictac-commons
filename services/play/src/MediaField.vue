<script setup>
import {ref} from 'vue';
import {optimizeImage,readAudio} from './model.js';
import RebostPicker from './RebostPicker.vue';
const props=defineProps({kind:{type:String,default:'image'},value:{type:String,default:''},credit:{type:String,default:''},base:{type:String,required:true},t:{type:Function,required:true},language:{type:String,default:'es'},rebost:{type:Boolean,default:false},banks:{type:Boolean,default:false},label:{type:String,default:''}});
const emit=defineEmits(['update:value','update:credit','busy','error']);
const input=ref(),picker=ref(false);
async function file(event){
  const selected=event.target.files?.[0];if(!selected)return;
  emit('busy',1);
  try{
    const data=props.kind==='image'?await optimizeImage(selected):await readAudio(selected);
    emit('update:value',data);emit('update:credit','');
  }catch{emit('error');}
  finally{event.target.value='';emit('busy',-1);}
}
function chosen(result){picker.value=false;emit('update:value',result.data);emit('update:credit',result.credit||'');}
function remove(){emit('update:value','');emit('update:credit','');}
</script>
<template>
 <div class="media-field">
  <span v-if="label" class="media-label">{{label}}</span>
  <img v-if="kind==='image'&&value" :src="value" class="editor-thumbnail" alt="">
  <audio v-else-if="kind==='audio'&&value" :src="value" controls preload="none"></audio>
  <div class="media-actions">
   <label class="button secondary media-upload">
    <input ref="input" type="file" :accept="kind==='image'?'image/png,image/jpeg,image/webp':'audio/ogg,audio/mpeg,audio/wav'" hidden @change="file">
    <span>{{t(value?'media.change':'media.upload')}}</span>
   </label>
   <button v-if="rebost" type="button" class="button secondary" @click="picker=true">{{t('rebost.open')}}</button>
   <button v-if="value" type="button" class="button secondary" @click="remove">{{t('media.remove')}}</button>
  </div>
  <small v-if="credit" class="media-credit">{{credit}}</small>
  <RebostPicker v-if="picker" :base="base" :t="t" :language="language" :mode="kind==='audio'?'sound':'image'" :banks="banks" @close="picker=false" @select="chosen" />
 </div>
</template>
