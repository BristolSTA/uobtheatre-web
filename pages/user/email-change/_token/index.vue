<template>
  <div
    class="flex items-center justify-center min-h-full p-6 text-white bg-sta-gray"
  >
    <div class="relative text-center">
      <template v-if="!addedOk && loading">
        <h1 class="text-h3">Adding email...</h1>
        <div>
          <font-awesome-icon class="animate-spin text-h1" icon="circle-notch" />
        </div>
      </template>
      <template v-else-if="addedOk">
        <h1 class="text-h3">Complete email change</h1>
        <p>
          To complete the change of your account's email, enter your password
          below
        </p>
        <loading-container :loading="loading">
          <form class="p-6" @submit.prevent="finishSwap">
            <non-field-error :errors="errors" />
            <text-input
              v-model="password"
              name="Password"
              type="password"
              :errors="errors"
              error-key="password"
              autocomplete="current-password"
              required
              class="mt-4"
            />
            <button class="mt-4 btn btn-green">Complete Change</button>
          </form>
        </loading-container>
      </template>
      <template v-else>
        <font-awesome-icon class="text-h1 text-sta-rouge" icon="times-circle" />
        <h1 class="text-h3">There was an error activating this email</h1>
        <p>This activation has either expired or doesn't exist!</p>
      </template>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'

import LoadingContainer from '@/components/ui/LoadingContainer.vue'
import NonFieldError from '@/components/ui/NonFieldError.vue'
import TextInput from '@/components/ui/TextInput.vue'
import { getValidationErrors, performMutation, swalToast } from '@/utils'

export default {
  components: {
    NonFieldError,
    TextInput,
    LoadingContainer,
  },
  data() {
    return {
      password: null,
      addedOk: false,
      loading: true,
    }
  },
  head: {
    title: 'Change Email',
  },
  async mounted() {
    try {
      await performMutation(
        this.$apollo,
        {
          mutation: gql`
          mutation ($token: String!) {
            verifySecondaryEmail(token: $token) {
                ${require('@/graphql/partials/ErrorsPartial').default}
            }
          }
        `,
          variables: {
            token: this.$route.params.token,
          },
        },
        'verifySecondaryEmail'
      )
      this.addedOk = true
    } catch (e) {
      this.addedOk = false
    }
    this.loading = false
  },
  methods: {
    async finishSwap() {
      this.loading = true
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: gql`
            mutation ($password: String!) {
              swapEmails(password: $password) {
                  ${require('@/graphql/partials/ErrorsPartial').default}
              }
            }
          `,
            variables: {
              password: this.password,
            },
          },
          'swapEmails'
        )

        await performMutation(
          this.$apollo,
          {
            mutation: gql`
            mutation ($password: String!) {
              removeSecondaryEmail(password: $password) {
                  ${require('@/graphql/partials/ErrorsPartial').default}
              }
            }
          `,
            variables: {
              password: this.password,
            },
          },
          'removeSecondaryEmail'
        )

        swalToast.fire({
          position: 'bottom-end',
          icon: 'success',
          title: 'Email changed!',
        })
        return this.$router.replace({ name: 'user' })
      } catch (e) {
        this.errors = getValidationErrors(e)
      }
      this.loading = false
    },
  },
}
</script>
