<template>
  <div class="bg-sta-gray h-screen login-background">
    <div class="flex h-full justify-center items-center">
      <user-auth-box class="shadow-2xl" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-background {
  background-image: url('~@/assets/images/pros-arch-lit.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
}
</style>

<script>
import UserAuthBox from './UserAuthBox.vue';

export default {
  components: { UserAuthBox },
  name: 'login',
};
</script>
