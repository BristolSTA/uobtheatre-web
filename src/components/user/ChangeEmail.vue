<template>
  <div>
    <h3 class="text-h3">Change your email</h3>
    NB: Currently INOP
    <!-- <form class="flex flex-col p-6 space-y-2" @submit.prevent="attemptChange">
      <non-field-error :errors="errors" />
      <text-input
        name="New Email"
        type="email"
        :errors="errors"
        required
        v-model="email"
      />
      <text-input
        name="Confirm New Email"
        type="email"
        :errors="errors"
        autocomplete="off"
        required
        v-model="confirmedEmail"
      />
    </form>
    <button
      class="btn btn-orange"
      @click="$emit('cancel')"
      @keypress="$emit('cancel')"
    >
      Cancel
    </button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: null,
      confirmedEmail: null,
    };
  },
};
</script>