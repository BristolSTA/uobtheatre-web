import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';
import { authService } from './services';
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
 * Vuex
 */

Vue.use(Vuex);
let store = new Vuex.Store({
  state: {
    auth: {
      token: null,
    },
    loading: false,
  },
  mutations: {
    SET_LOADING(state) {
      state.loading = true;
    },
    SET_NOT_LOADING(state) {
      state.loading = false;
    },
    SET_AUTH_TOKEN(state, token) {
      state.auth.token = token;
    },
  },
  actions: {
    refreshAuth(context) {
      context.commit('SET_AUTH_TOKEN', authService.getAuthToken());
    },
  },
});

/**
 * Create view app
 */
new Vue({
  router,
  render: (h) => h(App),
  store: store,
}).$mount('#app');
