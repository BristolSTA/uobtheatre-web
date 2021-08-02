<template>
  <div class="overflow-auto">
    <table class="w-full">
      <thead>
        <slot name="head"></slot>
      </thead>
      <tbody>
        <slot></slot>
      </tbody>
    </table>
    <div class="flex justify-center mt-3">
      <pagination-bar
        v-if="hasNextPage || hasPreviousPage"
        :has-next-page="hasNextPage"
        :has-previous-page="hasPreviousPage"
        @previousPage="$emit('previousPage')"
        @nextPage="$emit('nextPage')"
      />
    </div>
  </div>
</template>

<script>
import PaginationBar from '../PaginationBar.vue'
export default {
  components: { PaginationBar },
  props: {
    pageInfo: {
      default: () => {},
      type: Object,
    },
    currentCursor: {
      default: null,
      type: [String, Number],
    },
  },
  computed: {
    hasNextPage() {
      return this.pageInfo.hasNextPage
    },
    hasPreviousPage() {
      return this.pageInfo.hasPreviousPage || !!this.currentCursor
    },
  },
}
</script>
