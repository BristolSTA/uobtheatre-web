<template>
  <div class="relative">
    <loading-container :loading="loading">
      <div class="overflow-auto">
        <table class="w-full">
          <thead>
            <slot name="head" />
          </thead>
          <tbody>
            <slot :items="items" />

            <tr v-if="empty && !loading">
              <td colspan="100%" class="py-3 text-center bg-sta-gray-light">
                <h3 class="text-h3">
                  {{ emptyText }}
                </h3>
                <slot name="empty" />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-center mt-3">
          <pagination-bar
            v-if="hasNextPage || hasPreviousPage"
            :has-next-page="hasNextPage"
            :has-previous-page="hasPreviousPage"
            @previous-page="previousPage"
            @next-page="nextPage"
          />
        </div>
      </div>
    </loading-container>
  </div>
</template>

<script>
import LoadingContainer from '../LoadingContainer.vue';
import PaginationBar from '../PaginationBar.vue';
export default {
  components: { PaginationBar, LoadingContainer },
  props: {
    pageInfo: {
      default: () => {},
      type: Object
    },
    items: {
      required: true,
      type: Array
    },
    offset: {
      required: true,
      type: Number
    },
    maxPerPage: {
      default: null,
      type: Number
    },
    emptyText: {
      default: 'No matching data found',
      type: String
    },
    loading: {
      default: false,
      type: Boolean
    }
  },
  emits: ['nextPage', 'update:offset', 'previousPage'],
  computed: {
    hasNextPage() {
      return this.pageInfo.hasNextPage;
    },
    hasPreviousPage() {
      return this.pageInfo.hasPreviousPage || this.offset > 0;
    },
    empty() {
      return !this.items.length;
    }
  },
  methods: {
    nextPage() {
      this.$emit('nextPage');
      this.$emit('update:offset', this.offset + this.items.length);
    },
    previousPage() {
      this.$emit('previousPage');
      this.$emit(
        'update:offset',
        Math.max(0, this.offset - (this.maxPerPage ?? this.items.length))
      );
    }
  }
};
</script>
