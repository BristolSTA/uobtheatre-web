import Vue from 'vue';
import Vuex from 'vuex';
import { authService } from './services';

Vue.use(Vuex);

export default new Vuex.Store({
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
