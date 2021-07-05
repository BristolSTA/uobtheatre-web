<template>
  <div class="relative">
    <div
      v-if="loading"
      ref="loading-overlay"
      class="absolute top-0 z-10 flex items-center justify-center w-full h-full text-3xl text-white bg-sta-gray-dark bg-opacity-95"
    >
      <loading-icon size-class="" />
    </div>
    <slot></slot>
  </div>
</template>

<script>
import LoadingIcon from './LoadingIcon.vue'
export default {
  components: { LoadingIcon },
  props: {
    loading: {
      default: false,
      type: Boolean,
    },
  },
}
</script>
