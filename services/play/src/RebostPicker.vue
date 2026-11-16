<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue';
import {optimizeImage} from './model.js';
const props=defineProps({base:{type:String,required:true},t:{type:Function,required:true},language:{type:String,default:'es'},mode:{type:String,default:'image'}});
const emit=defineEmits(['close','select']);
const dialog=ref(),closeButton=ref();
const sound=props.mode==='sound';
const collection=ref(sound?'effects':'catalog');
const term=ref(''),items=ref([]),cursor=ref(''),loading=ref(false),error=ref(''),busyId=ref('');
const player=ref(),playingId=ref('');
const LIMIT=24;
function contentUrl(id){return props.base+'/api/rebost/items/'+id+'/content';}
function credit(item){return [item.attribution,item.license].filter(Boolean).join(' · ');}
function duration(value){return value?Math.max(1,Math.round(Number(value)/1000))+' s':'';}
async function load(more=false){
  if(loading.value)return;
  loading.value=true;error.value='';
  const params=new URLSearchParams({collection:collection.value,limit:String(LIMIT)});
  if(sound)params.set('type','sound');
  if(term.value.trim())params.set('q',term.value.trim());
  if(more&&cursor.value)params.set('cursor',cursor.value);
  try{
    const response=await fetch(props.base+'/api/rebost/items?'+params,{cache:'no-store'});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||'rebost');
    items.value=more?[...items.value,...data.items]:data.items;
    cursor.value=data.next_cursor||'';
  }catch{error.value=props.t('rebost.error');}
  finally{loading.value=false;}
}
function changeCollection(value){if(collection.value===value)return;collection.value=value;cursor.value='';items.value=[];void load();}
function search(){cursor.value='';items.value=[];void load();}
function playSound(item){
  if(!player.value)return;
  if(playingId.value===item.id){player.value.pause();playingId.value='';return;}
  player.value.src=contentUrl(item.id);playingId.value=item.id;
  player.value.play().catch(()=>{playingId.value='';});
}
function readAudio(blob){
  if(!['audio/ogg','audio/mpeg','audio/wav'].includes(blob.type)||blob.size>256*1024)return Promise.reject(new Error('audio'));
  return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
}
async function choose(item){
  if(busyId.value)return;
  busyId.value=item.id;
  try{
    const response=await fetch(contentUrl(item.id));
    if(!response.ok)throw new Error('content');
    const blob=await response.blob();
    let data;
    if(sound)data=await readAudio(blob);
    else data=await optimizeImage(new File([blob],item.name||'rebost',{type:blob.type}));
    emit('select',{data,credit:credit(item),name:item.name||'',id:item.id});
  }catch{error.value=props.t(sound?'rebost.audioError':'rebost.imageError');}
  finally{busyId.value='';}
}
function close(){if(dialog.value?.open)dialog.value.close();emit('close');}
function backdrop(event){if(event.target===dialog.value)close();}
onMounted(()=>{dialog.value?.showModal();closeButton.value?.focus();void load();});
onBeforeUnmount(()=>{if(dialog.value?.open)dialog.value.close();if(player.value)player.value.pause();});
</script>
<template>
 <dialog ref="dialog" class="rebost-dialog" aria-labelledby="rebostTitle" @cancel.prevent="close" @click="backdrop">
  <div class="rebost-head">
   <div>
    <p class="eyebrow">{{t('rebost.eyebrow')}}</p>
    <h2 id="rebostTitle">{{t(sound?'rebost.titleSounds':'rebost.titleImages')}}</h2>
    <p class="muted">{{t(sound?'rebost.helpSounds':'rebost.helpImages')}}</p>
   </div>
   <button ref="closeButton" type="button" class="button secondary" @click="close">{{t('rebost.close')}}</button>
  </div>
  <form class="rebost-filters" @submit.prevent="search">
   <input v-model="term" type="search" :placeholder="t('rebost.searchPlaceholder')" :aria-label="t('rebost.search')">
   <button class="button secondary" type="submit" :disabled="loading">{{t('rebost.search')}}</button>
  </form>
  <div class="rebost-tabs" role="group" :aria-label="t('rebost.collection')">
   <template v-if="sound">
    <button type="button" class="button secondary" :aria-pressed="collection==='effects'" @click="changeCollection('effects')">{{t('rebost.effects')}}</button>
   </template>
   <template v-else>
    <button type="button" class="button secondary" :aria-pressed="collection==='catalog'" @click="changeCollection('catalog')">{{t('rebost.catalog')}}</button>
    <button type="button" class="button secondary" :aria-pressed="collection==='scratch'" @click="changeCollection('scratch')">{{t('rebost.scratch')}}</button>
   </template>
  </div>
  <p v-if="error" class="error" role="alert">{{error}}</p>
  <p v-if="loading&&!items.length" class="library-status">{{t('rebost.loading')}}</p>
  <p v-else-if="!loading&&!error&&!items.length" class="library-status">{{t('rebost.empty')}}</p>
  <div class="rebost-grid">
   <article v-for="item in items" :key="item.id" class="rebost-card">
    <button v-if="sound" type="button" class="rebost-sound" :aria-label="t('rebost.play')" @click="playSound(item)">
     <span aria-hidden="true">{{playingId===item.id?'❚❚':'▶'}}</span>
     <span>{{item.name}}</span>
    </button>
    <img v-else :src="contentUrl(item.id)" :alt="item.name" loading="lazy">
    <p class="rebost-meta">{{sound?duration(item.duration_ms):item.name}}</p>
    <p v-if="credit(item)" class="rebost-credit">{{credit(item)}}</p>
    <button type="button" class="button" :disabled="!!busyId" @click="choose(item)">{{busyId===item.id?t('rebost.loading'):t('rebost.pick')}}</button>
   </article>
  </div>
  <div class="actions">
   <button v-if="cursor" type="button" class="button secondary" :disabled="loading" @click="load(true)">{{t('rebost.more')}}</button>
  </div>
  <audio ref="player" hidden @ended="playingId=''"></audio>
 </dialog>
</template>
