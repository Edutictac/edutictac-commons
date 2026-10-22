import {createApp} from 'vue';
import StudentPanel from './StudentPanel.vue';
export function mountStudent(element, options) { return createApp(StudentPanel, options).mount(element); }
