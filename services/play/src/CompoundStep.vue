<script setup>
import {ref,watch} from 'vue';
import {newActivity,clone,CHILD_TYPES,TYPE_LABELS} from './model.js';
const props=defineProps({step:Object,index:Number,t:Function,disabled:Boolean});
const emit=defineEmits(['remove']);
const answers=ref(''),pairs=ref(''),categories=ref(''),items=ref('');const drafts={};
function refresh(){const s=props.step;answers.value=(s.answers||[]).map(a=>(a.correct?'*':'')+a.text).join('\n');pairs.value=(s.pairs||[]).map(p=>p.left+' | '+p.right).join('\n');categories.value=(s.categories||[]).map(c=>c.name).join(', ');items.value=(s.items||[]).map(i=>i.text+' | '+i.category).join('\n');}
function changeType(type){const previous=props.step;drafts[previous.type]=clone(previous);Object.assign(previous,drafts[type]||newActivity(type),{type,title:previous.title,question:previous.question});refresh();}
function parse(field,value){
 const s=props.step;
 if(field==='answers'){answers.value=value;s.answers=value.split('\n').map(text=>({text:text.replace(/^\*/, '').trim(),correct:text.trim().startsWith('*')}));}
 if(field==='pairs'){pairs.value=value;s.pairs=value.split('\n').map((line,i)=>{const cells=line.split('|');return {...s.pairs?.[i],left:(cells[0]||'').trim(),right:(cells[1]||'').trim()};});}
 if(field==='categories'){categories.value=value;s.categories=value.split(',').map(name=>({name:name.trim()}));}
 if(field==='items'){items.value=value;s.items=value.split('\n').map((line,i)=>{const cells=line.split('|');return {...s.items?.[i],text:(cells[0]||'').trim(),category:Number((cells[1]||'').trim())};});}
}
watch(()=>props.step,refresh,{immediate:true});
</script>
<template>
 <article class="compound-step"><div class="section-heading"><strong class="compound-step-number">{{index+1}}.</strong><button type="button" class="button secondary compound-remove" :disabled="disabled" @click="emit('remove')">{{t('compound.remove')}}</button><small v-if="step.sourceActivityId" class="compound-source">{{t('bank.source')}}: {{step.sourceActivityId}}</small></div>
 <label><span>{{t('compound.type')}}</span><select class="compound-type" :value="step.type" :disabled="disabled" @change="changeType($event.target.value)"><option v-for="type in CHILD_TYPES" :key="type" :value="type">{{t(TYPE_LABELS[type])}}</option></select></label>
 <label><span>{{t('compound.stepTitle')}}</span><input v-model="step.title" class="compound-title" maxlength="200" required :disabled="disabled"></label>
 <label><span>{{t('compound.stepQuestion')}}</span><textarea v-model="step.question" class="compound-question" maxlength="2000" required :disabled="disabled"></textarea></label>
 <div class="compound-details">
 <label v-if="step.type==='multiple-choice'"><span>{{t('compound.answers')}}</span><textarea class="compound-answers" :value="answers" :disabled="disabled" @input="parse('answers',$event.target.value)"></textarea></label>
 <label v-else-if="step.type==='true-false'"><span>{{t('correctAnswer')}}</span><select v-model="step.correct" class="compound-correct" :disabled="disabled"><option :value="true">{{t('true')}}</option><option :value="false">{{t('false')}}</option></select></label>
 <label v-else-if="['fill-blanks','drag-text','mark-words'].includes(step.type)"><span>{{t('compound.text')}}</span><textarea v-model="step.text" class="compound-text" :disabled="disabled"></textarea></label>
 <label v-else-if="step.type==='matching'"><span>{{t('compound.pairs')}}</span><textarea class="compound-pairs" :value="pairs" :disabled="disabled" @input="parse('pairs',$event.target.value)"></textarea></label>
 <template v-else><label><span>{{t('compound.categories')}}</span><input class="compound-categories" :value="categories" :disabled="disabled" @input="parse('categories',$event.target.value)"></label><label><span>{{t('compound.items')}}</span><textarea class="compound-items" :value="items" :disabled="disabled" @input="parse('items',$event.target.value)"></textarea></label></template>
 </div></article>
</template>
