import {createApp} from 'vue';
import ItinerariesPanel from './ItinerariesPanel.vue';
import GroupSelector from './GroupSelector.vue';
import GroupMembersPanel from './GroupMembersPanel.vue';
import CredentialsPanel from './CredentialsPanel.vue';
import AssignmentsPanel from './AssignmentsPanel.vue';
import ResultsPanel from './ResultsPanel.vue';
import ResourcesPanel from './ResourcesPanel.vue';
import AdminGroupsPanel from './AdminGroupsPanel.vue';
import ClassroomFilesPanel from './ClassroomFilesPanel.vue';

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

export function mountAdminGroups(element, options) {
  return createApp(AdminGroupsPanel, options).mount(element);
}

export function mountClassroomFiles(element,options){return createApp(ClassroomFilesPanel,options).mount(element);}
