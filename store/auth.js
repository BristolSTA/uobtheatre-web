import gql from 'graphql-tag'

export const state = () => ({
  user: null,
})

export const mutations = {
  SET_AUTH_USER(state, userDetails) {
    state.user = userDetails
  },
}

export const actions = {
  async loadUserDetails(context, { apollo, userInfo }) {
    if (!userInfo) {
      const { data } = await apollo.query({
        query: gql`
          {
            me {
              firstName
              lastName
              email
            }
          }
        `,
      })
      userInfo = data.me
    }

    context.commit('SET_AUTH_USER', userInfo)
  },
  // /**
  //  * Attempts to remember a user from an authentication cookie
  //  *
  //  * @param {any} context Auto-injected Vuex Context
  //  * @returns {?string} Authentication token or null
  //  */
  // authRemember(context) {
  //   // Get the auth cookie value (if has)
  //   let cookieVal = Cookie.get(config.auth.cookie)

  //   if (!cookieVal) return

  //   // Update state with the auth token
  //   context.commit('SET_AUTH_TOKEN', cookieVal)

  //   // Get the user's basic details from the API to store
  //   let { apolloClient } = createClient()
  //   apolloClient
  //     .query({
  //       query: gql`
  //         {
  //           me {
  //             firstName
  //             lastName
  //             email
  //           }
  //         }
  //       `,
  //     })
  //     .then(({ data }) => {
  //       context.commit('SET_AUTH_USER', data.me)
  //     })

  //   return cookieVal
  // },
  // /**
  //  * Reacts to login by storing the authentication token in the user's cookies
  //  *
  //  * @param {any} context Auto-injected Vuex Context
  //  * @param {object} loginContext Object containing context around the login
  //  * @param {string} loginContext.token API Authentication token
  //  * @param {object} loginContext.userInfo User's basic information
  //  * @param {boolean} loginContext.remember Whether to remember the user or not (if no, cookie destroyed with session on browser)
  //  */
  // authLogin(context, { token, userInfo, remember }) {
  //   // Store the auth token in a cookie
  //   Cookie.set(config.auth.cookie, token, {
  //     expires: remember ? 365 : null,
  //   })
  //   context.commit('SET_AUTH_USER', userInfo)
  //   context.commit('SET_AUTH_TOKEN', token)
  // },
  // authLogout(context) {
  //   Cookie.remove(config.auth.cookie)
  //   context.commit('SET_AUTH_TOKEN', null)
  // },
}
