<script setup>
import {usePortalTranslations} from '../shared/usePortalTranslations.js';
import {useResources} from './useResources.js';
const props = defineProps({api: Function, onSessionExpired: Function, onAssigned: Function});
const t = usePortalTranslations();
const {context, search, rows, loaded, basket, loading, pending, feedback, completedCount, unavailable, setContext, load, assign} = useResources(props.api, props.onSessionExpired, props.onAssigned);
defineExpose({setContext});
</script>

<template>
  <form class="grid-fields" @submit.prevent="load(false)">
    <label><span>{{ t('teacher.resourcesSearch') }}</span><input id="resourceSearch" v-model="search" type="search" :placeholder="t('teacher.resourcesPlaceholder')"></label>
    <div class="actions">
      <button id="searchResources" type="submit" class="secondary" :disabled="pending || !context.resourcesEnabled">{{ t('teacher.resourcesButton') }}</button>
      <button v-if="context.favoritesEnabled !== false" id="loadFavoriteResources" type="button" class="secondary" :disabled="pending || !context.teacher || !context.resourcesEnabled" @click="load(true)">{{ t('teacher.favoritesButton') }}</button>
      <button v-if="context.favoritesEnabled !== false" id="assignFavoriteResources" type="button" :disabled="unavailable || !basket || !rows.length" @click="assign()">{{ t('teacher.assignBasket') }}</button>
    </div>
  </form>
  <p v-if="context.teacher && context.group">{{ t('teacher.groupSelected') }} <strong>{{ context.group.group_code || context.group.name }}</strong></p>
  <div id="resourcesOutput" class="output" :class="{empty: !rows.length}" :aria-busy="loading || pending">
    <p v-if="feedback" role="status">{{ t(feedback, {count: completedCount}) }}</p>
    <p v-if="pending" role="status">{{ t('teacher.assigningBasket') }}</p>
    <p v-else-if="loading" role="status">{{ t('teacher.resourcesLoading') }}</p>
    <p v-else-if="!rows.length && !feedback">{{ t(loaded ? 'teacher.resourcesEmpty' : 'teacher.resourcesHint') }}</p>
    <p v-if="basket && rows.length" class="hint">{{ t('teacher.basketHint', {count: rows.length}) }}</p>
    <div v-if="rows.length" class="cards">
      <article v-for="(resource, index) in rows" :key="index" class="card">
        <strong>{{ resource.title || resource.external_id }}</strong>
        <small>{{ resource.provider || resource.format || 'resource' }} · {{ resource.subject || '' }}</small>
        <button class="compact secondary" type="button" :data-assign-resource="resource.external_id" :disabled="unavailable" @click="assign(resource)">{{ t('teacher.assignResource') }}</button>
      </article>
    </div>
  </div>
</template>
