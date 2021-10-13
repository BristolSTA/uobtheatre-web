<template>
  <auth-page-template>
    <div
      class="w-100 relative p-6 text-center text-white bg-sta-gray shadow-2xl"
    >
      <template v-if="!error">
        <h1 class="text-h3">Activating your account...</h1>
        <div>
          <loading-icon size-class="text-h1" />
        </div>
      </template>
      <template v-else>
        <font-awesome-icon class="text-sta-rouge text-h1" icon="times-circle" />
        <h1 class="text-h3">There was an error activating your account</h1>
        <p>This activation has either expired or doesn't exist!</p>
      </template>
    </div>
  </auth-page-template>
</template>
<script>
import { authService } from '@/services'
import { getValidationErrors, swalToast } from '@/utils'

import AuthPageTemplate from '@/components/auth/AuthPageTemplate.vue'
import LoadingIcon from '@/components/ui/LoadingIcon.vue'

export default {
  components: { AuthPageTemplate, LoadingIcon },
  middleware: 'not-authed',
  data() {
    return {
      error: false,
    }
  },
  head: {
    title: 'Verify Account',
  },
  async mounted() {
    try {
      await authService.activateAccount(this, {
        token: this.$route.params.token,
      })
      swalToast.fire({
        icon: 'success',
        position: 'bottom-end',
        title: 'Account Verified',
        text: 'You may now login',
      })
      return this.$router.push('/login')
    } catch (e) {
      this.error = getValidationErrors(e)
    }
  },
}
</script>
