import gql from 'graphql-tag'
import cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'

import Errors from '@/classes/Errors'
import ErrorsPartial from '@/graphql/partials/ErrorsPartial'
import { ValidationError } from '@/utils'
export default {
  /**
   * @param {object} context Nuxt Context
   * @returns {boolean} Whether or not the user is logged in
   */
  isLoggedIn(context) {
    return context.$apolloHelpers.getToken() && !!context.store.state.auth.user
  },

  logout(context) {
    context.$apolloHelpers.onLogout()
    cookie.remove(context.$config.auth.refreshTokenKey)
    cookie.remove(context.$config.auth.rememberKey)
    context.store.commit('auth/SET_AUTH_USER', null)
  },

  /**
   * @param {object} context Nuxt Context
   * @returns {string|null} API Authentication Token
   */
  async rememberUser(context) {
    if (!context.$apolloHelpers.getToken()) return

    const refreshOutcome = await this.refreshUser(context)
    if (!refreshOutcome) this.logout(context)

    return context.store.dispatch('auth/loadUserDetails', {
      apollo: context.app.apolloProvider.defaultClient,
      nuxtContext: context,
    })
  },

  /**
   * Refreshes user token using the refresh token
   *
   * @param {object} context Nuxt Context
   */
  async refreshUser(context) {
    const refreshToken = cookie.get(context.$config.auth.refreshTokenKey)
    if (!refreshToken) return false

    const provider = context.app
      ? context.app.apolloProvider
      : context.$apolloProvider

    const { data } = await provider.defaultClient.mutate({
      mutation: gql`
        mutation($refreshToken: String!) {
          refreshToken(refreshToken: $refreshToken) {
            token
            refreshToken
          }
        }
      `,
      variables: {
        refreshToken,
      },
    })

    if (!data.refreshToken.token) return this.logout(context)

    this.setToken(
      context,
      data.refreshToken.token,
      cookie.get(context.$config.auth.rememberKey)
    )
    this.setRefreshToken(context, data.refreshToken.refreshToken)
    this.queueRefresh(context, data.refreshToken.token)
    return true
  },

  setRefreshToken(context, token) {
    cookie.set(context.$config.auth.refreshTokenKey, token, {
      expires: null,
    })
  },

  queueRefresh(context, token) {
    const { exp } = jwtDecode(token)
    const timeoutSeconds = exp - Math.round(Date.now() / 1000) - 30
    setTimeout(() => {
      this.refreshUser(context)
    }, timeoutSeconds * 1000)
  },

  setToken(context, token, remember) {
    if (remember)
      cookie.set(context.$config.auth.rememberKey, true, {
        expires: remember ? 365 : null,
      })
    else cookie.remove(context.$config.auth.rememberKey)

    context.$apolloHelpers.onLogin(
      token,
      undefined,
      {
        expires: remember ? 365 : null,
        path: '/',
      },
      true
    )
  },

  /**
   * Attempt a login with the API using the supplied credentials
   *
   * @param {object} componentContext Vue Component "this" Context
   * @param {string} email User's Email
   * @param {string} password User's Password
   * @param {boolean} remember Whether or not to remember the user on this browser
   * @returns {Promise} API Response Promise
   */
  login(componentContext, email, password, remember = false) {
    return new Promise((resolve, reject) => {
      componentContext.$apollo
        .mutate({
          mutation: gql`
            mutation($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                ${ErrorsPartial}
                token
                refreshToken
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
        .then(({ data }) => {
          if (!data.login.success)
            return reject(
              new ValidationError(Errors.createFromAPI(data.login.errors))
            )

          this.setToken(componentContext, data.login.token, remember)
          this.setRefreshToken(componentContext, data.login.refreshToken)
          this.queueRefresh(componentContext, data.login.token)
          componentContext.$store.dispatch('auth/loadUserDetails', {
            userInfo: data.login.user,
          })
          return resolve(data.login)
        })
    })
  },

  /**
   * Attempt to register a new user
   *
   * @param {object} componentContext Vue Component "this" Context
   * @param {object} userDetails The users details
   * @param {string} userDetails.firstName User's first name
   * @param {string} userDetails.lastName User's last name
   * @param {string} userDetails.email User's Email
   * @param {string} userDetails.password User's Password
   * @param {string} userDetails.confirmedPassword User's Password (Confirmation)
   * @returns {Promise} API Response Promise
   */
  register(
    componentContext,
    { firstName, lastName, email, password, confirmedPassword }
  ) {
    return new Promise((resolve, reject) => {
      componentContext.$apollo
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
            return resolve(result.data.register)
          }
          return reject(
            new ValidationError(
              Errors.createFromAPI(result.data.register.errors)
            )
          )
        })
    })
  },

  requestPasswordReset(componentContext, { email }) {
    return new Promise((resolve, reject) => {
      componentContext.$apollo
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
            return resolve(result.data.sendPasswordResetEmail)
          }
          return reject(
            new ValidationError(
              Errors.createFromAPI(result.data.sendPasswordResetEmail.errors)
            )
          )
        })
    })
  },

  resetPassword(componentContext, { token, password, confirmedPassword }) {
    return new Promise((resolve, reject) => {
      componentContext.$apollo
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
            return resolve(result.data.passwordReset)
          }
          return reject(
            new ValidationError(
              Errors.createFromAPI(result.data.passwordReset.errors)
            )
          )
        })
    })
  },

  activateAccount(componentContext, { token }) {
    return new Promise((resolve, reject) => {
      componentContext.$apollo
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
            return resolve(result.data.verifyAccount)
          }
          return reject(
            new ValidationError(
              Errors.createFromAPI(result.data.verifyAccount.errors)
            )
          )
        })
    })
  },
}
