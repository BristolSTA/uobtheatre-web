<template>
  <auth-page-template>
    <user-auth-box
      :login="false"
      @go-login="
        () => {
          $router.replace('/login')
        }
      "
    />
  </auth-page-template>
</template>

<script>
import UserAuthBox from '@/components/auth/UserAuthBox.vue'

import AuthPageTemplate from '@/components/auth/AuthPageTemplate.vue'

export default {
  components: { UserAuthBox, AuthPageTemplate },
  middleware: 'not-authed',
  head () {
    return {
      title: 'Sign Up'
    }
  }
}
</script>
