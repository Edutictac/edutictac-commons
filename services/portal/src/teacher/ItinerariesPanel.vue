<script setup>
import {useItineraries} from './useItineraries.js';
import {usePortalTranslations} from '../shared/usePortalTranslations.js';

const props = defineProps({api: {type: Function, required: true}, onSessionExpired: {type: Function, required: true}});
const t = usePortalTranslations();
const {context, itineraries, title, ready, loading, pending, feedback, selected, unavailable, setContext, load, create, edit, add, select, assignmentTitle} = useItineraries(props.api, props.onSessionExpired);
defineExpose({setContext, load});
</script>

<template>
  <form class="grid-fields" @submit.prevent="create">
    <label>
      <span>{{ t('teacher.itineraryTitleLabel') }}</span>
      <input id="itineraryTitle" v-model="title" type="text" :disabled="!context.teacher || !context.group || pending" :placeholder="t('teacher.itineraryTitlePlaceholder')">
    </label>
    <div class="actions">
      <button id="createItinerary" type="submit" :disabled="unavailable">{{ t('teacher.createItinerary') }}</button>
      <button id="loadItineraries" type="button" class="secondary" :disabled="!context.teacher || !context.group || pending" @click="load">{{ t('teacher.loadItineraries') }}</button>
    </div>
  </form>
  <p class="hint">{{ t('teacher.itineraryHint') }}</p>
  <div id="itinerariesOutput" class="output" :class="{empty: !itineraries.length}" :aria-busy="loading || pending">
    <p v-if="feedback" role="alert">{{ t(feedback) }}</p>
    <p v-if="!context.teacher || !context.group">{{ t('teacher.itinerariesEmpty') }}</p>
    <p v-else-if="loading && !itineraries.length" role="status">{{ t('teacher.itinerary.loading') }}</p>
    <p v-else-if="ready && !itineraries.length">{{ t('teacher.itinerariesEmptyList') }}</p>
    <template v-if="itineraries.length">
      <p class="hint">{{ t('teacher.itinerary.selectionHint') }}</p>
      <button v-if="selected" class="compact secondary" type="button" data-clear-group-itinerary :disabled="unavailable" @click="select(null)">{{ t('teacher.itinerary.clearSelection') }}</button>
      <p v-else>{{ t('teacher.itinerary.noSelection') }}</p>
      <div class="cards itinerary-cards">
        <article v-for="itinerary in itineraries" :key="itinerary.id" class="card itinerary-card">
          <strong>{{ itinerary.title }}</strong>
          <small v-if="itinerary.is_selected" role="status">{{ t('teacher.itinerary.selected') }}</small>
          <button v-else class="compact secondary" type="button" :data-select-group-itinerary="itinerary.id" :aria-label="t('teacher.itinerary.selectLabel', {title: itinerary.title})" :disabled="unavailable" @click="select(itinerary.id)">{{ t('teacher.itinerary.select') }}</button>
          <small>{{ t('teacher.itinerarySteps', {count: itinerary.items.length}) }}</small>
          <ol>
            <li v-for="(item, index) in itinerary.items" :key="item.assignment_id">
              <span>{{ assignmentTitle(item.assignment_id) }}</span>
              <div class="actions">
                <button v-for="action in ['up', 'down', 'remove']" :key="action" class="compact secondary" type="button" :data-edit-itinerary="itinerary.id" :data-itinerary-assignment="item.assignment_id" :data-itinerary-action="action" :aria-label="t(`teacher.itinerary.${action}Label`, {title: assignmentTitle(item.assignment_id)})" :disabled="unavailable || (action === 'up' && index === 0) || (action === 'down' && index === itinerary.items.length - 1)" @click="edit(itinerary, item.assignment_id, action)">{{ t(`teacher.itinerary.${action}`) }}</button>
              </div>
            </li>
          </ol>
          <small>{{ t('teacher.itinerary.removeHint') }}</small>
          <button v-if="context.assignment" class="compact secondary" type="button" :data-add-itinerary-item="itinerary.id" :disabled="unavailable" @click="add(itinerary)">{{ t('teacher.addSelectedActivity') }}</button>
          <small v-else>{{ t('teacher.selectAssignmentHint') }}</small>
        </article>
      </div>
    </template>
  </div>
</template>
