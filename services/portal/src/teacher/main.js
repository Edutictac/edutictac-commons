import {createApp} from 'vue';
import ItinerariesPanel from './ItinerariesPanel.vue';

export function mountItineraries(element, options) {
  return createApp(ItinerariesPanel, options).mount(element);
}
