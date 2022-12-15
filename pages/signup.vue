<template>
  <AuthPageTemplate>
    <AuthBox
      :login-mode="false"
      @go-login="
        () => {
          $router.replace('/login');
        }
      "
    />
  </AuthPageTemplate>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'not-authed'
});

useHead({
  title: 'Sign Up'
});
</script>
