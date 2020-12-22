<template>
  <div class="min-h-full flex flex-col items-center justify-evenly">
    <div class="bg-sta-rouge text-white mb-2 p-6 pt-3">
      <h2 class="text-h2">
        Please note the following warnings for this production:
      </h2>

      <ul class="list-disc list-inside">
        <li v-for="(warning, index) in production.warnings" :key="index">
          {{ warning }}
        </li>
      </ul>
    </div>
    <div><button class="btn btn-rouge btn-outline">I Understand</button></div>
  </div>
</template>

<script>
export default {
  props: {
    production: {
      required: true,
    },
  },
};
</script>