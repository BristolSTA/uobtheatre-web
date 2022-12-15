<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useHead } from '#imports';
// Global title
useHead({
  titleTemplate: (titleChunk) =>
    titleChunk
      ? `${titleChunk} - UOB Theatre`
      : 'UOB Theatre | The Home Of Bristol Student Theatre'
});
</script>
