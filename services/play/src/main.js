import {createApp} from 'vue';
import PlayApp from './PlayApp.vue';
export function mountPlay(element){return createApp(PlayApp).mount(element);}
