import Cookie from 'js-cookie';
import Vue from 'vue';
import Vuex from 'vuex';

import config from '@/config';

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
    authRemember(context) {
      let cookieVal = Cookie.get(config.auth.cookie);
      if (cookieVal) context.commit('SET_AUTH_TOKEN', cookieVal);
      return cookieVal;
    },
    authLogin(context, token, remember = false) {
      Cookie.set(config.auth.cookie, token, {
        expires: remember ? 365 : null,
      });
      context.commit('SET_AUTH_TOKEN', token);
    },
    authLogout(context) {
      Cookie.remove(config.auth.cookie);
      context.commit('SET_AUTH_TOKEN', null);
    },
  },
});
