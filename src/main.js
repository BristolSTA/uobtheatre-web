import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

require('./extensions');

/**
 * Import styles
 */
import './assets/styles/app.scss';

/**
 * Import server
 */

import { makeServer } from './server';

if (process.env.NODE_ENV === 'development') {
  makeServer({ environment: 'development' });
}

/**
 * Create view app
 */
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
