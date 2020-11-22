<template>
  <div class="bg-sta-gray" style="width: 360px">
    <div class="relative">
      <div class="flex items-center text-center">
        <div class="w-1/2 py-3 font-semibold bg-gray-200 br">Login</div>
        <div class="w-1/2 py-3 font-semibold bg-sta-orange bl">Sign Up</div>
      </div>
      <div
        class="absolute top-0 flex items-center justify-center w-full h-full"
      >
        <span
          class="w-6 h-6 text-sm text-center bg-white rounded-full text-sta-gray-light"
          >or</span
        >
      </div>
    </div>
    <div class="flex flex-col p-6 space-y-2">
      <label for="name">
        <span class="labelText">Full Name</span>
        <input class="w-full p-1 rounded-sm" id="name" v-model="name"
      /></label>
      <label for="email">
        <span class="labelText">Email</span>
        <input class="w-full p-1 rounded-sm" id="email" v-model="email"
      /></label>
      <label for="password">
        <span class="labelText">Password</span>
        <input class="w-full p-1 rounded-sm" id="password" v-model="password"
      /></label>
      <label for="checkbox" class="flex items-center space-x-2"
        ><input
          type="checkbox"
          id="checkbox"
          v-model="checked"
          class="w-5 h-5 border rounded-sm border-sta-grey focus:outline-none"
        />
        <span class="labelText">Accept the Terms of Use?</span></label
      >
      <button
        class="w-full text-xl font-semibold text-center btn btn-orange btn-outline disabled"
      >
        Sign Up
      </button>
      <p class="mt-2 text-white">
        <a href="link">Already have an account? <strong>Log In</strong></a>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.br {
  border-right: 2px solid;
  @apply border-sta-gray;
}
.bl {
  border-left: 2px solid;
  @apply border-sta-gray;
}
.labelText {
  @apply text-xs;
  @apply font-semibold;
  @apply text-white;
}
</style>

<script>
import ClickableLink from '@/components/ui/ClickableLink.vue';
export default {
  name: 'login-box2',
  components: { ClickableLink },
};
</script>
