<template>
  <AuthPageTemplate>
    <div
      class="w-100 relative p-6 text-center text-white bg-sta-gray shadow-2xl"
    >
      <template v-if="!error">
        <h1 class="text-h3">Activating your account...</h1>
        <div>
          <UiLoadingIcon size-class="text-h1" />
        </div>
      </template>
      <template v-else>
        <font-awesome-icon class="text-sta-rouge text-h1" icon="times-circle" />
        <h1 class="text-h3">There was an error activating your account</h1>
        <p>This activation has either expired or doesn't exist!</p>
      </template>
    </div>
  </AuthPageTemplate>
</template>
<script setup lang="ts">
import { getValidationErrors } from '~/utils/api';
import { swalToast } from '~/utils/alerts';

import useAuthStore from '~~/store/auth';
import Errors from '~~/classes/Errors';

definePageMeta({
  middleware: 'not-authed'
});

useHead({
  title: 'Active your account'
});

const errors = ref<Errors | null>(null);

onMounted(async () => {
  const authStore = useAuthStore();
  const token = useRoute().params.tokens;

  if (Array.isArray(token)) return;
  try {
    await authStore.activateAccount(token);
    swalToast.fire({
      icon: 'success',
      position: 'bottom-end',
      title: 'Account Verified',
      text: 'You may now login'
    });
    return useRouter().push('/login');
  } catch (e) {
    errors.value = getValidationErrors(e);
  }
});
</script>
