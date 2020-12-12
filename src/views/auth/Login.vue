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
  components: { UserAuthBox },
  name: 'login',
  props: {
    login: {
      default: true,
    },
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
