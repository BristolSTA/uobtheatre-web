<template>
  <div class="relative">
    <div
      v-if="loading"
      ref="loading-overlay"
      class="
        absolute
        top-0
        z-10
        flex
        items-center
        justify-center
        w-full
        h-full
        text-3xl text-white
        bg-sta-gray-dark bg-opacity-95
      "
    >
      <font-awesome-icon class="animate-spin" icon="circle-notch" />
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      default: false,
      type: Boolean,
    },
  },
}
</script>
