<template>
  <AuthPageTemplate>
    <AuthBox :login-mode="false" @go-login="goLogin" />
  </AuthPageTemplate>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'not-authed'
});

const goLogin = () => {
  useRouter().replace('/login');
};

useHead({
  title: 'Sign Up'
});
</script>
