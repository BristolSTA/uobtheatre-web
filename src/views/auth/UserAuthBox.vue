<template>
  <div class="relative shadow-2xl bg-sta-gray w-80">
    <div role="navigation" class="flex items-center space-x-1">
      <button
        class="w-1/2 py-3 font-semibold rounded-none focus:outline-none"
        :class="[login ? 'bg-sta-orange' : 'bg-gray-200']"
        @click="$emit('go-login')"
        @keypress="$emit('go-login')"
      >
        Login
      </button>
      <button
        class="w-1/2 py-3 font-semibold rounded-none focus:outline-none"
        :class="[login ? 'bg-gray-200' : ' bg-sta-orange']"
        @click="$emit('go-signup')"
        @keypress="$emit('go-signup')"
      >
        Sign Up
      </button>
    </div>
    <div
      v-if="loading"
      ref="loading-overlay"
      class="absolute top-0 z-10 flex items-center justify-center w-full h-full text-3xl text-white bg-sta-gray-dark bg-opacity-95"
    >
      <font-awesome-icon class="animate-spin" icon="circle-notch" />
    </div>
    <form
      v-if="login"
      class="flex flex-col p-6 space-y-2"
      @submit.prevent="attemptLogin"
    >
      <div
        v-if="login_errors && login_errors.hasGenericErrors()"
        class="text-sm font-semibold text-sta-rouge"
      >
        <p>Error: {{ login_errors.getGenericErrors()[0] }}</p>
      </div>
      <text-input
        name="Email"
        type="email"
        autocomplete="email"
        required
        :errors="login_errors"
        v-model="email"
      />
      <text-input
        name="Password"
        type="password"
        autocomplete="current-password"
        required
        :errors="login_errors"
        v-model="password"
      />
      <label for="remember_me" class="flex items-center space-x-2">
        <input
          id="remember_me"
          type="checkbox"
          class="w-5 h-5 border rounded-sm border-sta-grey focus:outline-none"
          v-model="remember_me"
        />
        <span class="text-xs font-semibold text-white">Remember me?</span>
      </label>

      <button
        class="w-full mt-2 text-xl font-semibold text-center btn btn-orange btn-outline"
        type="submit"
      >
        Log In
      </button>

      <hr class="border-t-2 border-sta-gray-dark" />

      <p class="mt-2 text-white">
        <clickable-link @click="$emit('go-signup')">
          Don't have an account? <strong>Sign Up</strong>
        </clickable-link>
      </p>
      <p>
        <a href="/login" class="text-sta-orange hover:text-sta-orange-dark">
          Forgot your password?
        </a>
      </p>
    </form>

    <form v-else class="flex flex-col p-6 space-y-2">
      <!-- TODO: Implement -->
      Currently unavailable...
      <!-- <text-input name="Full Name" v-model="name" autocomplete="name" />
      <text-input name="Email" v-model="email" autocomplete="username email" />
      <text-input
        name="Password"
        v-model="password"
        type="password"
        autocomplete="new-password"
      />
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
      </button> -->

      <p class="mt-2 text-white">
        <clickable-link @click="$emit('go-login')">
          Already have an account? <strong>Log In</strong>
        </clickable-link>
      </p>
    </form>
  </div>
</template>

<script>
import ClickableLink from '@/components/ui/ClickableLink.vue';
import TextInput from '@/components/ui/TextInput.vue';
import { authService } from '@/services';

export default {
  name: 'UserAuthBox',
  components: { ClickableLink, TextInput },
  props: {
    login: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      name: null,
      password: null,
      email: null,
      accepted_terms: false,
      remember_me: false,
      authService: authService,
      loading: false,

      login_errors: null,
      signup_errors: null,
    };
  },
  methods: {
    async attemptLogin() {
      this.loading = true;
      this.login_errors = null;

      try {
        await authService.login(this.email, this.password, this.remember_me);

        // Redirect to intended if has
        if (this.$route.query.redirect) {
          return this.$router.push(this.$route.query.redirect);
        }

        return this.$router.push({ name: 'home' });
      } catch (errors) {
        this.login_errors = errors;
      }

      this.loading = false;
    },
  },
};
</script>
