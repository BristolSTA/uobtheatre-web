<template>
  <AuthPageTemplate>
    <div class="w-100 relative bg-sta-gray shadow-2xl">
      <div
        v-if="loading"
        ref="loading-overlay"
        class="absolute z-10 top-0 flex items-center justify-center w-full h-full text-white text-3xl bg-sta-gray-dark bg-opacity-95"
      >
        <UiLoadingIcon size-class="" />
      </div>
      <div class="p-6 text-white">
        <h1 class="text-h3">Forgot your password?</h1>
        <form class="flex flex-col space-y-2" @submit.prevent="requestReset">
          <UiTextInput
            v-model="email"
            name="Email"
            type="email"
            autocomplete="email"
            :errrors="errors"
            required
          />
          <button class="btn btn-orange">Request Reset</button>
        </form>
        <p class="mt-4 text-center">
          <NuxtLink to="/login"> Back to login </NuxtLink>
        </p>
      </div>
    </div>
  </AuthPageTemplate>
</template>

<script setup lang="ts">
import { swal } from '~~/utils/alerts';
import { getValidationErrors } from '~~/utils/api';

import Errors from '~~/classes/Errors';
import useAuthStore from '~~/store/auth';

definePageMeta({
  middleware: ['not-authed']
});

useHead({
  title: 'Reset Password'
});

// Define state
const email = ref<string | null>(null);
const loading = ref(false);
const errors = ref<Errors | null>(null);

const authStore = useAuthStore();

async function requestReset() {
  loading.value = true;
  if (!email.value) return;
  try {
    await authStore.requestPasswordReset(email.value);
    swal.fire({
      icon: 'info',
      title: 'Check your email',
      text: 'A link to reset your password has been sent by email if we have an account with this email'
    });
  } catch (e) {
    errors.value = getValidationErrors(e);
  }
  loading.value = false;
}
</script>
