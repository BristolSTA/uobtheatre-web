import './registerServiceWorker';

import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';

require('./extensions');

/**
 * Import styles
 */
import './assets/styles/app.scss';
import 'leaflet/dist/leaflet.css';

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
  store: store,
}).$mount('#app');
