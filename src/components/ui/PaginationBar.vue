<template>
  <nav
    class="relative z-0 inline-flex -space-x-px shadow-sm"
    aria-label="Pagination"
  >
    <button
      class="relative inline-flex items-center px-2 py-2 text-sm font-medium"
      :class="[
        inactiveButtonStyle,
        canGoBackward ? 'cursor-pointer' : 'cursor-default',
      ]"
      @click="previousPage"
      @keypress="previousPage"
    >
      <span class="sr-only">Previous</span>
      <svg
        class="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <button
      v-for="(page, index) in pageDisplay"
      :key="index"
      :disabled="isNaN(page)"
      class="relative inline-flex items-center px-4 py-2 text-sm font-medium"
      :class="[
        page == currentPage ? activeButtonStyle : inactiveButtonStyle,
        isNaN(page) ? 'cursor-default' : 'cursor-pointer',
      ]"
      @click="gotoPage(page)"
      @keypress="gotoPage(page)"
    >
      {{ page }}
    </button>

    <button
      class="relative inline-flex items-center px-2 py-2 text-sm font-medium"
      :class="[
        inactiveButtonStyle,
        canGoForward ? 'cursor-pointer' : 'cursor-default',
      ]"
      @click="nextPage"
      @keypress="nextPage"
    >
      <span class="sr-only">Next</span>
      <svg
        class="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </nav>
</template>

<script>
export default {
  props: {
    numberOfPages: {
      required: true,
    },
    currentPage: {
      required: true,
    },
    numberPagesToDisplay: {
      default: 5,
    },
    activeButtonStyle: {
      default:
        'bg-sta-orange text-gray-700 border border-gray-300 focus:outline-none',
    },
    inactiveButtonStyle: {
      default:
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none',
    },
  },
  computed: {
    canGoBackward() {
      return this.currentPage > 1;
    },
    canGoForward() {
      return this.currentPage != this.numberOfPages;
    },
    pageDisplay() {
      let innerLength = this.numberPagesToDisplay - 2;
      let innerMax = this.numberOfPages - 1;
      let innerMin = 2;
      let current = this.currentPage;

      if (innerLength >= innerMax) innerLength = innerMax - 1;

      let start = current - Math.floor(innerLength / 2);
      start = Math.max(start, innerMin);
      start = Math.min(start, innerMin + innerMax - innerLength - 1);
      let inner = Array.from({ length: innerLength }, (el, i) => start + i);

      if (inner.length) {
        if (inner[0] != 2) inner[0] = '...';
        if (inner[inner.length - 1] != this.numberOfPages - 1)
          inner[inner.length - 1] = '...';
      }

      inner.unshift(1);
      if (this.numberOfPages > 1) inner.push(this.numberOfPages);
      return inner;
    },
  },
  methods: {
    previousPage() {
      if (!this.canGoBackward) return;
      this.$emit('previous-page');
    },
    nextPage() {
      if (!this.canGoForward) return;
      this.$emit('next-page');
    },
    gotoPage(page) {
      if (isNaN(page) || this.currentPage == page) return;
      this.$emit('goto-page', page);
    },
  },
};
</script>