<template>
  <AuthPageTemplate>
    <AuthBox
      :login-mode="true"
      @go-signup="
        () => {
          useRouter().replace('/signup');
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
  title: 'Login'
});
</script>
