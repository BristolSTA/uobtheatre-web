<template>
  <div class="overflow-auto">
    <loading-container :loading="loading">
      <table class="w-full">
        <thead>
          <slot name="head"></slot>
        </thead>
        <tbody>
          <slot></slot>

          <tr v-if="empty && !loading">
            <td colspan="100%" class="py-3 text-center bg-sta-gray-light">
              <h3 class="text-h3">{{ emptyText }}</h3>
            </td>
          </tr>
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
    </loading-container>
  </div>
</template>

<script>
import LoadingContainer from '../LoadingContainer.vue'
import PaginationBar from '../PaginationBar.vue'
export default {
  components: { PaginationBar, LoadingContainer },
  props: {
    pageInfo: {
      default: () => {},
      type: Object,
    },
    emptyText: {
      default: 'No matching data found',
      type: String,
    },
    empty: {
      default: false,
      type: Boolean,
    },
    loading: {
      default: false,
      type: Boolean,
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
