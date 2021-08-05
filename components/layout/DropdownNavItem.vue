<template>
  <div class="relative">
    <button
      class="
        flex flex-row
        items-center
        w-full
        px-4
        py-2
        mt-2
        font-semibold
        text-left text-white
        bg-transparent
        rounded-lg
        bg-sta-gray-light
        md:w-auto md:inline md:mt-0 md:ml-4
        hover:text-gray-900 hover:bg-gray-200
        focus:outline-none focus:shadow-outline
      "
      @click.stop="open = !open"
      @keypress.stop="open = !open"
    >
      <slot></slot>
      <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        :class="{ 'rotate-180': open, 'rotate-0': !open }"
        class="
          inline
          w-4
          h-4
          mt-1
          ml-1
          transition-transform
          duration-200
          transform
          md:-mt-1
        "
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <transition name="fade">
      <div
        v-show="open"
        class="
          right-0
          z-10
          w-full
          mt-2
          origin-top-right
          md:absolute md:max-w-screen-sm md:w-screen
        "
        @click.stop
      >
        <div class="px-2 py-2 bg-white rounded-md shadow-lg">
          <slot name="content" :open="open"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
    }
  },
  watch: {
    $route() {
      this.open = false
    },
  },
  mounted() {
    document.addEventListener('click', this.hideMenu)
  },
  destroyed() {
    document.removeEventListener('click', this.hideMenu)
  },
  methods: {
    hideMenu() {
      this.open = false
    },
  },
}
</script>
