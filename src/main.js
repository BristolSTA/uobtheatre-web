import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import { DateTime } from 'luxon';

/**
 * Import server
 */

import { makeServer } from './server';

/**
 * Import styles
 */
import './assets/styles/app.scss';

if (process.env.NODE_ENV === 'development') {
  makeServer();
}

Vue.filter('dateFormat', (date, format) => {
  return DateTime.fromISO(date).toFormat(format);
})

/**
 * Create view app
 */
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
