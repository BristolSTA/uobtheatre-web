<template>
  <div class="relative w-80 bg-sta-gray shadow-2xl">
    <div role="navigation" class="flex items-center space-x-1">
      <button
        class="py-3 w-1/2 font-semibold rounded-none focus:outline-none"
        :class="[
          props.loginMode
            ? 'bg-sta-orange'
            : 'bg-gray-200 hover:bg-gray-400 text-gray-700'
        ]"
        @click="emit('go-login')"
        @keypress="emit('go-login')"
      >
        Login
      </button>
      <button
        class="py-3 w-1/2 font-semibold rounded-none focus:outline-none"
        :class="[
          props.loginMode
            ? 'bg-gray-200 hover:bg-gray-400 text-gray-700'
            : ' bg-sta-orange'
        ]"
        @click="emit('go-signup')"
        @keypress="emit('go-signup')"
      >
        Sign Up
      </button>
    </div>
    <div
      v-if="loading"
      ref="loading-overlay"
      class="absolute z-10 top-0 flex items-center justify-center w-full h-full text-white text-3xl bg-sta-gray-dark bg-opacity-95"
    >
      <loading-icon size-class="" />
    </div>
    <form
      v-if="props.loginMode"
      class="flex flex-col p-6 space-y-2"
      @submit.prevent="attemptLogin"
    >
      <UiNonFieldError :errors="loginErrors" />
      <span
        v-if="loginErrors && loginErrors.hasCode('not_verified')"
        ref="resendEmail"
        class="cursor-point hover:text-gray-200 underline text-sm cursor-pointer"
        @click="resendVerificationEmail"
      >
        Resend Verification Email?
      </span>
      <text-input
        v-model="email"
        name="Email"
        type="email"
        autocomplete="email username"
        required
        :errors="loginErrors"
      />
      <text-input
        v-model="password"
        name="Password"
        type="password"
        autocomplete="current-password"
        required
        :errors="loginErrors"
      />
      <label for="remember_me" class="flex items-center space-x-2">
        <input
          id="remember_me"
          v-model="rememberMe"
          type="checkbox"
          class="border-sta-grey w-5 h-5 border rounded-sm focus:outline-none"
        />
        <span class="text-white text-xs font-semibold">Remember me?</span>
      </label>

      <button
        class="btn btn-orange btn-outline mt-2 w-full text-center text-xl font-semibold"
        :disabled="!email || !password"
        type="submit"
      >
        Log In
      </button>

      <hr class="border-t-2 border-sta-gray-dark" />

      <p class="mt-2 text-white">
        <clickable-link @click="emit('go-signup')">
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
      <UiNonFieldError :errors="signupErrors" />
      <text-input
        v-if="
          (!signUpDetails.firstName || !signUpDetails.lastName) && !signupErrors
        "
        v-model="signUpDetails.fullName"
        name="Full Name"
        autocomplete="name"
        required
        @blur="guessNameParts"
      />
      <div v-else class="flex flex-col space-y-2">
        <text-input
          v-model="signUpDetails.firstName"
          name="First Name"
          autocomplete="given-name"
          :errors="signupErrors"
          required
        />
        <text-input
          v-model="signUpDetails.lastName"
          name="Last Name"
          autocomplete="family-name"
          required
          :errors="signupErrors"
        />
      </div>
      <text-input
        v-model="email"
        name="Email"
        type="email"
        autocomplete="username email"
        :errors="signupErrors"
        required
      />
      <NuxtLink
        v-if="signupErrors && signupErrors.hasCode('unique')"
        to="/login/forgot"
        class="cursor-point text-center text-sta-orange hover:text-sta-orange-dark underline text-sm cursor-pointer"
      >
        Request password reset?
      </NuxtLink>
      <text-input
        v-model="password"
        name="Password"
        type="password"
        :errors="signupErrors"
        error-key="password1"
        autocomplete="new-password"
        required
      />
      <text-input
        v-model="signUpDetails.confirmedPassword"
        name="Confirm Password"
        type="password"
        :errors="signupErrors"
        autocomplete="new-password"
        error-key="password2"
        required
      />
      <label for="accept_terms" class="flex items-center space-x-2">
        <input
          id="accept_terms"
          v-model="acceptedTerms"
          type="checkbox"
          required
          class="border-sta-grey w-5 h-5 border rounded-sm focus:outline-none"
        />
        <span class="text-white text-xs font-semibold">
          I have read and agree to the
          <NuxtLink
            to="/terms"
            class="hover:text-sta-orange underline transition-colors"
            >Terms of Service</NuxtLink
          >
          and
          <NuxtLink
            to="/privacy"
            class="hover:text-sta-orange underline transition-colors"
            >Privacy Policy</NuxtLink
          >
        </span>
        <error-helper :errors="signupErrors" field-name="acceptedTerms" />
      </label>
      <button
        class="btn btn-orange btn-outline w-full text-center text-xl font-semibold"
        :disabled="!acceptedTerms"
      >
        Sign Up
      </button>

      <p class="mt-2 text-white">
        <clickable-link @click="emit('go-login')">
          Already have an account? <strong>Log In</strong>
        </clickable-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import trim from 'lodash/trim';

import { Ref } from 'vue';
import LoadingIcon from '../ui/UiLoadingIcon.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import ErrorHelper from '@/components/ui/ErrorHelper.vue';

import useAuthStore from '@/store/auth';
import TextInput from '~~/components/ui/Input/UiInputText.vue';
import { catchOnly, getValidationErrors } from '@/utils/api';
import { swalToast } from '@/utils/alerts';
import ValidationError from '@/errors/ValidationError';
import UnverifiedLoginError from '@/errors/auth/UnverifiedLoginError';
import Errors from '@/classes/Errors';

const props = defineProps({
  loginMode: { type: Boolean, default: true }
});

const emit = defineEmits<{
  (event: 'go-login'): void;
  (event: 'go-signup'): void;
}>();

const signUpDetails = reactive({
  fullName: undefined as string | undefined,
  firstName: undefined as string | undefined,
  lastName: undefined as string | undefined,
  confirmedPassword: undefined as string | undefined
});

const email: Ref<string | undefined> = ref(undefined);
const password: Ref<string | undefined> = ref(undefined);

const acceptedTerms = ref(false);
const rememberMe = ref(false);
const loading = ref(false);

const loginErrors: Ref<Errors | undefined> = ref(undefined);
const signupErrors: Ref<Errors | undefined> = ref(undefined);

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

async function attemptLogin() {
  loading.value = true;
  loginErrors.value = undefined;

  if (!email.value || !password.value) return;

  try {
    await authStore.login(email.value, password.value, rememberMe.value);

    // Redirect to intended destination if they were intercepted by middleware
    if (route.query.redirect && !Array.isArray(route.query.redirect)) {
      return router.replace(route.query.redirect).catch((e) => {
        if (!e.message.includes('Redirected when going from')) {
          throw e;
        }
      });
    }

    return router.replace('/');
  } catch (e) {
    catchOnly([ValidationError, UnverifiedLoginError], e, () => {
      loginErrors.value = getValidationErrors(e);
      if (e instanceof UnverifiedLoginError) {
        loginErrors.value.push({
          message: 'Your account has not been verified yet.',
          code: 'not_verified'
        });
      }
    });
  }

  loading.value = false;
}

async function attemptSignup() {
  loading.value = true;
  signupErrors.value = new Errors();

  if (!signUpDetails.firstName || signUpDetails.firstName === '') {
    signupErrors.value.record([
      {
        message: 'Please provide a first name',
        field: 'firstName',
        __typename: 'FieldError'
      }
    ]);
    return (loading.value = false);
  }
  if (!signUpDetails.lastName || signUpDetails.lastName === '') {
    signupErrors.value.record([
      {
        message: 'Please provide a last name',
        field: 'lastName',
        __typename: 'FieldError'
      }
    ]);
    return (loading.value = false);
  }
  if (!email.value || email.value === '') {
    signupErrors.value.record([
      {
        message: 'Please provide a email address',
        field: 'email',
        __typename: 'FieldError'
      }
    ]);
    return (loading.value = false);
  }
  if (!password.value || password.value === '') {
    signupErrors.value.record([
      {
        message: 'Please provide a password',
        field: 'password',
        __typename: 'FieldError'
      }
    ]);
    return (loading.value = false);
  }
  if (
    !signUpDetails.confirmedPassword ||
    signUpDetails.confirmedPassword === ''
  ) {
    signupErrors.value.record([
      {
        message: 'Please retype your password',
        field: 'confirmedPassword',
        __typename: 'FieldError'
      }
    ]);
    return (loading.value = false);
  }

  try {
    await authStore.register(
      signUpDetails.firstName,
      signUpDetails.lastName,
      email.value,
      password.value,
      signUpDetails.confirmedPassword
    );

    swalToast.fire({
      icon: 'success',
      title: 'Account Created',
      text: 'Please check your emails to verify your account',
      showConfirmButton: true,
      position: 'bottom-end'
    });
    return useRouter().push('/');
  } catch (e) {
    signupErrors.value = getValidationErrors(e);
  }

  loading.value = false;
}

function guessNameParts() {
  if (!signUpDetails.fullName) return;
  const components = trim(signUpDetails.fullName).split(' ');
  signUpDetails.firstName = components.shift();
  signUpDetails.lastName = components.join(' ');
}

function resendVerificationEmail() {
  //       this.loading = true;
  //       this.loginErrors = null;
  //       try {
  //         await authService.resendVerificationEmail(this, this.email);
  //         successToast.fire({
  //           title: 'Verfication email sent!',
  //         });
  //       } catch (e) {
  //         this.loginErrors = getValidationErrors(e);
  //       }
  //       this.loading = false;
}

// export default {
//   methods: {
//     async attemptSignup() {
//       this.loading = true;
//       this.signupErrors = null;

//       if (!this.lastName || this.lastName === '') {
//         this.signupErrors = new Errors();
//         this.signupErrors.record([
//           {
//             message: 'Please provider a last name',
//             field: 'lastName',
//             __typename: 'FieldError',
//           },
//         ]);
//         return (this.loading = false);
//       }

//       try {
//         await authService.register(this, {
//           firstName: this.firstName,
//           lastName: this.lastName,
//           email: this.email,
//           password: this.password,
//           confirmedPassword: this.confirmedPassword,
//         });

//         swalToast.fire({
//           icon: 'success',
//           title: 'Account Created',
//           text: 'Please check your emails to verify your account',
//           showConfirmButton: true,
//           position: 'bottom-end',
//         });
//         return this.$router.push('/');
//       } catch (e) {
//         this.signupErrors = getValidationErrors(e);
//       }

//       this.loading = false;
//     },
//     async resendVerificationEmail() {
//       this.loading = true;
//       this.loginErrors = null;
//       try {
//         await authService.resendVerificationEmail(this, this.email);
//         successToast.fire({
//           title: 'Verfication email sent!',
//         });
//       } catch (e) {
//         this.loginErrors = getValidationErrors(e);
//       }
//       this.loading = false;
//     },
//     guessNameParts() {
//       const components = lo.trim(this.fullName).split(' ');
//       this.firstName = components.shift();
//       this.lastName = components.join(' ');
//     },
//   },
// };
</script>
