<template>
  <auth-page-template>
    <user-auth-box
      :login="login"
      @go-login="
        () => {
          if (login) return;
          $router.replace({ name: 'login' });
        }
      "
      @go-signup="
        () => {
          if (!login) return;
          $router.replace({ name: 'signup' });
        }
      "
    />
  </auth-page-template>
</template>

<script>
import UserAuthBox from '@/components/auth/UserAuthBox.vue';
import { authService } from '@/services';

import AuthPageTemplate from './AuthPageTemplate.vue';

export default {
  name: 'Login',
  components: { UserAuthBox, AuthPageTemplate },
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
