import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

require('./extensions');

/**
 * Import styles
 */
import './assets/styles/app.scss';

/**
 * Import server
 */

import { makeServer } from './fakeApi';

if (process.env.NODE_ENV === 'development' && !process.env.VUE_APP_API_BASE) {
  makeServer({ environment: 'development' });
}

/**
 * Create view app
 */
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
