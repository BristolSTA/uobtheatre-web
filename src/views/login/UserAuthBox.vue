<template>
  <div class="bg-sta-gray w-80">
    <div class="flex items-center space-x-1 text-center">
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
    <div v-if="login" class="flex flex-col p-6 space-y-2">
      <text-input name="Email" v-model="email" />
      <text-input name="Password" v-model="password" input_type="password" />
      <label for="remember_me" class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="remember_me"
          v-model="remember_me"
          class="w-5 h-5 border rounded-sm border-sta-grey focus:outline-none"
        />
        <span class="text-xs font-semibold text-white"> Remember me? </span>
      </label>

      <button
        class="w-full mt-2 text-xl font-semibold text-center btn btn-orange btn-outline"
        @click="attemptLogin"
        @keydown="attemptLogin"
      >
        Log In
      </button>
      <p class="mt-2 text-white">
        <clickable-link @click="login = false">
          Don't have an account? <strong>Sign Up</strong>
        </clickable-link>
      </p>
    </div>

    <div v-else class="flex flex-col p-6 space-y-2">
      <text-input name="Full Name" v-model="name" />
      <text-input name="Email" v-model="email" />
      <text-input name="Password" v-model="password" input_type="password" />
      <label for="accept_terms" class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="accept_terms"
          v-model="accepted_terms"
          class="w-5 h-5 border rounded-sm border-sta-grey focus:outline-none"
        />
        <span class="text-xs font-semibold text-white">
          Accept the Terms of Use?
        </span>
      </label>
      <button
        class="w-full text-xl font-semibold text-center btn btn-orange btn-outline"
      >
        Sign Up
      </button>
      <p class="mt-2 text-white">
        <clickable-link @click="login = true">
          Already have an account? <strong>Log In</strong>
        </clickable-link>
      </p>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import TextInput from '@/components/ui/TextInput.vue';

export default {
  name: 'user-auth-box',
  components: { ClickableLink, TextInput },
  data() {
    return {
      login: true,
      name: null,
      password: null,
      email: null,
      accepted_terms: false,
      remember_me: false,
      authService: authService,
    };
  },
  methods: {
    attemptLogin() {
      authService.login(this.email, this.password);
    },
  },
};
</script>
