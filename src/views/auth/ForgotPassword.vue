<template>
  <auth-page-template>
    <div class="relative shadow-2xl bg-sta-gray w-100">
      <div
        v-if="loading"
        ref="loading-overlay"
        class="absolute top-0 z-10 flex items-center justify-center w-full h-full text-3xl text-white bg-sta-gray-dark bg-opacity-95"
      >
        <font-awesome-icon class="animate-spin" icon="circle-notch" />
      </div>
      <div class="p-6 text-white">
        <template v-if="!resetToken">
          <h1 class="text-h3">Forgot your password?</h1>
          <form class="flex flex-col space-y-2" @submit.prevent="requestReset">
            <text-input
              name="Email"
              type="email"
              autocomplete="email"
              :errrors="errors"
              required
              v-model="email"
            />
            <button class="btn btn-orange">Request Reset</button>
          </form>
        </template>
        <template v-else>
          <h1 class="text-h3">Reset Password</h1>

          <non-field-error :errors="errors" />
          <form class="flex flex-col space-y-2" @submit.prevent="resetPassword">
            <text-input
              name="Password"
              type="password"
              :errors="errors"
              error-key="newPassword1"
              autocomplete="new-password"
              required
              v-model="password"
            />
            <text-input
              name="Confirm Password"
              type="password"
              :errors="errors"
              autocomplete="new-password"
              error-key="newPassword2"
              required
              v-model="confirmedPassword"
            />
            <button class="btn btn-orange">Reset</button>
          </form>
        </template>
        <p class="mt-4 text-center">
          <router-link :to="{ name: 'login' }"> Back to login </router-link>
        </p>
      </div>
    </div>
  </auth-page-template>
</template>

<script>
import NonFieldError from '@/components/ui/NonFieldError';
import TextInput from '@/components/ui/TextInput';
import { authService } from '@/services';
import { swal, swalToast } from '@/utils';

import AuthPageTemplate from './AuthPageTemplate.vue';
export default {
  components: { AuthPageTemplate, TextInput, NonFieldError },
  metaInfo() {
    return {
      title: 'Reset Password',
    };
  },
  data() {
    return {
      email: null,
      loading: false,
      errors: null,

      password: null,
      confirmedPassword: null,
    };
  },
  computed: {
    resetToken() {
      return this.$route.query.resetToken;
    },
  },
  methods: {
    async requestReset() {
      this.loading = true;
      try {
        await authService.requestPasswordReset({
          email: this.email,
        });
        swal.fire({
          icon: 'info',
          title: 'Check your email',
          text:
            'A link to reset your password has been sent by email if we have an account with this email',
        });
      } catch (e) {
        this.errors = e;
      }
      this.loading = false;
    },
    async resetPassword() {
      this.loading = true;
      try {
        await authService.resetPassword({
          token: this.resetToken,
          password: this.password,
          confirmedPassword: this.confirmedPassword,
        });
        swalToast.fire({
          icon: 'success',
          title: 'Password Reset Succesfully',
          position: 'bottom-end',
        });
        return this.$router.push({ name: 'login' });
      } catch (e) {
        this.errors = e;
      }
      this.loading = false;
    },
  },
  beforeRouteEnter: (to, from, next) => {
    if (authService.isLoggedIn()) return next({ name: 'home' });
    return next();
  },
};
</script>