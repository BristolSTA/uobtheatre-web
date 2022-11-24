<template>
  <UiCard>
    <template #title>
      <font-awesome-icon icon="user-pen" class="mr-2" />
      Your Details
    </template>
    <template #subtitle>
      {{ authStore.user?.firstName }}
      {{ authStore.user?.lastName }}
    </template>
    <div>
      {{ authStore.user?.email }}
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import useAuthStore from '@/store/auth';
const authStore = useAuthStore();
</script>
