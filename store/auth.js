import { authService } from '@/services'
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
  async loadUserDetails(context, { apollo, userInfo, nuxtContext }) {
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
    if (!userInfo) return authService.logout(nuxtContext)

    context.commit('SET_AUTH_USER', userInfo)
  },
}
