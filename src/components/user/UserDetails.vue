<template>
  <div class="flex flex-wrap items-center justify-center sm:p-8 lg:space-x-10">
    <table class="w-full m-4 text-left align-text-top table-auto lg:w-2/3">
      <tr>
        <th class="pb-2 pr-6 text-sta-orange" style="min-width: 8rem">
          First Name
        </th>
        <td class="pb-2">
          <p v-if="!editing">{{ user.firstName }}</p>
          <text-input
            v-else
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
          <text-input
            v-else
            type="email"
            autocomplete="username email"
            :errors="signup_errors"
            :placeholder="user.email"
            v-model="email"
          />
        </td>
      </tr>
      <tr v-if="editing">
        <th class="pb-2 pr-6 text-sta-orange">Password</th>
        <td class="pb-2">
          <button class="px-2 py-1 btn btn-orange btn-outline">
            Reset Password
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
      <button
        v-if="editing"
        class="btn btn-rouge"
        @click="editToggle"
        @keypress="editToggle"
      >
        Save Details
      </button>
    </div>
  </div>
</template>

<script>
import TextInput from '@/components/ui/TextInput.vue';

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
    };
  },
  methods: {
    editToggle() {
      this.editing = !this.editing;
    },
  },
};
</script>
