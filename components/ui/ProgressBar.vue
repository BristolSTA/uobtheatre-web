<template>
  <div
    class="w-full rounded-full bg-sta-gray-lightest"
    :class="[`h-${height}`]"
  >
    <div
      class="h-full rounded-full bg-sta-green"
      :style="{ width: `${Math.min(100, percentage)}%` }"
    ></div>
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
}
</script>
