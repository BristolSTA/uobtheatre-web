import Vue from 'vue';

/** eslint-ignore-next */
import Playground from '@/Playground.vue';
import { createProvider } from '@/vue-apollo';

require('./extensions');
/**
 * Import server
 */
import { makeServer } from './fakeApi';

if (process.env.NODE_ENV === 'development' && !process.env.VUE_APP_API_BASE) {
  makeServer({ environment: 'development' });
}

/**
 * Import styles
 */
import './assets/styles/app.scss';

new Vue({
  render: (h) => h(Playground),
  apolloProvider: createProvider(),
}).$mount('#app');
