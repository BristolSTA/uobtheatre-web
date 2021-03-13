<script>
/* eslint-disable vue/no-v-html */
</script>

<template>
  <div
    class="flex flex-col flex-wrap items-center justify-center lg:space-x-10"
  >
    <change-email
      v-if="editingEmail"
      class="md:w-1/4"
      @cancel="editingEmail = false"
    />
    <change-password
      v-else-if="editingPassword"
      class="md:w-1/4"
      @cancel="editingPassword = false"
    />
    <loading-container v-else :loading="loading" class="text-center">
      <form @submit.prevent="attemptUserUpdate">
        <table class="m-4 mx-auto text-left align-text-top">
          <tr>
            <th class="pb-2 pr-6 text-sta-orange" style="min-width: 8rem">
              First Name
            </th>
            <td class="pb-2">
              <p v-if="!editing">{{ user.firstName }}</p>
              <text-input
                v-else
                name="firstName"
                :show-label="false"
                autocomplete="given-name"
                :errors="errors"
                required
                v-model="firstName"
              />
            </td>
          </tr>
          <tr class="pb-4">
            <th class="pb-2 pr-6 text-sta-orange">Last Name</th>
            <td class="pb-2">
              <p v-if="!editing">{{ user.lastName }}</p>
              <text-input
                v-else
                name="lastName"
                :show-label="false"
                autocomplete="family-name"
                required
                :errors="errors"
                v-model="lastName"
              />
            </td>
          </tr>
          <tr class="pb-4">
            <th class="pb-2 pr-6 text-sta-orange">Email</th>
            <td class="pb-2">
              <p v-if="!editing" class="break-all">{{ user.email }}</p>
              <button
                v-else
                class="px-2 py-1 btn btn-orange btn-outline"
                @click="editingEmail = true"
                @keypress="editingEmail = true"
              >
                Change Email
              </button>
            </td>
          </tr>
          <tr>
            <th class="pb-2 pr-6 text-sta-orange">Password</th>
            <td class="pb-2">
              <template v-if="!editing">************</template>
              <button
                v-else
                class="px-2 py-1 btn btn-orange btn-outline"
                @click="editingPassword = true"
                @keypress="editingPassword = true"
              >
                Change Password
              </button>
            </td>
          </tr>
        </table>
        <div v-if="editing" class="m-4 text-center">
          <button class="mr-2 btn btn-green">Save Details</button>
          <button
            class="btn btn-orange"
            @click.prevent="editToggle"
            @keypress.prevent="editToggle"
          >
            Cancel
          </button>
          <p class="mt-2">
            Want to delete your account? Get in touch at
            <span v-html="config.application.support_email"></span>
          </p>
        </div>
      </form>
      <button
        v-if="!editing"
        class="btn btn-rouge btn-outline"
        @click="editToggle"
        @keypress="editToggle"
      >
        Edit Details
      </button>
    </loading-container>
  </div>
</template>

<script>
import TextInput from '@/components/ui/TextInput.vue';
import config from '@/config';
import ChangeEmail from './ChangeEmail.vue';
import ChangePassword from './ChangePassword.vue';
import LoadingContainer from '../ui/LoadingContainer.vue';
import gql from 'graphql-tag';
import { swalToast, performMutation } from '@/utils';
export default {
  name: 'UserDetails',
  components: {
    TextInput,
    ChangePassword,
    ChangeEmail,
    LoadingContainer,
  },
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      editing: false,
      editingEmail: false,
      editingPassword: false,
      firstName: this.user.firstName,
      lastName: this.user.lastName,

      loading: false,
      errors: null,
    };
  },
  computed: {
    config: () => config,
  },
  methods: {
    editToggle() {
      this.editing = !this.editing;
    },
    async attemptUserUpdate() {
      this.loading = true;
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: gql`
          mutation ($firstName: String!, $lastName: String!) {
            updateAccount(firstName: $firstName, lastName: $lastName) {
                ${require('@/graphql/partials/ErrorsPartial').default}
            }
          }
        `,
            variables: {
              firstName: this.firstName,
              lastName: this.lastName,
            },
          },
          'updateAccount'
        );

        swalToast.fire({
          icon: 'success',
          title: 'Details updated!',
          position: 'bottom-end',
        });
      } catch ({ errors }) {
        this.errors = errors;
      }
      this.loading = false;
    },
  },
};
</script>
