<template>
  <auth-page-template>
    <div
      class="w-100 relative p-6 max-w-xs text-center text-white bg-sta-gray shadow-2xl"
    >
      <h1 class="text-h3">Reset your password</h1>
      <form
        class="flex flex-col p-6 pt-0 space-y-2"
        @submit.prevent="attemptReset"
      >
        <non-field-error :errors="errors" />
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
          <button class="btn btn-green mr-2">Reset</button>
        </div>
      </form>
    </div>
  </auth-page-template>
</template>
<script>
import { getValidationErrors, performMutation, successToast } from "@/utils";

import AuthPageTemplate from "@/components/auth/AuthPageTemplate.vue";
import NonFieldError from "@/components/ui/NonFieldError.vue";
import TextInput from "@/components/ui/TextInput.vue";

export default {
  components: { AuthPageTemplate, NonFieldError, TextInput },
  middleware: "not-authed",
  data() {
    return {
      errors: null,
      newPassword: null,
      confirmedNewPassword: null,
    };
  },
  head: {
    title: "Reset your password",
  },
  methods: {
    async attemptReset() {
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: require("@/graphql/mutations/user/AttemptPasswordReset.gql"),
            variables: {
              token: this.$route.params.token,
              newPassword: this.newPassword,
              confirmedNewPassword: this.confirmedNewPassword,
            },
          },
          "passwordReset"
        );
        successToast.fire({ title: "Password Changed!" });
        return this.$router.replace("/login");
      } catch (e) {
        this.errors = getValidationErrors(e);
      }
    },
  },
};
</script>
