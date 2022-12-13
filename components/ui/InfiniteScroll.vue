<template>
  <div>
    <slot />
    <p
      v-if="hasMore"
      ref="bottom-loader"
      data-test="bottom-loader"
      class="pb-4 text-center text-4xl"
    >
      <loading-icon size-class="" />
    </p>
  </div>
</template>

<script>
import LoadingIcon from './UiLoadingIcon.vue';
import { isInViewport } from '@/utils/misc';
export default {
  components: { LoadingIcon },
  props: {
    apolloQuery: {
      required: true,
      type: Object
    },
    apolloVariables: {
      required: false,
      type: Object,
      default: () => {}
    },
    apolloAfterCursorVariableKey: {
      required: false,
      default: 'afterCursor',
      type: String
    }
  },
  data() {
    return {
      loading: false,
      endCursor: null
    };
  },
  computed: {
    hasMore() {
      return this.endCursor || this.loading;
    }
  },
  watch: {
    loading(newValue) {
      this.$emit('loadingChange', newValue);
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.runQuery();
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async runQuery() {
      this.loading = true;

      const defaultVariables = {};
      defaultVariables[this.apolloAfterCursorVariableKey] = this.endCursor;

      const variables = Object.assign(defaultVariables, this.apolloVariables);

      const client = useDefaultApolloClient();
      const { data } = await client.query({
        query: this.apolloQuery,
        variables
      });

      this.loading = false;
      // Find root query
      const root = Object.keys(data)[0];

      // Check for pageInfo
      if (
        !data[root].pageInfo ||
        data[root].pageInfo.endCursor === undefined ||
        data[root].pageInfo.hasNextPage === undefined
      ) {
        throw new Error(
          `endCursor or hasNextPage was not returned for the query "${root}"`
        );
      }
      this.endCursor = data[root].pageInfo.hasNextPage
        ? data[root].pageInfo.endCursor
        : null;

      // Emit with the new data
      this.$emit('newData', data[root]);

      // Check if loader on screen
      if (this.hasMore && isInViewport(this.$refs['bottom-loader'])) {
        this.runQuery();
      }
    },
    handleScroll() {
      if (this.loading) {
        return;
      }
      const bottomLoaderEl = this.$refs['bottom-loader'];
      if (
        bottomLoaderEl &&
        bottomLoaderEl.offsetTop <= window.scrollY + window.innerHeight
      ) {
        this.runQuery();
      }
    }
  }
};
</script>
