<template>
  <loading-container :loading="loading" class="text-center">
    <h3 class="text-h3">Change your password</h3>
    <form
      class="flex flex-col p-6 pt-0 space-y-2"
      @submit.prevent="attemptChange"
    >
      <non-field-error :errors="errors" />
      <text-input
        v-model="currentPassword"
        name="Current Password"
        type="password"
        :errors="errors"
        error-key="old_passowrd"
        autocomplete="current-password"
        required
      />
      <text-input
        v-model="newPassword"
        name="New Password"
        type="password"
        :errors="errors"
        error-key="new_password1"
        autocomplete="new-password"
        required
      />
      <text-input
        v-model="confirmedNewPassword"
        name="Confirm New Password"
        type="password"
        :errors="errors"
        error-key="new_password2"
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
import NonFieldError from '~~/components/ui/UiNonFieldError.vue';
import TextInput from '~~/components/ui/UiTextInput.vue';
import { getValidationErrors, performMutation } from '@/utils/api';
import { swalToast } from '@/utils/alerts';
export default defineNuxtComponent({
  components: {
    LoadingContainer,
    NonFieldError,
    TextInput
  },
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
                ${require('@/graphql/partials/ErrorsPartial').default}
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
});
</script>
