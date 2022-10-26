<template>
  <div class="relative">
    <button
      class="focus:shadow-outline flex flex-row items-center mt-2 px-4 py-2 w-full text-left hover:text-gray-900 text-white font-semibold hover:bg-gray-200 bg-sta-gray-light bg-transparent rounded-lg focus:outline-none md:inline md:ml-4 md:mt-0 md:w-auto"
      @click.stop="open = !open"
      @keypress.stop="open = !open"
    >
      <slot />
      <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        :class="{ 'rotate-180': open, 'rotate-0': !open }"
        class="inline ml-1 mt-1 w-4 h-4 transform transition-transform duration-200 md:-mt-1"
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
        class="z-10 right-0 mt-2 w-full origin-top-right md:absolute md:w-screen md:max-w-screen-sm"
        @click.stop
      >
        <div class="px-2 py-2 bg-white rounded-md shadow-lg">
          <slot name="content" :open="open" />
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
    };
  },
  watch: {
    $route() {
      this.open = false;
    },
  },
  mounted() {
    document.addEventListener('click', this.hideMenu);
  },
  destroyed() {
    document.removeEventListener('click', this.hideMenu);
  },
  methods: {
    hideMenu() {
      this.open = false;
    },
  },
};
</script>
