<template>
  <div class="min-h-full">
    <login-box ref="login-box" />
  </div>
</template>

<script>
import LoginBox from './LoginBox.vue';

export default {
  components: {
    LoginBox,
  },
  name: 'login',
};
</script>
