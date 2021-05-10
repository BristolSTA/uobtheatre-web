<template>
  <div>
    <slot></slot>
    <p
      v-if="endCursor || loading"
      ref="bottom-loader"
      class="pb-4 text-4xl text-center"
    >
      <font-awesome-icon icon="circle-notch" class="animate-spin" />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    apolloQuery: {
      required: true,
      type: Object,
    },
    apolloVariables: {
      required: false,
      type: Object,
      default: () => {},
    },
    apolloAfterCursorVariableKey: {
      required: false,
      default: 'afterCursor',
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      endCursor: null,
    }
  },
  watch: {
    loading(newValue) {
      this.$emit('loadingChange', newValue)
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.runQuery()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    async runQuery() {
      this.loading = true

      const defaultVariables = {}
      defaultVariables[this.apolloAfterCursorVariableKey] = this.endCursor

      const result = await this.$apollo.query({
        query: this.apolloQuery,
        variables: Object.assign(defaultVariables, this.apolloVariables),
      })

      this.loading = false

      // Find root query
      const root = Object.keys(result.data)[0]

      // Check for pageInfo
      if (
        !result.data[root].pageInfo ||
        result.data[root].pageInfo.endCursor === undefined ||
        result.data[root].pageInfo.hasNextPage === undefined
      ) {
        throw new Error(
          `endCursor or hasNextPage was not returned for the query "${root}"`
        )
      }
      this.endCursor = result.data[root].pageInfo.hasNextPage
        ? result.data[root].pageInfo.endCursor
        : null

      // Emit with the new data
      this.$emit('newData', result.data[root])
    },
    handleScroll() {
      if (this.loading) return
      const bottomLoaderEl = this.$refs['bottom-loader']
      if (
        bottomLoaderEl &&
        bottomLoaderEl.offsetTop <= window.scrollY + window.innerHeight
      ) {
        this.runQuery()
      }
    },
  },
}
</script>
