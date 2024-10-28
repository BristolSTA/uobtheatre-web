<template>
  <AuthPageTemplate>
    <AuthBox :login-mode="true" @go-signup="goSignup" />
  </AuthPageTemplate>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'not-authed'
});

const goSignup = () => {
  useRouter().replace('/signup');
};

useHead({
  title: 'Login'
});
</script>
