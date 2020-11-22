<template>
  <div class="bg-sta-gray" style="width: 360px">
    <div class="flex items-center text-center space-x-1">
      <button
        class="w-1/2 py-3 font-semibold focus:outline-none"
        :class="[login ? 'bg-sta-orange' : 'bg-gray-200']"
        @click="login = true"
        @keydown="login = true"
      >
        Login
      </button>

      <button
        class="w-1/2 py-3 font-semibold focus:outline-none"
        :class="[login ? 'bg-gray-200' : ' bg-sta-orange']"
        @click="login = false"
        @keydown="login = false"
      >
        Sign Up
      </button>
    </div>
    <div v-if="login" class="p-6">
      <div class="space-y-2">
        <label for="email">
          <span class="labelText">Email</span>
          <input class="w-full p-1 rounded-sm" id="email" v-model="email"
        /></label>
        <label for="password">
          <span class="labelText">Password</span>
          <input class="w-full p-1 rounded-sm" id="password" v-model="password"
        /></label>
      </div>
      <button
        class="w-full mt-6 text-xl font-semibold text-center btn btn-orange btn-outline disabled"
      >
        Log In
      </button>
      <p class="mt-2 text-white">
        <clickable-link @click="login = false">
          Don't have an account? <strong>Sign Up</strong></clickable-link
        >
      </p>
    </div>

    <div v-else class="flex flex-col p-6 space-y-2">
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
        <clickable-link @click="login = true">
          Already have an account? <strong>Log In</strong></clickable-link
        >
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.labelText {
  @apply text-xs;
  @apply font-semibold;
  @apply text-white;
}
</style>

<script>
import ClickableLink from '@/components/ui/ClickableLink.vue';
export default {
  name: 'user-auth-box',
  components: { ClickableLink },
  data() {
    return {
      login: true,
    };
  },
};
</script>
