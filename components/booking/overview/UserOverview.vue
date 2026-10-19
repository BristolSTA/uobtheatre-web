<template>
  <UiCard>
    <template #title>
      <font-awesome-icon icon="user-pen" class="mr-2" />
      Your Details
    </template>
    <template #subtitle>
      <SensitiveText
        >{{ authStore.user?.firstName
        }}{{ authStore.user?.lastName }}</SensitiveText
      >
    </template>
    <div>
      <SensitiveText>{{ authStore.user?.email }}</SensitiveText>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import useAuthStore from '@/store/auth';
const authStore = useAuthStore();
</script>
