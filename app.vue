<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#FF9F1C" :height="5" :throttle="0" />
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
