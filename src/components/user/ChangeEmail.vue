<template>
  <div class="text-center">
    <h3 class="text-h3">Change your email</h3>
    <loading-container :loading="loading">
      <non-field-error :errors="errors" />
      <form
        class="flex flex-col p-6 pt-0 space-y-2"
        @submit.prevent="addNewEmail"
      >
        Enter the new email you wish to switch to, and your password.
        <text-input
          name="New Email"
          type="email"
          :errors="errors"
          required
          v-model="email"
        />
        <text-input
          name="Password"
          type="password"
          :errors="errors"
          required
          v-model="password"
        />
        <button class="btn btn-green">Send Verification Email</button>
      </form>
      <button
        class="btn btn-orange"
        @click="$emit('cancel')"
        @keypress="$emit('cancel')"
      >
        Cancel
      </button>
    </loading-container>
  </div>
</template>

<script>
import gql from 'graphql-tag';

import { performMutation, swal } from '@/utils';

import LoadingContainer from '../ui/LoadingContainer.vue';
import NonFieldError from '../ui/NonFieldError.vue';
import TextInput from '../ui/TextInput.vue';
export default {
  components: {
    LoadingContainer,
    TextInput,
    NonFieldError,
  },
  data() {
    return {
      email: null,

      password: null,

      loading: false,
      errors: null,
    };
  },
  methods: {
    async addNewEmail() {
      this.loading = true;
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: gql`
          mutation ($email: String!, $password: String!) {
            sendSecondaryEmailActivation(email: $email, password: $password) {
                ${require('@/graphql/partials/ErrorsPartial').default}
            }
          }
        `,
            variables: {
              email: this.email,
              password: this.password,
            },
          },
          'sendSecondaryEmailActivation'
        );
        swal.fire({
          icon: 'info',
          title: 'Check your email',
          text: `We have sent a verification email to ${this.email}`,
        });
      } catch ({ errors }) {
        this.errors = errors;
      }
      this.loading = false;
    },
  },
};
</script>