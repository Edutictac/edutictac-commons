<script setup>
import ClassroomFilesBrowser from '../files/ClassroomFilesBrowser.vue';
defineProps({api:Function,onSessionExpired:Function,identity:Object});
</script>
<template><ClassroomFilesBrowser :api="api" :on-session-expired="onSessionExpired" :enabled="Boolean(identity)" :group-id="identity.group_id" :identity-id="identity.id" /></template>
