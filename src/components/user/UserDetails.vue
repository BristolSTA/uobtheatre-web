<script>
/* eslint-disable vue/no-v-html */
</script>

<template>
  <div
    class="flex flex-col flex-wrap items-center justify-center sm:p-8 lg:space-x-10"
  >
    <table class="m-4 text-left align-text-top">
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
            :errors="signup_errors"
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
            :errors="signup_errors"
            v-model="lastName"
          />
        </td>
      </tr>
      <tr class="pb-4">
        <th class="pb-2 pr-6 text-sta-orange">Email</th>
        <td class="pb-2">
          <p v-if="!editing" class="break-all">{{ user.email }}</p>
          <button v-else class="px-2 py-1 btn btn-orange btn-outline">
            Change Email
          </button>
        </td>
      </tr>
      <tr v-if="editing">
        <th class="pb-2 pr-6 text-sta-orange">Password</th>
        <td class="pb-2">
          <button class="px-2 py-1 btn btn-orange btn-outline">
            Change Password
          </button>
        </td>
      </tr>
    </table>
    <div class="m-4">
      <button
        v-if="!editing"
        class="btn btn-rouge btn-outline"
        @click="editToggle"
        @keypress="editToggle"
      >
        Edit Details
      </button>
      <div v-else class="text-center">
        <button
          class="btn btn-rouge"
          @click="editToggle"
          @keypress="editToggle"
        >
          Save Details
        </button>
        <button
          class="ml-2 btn btn-orange"
          @click="editToggle"
          @keypress="editToggle"
        >
          Cancel
        </button>
        <p class="mt-2">
          Want to delete your account? Get in touch at
          <span v-html="config.application.support_email"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from '@/components/ui/TextInput.vue';
import config from '@/config';
export default {
  name: 'UserDetails',
  components: {
    TextInput,
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
      firstName: null,
      lastName: null,
    };
  },
  computed: {
    config: () => config,
  },
  methods: {
    editToggle() {
      this.editing = !this.editing;
    },
  },
};
</script>
