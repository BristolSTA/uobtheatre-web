<template>
  <div class="p-4 text-white rounded-lg bg-sta-gray-light">
    <h2 class="mb-1 text-h3 sm:text-h2"><slot name="title" /></h2>
    <div v-if="subtitle" class="font-semibold text-sta-orange">
      <slot name="subtitle" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'overview-box',
  props: {
    subtitle: {
      defualt: true,
      required: false,
    },
  },
};
</script>
