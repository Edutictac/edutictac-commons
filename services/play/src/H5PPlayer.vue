<script setup>
import {ref,watch,onBeforeUnmount,nextTick} from 'vue';
const props=defineProps({base:String,activity:Object,onStatement:Function});
const container=ref(),error=ref(false);let sequence=0,cleanup=()=>{};
async function runtime(){
 if(!window._h5pReady)window._h5pReady=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=props.base+'/assets/main.bundle.js';script.onload=()=>{window._h5pCtor=window.H5PStandalone;resolve();};script.onerror=()=>{window._h5pReady=null;reject(new Error('runtime'));};document.head.append(script);});
 await window._h5pReady;return window._h5pCtor||window.H5PStandalone;
}
watch(()=>props.activity?.id,async id=>{
 const token=++sequence;cleanup();error.value=false;await nextTick();if(!id||!container.value)return;container.value.replaceChildren();
 try{
  const lib=await runtime();if(token!==sequence)return;
  const mount=document.createElement('div');mount.id='h5p-container';container.value.replaceChildren(mount);
  await new lib.H5P(mount,{h5pJsonPath:`${props.base}/api/activities/${id}/h5p`,librariesPath:props.base+'/h5p-libraries',frameJs:props.base+'/assets/frame.bundle.js',frameCss:props.base+'/assets/h5p.css',frame:true,fullScreen:true});
  if(token!==sequence){mount.remove();return;}
  const dispatcher=window.H5P?.externalDispatcher;
  const listener=event=>{if(token===sequence)props.onStatement?.(event.data?.statement,id);};
  dispatcher?.on('xAPI',listener);
  const resize=()=>{if(token!==sequence||props.activity?.type!=='crossword')return;const frame=mount.querySelector('iframe'),doc=frame?.contentDocument;if(!frame||!doc)return;const content=doc.querySelector('.h5p-crossword');frame.style.height=`${Math.max(content?.scrollHeight||doc.body?.scrollHeight||0,420)+8}px`;};
  const timers=[setTimeout(resize,100),setTimeout(resize,500)];window.addEventListener('resize',resize,{passive:true});
  cleanup=()=>{dispatcher?.off?.('xAPI',listener);timers.forEach(clearTimeout);window.removeEventListener('resize',resize);mount.remove();};
 }catch{if(token===sequence)error.value=true;}
},{immediate:true});
onBeforeUnmount(()=>{++sequence;cleanup();});
</script>
<template><div id="player" ref="container"></div><p v-if="error" role="alert"><slot /></p></template>
