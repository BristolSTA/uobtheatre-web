<template>
  <div class="h-screen bg-sta-gray login-background">
    <div class="flex items-center justify-center h-full">
      <user-auth-box
        :login="login"
        @go-login="$router.replace({ name: 'login' })"
        @go-signup="$router.replace({ name: 'signup' })"
      />
    </div>
  </div>
</template>

<script>
import { authService } from '@/services';

import UserAuthBox from './UserAuthBox.vue';

export default {
  name: 'Login',
  components: { UserAuthBox },
  props: {
    login: {
      default: true,
      type: Boolean,
    },
  },
  metaInfo() {
    return {
      title: this.login ? 'Login' : 'Register',
    };
  },
  beforeRouteEnter: (to, from, next) => {
    if (authService.isLoggedIn()) return next({ name: 'home' });
    return next();
  },
};
</script>

<style scoped lang="scss">
.login-background {
  background-image: url('~@/assets/images/pros-arch-lit.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
}
</style>
