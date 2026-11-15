<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue';
import qrcode from 'qrcode-generator';
const props=defineProps({url:{type:String,required:true},t:{type:Function,required:true}});
const emit=defineEmits(['close']);
const dialog=ref(),canvas=ref(),closeButton=ref(),status=ref('');
function draw(){
  const target=canvas.value;if(!target)return;
  const code=qrcode(0,'M');code.addData(props.url);code.make();
  const modules=code.getModuleCount(),quiet=4,cells=modules+quiet*2;
  const cssSize=Math.max(220,Math.min(300,Math.floor(window.innerWidth*0.7)));
  const ratio=window.devicePixelRatio||1,cell=Math.floor((cssSize*ratio)/cells),pixels=cell*cells;
  target.width=pixels;target.height=pixels;target.style.width=cssSize+'px';target.style.height=cssSize+'px';
  const context=target.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,pixels,pixels);context.fillStyle='#111';
  for(let row=0;row<modules;row+=1)for(let column=0;column<modules;column+=1)if(code.isDark(row,column))context.fillRect((column+quiet)*cell,(row+quiet)*cell,cell,cell);
}
function close(){if(dialog.value?.open)dialog.value.close();emit('close');}
function backdrop(event){if(event.target===dialog.value)close();}
async function copyLink(){
  try{await navigator.clipboard.writeText(props.url);status.value=props.t('copied');}
  catch{status.value=props.t('copyError');}
  window.setTimeout(()=>{status.value='';},2500);
}
onMounted(()=>{dialog.value?.showModal();draw();closeButton.value?.focus();});
onBeforeUnmount(()=>{if(dialog.value?.open)dialog.value.close();});
</script>
<template>
 <dialog ref="dialog" class="qr-dialog" aria-labelledby="qrDialogTitle" @cancel.prevent="close" @click="backdrop">
  <div class="qr-card">
   <h2 id="qrDialogTitle">{{t('qrTitle')}}</h2>
   <p>{{t('qrHint')}}</p>
   <canvas ref="canvas" class="qr-canvas" role="img" :aria-label="t('qrAria')"></canvas>
   <p class="qr-note">{{t('qrNote')}}</p>
   <input class="qr-url" type="text" readonly :value="url" :aria-label="t('copy')" @focus="$event.target.select()">
   <div class="qr-actions">
    <button type="button" class="button" @click="copyLink">{{t('copy')}}</button>
    <button ref="closeButton" type="button" class="button secondary" @click="close">{{t('qrClose')}}</button>
   </div>
   <p class="qr-status" role="status">{{status}}</p>
  </div>
 </dialog>
</template>
