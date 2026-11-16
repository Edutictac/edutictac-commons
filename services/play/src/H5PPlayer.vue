<script setup>
import {ref,watch,onBeforeUnmount,nextTick} from 'vue';
const props=defineProps({base:String,activity:Object,onStatement:Function,loadingLabel:{type:String,default:'Cargando actividad…'}});
const container=ref(),error=ref(false),loading=ref(true);let sequence=0,cleanup=()=>{};
async function runtime(){
 if(!window._h5pReady)window._h5pReady=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=props.base+'/assets/main.bundle.js';script.onload=()=>{window._h5pCtor=window.H5PStandalone;resolve();};script.onerror=()=>{window._h5pReady=null;reject(new Error('runtime'));};document.head.append(script);});
 await window._h5pReady;return window._h5pCtor||window.H5PStandalone;
}
watch(()=>props.activity?.id,async id=>{
 const token=++sequence;cleanup();error.value=false;loading.value=true;await nextTick();if(!id||!container.value)return;container.value.replaceChildren();
 try{
  const lib=await runtime();if(token!==sequence)return;
  const mount=document.createElement('div');mount.id='h5p-container';container.value.replaceChildren(mount);
  await new lib.H5P(mount,{h5pJsonPath:`${props.base}/api/activities/${id}/h5p`,librariesPath:props.base+'/h5p-libraries',frameJs:props.base+'/assets/frame.bundle.js',frameCss:props.base+'/assets/h5p.css',frame:true,fullScreen:true,assetsRequestFetchOptions:props.activity?.type==='matching'?{cache:'no-cache'}:undefined});
  if(token!==sequence){mount.remove();return;}
  // Els components nous d'arrossegar requerixen el tema per a les capes i anses.
  const frame=mount.querySelector('iframe');let themeObserver;
  const watchDragTheme=()=>{
   themeObserver?.disconnect();const doc=frame?.contentDocument;
   const apply=()=>doc?.querySelectorAll('.h5p-dragquestion').forEach(element=>element.classList.add('h5p-theme'));
   themeObserver=new MutationObserver(apply);
   if(doc?.body)themeObserver.observe(doc.body,{childList:true,subtree:true});apply();
  };
  frame?.addEventListener('load',watchDragTheme);watchDragTheme();
  loading.value=false;
  const dispatcher=window.H5P?.externalDispatcher;
  const listener=event=>{if(token===sequence)props.onStatement?.(event.data?.statement,id);};
  dispatcher?.on('xAPI',listener);
  const resize=()=>{if(token!==sequence||props.activity?.type!=='crossword')return;const frame=mount.querySelector('iframe'),doc=frame?.contentDocument;if(!frame||!doc)return;const content=doc.querySelector('.h5p-crossword');frame.style.height=`${Math.max(content?.scrollHeight||doc.body?.scrollHeight||0,420)+8}px`;};
  const timers=[setTimeout(resize,100),setTimeout(resize,500)];window.addEventListener('resize',resize,{passive:true});
  cleanup=()=>{frame?.removeEventListener('load',watchDragTheme);themeObserver?.disconnect();dispatcher?.off?.('xAPI',listener);timers.forEach(clearTimeout);window.removeEventListener('resize',resize);mount.remove();};
 }catch{if(token===sequence){loading.value=false;error.value=true;}}
},{immediate:true});
onBeforeUnmount(()=>{++sequence;cleanup();});
</script>
<template><p v-if="loading" class="player-loading" role="status">{{loadingLabel}}</p><div id="player" ref="container"></div><p v-if="error" role="alert"><slot /></p></template>
