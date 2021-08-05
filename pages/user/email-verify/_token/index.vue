<template>
  <div
    class="
      flex
      items-center
      justify-center
      min-h-full
      p-6
      text-white
      bg-sta-gray
    "
  >
    <div class="relative text-center">
      <template v-if="loading">
        <h1 class="text-h3">Verifying email...</h1>
        <div>
          <loading-icon size-class="text-h1" />
        </div>
      </template>
      <template v-else>
        <font-awesome-icon class="text-h1 text-sta-rouge" icon="times-circle" />
        <h1 class="text-h3">There was an error verifying this email</h1>
        <p>This activation has either expired or doesn't exist!</p>
      </template>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'

import { getValidationErrors, performMutation, swalToast } from '@/utils'
import LoadingIcon from '@/components/ui/LoadingIcon.vue'

export default {
  components: {
    LoadingIcon,
  },
  data() {
    return {
      password: null,
      loading: true,
    }
  },
  head: {
    title: 'Verify Email',
  },
  async mounted() {
    try {
      await performMutation(
        this.$apollo,
        {
          mutation: gql`
          mutation ($token: String!) {
            verifyAccount(token: $token) {
                ${require('@/graphql/partials/ErrorsPartial').default}
            }
          }
        `,
          variables: {
            token: this.$route.params.token,
          },
        },
        'verifyAccount'
      )
      swalToast.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Email verified!',
      })
      return this.$router.replace('/login')
    } catch (e) {
      this.errors = getValidationErrors(e)
    }
    this.loading = false
  },
}
</script>
