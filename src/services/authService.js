import api from '@/services/api';
import config from '@/config';
import Cookie from 'js-cookie';
import store from '../store';

export default {
  /**
   * @returns {boolean} Whether or not the user is logged in
   */
  isLoggedIn() {
    return !!this.getAuthToken();
  },

  /**
   * @returns {string|null} API Authentication Token
   */
  getAuthToken() {
    return Cookie.get(config.auth.cookie);
  },

  /**
   * Attempt a login with the API using the supplied credentials
   *
   * @param {string} email User's Email
   * @param {string} password User's Password
   * @param {boolean} remember Whether or not to remember the user on this browser
   * @returns {Promise} API Response Promise
   */
  login(email, password, remember = false) {
    return api
      .post('api-token-auth/', { email: email, password: password })
      .then((data) => {
        Cookie.set(config.auth.cookie, data.token, {
          expires: remember ? 365 : null,
        });
        store.dispatch('refreshAuth');
      });
  },

  /**
   * Logs out the user by deleting the auth cookie
   *
   * @param {any} store Vuex Store
   */
  logout(store) {
    Cookie.remove(config.auth.cookie);
    store.dispatch('refreshAuth');
  },
};
