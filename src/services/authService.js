import api from '@/services/api';
import store from '../store';

export default {
  /**
   * @returns {boolean} Whether or not the user is logged in
   */
  isLoggedIn() {
    return !!store.state.auth.token;
  },

  /**
   * @returns {string|null} API Authentication Token
   */
  refreshAuthStatus() {
    return store.dispatch('authRemember');
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
        store.dispatch('authLogin', data.token, remember);
      });
  },

  /**
   * Logs out the user by deleting the auth cookie
   */
  logout() {
    store.dispatch('authLogout');
  },
};
