<template>
  <div class="text-center">
    <h3 class="text-h3">Change your email</h3>
    <loading-container :loading="loading">
      <UiNonFieldError :errors="errors" />
      <form
        class="flex flex-col p-6 pt-2 space-y-2"
        @submit.prevent="addNewEmail"
      >
        <text-input
          v-model="email"
          name="New Email"
          type="email"
          placeholder="New Email"
          :errors="errors"
          error-key="email"
          required
        />
        <text-input
          v-model="password"
          name="Password"
          type="password"
          placeholder="Password"
          :errors="errors"
          error-key="password"
          required
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

import LoadingContainer from '../ui/LoadingContainer.vue';
import TextInput from '../ui/Input/UiInputText.vue';
import { getValidationErrors, performMutation } from '@/utils/api';
import { swal } from '@/utils/alerts';
import ErrorsPartial from '@/graphql/partials/ErrorsPartial';
export default {
  components: {
    LoadingContainer,
    TextInput
  },
  emits: ['cancel'],
  data() {
    return {
      email: null,

      password: null,

      loading: false,
      errors: null
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
                ${ErrorsPartial}
            }
          }
        `,
            variables: {
              email: this.email,
              password: this.password
            }
          },
          'sendSecondaryEmailActivation'
        );
        swal.fire({
          icon: 'info',
          title: 'Check your email',
          text: `We have sent a verification email to ${this.email}`
        });
      } catch (e) {
        this.errors = getValidationErrors(e);
      }
      this.loading = false;
    }
  }
};
</script>
