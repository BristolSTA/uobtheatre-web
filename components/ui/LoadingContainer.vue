<template>
  <div class="relative">
    <div
      v-if="loading"
      ref="loading-overlay"
      :class="{ 'absolute bg-sta-gray-dark bg-opacity-95': showContent }"
      class="top-0 z-10 flex flex-col items-center justify-center w-full h-full py-6 text-white "
    >
      <loading-icon :size-class="loaderIconSize" class="text-3xl" />
      <slot name="overlay"></slot>
    </div>
    <slot v-if="showContent"></slot>
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
    hideContentWhenLoading: {
      default: false,
      type: Boolean,
    },
    loaderIconSize: {
      default: '',
      type: String,
    },
  },
  computed: {
    showContent() {
      return !this.loading || !this.hideContentWhenLoading
    },
  },
}
</script>
