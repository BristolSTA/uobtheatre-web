<template>
  <div class="relative shadow-2xl bg-sta-gray w-80">
    <div role="navigation" class="flex items-center space-x-1">
      <button
        class="w-1/2 py-3 font-semibold rounded-none focus:outline-none"
        :class="[
          login
            ? 'bg-sta-orange'
            : 'bg-gray-200 hover:bg-gray-400 text-gray-700',
        ]"
        @click="$emit('go-login')"
        @keypress="$emit('go-login')"
      >
        Login
      </button>
      <button
        class="w-1/2 py-3 font-semibold rounded-none focus:outline-none"
        :class="[
          login
            ? 'bg-gray-200 hover:bg-gray-400 text-gray-700'
            : ' bg-sta-orange',
        ]"
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
      <loading-icon size-class="" />
    </div>
    <form
      v-if="login"
      class="flex flex-col p-6 space-y-2"
      @submit.prevent="attemptLogin"
    >
      <non-field-error :errors="login_errors" />
      <text-input
        v-model="email"
        name="Email"
        type="email"
        autocomplete="email"
        required
        :errors="login_errors"
      />
      <text-input
        v-model="password"
        name="Password"
        type="password"
        autocomplete="current-password"
        required
        :errors="login_errors"
      />
      <label for="remember_me" class="flex items-center space-x-2">
        <input
          id="remember_me"
          v-model="remember_me"
          type="checkbox"
          class="w-5 h-5 border rounded-sm border-sta-grey focus:outline-none"
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
        <NuxtLink
          to="/login/forgot"
          class="text-sta-orange hover:text-sta-orange-dark"
        >
          Forgot your password?
        </NuxtLink>
      </p>
    </form>

    <form
      v-else
      class="flex flex-col p-6 space-y-2"
      @submit.prevent="attemptSignup"
    >
      <non-field-error :errors="signup_errors" />
      <text-input
        v-if="(!firstName || !lastName) && !signup_errors"
        v-model="fullName"
        name="Full Name"
        autocomplete="name"
        required
        @blur="guessNameParts"
      />
      <div v-else class="flex flex-col space-y-2">
        <text-input
          v-model="firstName"
          name="First Name"
          autocomplete="given-name"
          :errors="signup_errors"
          required
        />
        <text-input
          v-model="lastName"
          name="Last Name"
          autocomplete="family-name"
          required
          :errors="signup_errors"
        />
      </div>
      <text-input
        v-model="email"
        name="Email"
        type="email"
        autocomplete="username email"
        :errors="signup_errors"
        required
      />
      <text-input
        v-model="password"
        name="Password"
        type="password"
        :errors="signup_errors"
        error-key="password1"
        autocomplete="new-password"
        required
      />
      <text-input
        v-model="confirmedPassword"
        name="Confirm Password"
        type="password"
        :errors="signup_errors"
        autocomplete="new-password"
        error-key="password2"
        required
      />
      <label for="accept_terms" class="flex items-center space-x-2">
        <input
          id="accept_terms"
          v-model="accepted_terms"
          type="checkbox"
          required
          class="w-5 h-5 border rounded-sm border-sta-grey focus:outline-none"
        />
        <span class="text-xs font-semibold text-white">
          I have read and agree to the Terms of Use
          <!-- TODO: Link to ToS -->
        </span>
        <error-helper :errors="signup_errors" field-name="acceptedTerms" />
      </label>
      <button
        class="w-full text-xl font-semibold text-center btn btn-orange btn-outline"
        :disabled="!accepted_terms"
      >
        Sign Up
      </button>

      <p class="mt-2 text-white">
        <clickable-link @click="$emit('go-login')">
          Already have an account? <strong>Log In</strong>
        </clickable-link>
      </p>
    </form>
  </div>
</template>

<script>
import lo from 'lodash'

import ClickableLink from '@/components/ui/ClickableLink.vue'
import ErrorHelper from '@/components/ui/ErrorHelper.vue'
import NonFieldError from '@/components/ui/NonFieldError.vue'
import TextInput from '@/components/ui/TextInput.vue'
import { authService } from '@/services'
import { getValidationErrors, swalToast } from '@/utils'
import LoadingIcon from '../ui/LoadingIcon.vue'

export default {
  name: 'UserAuthBox',
  components: {
    ClickableLink,
    TextInput,
    ErrorHelper,
    NonFieldError,
    LoadingIcon,
  },
  props: {
    login: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      fullName: null,
      firstName: null,
      lastName: null,
      password: null,
      confirmedPassword: null,
      email: null,
      accepted_terms: false,
      remember_me: false,
      authService,
      loading: false,

      login_errors: null,
      signup_errors: null,
    }
  },
  methods: {
    async attemptLogin() {
      this.loading = true
      this.login_errors = null

      try {
        await authService.login(
          this,
          this.email,
          this.password,
          this.remember_me
        )

        // Redirect to intended if has
        if (this.$route.query.redirect) {
          return this.$router.push(this.$route.query.redirect)
        }

        return this.$router.push('/')
      } catch (e) {
        this.login_errors = getValidationErrors(e)
      }

      this.loading = false
    },
    async attemptSignup() {
      this.loading = true
      this.signup_errors = null

      try {
        await authService.register(this, {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          confirmedPassword: this.confirmedPassword,
        })

        swalToast.fire({
          icon: 'success',
          title: 'Account Created',
          text: 'Please check your emails to verify your account',
          showConfirmButton: true,
          position: 'bottom-end',
        })
        return this.$router.push({ name: 'home' })
      } catch (e) {
        this.signup_errors = getValidationErrors(e)
      }

      this.loading = false
    },
    guessNameParts() {
      const components = lo.trim(this.fullName).split(' ')
      this.firstName = components.shift()
      this.lastName = components.join(' ')
    },
  },
}
</script>
