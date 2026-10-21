import {createApp} from 'vue';
import ItinerariesPanel from './ItinerariesPanel.vue';
import GroupSelector from './GroupSelector.vue';
import GroupMembersPanel from './GroupMembersPanel.vue';
import CredentialsPanel from './CredentialsPanel.vue';

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
