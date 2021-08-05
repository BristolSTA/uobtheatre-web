import { authService } from '@/services'
import gql from 'graphql-tag'
import AuthUserDetailsFragment from '@/graphql/fragments/user/AuthUserDetailsFragment.gql'

export const state = () => ({
  token: null,
  user: null,
})

export const mutations = {
  SET_AUTH_USER(state, userDetails) {
    state.user = userDetails
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
}

export const actions = {
  async loadUserDetails(context, { apollo, userInfo, nuxtContext }) {
    if (!userInfo) {
      const { data } = await apollo.query({
        query: gql`
          {
            me {
              ...AuthUserDetails
            }
          }
          ${AuthUserDetailsFragment}
        `,
      })
      userInfo = data.me
    }
    if (!userInfo) return authService.logout(nuxtContext)

    context.commit('SET_AUTH_USER', userInfo)
  },
  login(context, token) {
    context.commit('SET_TOKEN', token)
  },
  logout(context) {
    context.commit('SET_AUTH_USER', null)
    context.commit('SET_TOKEN', null)
  },
}
