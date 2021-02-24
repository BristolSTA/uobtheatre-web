<template>
  <auth-page-template>
    <div
      class="relative p-6 text-center text-white shadow-2xl bg-sta-gray w-100"
    >
      <template v-if="!error">
        <h1 class="text-h3">Activating your account...</h1>
        <div>
          <font-awesome-icon class="animate-spin text-h1" icon="circle-notch" />
        </div>
      </template>
      <template v-else>
        <font-awesome-icon class="text-h1 text-sta-rouge" icon="times-circle" />
        <h1 class="text-h3">There was an error activating your account</h1>
        <p>This activation has either expired or doesn't exist!</p>
      </template>
    </div>
  </auth-page-template>
</template>
<script>
import { authService } from '@/services';
import { swalToast } from '@/utils';

import AuthPageTemplate from './AuthPageTemplate.vue';

export default {
  components: { AuthPageTemplate },
  metaInfo() {
    return {
      title: 'Reset Password',
    };
  },
  props: {
    activationToken: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      error: false,
    };
  },
  async mounted() {
    try {
      await authService.activateAccount({
        token: this.activationToken,
      });
      swalToast.fire({
        icon: 'success',
        position: 'bottom-end',
        title: 'Account Verified',
        text: 'You may now login',
      });
      return this.$router.push({ name: 'login' });
    } catch (e) {
      this.error = true;
    }
  },
  beforeRouteEnter: (to, from, next) => {
    if (authService.isLoggedIn()) return next({ name: 'home' });
    return next();
  },
};
</script>