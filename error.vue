<template>
  <NuxtLayout name="default">
    <LayoutErrorPageInner :error="error" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { H3Error } from 'h3';
defineProps<{
  error: H3Error;
}>();
</script>
