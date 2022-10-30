<template>
  <AuthPageTemplate>
    <div
      class="w-100 relative p-6 max-w-xs text-center text-white bg-sta-gray shadow-2xl"
    >
      <h1 class="text-h3">Reset your password</h1>
      <form
        class="flex flex-col p-6 pt-0 space-y-2"
        @submit.prevent="attemptReset"
      >
        <UiNonFieldError :errors="errors" />
        <UiTextInput
          v-model="newPassword"
          name="New Password"
          type="password"
          :errors="errors"
          error-key="new_password1"
          autocomplete="new-password"
          required
        />
        <UiTextInput
          v-model="confirmedNewPassword"
          name="Confirm New Password"
          type="password"
          :errors="errors"
          error-key="new_password2"
          autocomplete="new-password"
          required
        />
        <div>
          <button class="btn btn-green mr-2">Reset</button>
        </div>
      </form>
    </div>
  </AuthPageTemplate>
</template>
<script setup lang="ts">
import { Ref } from 'vue';
import { getValidationErrors } from '~~/utils/api';
import { successToast } from '~~/utils/alerts';

import Errors from '~~/classes/Errors';
import { useStore } from '~~/store/auth';

definePageMeta({
  middleware: 'not-authed'
});

useHead({
  title: 'Reset your password'
});

const errors: Ref<Errors> = ref(null);
const newPassword: Ref<string> = ref(null);
const confirmedNewPassword: Ref<string> = ref(null);

async function attemptReset() {
  const authStore = useStore();
  const route = useRoute();

  if (Array.isArray(route.params.token)) return;

  try {
    await authStore.resetPassword(
      route.params.token,
      newPassword.value,
      confirmedNewPassword.value
    );
    successToast.fire({ title: 'Password Changed!' });
    return useRouter().replace('/login');
  } catch (e) {
    errors.value = getValidationErrors(e);
  }
}
</script>
