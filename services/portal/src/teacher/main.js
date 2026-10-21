import {createApp} from 'vue';
import ItinerariesPanel from './ItinerariesPanel.vue';
import GroupSelector from './GroupSelector.vue';
import GroupMembersPanel from './GroupMembersPanel.vue';
import CredentialsPanel from './CredentialsPanel.vue';
import AssignmentsPanel from './AssignmentsPanel.vue';
import ResultsPanel from './ResultsPanel.vue';
import ResourcesPanel from './ResourcesPanel.vue';

export function mountItineraries(element, options) {
  return createApp(ItinerariesPanel, options).mount(element);
}
export function mountGroups(element, options) {
  return createApp(GroupSelector, options).mount(element);
}
export function mountMembers(element, options) {
  return createApp(GroupMembersPanel, options).mount(element);
}

export function mountCredentials(element, options) {
  return createApp(CredentialsPanel, options).mount(element);
}

export function mountAssignments(element, options) { return createApp(AssignmentsPanel, options).mount(element); }
export function mountResults(element, options) { return createApp(ResultsPanel, options).mount(element); }

export function mountResources(element, options) { return createApp(ResourcesPanel, options).mount(element); }
