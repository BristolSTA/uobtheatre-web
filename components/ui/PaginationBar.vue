<template>
  <nav
    v-if="canGoForward || canGoBackward"
    class="relative z-0 inline-flex shadow-xs -space-x-px"
    aria-label="Pagination"
  >
    <button
      class="relative inline-flex items-center px-2 py-2 text-sm font-medium"
      :class="[
        [canGoBackward ? inactiveButtonStyle : disabledButtonStyle],
        { 'cursor-pointer': canGoBackward }
      ]"
      :disabled="!canGoBackward"
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
    <template v-if="pageDisplay">
      <button
        v-for="(page, index) in pageDisplay"
        :key="index"
        :disabled="isNaN(page)"
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium"
        :class="[
          page == currentPage ? activeButtonStyle : inactiveButtonStyle,
          isNaN(page) ? 'cursor-default' : 'cursor-pointer'
        ]"
        @click="gotoPage(page)"
        @keypress="gotoPage(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      class="relative inline-flex items-center px-2 py-2 text-sm font-medium"
      :class="[
        [canGoForward ? inactiveButtonStyle : disabledButtonStyle],
        { 'cursor-pointer': canGoForward }
      ]"
      :disabled="!canGoForward"
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
    disabled: {
      type: Boolean,
      default: false
    },
    pageInfo: {
      type: Object,
      default: null
    },
    hasNextPage: {
      default: undefined,
      type: Boolean
    },
    hasPreviousPage: {
      default: undefined,
      type: Boolean
    },
    numberOfPages: {
      default: null,
      type: Number
    },
    currentPage: {
      default: null,
      type: Number
    },
    currentOffset: {
      default: null,
      type: Number
    },
    numberPagesToDisplay: {
      default: 5,
      type: Number
    },
    activeButtonStyle: {
      default:
        'bg-sta-orange text-gray-700 border border-gray-300 focus:outline-hidden',
      type: String
    },
    inactiveButtonStyle: {
      default:
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200 focus:outline-hidden',
      type: String
    },
    disabledButtonStyle: {
      default:
        'cursor-default bg-black/70 text-gray-300 border border-gray-300',
      type: String
    }
  },
  emits: ['previousPage', 'nextPage', 'gotoPage'],
  computed: {
    canGoBackward() {
      return (
        !this.disabled &&
        (this.hasPreviousPage || this.currentPage > 1 || this.currentOffset)
      );
    },
    canGoForward() {
      return (
        !this.disabled &&
        (this.hasNextPage ||
          this.currentPage !== this.numberOfPages ||
          (this.pageInfo && this.pageInfo.hasNextPage))
      );
    },
    pageDisplay() {
      if (!this.numberOfPages) {
        return null;
      }
      let innerLength = this.numberPagesToDisplay - 2;
      const innerMax = this.numberOfPages - 1;
      const innerMin = 2;
      const current = this.currentPage;

      if (innerLength >= innerMax) {
        innerLength = innerMax - 1;
      }

      let start = current - Math.floor(innerLength / 2);
      start = Math.max(start, innerMin);
      start = Math.min(start, innerMin + innerMax - innerLength - 1);
      const inner = Array.from({ length: innerLength }, (_, i) => start + i);

      if (inner.length) {
        if (inner[0] !== 2) {
          inner[0] = '...';
        }
        if (inner[inner.length - 1] !== this.numberOfPages - 1) {
          inner[inner.length - 1] = '...';
        }
      }

      inner.unshift(1);
      if (this.numberOfPages > 1) {
        inner.push(this.numberOfPages);
      }
      return inner;
    }
  },
  methods: {
    previousPage() {
      if (!this.canGoBackward && !this.disabled) {
        return;
      }
      this.$emit('previousPage');
    },
    nextPage() {
      if (!this.canGoForward && !this.disabled) {
        return;
      }
      this.$emit('nextPage');
    },
    gotoPage(page) {
      if (isNaN(page) || this.currentPage === page) {
        return;
      }
      this.$emit('gotoPage', page);
    }
  }
};
</script>
