<template>
  <auth-page-template>
    <div
      class="
        relative
        max-w-xs
        p-6
        text-center text-white
        shadow-2xl
        bg-sta-gray
        w-100
      "
    >
      <h1 class="text-h3">Reset your password</h1>
      <form
        class="flex flex-col p-6 pt-0 space-y-2"
        @submit.prevent="attemptReset"
      >
        <non-field-error :errors="errors" />
        <text-input
          v-model="newPassword"
          name="New Password"
          type="password"
          :errors="errors"
          error-key="new_password1"
          autocomplete="new-password"
          required
        />
        <text-input
          v-model="confirmedNewPassword"
          name="Confirm New Password"
          type="password"
          :errors="errors"
          error-key="new_password2"
          autocomplete="new-password"
          required
        />
        <div>
          <button class="mr-2 btn btn-green">Reset</button>
        </div>
      </form>
    </div>
  </auth-page-template>
</template>
<script>
import { getValidationErrors, performMutation, successToast } from '@/utils'

import AuthPageTemplate from '@/components/auth/AuthPageTemplate.vue'
import NonFieldError from '@/components/ui/NonFieldError.vue'
import TextInput from '@/components/ui/TextInput.vue'

export default {
  components: { AuthPageTemplate, NonFieldError, TextInput },
  middleware: 'not-authed',
  data() {
    return {
      errors: null,
      newPassword: null,
      confirmedNewPassword: null,
    }
  },
  head: {
    title: 'Reset your password',
  },
  methods: {
    async attemptReset() {
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: require('@/graphql/mutations/user/AttemptPasswordReset.gql'),
            variables: {
              token: this.$route.params.token,
              newPassword: this.newPassword,
              confirmedNewPassword: this.confirmedNewPassword,
            },
          },
          'passwordReset'
        )
        successToast.fire({ title: 'Password Changed!' })
        return this.$router.replace('/login')
      } catch (e) {
        this.errors = getValidationErrors(e)
      }
    },
  },
}
</script>
