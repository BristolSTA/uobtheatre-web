<template>
  <div
    class="flex flex-col flex-wrap items-center justify-center lg:space-x-10"
  >
    <change-email
      v-if="editingEmail"
      class="md:w-1/2 xl:w-1/3"
      @cancel="editingEmail = false"
    />
    <change-password
      v-else-if="editingPassword"
      class="md:w-1/2 xl:w-1/3"
      @cancel="editingPassword = false"
    />
    <loading-container v-else :loading="loading" class="text-center">
      <form @submit.prevent="attemptUserUpdate">
        <table class="align-text-top m-4 mx-auto text-left">
          <tr>
            <th class="pb-2 pr-6 text-sta-orange" style="min-width: 8rem">
              First Name
            </th>
            <td class="pb-2">
              <p v-if="!editing">
                {{ user.firstName }}
              </p>
              <text-input
                v-else
                v-model="firstName"
                name="firstName"
                :show-label="false"
                autocomplete="given-name"
                :errors="errors"
                required
              />
            </td>
          </tr>
          <tr class="pb-4">
            <th class="pb-2 pr-6 text-sta-orange">Last Name</th>
            <td class="pb-2">
              <p v-if="!editing">
                {{ user.lastName }}
              </p>
              <text-input
                v-else
                v-model="lastName"
                name="lastName"
                :show-label="false"
                autocomplete="family-name"
                required
                :errors="errors"
              />
            </td>
          </tr>
          <tr class="pb-4">
            <th class="pb-2 pr-6 text-sta-orange">Email</th>
            <td class="pb-2">
              <p v-if="!editing" class="break-all">
                {{ user.email }}
              </p>
              <button
                v-else
                class="btn btn-orange btn-outline px-2 py-1"
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
              <template v-if="!editing"> ************ </template>
              <button
                v-else
                class="btn btn-orange btn-outline px-2 py-1"
                @click="editingPassword = true"
                @keypress="editingPassword = true"
              >
                Change Password
              </button>
            </td>
          </tr>
        </table>
        <div v-if="editing" class="m-4 text-center">
          <UiNonFieldError class="pb-2" :errors="errors" />
          <button class="btn btn-green mr-2">Save Details</button>
          <button
            class="btn btn-orange"
            @click.prevent="editToggle"
            @keypress.prevent="editToggle"
          >
            Cancel
          </button>
          <p class="mt-2">
            Want to delete your account? Get in touch at
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="useAppConfig().support_email" />
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
import gql from 'graphql-tag';
import LoadingContainer from '../ui/LoadingContainer.vue';
import NonFieldError from '../ui/UiNonFieldError.vue';
import ChangeEmail from './ChangeEmail.vue';
import ChangePassword from './ChangePassword.vue';
import TextInput from '~~/components/ui/Input/UiInputText.vue';
import { swalToast } from '@/utils/alerts';
import { performMutation, getValidationErrors } from '@/utils/api';
import ErrorsPartial from '@/graphql/partials/ErrorsPartial';
export default defineNuxtComponent({
  name: 'UserDetails',
  components: {
    TextInput,
    ChangePassword,
    ChangeEmail,
    LoadingContainer,
    NonFieldError
  },
  props: {
    user: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      editing: false,
      editingEmail: false,
      editingPassword: false,
      firstName: this.user.firstName,
      lastName: this.user.lastName,

      loading: false,
      errors: null
    };
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
                ${ErrorsPartial}
            }
          }
        `,
            variables: {
              firstName: this.firstName,
              lastName: this.lastName
            }
          },
          'updateAccount'
        );

        swalToast.fire({
          icon: 'success',
          title: 'Details updated!',
          position: 'bottom-end'
        });
        this.user.firstName = this.firstName;
        this.user.lastName = this.lastName;
        this.editing = false;
      } catch (e) {
        this.errors = getValidationErrors(e);
      }
      this.loading = false;
    }
  }
});
</script>
