<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Global title
useHead({
  titleTemplate: (titleChunk) =>
    titleChunk
      ? `${titleChunk} - UOB Theatre`
      : 'UOB Theatre | The Home Of Bristol Student Theatre'
});
</script>
