import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import createApp from './extensions';

/**
 * Import styles
 */
import './assets/styles/app.scss';

/**
 * Import server
 */

import { makeServer } from './server';

if (process.env.NODE_ENV === 'development' && !process.env.VUE_APP_API_BASE) {
  makeServer({ environment: 'development' });
}

/**
 * Create view app
 */
createApp(App).use(router).mount('#app');
