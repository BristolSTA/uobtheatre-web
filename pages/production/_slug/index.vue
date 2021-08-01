<template>
  <div class="min-h-full bg-sta-gray">
    <div
      v-if="!production"
      class="justify-center py-20 text-xl font-semibold text-center text-white"
    >
      Loading Production...
    </div>
    <template v-else>
      <production-header
        ref="header"
        :production="production"
        @scroll-to-tickets="$refs.performances.$el.scrollIntoView()"
      />
      <hr class="border-t-2 border-sta-gray-dark" />
      <production-cast-credits ref="cast-credits" :production="production" />
      <hr class="border-t-2 border-sta-gray-dark" />
      <production-performances ref="performances" :production="production" />
    </template>
  </div>
</template>

<script>
import ProductionCastCredits from '@/components/production/ProductionCastCredits.vue'
import ProductionHeader from '@/components/production/ProductionHeader.vue'
import ProductionPerformances from '@/components/production/ProductionPerformances.vue'
import ProductionPageQuery from '@/graphql/queries/ProductionBySlug.gql'

export default {
  components: {
    ProductionHeader,
    ProductionCastCredits,
    ProductionPerformances,
  },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: ProductionPageQuery,
      variables: {
        slug: params.slug,
      },
    })

    const production = data.production
    if (!production)
      return error({
        statusCode: 404,
        message: 'This production does not exists',
      })
    return {
      production,
    }
  },
  head() {
    const productionName = this.production ? this.production.name : 'Loading...'
    return {
      title: `${productionName}`,
    }
  },
  computed: {
    route() {
      return this.$route
    },
    crumbs() {
      return [
        { text: 'Whats On', route: '/productions' },
        { text: this.production.name },
      ]
    },
  },
}
</script>
