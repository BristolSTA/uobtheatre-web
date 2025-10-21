<template>
  <NuxtPage />
</template>

<script>
definePageMeta({
  middleware: ['require-production-permissions'],
  requiredPermissions: ['view_production']
});
</script>
