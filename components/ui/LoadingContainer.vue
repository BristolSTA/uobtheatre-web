<template>
  <div class="relative">
    <div
      v-if="loading"
      ref="loading-overlay"
      :class="{ 'absolute bg-sta-gray-dark bg-opacity-95': showContent }"
      class="
        z-10
        top-0
        flex
        items-center
        justify-center
        py-6
        w-full
        h-full
        text-white text-3xl
      "
    >
      <loading-icon :size-class="loaderIconSize" />
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
