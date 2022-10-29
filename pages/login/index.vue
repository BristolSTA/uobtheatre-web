<template>
  <AuthPageTemplate>
    <AuthBox
      :login="true"
      @go-signup="
        () => {
          $router.replace('/signup');
        }
      "
    />
  </AuthPageTemplate>
</template>

<script setup>
definePageMeta({
  middleware: 'not-authed'
});

useHead({
  title: 'Login'
});
</script>
