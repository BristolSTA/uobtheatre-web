<template>
  <div
    class="w-full bg-sta-gray-lightest rounded-full"
    :class="[`h-${height}`]"
  >
    <div
      class="h-full bg-sta-green rounded-full"
      :style="{ width: `${Math.min(100, percentage)}%` }"
    />
  </div>
</template>

<script>
export default {
  props: {
    percentage: {
      default: 0,
      type: Number,
    },
    height: {
      default: 4,
      type: Number,
    },
  },
};
</script>
