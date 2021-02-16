import gql from 'graphql-tag';
import Cookie from 'js-cookie';
import Vue from 'vue';
import Vuex from 'vuex';

import config from '@/config';
import { createClient } from '@/vue-apollo';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: {
      token: null,
      user: null,
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
    SET_AUTH_USER(state, userDetails) {
      state.auth.user = userDetails;
    },
  },
  actions: {
    authRemember(context) {
      let cookieVal = Cookie.get(config.auth.cookie);
      if (cookieVal) {
        context.commit('SET_AUTH_TOKEN', cookieVal);
        let { apolloClient } = createClient();
        apolloClient
          .query({
            query: gql`
              {
                authUser {
                  firstName
                  lastName
                  email
                }
              }
            `,
          })
          .then(({ data }) => {
            context.commit('SET_AUTH_USER', data.authUser);
          });
      }
      return cookieVal;
    },
    authLogin(context, { token, userInfo, remember }) {
      Cookie.set(config.auth.cookie, token, {
        expires: remember ? 365 : null,
      });
      context.commit('SET_AUTH_TOKEN', token);
      context.commit('SET_AUTH_USER', userInfo);
    },
    authLogout(context) {
      Cookie.remove(config.auth.cookie);
      context.commit('SET_AUTH_TOKEN', null);
    },
  },
});
