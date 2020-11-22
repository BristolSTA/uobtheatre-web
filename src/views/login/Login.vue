<template>
  <div class="bg-sta-gray">
    <div class="h-screen prosarch">
      <div class="flex">
        <login-box2 class="justify-center items-center" ref="login-box2" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.prosarch {
  background-image: url('~@/assets/images/pros-arch-lit.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  // filter: blur(3px);

  /* Set up positioning */
  // > div {
  //   min-height: 50vh;
  // }
}
</style>

<script>
import LoginBox2 from './LoginBox2.vue';

export default {
  components: {
    LoginBox2,
  },
  name: 'login',
};
</script>
