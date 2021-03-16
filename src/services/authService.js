import gql from 'graphql-tag';

import Errors from '@/classes/Errors';
import ErrorsPartial from '@/graphql/partials/ErrorsPartial';
import { errorHandler } from '@/utils';
import { createClient } from '@/vue-apollo';

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
    if (this.isLoggedIn()) return;
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
    let { apolloClient } = createClient();

    return new Promise((resolve, reject) => {
      apolloClient
        .mutate({
          mutation: gql`
            mutation($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                ${ErrorsPartial}
                token
                user {
                  firstName
                  lastName
                  email
                }
              }
            }
          `,
          variables: {
            email,
            password,
          },
        })
        .then((result) => {
          if (!result.data.login.success)
            return reject(Errors.createFromAPI(result.data.login.errors));

          store.dispatch('authLogin', {
            token: result.data.login.token,
            userInfo: result.data.login.user,
            remember,
          });
          return resolve(result.data.login);
        })
        .catch((e) => {
          errorHandler(e);
          reject();
        });
    });
  },

  /**
   * Attempt to register a new user
   *
   * @param {object} userDetails The users details
   * @param {string} userDetails.firstName User's first name
   * @param {string} userDetails.lastName User's last name
   * @param {string} userDetails.email User's Email
   * @param {string} userDetails.password User's Password
   * @param {string} userDetails.confirmedPassword User's Password (Confirmation)
   * @returns {Promise} API Response Promise
   */
  register({ firstName, lastName, email, password, confirmedPassword }) {
    let { apolloClient } = createClient();

    return new Promise((resolve, reject) => {
      apolloClient
        .mutate({
          mutation: gql`
            mutation(
              $firstName: String!
              $lastName: String!
              $email: String!
              $password: String!
              $confirmedPassword: String!
            ) {
              register(
                firstName: $firstName
                lastName: $lastName
                email: $email
                password1: $password
                password2: $confirmedPassword
              ) {
                ${ErrorsPartial}
              }
            }
          `,
          variables: {
            email,
            password,
            confirmedPassword,
            firstName,
            lastName,
          },
        })
        .then((result) => {
          if (result.data.register.success) {
            return resolve(result.data.register);
          }
          return reject(Errors.createFromAPI(result.data.register.errors));
        })
        .catch((e) => {
          errorHandler(e);
          reject();
        });
    });
  },

  requestPasswordReset({ email }) {
    let { apolloClient } = createClient();

    return new Promise((resolve, reject) => {
      apolloClient
        .mutate({
          mutation: gql`
            mutation($email: String!) {
              sendPasswordResetEmail(email: $email) {
                ${ErrorsPartial}
              }
            }
          `,
          variables: {
            email,
          },
        })
        .then((result) => {
          if (result.data.sendPasswordResetEmail.success) {
            return resolve(result.data.sendPasswordResetEmail);
          }
          return reject(
            Errors.createFromAPI(result.data.sendPasswordResetEmail.errors)
          );
        })
        .catch((e) => {
          errorHandler(e);
          reject();
        });
    });
  },

  resetPassword({ token, password, confirmedPassword }) {
    let { apolloClient } = createClient();

    return new Promise((resolve, reject) => {
      apolloClient
        .mutate({
          mutation: gql`
            mutation($token: String!, $password: String!, $confirmedPassword: String!) {
              passwordReset(token: $token, newPassword1: $password, newPassword2: $confirmedPassword) {
                ${ErrorsPartial}
              }
            }
          `,
          variables: {
            token,
            password,
            confirmedPassword,
          },
        })
        .then((result) => {
          if (result.data.passwordReset.success) {
            return resolve(result.data.passwordReset);
          }
          return reject(Errors.createFromAPI(result.data.passwordReset.errors));
        })
        .catch((e) => {
          errorHandler(e);
          reject();
        });
    });
  },

  activateAccount({ token }) {
    let { apolloClient } = createClient();

    return new Promise((resolve, reject) => {
      apolloClient
        .mutate({
          mutation: gql`
            mutation($token: String!) {
              verifyAccount(token: $token) {
                ${ErrorsPartial}
              }
            }
          `,
          variables: {
            token,
          },
        })
        .then((result) => {
          if (result.data.verifyAccount.success) {
            return resolve(result.data.verifyAccount);
          }
          return reject(Errors.createFromAPI(result.data.verifyAccount.errors));
        })
        .catch((e) => {
          errorHandler(e);
          reject();
        });
    });
  },

  /**
   * Logs out the user by deleting the auth cookie
   */
  logout() {
    store.dispatch('authLogout');
  },
};
