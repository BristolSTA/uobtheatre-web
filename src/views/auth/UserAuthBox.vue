<template>
  <div class="h-screen bg-sta-gray login-background">
    <div class="flex items-center justify-center h-full">
      <div class="shadow-2xl bg-sta-gray w-80">
        <div class="flex items-center space-x-1 text-center">
          <button
            class="w-1/2 py-3 font-semibold rounded-none focus:outline-none"
            :class="[login ? 'bg-sta-orange' : 'bg-gray-200']"
            @click="login = true"
            @keydown="login = true"
          >
            Login
          </button>
          <button
            class="w-1/2 py-3 font-semibold rounded-none focus:outline-none"
            :class="[login ? 'bg-gray-200' : ' bg-sta-orange']"
            @click="login = false"
            @keydown="login = false"
          >
            Sign Up
          </button>
        </div>
        <div v-if="loading" class="flex items-center space-x-1 text-center">
          <p class="font-semibold text-white">Logging In...</p>
        </div>
        <form
          v-else-if="login"
          class="flex flex-col p-6 space-y-2"
          @submit.prevent="attemptLogin"
        >
          <div v-if="login_err" class="text-sm font-semibold text-sta-rouge">
            <p>Error: Password or Email Is Incorrect</p>
            <a href="/login" class="text-sta-orange">I Forgot My Password</a>
          </div>
          <text-input
            name="Email"
            v-model="email"
            autocomplete="username email"
          />
          <text-input
            name="Password"
            v-model="password"
            input_type="password"
            autocomplete="current-password"
          />
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
            type="submit"
          >
            Log In
          </button>

          <p class="mt-2 text-white">
            <clickable-link @click.prevent="login = false">
              Don't have an account? <strong>Sign Up</strong>
            </clickable-link>
          </p>
        </form>

        <form v-else class="flex flex-col p-6 space-y-2">
          <div class="text-sm font-semibold text-sta-rouge">
            <p>Error: Email already exists</p>
            <p>Error: Password does not match</p>
          </div>
          <text-input name="Full Name" v-model="name" autocomplete="name" />
          <text-input
            name="Email"
            v-model="email"
            autocomplete="username email"
          />
          <text-input
            name="Password"
            v-model="password"
            input_type="password"
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
          </button>

          <p class="mt-2 text-white">
            <clickable-link @click.prevent="login = true">
              Already have an account? <strong>Log In</strong>
            </clickable-link>
          </p>
        </form>
      </div>
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
      loading: false,
      login_err: false,
    };
  },
  methods: {
    attemptLogin() {
      this.loading = true;
      authService
        .login(this.email, this.password, this.remember_me)
        .then(() => {
          alert('Logged in! Cookie set!');
        }, (this.login_err = true));
      this.loading = false;
    },
  },
};
</script>
