import {createApp} from 'vue';
import AdminApp from './AdminApp.vue';
export function mountAdmin(element){return createApp(AdminApp).mount(element);}
