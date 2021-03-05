import './registerServiceWorker';

import Vue from 'vue';
import VueApollo from 'vue-apollo';

import App from './App.vue';
import router from './router';
import store from './store';
// Install the vue plugin
Vue.use(VueApollo);

require('./extensions');

/**
 * Import styles
 */
import './assets/styles/app.scss';
import 'leaflet/dist/leaflet.css';

/**
 * Import server & Vue Apollo
 */
import { makeServer } from '@/fakeApi';
import { createProvider } from '@/vue-apollo';

if (
  process.env.VUE_APP_CYPRESS ||
  (process.env.NODE_ENV === 'development' && !process.env.VUE_APP_API_BASE)
) {
  makeServer({ environment: 'development' });
}

/**
 * Create Vue app
 */
new Vue({
  router,
  render: (h) => h(App),
  apolloProvider: createProvider(),
  store: store,
}).$mount('#app');
