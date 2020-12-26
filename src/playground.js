import Vue from 'vue';

/** eslint-ignore-next */
import Playground from '@/Playground.vue';

require('./extensions');

/**
 * Import styles
 */
import './assets/styles/app.scss';

new Vue({
  render: (h) => h(Playground),
}).$mount('#app');
