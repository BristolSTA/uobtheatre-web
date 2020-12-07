<template>
  <div class="h-screen bg-sta-gray login-background">
    <div class="flex items-center justify-center h-full">
      <user-auth-box />
    </div>
  </div>
</template>

<script>
import UserAuthBox from './UserAuthBox.vue';

export default {
  components: { UserAuthBox },
  name: 'login',
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.login-background {
  background-image: url('~@/assets/images/pros-arch-lit.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
}
</style>
