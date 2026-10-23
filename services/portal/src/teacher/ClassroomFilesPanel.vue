<script setup>
import {shallowRef} from 'vue';
import ClassroomFilesBrowser from '../files/ClassroomFilesBrowser.vue';
const props=defineProps({api:Function,onSessionExpired:Function});
const context=shallowRef({teacher:false,group:null});
function setContext(next){context.value=next;}
defineExpose({setContext});
</script>
<template><ClassroomFilesBrowser :api="api" :on-session-expired="onSessionExpired" :enabled="context.teacher" :group-id="context.group?.id||''" /></template>
