<template>
  <div class="flex flex-col items-center min-h-full justify-evenly">
    <div class="p-6 pt-3 mb-2 text-white bg-sta-rouge">
      <h2 class="text-h2">
        Please note the following warnings for this production:
      </h2>

      <ul class="list-disc list-inside">
        <li v-for="(warning, index) in production.warnings" :key="index">
          {{ warning }}
        </li>
      </ul>
    </div>
    <div>
      <button
        class="btn btn-rouge btn-outline"
        @click="onUnderstood"
        @keypress="onUnderstood"
      >
        I Understand
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    production: {
      required: true,
    },
  },
  methods: {
    onUnderstood() {
      this.$emit('understood');
    },
  },
};
</script>