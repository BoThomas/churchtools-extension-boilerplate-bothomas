import './style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import StyleClass from 'primevue/styleclass';
import ConfirmationService from 'primevue/confirmationservice';
import { churchtoolsClient } from '@churchtools/churchtools-client';
import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue, {
  unstyled: true,
  darkModeSelector: 'none',
});
app.use(ToastService);
app.use(ConfirmationService);
app.directive('styleclass', StyleClass);
app.directive('tooltip', Tooltip);

const settings = (window as Window & { settings?: { base_url?: string } })
  .settings;
const baseUrl = settings?.base_url ?? import.meta.env.VITE_API_BASE_URL;

if (baseUrl) {
  churchtoolsClient.setBaseUrl(baseUrl);
}

const username = import.meta.env.VITE_USERNAME;
const password = import.meta.env.VITE_PASSWORD;

if (import.meta.env.MODE === 'development' && username && password) {
  churchtoolsClient
    .post('/login', { username, password })
    .catch((error) => console.warn('Local ChurchTools login failed', error));
}

app.mount('#app');
