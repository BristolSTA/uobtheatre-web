<template>
  <div
    class="flex items-center justify-center p-6 min-h-full text-white bg-sta-gray"
  >
    <div class="relative text-center">
      <template v-if="!addedOk && loading">
        <h1 class="text-h3">Adding email...</h1>
        <div>
          <loading-icon size-class="text-h1" />
        </div>
      </template>
      <template v-else-if="addedOk">
        <h1 class="text-h3">Complete email change</h1>
        <p>
          To complete the change of your account's email, enter your password
          below
        </p>
        <loading-container :loading="loading">
          <form class="p-6" @submit.prevent="finishSwap">
            <UiNonFieldError :errors="errors" />
            <text-input
              v-model="password"
              name="Password"
              type="password"
              :errors="errors"
              error-key="password"
              autocomplete="current-password"
              required
              class="mt-4"
            />
            <button class="btn btn-green mt-4">Complete Change</button>
          </form>
        </loading-container>
      </template>
      <template v-else>
        <font-awesome-icon class="text-sta-rouge text-h1" icon="times-circle" />
        <h1 class="text-h3">There was an error activating this email</h1>
        <p>This activation has either expired or doesn't exist!</p>
      </template>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag';

import LoadingContainer from '@/components/ui/LoadingContainer.vue';

import TextInput from '~~/components/ui/Input/UiInputText.vue';
import LoadingIcon from '~~/components/ui/UiLoadingIcon.vue';

import { getValidationErrors, performMutation } from '~~/utils/api';
import { swalToast } from '~~/utils/alerts';

import ErrorsPartial from '@/graphql/partials/ErrorsPartial';
export default defineNuxtComponent({
  components: {
    NonFieldError,
    TextInput,
    LoadingContainer,
    LoadingIcon
  },
  middleware: 'authed',
  data() {
    return {
      password: null,
      addedOk: false,
      loading: true
    };
  },
  head: {
    title: 'Change Email'
  },
  async mounted() {
    try {
      await performMutation(
        this.$apollo,
        {
          mutation: gql`
          mutation ($token: String!) {
            verifySecondaryEmail(token: $token) {
                ${ErrorsPartial}
            }
          }
        `,
          variables: {
            token: this.$route.params.token
          }
        },
        'verifySecondaryEmail'
      );
      this.addedOk = true;
    } catch (e) {
      this.addedOk = false;
    }
    this.loading = false;
  },
  methods: {
    async finishSwap() {
      this.loading = true;
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: gql`
            mutation ($password: String!) {
              swapEmails(password: $password) {
                  ${ErrorsPartial}
              }
            }
          `,
            variables: {
              password: this.password
            }
          },
          'swapEmails'
        );

        await performMutation(
          this.$apollo,
          {
            mutation: gql`
            mutation ($password: String!) {
              removeSecondaryEmail(password: $password) {
                  ${ErrorsPartial}
              }
            }
          `,
            variables: {
              password: this.password
            }
          },
          'removeSecondaryEmail'
        );

        swalToast.fire({
          position: 'bottom-end',
          icon: 'success',
          title: 'Email changed!'
        });
        return this.$router.replace('/user');
      } catch (e) {
        this.errors = getValidationErrors(e);
      }
      this.loading = false;
    }
  }
});
</script>
