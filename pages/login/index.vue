<template>
  <AuthPageTemplate>
    <AuthBox
      :login-mode="true"
      @go-signup="
        () => {
          $router.replace('/signup');
        }
      "
    />
  </AuthPageTemplate>
</template>

<script setup lang="ts">
import { useHead, definePageMeta } from '#imports';
definePageMeta({
  middleware: 'not-authed'
});

useHead({
  title: 'Login'
});
</script>
