<template>
  <loading-container :loading="loading" class="text-center">
    <h3 class="text-h3">Change your password</h3>
    <form
      class="flex flex-col p-6 pt-2 space-y-2"
      @submit.prevent="attemptChange"
    >
      <UiNonFieldError :errors="errors" />
      <text-input
        v-model="currentPassword"
        name="Current Password"
        type="password"
        placeholder="Current Password"
        :errors="errors"
        error-key="oldPassowrd"
        autocomplete="current-password"
        required
      />
      <text-input
        v-model="newPassword"
        name="New Password"
        type="password"
        placeholder="New Password"
        :errors="errors"
        error-key="newPassword1"
        autocomplete="new-password"
        required
      />
      <text-input
        v-model="confirmedNewPassword"
        name="Confirm New Password"
        type="password"
        placeholder="Confirm New Password"
        :errors="errors"
        error-key="newPassword2"
        autocomplete="new-password"
        required
      />
      <div>
        <button class="btn btn-green mr-2">Update</button>
        <button
          class="btn btn-orange"
          @click.prevent="$emit('cancel')"
          @keypress.prevent="$emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </form>
  </loading-container>
</template>

<script>
import gql from 'graphql-tag';

import LoadingContainer from '@/components/ui/LoadingContainer.vue';

import TextInput from '~~/components/ui/Input/UiInputText.vue';
import { getValidationErrors, performMutation } from '@/utils/api';
import { swalToast } from '@/utils/alerts';
import ErrorsPartial from '@/graphql/partials/ErrorsPartial';
export default {
  components: {
    LoadingContainer,
    TextInput
  },
  emits: ['cancel'],
  data() {
    return {
      loading: false,
      currentPassword: null,
      newPassword: null,
      confirmedNewPassword: null,
      errors: null
    };
  },
  methods: {
    async attemptChange() {
      this.loading = true;
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: gql`
          mutation ($currentPassword: String!, $newPassword: String!, $confirmedNewPassword: String!) {
            passwordChange(oldPassword: $currentPassword, newPassword1: $newPassword, newPassword2: $confirmedNewPassword) {
                ${ErrorsPartial}
            }
          }
        `,
            variables: {
              currentPassword: this.currentPassword,
              newPassword: this.newPassword,
              confirmedNewPassword: this.confirmedNewPassword
            }
          },
          'passwordChange'
        );
        swalToast.fire({
          icon: 'success',
          title: 'Password Changed',
          position: 'bottom-end'
        });
        this.$emit('cancel');
      } catch (e) {
        this.errors = getValidationErrors(e);
      }
      this.loading = false;
    }
  }
};
</script>
